import { after, before, test } from "node:test";
import assert from "node:assert/strict";
import { mkdtemp, mkdir, writeFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";

let worker, directory;
const bytes = Buffer.from(Array.from({ length: 4096 }, (_, i) => i % 256));
const video = "/images/projects/callstack/demo.mp4";
before(async () => {
  directory = await mkdtemp(join(tmpdir(), "portfolio-worker-test-"));
  await mkdir(join(directory, "images/projects/callstack"), {
    recursive: true,
  });
  await writeFile(join(directory, video), bytes);
  await writeFile(join(directory, "index.html"), "<h1>Portfolio</h1>");
  await writeFile(join(directory, "404.html"), "<h1>Not found</h1>");
  process.env.WRANGLER_LOG_PATH = join(directory, "wrangler.log");
  const { unstable_dev } = await import("wrangler");
  worker = await unstable_dev("worker.mjs", {
    config: "wrangler.jsonc",
    assets: directory,
    port: 0,
    local: true,
    persist: false,
    logLevel: "none",
    experimental: {
      disableExperimentalWarning: true,
      disableDevRegistry: true,
      watch: false,
    },
  });
});
after(async () => {
  await worker?.stop();
  if (directory) await rm(directory, { recursive: true, force: true });
});

test("video ranges preserve exact bytes for cold and cached requests", async () => {
  for (const [range, start, end] of [
    ["bytes=0-15", 0, 15],
    ["bytes=1000-", 1000, 4095],
    ["bytes=-12", 4084, 4095],
  ]) {
    const response = await worker.fetch(video, { headers: { Range: range } });
    assert.equal(response.status, 206);
    assert.equal(
      response.headers.get("Content-Range"),
      `bytes ${start}-${end}/4096`,
    );
    assert.match(response.headers.get("Cache-Control"), /must-revalidate/);
    assert.deepEqual(
      Buffer.from(await response.arrayBuffer()),
      bytes.subarray(start, end + 1),
    );
  }
});
test("unsatisfiable ranges return 416 and stale If-Range returns the complete video", async () => {
  const invalid = await worker.fetch(video, {
    headers: { Range: "bytes=5000-" },
  });
  assert.equal(invalid.status, 416);
  await invalid.arrayBuffer();
  const changed = await worker.fetch(video, {
    headers: { Range: "bytes=0-15", "If-Range": '"previous-video"' },
  });
  assert.equal(changed.status, 200);
  assert.deepEqual(Buffer.from(await changed.arrayBuffer()), bytes);
});
test("ordinary videos, HEAD requests, and custom 404 pages retain static behavior", async () => {
  const full = await worker.fetch(video);
  assert.equal(full.status, 200);
  assert.deepEqual(Buffer.from(await full.arrayBuffer()), bytes);
  const head = await worker.fetch(video, { method: "HEAD" });
  assert.equal(head.status, 200);
  assert.equal((await head.arrayBuffer()).byteLength, 0);
  const missing = await worker.fetch("/missing/");
  assert.equal(missing.status, 404);
  assert.match(await missing.text(), /Not found/);
});

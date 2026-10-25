import { after, before, test } from "node:test";
import assert from "node:assert/strict";
import { mkdtemp, mkdir, writeFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import { readFile } from "node:fs/promises";

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
  const { createTestHarness } = await import("wrangler");
  const configPath = join(directory, "wrangler.jsonc");
  const config = (await readFile("wrangler.jsonc", "utf8"))
    .replace('"./worker.mjs"', JSON.stringify(resolve("worker.mjs")))
    .replace('"./out"', JSON.stringify(directory));
  await writeFile(configPath, config);
  worker = createTestHarness({ workers: [{ configPath }] });
  await worker.listen();
}, { timeout: 30_000 });
after(async () => {
  await worker?.close();
  if (directory) await rm(directory, { recursive: true, force: true, maxRetries: 3 });
});

function request(path, options = {}) {
  return worker.fetch(path, { ...options, signal: AbortSignal.timeout(10_000) });
}

test("video ranges preserve exact bytes for cold and cached requests", { timeout: 30_000 }, async () => {
  for (const [range, start, end] of [
    ["bytes=0-15", 0, 15],
    ["bytes=1000-", 1000, 4095],
    ["bytes=-12", 4084, 4095],
  ]) {
    const response = await request(video, { headers: { Range: range } });
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
test("unsatisfiable ranges return 416 and stale If-Range returns the complete video", { timeout: 30_000 }, async () => {
  const invalid = await request(video, {
    headers: { Range: "bytes=5000-" },
  });
  assert.equal(invalid.status, 416);
  await invalid.arrayBuffer();
  const changed = await request(video, {
    headers: { Range: "bytes=0-15", "If-Range": '"previous-video"' },
  });
  assert.equal(changed.status, 200);
  assert.deepEqual(Buffer.from(await changed.arrayBuffer()), bytes);
});
test("ordinary videos, HEAD requests, and custom 404 pages retain static behavior", { timeout: 30_000 }, async () => {
  const full = await request(video);
  assert.equal(full.status, 200);
  assert.deepEqual(Buffer.from(await full.arrayBuffer()), bytes);
  const head = await request(video, { method: "HEAD" });
  assert.equal(head.status, 200);
  assert.equal((await head.arrayBuffer()).byteLength, 0);
  const missing = await request("/missing/");
  assert.equal(missing.status, 404);
  assert.match(await missing.text(), /Not found/);
});

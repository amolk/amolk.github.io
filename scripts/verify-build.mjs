import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import assert from "node:assert/strict";
import { load } from "cheerio";
import projectsData from "../_data/projects.mjs";
const walk = (dir) =>
  fs
    .readdirSync(dir, { withFileTypes: true })
    .flatMap((f) =>
      f.isDirectory() ? walk(path.join(dir, f.name)) : [path.join(dir, f.name)],
    );
const projects = await projectsData();
const expected = [
  "index.html",
  "projects/index.html",
  "about/index.html",
  "publications/index.html",
  "404.html",
  "404/index.html",
  ...projects.visible.map((p) => `${p.url.slice(1)}index.html`),
  ...projects.tags.map((t) => `${t.url.slice(1)}index.html`),
];
assert.deepEqual(
  walk("out")
    .filter((f) => f.endsWith(".html"))
    .map((f) => f.slice(4))
    .sort(),
  expected.sort(),
  "Generated routes",
);
for (const file of expected) {
  const $ = load(fs.readFileSync(`out/${file}`, "utf8"));
  assert.ok($("title").first().text(), `${file}: page title`);
  assert.equal(
    $('script[src*="_next"]').length,
    0,
    `${file}: stale framework runtime`,
  );
  for (const element of $(
    "a[href],img[src],script[src],link[rel=stylesheet],video source",
  ).toArray()) {
    const value = $(element).attr("href") ?? $(element).attr("src");
    if (!value?.startsWith("/") || value.startsWith("//")) continue;
    const [pathname, fragment] = value.split("#");
    const target = decodeURIComponent(pathname.split("?")[0]);
    let local = path.join("out", target);
    if (fs.existsSync(local) && fs.statSync(local).isDirectory())
      local = path.join(local, "index.html");
    assert.ok(fs.existsSync(local), `${file}: missing local resource ${value}`);
    if (fragment && local.endsWith(".html"))
      assert.ok(
        load(fs.readFileSync(local, "utf8"))(`[id="${fragment}"]`).length,
        `${file}: missing anchor ${value}`,
      );
  }
}
// The original migration fixture can also be checked explicitly after content
// changes; normal builds validate the current source instead of freezing it.
if (process.argv.includes("--migration")) {
  const contract = JSON.parse(fs.readFileSync("tests/migration-contract.json"));
  const hash = (value) =>
    crypto.createHash("sha256").update(value).digest("hex");
  for (const [route, old] of Object.entries(contract.pages)) {
    const $ = load(fs.readFileSync(`out${route}`, "utf8"));
    const main = $("main");
    assert.equal($("title").first().text(), old.title, `${route}: title`);
    assert.equal(
      $("meta[name=description]").attr("content") ?? null,
      old.description,
      `${route}: description`,
    );
    assert.deepEqual(
      $('meta[property^="og:"]')
        .toArray()
        .map((e) => [$(e).attr("property"), $(e).attr("content")]),
      old.og,
      `${route}: Open Graph`,
    );
    assert.equal(
      hash(main.text().replace(/\s/g, "")),
      old.text,
      `${route}: visible content`,
    );
    assert.deepEqual(
      main
        .find("a[href]")
        .toArray()
        .map((e) => $(e).attr("href"))
        .sort(),
      old.links,
      `${route}: links`,
    );
    assert.deepEqual(
      main
        .find("img,video source")
        .toArray()
        .map((e) => ({ src: $(e).attr("src"), alt: $(e).attr("alt") ?? null })),
      old.media,
      `${route}: media`,
    );
    assert.deepEqual(
      main
        .find("[id]")
        .toArray()
        .map((e) => $(e).attr("id")),
      old.headings,
      `${route}: anchors`,
    );
  }
  for (const [file, digest] of Object.entries(contract.assets))
    assert.equal(
      hash(fs.readFileSync(`out${file}`)),
      digest,
      `${file}: original asset`,
    );
  for (const [file, digest] of Object.entries(contract.content))
    assert.equal(
      hash(fs.readFileSync(file)),
      digest,
      `${file}: source content`,
    );
  console.log(
    `Migration parity: ${Object.keys(contract.pages).length} pages, ${Object.keys(contract.assets).length} original assets, ${Object.keys(contract.content).length} source files.`,
  );
}
console.log(
  `Verified ${expected.length} pages, internal links, anchors, media, and static resources.`,
);

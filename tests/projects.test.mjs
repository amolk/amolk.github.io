import test from "node:test";
import { readdirSync, readFileSync } from "node:fs";
import matter from "gray-matter";
import assert from "node:assert/strict";
import projectsData from "../_data/projects.mjs";
import { projectIndex } from "../lib/projectIndex.mjs";
import { parseRanges } from "../lib/projectDates.mjs";
import { timelineModel } from "../lib/timeline.mjs";
import { renderMarkdown } from "../lib/markdown.mjs";
import { tagSlug } from "../lib/tags.mjs";

test("project visibility, hidden parents, and subproject activity control cards", () => {
  const projects = [
    { slug: "private", is_private: true },
    { slug: "hidden", hide_from_index: true },
    { slug: "surfaced", parent: "hidden", ranges: ["2026-10-20"] },
    { slug: "parent", subprojects: ["child"], ranges: ["2020-01-01"] },
    { slug: "child", parent: "parent", ranges: ["2026-10-24"] },
    { slug: "old", ranges: ["2000-01-01"] },
  ].map((p) => ({ title: p.slug, ...p }));
  const index = projectIndex(projects);
  assert.equal(index.bySlug.has("private"), false);
  assert.deepEqual(
    index.cards.map((p) => p.slug),
    ["parent", "surfaced", "old"],
  );
  assert.deepEqual(
    index.topOfMind(+new Date("2026-10-25")).map((p) => p.slug),
    ["parent", "surfaced"],
  );
  assert.equal(
    index.topOfMind(+new Date("2030-01-01")).length,
    2,
    "quiet periods retain two cards",
  );
});

test("Top of mind retains the 21-day window and six-card cap", () => {
  const now = +new Date(2026, 9, 24);
  const cards = Array.from({ length: 9 }, (_, i) => ({
    slug: `p${i}`,
    title: `p${i}`,
    ranges: [`2026-10-${String(24 - i).padStart(2, "0")}`],
  }));
  assert.equal(projectIndex(cards).topOfMind(now).length, 6);
  const index = projectIndex([
    ...cards.slice(0, 2),
    { slug: "boundary", title: "boundary", ranges: ["2026-10-03"] },
    { slug: "outside", title: "outside", ranges: ["2026-10-02"] },
  ]);
  assert.equal(index.topOfMind(+new Date(2026, 9, 24)).length, 3);
});

test("date fallback, invalid ranges, and timeline preserve inclusive single days", () => {
  const ranges = parseRanges({
    ranges: ["bad", "2025-01-10"],
    year_started: "2020",
  });
  assert.equal(ranges.length, 1);
  assert.equal(+ranges[0].start, +ranges[0].end);
  const fallback = parseRanges({ year_started: "2020", year_ended: "2021" });
  assert.equal(fallback[0].start.getFullYear(), 2020);
  assert.equal(fallback[0].end.getMonth(), 11);
  const model = timelineModel(
    [{ slug: "a", title: "A", status: "active", ranges: ["2025-01-10"] }],
    +new Date("2026-10-24"),
  );
  assert.deepEqual(
    model.years.map((p) => p.year),
    [2025, 2026],
  );
  assert.equal(model.rows[0].ranges[0].width, 0.4);
  assert.match(model.rows[0].ranges[0].title, /Jan 10, 2025 · Active/);
});

test("Markdown, tags, private routes, and relationships survive the content pipeline", async () => {
  const data = await projectsData();
  const source = readdirSync("data/projects")
    .filter((f) => f.endsWith(".mdx"))
    .map((f) => matter(readFileSync(`data/projects/${f}`, "utf8")).data);
  assert.equal(data.total, source.length);
  assert.equal(data.visible.length, source.filter((p) => !p.is_private).length);
  const privateSlugs = source.filter((p) => p.is_private).map((p) => p.slug);
  assert.ok(data.visible.every((p) => !privateSlugs.includes(p.slug)));
  assert.ok(data.cards.every((p) => !privateSlugs.includes(p.slug)));
  assert.equal(tagSlug("Agentic AI / C++"), "agentic-ai-c");
  assert.ok(data.visible.every((p) => !p.is_private));
  assert.ok(data.visible.every((p) => p.children.every((c) => !c.is_private)));
  assert.ok(data.visible.some((p) => p.body.includes("<h2 id=")));
  assert.ok(
    data.visible
      .find((p) => p.slug === "playbooks")
      .tagLinks.some((t) => t.url === "/tags/agentic-ai/"),
  );
});

test("Markdown extensions preserve heading anchors, tables, math, and highlighted code", async () => {
  const html = await renderMarkdown(
    "## Example\n\n| A | B |\n| - | - |\n| 1 | 2 |\n\n$x^2$\n\n```js\nconst answer = 42;\n```",
  );
  assert.match(html, /<h2 id="example"><a href="#example">Example<\/a><\/h2>/);
  assert.match(html, /<table>/);
  assert.match(html, /class="katex"/);
  assert.match(html, /token keyword/);
});

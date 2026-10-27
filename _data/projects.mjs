import { existsSync, readFileSync, readdirSync } from "node:fs";
import matter from "gray-matter";
import { renderMarkdown } from "../lib/markdown.mjs";
import { projectIndex } from "../lib/projectIndex.mjs";
import { tagSlug } from "../lib/tags.mjs";
import { timelineModel } from "../lib/timeline.mjs";

const linkFields = [
  ["website_url", "Website", "Globe"],
  ["demo_url", "Demo", "ExternalLink"],
  ["paper_url", "Paper", "FileText"],
  ["pypi_url", "PyPI", "Package"],
  ["npm_url", "npm", "Package"],
  ["marketplace_url", "Marketplace", "Store"],
  ["app_store_url", "App Store", "Apple"],
];
const categories = [
  ["flagship", "Flagship", "The biggest, most ambitious work."],
  ["shipped", "Shipped", "Products in the world."],
  ["research", "Research", "Open questions, papers, experiments."],
  [
    "professional",
    "Professional",
    "Work at Microsoft, OfficeSpace.com, and Got It AI.",
  ],
  ["startup", "Startups", "Things I have tried to build companies around."],
  ["tool", "Tools & explorations"],
  [
    "older",
    "Older work",
    "Pre-2018 Rails-era and NLP-era projects, for completeness.",
  ],
];

export default async function () {
  const all = [];
  const slugs = new Set();
  for (const filename of readdirSync("data/projects")
    .filter((name) => name.endsWith(".mdx"))
    .sort()) {
    const { data, content } = matter(
      readFileSync(`data/projects/${filename}`, "utf8"),
    );
    for (const field of ["title", "slug", "summary", "status", "category"]) {
      if (typeof data[field] !== "string" || !data[field])
        throw new Error(`${filename}: missing ${field}`);
    }
    if (!/^[a-z0-9-]+$/.test(data.slug) || slugs.has(data.slug))
      throw new Error(`${filename}: invalid or duplicate slug`);
    slugs.add(data.slug);
    const project = {
      tags: [],
      images: [],
      ranges: [],
      subprojects: [],
      is_private: false,
      is_public: false,
      ...data,
    };
    if (project.year_started !== undefined)
      project.year_started = String(project.year_started);
    if (project.year_ended !== undefined)
      project.year_ended = String(project.year_ended);
    project.url = `/projects/${project.slug}/`;
    project.years =
      project.year_started +
      (project.year_ended && project.year_ended !== project.year_started
        ? `–${project.year_ended}`
        : "");
    project.body = await renderMarkdown(content);
    // A hand-built explainer in _includes/explainers/ replaces the default page body.
    if (existsSync(`_includes/explainers/${project.slug}.njk`))
      project.explainer = `explainers/${project.slug}.njk`;
    project.tagLinks = project.tags.map((label) => ({
      label,
      url: `/tags/${tagSlug(label)}/`,
    }));
    project.links = [];
    if (project.is_public && project.repo_url) {
      const label = project.repo_url
        .replace(/^https?:\/\/github\.com\//, "")
        .replace(/\.git$/, "")
        .replace(/\/$/, "")
        .split("/")
        .slice(0, 2)
        .join("/");
      project.links.push({ href: project.repo_url, label, icon: "GitHub" });
    }
    for (const [field, label, icon] of linkFields) {
      if (project[field])
        project.links.push({ href: project[field], label, icon });
    }
    all.push(project);
  }
  const index = projectIndex(all);
  for (const project of index.visible) {
    const parent = project.parent
      ? all.find((p) => p.slug === project.parent)
      : null;
    project.parentProject = parent
      ? {
          title: parent.title,
          url: parent.url,
          is_private: parent.is_private,
          hide_from_index: parent.hide_from_index,
        }
      : null;
    const visibleParent = index.bySlug.get(project.parent);
    project.parentLabel = visibleParent?.hide_from_index
      ? visibleParent.title
      : null;
    project.children = project.subprojects
      .map((slug) => index.bySlug.get(slug))
      .filter(Boolean);
  }
  const tags = new Map();
  for (const project of index.visible) {
    for (const label of project.tags) {
      const slug = tagSlug(label);
      if (!tags.has(slug))
        tags.set(slug, { slug, label, url: `/tags/${slug}/`, projects: [] });
      tags.get(slug).projects.push(project);
    }
  }
  for (const tag of tags.values())
    tag.projects.sort((a, b) =>
      (b.year_started ?? "").localeCompare(a.year_started ?? ""),
    );
  return {
    total: all.length,
    visible: index.visible,
    cards: index.cards,
    topOfMind: index.topOfMind(Date.now()),
    tags: [...tags.values()],
    groups: categories
      .map(([key, label, blurb]) => ({
        key,
        label,
        blurb,
        projects: index.cards.filter((p) => p.category === key),
      }))
      .filter((g) => g.projects.length),
    timeline: timelineModel(index.visible),
  };
}

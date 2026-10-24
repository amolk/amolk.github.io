import { parseRanges } from "./projectDates.mjs";

export const statusColors = {
  active: "bg-green-700",
  shipped: "bg-blue-700",
  paused: "bg-amber-600",
  archived: "bg-gray-400",
  exploration: "bg-purple-600",
};
export const statusLabels = {
  active: "Active",
  shipped: "Shipped",
  paused: "Paused",
  archived: "Archived",
  exploration: "Exploration",
};
const DAY = 86400000;
const iso = (date) => date.toISOString().slice(0, 10);
const fmt = (date) =>
  date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

export function timelineModel(projects, now = Date.now()) {
  const rows = projects
    .map((project) => ({ project, ranges: parseRanges(project) }))
    .filter((row) => row.ranges.length)
    .map((row) => ({
      ...row,
      earliest: Math.min(...row.ranges.map((r) => +r.start)),
      latest: Math.max(...row.ranges.map((r) => +r.end)),
    }))
    .sort(
      (a, b) =>
        b.latest - a.latest ||
        b.earliest - a.earliest ||
        a.project.title.localeCompare(b.project.title),
    );
  if (!rows.length) return { rows: [], years: [], legend: [] };
  const minYear = new Date(
    Math.min(...rows.map((row) => row.earliest)),
  ).getFullYear();
  const minMs = +new Date(minYear, 0, 1);
  const latestEnd = Math.max(...rows.map((row) => row.latest));
  const today = Math.max(latestEnd, now);
  const span = today - minMs || DAY;
  const pct = (ms) => ((ms - minMs) / span) * 100;
  return {
    minYear,
    latestEnd: iso(new Date(latestEnd)),
    years: Array.from(
      { length: new Date(today).getFullYear() - minYear + 1 },
      (_, i) => ({
        year: minYear + i,
        left: pct(+new Date(minYear + i, 0, 1)),
      }),
    ),
    rows: rows.map(({ project, ranges }) => ({
      project,
      color: statusColors[project.status] || "bg-gray-500",
      ranges: ranges.map((range) => ({
        start: iso(range.start),
        end: iso(range.end),
        left: pct(+range.start),
        width: Math.max(((+range.end - +range.start + DAY) / span) * 100, 0.4),
        title: `${project.title} · ${fmt(range.start)}${+range.end !== +range.start ? ` – ${fmt(range.end)}` : ""} · ${statusLabels[project.status] || project.status}`,
      })),
    })),
    legend: Object.entries(statusLabels).map(([key, label]) => ({
      label,
      color: statusColors[key],
    })),
  };
}

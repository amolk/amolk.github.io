import { readFileSync } from "node:fs";

export default function () {
  const { publications, scholar } = JSON.parse(
    readFileSync(new URL("../data/publications.json", import.meta.url), "utf8"),
  );
  return {
    all: publications,
    scholar,
    selected: publications.filter((p) => p.selected),
    sorted: [...publications].sort(
      (a, b) => b.year - a.year || (b.citations ?? 0) - (a.citations ?? 0),
    ),
  };
}

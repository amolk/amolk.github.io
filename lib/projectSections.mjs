import { load } from "cheerio";

// Use the renderer's existing IDs so published deep links remain unchanged.
export function projectSections(html) {
  const $ = load(html, null, false);
  return $("h2[id]")
    .toArray()
    .map((heading) => ({ id: heading.attribs.id, label: $(heading).text() }));
}

// Turn a display tag (e.g. "agentic AI", "real estate") into a URL-safe slug
// used for /tags/<slug>/ pages.
export function tagSlug(tag: string): string {
  return tag
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

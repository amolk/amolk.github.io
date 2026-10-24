import { lastActiveMs } from "./projectDates.mjs";
const DAY = 86400000;
/** Top of mind: card projects active within this many days of the build. */
export const TOP_OF_MIND_DAYS = 21;
const TOP_OF_MIND_MAX = 6;
// Keep the home page grid from going empty after a quiet stretch.
const TOP_OF_MIND_MIN = 2;
/** Card-level view over the public projects, shared by the home and projects pages. */
export function projectIndex(projects) {
  const visible = projects.filter((p) => !p.is_private);
  const bySlug = new Map(visible.map((p) => [p.slug, p]));
  const isHidden = (p) => !!p?.hide_from_index;
  // A project gets its own card if it isn't hidden and is either top-level
  // or has a hidden parent (so day-job subprojects surface as standalone cards).
  const isCard = (p) => {
    if (isHidden(p)) return false;
    const parent = p.parent ? bySlug.get(p.parent) : undefined;
    return !parent || isHidden(parent);
  };
  // A card's last activity includes its subprojects, since the card lists them.
  const cardLastActive = (p) =>
    Math.max(
      lastActiveMs(p),
      ...(p.subprojects || []).map((s) => {
        const sub = bySlug.get(s);
        return sub ? lastActiveMs(sub) : 0;
      }),
    );
  /** Cards, most recently active first. */
  const cards = visible
    .filter(isCard)
    .sort(
      (a, b) =>
        cardLastActive(b) - cardLastActive(a) || a.title.localeCompare(b.title),
    );
  /** Cards active in the last TOP_OF_MIND_DAYS days before `nowMs`. */
  const topOfMind = (nowMs) => {
    const cutoff = nowMs - TOP_OF_MIND_DAYS * DAY;
    const recent = cards.filter((p) => cardLastActive(p) >= cutoff);
    return cards.slice(
      0,
      Math.min(TOP_OF_MIND_MAX, Math.max(TOP_OF_MIND_MIN, recent.length)),
    );
  };
  return { visible, bySlug, isHidden, cards, topOfMind };
}

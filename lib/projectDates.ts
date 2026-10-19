import type { Project } from 'contentlayer/generated';

export type DateRange = { start: Date; end: Date };

/** Parse a project's `ranges`, falling back to its year_started/year_ended span. */
export function parseRanges(p: Project): DateRange[] {
  const out: DateRange[] = [];
  for (const r of p.ranges || []) {
    const [a, b] = r.split(':');
    if (!a) continue;
    const start = new Date(a + 'T00:00:00');
    const end = new Date((b || a) + 'T00:00:00');
    if (!isNaN(start.getTime()) && !isNaN(end.getTime())) out.push({ start, end });
  }
  if (out.length === 0 && p.year_started) {
    const y0 = parseInt(p.year_started, 10);
    const y1 = parseInt(p.year_ended || p.year_started, 10);
    if (y0) out.push({ start: new Date(y0, 0, 1), end: new Date(y1 || y0, 11, 31) });
  }
  return out;
}

/** End of the most recent active period, in ms; 0 if the project has no dates. */
export function lastActiveMs(p: Project): number {
  return Math.max(0, ...parseRanges(p).map((r) => r.end.getTime()));
}

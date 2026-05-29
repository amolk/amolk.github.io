'use client';

import Link from 'next/link';
import { useMemo, useEffect, useState } from 'react';
import type { Project } from 'contentlayer/generated';

const STATUS_COLORS: Record<string, string> = {
  active: 'bg-green-700',
  shipped: 'bg-blue-700',
  paused: 'bg-amber-600',
  archived: 'bg-gray-400',
  exploration: 'bg-purple-600',
};

const STATUS_LABEL: Record<string, string> = {
  active: 'Active',
  shipped: 'Shipped',
  paused: 'Paused',
  archived: 'Archived',
  exploration: 'Exploration',
};

const ROW_H = 16; // px per row, zero gap between rows
const DAY = 86400000;

function parseRanges(p: Project): { start: Date; end: Date }[] {
  const out: { start: Date; end: Date }[] = [];
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

const fmt = (d: Date) =>
  d.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });

export default function Timeline({ projects }: { projects: Project[] }) {
  // Resolve "today" client-side to keep the axis ending at the current date.
  // Starts null so SSR/first paint matches (no hydration mismatch), then fills in.
  const [nowMs, setNowMs] = useState<number | null>(null);
  useEffect(() => setNowMs(Date.now()), []);

  const { rows, minMs, spanMs, years, todayMs } = useMemo(() => {
    const rows = projects
      .map((p) => ({ p, ranges: parseRanges(p) }))
      .filter((r) => r.ranges.length > 0)
      .map((r) => ({
        ...r,
        earliest: Math.min(...r.ranges.map((x) => x.start.getTime())),
        latest: Math.max(...r.ranges.map((x) => x.end.getTime())),
      }))
      // most recently started first
      .sort((a, b) => b.earliest - a.earliest || a.p.title.localeCompare(b.p.title));

    const minMs = Math.min(...rows.map((r) => r.earliest));
    const latestEnd = Math.max(...rows.map((r) => r.latest));
    // axis starts at Jan 1 of the earliest year, ends at today (or latest activity)
    const minYear = new Date(minMs).getFullYear();
    const axisMin = new Date(minYear, 0, 1).getTime();
    const todayMs = Math.max(latestEnd, nowMs ?? latestEnd);
    const axisMax = todayMs;
    const span = axisMax - axisMin;
    const lastYear = new Date(axisMax).getFullYear();
    const years: number[] = [];
    for (let y = minYear; y <= lastYear; y++) years.push(y);
    return { rows, minMs: axisMin, spanMs: span, years, todayMs };
  }, [projects, nowMs]);

  const pct = (ms: number) => ((ms - minMs) / spanMs) * 100;

  return (
    <div className="w-full text-sm">
      {/* Year axis */}
      <div className="flex border-b border-gray-300 pb-1 mb-1">
        <div className="w-44 shrink-0" />
        <div className="flex-1 relative h-4">
          {years.map((y) => (
            <div
              key={y}
              className="absolute top-0 text-[10px] text-gray-400 font-light -translate-x-1/2"
              style={{ left: `${pct(new Date(y, 0, 1).getTime())}%` }}
            >
              {y}
            </div>
          ))}
        </div>
      </div>

      {/* Rows */}
      <div className="relative">
        {/* year gridlines behind rows */}
        <div className="absolute inset-0 flex pointer-events-none">
          <div className="w-44 shrink-0" />
          <div className="flex-1 relative">
            {years.map((y) => (
              <div
                key={y}
                className="absolute top-0 bottom-0 border-l border-gray-100"
                style={{ left: `${pct(new Date(y, 0, 1).getTime())}%` }}
              />
            ))}
            {/* today marker */}
            <div
              className="absolute top-0 bottom-0 border-l border-dashed border-gray-300"
              style={{ left: `${pct(todayMs)}%` }}
            />
          </div>
        </div>

        {rows.map(({ p, ranges }) => {
          const color = STATUS_COLORS[p.status] || 'bg-gray-500';
          return (
            <div key={p.slug} className="flex items-center group" style={{ height: ROW_H }}>
              <Link
                href={p.url}
                className="w-44 shrink-0 pr-3 text-[11px] leading-none truncate text-gray-700 group-hover:text-black group-hover:underline underline-offset-2"
                title={p.summary}
              >
                {p.title}
              </Link>
              <div className="flex-1 relative h-full">
                {ranges.map((r, i) => {
                  const left = pct(r.start.getTime());
                  const widthRaw = ((r.end.getTime() - r.start.getTime() + DAY) / spanMs) * 100;
                  const width = Math.max(widthRaw, 0.4); // floor so single-day shows
                  return (
                    <Link
                      key={i}
                      href={p.url}
                      className={`absolute ${color} rounded-[2px] opacity-80 group-hover:opacity-100 transition-opacity`}
                      style={{ left: `${left}%`, width: `${width}%`, top: 3, bottom: 3 }}
                      title={`${p.title} · ${fmt(r.start)}${r.end.getTime() !== r.start.getTime() ? ` – ${fmt(r.end)}` : ''} · ${STATUS_LABEL[p.status] || p.status}`}
                    />
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-x-4 gap-y-1 mt-4 text-[10px] text-gray-500">
        {Object.entries(STATUS_LABEL).map(([k, v]) => (
          <div key={k} className="flex items-center gap-1.5">
            <span className={`w-2.5 h-2.5 rounded-[2px] ${STATUS_COLORS[k]}`} />
            {v}
          </div>
        ))}
        <span className="text-gray-400">· bars seeded from git history; multiple bars = paused &amp; resumed</span>
      </div>
    </div>
  );
}

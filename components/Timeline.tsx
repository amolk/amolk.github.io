'use client';

import Link from 'next/link';
import { useMemo } from 'react';
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

interface TimelineProps {
  projects: Project[];
}

export default function Timeline({ projects }: TimelineProps) {
  const data = useMemo(() => {
    const items = projects
      .map((p) => {
        const start = parseInt(p.year_started || '', 10);
        const endStr = p.year_ended || p.year_started;
        const end = parseInt(endStr || '', 10);
        if (!start || !end) return null;
        return { p, start, end };
      })
      .filter((x): x is { p: Project; start: number; end: number } => !!x)
      .sort((a, b) => b.start - a.start || a.p.title.localeCompare(b.p.title));

    const minYear = Math.min(...items.map((i) => i.start));
    const maxYear = Math.max(...items.map((i) => i.end));
    return { items, minYear, maxYear };
  }, [projects]);

  const span = data.maxYear - data.minYear + 1;
  const years = Array.from({ length: span }, (_, i) => data.minYear + i);

  return (
    <div className="w-full">
      {/* Year axis */}
      <div className="sticky top-0 z-10 bg-white/90 backdrop-blur-sm border-b border-gray-200 pb-2 mb-3">
        <div className="flex">
          <div className="w-56 shrink-0" />
          <div className="flex-1 relative h-6">
            {years.map((y, i) => (
              <div
                key={y}
                className="absolute top-0 text-xs text-gray-500 font-light"
                style={{ left: `${(i / span) * 100}%` }}
              >
                <span className="block -translate-x-1/2">{y}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Rows */}
      <ul className="space-y-2">
        {data.items.map(({ p, start, end }) => {
          const leftPct = ((start - data.minYear) / span) * 100;
          const widthPct = Math.max(((end - start + 1) / span) * 100, 1.2);
          const color = STATUS_COLORS[p.status] || 'bg-gray-500';
          return (
            <li key={p.slug} className="flex items-center group">
              <Link
                href={p.url}
                className="w-56 shrink-0 pr-4 text-sm font-medium truncate text-gray-800 group-hover:text-black group-hover:underline underline-offset-4"
                title={p.summary}
              >
                {p.title}
              </Link>
              <div className="flex-1 relative h-7 bg-gray-50 rounded">
                <Link
                  href={p.url}
                  className={`absolute top-1 bottom-1 ${color} rounded opacity-80 hover:opacity-100 transition-opacity flex items-center px-2`}
                  style={{ left: `${leftPct}%`, width: `${widthPct}%` }}
                  title={`${p.title} · ${start === end ? start : `${start}–${end}`} · ${STATUS_LABEL[p.status] || p.status}`}
                >
                  <span className="text-[10px] text-white/90 truncate">
                    {start === end ? start : `${start}–${end}`}
                  </span>
                </Link>
              </div>
            </li>
          );
        })}
      </ul>

      {/* Legend */}
      <div className="flex flex-wrap gap-4 mt-8 text-xs text-gray-500">
        {Object.entries(STATUS_LABEL).map(([k, v]) => (
          <div key={k} className="flex items-center gap-2">
            <span className={`w-3 h-3 rounded ${STATUS_COLORS[k]}`} />
            {v}
          </div>
        ))}
      </div>
    </div>
  );
}

'use client';

import React from 'react';
import { Clock } from 'lucide-react';

export interface TimelineRow {
  time: string;
  unit: string;
  topics: string;
  badge?: string;
}

export interface TimelineProps {
  title?: string;
  ariaLabel: string;
  rows: TimelineRow[];
  caption?: string;
}

export function Timeline({
  title,
  ariaLabel,
  rows,
  caption,
}: TimelineProps) {
  return (
    <figure
      role="img"
      aria-label={ariaLabel}
      className="my-6 p-4 sm:p-6 rounded-[var(--r-lg)] border border-[var(--border)] bg-[var(--surface)] text-[var(--text)] not-prose shadow-xs overflow-x-auto"
    >
      {title && (
        <div className="text-xs font-mono font-semibold tracking-wider uppercase text-[var(--accent)] mb-4">
          {title}
        </div>
      )}

      <div className="space-y-3 font-mono text-xs sm:text-sm">
        {rows.map((row, idx) => (
          <div
            key={idx}
            className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-3 rounded-[var(--r-md)] border border-[var(--border)] bg-[var(--surface-2)] transition-all"
          >
            <div className="flex items-center gap-3">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-[var(--r-sm)] bg-[var(--accent-soft)] border border-[var(--accent)]/30 text-[var(--accent)] text-xs font-bold shrink-0">
                <Clock className="w-3.5 h-3.5" />
                <span>{row.time}</span>
              </span>
              <span className="font-bold text-[var(--text)]">{row.unit}</span>
            </div>

            <div className="flex items-center gap-2 text-xs text-[var(--text-muted)] font-mono sm:text-right pl-8 sm:pl-0">
              <span>{row.topics}</span>
              {row.badge && (
                <span className="px-1.5 py-0.2 rounded bg-[var(--surface)] border border-[var(--border)] text-[10px] text-[var(--accent)]">
                  {row.badge}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>

      {caption && (
        <div className="mt-4 pt-3 border-t border-[var(--border)] text-xs font-mono text-[var(--text-muted)]">
          {caption}
        </div>
      )}
    </figure>
  );
}

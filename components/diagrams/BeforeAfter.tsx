'use client';

import React from 'react';
import { ArrowRight, ArrowDown } from 'lucide-react';

export interface CodeLine {
  text: string;
  type?: 'default' | 'removed' | 'added' | 'changed' | 'badge';
  badge?: string;
  note?: string;
}

export interface BeforeAfterProps {
  title?: string;
  techniqueBadge?: string;
  ariaLabel: string;
  before: {
    title?: string;
    lines: (string | CodeLine)[];
    notes?: string[];
  };
  after: {
    title?: string;
    lines: (string | CodeLine)[];
    notes?: string[];
  };
  footerNote?: string;
}

export function BeforeAfter({
  title,
  techniqueBadge,
  ariaLabel,
  before,
  after,
  footerNote,
}: BeforeAfterProps) {
  const normalizeLines = (lines: (string | CodeLine)[]): CodeLine[] => {
    return lines.map((l) => (typeof l === 'string' ? { text: l, type: 'default' } : l));
  };

  const beforeLines = normalizeLines(before.lines);
  const afterLines = normalizeLines(after.lines);

  return (
    <figure
      role="img"
      aria-label={ariaLabel}
      className="my-6 p-4 sm:p-6 rounded-[var(--r-lg)] border border-[var(--border)] bg-[var(--surface)] text-[var(--text)] not-prose shadow-xs overflow-x-auto"
    >
      <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
        {title && (
          <div className="text-xs font-mono font-semibold tracking-wider uppercase text-[var(--text)]">
            {title}
          </div>
        )}
        {techniqueBadge && (
          <span className="px-2.5 py-0.5 rounded-[var(--r-sm)] bg-[var(--accent-soft)] border border-[var(--accent)]/30 text-[var(--accent)] font-mono text-xs font-bold">
            {techniqueBadge}
          </span>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-[1fr,auto,1fr] gap-4 items-center">
        {/* Before Column */}
        <div className="p-3.5 rounded-[var(--r-md)] border border-[var(--border)] bg-[var(--surface-2)] flex flex-col h-full">
          <div className="text-xs font-mono font-bold text-[var(--danger)] uppercase tracking-wider mb-2 pb-1.5 border-b border-[var(--border)]">
            {before.title || 'BEFORE'}
          </div>
          <div className="font-mono text-xs sm:text-[13px] space-y-1 overflow-x-auto flex-1">
            {beforeLines.map((line, idx) => (
              <div
                key={idx}
                className={`flex items-center justify-between gap-2 px-1.5 py-0.5 rounded ${
                  line.type === 'removed'
                    ? 'bg-[var(--danger)]/15 text-[var(--danger)]'
                    : 'text-[var(--text)]'
                }`}
              >
                <span className="whitespace-pre">{line.text}</span>
                {line.badge && (
                  <span className="text-[10px] px-1 py-0.2 rounded bg-[var(--danger)]/20 text-[var(--danger)] shrink-0">
                    {line.badge}
                  </span>
                )}
              </div>
            ))}
          </div>
          {before.notes && (
            <div className="mt-3 pt-2 border-t border-[var(--border)] text-[11px] text-[var(--text-muted)] font-mono">
              {before.notes.map((n, i) => (
                <div key={i}>{n}</div>
              ))}
            </div>
          )}
        </div>

        {/* Arrow divider */}
        <div className="flex justify-center text-[var(--accent)] py-1 md:py-0">
          <div className="hidden md:block">
            <ArrowRight className="w-5 h-5" />
          </div>
          <div className="block md:hidden">
            <ArrowDown className="w-5 h-5" />
          </div>
        </div>

        {/* After Column */}
        <div className="p-3.5 rounded-[var(--r-md)] border border-[var(--border)] bg-[var(--surface-2)] flex flex-col h-full">
          <div className="text-xs font-mono font-bold text-[var(--success)] uppercase tracking-wider mb-2 pb-1.5 border-b border-[var(--border)]">
            {after.title || 'AFTER'}
          </div>
          <div className="font-mono text-xs sm:text-[13px] space-y-1 overflow-x-auto flex-1">
            {afterLines.map((line, idx) => (
              <div
                key={idx}
                className={`flex items-center justify-between gap-2 px-1.5 py-0.5 rounded ${
                  line.type === 'added' || line.type === 'changed'
                    ? 'bg-[var(--success)]/15 text-[var(--success)]'
                    : 'text-[var(--text)]'
                }`}
              >
                <span className="whitespace-pre">{line.text}</span>
                {line.badge && (
                  <span className="text-[10px] px-1 py-0.2 rounded bg-[var(--success)]/20 text-[var(--success)] shrink-0">
                    {line.badge}
                  </span>
                )}
              </div>
            ))}
          </div>
          {after.notes && (
            <div className="mt-3 pt-2 border-t border-[var(--border)] text-[11px] text-[var(--text-muted)] font-mono">
              {after.notes.map((n, i) => (
                <div key={i}>{n}</div>
              ))}
            </div>
          )}
        </div>
      </div>

      {footerNote && (
        <div className="mt-4 pt-3 border-t border-[var(--border)] text-xs font-mono text-[var(--text-muted)]">
          {footerNote}
        </div>
      )}
    </figure>
  );
}

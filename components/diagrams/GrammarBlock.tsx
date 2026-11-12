'use client';

import React from 'react';

export interface GrammarProduction {
  lhs: string;
  rhs: string[]; // alternatives separated by |
  annotation?: string;
}

export interface GrammarBlockProps {
  title?: string;
  ariaLabel: string;
  productions: GrammarProduction[];
  note?: string;
}

export function GrammarBlock({
  title,
  ariaLabel,
  productions,
  note,
}: GrammarBlockProps) {
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

      <div className="space-y-2.5 font-mono text-xs sm:text-sm">
        {productions.map((prod, idx) => (
          <div
            key={idx}
            className="grid grid-cols-[auto,auto,1fr] items-baseline gap-x-3 gap-y-1 hover:bg-[var(--surface-2)]/40 p-1.5 rounded transition-colors"
          >
            {/* LHS */}
            <span className="font-bold text-[var(--text)] text-right whitespace-nowrap">
              {prod.lhs}
            </span>

            {/* Arrow */}
            <span className="text-[var(--accent)] font-bold select-none">→</span>

            {/* RHS */}
            <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
              {prod.rhs.map((alt, aIdx) => (
                <React.Fragment key={aIdx}>
                  <span className="text-[var(--text)]">{alt}</span>
                  {aIdx < prod.rhs.length - 1 && (
                    <span className="text-[var(--text-muted)] font-normal select-none">
                      |
                    </span>
                  )}
                </React.Fragment>
              ))}
              {prod.annotation && (
                <span className="text-xs text-[var(--text-muted)] font-sans ml-2">
                  ({prod.annotation})
                </span>
              )}
            </div>
          </div>
        ))}
      </div>

      {note && (
        <div className="mt-4 pt-3 border-t border-[var(--border)] text-xs font-mono text-[var(--text-muted)]">
          {note}
        </div>
      )}
    </figure>
  );
}

'use client';

import React from 'react';
import { ArrowRight } from 'lucide-react';

export interface ChainItem {
  text: string;
  subtext?: string;
  variant?: 'default' | 'accent' | 'purple' | 'success' | 'warning';
  arrowLabel?: string;
  arrowType?: '->' | '=>';
}

export interface ChainDiagramProps {
  title?: string;
  ariaLabel: string;
  items?: ChainItem[];
  // Multi-row support (e.g. 00-introduction#3)
  alignedRows?: {
    rowTitle?: string;
    cells: {
      text: string;
      variant?: 'default' | 'accent' | 'purple' | 'success' | 'warning';
    }[];
  }[];
  caption?: string;
}

export function ChainDiagram({
  title,
  ariaLabel,
  items,
  alignedRows,
  caption,
}: ChainDiagramProps) {
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

      {alignedRows ? (
        /* Multi-row aligned layout (e.g. 00-introduction#3) */
        <div className="space-y-4">
          {alignedRows.map((row, rIdx) => (
            <div key={rIdx} className="flex flex-col gap-1.5">
              {row.rowTitle && (
                <div className="text-xs font-mono font-semibold text-[var(--text-muted)]">
                  {row.rowTitle}:
                </div>
              )}
              <div className="flex flex-wrap items-center gap-2">
                {row.cells.map((cell, cIdx) => (
                  <span
                    key={cIdx}
                    className={`px-2.5 py-1 rounded-[var(--r-sm)] font-mono text-xs sm:text-sm border transition-all ${
                      cell.variant === 'accent'
                        ? 'border-[var(--accent)] bg-[var(--accent-soft)] text-[var(--accent)] font-semibold'
                        : cell.variant === 'purple'
                        ? 'border-[var(--purple)] bg-[var(--purple)]/10 text-[var(--purple)] font-semibold'
                        : cell.variant === 'success'
                        ? 'border-[var(--success)] bg-[var(--success)]/10 text-[var(--success)] font-semibold'
                        : 'border-[var(--border)] bg-[var(--surface-2)] text-[var(--text)]'
                    }`}
                  >
                    {cell.text}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : items ? (
        /* Standard wrapping chain */
        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          {items.map((item, idx) => (
            <React.Fragment key={idx}>
              <div className="flex flex-col items-center">
                <span
                  className={`px-3 py-1.5 rounded-[var(--r-md)] font-mono text-xs sm:text-sm border transition-all shadow-xs ${
                    item.variant === 'accent'
                      ? 'border-[var(--accent)] bg-[var(--accent-soft)] text-[var(--accent)] font-semibold'
                      : item.variant === 'purple'
                      ? 'border-[var(--purple)] bg-[var(--purple)]/10 text-[var(--purple)] font-semibold'
                      : item.variant === 'success'
                      ? 'border-[var(--success)] bg-[var(--success)]/10 text-[var(--success)] font-semibold'
                      : item.variant === 'warning'
                      ? 'border-[var(--warning)] bg-[var(--warning)]/10 text-[var(--warning)] font-semibold'
                      : 'border-[var(--border)] bg-[var(--surface-2)] text-[var(--text)]'
                  }`}
                >
                  {item.text}
                </span>
                {item.subtext && (
                  <span className="text-[10px] font-mono text-[var(--text-muted)] mt-1">
                    {item.subtext}
                  </span>
                )}
              </div>

              {idx < items.length - 1 && (
                <div className="flex flex-col items-center justify-center text-[var(--text-muted)] px-0.5">
                  {item.arrowLabel && (
                    <span className="text-[10px] font-mono text-[var(--accent)] font-semibold mb-0.5">
                      {item.arrowLabel}
                    </span>
                  )}
                  {item.arrowType === '=>' ? (
                    <span className="font-mono text-base font-bold text-[var(--accent)] select-none">
                      ⇒
                    </span>
                  ) : (
                    <ArrowRight className="w-4 h-4 shrink-0" />
                  )}
                </div>
              )}
            </React.Fragment>
          ))}
        </div>
      ) : null}

      {caption && (
        <div className="mt-4 pt-3 border-t border-[var(--border)] text-xs font-mono text-[var(--text-muted)]">
          {caption}
        </div>
      )}
    </figure>
  );
}

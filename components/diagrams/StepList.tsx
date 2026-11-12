'use client';

import React from 'react';

export interface StepChip {
  text: string;
  variant?: 'default' | 'accent' | 'success' | 'warning' | 'danger';
}

export interface StepItem {
  number?: string | number;
  label: string;
  monoContent?: string;
  reason?: string;
  badge?: string;
  badgeVariant?: 'accent' | 'success' | 'warning' | 'danger';
  chips?: StepChip[];
}

export interface StepListProps {
  title?: string;
  ariaLabel: string;
  items: StepItem[];
  footerNote?: string;
}

export function StepList({
  title,
  ariaLabel,
  items,
  footerNote,
}: StepListProps) {
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

      <div className="space-y-3">
        {items.map((item, idx) => (
          <div
            key={idx}
            className="p-3 rounded-[var(--r-md)] border border-[var(--border)] bg-[var(--surface-2)] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs sm:text-sm font-mono"
          >
            <div className="flex items-center gap-3">
              {item.number !== undefined && (
                <span className="w-7 h-7 rounded-full bg-[var(--surface)] border border-[var(--border)] text-[var(--accent)] flex items-center justify-center font-bold text-xs shrink-0">
                  {item.number}
                </span>
              )}
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-[var(--text)]">{item.label}</span>
                  {item.badge && (
                    <span
                      className={`px-1.5 py-0.2 rounded text-[10px] font-bold uppercase ${
                        item.badgeVariant === 'success'
                          ? 'bg-[var(--success)]/20 text-[var(--success)] border border-[var(--success)]/30'
                          : 'bg-[var(--accent)]/15 text-[var(--accent)] border border-[var(--accent)]/30'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </div>
                {item.monoContent && (
                  <div className="text-xs text-[var(--text-muted)] mt-0.5">
                    {item.monoContent}
                  </div>
                )}
                {item.reason && (
                  <div className="text-xs text-[var(--text-muted)] mt-1 font-sans">
                    {item.reason}
                  </div>
                )}
              </div>
            </div>

            {/* Chips on the right */}
            {item.chips && item.chips.length > 0 && (
              <div className="flex flex-wrap gap-1.5 shrink-0 pl-10 sm:pl-0">
                {item.chips.map((chip, cIdx) => (
                  <span
                    key={cIdx}
                    className={`px-2 py-0.5 rounded-[var(--r-sm)] font-mono text-xs border ${
                      chip.variant === 'accent'
                        ? 'border-[var(--accent)] bg-[var(--accent-soft)] text-[var(--accent)] font-semibold'
                        : chip.variant === 'success'
                        ? 'border-[var(--success)] bg-[var(--success)]/15 text-[var(--success)]'
                        : chip.variant === 'warning'
                        ? 'border-[var(--warning)] bg-[var(--warning)]/15 text-[var(--warning)]'
                        : 'border-[var(--border)] bg-[var(--surface)] text-[var(--text)]'
                    }`}
                  >
                    {chip.text}
                  </span>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      {footerNote && (
        <div className="mt-4 pt-3 border-t border-[var(--border)] text-xs font-mono text-[var(--text-muted)]">
          {footerNote}
        </div>
      )}
    </figure>
  );
}

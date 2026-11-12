'use client';

import React from 'react';

export interface GridCard {
  id: string;
  title: string;
  subtitle?: string;
  lines: string[];
  isReduce?: boolean; // ends with • -> green outline
  highlight?: boolean;
  mergedWith?: string;
}

export interface CardGroup {
  label: string;
  cards: GridCard[];
}

export interface CardGridProps {
  title?: string;
  ariaLabel: string;
  cards?: GridCard[];
  groups?: CardGroup[];
  footerNote?: string;
}

export function CardGrid({
  title,
  ariaLabel,
  cards,
  groups,
  footerNote,
}: CardGridProps) {
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

      {groups ? (
        /* Grouped cards (e.g. 02-unit-2#14 LALR pairs) */
        <div className="space-y-6">
          {groups.map((group, gIdx) => (
            <div key={gIdx} className="space-y-2">
              <div className="text-xs font-mono font-bold text-[var(--accent)]">
                {group.label}
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {group.cards.map((card) => (
                  <RenderCard key={card.id} card={card} />
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : cards ? (
        /* Standard card grid (e.g. 02-unit-2#13 I0-I11) */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
          {cards.map((card) => (
            <RenderCard key={card.id} card={card} />
          ))}
        </div>
      ) : null}

      {footerNote && (
        <div className="mt-4 pt-3 border-t border-[var(--border)] text-xs font-mono text-[var(--text-muted)]">
          {footerNote}
        </div>
      )}
    </figure>
  );
}

function RenderCard({ card }: { card: GridCard }) {
  const hasReduceItem =
    card.isReduce || card.lines.some((l) => l.trim().endsWith('•') || l.trim().endsWith('•,$'));

  return (
    <div
      className={`p-3 rounded-[var(--r-md)] border text-xs font-mono flex flex-col justify-between transition-all ${
        hasReduceItem
          ? 'border-[var(--success)] bg-[var(--surface-2)] shadow-xs ring-1 ring-[var(--success)]/30'
          : card.highlight
          ? 'border-[var(--accent)] bg-[var(--accent-soft)]'
          : 'border-[var(--border)] bg-[var(--surface-2)]'
      }`}
    >
      <div>
        <div className="flex items-center justify-between pb-1.5 mb-1.5 border-b border-[var(--border)]">
          <span className="font-bold text-sm text-[var(--text)]">{card.title}</span>
          {hasReduceItem && (
            <span className="px-1.5 py-0.2 rounded bg-[var(--success)]/20 text-[var(--success)] text-[10px] font-bold">
              REDUCE
            </span>
          )}
        </div>
        {card.subtitle && (
          <div className="text-[10px] text-[var(--text-muted)] mb-1 font-sans">
            {card.subtitle}
          </div>
        )}
        <div className="space-y-0.5 text-[11px] text-[var(--text)]">
          {card.lines.map((line, idx) => (
            <div key={idx} className="whitespace-pre">
              {line}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

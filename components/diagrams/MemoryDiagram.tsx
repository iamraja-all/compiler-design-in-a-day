'use client';

import React from 'react';
import { ArrowDown, ArrowUp } from 'lucide-react';

export interface MemoryBand {
  id?: string;
  label: string;
  sublabel?: string;
  notes?: string;
  growth?: 'up' | 'down';
  variant?: 'default' | 'accent' | 'warning' | 'dashed';
}

export interface BufferCell {
  char: string;
  isSentinel?: boolean;
}

export interface BufferPointer {
  name: string;
  cellIndex: number;
  colorVariant?: 'accent' | 'purple' | 'warning';
}

export interface MemoryDiagramProps {
  title?: string;
  ariaLabel: string;
  variant?: 'stack' | 'cells' | 'two-stacks';
  bands?: MemoryBand[];
  topLabel?: string;
  bottomLabel?: string;
  // Cells variant props (e.g. 01-unit-1#2)
  bufferHalves?: {
    title: string;
    cells: BufferCell[];
  }[];
  pointers?: BufferPointer[];
  bufferNotes?: string;
  // Two stacks variant props (e.g. 03-unit-3#4)
  twoStacks?: {
    rule?: string;
    result?: string;
    stack1: { name: string; items: string[]; topPointer?: number; topPointerLabel?: string };
    stack2: { name: string; items: string[]; topPointer?: number; topPointerLabel?: string };
  };
}

export function MemoryDiagram({
  title,
  ariaLabel,
  variant = 'stack',
  bands = [],
  topLabel,
  bottomLabel,
  bufferHalves,
  pointers,
  bufferNotes,
  twoStacks,
}: MemoryDiagramProps) {
  return (
    <figure
      role="img"
      aria-label={ariaLabel}
      className="my-6 p-4 sm:p-6 rounded-[var(--r-lg)] border border-[var(--border)] bg-[var(--surface)] text-[var(--text)] not-prose overflow-x-auto shadow-xs"
    >
      {title && (
        <div className="text-xs font-mono font-semibold tracking-wider uppercase text-[var(--accent)] mb-4">
          {title}
        </div>
      )}

      {variant === 'cells' && bufferHalves ? (
        /* Horizontal buffer cells with pointer arrows */
        <div className="space-y-4">
          <div className="flex flex-wrap items-start gap-4">
            {bufferHalves.map((half, hIdx) => {
              // Calculate global offset for pointers
              const prevCellsCount = bufferHalves
                .slice(0, hIdx)
                .reduce((acc, h) => acc + h.cells.length, 0);

              return (
                <div key={hIdx} className="flex-1 min-w-[280px]">
                  <div className="text-xs font-mono font-semibold text-[var(--text-muted)] mb-2">
                    {half.title}
                  </div>
                  <div className="flex border border-[var(--border)] rounded-[var(--r-md)] overflow-hidden bg-[var(--surface-2)]">
                    {half.cells.map((cell, cIdx) => {
                      const globalIdx = prevCellsCount + cIdx;
                      const cellPointers = pointers?.filter((p) => p.cellIndex === globalIdx);

                      return (
                        <div
                          key={cIdx}
                          className={`flex-1 min-w-[32px] h-10 flex flex-col items-center justify-center border-r border-[var(--border)] last:border-r-0 font-mono text-sm relative ${
                            cell.isSentinel
                              ? 'bg-[var(--warning)]/20 text-[var(--warning)] font-bold'
                              : 'text-[var(--text)]'
                          }`}
                        >
                          <span>{cell.char}</span>
                        </div>
                      );
                    })}
                  </div>

                  {/* Pointers row below cells */}
                  <div className="flex pt-2">
                    {half.cells.map((_, cIdx) => {
                      const globalIdx = prevCellsCount + cIdx;
                      const activePointers = pointers?.filter((p) => p.cellIndex === globalIdx);

                      return (
                        <div
                          key={cIdx}
                          className="flex-1 min-w-[32px] flex flex-col items-center text-center"
                        >
                          {activePointers && activePointers.length > 0 && (
                            <div className="flex flex-col items-center">
                              <ArrowUp
                                className={`w-3.5 h-3.5 ${
                                  activePointers[0].colorVariant === 'purple'
                                    ? 'text-[var(--purple)]'
                                    : 'text-[var(--accent)]'
                                }`}
                              />
                              <span
                                className={`text-[10px] font-mono font-semibold whitespace-nowrap mt-0.5 ${
                                  activePointers[0].colorVariant === 'purple'
                                    ? 'text-[var(--purple)]'
                                    : 'text-[var(--accent)]'
                                }`}
                              >
                                {activePointers[0].name}
                              </span>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>

          {bufferNotes && (
            <div className="pt-2 text-xs font-mono text-[var(--text-muted)] border-t border-[var(--border)]">
              {bufferNotes}
            </div>
          )}
        </div>
      ) : variant === 'two-stacks' && twoStacks ? (
        /* Two stacks side by side (e.g. 03-unit-3#4) */
        <div className="space-y-4">
          {twoStacks.rule && (
            <div className="p-2.5 rounded-[var(--r-sm)] bg-[var(--surface-2)] border border-[var(--border)] font-mono text-xs text-[var(--accent)] font-semibold">
              {twoStacks.rule}
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* Stack 1 */}
            <div className="p-3 rounded-[var(--r-md)] border border-[var(--border)] bg-[var(--surface-2)]">
              <div className="text-xs font-mono font-bold text-[var(--text-muted)] uppercase mb-3">
                {twoStacks.stack1.name}
              </div>
              <div className="space-y-1.5 font-mono text-sm">
                {twoStacks.stack1.items.map((item, idx) => (
                  <div
                    key={idx}
                    className={`flex items-center justify-between p-2 rounded-[var(--r-sm)] border ${
                      idx === twoStacks.stack1.topPointer
                        ? 'border-[var(--accent)] bg-[var(--accent-soft)] font-bold text-[var(--accent)]'
                        : 'border-[var(--border)] bg-[var(--surface)] text-[var(--text)]'
                    }`}
                  >
                    <span>{item}</span>
                    {idx === twoStacks.stack1.topPointer && twoStacks.stack1.topPointerLabel && (
                      <span className="text-xs text-[var(--accent)]">
                        ← {twoStacks.stack1.topPointerLabel}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Stack 2 */}
            <div className="p-3 rounded-[var(--r-md)] border border-[var(--border)] bg-[var(--surface-2)]">
              <div className="text-xs font-mono font-bold text-[var(--text-muted)] uppercase mb-3">
                {twoStacks.stack2.name}
              </div>
              <div className="space-y-1.5 font-mono text-sm">
                {twoStacks.stack2.items.map((item, idx) => (
                  <div
                    key={idx}
                    className={`flex items-center justify-between p-2 rounded-[var(--r-sm)] border ${
                      idx === twoStacks.stack2.topPointer
                        ? 'border-[var(--success)] bg-[var(--success)]/10 font-bold text-[var(--success)]'
                        : 'border-[var(--border)] bg-[var(--surface)] text-[var(--text)]'
                    }`}
                  >
                    <span>{item}</span>
                    {idx === twoStacks.stack2.topPointer && twoStacks.stack2.topPointerLabel && (
                      <span className="text-xs text-[var(--success)]">
                        ← {twoStacks.stack2.topPointerLabel}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {twoStacks.result && (
            <div className="p-2 text-xs font-mono font-bold text-[var(--success)] border-t border-[var(--border)] pt-3">
              {twoStacks.result}
            </div>
          )}
        </div>
      ) : (
        /* Vertical memory stack bands */
        <div className="max-w-md mx-auto space-y-2">
          {topLabel && (
            <div className="text-center text-xs font-mono text-[var(--text-muted)] pb-1">
              ↑ {topLabel}
            </div>
          )}

          <div className="border border-[var(--border)] rounded-[var(--r-md)] overflow-hidden divide-y divide-[var(--border)] bg-[var(--surface-2)]">
            {bands.map((band, idx) => (
              <div
                key={idx}
                className={`p-3.5 flex items-center justify-between font-mono text-xs sm:text-sm transition-all ${
                  band.variant === 'accent'
                    ? 'bg-[var(--accent-soft)] text-[var(--accent)] font-semibold'
                    : band.variant === 'warning'
                    ? 'bg-[var(--warning)]/15 text-[var(--warning)] font-semibold'
                    : band.variant === 'dashed'
                    ? 'bg-[var(--surface)] border-dashed text-[var(--text-muted)] py-5 text-center justify-center'
                    : 'text-[var(--text)]'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span>{band.label}</span>
                  {band.sublabel && (
                    <span className="text-[11px] text-[var(--text-muted)]">
                      {band.sublabel}
                    </span>
                  )}
                  {band.growth === 'down' && (
                    <ArrowDown className="w-3.5 h-3.5 text-[var(--accent)]" />
                  )}
                  {band.growth === 'up' && (
                    <ArrowUp className="w-3.5 h-3.5 text-[var(--accent)]" />
                  )}
                </div>

                {band.notes && (
                  <span className="text-[11px] text-[var(--text-muted)] font-sans ml-2 text-right">
                    {band.notes}
                  </span>
                )}
              </div>
            ))}
          </div>

          {bottomLabel && (
            <div className="text-center text-xs font-mono text-[var(--text-muted)] pt-1">
              ↓ {bottomLabel}
            </div>
          )}
        </div>
      )}
    </figure>
  );
}

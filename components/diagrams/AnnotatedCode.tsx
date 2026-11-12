'use client';

import React from 'react';
import { ArrowRight, CornerDownRight } from 'lucide-react';

export interface CodeBlockLine {
  lineNum?: number | string;
  code: string;
  badge?: string;
  badgeColor?: 'accent' | 'warning' | 'success' | 'purple';
  blockId?: string; // e.g. "B1", "B2"
}

export interface BlockBracket {
  blockId: string;
  label?: string;
  startLine: number;
  endLine: number;
  color?: string;
}

export interface MiniFlowEdge {
  from: string;
  to: string;
  label?: string;
  isLoop?: boolean;
}

export interface AnnotatedCodeProps {
  title?: string;
  ariaLabel: string;
  lines: CodeBlockLine[];
  brackets?: BlockBracket[];
  miniFlow?: {
    nodes: string[];
    edges: MiniFlowEdge[];
  };
}

export function AnnotatedCode({
  title,
  ariaLabel,
  lines,
  brackets,
  miniFlow,
}: AnnotatedCodeProps) {
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

      <div className="flex flex-col lg:flex-row gap-6 items-start">
        {/* Code Lines with Badges */}
        <div className="flex-1 w-full space-y-1 font-mono text-xs sm:text-[13px]">
          {lines.map((item, idx) => (
            <div
              key={idx}
              className={`flex items-center justify-between gap-3 p-1.5 rounded transition-all ${
                item.badge
                  ? 'bg-[var(--surface-2)] border-l-2 border-[var(--accent)]'
                  : 'hover:bg-[var(--surface-2)]/50'
              }`}
            >
              <div className="flex items-center gap-3 overflow-x-auto">
                {item.lineNum !== undefined && (
                  <span className="w-6 shrink-0 text-right text-[var(--text-muted)] select-none">
                    {item.lineNum}
                  </span>
                )}
                {item.blockId && (
                  <span className="px-1.5 py-0.2 rounded bg-[var(--accent)]/15 text-[var(--accent)] font-bold text-[10px] shrink-0">
                    {item.blockId}
                  </span>
                )}
                <span className="text-[var(--text)] whitespace-pre">{item.code}</span>
              </div>

              {item.badge && (
                <span className="px-2 py-0.5 rounded-[var(--r-sm)] bg-[var(--surface)] border border-[var(--border)] text-[var(--accent)] text-[11px] font-semibold shrink-0">
                  {item.badge}
                </span>
              )}
            </div>
          ))}
        </div>

        {/* Mini Flow Graph on right if provided */}
        {miniFlow && (
          <div className="w-full lg:w-48 shrink-0 p-3 rounded-[var(--r-md)] border border-[var(--border)] bg-[var(--surface-2)]">
            <div className="text-[11px] font-mono font-bold text-[var(--text-muted)] uppercase tracking-wider mb-3">
              Control Flow
            </div>
            <div className="space-y-3">
              {miniFlow.nodes.map((node, nIdx) => (
                <div key={nIdx} className="flex flex-col items-center">
                  <div className="px-3 py-1.5 rounded-[var(--r-sm)] border border-[var(--accent)] bg-[var(--accent-soft)] font-mono text-xs font-bold text-[var(--accent)]">
                    {node}
                  </div>
                  {nIdx < miniFlow.nodes.length - 1 && (
                    <div className="text-[var(--text-muted)] my-1">↓</div>
                  )}
                </div>
              ))}
              {miniFlow.edges.filter((e) => e.isLoop).map((e, idx) => (
                <div
                  key={idx}
                  className="mt-2 text-[10px] font-mono text-[var(--text-muted)] border-t border-[var(--border)] pt-2 text-center"
                >
                  Loop: {e.from} ↺ {e.to}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </figure>
  );
}

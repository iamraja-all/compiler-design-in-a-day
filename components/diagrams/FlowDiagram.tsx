'use client';

import React from 'react';
import { ArrowDown, ArrowRight, CornerDownLeft, CornerRightDown } from 'lucide-react';

export interface FlowStep {
  id: string;
  label: string;
  badge?: string;
  notes?: string[];
  subtext?: string;
  highlight?: boolean;
  type?: 'default' | 'accent' | 'secondary' | 'dashed';
}

export interface FlowEdge {
  from: string;
  to: string;
  label?: string;
  dashed?: boolean;
  bidirectional?: boolean;
  curved?: boolean;
  backArrow?: boolean;
}

export interface FlowDiagramProps {
  title?: string;
  ariaLabel: string;
  direction?: 'horizontal' | 'vertical' | 'responsive';
  steps?: FlowStep[];
  edges?: FlowEdge[];
  sideBoxes?: {
    title: string;
    description?: string;
    items?: string[];
    position?: 'right' | 'left' | 'bottom';
  }[];
  brackets?: {
    label: string;
    span: [number, number]; // index range of steps
    position: 'left' | 'right';
  }[];
  rows?: {
    rowTitle?: string;
    steps: FlowStep[];
  }[];
  customContent?: React.ReactNode;
}

export function FlowDiagram({
  title,
  ariaLabel,
  direction = 'vertical',
  steps = [],
  sideBoxes = [],
  brackets = [],
  rows,
  customContent,
}: FlowDiagramProps) {
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

      {customContent ? (
        customContent
      ) : rows ? (
        <div className="space-y-6">
          {rows.map((row, rIdx) => (
            <div key={rIdx} className="space-y-2">
              {row.rowTitle && (
                <div className="text-xs font-mono font-semibold text-[var(--text-muted)]">
                  {row.rowTitle}
                </div>
              )}
              <div className="flex flex-wrap items-center gap-3">
                {row.steps.map((step, sIdx) => (
                  <React.Fragment key={step.id}>
                    <div
                      className={`px-3 py-2 rounded-[var(--r-md)] border text-xs sm:text-sm font-mono transition-all ${
                        step.highlight
                          ? 'border-[var(--accent)] bg-[var(--accent-soft)] text-[var(--accent)] font-semibold'
                          : 'border-[var(--border)] bg-[var(--surface-2)] text-[var(--text)]'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        {step.badge && (
                          <span className="px-1.5 py-0.5 rounded-[var(--r-sm)] bg-[var(--accent)] text-[var(--bg)] text-[10px] font-bold">
                            {step.badge}
                          </span>
                        )}
                        <span>{step.label}</span>
                      </div>
                      {step.subtext && (
                        <div className="text-[11px] text-[var(--text-muted)] mt-1 font-sans">
                          {step.subtext}
                        </div>
                      )}
                    </div>
                    {sIdx < row.steps.length - 1 && (
                      <div className="text-[var(--text-muted)] flex items-center justify-center">
                        <ArrowRight className="w-4 h-4 shrink-0" />
                      </div>
                    )}
                  </React.Fragment>
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : direction === 'vertical' ? (
        <div className="flex flex-col md:flex-row gap-6 items-start justify-between">
          {/* Main vertical flow */}
          <div className="flex-1 w-full space-y-3">
            {steps.map((step, idx) => (
              <React.Fragment key={step.id}>
                <div
                  className={`p-3 rounded-[var(--r-md)] border transition-all ${
                    step.highlight
                      ? 'border-[var(--accent)] bg-[var(--accent-soft)] shadow-xs'
                      : 'border-[var(--border)] bg-[var(--surface-2)]'
                  }`}
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2 font-mono text-sm font-medium">
                      {step.badge && (
                        <span className="px-2 py-0.5 rounded-[var(--r-sm)] bg-[var(--surface)] border border-[var(--border)] text-[var(--accent)] text-xs font-semibold">
                          {step.badge}
                        </span>
                      )}
                      <span className="text-[var(--text)]">{step.label}</span>
                    </div>
                    {step.subtext && (
                      <span className="text-xs font-mono text-[var(--text-muted)]">
                        {step.subtext}
                      </span>
                    )}
                  </div>
                  {step.notes && step.notes.length > 0 && (
                    <ul className="mt-2 space-y-1 text-xs text-[var(--text-muted)] pl-4 list-disc font-sans">
                      {step.notes.map((note, nIdx) => (
                        <li key={nIdx}>{note}</li>
                      ))}
                    </ul>
                  )}
                </div>

                {idx < steps.length - 1 && (
                  <div className="flex flex-col items-center justify-center my-0.5 text-[var(--text-muted)]">
                    <ArrowDown className="w-4 h-4" />
                  </div>
                )}
              </React.Fragment>
            ))}
          </div>

          {/* Side boxes if any */}
          {sideBoxes.length > 0 && (
            <div className="w-full md:w-64 space-y-4 shrink-0 border-t md:border-t-0 md:border-l border-[var(--border)] pt-4 md:pt-0 md:pl-6">
              {sideBoxes.map((box, bIdx) => (
                <div
                  key={bIdx}
                  className="p-3 rounded-[var(--r-md)] border border-[var(--border)] bg-[var(--surface-2)] text-xs"
                >
                  <div className="font-mono font-semibold text-[var(--accent)] mb-1">
                    {box.title}
                  </div>
                  {box.description && (
                    <p className="text-[var(--text-muted)] mb-2 font-sans">
                      {box.description}
                    </p>
                  )}
                  {box.items && (
                    <ul className="space-y-1 text-[var(--text)] font-mono pl-3 list-disc">
                      {box.items.map((item, iIdx) => (
                        <li key={iIdx}>{item}</li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      ) : (
        /* Horizontal flow */
        <div className="flex flex-wrap items-center gap-3">
          {steps.map((step, idx) => (
            <React.Fragment key={step.id}>
              <div
                className={`p-3 rounded-[var(--r-md)] border text-xs sm:text-sm font-mono ${
                  step.highlight
                    ? 'border-[var(--accent)] bg-[var(--accent-soft)] text-[var(--accent)]'
                    : 'border-[var(--border)] bg-[var(--surface-2)] text-[var(--text)]'
                }`}
              >
                <div className="flex items-center gap-2">
                  {step.badge && (
                    <span className="px-1.5 py-0.5 rounded-[var(--r-sm)] bg-[var(--surface)] border border-[var(--border)] text-[var(--accent)] text-[10px] font-bold">
                      {step.badge}
                    </span>
                  )}
                  <span>{step.label}</span>
                </div>
                {step.subtext && (
                  <div className="text-[11px] text-[var(--text-muted)] mt-1 font-sans">
                    {step.subtext}
                  </div>
                )}
              </div>
              {idx < steps.length - 1 && (
                <div className="text-[var(--text-muted)] flex items-center justify-center">
                  <ArrowRight className="w-4 h-4 shrink-0" />
                </div>
              )}
            </React.Fragment>
          ))}
        </div>
      )}
    </figure>
  );
}

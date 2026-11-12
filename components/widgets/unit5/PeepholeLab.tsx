'use client';

import { useState } from 'react';
import { WidgetFrame } from '../shared/WidgetFrame';
import { PEEPHOLE_PATTERNS } from '../data/unit5';
import { ArrowRight, Eye } from 'lucide-react';

export function PeepholeLab() {
  const [selectedIdx, setSelectedIdx] = useState(0);

  const pattern = PEEPHOLE_PATTERNS[selectedIdx];

  return (
    <WidgetFrame
      title="Peephole Optimization Laboratory"
      notice="A short sliding window (2–3 instructions) scans target code for localized improvements"
      explanation={pattern.why}
    >
      <div className="space-y-6">
        {/* Pattern Selector */}
        <div className="flex flex-wrap gap-2">
          {PEEPHOLE_PATTERNS.map((p, idx) => (
            <button
              key={p.name}
              onClick={() => setSelectedIdx(idx)}
              className={`px-3 py-1.5 rounded-[var(--r-md)] border text-xs font-semibold cursor-pointer transition-colors ${
                selectedIdx === idx
                  ? 'bg-[var(--accent)] text-black border-[var(--accent)]'
                  : 'bg-[var(--surface)] text-[var(--text-muted)] border-[var(--border)] hover:text-[var(--text)]'
              }`}
            >
              {p.name}
            </button>
          ))}
        </div>

        {/* Sliding Window Visualization */}
        <div className="p-6 rounded-[var(--r-md)] bg-[var(--surface)] border border-[var(--border)] space-y-4 font-mono text-xs">
          <div className="flex items-center justify-between border-b border-[var(--border)] pb-2">
            <span className="font-bold text-[var(--text)] flex items-center gap-1.5">
              <Eye className="w-3.5 h-3.5 text-[var(--accent)]" />
              <span>Inspection Window: {pattern.name}</span>
            </span>
            <span className="text-[var(--accent)] text-[10px] uppercase font-bold">2-Line Window</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Window Before */}
            <div className="p-4 rounded-[var(--r-md)] bg-[var(--surface-2)] border-2 border-dashed border-[var(--border)] space-y-2">
              <span className="text-[10px] text-[var(--danger)] uppercase font-bold">
                Raw Instruction Window
              </span>
              <pre className="text-sm font-bold text-[var(--text)] m-0 leading-relaxed whitespace-pre">
                {pattern.before}
              </pre>
            </div>

            {/* Window After */}
            <div className="p-4 rounded-[var(--r-md)] bg-[var(--success)]/10 border-2 border-[var(--success)]/40 space-y-2">
              <span className="text-[10px] text-[var(--success)] uppercase font-bold">
                Peephole Transformation
              </span>
              <pre className="text-sm font-bold text-[var(--success)] m-0 leading-relaxed whitespace-pre">
                {pattern.after}
              </pre>
            </div>
          </div>
        </div>
      </div>
    </WidgetFrame>
  );
}

'use client';

import { useState } from 'react';
import { WidgetFrame } from '../shared/WidgetFrame';
import { ArrowRight, Sparkles } from 'lucide-react';

interface LeftRecursionPreset {
  original: string;
  alpha: string;
  beta: string;
  result: string[];
}

const LR_PRESETS: LeftRecursionPreset[] = [
  {
    original: 'E → E + T | T',
    alpha: '+ T',
    beta: 'T',
    result: ["E → T E'", "E' → + T E' | ε"],
  },
  {
    original: 'T → T * F | F',
    alpha: '* F',
    beta: 'F',
    result: ["T → F T'", "T' → * F T' | ε"],
  },
  {
    original: 'S → S a | b',
    alpha: 'a',
    beta: 'b',
    result: ["S → b S'", "S' → a S' | ε"],
  },
  {
    original: 'A → A c | A a d | b d | e',
    alpha: 'c, a d',
    beta: 'b d, e',
    result: ["A → b d A' | e A'", "A' → c A' | a d A' | ε"],
  },
];

export function LeftRecursionFixer() {
  const [tab, setTab] = useState<'recursion' | 'factoring'>('recursion');
  const [selectedPreset, setSelectedPreset] = useState(0);

  const preset = LR_PRESETS[selectedPreset];

  return (
    <WidgetFrame
      title="Eliminating Left Recursion & Left Factoring"
      notice="Top-down LL(1) parsers loop infinitely on left recursion; eliminate it before parsing"
      explanation={
        tab === 'recursion'
          ? "Formula: A → Aα | β becomes A → βA' and A' → αA' | ε. β must not start with A."
          : "Left Factoring delays decisions: A → αβ1 | αβ2 becomes A → αA' and A' → β1 | β2."
      }
    >
      <div className="space-y-6">
        {/* Mode tabs */}
        <div className="flex gap-2">
          <button
            onClick={() => setTab('recursion')}
            className={`px-3 py-1.5 rounded-[var(--r-md)] border text-xs font-semibold cursor-pointer transition-colors ${
              tab === 'recursion'
                ? 'bg-[var(--accent)] text-black border-[var(--accent)]'
                : 'bg-[var(--surface)] text-[var(--text-muted)] border-[var(--border)]'
            }`}
          >
            Immediate Left Recursion Elimination
          </button>
          <button
            onClick={() => setTab('factoring')}
            className={`px-3 py-1.5 rounded-[var(--r-md)] border text-xs font-semibold cursor-pointer transition-colors ${
              tab === 'factoring'
                ? 'bg-[var(--accent)] text-black border-[var(--accent)]'
                : 'bg-[var(--surface)] text-[var(--text-muted)] border-[var(--border)]'
            }`}
          >
            Left Factoring (Common Prefixes)
          </button>
        </div>

        {tab === 'recursion' ? (
          <div className="space-y-5">
            {/* Formula Card */}
            <div className="p-4 rounded-[var(--r-md)] bg-[var(--surface)] border border-[var(--border)] font-mono text-xs flex flex-wrap items-center justify-between gap-3">
              <span className="text-[var(--text-muted)]">Standard Transformation Rule:</span>
              <div className="flex items-center gap-2 font-bold text-sm">
                <span className="text-[var(--text)]">A → A<span className="text-[var(--danger)]">α</span> | <span className="text-[var(--success)]">β</span></span>
                <ArrowRight className="w-4 h-4 text-[var(--accent)]" />
                <span className="text-[var(--accent)]">A → <span className="text-[var(--success)]">β</span>A&apos; ; A&apos; → <span className="text-[var(--danger)]">α</span>A&apos; | ε</span>
              </div>
            </div>

            {/* Presets */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs text-[var(--text-muted)] font-mono">Exam Examples:</span>
              {LR_PRESETS.map((p, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedPreset(idx)}
                  className={`px-2.5 py-1 rounded-[var(--r-sm)] border font-mono text-xs cursor-pointer transition-colors ${
                    selectedPreset === idx
                      ? 'bg-[var(--accent-soft)] text-[var(--accent)] border-[var(--accent)] font-bold'
                      : 'bg-[var(--surface)] text-[var(--text-muted)] border-[var(--border)] hover:text-[var(--text)]'
                  }`}
                >
                  {p.original}
                </button>
              ))}
            </div>

            {/* Step breakdown */}
            <div className="p-5 rounded-[var(--r-md)] bg-[var(--surface)] border border-[var(--border)] space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono">
                <div className="p-3 rounded-[var(--r-sm)] bg-[var(--surface-2)] border border-[var(--border)] space-y-1">
                  <div className="text-[var(--text-muted)]">Identified α (loop body):</div>
                  <div className="text-base font-bold text-[var(--danger)]">{preset.alpha}</div>
                </div>
                <div className="p-3 rounded-[var(--r-sm)] bg-[var(--surface-2)] border border-[var(--border)] space-y-1">
                  <div className="text-[var(--text-muted)]">Identified β (base prefix):</div>
                  <div className="text-base font-bold text-[var(--success)]">{preset.beta}</div>
                </div>
              </div>

              <div className="p-4 rounded-[var(--r-sm)] bg-[var(--accent-soft)] border border-[var(--accent)]/30 font-mono text-sm space-y-1">
                <div className="text-xs font-semibold text-[var(--accent)] uppercase tracking-wider mb-2">
                  Transformed Grammar (No Left Recursion):
                </div>
                {preset.result.map((line, i) => (
                  <div key={i} className="font-bold text-[var(--text)]">{line}</div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          /* Left Factoring Tab */
          <div className="space-y-5">
            <div className="p-4 rounded-[var(--r-md)] bg-[var(--surface)] border border-[var(--border)] font-mono text-xs flex flex-wrap items-center justify-between gap-3">
              <span className="text-[var(--text-muted)]">Left Factoring Formula:</span>
              <div className="flex items-center gap-2 font-bold text-sm">
                <span className="text-[var(--text)]">A → <span className="text-[var(--accent)]">α</span>β1 | <span className="text-[var(--accent)]">α</span>β2</span>
                <ArrowRight className="w-4 h-4 text-[var(--accent)]" />
                <span className="text-[var(--accent)]">A → <span className="text-[var(--accent)]">α</span>A&apos; ; A&apos; → β1 | β2</span>
              </div>
            </div>

            <div className="p-5 rounded-[var(--r-md)] bg-[var(--surface)] border border-[var(--border)] space-y-4 text-xs font-mono">
              <div className="space-y-1">
                <span className="text-[var(--text-muted)]">Classic Dangling-Else Grammar:</span>
                <div className="p-3 rounded-[var(--r-sm)] bg-[var(--surface-2)] border border-[var(--border)] text-sm font-bold text-[var(--text)]">
                  S → i E t S | i E t S e S | a
                </div>
                <div className="text-[11px] text-[var(--warning)] mt-1">
                  Common prefix α = <code>i E t S</code>
                </div>
              </div>

              <div className="p-4 rounded-[var(--r-sm)] bg-[var(--accent-soft)] border border-[var(--accent)]/30 text-sm space-y-1">
                <div className="text-xs font-semibold text-[var(--accent)] uppercase tracking-wider mb-2">
                  Factored Grammar:
                </div>
                <div className="font-bold text-[var(--text)]">S → i E t S S&apos; | a</div>
                <div className="font-bold text-[var(--text)]">S&apos; → e S | ε</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </WidgetFrame>
  );
}

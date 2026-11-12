'use client';

import { useState } from 'react';
import { WidgetFrame } from '../shared/WidgetFrame';

export function AmbiguityTrees() {
  const [activeTab, setActiveTab] = useState<'tree1' | 'tree2' | 'unambig'>('tree1');

  return (
    <WidgetFrame
      title="Grammar Ambiguity: Two Trees for One String"
      notice="Grammar E → E + E | E * E | id evaluated on string: id + id * id"
      explanation="Same string, two different parse trees, two different numerical answers → the grammar is ambiguous."
    >
      <div className="space-y-6">
        {/* Tab selection */}
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setActiveTab('tree1')}
            className={`px-3 py-1.5 rounded-[var(--r-md)] border text-xs font-semibold cursor-pointer transition-colors ${
              activeTab === 'tree1'
                ? 'bg-[var(--accent)] text-black border-[var(--accent)]'
                : 'bg-[var(--surface)] text-[var(--text-muted)] border-[var(--border)]'
            }`}
          >
            Tree 1: Multiplies First (Correct Precedence)
          </button>
          <button
            onClick={() => setActiveTab('tree2')}
            className={`px-3 py-1.5 rounded-[var(--r-md)] border text-xs font-semibold cursor-pointer transition-colors ${
              activeTab === 'tree2'
                ? 'bg-[var(--danger)] text-white border-[var(--danger)]'
                : 'bg-[var(--surface)] text-[var(--text-muted)] border-[var(--border)]'
            }`}
          >
            Tree 2: Adds First (Wrong Precedence)
          </button>
          <button
            onClick={() => setActiveTab('unambig')}
            className={`px-3 py-1.5 rounded-[var(--r-md)] border text-xs font-semibold cursor-pointer transition-colors ${
              activeTab === 'unambig'
                ? 'bg-[var(--success)] text-black border-[var(--success)]'
                : 'bg-[var(--surface)] text-[var(--text-muted)] border-[var(--border)]'
            }`}
          >
            Unambiguous Grammar Fix
          </button>
        </div>

        {/* Tree Display Area */}
        <div className="p-6 rounded-[var(--r-md)] bg-[var(--surface)] border border-[var(--border)] min-h-[260px] flex flex-col justify-center">
          {activeTab === 'tree1' && (
            <div className="space-y-4">
              <div className="text-xs font-mono p-4 rounded-[var(--r-sm)] bg-[var(--code-bg)] border border-[var(--border)] text-[var(--text)] whitespace-pre leading-relaxed">
{`       E
      /|\\
     E +  E
     |   /|\\
    id  E *  E
        |    |
       id   id`}
              </div>
              <div className="p-3 rounded-[var(--r-sm)] bg-[var(--accent-soft)] border border-[var(--accent)]/30 text-xs font-mono text-[var(--text)]">
                Evaluation if id values are 2, 3, 4:
                <div className="text-base font-bold text-[var(--accent)] mt-1">
                  2 + (3 * 4) = 14  <span className="text-xs font-normal text-[var(--text-muted)]">(Standard operator precedence respected)</span>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'tree2' && (
            <div className="space-y-4">
              <div className="text-xs font-mono p-4 rounded-[var(--r-sm)] bg-[var(--code-bg)] border border-[var(--border)] text-[var(--text)] whitespace-pre leading-relaxed">
{`       E
      /|\\
     E *  E
    /|\\   |
   E +  E id
   |    |
  id   id`}
              </div>
              <div className="p-3 rounded-[var(--r-sm)] bg-[var(--danger)]/15 border border-[var(--danger)]/30 text-xs font-mono text-[var(--text)]">
                Evaluation if id values are 2, 3, 4:
                <div className="text-base font-bold text-[var(--danger)] mt-1">
                  (2 + 3) * 4 = 20  <span className="text-xs font-normal text-[var(--text-muted)]">(Addition incorrectly performed before multiplication!)</span>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'unambig' && (
            <div className="space-y-4">
              <div className="p-4 rounded-[var(--r-sm)] bg-[var(--surface-2)] border border-[var(--border)] text-xs font-mono space-y-2">
                <div className="font-bold text-[var(--success)]">Unambiguous Grammar Hierarchy:</div>
                <div className="text-[var(--text)]">E → E + T | T</div>
                <div className="text-[var(--text)]">T → T * F | F</div>
                <div className="text-[var(--text)]">F → ( E ) | id</div>
              </div>
              <p className="text-xs text-[var(--text-muted)] leading-relaxed m-0">
                By introducing precedence levels (Terms T and Factors F), this grammar mathematically guarantees only <strong className="text-[var(--text)]">Tree 1</strong> can ever be produced for <code>id + id * id</code>.
              </p>
            </div>
          )}
        </div>
      </div>
    </WidgetFrame>
  );
}

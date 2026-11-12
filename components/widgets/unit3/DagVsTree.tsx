'use client';

import { useState } from 'react';
import { WidgetFrame } from '../shared/WidgetFrame';
import { GitFork, Network } from 'lucide-react';

export function DagVsTree() {
  const [view, setView] = useState<'tree' | 'dag'>('dag');

  return (
    <WidgetFrame
      title="Syntax Tree vs Directed Acyclic Graph (DAG)"
      notice="Expression: a + a * (b - c) + (b - c) * d"
      explanation={
        view === 'dag'
          ? "In the DAG, redundant subexpressions 'a' and '(b - c)' are stored only once, with multiple incoming parent edges."
          : "In a standard syntax tree, common subexpressions are duplicated into independent subtrees."
      }
    >
      <div className="space-y-6">
        {/* Toggle View */}
        <div className="flex items-center justify-between p-3.5 rounded-[var(--r-md)] bg-[var(--surface)] border border-[var(--border)]">
          <div className="flex gap-2">
            <button
              onClick={() => setView('tree')}
              className={`px-3 py-1.5 rounded-[var(--r-sm)] border font-mono text-xs font-semibold cursor-pointer transition-colors ${
                view === 'tree'
                  ? 'bg-[var(--accent)] text-black border-[var(--accent)]'
                  : 'bg-[var(--surface-2)] text-[var(--text-muted)] border-[var(--border)]'
              }`}
            >
              Syntax Tree (Duplicated Subtrees)
            </button>
            <button
              onClick={() => setView('dag')}
              className={`px-3 py-1.5 rounded-[var(--r-sm)] border font-mono text-xs font-semibold cursor-pointer transition-colors ${
                view === 'dag'
                  ? 'bg-[var(--accent)] text-black border-[var(--accent)]'
                  : 'bg-[var(--surface-2)] text-[var(--text-muted)] border-[var(--border)]'
              }`}
            >
              DAG (Shared Common Subexpressions)
            </button>
          </div>

          <span className="text-xs font-mono text-[var(--accent)] font-semibold hidden sm:inline">
            {view === 'dag' ? '9 DAG Nodes (Optimized)' : '14 Tree Nodes'}
          </span>
        </div>

        {/* Visual Graph View */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
          <div className="md:col-span-7 p-6 rounded-[var(--r-md)] bg-[var(--surface)] border border-[var(--border)] font-mono text-xs min-h-[260px] flex flex-col justify-center">
            {view === 'tree' ? (
              <div className="p-4 rounded-[var(--r-sm)] bg-[var(--code-bg)] text-[var(--text)] whitespace-pre leading-relaxed overflow-x-auto">
{`              +
            /   \\
          +       *
        /   \\    / \\
       a     *  -   d
            / \\/ \\
           a   - b c
              / \\
             b   c`}
              </div>
            ) : (
              <div className="space-y-3">
                <div className="p-4 rounded-[var(--r-sm)] bg-[var(--code-bg)] text-[var(--text)] whitespace-pre leading-relaxed overflow-x-auto">
{`          + (node 9)
        /   \\
       /     \\
  (node 6) +   * (node 8)
          / \\ / \\
         /   X   d (node 7)
        /   / \\
       a   *   \\
  (node 1)  \\   \\
             \\ /
          − (node 4)
            / \\
           b   c
       (node 2)(node 3)`}
                </div>
                <div className="text-[11px] text-[var(--success)]">
                  ★ Notice node 1 (<code>a</code>) and node 4 (<code>b - c</code>) each have 2 incoming parent edges.
                </div>
              </div>
            )}
          </div>

          {/* Value Number Table for DAG */}
          <div className="md:col-span-5 rounded-[var(--r-md)] border border-[var(--border)] bg-[var(--surface)] overflow-hidden">
            <div className="px-3 py-2 bg-[var(--surface-2)] border-b border-[var(--border)] text-xs font-bold text-[var(--text)]">
              DAG Value-Number Array
            </div>
            <div className="max-h-64 overflow-y-auto">
              <table className="w-full text-left text-xs font-mono">
                <thead className="bg-[var(--surface-2)]/60 text-[var(--text-muted)] border-b border-[var(--border)]">
                  <tr>
                    <th className="px-3 py-1.5">#</th>
                    <th className="px-3 py-1.5">Node Expression</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { id: 1, val: 'id a', shared: true },
                    { id: 2, val: 'id b' },
                    { id: 3, val: 'id c' },
                    { id: 4, val: '− 2 3', shared: true },
                    { id: 5, val: '* 1 4' },
                    { id: 6, val: '+ 1 5' },
                    { id: 7, val: 'id d' },
                    { id: 8, val: '* 4 7' },
                    { id: 9, val: '+ 6 8 (root)' },
                  ].map((row) => (
                    <tr
                      key={row.id}
                      className={`border-b border-[var(--border)]/30 ${
                        row.shared ? 'bg-[var(--accent-soft)] font-bold' : ''
                      }`}
                    >
                      <td className="px-3 py-1.5 text-[var(--text-muted)]">{row.id}</td>
                      <td className="px-3 py-1.5 text-[var(--text)]">
                        {row.val}
                        {row.shared && <span className="text-[var(--accent)] ml-1.5">★ shared</span>}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </WidgetFrame>
  );
}

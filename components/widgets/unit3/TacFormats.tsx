'use client';

import { useState } from 'react';
import { WidgetFrame } from '../shared/WidgetFrame';
import { Shuffle } from 'lucide-react';

export function TacFormats() {
  const [tab, setTab] = useState<'tac' | 'quad' | 'triple' | 'indirect'>('tac');
  const [indirectSwapped, setIndirectSwapped] = useState(false);

  return (
    <WidgetFrame
      title="Three-Address Code Formats"
      notice="Comparing representations for expression: a = b * -c + b * -c"
      explanation={
        tab === 'indirect'
          ? "Indirect triples separate instructions from pointers. Swapping instructions reorders execution without modifying the triple array!"
          : tab === 'triple'
          ? "Triples omit explicit result names; operations refer to previous results by table indices (0), (1)..."
          : tab === 'quad'
          ? "Quadruples use 4 fields: op, arg1, arg2, and explicit result variable names."
          : "Three-Address Code (TAC) linearizes expressions into statements with at most one operator."
      }
    >
      <div className="space-y-6">
        {/* Tab selection */}
        <div className="flex flex-wrap gap-2">
          {(['tac', 'quad', 'triple', 'indirect'] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-3 py-1.5 rounded-[var(--r-md)] border text-xs font-semibold uppercase cursor-pointer transition-colors ${
                tab === t
                  ? 'bg-[var(--accent)] text-black border-[var(--accent)]'
                  : 'bg-[var(--surface)] text-[var(--text-muted)] border-[var(--border)]'
              }`}
            >
              {t === 'tac'
                ? 'Three-Address Code'
                : t === 'quad'
                ? 'Quadruples'
                : t === 'triple'
                ? 'Triples'
                : 'Indirect Triples'}
            </button>
          ))}
        </div>

        {/* Content Views */}
        {tab === 'tac' && (
          <div className="p-5 rounded-[var(--r-md)] bg-[var(--code-bg)] border border-[var(--border)] font-mono text-sm space-y-1 text-[var(--text)]">
            <div>t1 = minus c</div>
            <div>t2 = b * t1</div>
            <div>t3 = minus c</div>
            <div>t4 = b * t3</div>
            <div>t5 = t2 + t4</div>
            <div className="text-[var(--accent)] font-bold">a = t5</div>
          </div>
        )}

        {tab === 'quad' && (
          <div className="rounded-[var(--r-md)] border border-[var(--border)] bg-[var(--surface)] overflow-hidden">
            <table className="w-full text-center text-xs font-mono border-collapse">
              <thead className="bg-[var(--surface-2)] text-[var(--text)] border-b border-[var(--border)]">
                <tr>
                  <th className="px-3 py-2 border-r border-[var(--border)]">#</th>
                  <th className="px-3 py-2">op</th>
                  <th className="px-3 py-2">arg1</th>
                  <th className="px-3 py-2">arg2</th>
                  <th className="px-3 py-2 text-[var(--accent)]">result</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { id: '0', op: 'minus', arg1: 'c', arg2: '', res: 't1' },
                  { id: '1', op: '*', arg1: 'b', arg2: 't1', res: 't2' },
                  { id: '2', op: 'minus', arg1: 'c', arg2: '', res: 't3' },
                  { id: '3', op: '*', arg1: 'b', arg2: 't3', res: 't4' },
                  { id: '4', op: '+', arg1: 't2', arg2: 't4', res: 't5' },
                  { id: '5', op: '=', arg1: 't5', arg2: '', res: 'a' },
                ].map((row) => (
                  <tr key={row.id} className="border-b border-[var(--border)]/30">
                    <td className="px-3 py-1.5 font-bold border-r border-[var(--border)] text-[var(--text-muted)]">{row.id}</td>
                    <td className="px-3 py-1.5 text-[var(--warning)]">{row.op}</td>
                    <td className="px-3 py-1.5 text-[var(--text)]">{row.arg1}</td>
                    <td className="px-3 py-1.5 text-[var(--text)]">{row.arg2 || '—'}</td>
                    <td className="px-3 py-1.5 text-[var(--accent)] font-bold">{row.res}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {tab === 'triple' && (
          <div className="rounded-[var(--r-md)] border border-[var(--border)] bg-[var(--surface)] overflow-hidden">
            <table className="w-full text-center text-xs font-mono border-collapse">
              <thead className="bg-[var(--surface-2)] text-[var(--text)] border-b border-[var(--border)]">
                <tr>
                  <th className="px-3 py-2 border-r border-[var(--border)]">#</th>
                  <th className="px-3 py-2">op</th>
                  <th className="px-3 py-2">arg1</th>
                  <th className="px-3 py-2">arg2</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { id: '0', op: 'minus', arg1: 'c', arg2: '' },
                  { id: '1', op: '*', arg1: 'b', arg2: '(0)' },
                  { id: '2', op: 'minus', arg1: 'c', arg2: '' },
                  { id: '3', op: '*', arg1: 'b', arg2: '(2)' },
                  { id: '4', op: '+', arg1: '(1)', arg2: '(3)' },
                  { id: '5', op: '=', arg1: 'a', arg2: '(4)' },
                ].map((row) => (
                  <tr key={row.id} className="border-b border-[var(--border)]/30">
                    <td className="px-3 py-1.5 font-bold border-r border-[var(--border)] text-[var(--text-muted)]">({row.id})</td>
                    <td className="px-3 py-1.5 text-[var(--warning)]">{row.op}</td>
                    <td className="px-3 py-1.5 text-[var(--text)]">{row.arg1}</td>
                    <td className="px-3 py-1.5 text-[var(--accent)]">{row.arg2 || '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {tab === 'indirect' && (
          <div className="space-y-4 font-mono text-xs">
            <div className="flex items-center justify-between p-3 rounded-[var(--r-md)] bg-[var(--surface)] border border-[var(--border)]">
              <span className="text-[var(--text-muted)]">Pointer Array Optimization:</span>
              <button
                onClick={() => setIndirectSwapped(!indirectSwapped)}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-[var(--r-sm)] bg-[var(--accent)] text-black font-semibold cursor-pointer"
              >
                <Shuffle className="w-3.5 h-3.5" />
                <span>{indirectSwapped ? 'Reset Pointers' : 'Swap 35 & 36'}</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Pointer Array */}
              <div className="rounded-[var(--r-md)] border border-[var(--border)] bg-[var(--surface)] overflow-hidden">
                <div className="px-3 py-2 bg-[var(--surface-2)] text-[var(--accent)] font-bold border-b border-[var(--border)]">
                  Instruction Pointers
                </div>
                <div className="p-3 space-y-1">
                  <div>35 → <span className="font-bold text-[var(--accent)]">{indirectSwapped ? '(1)' : '(0)'}</span></div>
                  <div>36 → <span className="font-bold text-[var(--accent)]">{indirectSwapped ? '(0)' : '(1)'}</span></div>
                  <div>37 → (2)</div>
                  <div>38 → (3)</div>
                  <div>39 → (4)</div>
                  <div>40 → (5)</div>
                </div>
              </div>

              {/* Triple Table */}
              <div className="rounded-[var(--r-md)] border border-[var(--border)] bg-[var(--surface)] overflow-hidden">
                <div className="px-3 py-2 bg-[var(--surface-2)] text-[var(--text)] font-bold border-b border-[var(--border)]">
                  Underlying Triple Table (Untouched)
                </div>
                <div className="p-3 space-y-1 text-[var(--text-muted)]">
                  <div>(0) minus c</div>
                  <div>(1) * b (0)</div>
                  <div>(2) minus c</div>
                  <div>(3) * b (2)</div>
                  <div>(4) + (1) (3)</div>
                  <div>(5) = a (4)</div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </WidgetFrame>
  );
}

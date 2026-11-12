'use client';

import { useState } from 'react';
import { WidgetFrame } from '../shared/WidgetFrame';
import { StepperControls } from '../shared/StepperControls';
import { SLR_TRACE } from '../data/unit2';

const SLR_TABLE: Record<number, Record<string, string>> = {
  0: { id: 's5', '(': 's4', E: '1', T: '2', F: '3' },
  1: { '+': 's6', $: 'acc' },
  2: { '+': 'r2', '*': 's7', ')': 'r2', $: 'r2' },
  3: { '+': 'r4', '*': 'r4', ')': 'r4', $: 'r4' },
  4: { id: 's5', '(': 's4', E: '8', T: '2', F: '3' },
  5: { '+': 'r6', '*': 'r6', ')': 'r6', $: 'r6' },
  6: { id: 's5', '(': 's4', T: '9', F: '3' },
  7: { id: 's5', '(': 's4', F: '10' },
  8: { '+': 's6', ')': 's11' },
  9: { '+': 'r1', '*': 's7', ')': 'r1', $: 'r1' },
  10: { '+': 'r3', '*': 'r3', ')': 'r3', $: 'r3' },
  11: { '+': 'r5', '*': 'r5', ')': 'r5', $: 'r5' },
};

const ACTION_COLS = ['id', '+', '*', '(', ')', '$'];
const GOTO_COLS = ['E', 'T', 'F'];

export function SlrParser() {
  const [tab, setTab] = useState<'trace' | 'table'>('trace');
  const [currentStep, setCurrentStep] = useState(0);

  const traceStep = SLR_TRACE[currentStep];

  return (
    <WidgetFrame
      title="Simple LR (SLR) Parser Execution"
      notice="Resolves shift/reduce conflicts using FOLLOW sets (FOLLOW(E)={+,),$}, FOLLOW(T)=FOLLOW(F)={+,*,),$})"
      explanation={traceStep.say}
      controls={
        tab === 'trace' ? (
          <StepperControls
            currentStep={currentStep}
            totalSteps={SLR_TRACE.length}
            onStepChange={setCurrentStep}
          />
        ) : undefined
      }
    >
      <div className="space-y-6">
        {/* Tab switch */}
        <div className="flex gap-2">
          <button
            onClick={() => setTab('trace')}
            className={`px-3 py-1.5 rounded-[var(--r-md)] border text-xs font-semibold cursor-pointer transition-colors ${
              tab === 'trace'
                ? 'bg-[var(--accent)] text-black border-[var(--accent)]'
                : 'bg-[var(--surface)] text-[var(--text-muted)] border-[var(--border)]'
            }`}
          >
            Trace: id * id + id $
          </button>
          <button
            onClick={() => setTab('table')}
            className={`px-3 py-1.5 rounded-[var(--r-md)] border text-xs font-semibold cursor-pointer transition-colors ${
              tab === 'table'
                ? 'bg-[var(--accent)] text-black border-[var(--accent)]'
                : 'bg-[var(--surface)] text-[var(--text-muted)] border-[var(--border)]'
            }`}
          >
            Full SLR Parsing Table
          </button>
        </div>

        {tab === 'trace' ? (
          <div className="space-y-6">
            {/* Live Stack Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 font-mono text-xs">
              <div className="p-3.5 rounded-[var(--r-md)] bg-[var(--surface)] border border-[var(--border)] space-y-1">
                <div className="text-[10px] text-[var(--text-muted)] font-bold uppercase">State Stack</div>
                <div className="font-bold text-sm text-[var(--accent)] truncate">{traceStep.states}</div>
              </div>
              <div className="p-3.5 rounded-[var(--r-md)] bg-[var(--surface)] border border-[var(--border)] space-y-1">
                <div className="text-[10px] text-[var(--text-muted)] font-bold uppercase">Grammar Symbols</div>
                <div className="font-bold text-sm text-[var(--text)] truncate">{traceStep.symbols || '—'}</div>
              </div>
              <div className="p-3.5 rounded-[var(--r-md)] bg-[var(--surface)] border border-[var(--border)] space-y-1">
                <div className="text-[10px] text-[var(--text-muted)] font-bold uppercase">Input Buffer</div>
                <div className="font-bold text-sm text-[var(--warning)] truncate">{traceStep.input}</div>
              </div>
              <div className="p-3.5 rounded-[var(--r-md)] bg-[var(--surface)] border border-[var(--border)] space-y-1">
                <div className="text-[10px] text-[var(--text-muted)] font-bold uppercase">Action</div>
                <div className="font-bold text-sm text-[var(--success)] truncate">{traceStep.action}</div>
              </div>
            </div>

            {/* Shift-Reduce Trace Table */}
            <div className="rounded-[var(--r-md)] border border-[var(--border)] bg-[var(--surface)] overflow-hidden">
              <div className="max-h-56 overflow-y-auto">
                <table className="w-full text-left text-xs font-mono">
                  <thead className="bg-[var(--surface-2)] text-[var(--text-muted)] sticky top-0 border-b border-[var(--border)]">
                    <tr>
                      <th className="px-3 py-2">#</th>
                      <th className="px-3 py-2">Stack (States)</th>
                      <th className="px-3 py-2">Symbols</th>
                      <th className="px-3 py-2">Input</th>
                      <th className="px-3 py-2">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {SLR_TRACE.map((t, idx) => {
                      const isCurrent = idx === currentStep;
                      return (
                        <tr
                          key={t.step}
                          className={`border-b border-[var(--border)]/30 transition-colors ${
                            isCurrent ? 'bg-[var(--accent-soft)] font-bold text-[var(--accent)]' : ''
                          }`}
                        >
                          <td className="px-3 py-1.5 text-[var(--text-muted)]">{t.step}</td>
                          <td className="px-3 py-1.5">{t.states}</td>
                          <td className="px-3 py-1.5">{t.symbols || '—'}</td>
                          <td className="px-3 py-1.5">{t.input}</td>
                          <td className="px-3 py-1.5">{t.action}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        ) : (
          /* Table View */
          <div className="rounded-[var(--r-md)] border border-[var(--border)] bg-[var(--surface)] overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-center text-xs font-mono border-collapse">
                <thead className="bg-[var(--surface-2)] text-[var(--text)] border-b border-[var(--border)]">
                  <tr>
                    <th rowSpan={2} className="px-3 py-2 border-r border-[var(--border)]">State</th>
                    <th colSpan={6} className="px-3 py-1 border-r border-[var(--border)] text-[var(--accent)]">ACTION</th>
                    <th colSpan={3} className="px-3 py-1 text-[var(--warning)]">GOTO</th>
                  </tr>
                  <tr className="border-t border-[var(--border)]/60 text-[11px] text-[var(--text-muted)]">
                    {ACTION_COLS.map((c) => (
                      <th key={c} className="px-2.5 py-1">{c}</th>
                    ))}
                    {GOTO_COLS.map((c) => (
                      <th key={c} className="px-2.5 py-1">{c}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map((st) => (
                    <tr key={st} className="border-b border-[var(--border)]/30">
                      <td className="px-3 py-1.5 font-bold border-r border-[var(--border)] text-[var(--text)]">{st}</td>
                      {ACTION_COLS.map((col) => {
                        const val = SLR_TABLE[st]?.[col] || '';
                        return (
                          <td
                            key={col}
                            className={`px-2.5 py-1.5 ${
                              val.startsWith('s')
                                ? 'text-[var(--accent)] font-semibold'
                                : val.startsWith('r')
                                ? 'text-[var(--warning)] font-semibold'
                                : val === 'acc'
                                ? 'text-[var(--success)] font-bold'
                                : 'text-[var(--text-muted)] opacity-20'
                            }`}
                          >
                            {val || '—'}
                          </td>
                        );
                      })}
                      {GOTO_COLS.map((col) => {
                        const val = SLR_TABLE[st]?.[col] || '';
                        return (
                          <td
                            key={col}
                            className={`px-2.5 py-1.5 ${val ? 'text-[var(--purple)] font-bold' : 'text-[var(--text-muted)] opacity-20'}`}
                          >
                            {val || '—'}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </WidgetFrame>
  );
}

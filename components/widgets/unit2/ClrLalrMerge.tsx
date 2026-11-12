'use client';

import { useState } from 'react';
import { WidgetFrame } from '../shared/WidgetFrame';
import { StepperControls } from '../shared/StepperControls';
import { ArrowRight, Layers, Sparkles } from 'lucide-react';

const MERGE_STEPS = [
  {
    step: 0,
    title: 'Full CLR(1) Parsing Table (10 States)',
    say: 'CLR(1) uses LR(1) items with explicit lookaheads, producing 10 states for S → CC.',
    mergedPairs: [],
    showMergedTable: false,
  },
  {
    step: 1,
    title: 'Identify Identical LR(0) Cores',
    say: 'Notice state pairs with the exact same productions: (3, 6) both have C→c•C; (4, 7) both have C→d•; (8, 9) both have C→cC•.',
    mergedPairs: ['(3,6)', '(4,7)', '(8,9)'],
    showMergedTable: false,
  },
  {
    step: 2,
    title: 'Merge Cores → LALR(1) Parsing Table (7 States)',
    say: '10 states → 7 states. No shift/reduce or reduce/reduce conflicts appeared, so the grammar is LALR(1).',
    mergedPairs: ['36', '47', '89'],
    showMergedTable: true,
  },
];

export function ClrLalrMerge() {
  const [currentStep, setCurrentStep] = useState(0);
  const data = MERGE_STEPS[currentStep];

  return (
    <WidgetFrame
      title="CLR(1) to LALR(1) State Merging"
      notice="Grammar S → CC, C → cC | d: Merging identical cores shrinks parser tables without losing precedence"
      explanation={data.say}
      controls={
        <StepperControls
          currentStep={currentStep}
          totalSteps={MERGE_STEPS.length}
          onStepChange={setCurrentStep}
        />
      }
    >
      <div className="space-y-6">
        {/* Step Banner */}
        <div className="p-3.5 rounded-[var(--r-md)] bg-[var(--surface)] border border-[var(--border)] flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
          <span className="font-bold text-[var(--accent)]">{data.title}</span>
          <div className="flex items-center gap-2 text-[var(--text-muted)]">
            <span>Pairs merged:</span>
            <span className="px-2 py-0.5 rounded bg-[var(--accent-soft)] text-[var(--accent)] font-bold">
              (3,6)→36 · (4,7)→47 · (8,9)→89
            </span>
          </div>
        </div>

        {/* Table View: CLR or LALR */}
        {!data.showMergedTable ? (
          /* CLR 10-State Table */
          <div className="rounded-[var(--r-md)] border border-[var(--border)] bg-[var(--surface)] overflow-hidden">
            <div className="px-4 py-2 border-b border-[var(--border)] bg-[var(--surface-2)] text-xs font-semibold text-[var(--text)] flex items-center justify-between">
              <span>Canonical LR(1) Table (10 States)</span>
              <span className="text-[11px] text-[var(--warning)] font-mono">Notice identical core rows</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-center text-xs font-mono border-collapse">
                <thead className="bg-[var(--surface-2)]/60 text-[var(--text)] border-b border-[var(--border)]">
                  <tr>
                    <th className="px-3 py-2 border-r border-[var(--border)]">State</th>
                    <th className="px-3 py-2">c</th>
                    <th className="px-3 py-2">d</th>
                    <th className="px-3 py-2 border-r border-[var(--border)]">$</th>
                    <th className="px-3 py-2">S</th>
                    <th className="px-3 py-2">C</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { st: '0', c: 's3', d: 's4', $: '', S: '1', C: '2' },
                    { st: '1', c: '', d: '', $: 'acc', S: '', C: '' },
                    { st: '2', c: 's6', d: 's7', $: '', S: '', C: '5' },
                    { st: '3', c: 's3', d: 's4', $: '', S: '', C: '8', highlight: true },
                    { st: '4', c: 'r3', d: 'r3', $: '', S: '', C: '', highlight: true },
                    { st: '5', c: '', d: '', $: 'r1', S: '', C: '' },
                    { st: '6', c: 's6', d: 's7', $: '', S: '', C: '9', highlight: true },
                    { st: '7', c: '', d: '', $: 'r3', S: '', C: '', highlight: true },
                    { st: '8', c: 'r2', d: 'r2', $: '', S: '', C: '', highlight: true },
                    { st: '9', c: '', d: '', $: 'r2', S: '', C: '', highlight: true },
                  ].map((row) => (
                    <tr
                      key={row.st}
                      className={`border-b border-[var(--border)]/30 transition-colors ${
                        data.step === 1 && row.highlight
                          ? 'bg-[var(--accent-soft)] font-bold'
                          : ''
                      }`}
                    >
                      <td className="px-3 py-1.5 font-bold border-r border-[var(--border)] text-[var(--text)]">
                        {row.st}
                      </td>
                      <td className="px-3 py-1.5 text-[var(--accent)]">{row.c || '—'}</td>
                      <td className="px-3 py-1.5 text-[var(--accent)]">{row.d || '—'}</td>
                      <td className="px-3 py-1.5 border-r border-[var(--border)] text-[var(--success)]">{row.$ || '—'}</td>
                      <td className="px-3 py-1.5 text-[var(--warning)]">{row.S || '—'}</td>
                      <td className="px-3 py-1.5 text-[var(--warning)]">{row.C || '—'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          /* LALR 7-State Table */
          <div className="rounded-[var(--r-md)] border border-[var(--border)] bg-[var(--surface)] overflow-hidden">
            <div className="px-4 py-2 border-b border-[var(--border)] bg-[var(--surface-2)] text-xs font-semibold text-[var(--success)] flex items-center justify-between">
              <span>LALR(1) Merged Table (7 States)</span>
              <span className="text-[11px] font-mono text-[var(--text-muted)]">30% Memory Savings</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-center text-xs font-mono border-collapse">
                <thead className="bg-[var(--surface-2)]/60 text-[var(--text)] border-b border-[var(--border)]">
                  <tr>
                    <th className="px-3 py-2 border-r border-[var(--border)]">State</th>
                    <th className="px-3 py-2">c</th>
                    <th className="px-3 py-2">d</th>
                    <th className="px-3 py-2 border-r border-[var(--border)]">$</th>
                    <th className="px-3 py-2">S</th>
                    <th className="px-3 py-2">C</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { st: '0', c: 's36', d: 's47', $: '', S: '1', C: '2' },
                    { st: '1', c: '', d: '', $: 'acc', S: '', C: '' },
                    { st: '2', c: 's36', d: 's47', $: '', S: '', C: '5' },
                    { st: '36', c: 's36', d: 's47', $: '', S: '', C: '89', merged: true },
                    { st: '47', c: 'r3', d: 'r3', $: 'r3', S: '', C: '', merged: true },
                    { st: '5', c: '', d: '', $: 'r1', S: '', C: '' },
                    { st: '89', c: 'r2', d: 'r2', $: 'r2', S: '', C: '', merged: true },
                  ].map((row) => (
                    <tr
                      key={row.st}
                      className={`border-b border-[var(--border)]/30 ${
                        row.merged ? 'bg-[var(--success)]/10 font-bold' : ''
                      }`}
                    >
                      <td className="px-3 py-1.5 font-bold border-r border-[var(--border)] text-[var(--accent)]">
                        {row.st}
                      </td>
                      <td className="px-3 py-1.5 text-[var(--accent)]">{row.c || '—'}</td>
                      <td className="px-3 py-1.5 text-[var(--accent)]">{row.d || '—'}</td>
                      <td className="px-3 py-1.5 border-r border-[var(--border)] text-[var(--success)]">{row.$ || '—'}</td>
                      <td className="px-3 py-1.5 text-[var(--warning)]">{row.S || '—'}</td>
                      <td className="px-3 py-1.5 text-[var(--warning)]">{row.C || '—'}</td>
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

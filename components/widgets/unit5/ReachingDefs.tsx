'use client';

import { useState } from 'react';
import { WidgetFrame } from '../shared/WidgetFrame';
import { StepperControls } from '../shared/StepperControls';

interface DefTableRow {
  b: string;
  gen: string;
  kill: string;
  in: string;
  out: string;
  changed?: string[];
}

interface IterationStep {
  pass: number;
  title: string;
  say: string;
  table: DefTableRow[];
}

const ITERATION_STEPS: IterationStep[] = [
  {
    pass: 0,
    title: 'Initial State: GEN and KILL Bit Vectors',
    say: 'Each definition d1..d7 is represented as a 7-bit vector. All OUT sets start at 000 0000.',
    table: [
      { b: 'B1', gen: '111 0000', kill: '000 1111', in: '000 0000', out: '000 0000' },
      { b: 'B2', gen: '000 1100', kill: '110 0001', in: '000 0000', out: '000 0000' },
      { b: 'B3', gen: '000 0010', kill: '001 0000', in: '000 0000', out: '000 0000' },
      { b: 'B4', gen: '000 0001', kill: '100 1000', in: '000 0000', out: '000 0000' },
    ],
  },
  {
    pass: 1,
    title: 'Pass 1 Iteration (order B1, B2, B3, B4)',
    say: 'Apply equations: IN[B] = ∪ OUT[pred]; OUT[B] = GEN[B] ∪ (IN[B] − KILL[B]). First pass pushes definitions forward.',
    table: [
      { b: 'B1', gen: '111 0000', kill: '000 1111', in: '000 0000', out: '111 0000' },
      { b: 'B2', gen: '000 1100', kill: '110 0001', in: '111 0000', out: '001 1100' },
      { b: 'B3', gen: '000 0010', kill: '001 0000', in: '001 1100', out: '000 1110' },
      { b: 'B4', gen: '000 0001', kill: '100 1000', in: '001 1110', out: '001 0111' },
    ],
  },
  {
    pass: 2,
    title: 'Pass 2 Iteration: Feedback from B4 to B2 Loop',
    say: 'Due to the back-edge loop B4 → B2, OUT[B4] flows into IN[B2]. Cells IN[B2], OUT[B2], and IN[B3] change.',
    table: [
      { b: 'B1', gen: '111 0000', kill: '000 1111', in: '000 0000', out: '111 0000', changed: [] },
      { b: 'B2', gen: '000 1100', kill: '110 0001', in: '111 0111', out: '001 1110', changed: ['in', 'out'] },
      { b: 'B3', gen: '000 0010', kill: '001 0000', in: '001 1110', out: '000 1110', changed: ['in'] },
      { b: 'B4', gen: '000 0001', kill: '100 1000', in: '001 1110', out: '001 0111', changed: [] },
    ],
  },
  {
    pass: 3,
    title: 'Pass 3: Convergence (Fixed Point Reached)',
    say: 'Pass 3 yields identical OUT bit vectors for all blocks. No changes → algorithm terminates at fixed point!',
    table: [
      { b: 'B1', gen: '111 0000', kill: '000 1111', in: '000 0000', out: '111 0000' },
      { b: 'B2', gen: '000 1100', kill: '110 0001', in: '111 0111', out: '001 1110' },
      { b: 'B3', gen: '000 0010', kill: '001 0000', in: '001 1110', out: '000 1110' },
      { b: 'B4', gen: '000 0001', kill: '100 1000', in: '001 1110', out: '001 0111' },
    ],
  },
];

export function ReachingDefs() {
  const [currentStep, setCurrentStep] = useState(2); // Show pass 2 by default
  const data = ITERATION_STEPS[currentStep];

  return (
    <WidgetFrame
      title="Data-Flow Analysis: Reaching Definitions Stepper"
      notice="Iterative solver over flow graph B1..B4 using 7-bit vectors (d1..d7)"
      explanation={data.say}
      controls={
        <StepperControls
          currentStep={currentStep}
          totalSteps={ITERATION_STEPS.length}
          onStepChange={setCurrentStep}
        />
      }
    >
      <div className="space-y-6">
        {/* Equations banner */}
        <div className="p-3.5 rounded-[var(--r-md)] bg-[var(--surface)] border border-[var(--border)] font-mono text-xs flex flex-wrap items-center justify-between gap-3">
          <span className="text-[var(--text-muted)] font-bold">Data-Flow Equations:</span>
          <span className="text-[var(--accent)] font-bold">
            IN[B] = ∪ OUT[pred] · OUT[B] = GEN[B] ∪ (IN[B] − KILL[B])
          </span>
        </div>

        {/* Data-flow Iteration Table */}
        <div className="rounded-[var(--r-md)] border border-[var(--border)] bg-[var(--surface)] overflow-hidden">
          <div className="px-4 py-2.5 border-b border-[var(--border)] bg-[var(--surface-2)] flex items-center justify-between text-xs font-semibold">
            <span className="text-[var(--text)]">{data.title}</span>
            <span className="text-[10px] font-mono text-[var(--accent)]">Bits: d1 d2 d3 d4 d5 d6 d7</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-center text-xs font-mono border-collapse">
              <thead className="bg-[var(--surface-2)]/60 text-[var(--text-muted)] border-b border-[var(--border)]">
                <tr>
                  <th className="px-3 py-2 border-r border-[var(--border)]">Block</th>
                  <th className="px-3 py-2">GEN</th>
                  <th className="px-3 py-2 border-r border-[var(--border)]">KILL</th>
                  <th className="px-3 py-2 text-[var(--accent)]">IN[B]</th>
                  <th className="px-3 py-2 text-[var(--success)]">OUT[B]</th>
                </tr>
              </thead>
              <tbody>
                {data.table.map((row) => {
                  const inChanged = row.changed?.includes('in');
                  const outChanged = row.changed?.includes('out');

                  return (
                    <tr key={row.b} className="border-b border-[var(--border)]/30">
                      <td className="px-3 py-2 font-bold border-r border-[var(--border)] text-[var(--text)]">
                        {row.b}
                      </td>
                      <td className="px-3 py-2 text-[var(--text-muted)]">{row.gen}</td>
                      <td className="px-3 py-2 border-r border-[var(--border)] text-[var(--text-muted)]">{row.kill}</td>
                      <td
                        className={`px-3 py-2 ${
                          inChanged
                            ? 'bg-[var(--accent-soft)] text-[var(--accent)] font-bold animate-pulse'
                            : 'text-[var(--accent)] font-semibold'
                        }`}
                      >
                        {row.in}
                        {inChanged && ' ★'}
                      </td>
                      <td
                        className={`px-3 py-2 ${
                          outChanged
                            ? 'bg-[var(--success)]/20 text-[var(--success)] font-bold animate-pulse'
                            : 'text-[var(--success)] font-semibold'
                        }`}
                      >
                        {row.out}
                        {outChanged && ' ★'}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </WidgetFrame>
  );
}

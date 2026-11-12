'use client';

import { useState } from 'react';
import { WidgetFrame } from '../shared/WidgetFrame';
import { StepperControls } from '../shared/StepperControls';
import { MINIMIZATION_STEPS } from '../data/unit1';

export function DfaMinimization() {
  const [currentStep, setCurrentStep] = useState(0);
  const data = MINIMIZATION_STEPS[currentStep];

  return (
    <WidgetFrame
      title="DFA Minimization via Equivalence Partitioning"
      notice="Splits states that distinguish on input symbols until all groups are completely stable"
      explanation={data.say}
      controls={
        <StepperControls
          currentStep={currentStep}
          totalSteps={MINIMIZATION_STEPS.length}
          onStepChange={setCurrentStep}
        />
      }
    >
      <div className="space-y-6">
        {/* Step Header */}
        <div className="flex items-center justify-between p-3.5 rounded-[var(--r-md)] bg-[var(--surface)] border border-[var(--border)] font-mono text-xs">
          <span className="font-bold text-[var(--accent)]">{data.title}</span>
          <span className="text-[var(--text-muted)]">Step {data.step} of {MINIMIZATION_STEPS.length}</span>
        </div>

        {/* Partition groups as visual boxes */}
        <div className="space-y-2">
          <div className="text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)]">
            Current Partitions:
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
            {data.groups.map((grp, idx) => (
              <div
                key={idx}
                className={`p-4 rounded-[var(--r-md)] border text-center transition-all ${
                  grp.isAccepting
                    ? 'bg-[var(--success)]/10 border-[var(--success)]/40 text-[var(--success)]'
                    : 'bg-[var(--surface)] border-[var(--border)] text-[var(--text)]'
                }`}
              >
                <div className="text-[10px] font-mono uppercase tracking-wider text-[var(--text-muted)] mb-2 font-semibold">
                  {grp.name}
                </div>
                <div className="flex flex-wrap items-center justify-center gap-2 font-mono text-lg font-bold">
                  {grp.states.map((st) => (
                    <span
                      key={st}
                      className="px-2.5 py-1 rounded-[var(--r-sm)] bg-[var(--surface-2)] border border-[var(--border)] text-[var(--text)]"
                    >
                      {st}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Transition inspection table */}
        <div className="rounded-[var(--r-md)] border border-[var(--border)] bg-[var(--surface)] overflow-hidden">
          <div className="px-4 py-2.5 border-b border-[var(--border)] bg-[var(--surface-2)] text-xs font-semibold text-[var(--text)]">
            5-State Transition Behavior Reference
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead className="bg-[var(--surface-2)]/60 text-[var(--text-muted)] border-b border-[var(--border)]">
                <tr>
                  <th className="px-3 py-2">State</th>
                  <th className="px-3 py-2">on &apos;a&apos;</th>
                  <th className="px-3 py-2">on &apos;b&apos;</th>
                  <th className="px-3 py-2">Target Group on &apos;b&apos;</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-[var(--border)]/30">
                  <td className="px-3 py-1.5 font-bold">A</td>
                  <td className="px-3 py-1.5">B</td>
                  <td className="px-3 py-1.5">C</td>
                  <td className="px-3 py-1.5 text-[var(--accent)]">{'{A, C}'}</td>
                </tr>
                <tr className="border-b border-[var(--border)]/30">
                  <td className="px-3 py-1.5 font-bold">B</td>
                  <td className="px-3 py-1.5">B</td>
                  <td className="px-3 py-1.5">D</td>
                  <td className="px-3 py-1.5 text-[var(--warning)]">{'{D}'} (differs!)</td>
                </tr>
                <tr className="border-b border-[var(--border)]/30">
                  <td className="px-3 py-1.5 font-bold">C</td>
                  <td className="px-3 py-1.5">B</td>
                  <td className="px-3 py-1.5">C</td>
                  <td className="px-3 py-1.5 text-[var(--accent)]">{'{A, C}'}</td>
                </tr>
                <tr className="border-b border-[var(--border)]/30">
                  <td className="px-3 py-1.5 font-bold">D</td>
                  <td className="px-3 py-1.5">B</td>
                  <td className="px-3 py-1.5">E</td>
                  <td className="px-3 py-1.5 text-[var(--danger)]">{'{E}'} (accepting group)</td>
                </tr>
                <tr>
                  <td className="px-3 py-1.5 font-bold text-[var(--success)]">*E</td>
                  <td className="px-3 py-1.5">B</td>
                  <td className="px-3 py-1.5">C</td>
                  <td className="px-3 py-1.5 text-[var(--text-muted)]">{'{A, C}'}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </WidgetFrame>
  );
}

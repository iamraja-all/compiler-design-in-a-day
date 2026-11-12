'use client';

import { useState } from 'react';
import { WidgetFrame } from '../shared/WidgetFrame';
import { StepperControls } from '../shared/StepperControls';
import { FIRST_FOLLOW_STEPS } from '../data/unit2';

export function FirstFollowStepper() {
  const [currentStep, setCurrentStep] = useState(0);
  const data = FIRST_FOLLOW_STEPS[currentStep];

  return (
    <WidgetFrame
      title="FIRST and FOLLOW Step-by-Step Computation"
      notice="Watch the table fill rule by rule for the arithmetic expression grammar"
      explanation={data.say}
      controls={
        <StepperControls
          currentStep={currentStep}
          totalSteps={FIRST_FOLLOW_STEPS.length}
          onStepChange={setCurrentStep}
        />
      }
    >
      <div className="space-y-6">
        {/* Grammar Reference Card */}
        <div className="p-3.5 rounded-[var(--r-md)] bg-[var(--surface)] border border-[var(--border)] font-mono text-xs flex flex-wrap items-center justify-between gap-3">
          <span className="text-[var(--text-muted)] font-semibold uppercase">Grammar:</span>
          <div className="flex flex-wrap gap-3 font-semibold text-[var(--text)]">
            <span>E → T E&apos;</span>
            <span>E&apos; → + T E&apos; | ε</span>
            <span>T → F T&apos;</span>
            <span>T&apos; → * F T&apos; | ε</span>
            <span>F → ( E ) | id</span>
          </div>
        </div>

        {/* Current computation banner */}
        <div className="p-3.5 rounded-[var(--r-md)] bg-[var(--accent-soft)] border border-[var(--accent)]/30 font-mono text-xs flex items-center justify-between">
          <span className="font-semibold text-[var(--accent)]">
            Step {data.step}: Calculating {data.target}({data.nt})
          </span>
          <span className="font-bold text-[var(--text)]">{data.result}</span>
        </div>

        {/* FIRST & FOLLOW Result Table */}
        <div className="rounded-[var(--r-md)] border border-[var(--border)] bg-[var(--surface)] overflow-hidden">
          <table className="w-full text-left text-xs font-mono border-collapse">
            <thead className="bg-[var(--surface-2)] text-[var(--text)] border-b border-[var(--border)]">
              <tr>
                <th className="px-4 py-2.5">Non-terminal</th>
                <th className="px-4 py-2.5">FIRST Set</th>
                <th className="px-4 py-2.5">FOLLOW Set</th>
              </tr>
            </thead>
            <tbody>
              {(['E', "E'", 'T', "T'", 'F'] as const).map((nt) => {
                const row = data.table[nt];
                const isCurrentRow = data.nt === nt;

                return (
                  <tr
                    key={nt}
                    className={`border-b border-[var(--border)]/30 transition-colors ${
                      isCurrentRow ? 'bg-[var(--accent-soft)] font-bold' : ''
                    }`}
                  >
                    <td className="px-4 py-2 font-bold text-[var(--accent)]">{nt}</td>
                    <td
                      className={`px-4 py-2 ${
                        isCurrentRow && data.target === 'FIRST'
                          ? 'text-[var(--accent)] font-bold'
                          : 'text-[var(--text)]'
                      }`}
                    >
                      {row.first}
                    </td>
                    <td
                      className={`px-4 py-2 ${
                        isCurrentRow && data.target === 'FOLLOW'
                          ? 'text-[var(--warning)] font-bold'
                          : 'text-[var(--text-muted)]'
                      }`}
                    >
                      {row.follow}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </WidgetFrame>
  );
}

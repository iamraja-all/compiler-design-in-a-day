'use client';

import { useState } from 'react';
import { WidgetFrame } from '../shared/WidgetFrame';
import { StepperControls } from '../shared/StepperControls';
import { CODEGEN_STEPS } from '../data/unit4';

export function CodegenStepper() {
  const [currentStep, setCurrentStep] = useState(0);
  const data = CODEGEN_STEPS[currentStep];

  return (
    <WidgetFrame
      title="Target Code Generation & Register Allocation"
      notice="TAC: d = (a - b) + (a - c) + (a - c) with 2 available registers (R0, R1)"
      explanation={data.say}
      controls={
        <StepperControls
          currentStep={currentStep}
          totalSteps={CODEGEN_STEPS.length}
          onStepChange={setCurrentStep}
        />
      }
    >
      <div className="space-y-6">
        {/* Cost rule card */}
        <div className="p-3.5 rounded-[var(--r-md)] bg-[var(--surface)] border border-[var(--border)] font-mono text-xs flex flex-wrap items-center justify-between gap-3">
          <span className="text-[var(--text-muted)] font-bold">Cost Model:</span>
          <span className="text-[var(--accent)]">
            Cost = 1 per instruction word + 1 per memory operand/constant; register operands are free (0).
          </span>
        </div>

        {/* Register and Address Descriptors Visualizer */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 font-mono text-xs">
          <div className="p-4 rounded-[var(--r-md)] bg-[var(--surface)] border border-[var(--border)] space-y-2">
            <div className="text-[10px] text-[var(--text-muted)] uppercase font-bold">
              Register Descriptor (What each register holds)
            </div>
            <div className="p-2.5 rounded bg-[var(--surface-2)] text-sm font-bold text-[var(--accent)] border border-[var(--border)]">
              {data.rDesc}
            </div>
          </div>

          <div className="p-4 rounded-[var(--r-md)] bg-[var(--surface)] border border-[var(--border)] space-y-2">
            <div className="text-[10px] text-[var(--text-muted)] uppercase font-bold">
              Address Descriptor (Where each variable is located)
            </div>
            <div className="p-2.5 rounded bg-[var(--surface-2)] text-sm font-bold text-[var(--warning)] border border-[var(--border)]">
              {data.aDesc}
            </div>
          </div>
        </div>

        {/* Assembly Generation Table */}
        <div className="rounded-[var(--r-md)] border border-[var(--border)] bg-[var(--surface)] overflow-hidden">
          <table className="w-full text-left text-xs font-mono border-collapse">
            <thead className="bg-[var(--surface-2)] text-[var(--text)] border-b border-[var(--border)]">
              <tr>
                <th className="px-4 py-2">TAC Statement</th>
                <th className="px-4 py-2">Generated Target Code</th>
                <th className="px-4 py-2 text-right">Cost</th>
              </tr>
            </thead>
            <tbody>
              {CODEGEN_STEPS.slice(0, currentStep + 1).map((s, idx) => (
                <tr
                  key={idx}
                  className={`border-b border-[var(--border)]/30 ${
                    idx === currentStep ? 'bg-[var(--accent-soft)] font-bold' : ''
                  }`}
                >
                  <td className="px-4 py-2 text-[var(--text)]">{s.tac}</td>
                  <td className="px-4 py-2 text-[var(--accent)]">{s.code}</td>
                  <td className="px-4 py-2 text-right text-[var(--warning)]">{s.cost}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex items-center justify-between text-xs font-mono text-[var(--text-muted)] pt-1">
          <span>Cumulative Cost after Step {data.step}:</span>
          <span className="font-bold text-[var(--accent)] text-sm">
            Total Target Cost: {currentStep === 4 ? '12 Words' : 'Computing...'}
          </span>
        </div>
      </div>
    </WidgetFrame>
  );
}

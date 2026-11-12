'use client';

import { useState } from 'react';
import { WidgetFrame } from '../shared/WidgetFrame';
import { StepperControls } from '../shared/StepperControls';
import { ACTIVATION_STEPS } from '../data/unit4';

export function ActivationStack() {
  const [currentStep, setCurrentStep] = useState(0);
  const data = ACTIVATION_STEPS[currentStep];

  return (
    <WidgetFrame
      title="Activation Record & Run-Time Stack Lifecycle"
      notice="Recursive function: int fact(int n) called with n=3 from main()"
      explanation={data.say}
      controls={
        <StepperControls
          currentStep={currentStep}
          totalSteps={ACTIVATION_STEPS.length}
          onStepChange={setCurrentStep}
        />
      }
    >
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start font-mono text-xs">
          {/* Left: Standard Process Memory Architecture */}
          <div className="md:col-span-4 rounded-[var(--r-md)] border border-[var(--border)] bg-[var(--surface)] overflow-hidden">
            <div className="px-3 py-2 bg-[var(--surface-2)] border-b border-[var(--border)] font-bold text-[var(--text)]">
              Process Address Space
            </div>
            <div className="p-3 space-y-1.5 text-center">
              <div className="p-2 rounded bg-[var(--surface-2)] text-[var(--text-muted)] border border-[var(--border)]">
                Text / Machine Code
              </div>
              <div className="p-2 rounded bg-[var(--surface-2)] text-[var(--text-muted)] border border-[var(--border)]">
                Static / Global Data
              </div>
              <div className="p-2 rounded bg-[var(--surface-2)] text-[var(--warning)] border border-[var(--border)]">
                Heap ↓ (dynamic malloc)
              </div>
              <div className="py-2 text-[10px] text-[var(--text-muted)] italic">
                ↕ Free Space ↕
              </div>
              <div className="p-2 rounded bg-[var(--accent-soft)] text-[var(--accent)] font-bold border border-[var(--accent)]/40">
                Stack ↑ (activation records)
              </div>
            </div>
          </div>

          {/* Right: Active Activation Record Stack */}
          <div className="md:col-span-8 rounded-[var(--r-md)] border border-[var(--border)] bg-[var(--surface)] p-4 space-y-4">
            <div className="flex items-center justify-between border-b border-[var(--border)] pb-2">
              <span className="font-bold text-[var(--text)]">Runtime Call Stack (Grows upward)</span>
              <span className="text-[var(--text-muted)]">Call Path: {data.tree}</span>
            </div>

            <div className="space-y-2.5 flex flex-col-reverse">
              {data.stack.map((frame, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-[var(--r-md)] bg-[var(--surface-2)] border border-[var(--border)] border-l-4 border-l-[var(--accent)] shadow-xs space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-sm text-[var(--accent)]">{frame}</span>
                    <span className="text-[10px] text-[var(--text-muted)] uppercase">
                      Activation Record #{idx + 1}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 text-[10px] text-[var(--text-muted)]">
                    <div className="p-1 rounded bg-[var(--surface)] border border-[var(--border)]">Return Value</div>
                    <div className="p-1 rounded bg-[var(--surface)] border border-[var(--border)]">Actual Params</div>
                    <div className="p-1 rounded bg-[var(--surface)] border border-[var(--border)]">Control Link</div>
                    <div className="p-1 rounded bg-[var(--surface)] border border-[var(--border)]">Saved Status</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </WidgetFrame>
  );
}

'use client';

import { useState } from 'react';
import { WidgetFrame } from '../shared/WidgetFrame';
import { StepperControls } from '../shared/StepperControls';
import { BACKPATCH_STEPS } from '../data/unit3';

export function BackpatchStepper() {
  const [currentStep, setCurrentStep] = useState(0);
  const data = BACKPATCH_STEPS[currentStep];

  return (
    <WidgetFrame
      title="Backpatching Boolean Expressions in a Single Pass"
      notice="Expression: a < b || c < d && e < f (nextinstr initialized to 100)"
      explanation={data.say}
      controls={
        <StepperControls
          currentStep={currentStep}
          totalSteps={BACKPATCH_STEPS.length}
          onStepChange={setCurrentStep}
        />
      }
    >
      <div className="space-y-6">
        {/* State banner */}
        <div className="p-3.5 rounded-[var(--r-md)] bg-[var(--surface)] border border-[var(--border)] font-mono text-xs flex flex-wrap items-center justify-between gap-3">
          <span className="text-[var(--text-muted)] font-bold">List State:</span>
          <span className="text-[var(--accent)] font-bold">{data.state}</span>
        </div>

        {/* Emitted Instructions Listing */}
        <div className="p-5 rounded-[var(--r-md)] bg-[var(--code-bg)] border border-[var(--border)] font-mono text-xs space-y-2">
          {data.lines.map((line) => {
            const isPatched = line.tag.includes('backpatched');
            const isBlank = line.code.includes('_');

            return (
              <div
                key={line.num}
                className={`flex items-center justify-between p-2 rounded-[var(--r-sm)] border transition-all ${
                  isPatched
                    ? 'bg-[var(--success)]/15 border-[var(--success)]/40 text-[var(--success)] font-bold'
                    : isBlank
                    ? 'bg-[var(--surface-2)]/60 border-[var(--border)] text-[var(--text)]'
                    : 'bg-[var(--surface)] border-[var(--border)] text-[var(--text)]'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-[var(--text-muted)]">{line.num}:</span>
                  <span>{line.code}</span>
                </div>
                <span
                  className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded ${
                    isPatched
                      ? 'bg-[var(--success)]/20 text-[var(--success)] animate-pulse'
                      : line.tag.includes('true')
                      ? 'bg-[var(--accent)]/15 text-[var(--accent)]'
                      : 'bg-[var(--warning)]/15 text-[var(--warning)]'
                  }`}
                >
                  {line.tag}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </WidgetFrame>
  );
}

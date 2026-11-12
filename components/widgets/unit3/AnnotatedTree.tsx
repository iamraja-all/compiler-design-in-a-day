'use client';

import { useState } from 'react';
import { WidgetFrame } from '../shared/WidgetFrame';
import { StepperControls } from '../shared/StepperControls';
import { ANNOTATED_TREE_STEPS } from '../data/unit3';

export function AnnotatedTree() {
  const [currentStep, setCurrentStep] = useState(0);
  const data = ANNOTATED_TREE_STEPS[currentStep];

  return (
    <WidgetFrame
      title="Annotated Parse Tree (S-Attributed SDD)"
      notice="Evaluates 3 * 5 + 4 n bottom-up using synthesized attributes"
      explanation={data.say}
      controls={
        <StepperControls
          currentStep={currentStep}
          totalSteps={ANNOTATED_TREE_STEPS.length}
          onStepChange={setCurrentStep}
        />
      }
    >
      <div className="space-y-6">
        {/* Grammar / SDD Card */}
        <div className="p-3.5 rounded-[var(--r-md)] bg-[var(--surface)] border border-[var(--border)] font-mono text-xs flex flex-wrap items-center justify-between gap-2">
          <span className="text-[var(--text-muted)] font-bold uppercase">Semantic Rules (SDD):</span>
          <span className="text-[var(--text)]">E → E1 + T {'{ E.val = E1.val + T.val }'} · T → T1 * F {'{ T.val = T1.val * F.val }'}</span>
        </div>

        {/* Tree ASCII with Dynamic Highlights */}
        <div className="p-6 rounded-[var(--r-md)] bg-[var(--code-bg)] border border-[var(--border)] font-mono text-xs overflow-x-auto">
          <div className="whitespace-pre leading-loose text-[var(--text)]">
            <div>L {currentStep >= 11 && <span className="text-[var(--accent)] font-bold">[val: 19, print 19]</span>}</div>
            <div>├─ E {currentStep >= 10 && <span className="text-[var(--accent)] font-bold">[val: 19]</span>}</div>
            <div>│  ├─ E {currentStep >= 6 && <span className="text-[var(--accent)] font-bold">[val: 15]</span>}</div>
            <div>│  │  └─ T {currentStep >= 5 && <span className="text-[var(--accent)] font-bold">[val: 15]</span>}</div>
            <div>│  │     ├─ T {currentStep >= 2 && <span className="text-[var(--accent)] font-bold">[val: 3]</span>} ─ F {currentStep >= 1 && <span className="text-[var(--accent)] font-bold">[val: 3]</span>} ─ digit <span className="text-[var(--warning)]">[lexval: 3]</span></div>
            <div>│  │     ├─ *</div>
            <div>│  │     └─ F {currentStep >= 4 && <span className="text-[var(--accent)] font-bold">[val: 5]</span>} ─ digit <span className="text-[var(--warning)]">[lexval: 5]</span></div>
            <div>│  ├─ +</div>
            <div>│  └─ T {currentStep >= 9 && <span className="text-[var(--accent)] font-bold">[val: 4]</span>} ─ F {currentStep >= 8 && <span className="text-[var(--accent)] font-bold">[val: 4]</span>} ─ digit <span className="text-[var(--warning)]">[lexval: 4]</span></div>
            <div>└─ n</div>
          </div>
        </div>

        {/* Current Evaluation Details */}
        <div className="p-3.5 rounded-[var(--r-md)] bg-[var(--surface)] border border-[var(--border)] flex items-center justify-between text-xs font-mono">
          <span className="text-[var(--text-muted)]">Active Evaluation:</span>
          <span className="font-bold text-[var(--accent)]">
            Step {data.step}: {data.node} = {data.value}
          </span>
        </div>
      </div>
    </WidgetFrame>
  );
}

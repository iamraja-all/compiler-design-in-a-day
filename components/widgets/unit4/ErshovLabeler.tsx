'use client';

import { useState } from 'react';
import { WidgetFrame } from '../shared/WidgetFrame';
import { StepperControls } from '../shared/StepperControls';

const ERSHOV_STEPS = [
  {
    step: 0,
    title: 'Leaves a and b get label 1',
    labels: { a: 1, b: 1 },
    say: 'Rule: Every leaf in an expression tree receives label 1.',
  },
  {
    step: 1,
    title: 'Node (a − b) gets label 2',
    labels: { a: 1, b: 1, sub: 2 },
    say: 'Rule: Left child label = 1, Right child label = 1. Since L = R, parent gets 1 + 1 = 2.',
  },
  {
    step: 2,
    title: 'Leaves c and d get label 1; Node (c + d) gets label 2',
    labels: { a: 1, b: 1, sub: 2, c: 1, d: 1, add1: 2 },
    say: 'Both c and d are leaves (1). Node (c + d) has identical child labels (1, 1), so it gets 1 + 1 = 2.',
  },
  {
    step: 3,
    title: 'Leaf e gets 1; Node * gets label 2',
    labels: { a: 1, b: 1, sub: 2, c: 1, d: 1, add1: 2, e: 1, mul: 2 },
    say: 'Node * has children e (label 1) and (c + d) (label 2). Since L ≠ R, parent gets max(1, 2) = 2.',
  },
  {
    step: 4,
    title: 'Root + gets label 3',
    labels: { a: 1, b: 1, sub: 2, c: 1, d: 1, add1: 2, e: 1, mul: 2, root: 3 },
    say: 'Root label 3 = minimum registers needed without storing temporaries to memory. Evaluate the child with the larger label first.',
  },
];

export function ErshovLabeler() {
  const [currentStep, setCurrentStep] = useState(4); // Default to full tree
  const data = ERSHOV_STEPS[currentStep];

  const getL = (key: string) => (data.labels as any)[key] ?? '?';

  return (
    <WidgetFrame
      title="Ershov Register Allocation Numbers"
      notice="Expression tree for (a - b) + e * (c + d): Computes minimum registers required without spilling"
      explanation={data.say}
      controls={
        <StepperControls
          currentStep={currentStep}
          totalSteps={ERSHOV_STEPS.length}
          onStepChange={setCurrentStep}
        />
      }
    >
      <div className="space-y-6">
        {/* Rules Card */}
        <div className="p-3.5 rounded-[var(--r-md)] bg-[var(--surface)] border border-[var(--border)] font-mono text-xs flex flex-wrap items-center justify-between gap-3">
          <span className="text-[var(--text-muted)] font-bold">Labeling Rules:</span>
          <span className="text-[var(--text)]">
            Leaf → 1 · If L ≠ R → max(L, R) · If L = R → L + 1
          </span>
        </div>

        {/* Tree Display */}
        <div className="p-6 rounded-[var(--r-md)] bg-[var(--code-bg)] border border-[var(--border)] font-mono text-sm overflow-x-auto text-center">
          <div className="inline-block text-left text-[var(--text)] leading-relaxed whitespace-pre">
{`              + [${getL('root')}]
            /   \\
          /       \\
   (−) [${getL('sub')}]       (*) [${getL('mul')}]
      / \\            /   \\
     /   \\          /     \\
  a [${getL('a')}]  b [${getL('b')}]     e [${getL('e')}]  (+) [${getL('add1')}]
                           /   \\
                          /     \\
                       c [${getL('c')}]   d [${getL('d')}]`}
          </div>
        </div>

        {/* Evaluation Decision */}
        <div className="p-3.5 rounded-[var(--r-md)] bg-[var(--surface)] border border-[var(--border)] flex flex-wrap items-center justify-between gap-2 text-xs font-mono">
          <span className="text-[var(--text-muted)]">Register requirement:</span>
          <span className="font-bold text-sm text-[var(--accent)]">
            Min Registers Needed: {getL('root')}
          </span>
        </div>
      </div>
    </WidgetFrame>
  );
}

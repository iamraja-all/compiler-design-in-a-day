'use client';

import { useState } from 'react';
import { WidgetFrame } from '../shared/WidgetFrame';
import { StepperControls } from '../shared/StepperControls';

const DAG_BUILD_STEPS = [
  {
    step: 1,
    stmt: 'a = b + c',
    say: 'Create initial leaves b0, c0; create operator node n1 (+) with children b0, c0, and attach label a.',
    nodes: ['b0', 'c0', 'n1(+): [a]'],
    foundCse: false,
  },
  {
    step: 2,
    stmt: 'b = a - d',
    say: 'Create leaf d0; create operator node n2 (−) with children n1 (representing a) and d0. Attach label b to n2.',
    nodes: ['b0', 'c0', 'd0', 'n1(+): [a]', 'n2(−): [b]'],
    foundCse: false,
  },
  {
    step: 3,
    stmt: 'c = b + c',
    say: 'Create operator node n3 (+) with children n2 (representing b) and c0 (representing c). Attach label c.',
    nodes: ['b0', 'c0', 'd0', 'n1(+): [a]', 'n2(−): [b]', 'n3(+): [c]'],
    foundCse: false,
  },
  {
    step: 4,
    stmt: 'd = a - d',
    say: 'd = a − d: Check if (− n1 d0) exists. Yes! Node n2 already computes this exact expression. Do NOT create a new node — simply attach label d to n2! Common subexpression eliminated.',
    nodes: ['b0', 'c0', 'd0', 'n1(+): [a]', 'n2(−): [b, d]', 'n3(+): [c]'],
    foundCse: true,
  },
  {
    step: 5,
    stmt: 'Regenerate Code from DAG',
    say: 'Regenerate statements in topological order. If b is dead on exit: a = b + c; d = a - d; c = d + c. (If b is live on exit, append b = d).',
    nodes: ['b0', 'c0', 'd0', 'n1(+): [a]', 'n2(−): [b, d]', 'n3(+): [c]'],
    foundCse: false,
    regen: ['a = b + c', 'd = a - d', 'c = d + c', '// if b live: b = d'],
  },
];

export function DagBuilder() {
  const [currentStep, setCurrentStep] = useState(0);
  const data = DAG_BUILD_STEPS[currentStep];

  return (
    <WidgetFrame
      title="DAG Construction for Basic Blocks"
      notice="Detects common subexpressions and eliminates dead variable assignments"
      explanation={data.say}
      controls={
        <StepperControls
          currentStep={currentStep}
          totalSteps={DAG_BUILD_STEPS.length}
          onStepChange={setCurrentStep}
        />
      }
    >
      <div className="space-y-6">
        {/* Source Basic Block Card */}
        <div className="p-3.5 rounded-[var(--r-md)] bg-[var(--surface)] border border-[var(--border)] font-mono text-xs flex flex-wrap items-center justify-between gap-3">
          <span className="text-[var(--text-muted)] font-bold">Input Statements:</span>
          <span className="text-[var(--text)]">1. a = b + c · 2. b = a - d · 3. c = b + c · 4. d = a - d</span>
        </div>

        {/* Current statement highlight */}
        <div className="p-3.5 rounded-[var(--r-md)] bg-[var(--surface-2)] border border-[var(--border)] flex items-center justify-between font-mono text-xs">
          <span className="text-[var(--text-muted)]">Step {data.step} Processing:</span>
          <span className="text-sm font-bold text-[var(--accent)]">{data.stmt}</span>
          {data.foundCse && (
            <span className="px-2 py-0.5 rounded bg-[var(--success)]/15 border border-[var(--success)]/40 text-[var(--success)] font-bold text-[10px] uppercase">
              ★ Common Subexpression Found!
            </span>
          )}
        </div>

        {/* DAG Nodes Container */}
        <div className="p-6 rounded-[var(--r-md)] bg-[var(--surface)] border border-[var(--border)] font-mono text-xs space-y-4">
          <div className="text-[10px] uppercase font-bold text-[var(--text-muted)]">
            Active DAG Nodes:
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {data.nodes.map((n, idx) => (
              <div
                key={idx}
                className={`p-3 rounded-[var(--r-md)] border text-center transition-all ${
                  n.includes('b, d')
                    ? 'bg-[var(--success)]/15 border-[var(--success)]/50 text-[var(--success)] font-bold'
                    : 'bg-[var(--surface-2)] border-[var(--border)] text-[var(--text)]'
                }`}
              >
                {n}
              </div>
            ))}
          </div>

          {data.regen && (
            <div className="mt-4 p-4 rounded-[var(--r-sm)] bg-[var(--accent-soft)] border border-[var(--accent)]/30 space-y-1">
              <div className="text-[10px] uppercase font-bold text-[var(--accent)] mb-1">
                Optimized Output Code:
              </div>
              {data.regen.map((line, i) => (
                <div key={i} className="font-bold text-[var(--text)]">{line}</div>
              ))}
            </div>
          )}
        </div>
      </div>
    </WidgetFrame>
  );
}

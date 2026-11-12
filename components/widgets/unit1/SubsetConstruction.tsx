'use client';

import { useState } from 'react';
import { WidgetFrame } from '../shared/WidgetFrame';
import { StepperControls } from '../shared/StepperControls';
import { StateNode, Edge, StartArrow, SvgArrowDefs } from '../shared/SvgPrimitives';
import {
  SUBSET_STEPS,
  THOMPSON_NODE_POSITIONS,
} from '../data/unit1';

export function SubsetConstruction() {
  const [currentStep, setCurrentStep] = useState(0);
  const data = SUBSET_STEPS[currentStep];

  // Subset rows up to current step
  const visibleRows = SUBSET_STEPS.slice(0, currentStep + 1);

  return (
    <WidgetFrame
      title="Subset Construction: NFA → DFA"
      notice="Each DFA state represents a whole subset of NFA states reachable via ε-closure"
      explanation={data.say}
      controls={
        <StepperControls
          currentStep={currentStep}
          totalSteps={SUBSET_STEPS.length}
          onStepChange={setCurrentStep}
        />
      }
    >
      <div className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left: Mini NFA highlighting active NFA states */}
          <div className="lg:col-span-6 rounded-[var(--r-md)] border border-[var(--border)] bg-[var(--surface)] p-3">
            <div className="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider mb-2 flex items-center justify-between">
              <span>NFA Simulation States</span>
              <span className="font-mono text-[11px] text-[var(--accent)] font-bold">
                Subset: {data.state}
              </span>
            </div>

            <div className="w-full overflow-x-auto">
              <svg
                viewBox="0 0 1000 380"
                className="w-full min-w-[500px] h-auto select-none"
                role="img"
                aria-label="NFA subset highlight"
              >
                <SvgArrowDefs />
                <StartArrow x={60} y={200} />

                {/* Fixed edges */}
                <Edge x1={60} y1={200} x2={160} y2={200} isEpsilon />
                <Edge x1={60} y1={200} x2={580} y2={200} isEpsilon isCurved curveOffset={70} />
                <Edge x1={160} y1={200} x2={260} y2={120} isEpsilon />
                <Edge x1={160} y1={200} x2={260} y2={280} isEpsilon />
                <Edge x1={260} y1={120} x2={360} y2={120} label="a" />
                <Edge x1={260} y1={280} x2={360} y2={280} label="b" />
                <Edge x1={360} y1={120} x2={460} y2={200} isEpsilon />
                <Edge x1={360} y1={280} x2={460} y2={200} isEpsilon />
                <Edge x1={460} y1={200} x2={160} y2={200} isEpsilon isCurved curveOffset={-70} />
                <Edge x1={460} y1={200} x2={580} y2={200} isEpsilon />
                <Edge x1={580} y1={200} x2={690} y2={200} label="a" />
                <Edge x1={690} y1={200} x2={800} y2={200} label="b" />
                <Edge x1={800} y1={200} x2={910} y2={200} label="b" />

                {/* Nodes with conditional highlight if in data.highlightNfa */}
                {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((id) => {
                  const pos = THOMPSON_NODE_POSITIONS[id];
                  const isInSubset = data.highlightNfa.includes(id);

                  return (
                    <StateNode
                      key={id}
                      id={id}
                      x={pos.x}
                      y={pos.y}
                      isAccepting={id === 10}
                      isCurrent={isInSubset}
                    />
                  );
                })}
              </svg>
            </div>
          </div>

          {/* Right: Subset Table */}
          <div className="lg:col-span-6 rounded-[var(--r-md)] border border-[var(--border)] bg-[var(--surface)] overflow-hidden">
            <div className="px-4 py-2.5 border-b border-[var(--border)] bg-[var(--surface-2)] flex items-center justify-between text-xs font-semibold">
              <span className="text-[var(--text)]">DFA Transition Table Construction</span>
              <span className="text-[var(--text-muted)] font-mono">5 Total DFA States</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-mono border-collapse">
                <thead className="bg-[var(--surface-2)]/60 text-[var(--text-muted)] border-b border-[var(--border)]">
                  <tr>
                    <th className="px-3 py-2">DFA State</th>
                    <th className="px-3 py-2">NFA Subset</th>
                    <th className="px-3 py-2">on &apos;a&apos;</th>
                    <th className="px-3 py-2">on &apos;b&apos;</th>
                  </tr>
                </thead>
                <tbody>
                  {visibleRows.map((row, idx) => {
                    const isCurrentRow = idx === currentStep;
                    const isAccepting = row.state.includes('*') || row.state === 'E';

                    return (
                      <tr
                        key={idx}
                        className={`border-b border-[var(--border)]/40 transition-colors ${
                          isCurrentRow ? 'bg-[var(--accent-soft)] font-bold' : ''
                        }`}
                      >
                        <td className="px-3 py-2 text-[var(--text)]">
                          {row.state === 'A' ? '→A' : row.state === 'E' || row.state === '*E' ? '*E' : row.state}
                        </td>
                        <td className="px-3 py-2 text-[var(--text-muted)]">{row.nfaSet}</td>
                        <td className="px-3 py-2 text-[var(--accent)]">{row.onA}</td>
                        <td className="px-3 py-2 text-[var(--accent)]">{row.onB}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Final DFA Summary Matrix */}
        <div className="p-3.5 rounded-[var(--r-md)] bg-[var(--surface)] border border-[var(--border)] flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
          <span className="text-[var(--text-muted)]">Resulting Deterministic DFA:</span>
          <div className="flex items-center gap-3">
            <span className="px-2 py-0.5 rounded bg-[var(--surface-2)] border border-[var(--border)] text-[var(--text)]">→A: [a→B, b→C]</span>
            <span className="px-2 py-0.5 rounded bg-[var(--surface-2)] border border-[var(--border)] text-[var(--text)]">B: [a→B, b→D]</span>
            <span className="px-2 py-0.5 rounded bg-[var(--surface-2)] border border-[var(--border)] text-[var(--text)]">C: [a→B, b→C]</span>
            <span className="px-2 py-0.5 rounded bg-[var(--surface-2)] border border-[var(--border)] text-[var(--text)]">D: [a→B, b→E]</span>
            <span className="px-2 py-0.5 rounded bg-[var(--success)]/15 border border-[var(--success)]/30 text-[var(--success)] font-bold">*E: [a→B, b→C]</span>
          </div>
        </div>
      </div>
    </WidgetFrame>
  );
}

'use client';

import { useState } from 'react';
import { WidgetFrame } from '../shared/WidgetFrame';
import { StepperControls } from '../shared/StepperControls';
import { StateNode, Edge, StartArrow, SvgArrowDefs } from '../shared/SvgPrimitives';
import {
  THOMPSON_RULES,
  THOMPSON_BUILD_STEPS,
  THOMPSON_NODE_POSITIONS,
} from '../data/unit1';

export function ThompsonBuilder() {
  const [activeRuleTab, setActiveRuleTab] = useState('star');
  const [currentStep, setCurrentStep] = useState(4); // Default to full final step or step 0

  const stepData = THOMPSON_BUILD_STEPS[currentStep];

  return (
    <WidgetFrame
      title="Thompson's Construction: RE → NFA"
      notice="Converts any regular expression into an equivalent NFA with at most 2 transitions per state"
      explanation={stepData.say}
      controls={
        <StepperControls
          currentStep={currentStep}
          totalSteps={THOMPSON_BUILD_STEPS.length}
          onStepChange={setCurrentStep}
        />
      }
    >
      <div className="space-y-6">
        {/* Top 5 Rule Tabs */}
        <div className="space-y-3">
          <div className="text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)]">
            Thompson's 5 Structural Rules:
          </div>
          <div className="flex flex-wrap gap-2">
            {THOMPSON_RULES.map((rule) => (
              <button
                key={rule.id}
                onClick={() => setActiveRuleTab(rule.id)}
                className={`px-3 py-1.5 rounded-[var(--r-md)] border text-xs font-semibold cursor-pointer transition-colors ${
                  activeRuleTab === rule.id
                    ? 'bg-[var(--accent)] text-black border-[var(--accent)] shadow-xs'
                    : 'bg-[var(--surface)] text-[var(--text-muted)] border-[var(--border)] hover:text-[var(--text)]'
                }`}
              >
                {rule.name}
              </button>
            ))}
          </div>

          {/* Rule Diagram Card */}
          <div className="p-4 rounded-[var(--r-md)] bg-[var(--surface)] border border-[var(--border)] min-h-[90px] flex items-center justify-between text-xs font-mono">
            <div>
              <div className="font-bold text-[var(--text)] mb-1">
                {THOMPSON_RULES.find((r) => r.id === activeRuleTab)?.name}
              </div>
              <div className="text-[var(--text-muted)]">
                {THOMPSON_RULES.find((r) => r.id === activeRuleTab)?.description}
              </div>
            </div>

            {/* Mini rule picture */}
            <div className="shrink-0 pl-4 border-l border-[var(--border)] hidden sm:block">
              {activeRuleTab === 'eps' && (
                <div className="text-[var(--accent)] font-bold">i —ε→ f</div>
              )}
              {activeRuleTab === 'sym' && (
                <div className="text-[var(--accent)] font-bold">i —a→ f</div>
              )}
              {activeRuleTab === 'union' && (
                <div className="text-[var(--accent)] text-[11px] leading-tight">
                  i —ε→ N(s) —ε→ f<br />
                  i —ε→ N(t) —ε→ f
                </div>
              )}
              {activeRuleTab === 'concat' && (
                <div className="text-[var(--accent)] font-bold">N(s) ➔ N(t) (merged)</div>
              )}
              {activeRuleTab === 'star' && (
                <div className="text-[var(--accent)] text-[11px] leading-tight">
                  i —ε→ N(s) —ε→ f<br />
                  loop: end —ε→ start<br />
                  bypass: i —ε→ f
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Bottom: Interactive Construction Canvas for (a|b)*abb */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs font-mono">
            <span className="font-bold text-[var(--text)]">
              Target: <code className="text-[var(--accent)]">(a|b)*abb</code>
            </span>
            <span className="text-[var(--text-muted)] font-semibold">
              Step {stepData.step}: {stepData.title}
            </span>
          </div>

          <div className="w-full bg-[var(--surface)] rounded-[var(--r-md)] border border-[var(--border)] p-3 overflow-x-auto">
            <svg
              viewBox="0 0 1000 380"
              className="w-full min-w-[750px] h-auto select-none"
              role="img"
              aria-label="Thompson NFA construction for (a|b)*abb"
            >
              <SvgArrowDefs />

              {/* Start Arrow at state 0 if visible */}
              {stepData.visibleStates.includes(0) && <StartArrow x={60} y={200} />}

              {/* Render edges */}
              {stepData.visibleEdges.map((edge, idx) => {
                const pos1 = THOMPSON_NODE_POSITIONS[edge.from];
                const pos2 = THOMPSON_NODE_POSITIONS[edge.to];
                return (
                  <Edge
                    key={`edge-${idx}`}
                    x1={pos1.x}
                    y1={pos1.y}
                    x2={pos2.x}
                    y2={pos2.y}
                    label={edge.label}
                    isEpsilon={edge.isEpsilon}
                    isCurved={edge.isCurved}
                    curveOffset={edge.curveOffset}
                  />
                );
              })}

              {/* Render states */}
              {stepData.visibleStates.map((stId) => {
                const pos = THOMPSON_NODE_POSITIONS[stId];
                const isAccept = stId === 10;
                return (
                  <StateNode
                    key={`node-${stId}`}
                    id={stId}
                    x={pos.x}
                    y={pos.y}
                    isAccepting={isAccept}
                  />
                );
              })}
            </svg>
          </div>
        </div>
      </div>
    </WidgetFrame>
  );
}

'use client';

import { useState } from 'react';
import { WidgetFrame } from '../shared/WidgetFrame';
import { StepperControls } from '../shared/StepperControls';
import { LR0_STATES } from '../data/unit2';

const EDGES = [
  { from: 0, to: 1, label: 'E' },
  { from: 0, to: 2, label: 'T' },
  { from: 0, to: 3, label: 'F' },
  { from: 0, to: 4, label: '(' },
  { from: 0, to: 5, label: 'id' },
  { from: 1, to: 6, label: '+' },
  { from: 2, to: 7, label: '*' },
  { from: 4, to: 8, label: 'E' },
  { from: 4, to: 2, label: 'T' },
  { from: 4, to: 3, label: 'F' },
  { from: 4, to: 4, label: '(', isSelf: true },
  { from: 4, to: 5, label: 'id' },
  { from: 6, to: 9, label: 'T' },
  { from: 6, to: 3, label: 'F' },
  { from: 6, to: 4, label: '(' },
  { from: 6, to: 5, label: 'id' },
  { from: 7, to: 10, label: 'F' },
  { from: 7, to: 4, label: '(' },
  { from: 7, to: 5, label: 'id' },
  { from: 8, to: 11, label: ')' },
  { from: 8, to: 6, label: '+' },
  { from: 9, to: 7, label: '*' },
];

export function Lr0Automaton() {
  const [selectedState, setSelectedState] = useState(0);
  const [currentStep, setCurrentStep] = useState(11); // Show all 12 states by default or step

  const activeInfo = LR0_STATES[selectedState];

  return (
    <WidgetFrame
      title="Canonical Collection of LR(0) Items & Automaton"
      notice="Green outlines highlight states with completed items (dot at end: reduce actions)"
      explanation={`State I${selectedState}: ${activeInfo.items.join(' | ')}. ${
        activeInfo.isReduce ? 'Contains reduction item (dot at end).' : 'Shift/Goto items.'
      }`}
      controls={
        <StepperControls
          currentStep={currentStep}
          totalSteps={12}
          onStepChange={(s) => {
            setCurrentStep(s);
            setSelectedState(s);
          }}
        />
      }
    >
      <div className="space-y-6">
        {/* Selected State Inspector Card */}
        <div className="p-4 rounded-[var(--r-md)] bg-[var(--surface)] border border-[var(--border)] flex flex-wrap items-center justify-between gap-4 font-mono text-xs">
          <div className="space-y-1">
            <span className="text-[var(--text-muted)] uppercase text-[10px] font-bold">
              Inspecting State I{selectedState}:
            </span>
            <div className="flex flex-wrap gap-2 pt-1">
              {activeInfo.items.map((item, idx) => (
                <span
                  key={idx}
                  className={`px-2.5 py-1 rounded-[var(--r-sm)] border font-bold ${
                    item.endsWith('•')
                      ? 'bg-[var(--success)]/15 border-[var(--success)]/40 text-[var(--success)]'
                      : 'bg-[var(--surface-2)] border-[var(--border)] text-[var(--text)]'
                  }`}
                >
                  {item}
                </span>
              ))}
            </div>
          </div>

          {activeInfo.isReduce && (
            <div className="px-3 py-1 rounded-full bg-[var(--success)]/15 text-[var(--success)] border border-[var(--success)]/40 text-xs font-bold">
              ✓ Reduce Item Found
            </div>
          )}
        </div>

        {/* Large SVG Automaton Map (1000x500) */}
        <div className="w-full bg-[var(--surface)] rounded-[var(--r-md)] border border-[var(--border)] p-4 overflow-x-auto">
          <svg
            viewBox="0 0 980 520"
            className="w-full min-w-[850px] h-auto select-none font-mono"
            role="img"
            aria-label="LR(0) items collection automaton"
          >
            <defs>
              <marker
                id="lr-arrow"
                viewBox="0 0 10 10"
                refX="7"
                refY="5"
                markerWidth="6"
                markerHeight="6"
                orient="auto-start-reverse"
              >
                <path d="M 0 1.5 L 8 5 L 0 8.5 z" fill="var(--text-muted)" />
              </marker>
            </defs>

            {/* Render visible edges */}
            {EDGES.filter((e) => e.from <= currentStep && e.to <= currentStep).map((edge, idx) => {
              const p1 = LR0_STATES[edge.from].pos;
              const p2 = LR0_STATES[edge.to].pos;

              if (edge.isSelf) {
                return (
                  <path
                    key={idx}
                    d={`M ${p1.x - 20} ${p1.y - 15} C ${p1.x - 50} ${p1.y - 50}, ${p1.x + 50} ${p1.y - 50}, ${p1.x + 20} ${p1.y - 15}`}
                    fill="none"
                    stroke="var(--border)"
                    strokeWidth="1.5"
                    markerEnd="url(#lr-arrow)"
                  />
                );
              }

              return (
                <g key={idx}>
                  <line
                    x1={p1.x}
                    y1={p1.y}
                    x2={p2.x}
                    y2={p2.y}
                    stroke="var(--border)"
                    strokeWidth="1.5"
                    markerEnd="url(#lr-arrow)"
                  />
                  <text
                    x={(p1.x + p2.x) / 2}
                    y={(p1.y + p2.y) / 2 - 4}
                    textAnchor="middle"
                    fill="var(--accent)"
                    fontSize="11"
                    fontWeight="bold"
                  >
                    {edge.label}
                  </text>
                </g>
              );
            })}

            {/* Render state boxes */}
            {Object.entries(LR0_STATES)
              .filter(([id]) => Number(id) <= currentStep)
              .map(([id, st]) => {
                const numId = Number(id);
                const isSelected = selectedState === numId;

                return (
                  <g
                    key={id}
                    onClick={() => setSelectedState(numId)}
                    className="cursor-pointer transition-transform hover:scale-105"
                    transform={`translate(${st.pos.x - 45}, ${st.pos.y - 25})`}
                  >
                    <rect
                      width="90"
                      height="50"
                      rx="8"
                      fill={isSelected ? 'var(--accent-soft)' : 'var(--surface-2)'}
                      stroke={
                        isSelected
                          ? 'var(--accent)'
                          : st.isReduce
                          ? 'var(--success)'
                          : 'var(--border)'
                      }
                      strokeWidth={isSelected ? '2.5' : st.isReduce ? '2' : '1.5'}
                    />
                    <text
                      x="45"
                      y="22"
                      textAnchor="middle"
                      fill={isSelected ? 'var(--accent)' : 'var(--text)'}
                      fontSize="13"
                      fontWeight="bold"
                    >
                      {st.name}
                    </text>
                    <text
                      x="45"
                      y="38"
                      textAnchor="middle"
                      fill="var(--text-muted)"
                      fontSize="9"
                    >
                      {st.isReduce ? 'reduce' : `${st.items.length} items`}
                    </text>
                  </g>
                );
              })}
          </svg>
        </div>
      </div>
    </WidgetFrame>
  );
}

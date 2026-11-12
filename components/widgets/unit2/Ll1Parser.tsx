'use client';

import { useState } from 'react';
import { WidgetFrame } from '../shared/WidgetFrame';
import { StepperControls } from '../shared/StepperControls';
import { LL1_TRACE } from '../data/unit2';

const LL1_TABLE: Record<string, Record<string, string>> = {
  E: { id: "E → T E'", '(': "E → T E'" },
  "E'": { '+': "E' → + T E'", ')': "E' → ε", $: "E' → ε" },
  T: { id: "T → F T'", '(': "T → F T'" },
  "T'": { '+': "T' → ε", '*': "T' → * F T'", ')': "T' → ε", $: "T' → ε" },
  F: { id: 'F → id', '(': 'F → ( E )' },
};

const TERMINALS = ['id', '+', '*', '(', ')', '$'];
const NON_TERMINALS = ['E', "E'", 'T', "T'", 'F'];

export function Ll1Parser() {
  const [tab, setTab] = useState<'trace' | 'table'>('trace');
  const [currentStep, setCurrentStep] = useState(0);

  const traceStep = LL1_TRACE[currentStep];

  return (
    <WidgetFrame
      title="Non-Recursive Predictive LL(1) Parser"
      notice="Parses arithmetic expression id + id * id $ with stack and parsing table lookup"
      explanation={
        traceStep.action === 'ACCEPT'
          ? 'Input string and stack both reduced to $ → string accepted!'
          : traceStep.action.startsWith('match')
          ? `Top of stack matches current input symbol '${traceStep.action.replace('match ', '')}'. Pop and advance input.`
          : `Table lookup M[${traceStep.row}, ${traceStep.col}] replaces ${traceStep.row} with production '${traceStep.action}'.`
      }
      controls={
        tab === 'trace' ? (
          <StepperControls
            currentStep={currentStep}
            totalSteps={LL1_TRACE.length}
            onStepChange={setCurrentStep}
          />
        ) : undefined
      }
    >
      <div className="space-y-6">
        {/* Tab switch */}
        <div className="flex gap-2">
          <button
            onClick={() => setTab('trace')}
            className={`px-3 py-1.5 rounded-[var(--r-md)] border text-xs font-semibold cursor-pointer transition-colors ${
              tab === 'trace'
                ? 'bg-[var(--accent)] text-black border-[var(--accent)]'
                : 'bg-[var(--surface)] text-[var(--text-muted)] border-[var(--border)]'
            }`}
          >
            Parsing Trace: id + id * id $
          </button>
          <button
            onClick={() => setTab('table')}
            className={`px-3 py-1.5 rounded-[var(--r-md)] border text-xs font-semibold cursor-pointer transition-colors ${
              tab === 'table'
                ? 'bg-[var(--accent)] text-black border-[var(--accent)]'
                : 'bg-[var(--surface)] text-[var(--text-muted)] border-[var(--border)]'
            }`}
          >
            LL(1) Parsing Table M[A, a]
          </button>
        </div>

        {tab === 'trace' ? (
          <div className="space-y-6">
            {/* Live Stack & Input Visualizer */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 font-mono text-xs">
              {/* Stack */}
              <div className="p-4 rounded-[var(--r-md)] bg-[var(--surface)] border border-[var(--border)] space-y-2">
                <div className="text-[10px] uppercase font-bold text-[var(--accent)] tracking-wider">
                  Parse Stack (Top at left)
                </div>
                <div className="text-sm font-bold text-[var(--text)] p-2 rounded bg-[var(--surface-2)] border border-[var(--border)] truncate">
                  {traceStep.stack}
                </div>
              </div>

              {/* Input */}
              <div className="p-4 rounded-[var(--r-md)] bg-[var(--surface)] border border-[var(--border)] space-y-2">
                <div className="text-[10px] uppercase font-bold text-[var(--warning)] tracking-wider">
                  Remaining Input
                </div>
                <div className="text-sm font-bold text-[var(--text)] p-2 rounded bg-[var(--surface-2)] border border-[var(--border)] truncate">
                  {traceStep.input}
                </div>
              </div>

              {/* Current Action */}
              <div className="p-4 rounded-[var(--r-md)] bg-[var(--surface)] border border-[var(--border)] space-y-2">
                <div className="text-[10px] uppercase font-bold text-[var(--success)] tracking-wider">
                  Parser Action
                </div>
                <div className="text-sm font-bold text-[var(--success)] p-2 rounded bg-[var(--success)]/10 border border-[var(--success)]/30 truncate">
                  {traceStep.action}
                </div>
              </div>
            </div>

            {/* Parsing Trace Table */}
            <div className="rounded-[var(--r-md)] border border-[var(--border)] bg-[var(--surface)] overflow-hidden">
              <div className="max-h-56 overflow-y-auto">
                <table className="w-full text-left text-xs font-mono">
                  <thead className="bg-[var(--surface-2)] text-[var(--text-muted)] sticky top-0 border-b border-[var(--border)]">
                    <tr>
                      <th className="px-3 py-2">#</th>
                      <th className="px-3 py-2">Stack</th>
                      <th className="px-3 py-2">Input</th>
                      <th className="px-3 py-2">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {LL1_TRACE.map((t, idx) => {
                      const isCurrent = idx === currentStep;
                      return (
                        <tr
                          key={t.step}
                          className={`border-b border-[var(--border)]/30 transition-colors ${
                            isCurrent ? 'bg-[var(--accent-soft)] font-bold text-[var(--accent)]' : ''
                          }`}
                        >
                          <td className="px-3 py-1.5 text-[var(--text-muted)]">{t.step}</td>
                          <td className="px-3 py-1.5">{t.stack}</td>
                          <td className="px-3 py-1.5">{t.input}</td>
                          <td className="px-3 py-1.5">{t.action}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        ) : (
          /* Parsing Table View */
          <div className="rounded-[var(--r-md)] border border-[var(--border)] bg-[var(--surface)] overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-center text-xs font-mono border-collapse">
                <thead className="bg-[var(--surface-2)] text-[var(--text)] border-b border-[var(--border)]">
                  <tr>
                    <th className="px-4 py-2.5 text-left">Non-Terminal</th>
                    {TERMINALS.map((term) => (
                      <th key={term} className="px-4 py-2.5 font-bold">
                        {term}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {NON_TERMINALS.map((nt) => (
                    <tr key={nt} className="border-b border-[var(--border)]/30">
                      <td className="px-4 py-2 text-left font-bold text-[var(--accent)]">{nt}</td>
                      {TERMINALS.map((term) => {
                        const entry = LL1_TABLE[nt]?.[term] || '';
                        return (
                          <td
                            key={term}
                            className={`px-3 py-2 ${entry ? 'text-[var(--text)]' : 'text-[var(--text-muted)] opacity-30'}`}
                          >
                            {entry || '—'}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </WidgetFrame>
  );
}

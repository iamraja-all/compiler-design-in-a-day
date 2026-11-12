'use client';

import { useState } from 'react';
import { WidgetFrame } from '../shared/WidgetFrame';
import { StepperControls } from '../shared/StepperControls';
import { PIPELINE_STAGES } from '../data/intro';
import { ArrowRight, CheckCircle, Database } from 'lucide-react';

export function PipelineJourney() {
  const [currentStep, setCurrentStep] = useState(0);
  const stage = PIPELINE_STAGES[currentStep];

  return (
    <WidgetFrame
      title="The Compiler Pipeline Journey"
      notice="Watch a single line of code transform through all 6 phases of the compiler"
      explanation={stage.say}
      controls={
        <StepperControls
          currentStep={currentStep}
          totalSteps={PIPELINE_STAGES.length}
          onStepChange={setCurrentStep}
        />
      }
    >
      <div className="space-y-6">
        {/* Input stream bar */}
        <div className="p-3 rounded-[var(--r-md)] bg-[var(--surface)] border border-[var(--border)] flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
          <span className="text-[var(--text-muted)] font-semibold uppercase tracking-wider">
            Input Expression:
          </span>
          <div className="flex items-center gap-1 font-bold text-sm text-[var(--accent)] bg-[var(--surface-2)] px-3 py-1.5 rounded-[var(--r-sm)] border border-[var(--border)]">
            <span>x</span>
            <span className="text-[var(--text-muted)]">·=·</span>
            <span>a</span>
            <span className="text-[var(--text-muted)]">·+·</span>
            <span>b</span>
            <span className="text-[var(--text-muted)]">·*·</span>
            <span>2</span>
          </div>
        </div>

        {/* Horizontal Pipeline stages */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2">
          {PIPELINE_STAGES.map((s, idx) => {
            const isActive = idx === currentStep;
            const isPassed = idx < currentStep;

            return (
              <button
                key={s.step}
                onClick={() => setCurrentStep(idx)}
                className={`p-2.5 rounded-[var(--r-md)] border text-left transition-all cursor-pointer flex flex-col justify-between ${
                  isActive
                    ? 'bg-[var(--accent-soft)] border-[var(--accent)] shadow-sm ring-1 ring-[var(--accent)]'
                    : isPassed
                    ? 'bg-[var(--surface)] border-[var(--border)] opacity-85 hover:border-[var(--text-muted)]'
                    : 'bg-[var(--surface)] border-[var(--border)]/60 opacity-50 hover:opacity-80'
                }`}
              >
                <div className="text-[10px] font-mono text-[var(--text-muted)] uppercase mb-1">
                  Step {idx}
                </div>
                <div
                  className={`text-xs font-bold leading-tight line-clamp-2 ${
                    isActive ? 'text-[var(--accent)]' : 'text-[var(--text)]'
                  }`}
                >
                  {s.name}
                </div>
              </button>
            );
          })}
        </div>

        {/* Stage Output Display */}
        <div className="p-5 rounded-[var(--r-md)] bg-[var(--surface)] border border-[var(--border)] min-h-[170px] flex flex-col justify-center">
          <div className="text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)] mb-3 flex items-center justify-between">
            <span>Phase Output: {stage.name}</span>
            <span className="font-mono text-[11px] text-[var(--accent)]">{stage.unit}</span>
          </div>

          {currentStep === 0 && (
            <div className="space-y-3">
              <div className="flex flex-wrap gap-1.5 font-mono">
                {['x', ' ', '=', ' ', 'a', ' ', '+', ' ', 'b', ' ', '*', ' ', '2'].map((char, i) => (
                  <div
                    key={i}
                    className="w-8 h-8 rounded-[var(--r-sm)] border border-[var(--border)] bg-[var(--surface-2)] flex items-center justify-center font-bold text-sm text-[var(--text)]"
                  >
                    {char === ' ' ? <span className="text-[var(--text-muted)] text-xs">·</span> : char}
                  </div>
                ))}
              </div>
              <p className="text-xs text-[var(--text-muted)] m-0">
                Raw source characters stored in an input buffer. No meaning or tokens yet.
              </p>
            </div>
          )}

          {currentStep === 1 && (
            <div className="space-y-3">
              <div className="flex flex-wrap items-center gap-2 font-mono">
                <span className="px-2.5 py-1 rounded-[var(--r-sm)] bg-[var(--accent-soft)] text-[var(--accent)] border border-[var(--accent)]/30 text-xs font-bold">id(x)</span>
                <span className="px-2.5 py-1 rounded-[var(--r-sm)] bg-[var(--surface-2)] border border-[var(--border)] text-xs font-bold text-[var(--warning)]">=</span>
                <span className="px-2.5 py-1 rounded-[var(--r-sm)] bg-[var(--accent-soft)] text-[var(--accent)] border border-[var(--accent)]/30 text-xs font-bold">id(a)</span>
                <span className="px-2.5 py-1 rounded-[var(--r-sm)] bg-[var(--surface-2)] border border-[var(--border)] text-xs font-bold text-[var(--warning)]">+</span>
                <span className="px-2.5 py-1 rounded-[var(--r-sm)] bg-[var(--accent-soft)] text-[var(--accent)] border border-[var(--accent)]/30 text-xs font-bold">id(b)</span>
                <span className="px-2.5 py-1 rounded-[var(--r-sm)] bg-[var(--surface-2)] border border-[var(--border)] text-xs font-bold text-[var(--warning)]">*</span>
                <span className="px-2.5 py-1 rounded-[var(--r-sm)] bg-[var(--success)]/15 text-[var(--success)] border border-[var(--success)]/30 text-xs font-bold">num(2)</span>
              </div>
              <div className="pt-2 flex items-center gap-3 text-xs text-[var(--text-muted)] font-mono">
                <Database className="w-3.5 h-3.5 text-[var(--accent)]" />
                <span>Symbol Table: [1] x: id · [2] a: id · [3] b: id</span>
              </div>
            </div>
          )}

          {currentStep === 2 && (
            <div className="space-y-3 font-mono text-xs">
              <div className="p-3 rounded-[var(--r-sm)] bg-[var(--code-bg)] border border-[var(--border)] text-[var(--text)] whitespace-pre leading-relaxed">
{`    =
   / \\
  x   +
     / \\
    a   *
       / \\
      b   2`}
              </div>
              <p className="text-xs text-[var(--text-muted)] m-0">
                Parse tree: Operator precedence guarantees <code>b * 2</code> evaluates prior to adding <code>a</code>.
              </p>
            </div>
          )}

          {currentStep === 3 && (
            <div className="space-y-3">
              <div className="p-3 rounded-[var(--r-sm)] bg-[var(--code-bg)] border border-[var(--border)] font-mono text-xs text-[var(--text)] space-y-1">
                <div>t1 = b * 2</div>
                <div>t2 = a + t1</div>
                <div>x = t2</div>
              </div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[var(--success)]/15 text-[var(--success)] text-xs font-semibold">
                <CheckCircle className="w-3.5 h-3.5" />
                <span>Semantic types validated: int arithmetic</span>
              </div>
            </div>
          )}

          {currentStep === 4 && (
            <div className="space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 font-mono text-xs">
                <div className="p-3 rounded-[var(--r-sm)] bg-[var(--code-bg)] border border-[var(--border)] space-y-1">
                  <div className="text-[var(--text-muted)]">// Assembly instructions</div>
                  <div>MOV b, R0</div>
                  <div>MUL #2, R0</div>
                  <div>ADD a, R0</div>
                  <div>MOV R0, x</div>
                </div>
                <div className="p-3 rounded-[var(--r-sm)] bg-[var(--surface-2)] border border-[var(--border)] text-[11px] space-y-1">
                  <div className="font-semibold text-[var(--accent)]">Machine State:</div>
                  <div>Reg R0: accumulator</div>
                  <div>Memory: x, a, b mapped to stack offsets</div>
                </div>
              </div>
            </div>
          )}

          {currentStep === 5 && (
            <div className="space-y-3 font-mono text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-3 rounded-[var(--r-sm)] bg-[var(--surface-2)] border border-[var(--border)]">
                  <span className="text-[var(--danger)] font-bold block mb-1">Before:</span>
                  <div>t1 = b * 2</div>
                  <div>t2 = a + t1</div>
                  <div>x = t2</div>
                </div>
                <div className="p-3 rounded-[var(--r-sm)] bg-[var(--success)]/10 border border-[var(--success)]/30">
                  <span className="text-[var(--success)] font-bold block mb-1">After Optimization:</span>
                  <div>t1 = b + b  <span className="text-[var(--text-muted)]">// strength reduction</span></div>
                  <div>x = a + t1  <span className="text-[var(--text-muted)]">// copy propagation</span></div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </WidgetFrame>
  );
}

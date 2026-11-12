'use client';

import { useState } from 'react';
import { WidgetFrame } from '../shared/WidgetFrame';
import { StepperControls } from '../shared/StepperControls';
import { Flag, ArrowRight } from 'lucide-react';

const PROG_A_LINES = [
  '1) prod = 0',
  '2) i = 1',
  '3) t1 = 4 * i',
  '4) t2 = a[t1]',
  '5) t3 = 4 * i',
  '6) t4 = b[t3]',
  '7) t5 = t2 * t4',
  '8) prod = prod + t5',
  '9) i = i + 1',
  '10) if i <= 20 goto (3)',
];

const PROG_B_LINES = [
  '1) i = 1',
  '2) j = 1',
  '3) t1 = 10 * i',
  '4) t2 = t1 + j',
  '5) t3 = 8 * t2',
  '6) t4 = t3 - 88',
  '7) a[t4] = 0.0',
  '8) j = j + 1',
  '9) if j <= 10 goto (3)',
  '10) i = i + 1',
  '11) if i <= 10 goto (2)',
  '12) i = 1',
  '13) t5 = i - 1',
  '14) t6 = 88 * t5',
  '15) a[t6] = 1.0',
  '16) i = i + 1',
  '17) if i <= 10 goto (13)',
];

export function BasicBlockFinder() {
  const [prog, setProg] = useState<'A' | 'B'>('A');
  const [step, setStep] = useState(0); // 0: Leaders, 1: Blocks, 2: Flow Graph

  const isA = prog === 'A';
  const lines = isA ? PROG_A_LINES : PROG_B_LINES;
  const leaders = isA ? [1, 3] : [1, 2, 3, 10, 12, 13];

  const getExplanation = () => {
    if (step === 0) {
      return 'Leader Rules: 1. The first instruction is a leader; 2. Target of any branch is a leader; 3. Instruction immediately following any branch is a leader.';
    }
    if (step === 1) {
      return isA
        ? 'Partition into Basic Blocks: B1 = lines 1..2, B2 = lines 3..10.'
        : 'Partition into 6 Basic Blocks: B1=1, B2=2, B3=3..9, B4=10..11, B5=12, B6=13..17.';
    }
    return isA
      ? 'Control Flow Graph: ENTRY → B1 → B2 ⟲ (loop on i <= 20) → EXIT.'
      : 'Control Flow Graph: Nested matrix initialization loops with outer loop (B4→B2) and trailing identity diagonal assignment (B5→B6).';
  };

  return (
    <WidgetFrame
      title="Partitioning Code into Basic Blocks & Flow Graphs"
      notice="Identifying leaders and single-entry single-exit sequences of three-address statements"
      explanation={getExplanation()}
      controls={
        <StepperControls
          currentStep={step}
          totalSteps={3}
          onStepChange={setStep}
        />
      }
    >
      <div className="space-y-6">
        {/* Program picker */}
        <div className="flex items-center justify-between p-3.5 rounded-[var(--r-md)] bg-[var(--surface)] border border-[var(--border)] font-mono text-xs">
          <div className="flex items-center gap-2">
            <span className="text-[var(--text-muted)] font-bold">Program:</span>
            <select
              value={prog}
              onChange={(e) => {
                setProg(e.target.value as 'A' | 'B');
                setStep(0);
              }}
              className="px-2.5 py-1 rounded bg-[var(--surface-2)] border border-[var(--border)] text-[var(--text)] font-semibold"
            >
              <option value="A">Program A: Vector Dot Product (10 TAC lines)</option>
              <option value="B">Program B: Matrix Initialization (17 TAC lines)</option>
            </select>
          </div>

          <span className="text-[var(--accent)] font-semibold">
            {step === 0 ? 'Phase 1: Mark Leaders' : step === 1 ? 'Phase 2: Group Blocks' : 'Phase 3: Control Flow Graph'}
          </span>
        </div>

        {/* Code Listing with Leader Flags & Blocks */}
        {step < 2 ? (
          <div className="p-4 rounded-[var(--r-md)] bg-[var(--code-bg)] border border-[var(--border)] font-mono text-xs space-y-1">
            {lines.map((line, idx) => {
              const lineNum = idx + 1;
              const isLeader = leaders.includes(lineNum);

              return (
                <div
                  key={lineNum}
                  className={`flex items-center justify-between px-3 py-1.5 rounded transition-all ${
                    isLeader && step >= 0
                      ? 'bg-[var(--accent-soft)] border-l-4 border-l-[var(--accent)] font-bold text-[var(--accent)]'
                      : 'text-[var(--text)]'
                  }`}
                >
                  <span>{line}</span>
                  {isLeader && step >= 0 && (
                    <span className="inline-flex items-center gap-1 text-[10px] uppercase font-bold text-[var(--accent)]">
                      <Flag className="w-3 h-3" /> Leader
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          /* CFG Flow Graph View */
          <div className="p-6 rounded-[var(--r-md)] bg-[var(--surface)] border border-[var(--border)] font-mono text-xs space-y-4">
            <div className="text-[10px] uppercase font-bold text-[var(--accent)]">Control Flow Graph Structure:</div>
            {isA ? (
              <div className="flex flex-wrap items-center gap-3">
                <span className="px-3 py-1.5 rounded bg-[var(--surface-2)] border border-[var(--border)] font-bold text-[var(--text)]">ENTRY</span>
                <ArrowRight className="w-4 h-4 text-[var(--text-muted)]" />
                <span className="px-3 py-1.5 rounded bg-[var(--surface-2)] border border-[var(--border)] font-bold text-[var(--accent)]">B1 (1..2)</span>
                <ArrowRight className="w-4 h-4 text-[var(--text-muted)]" />
                <span className="px-3 py-1.5 rounded bg-[var(--accent-soft)] border border-[var(--accent)] font-bold text-[var(--accent)]">B2 (3..10) ⟲ (loop)</span>
                <ArrowRight className="w-4 h-4 text-[var(--text-muted)]" />
                <span className="px-3 py-1.5 rounded bg-[var(--surface-2)] border border-[var(--border)] font-bold text-[var(--text)]">EXIT</span>
              </div>
            ) : (
              <div className="p-4 rounded bg-[var(--surface-2)] text-[var(--text)] whitespace-pre leading-relaxed overflow-x-auto">
{`ENTRY ──> B1 (1) ──> B2 (2) ──> B3 (3..9) ⟲ (inner j loop)
                      ▲            │
                      │            ▼
                      └─── B4 (10..11) (outer i loop)
                                   │
                                   ▼
                             B5 (12) ──> B6 (13..17) ⟲ (diagonal loop) ──> EXIT`}
              </div>
            )}
          </div>
        )}
      </div>
    </WidgetFrame>
  );
}

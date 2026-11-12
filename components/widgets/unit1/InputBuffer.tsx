'use client';

import { useState } from 'react';
import { WidgetFrame } from '../shared/WidgetFrame';
import { StepperControls } from '../shared/StepperControls';

interface StepInfo {
  step: number;
  half1: string[];
  half2: string[];
  lexemeBegin: number; // 0 to 17 index across both halves (0..8 is half 1, 9..17 is half 2)
  forward: number;
  recognized: string | null;
  say: string;
}

const STEPS: StepInfo[] = [
  {
    step: 0,
    half1: ['E', '·', '=', '·', 'M', '·', '*', '·', 'eof'],
    half2: [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', 'eof'],
    lexemeBegin: 0,
    forward: 0,
    recognized: null,
    say: 'Read a big block in one go — reading one character at a time from disk is slow.',
  },
  {
    step: 1,
    half1: ['E', '·', '=', '·', 'M', '·', '*', '·', 'eof'],
    half2: [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', 'eof'],
    lexemeBegin: 0,
    forward: 1,
    recognized: 'E (identifier)',
    say: 'forward runs ahead until the word ends; the lexeme is between the two pointers.',
  },
  {
    step: 2,
    half1: ['E', '·', '=', '·', 'M', '·', '*', '·', 'eof'],
    half2: [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', 'eof'],
    lexemeBegin: 2,
    forward: 3,
    recognized: '= (assign)',
    say: 'lexemeBegin jumps to forward: start of the next lexeme.',
  },
  {
    step: 3,
    half1: ['E', '·', '=', '·', 'M', '·', '*', '·', 'eof'],
    half2: ['C', '*', '*', '2', 'eof', ' ', ' ', ' ', 'eof'],
    lexemeBegin: 6,
    forward: 8,
    recognized: 'Sentinel Hit',
    say: 'Hitting the sentinel means "this half is finished — refill the other half". One check instead of two per character.',
  },
  {
    step: 4,
    half1: ['E', '·', '=', '·', 'M', '·', '*', '·', 'eof'],
    half2: ['C', '*', '*', '2', 'eof', ' ', ' ', ' ', 'eof'],
    lexemeBegin: 10,
    forward: 12,
    recognized: '* then *',
    say: 'The sentinel trick saves time: normally we\'d test "end of buffer?" AND "which character?" on every move.',
  },
  {
    step: 5,
    half1: ['E', '·', '=', '·', 'M', '·', '*', '·', 'eof'],
    half2: ['C', '*', '*', '2', 'eof', ' ', ' ', ' ', 'eof'],
    lexemeBegin: 13,
    forward: 13,
    recognized: 'Real End of Input (eof)',
    say: 'Final eof that is NOT at a buffer boundary indicates the actual end of source file.',
  },
];

export function InputBuffer() {
  const [currentStep, setCurrentStep] = useState(0);
  const data = STEPS[currentStep];

  return (
    <WidgetFrame
      title="Input Buffer with Sentinels (Two-Buffer Scheme)"
      notice="Two pointers (lexemeBegin and forward) and sentinel eof cells eliminate boundary checks"
      explanation={data.say}
      controls={
        <StepperControls
          currentStep={currentStep}
          totalSteps={STEPS.length}
          onStepChange={setCurrentStep}
        />
      }
    >
      <div className="space-y-8 py-2">
        {/* Buffer display */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Half 1 */}
          <div className="p-4 rounded-[var(--r-md)] bg-[var(--surface)] border border-[var(--border)]">
            <div className="text-xs font-semibold text-[var(--accent)] uppercase tracking-wider mb-3 flex items-center justify-between">
              <span>Buffer Half 1 (N = 8 characters + sentinel)</span>
              <span className="text-[10px] text-[var(--text-muted)] font-mono">Indices 0..8</span>
            </div>

            <div className="grid grid-cols-9 gap-1.5 font-mono text-center">
              {data.half1.map((char, idx) => {
                const isBegin = data.lexemeBegin === idx;
                const isForward = data.forward === idx;
                const isSentinel = idx === 8;

                return (
                  <div key={idx} className="flex flex-col items-center">
                    <div
                      className={`w-full aspect-square flex items-center justify-center rounded-[var(--r-sm)] border text-sm font-bold transition-all ${
                        isSentinel
                          ? 'bg-[var(--danger)]/15 border-[var(--danger)]/50 text-[var(--danger)]'
                          : 'bg-[var(--surface-2)] border-[var(--border)] text-[var(--text)]'
                      }`}
                    >
                      {char}
                    </div>
                    {/* Pointers under cell */}
                    <div className="h-6 mt-1 flex flex-col items-center text-[10px] font-bold">
                      {isBegin && <span className="text-[var(--purple)] leading-none">▲ B</span>}
                      {isForward && <span className="text-[var(--accent)] leading-none">▲ F</span>}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Half 2 */}
          <div className="p-4 rounded-[var(--r-md)] bg-[var(--surface)] border border-[var(--border)]">
            <div className="text-xs font-semibold text-[var(--warning)] uppercase tracking-wider mb-3 flex items-center justify-between">
              <span>Buffer Half 2 (N = 8 characters + sentinel)</span>
              <span className="text-[10px] text-[var(--text-muted)] font-mono">Indices 9..17</span>
            </div>

            <div className="grid grid-cols-9 gap-1.5 font-mono text-center">
              {data.half2.map((char, idx) => {
                const globalIdx = idx + 9;
                const isBegin = data.lexemeBegin === globalIdx;
                const isForward = data.forward === globalIdx;
                const isSentinel = idx === 4 || idx === 8;

                return (
                  <div key={idx} className="flex flex-col items-center">
                    <div
                      className={`w-full aspect-square flex items-center justify-center rounded-[var(--r-sm)] border text-sm font-bold transition-all ${
                        isSentinel
                          ? 'bg-[var(--danger)]/15 border-[var(--danger)]/50 text-[var(--danger)]'
                          : 'bg-[var(--surface-2)] border-[var(--border)] text-[var(--text)]'
                      }`}
                    >
                      {char}
                    </div>
                    {/* Pointers under cell */}
                    <div className="h-6 mt-1 flex flex-col items-center text-[10px] font-bold">
                      {isBegin && <span className="text-[var(--purple)] leading-none">▲ B</span>}
                      {isForward && <span className="text-[var(--accent)] leading-none">▲ F</span>}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Pointer Legend and Current Status */}
        <div className="p-3.5 rounded-[var(--r-md)] bg-[var(--surface)] border border-[var(--border)] flex flex-wrap items-center justify-between gap-4 text-xs font-mono">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[var(--purple)]" />
              <span className="text-[var(--purple)] font-bold">lexemeBegin:</span>
              <span className="text-[var(--text)]">points to start of current word</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[var(--accent)]" />
              <span className="text-[var(--accent)] font-bold">forward:</span>
              <span className="text-[var(--text)]">advances character by character</span>
            </div>
          </div>

          {data.recognized && (
            <div className="px-2.5 py-1 rounded-[var(--r-sm)] bg-[var(--success)]/15 text-[var(--success)] border border-[var(--success)]/30 font-semibold">
              Recognized: {data.recognized}
            </div>
          )}
        </div>
      </div>
    </WidgetFrame>
  );
}

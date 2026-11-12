'use client';

import { useState } from 'react';
import { WidgetFrame } from '../shared/WidgetFrame';

type PassMode = 'value' | 'ref' | 'copy-restore' | 'name';

export function ParamPassingLab() {
  const [mode, setMode] = useState<PassMode>('value');

  return (
    <WidgetFrame
      title="Parameter Passing Mechanisms Laboratory"
      notice="Trace: void f(int x, int y) { x = x + 1; y = y + x; } called as f(a, a) with a = 2"
      explanation={
        mode === 'value'
          ? "Call by Value: Parameters are local copies in f. Changes to x and y never affect variable a. print(a) output is 2."
          : mode === 'ref'
          ? "Call by Reference: Both x and y become aliases of variable a. x = x + 1 sets a=3; y = y + x sets a = 3 + 3 = 6. print(a) is 6."
          : mode === 'copy-restore'
          ? "Copy-Restore (Value-Result): Local copies initialized to 2. At return, x is written back (a=3), then y is written back (a=5). Final a is 5."
          : "Call by Name (Algol 60): Textual replacement. x becomes a, y becomes a. Evaluates identically to reference here: print(a) is 6."
      }
    >
      <div className="space-y-6">
        {/* Mode Selector Tabs */}
        <div className="flex flex-wrap gap-2">
          {(['value', 'ref', 'copy-restore', 'name'] as const).map((m) => (
            <button
              key={m}
              onClick={() => setMode(m)}
              className={`px-3 py-1.5 rounded-[var(--r-md)] border text-xs font-semibold uppercase cursor-pointer transition-colors ${
                mode === m
                  ? 'bg-[var(--accent)] text-black border-[var(--accent)]'
                  : 'bg-[var(--surface)] text-[var(--text-muted)] border-[var(--border)]'
              }`}
            >
              {m === 'value'
                ? 'Call by Value'
                : m === 'ref'
                ? 'Call by Reference'
                : m === 'copy-restore'
                ? 'Copy-Restore'
                : 'Call by Name'}
            </button>
          ))}
        </div>

        {/* Source Code & Memory Trace */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start font-mono text-xs">
          {/* Source Code */}
          <div className="p-4 rounded-[var(--r-md)] bg-[var(--code-bg)] border border-[var(--border)] space-y-2">
            <div className="text-[10px] text-[var(--text-muted)] uppercase font-bold">Procedure Definition</div>
            <pre className="text-[var(--text)] leading-relaxed m-0">
{`void f(int x, int y) {
    x = x + 1;
    y = y + x;
}

main() {
    int a = 2;
    f(a, a);
    print(a);
}`}
            </pre>
          </div>

          {/* Trace Execution & Final Output */}
          <div className="p-5 rounded-[var(--r-md)] bg-[var(--surface)] border border-[var(--border)] space-y-4">
            <div className="text-[10px] text-[var(--text-muted)] uppercase font-bold">Execution Trace</div>

            {mode === 'value' && (
              <div className="space-y-2 text-[var(--text)]">
                <div>1. Caller allocates <code>a = 2</code></div>
                <div>2. Callee receives local copies: <code>x = 2, y = 2</code></div>
                <div>3. <code>x = 2 + 1 = 3</code> (local copy only)</div>
                <div>4. <code>y = 2 + 3 = 5</code> (local copy only)</div>
                <div>5. Function exits; copies discarded. Variable <code>a</code> untouched.</div>
              </div>
            )}

            {mode === 'ref' && (
              <div className="space-y-2 text-[var(--text)]">
                <div>1. Caller allocates <code>a = 2</code></div>
                <div>2. <code>x</code> and <code>y</code> both point to address of <code>a</code></div>
                <div>3. <code>x = x + 1</code> modifies memory of <code>a</code> → <code>a = 3</code></div>
                <div>4. <code>y = y + x</code> evaluates <code>3 + 3 = 6</code> → <code>a = 6</code></div>
              </div>
            )}

            {mode === 'copy-restore' && (
              <div className="space-y-2 text-[var(--text)]">
                <div>1. Initial copy-in: <code>x = 2, y = 2</code></div>
                <div>2. Local calculations: <code>x = 3, y = 5</code></div>
                <div>3. Copy-out at return: <code>a ← x</code> (sets a = 3)</div>
                <div>4. Copy-out next: <code>a ← y</code> (overwrites a = 5!)</div>
              </div>
            )}

            {mode === 'name' && (
              <div className="space-y-2 text-[var(--text)]">
                <div>1. Textual substitution: replace <code>x</code> with <code>a</code>, <code>y</code> with <code>a</code></div>
                <div>2. Body becomes: <code>a = a + 1; a = a + a;</code></div>
                <div>3. <code>a = 2 + 1 = 3</code></div>
                <div>4. <code>a = 3 + 3 = 6</code></div>
              </div>
            )}

            {/* Output Badge */}
            <div className="pt-3 border-t border-[var(--border)] flex items-center justify-between">
              <span className="text-[var(--text-muted)]">Terminal Output print(a):</span>
              <span className="text-xl font-bold font-mono text-[var(--accent)]">
                {mode === 'value' ? '2' : mode === 'copy-restore' ? '5' : '6'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </WidgetFrame>
  );
}

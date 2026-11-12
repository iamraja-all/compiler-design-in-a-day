'use client';

import { useState } from 'react';
import { WidgetFrame } from '../shared/WidgetFrame';
import { StepperControls } from '../shared/StepperControls';
import { StateNode, Edge, StartArrow, SvgArrowDefs } from '../shared/SvgPrimitives';
import { CheckCircle2, XCircle } from 'lucide-react';

type MachineType = 'm1' | 'm2' | 'm3';

export function DfaSimulator() {
  const [machine, setMachine] = useState<MachineType>('m1');
  const [inputString, setInputString] = useState('abb');
  const [currentStep, setCurrentStep] = useState(0);

  // Machine 1 Simulation
  const simulateM1 = (str: string) => {
    const states = [0];
    const explanations = ['Start at initial state 0.'];
    let state = 0;

    for (let i = 0; i < str.length; i++) {
      const char = str[i];
      if (char === 'a') {
        state = 1;
        states.push(state);
        explanations.push(`Read 'a': transition to state 1.`);
      } else if (char === 'b') {
        if (state === 0) state = 0;
        else if (state === 1) state = 2;
        else if (state === 2) state = 3;
        else if (state === 3) state = 0;
        states.push(state);
        explanations.push(`Read 'b': transition to state ${state}.`);
      } else {
        state = -1; // invalid symbol
        states.push(state);
        explanations.push(`Invalid character '${char}'! Reject.`);
        break;
      }
    }
    return { states, isAccepted: state === 3, explanations };
  };

  // Machine 2 Simulation
  const simulateM2 = (str: string) => {
    const states = [0];
    const explanations = ['Start at state 0.'];
    let state = 0;

    for (let i = 0; i < str.length; i++) {
      const char = str[i];
      if (i === 0) {
        if (/[A-Za-z_]/.test(char)) {
          state = 1;
          states.push(state);
          explanations.push(`Read letter '${char}': valid identifier start, transition to state 1.`);
        } else {
          state = -1;
          states.push(state);
          explanations.push(`Character '${char}' cannot start an identifier! Dead state.`);
          break;
        }
      } else {
        if (/[A-Za-z0-9_]/.test(char)) {
          state = 1;
          states.push(state);
          explanations.push(`Read '${char}': stay in identifier state 1.`);
        } else {
          state = -1;
          states.push(state);
          explanations.push(`Invalid identifier character '${char}'.`);
          break;
        }
      }
    }
    return { states, isAccepted: state === 1, explanations };
  };

  // Machine 3 Simulation (Relop)
  const simulateM3 = (str: string) => {
    const states = [0];
    const explanations = ['Start at state 0.'];
    let state = 0;

    if (str.startsWith('<=')) {
      states.push(1, 2);
      explanations.push("Read '<': transition to state 1.", "Read '=': transition to state 2 [token: LE].");
    } else if (str.startsWith('<>')) {
      states.push(1, 3);
      explanations.push("Read '<': transition to state 1.", "Read '>': transition to state 3 [token: NE].");
    } else if (str.startsWith('<')) {
      states.push(1, 4);
      explanations.push("Read '<': transition to state 1.", "Read other: state 4* [token: LT, retract one character].");
    } else if (str.startsWith('=')) {
      states.push(5);
      explanations.push("Read '=': state 5 [token: EQ].");
    } else if (str.startsWith('>=')) {
      states.push(6, 7);
      explanations.push("Read '>': transition to state 6.", "Read '=': state 7 [token: GE].");
    } else if (str.startsWith('>')) {
      states.push(6, 8);
      explanations.push("Read '>': transition to state 6.", "Read other: state 8* [token: GT, retract one character].");
    } else {
      states.push(-1);
      explanations.push('Not a relational operator.');
    }

    const acceptStates = [2, 3, 4, 5, 7, 8];
    const finalState = states[states.length - 1];
    return { states, isAccepted: acceptStates.includes(finalState), explanations };
  };

  const simulation =
    machine === 'm1'
      ? simulateM1(inputString)
      : machine === 'm2'
      ? simulateM2(inputString)
      : simulateM3(inputString);

  const activeStep = Math.min(currentStep, simulation.states.length - 1);
  const currentState = simulation.states[activeStep];
  const isFinished = activeStep === simulation.states.length - 1;

  const handleMachineChange = (m: MachineType) => {
    setMachine(m);
    setCurrentStep(0);
    if (m === 'm1') setInputString('abb');
    if (m === 'm2') setInputString('x1');
    if (m === 'm3') setInputString('<=');
  };

  return (
    <WidgetFrame
      title="DFA Execution Simulator"
      notice="Select a machine and string to step through state transitions"
      explanation={simulation.explanations[activeStep] || 'Simulating transitions.'}
      controls={
        <StepperControls
          currentStep={activeStep}
          totalSteps={simulation.states.length}
          onStepChange={setCurrentStep}
          onReset={() => setCurrentStep(0)}
        />
      }
    >
      <div className="space-y-6">
        {/* Controls: Machine picker + Preset chips + Input box */}
        <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-[var(--r-md)] bg-[var(--surface)] border border-[var(--border)]">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider">
              Machine:
            </span>
            <select
              value={machine}
              onChange={(e) => handleMachineChange(e.target.value as MachineType)}
              className="px-3 py-1.5 rounded-[var(--r-sm)] bg-[var(--surface-2)] border border-[var(--border)] text-xs font-semibold text-[var(--text)] focus:border-[var(--accent)]"
            >
              <option value="m1">Machine 1: Ends with &apos;abb&apos;</option>
              <option value="m2">Machine 2: C Identifier</option>
              <option value="m3">Machine 3: Relop Transition Diagram</option>
            </select>
          </div>

          {/* Presets */}
          <div className="flex flex-wrap items-center gap-1.5 font-mono text-xs">
            <span className="text-[11px] text-[var(--text-muted)]">Presets:</span>
            {machine === 'm1' &&
              ['abb', 'aabb', 'babb', 'abab', 'abbb', 'ab'].map((p) => (
                <button
                  key={p}
                  onClick={() => {
                    setInputString(p);
                    setCurrentStep(0);
                  }}
                  className="px-2 py-0.5 rounded-[var(--r-sm)] bg-[var(--surface-2)] border border-[var(--border)] hover:border-[var(--accent)] text-[var(--text)] transition-colors cursor-pointer"
                >
                  {p}
                </button>
              ))}
            {machine === 'm2' &&
              ['x1', 'count', '9lives'].map((p) => (
                <button
                  key={p}
                  onClick={() => {
                    setInputString(p);
                    setCurrentStep(0);
                  }}
                  className="px-2 py-0.5 rounded-[var(--r-sm)] bg-[var(--surface-2)] border border-[var(--border)] hover:border-[var(--accent)] text-[var(--text)] transition-colors cursor-pointer"
                >
                  {p}
                </button>
              ))}
            {machine === 'm3' &&
              ['<=', '<>', '<a', '=', '>=', '>x'].map((p) => (
                <button
                  key={p}
                  onClick={() => {
                    setInputString(p);
                    setCurrentStep(0);
                  }}
                  className="px-2 py-0.5 rounded-[var(--r-sm)] bg-[var(--surface-2)] border border-[var(--border)] hover:border-[var(--accent)] text-[var(--text)] transition-colors cursor-pointer"
                >
                  {p}
                </button>
              ))}
          </div>
        </div>

        {/* Input tape display */}
        <div className="flex items-center justify-between p-3.5 rounded-[var(--r-md)] bg-[var(--surface)] border border-[var(--border)]">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-[var(--text-muted)] font-mono">TAPE:</span>
            <div className="flex items-center gap-1 font-mono text-sm">
              {inputString.split('').map((c, i) => (
                <span
                  key={i}
                  className={`w-7 h-7 flex items-center justify-center rounded-[var(--r-sm)] border font-bold transition-all ${
                    i === activeStep - 1
                      ? 'bg-[var(--accent)] text-black border-[var(--accent)]'
                      : i < activeStep - 1
                      ? 'bg-[var(--surface-2)] text-[var(--text-muted)] border-[var(--border)]'
                      : 'bg-[var(--surface)] text-[var(--text)] border-[var(--border)]'
                  }`}
                >
                  {c}
                </span>
              ))}
            </div>
          </div>

          {/* Verdict Badge */}
          {isFinished && (
            <div
              className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${
                simulation.isAccepted
                  ? 'bg-[var(--success)]/15 text-[var(--success)] border border-[var(--success)]/40'
                  : 'bg-[var(--danger)]/15 text-[var(--danger)] border border-[var(--danger)]/40'
              }`}
            >
              {simulation.isAccepted ? (
                <>
                  <CheckCircle2 className="w-4 h-4" /> ACCEPTED
                </>
              ) : (
                <>
                  <XCircle className="w-4 h-4" /> REJECTED
                </>
              )}
            </div>
          )}
        </div>

        {/* Machine 1 SVG diagram */}
        {machine === 'm1' && (
          <div className="w-full bg-[var(--surface)] rounded-[var(--r-md)] border border-[var(--border)] p-4 overflow-x-auto">
            <svg
              viewBox="0 0 1000 360"
              className="w-full min-w-[700px] h-auto select-none"
              role="img"
              aria-label="DFA for (a|b)*abb"
            >
              <SvgArrowDefs />
              <StartArrow x={150} y={200} />

              {/* State 0 */}
              <Edge x1={150} y1={200} x2={150} y2={200} label="b" isSelfLoop />
              <Edge x1={150} y1={200} x2={400} y2={200} label="a" isCurrent={currentState === 1 && activeStep > 0} />

              {/* State 1 */}
              <Edge x1={400} y1={200} x2={400} y2={200} label="a" isSelfLoop />
              <Edge x1={400} y1={200} x2={650} y2={200} label="b" isCurrent={currentState === 2} />

              {/* State 2 */}
              <Edge x1={650} y1={200} x2={400} y2={200} label="a" isCurved curveOffset={-40} />
              <Edge x1={650} y1={200} x2={880} y2={200} label="b" isCurrent={currentState === 3} />

              {/* State 3 (Accepting) */}
              <Edge x1={880} y1={200} x2={400} y2={200} label="a" isCurved curveOffset={-70} />
              <Edge x1={880} y1={200} x2={150} y2={200} label="b" isCurved curveOffset={80} />

              <StateNode id="0" x={150} y={200} isCurrent={currentState === 0} />
              <StateNode id="1" x={400} y={200} isCurrent={currentState === 1} />
              <StateNode id="2" x={650} y={200} isCurrent={currentState === 2} />
              <StateNode id="3" x={880} y={200} isAccepting isCurrent={currentState === 3} />
            </svg>
          </div>
        )}

        {/* Machine 2 SVG diagram */}
        {machine === 'm2' && (
          <div className="w-full bg-[var(--surface)] rounded-[var(--r-md)] border border-[var(--border)] p-4 overflow-x-auto">
            <svg
              viewBox="0 0 800 300"
              className="w-full min-w-[500px] h-auto select-none"
              role="img"
              aria-label="DFA for Identifiers"
            >
              <SvgArrowDefs />
              <StartArrow x={200} y={150} />
              <Edge x1={200} y1={150} x2={550} y2={150} label="letter, _" isCurrent={currentState === 1} />
              <Edge x1={550} y1={150} x2={550} y2={150} label="letter, digit, _" isSelfLoop />

              <StateNode id="0" x={200} y={150} isCurrent={currentState === 0} />
              <StateNode id="1" x={550} y={150} isAccepting isCurrent={currentState === 1} />
            </svg>
          </div>
        )}

        {/* Machine 3 SVG diagram (Relop) */}
        {machine === 'm3' && (
          <div className="w-full bg-[var(--surface)] rounded-[var(--r-md)] border border-[var(--border)] p-4 overflow-x-auto">
            <svg
              viewBox="0 0 950 360"
              className="w-full min-w-[700px] h-auto select-none"
              role="img"
              aria-label="Relational operator transition diagram"
            >
              <SvgArrowDefs />
              <StartArrow x={100} y={180} />

              <Edge x1={100} y1={180} x2={300} y2={80} label="<" />
              <Edge x1={300} y1={80} x2={550} y2={40} label="=" />
              <Edge x1={300} y1={80} x2={550} y2={90} label=">" />
              <Edge x1={300} y1={80} x2={550} y2={140} label="other" />

              <Edge x1={100} y1={180} x2={550} y2={190} label="=" />

              <Edge x1={100} y1={180} x2={300} y2={280} label=">" />
              <Edge x1={300} y1={280} x2={550} y2={250} label="=" />
              <Edge x1={300} y1={280} x2={550} y2={310} label="other" />

              <StateNode id="0" x={100} y={180} isCurrent={currentState === 0} />
              <StateNode id="1" x={300} y={80} isCurrent={currentState === 1} />
              <StateNode id="2" x={550} y={40} sublabel="LE" isAccepting isCurrent={currentState === 2} />
              <StateNode id="3" x={550} y={90} sublabel="NE" isAccepting isCurrent={currentState === 3} />
              <StateNode id="4*" x={550} y={140} sublabel="LT (retract)" isAccepting isCurrent={currentState === 4} />
              <StateNode id="5" x={550} y={190} sublabel="EQ" isAccepting isCurrent={currentState === 5} />
              <StateNode id="6" x={300} y={280} isCurrent={currentState === 6} />
              <StateNode id="7" x={550} y={250} sublabel="GE" isAccepting isCurrent={currentState === 7} />
              <StateNode id="8*" x={550} y={310} sublabel="GT (retract)" isAccepting isCurrent={currentState === 8} />
            </svg>
          </div>
        )}
      </div>
    </WidgetFrame>
  );
}

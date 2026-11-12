export interface ThompsonRule {
  id: string;
  name: string;
  description: string;
}

export const THOMPSON_RULES: ThompsonRule[] = [
  { id: 'eps', name: 'ε (epsilon)', description: 'Initial state i transitions to final state f on ε.' },
  { id: 'sym', name: 'Symbol a', description: 'Initial state i transitions to final state f on symbol a.' },
  { id: 'union', name: 'Union (s | t)', description: 'New start with ε to N(s) and N(t); both branch to new accept on ε.' },
  { id: 'concat', name: 'Concat (st)', description: 'Accept state of N(s) merges directly with start state of N(t).' },
  { id: 'star', name: 'Star (s*)', description: 'New start & accept; ε-bypass forward and ε-feedback loop backward.' },
];

export const THOMPSON_BUILD_STEPS = [
  {
    step: 1,
    title: 'Base sub-expressions: a and b',
    say: "Construct the primitive NFAs for single character symbols 'a' (2→3) and 'b' (4→5).",
    visibleStates: [2, 3, 4, 5],
    visibleEdges: [
      { from: 2, to: 3, label: 'a' },
      { from: 4, to: 5, label: 'b' },
    ],
  },
  {
    step: 2,
    title: 'Union: (a | b)',
    say: 'Create new start state 1 and merging state 6 with ε-transitions to and from both branches.',
    visibleStates: [1, 2, 3, 4, 5, 6],
    visibleEdges: [
      { from: 1, to: 2, label: 'ε', isEpsilon: true },
      { from: 1, to: 4, label: 'ε', isEpsilon: true },
      { from: 2, to: 3, label: 'a' },
      { from: 4, to: 5, label: 'b' },
      { from: 3, to: 6, label: 'ε', isEpsilon: true },
      { from: 5, to: 6, label: 'ε', isEpsilon: true },
    ],
  },
  {
    step: 3,
    title: 'Kleene Closure: (a | b)*',
    say: 'Add outer start state 0 and exit state 7, with a backward loop 6→1 and forward bypass 0→7.',
    visibleStates: [0, 1, 2, 3, 4, 5, 6, 7],
    visibleEdges: [
      { from: 0, to: 1, label: 'ε', isEpsilon: true },
      { from: 0, to: 7, label: 'ε', isEpsilon: true, isCurved: true, curveOffset: 70 },
      { from: 1, to: 2, label: 'ε', isEpsilon: true },
      { from: 1, to: 4, label: 'ε', isEpsilon: true },
      { from: 2, to: 3, label: 'a' },
      { from: 4, to: 5, label: 'b' },
      { from: 3, to: 6, label: 'ε', isEpsilon: true },
      { from: 5, to: 6, label: 'ε', isEpsilon: true },
      { from: 6, to: 1, label: 'ε', isEpsilon: true, isCurved: true, curveOffset: -70 },
      { from: 6, to: 7, label: 'ε', isEpsilon: true },
    ],
  },
  {
    step: 4,
    title: "Concatenate 'a'",
    say: "Extend state 7 on transition 'a' to new state 8.",
    visibleStates: [0, 1, 2, 3, 4, 5, 6, 7, 8],
    visibleEdges: [
      { from: 0, to: 1, label: 'ε', isEpsilon: true },
      { from: 0, to: 7, label: 'ε', isEpsilon: true, isCurved: true, curveOffset: 70 },
      { from: 1, to: 2, label: 'ε', isEpsilon: true },
      { from: 1, to: 4, label: 'ε', isEpsilon: true },
      { from: 2, to: 3, label: 'a' },
      { from: 4, to: 5, label: 'b' },
      { from: 3, to: 6, label: 'ε', isEpsilon: true },
      { from: 5, to: 6, label: 'ε', isEpsilon: true },
      { from: 6, to: 1, label: 'ε', isEpsilon: true, isCurved: true, curveOffset: -70 },
      { from: 6, to: 7, label: 'ε', isEpsilon: true },
      { from: 7, to: 8, label: 'a' },
    ],
  },
  {
    step: 5,
    title: "Concatenate 'b', 'b' → Final NFA",
    say: "Chain transitions on 'b' to state 9 and final accepting state 10.",
    visibleStates: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
    visibleEdges: [
      { from: 0, to: 1, label: 'ε', isEpsilon: true },
      { from: 0, to: 7, label: 'ε', isEpsilon: true, isCurved: true, curveOffset: 70 },
      { from: 1, to: 2, label: 'ε', isEpsilon: true },
      { from: 1, to: 4, label: 'ε', isEpsilon: true },
      { from: 2, to: 3, label: 'a' },
      { from: 4, to: 5, label: 'b' },
      { from: 3, to: 6, label: 'ε', isEpsilon: true },
      { from: 5, to: 6, label: 'ε', isEpsilon: true },
      { from: 6, to: 1, label: 'ε', isEpsilon: true, isCurved: true, curveOffset: -70 },
      { from: 6, to: 7, label: 'ε', isEpsilon: true },
      { from: 7, to: 8, label: 'a' },
      { from: 8, to: 9, label: 'b' },
      { from: 9, to: 10, label: 'b' },
    ],
  },
];

export const THOMPSON_NODE_POSITIONS: Record<number, { x: number; y: number }> = {
  0: { x: 60, y: 200 },
  1: { x: 160, y: 200 },
  2: { x: 260, y: 120 },
  3: { x: 360, y: 120 },
  4: { x: 260, y: 280 },
  5: { x: 360, y: 280 },
  6: { x: 460, y: 200 },
  7: { x: 580, y: 200 },
  8: { x: 690, y: 200 },
  9: { x: 800, y: 200 },
  10: { x: 910, y: 200 },
};

export const SUBSET_STEPS = [
  {
    step: 1,
    state: 'A',
    nfaSet: '{0, 1, 2, 4, 7}',
    onA: '—',
    onB: '—',
    highlightNfa: [0, 1, 2, 4, 7],
    say: 'Start: everywhere reachable from 0 using free ε-moves.',
  },
  {
    step: 2,
    state: 'A',
    nfaSet: '{0, 1, 2, 4, 7}',
    onA: 'B = {1, 2, 3, 4, 6, 7, 8}',
    onB: '—',
    highlightNfa: [3, 8, 1, 2, 4, 6, 7],
    say: "From A on 'a', NFA can reach 3 and 8; add their ε-closure to get new state B.",
  },
  {
    step: 3,
    state: 'A',
    nfaSet: '{0, 1, 2, 4, 7}',
    onA: 'B',
    onB: 'C = {1, 2, 4, 5, 6, 7}',
    highlightNfa: [5, 1, 2, 4, 6, 7],
    say: "move(A, b) = {5} → ε-closure is C = {1, 2, 4, 5, 6, 7}.",
  },
  {
    step: 4,
    state: 'B',
    nfaSet: '{1, 2, 3, 4, 6, 7, 8}',
    onA: 'B',
    onB: 'D = {1, 2, 4, 5, 6, 7, 9}',
    highlightNfa: [5, 9, 1, 2, 4, 6, 7],
    say: "B on 'a' goes back to B. B on 'b' reaches {5, 9} whose closure is new state D.",
  },
  {
    step: 5,
    state: 'C',
    nfaSet: '{1, 2, 4, 5, 6, 7}',
    onA: 'B',
    onB: 'C',
    highlightNfa: [1, 2, 4, 5, 6, 7],
    say: "C on 'a' reaches B; C on 'b' stays in C.",
  },
  {
    step: 6,
    state: 'D',
    nfaSet: '{1, 2, 4, 5, 6, 7, 9}',
    onA: 'B',
    onB: 'E = {1, 2, 4, 5, 6, 7, 10}',
    highlightNfa: [5, 10, 1, 2, 4, 6, 7],
    say: "D on 'a' reaches B; D on 'b' reaches {5, 10} yielding new state E.",
  },
  {
    step: 7,
    state: 'E',
    nfaSet: '{1, 2, 4, 5, 6, 7, 10}',
    onA: 'B',
    onB: 'C',
    highlightNfa: [10],
    say: "E on 'a' reaches B; E on 'b' reaches C. No new states are generated. Construction complete!",
  },
  {
    step: 8,
    state: '*E',
    nfaSet: 'Accepting Identification',
    onA: 'B',
    onB: 'C',
    highlightNfa: [10],
    say: 'Accepting = any subset containing NFA final state 10 → Only subset E is accepting.',
  },
];

export const MINIMIZATION_STEPS = [
  {
    step: 1,
    title: 'Initial Partition Π0',
    groups: [
      { name: 'Non-accepting', states: ['A', 'B', 'C', 'D'], isAccepting: false },
      { name: 'Accepting', states: ['E'], isAccepting: true },
    ],
    say: 'First split: partition all states into non-accepting {A, B, C, D} vs accepting {E}.',
  },
  {
    step: 2,
    title: "Test on input 'b' → Split off D",
    groups: [
      { name: 'Group 1', states: ['A', 'B', 'C'], isAccepting: false },
      { name: 'Group 2', states: ['D'], isAccepting: false },
      { name: 'Group 3', states: ['E'], isAccepting: true },
    ],
    say: "Test on 'b': A→C, B→D, C→C, but D→E. D transitions into group {E}, while others stay within. Split off D: Π1 = {A,B,C}{D}{E}.",
  },
  {
    step: 3,
    title: "Test {A, B, C} on 'b' → Split off B",
    groups: [
      { name: 'Group 1', states: ['A', 'C'], isAccepting: false },
      { name: 'Group 2', states: ['B'], isAccepting: false },
      { name: 'Group 3', states: ['D'], isAccepting: false },
      { name: 'Group 4', states: ['E'], isAccepting: true },
    ],
    say: "Test {A, B, C} on 'b': A→C (Group 1), C→C (Group 1), but B→D (Group {D}). B splits off: Π2 = {A, C}{B}{D}{E}.",
  },
  {
    step: 4,
    title: 'Test {A, C} → Stable',
    groups: [
      { name: '{A, C}', states: ['A', 'C'], isAccepting: false },
      { name: '{B}', states: ['B'], isAccepting: false },
      { name: '{D}', states: ['D'], isAccepting: false },
      { name: '{E}', states: ['E'], isAccepting: true },
    ],
    say: "Test {A, C}: on 'a' both go to B; on 'b' both go to C. They behave identically under all inputs and cannot be split. Final partition!",
  },
  {
    step: 5,
    title: 'Rename & Emit Minimized 4-State DFA',
    groups: [
      { name: 'State 0', states: ['{A, C}'], isAccepting: false },
      { name: 'State 1', states: ['B'], isAccepting: false },
      { name: 'State 2', states: ['D'], isAccepting: false },
      { name: 'State 3', states: ['E (Accept)'], isAccepting: true },
    ],
    say: 'Rename: {A, C}=0, B=1, D=2, E=3. The 11-state NFA is now an optimal 4-state DFA.',
  },
];

export const ANNOTATED_TREE_STEPS = [
  { step: 1, node: 'digit(3)', value: '3', say: 'Leaf digit: lexval = 3.' },
  { step: 2, node: 'F', value: '3', say: 'F → digit: F.val = 3.' },
  { step: 3, node: 'T', value: '3', say: 'T → F: T.val = 3.' },
  { step: 4, node: 'digit(5)', value: '5', say: 'Leaf digit: lexval = 5.' },
  { step: 5, node: 'F', value: '5', say: 'F → digit: F.val = 5.' },
  { step: 6, node: 'T', value: '15', say: 'T → T1 * F: T.val = 3 * 5 = 15.' },
  { step: 7, node: 'E', value: '15', say: 'E → T: E.val = 15.' },
  { step: 8, node: 'digit(4)', value: '4', say: 'Leaf digit: lexval = 4.' },
  { step: 9, node: 'F', value: '4', say: 'F → digit: F.val = 4.' },
  { step: 10, node: 'T', value: '4', say: 'T → F: T.val = 4.' },
  { step: 11, node: 'E', value: '19', say: 'E → E1 + T: E.val = 15 + 4 = 19.' },
  { step: 12, node: 'L', value: 'print 19', say: 'L → E n: evaluate print(19). Each value computed from children only (Synthesized S-attributed SDD).' },
];

export const BACKPATCH_STEPS = [
  {
    step: 1,
    say: 'a < b: Emit conditional jump to unknown true exit, and unconditional jump to unknown false exit.',
    lines: [
      { num: 100, code: 'if a < b goto _', tag: 'true exit' },
      { num: 101, code: 'goto _', tag: 'false exit' },
    ],
    state: 'B1.truelist = {100}, B1.falselist = {101}',
  },
  {
    step: 2,
    say: 'Marker M1 records current instruction address 102.',
    lines: [
      { num: 100, code: 'if a < b goto _', tag: 'true exit' },
      { num: 101, code: 'goto _', tag: 'false exit' },
    ],
    state: 'M1.instr = 102',
  },
  {
    step: 3,
    say: 'c < d: Emit instructions 102 and 103 with empty target fields.',
    lines: [
      { num: 100, code: 'if a < b goto _', tag: 'true exit' },
      { num: 101, code: 'goto _', tag: 'false exit' },
      { num: 102, code: 'if c < d goto _', tag: 'true exit' },
      { num: 103, code: 'goto _', tag: 'false exit' },
    ],
    state: 'B2.truelist = {102}, B2.falselist = {103}',
  },
  {
    step: 4,
    say: 'Marker M2 records instruction address 104.',
    lines: [
      { num: 100, code: 'if a < b goto _', tag: 'true exit' },
      { num: 101, code: 'goto _', tag: 'false exit' },
      { num: 102, code: 'if c < d goto _', tag: 'true exit' },
      { num: 103, code: 'goto _', tag: 'false exit' },
    ],
    state: 'M2.instr = 104',
  },
  {
    step: 5,
    say: 'e < f: Emit instructions 104 and 105.',
    lines: [
      { num: 100, code: 'if a < b goto _', tag: 'true exit' },
      { num: 101, code: 'goto _', tag: 'false exit' },
      { num: 102, code: 'if c < d goto _', tag: 'true exit' },
      { num: 103, code: 'goto _', tag: 'false exit' },
      { num: 104, code: 'if e < f goto _', tag: 'true exit' },
      { num: 105, code: 'goto _', tag: 'false exit' },
    ],
    state: 'B3.truelist = {104}, B3.falselist = {105}',
  },
  {
    step: 6,
    say: '&& operator: Backpatch B2.truelist {102} to 104! Merge falselists: {103, 105}.',
    lines: [
      { num: 100, code: 'if a < b goto _', tag: 'true exit' },
      { num: 101, code: 'goto _', tag: 'false exit' },
      { num: 102, code: 'if c < d goto 104', tag: 'backpatched!' },
      { num: 103, code: 'goto _', tag: 'false exit' },
      { num: 104, code: 'if e < f goto _', tag: 'true exit' },
      { num: 105, code: 'goto _', tag: 'false exit' },
    ],
    state: 'backpatch({102}, 104); B_and.truelist = {104}, B_and.falselist = {103, 105}',
  },
  {
    step: 7,
    say: '|| operator: Backpatch B1.falselist {101} to 102! Merge truelists: {100, 104}.',
    lines: [
      { num: 100, code: 'if a < b goto _', tag: 'true exit' },
      { num: 101, code: 'goto 102', tag: 'backpatched!' },
      { num: 102, code: 'if c < d goto 104', tag: 'backpatched!' },
      { num: 103, code: 'goto _', tag: 'false exit' },
      { num: 104, code: 'if e < f goto _', tag: 'true exit' },
      { num: 105, code: 'goto _', tag: 'false exit' },
    ],
    state: 'backpatch({101}, 102); B.truelist = {100, 104}, B.falselist = {103, 105}',
  },
];

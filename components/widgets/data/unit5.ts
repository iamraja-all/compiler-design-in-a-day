export const OPT_GALLERY = [
  {
    id: 'cse',
    title: 'Common Subexpression Elimination',
    why: 'Reuses previously computed value instead of recalculating 4 * i.',
    before: 't1 = 4 * i\nt2 = a[t1]\nt3 = 4 * i\nt4 = b[t3]',
    after: 't1 = 4 * i\nt2 = a[t1]\nt4 = b[t1]',
  },
  {
    id: 'copy-prop',
    title: 'Copy Propagation',
    why: 'Replaces uses of x with y, exposing dead code for elimination.',
    before: 'x = y\nz = x + 1',
    after: 'x = y\nz = y + 1',
  },
  {
    id: 'dce',
    title: 'Dead Code Elimination',
    why: 'Removes statements whose results are never used or conditional branches that never execute.',
    before: 'debug = false\nif (debug) {\n    print(x)\n}',
    after: '// (if-statement completely eliminated)',
  },
  {
    id: 'const-fold',
    title: 'Constant Folding',
    why: 'Evaluates operations on constants at compile-time instead of running them on the CPU.',
    before: 'area = 3.14 * 2 * 2',
    after: 'area = 12.56',
  },
  {
    id: 'code-motion',
    title: 'Code Motion (Loop-Invariant Hoisting)',
    why: 'Hoists expressions that do not change inside the loop outside the loop header.',
    before: 'while (i < n) {\n    x = y + z\n    a[i] = x * i\n    i++\n}',
    after: 'x = y + z\nwhile (i < n) {\n    a[i] = x * i\n    i++\n}',
  },
  {
    id: 'strength-red',
    title: 'Strength Reduction & Induction Variable Elimination',
    why: '4 * i rises by 4 every iteration, so replace expensive multiplication with cheap addition (t1 = t1 + 4). Then i is not needed: test t1 <= 80.',
    before: 'B1: prod = 0\n    i = 1\nB2: t1 = 4 * i\n    t2 = a[t1]\n    t3 = 4 * i\n    t4 = b[t3]\n    t5 = t2 * t4\n    prod = prod + t5\n    i = i + 1\n    if i <= 20 goto B2',
    after: 'B1: prod = 0\n    t1 = 4\nB2: t2 = a[t1]\n    t4 = b[t1]\n    t5 = t2 * t4\n    prod = prod + t5\n    t1 = t1 + 4\n    if t1 <= 80 goto B2',
  },
];

export const PEEPHOLE_PATTERNS = [
  {
    name: 'Redundant Load/Store',
    before: 'MOV R0, a\nMOV a, R0',
    after: 'MOV R0, a',
    why: "The second instruction stores R0 into 'a', but 'a' already contains R0.",
  },
  {
    name: 'Unreachable Code',
    before: 'goto L2\nx = 1  // no label',
    after: 'goto L2',
    why: "Instruction 'x = 1' immediately follows an unconditional jump and has no label; control can never reach it.",
  },
  {
    name: 'Flow-of-Control Optimization (Jumps over Jumps)',
    before: 'goto L1\n...\nL1: goto L2',
    after: 'goto L2\n...\nL1: goto L2',
    why: "Direct jump to target L2 avoids sequential hopping through intermediate labels.",
  },
  {
    name: 'Algebraic Simplification',
    before: 'x = x + 0\nx = x * 1',
    after: '// (both removed)',
    why: 'Identity arithmetic operations produce the exact same value and are deleted.',
  },
  {
    name: 'Strength Reduction',
    before: 'x = y * 2\nx = y ^ 2',
    after: 'x = y + y\nx = y * y',
    why: 'Addition is faster than multiplication; multiplication is faster than exponentiation.',
  },
  {
    name: 'Use of Machine Idioms',
    before: 'i = i + 1',
    after: 'INC i',
    why: 'Hardware single-cycle increment instructions are shorter and faster than full register additions.',
  },
];

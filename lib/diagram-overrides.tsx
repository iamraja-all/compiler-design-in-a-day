'use client';

import React from 'react';
import {
  FlowDiagram,
  TreeDiagram,
  AutomatonDiagram,
  MemoryDiagram,
  BeforeAfter,
  AnnotatedCode,
  StepList,
  ChainDiagram,
  CardGrid,
  Timeline,
  GrammarBlock,
} from '@/components/diagrams';

export type DiagramRenderer = (rawText: string) => React.ReactNode;

export const DIAGRAM_OVERRIDES: Record<string, DiagramRenderer> = {
  // =========================================================================
  // 00-INTRODUCTION
  // =========================================================================
  '00-introduction#1': () => (
    <FlowDiagram
      title="Language Processing System"
      ariaLabel="Language Processing System from source program to target machine code"
      direction="vertical"
      steps={[
        {
          id: 'src',
          label: 'source program',
          subtext: '(with #include, #define)',
          highlight: true,
        },
        {
          id: 'prep',
          label: 'Preprocessor',
          badge: 'Prep',
          notes: ['expands macros, pastes header files'],
        },
        {
          id: 'comp',
          label: 'Compiler',
          badge: 'Comp',
          notes: ['→ assembly program'],
        },
        {
          id: 'assemb',
          label: 'Assembler',
          badge: 'Asm',
          notes: ['→ relocatable machine code (.o)'],
        },
        {
          id: 'link',
          label: 'Linker / Loader',
          badge: 'Link',
          notes: ['joins library files (.o, .a) and loads into memory'],
        },
        {
          id: 'target',
          label: 'target machine code (runs!)',
          highlight: true,
        },
      ]}
    />
  ),

  '00-introduction#2': () => (
    <FlowDiagram
      title="Phases of a Compiler"
      ariaLabel="Phases of a compiler showing front end (Units 1-3) and back end (Units 4-5) with Symbol Table and Error Handler"
      direction="vertical"
      steps={[
        { id: 'src', label: 'source program', highlight: true },
        { id: 'p1', label: '1. Lexical Analyzer (Unit I)', badge: 'Unit I', notes: ['Tokens generation'] },
        { id: 'p2', label: '2. Syntax Analyzer (Unit II)', badge: 'Unit II', notes: ['Parse tree generation'] },
        { id: 'p3', label: '3. Semantic Analyzer (Unit III)', badge: 'Unit III', notes: ['Type checking & semantic rules'] },
        { id: 'p4', label: '4. Intermediate Code Generator (Unit III)', badge: 'Unit III', notes: ['Three-address code generation'] },
        { id: 'p5', label: '5. Code Optimizer (Unit V)', badge: 'Unit V', notes: ['Peephole, loops & data-flow optimization'] },
        { id: 'p6', label: '6. Code Generator (Unit IV)', badge: 'Unit IV', notes: ['Target assembly & register allocation'] },
        { id: 'target', label: 'target program', highlight: true },
      ]}
      sideBoxes={[
        {
          title: 'SYMBOL TABLE',
          description: '(shared notes)',
          items: [
            'Stores identifiers, types, scopes, and memory offsets',
            'Accessed and updated across all compiler phases',
          ],
        },
        {
          title: 'ERROR HANDLER',
          description: 'Detects and reports errors at each phase with line numbers and recovery',
        },
      ]}
    />
  ),

  '00-introduction#3': () => (
    <ChainDiagram
      title="Lexical Analysis: Character Stream to Tokens"
      ariaLabel="Mapping characters to token pairs"
      alignedRows={[
        {
          rowTitle: 'Characters',
          cells: [
            { text: 'x' },
            { text: '=' },
            { text: 'a' },
            { text: '+' },
            { text: 'b' },
            { text: '*' },
            { text: '2' },
          ],
        },
        {
          rowTitle: 'Tokens',
          cells: [
            { text: 'id(x)', variant: 'accent' },
            { text: '=', variant: 'default' },
            { text: 'id(a)', variant: 'accent' },
            { text: '+', variant: 'default' },
            { text: 'id(b)', variant: 'accent' },
            { text: '*', variant: 'default' },
            { text: 'num(2)', variant: 'purple' },
          ],
        },
      ]}
      caption="The character stream is grouped into tokens by the Lexical Analyzer."
    />
  ),

  '00-introduction#4': () => (
    <TreeDiagram
      title="Syntax Analysis: Parse Tree"
      ariaLabel="Parse tree for x = a + b * 2"
      tree={{
        label: '=',
        children: [
          { label: 'x' },
          {
            label: '+',
            children: [
              { label: 'a' },
              {
                label: '*',
                children: [{ label: 'b' }, { label: '2' }],
              },
            ],
          },
        ],
      }}
    />
  ),

  '00-introduction#7': () => (
    <BeforeAfter
      title="Code Optimization: Strength Reduction & Copy Propagation"
      ariaLabel="Comparison of unoptimized vs optimized intermediate code"
      techniqueBadge="Strength Reduction"
      before={{
        title: 'BEFORE',
        lines: [
          { text: 't1 = b * 2', type: 'removed' },
          { text: 't2 = a + t1', type: 'removed' },
          { text: 'x  = t2' },
        ],
        notes: ['multiplication instruction is slow'],
      }}
      after={{
        title: 'AFTER',
        lines: [
          { text: 't1 = b + b', type: 'added', badge: 'adding is cheaper than multiplying' },
          { text: 'x  = a + t1', type: 'added', badge: 't2 was not needed' },
        ],
        notes: ['replaced multiplication with addition; eliminated temporary t2 (t2 was not needed)'],
      }}
    />
  ),

  '00-introduction#8': () => (
    <Timeline
      title="1-Day Study Plan Timeline"
      ariaLabel="1-day study schedule across 6 units"
      rows={[
        { time: 'Hour 1–2', unit: 'UNIT I', topics: 'RE → NFA → DFA → Minimize (one machine, three steps)' },
        { time: 'Hour 3–5', unit: 'UNIT II', topics: 'FIRST/FOLLOW → LL(1) → SLR → LALR (most marks live here)' },
        { time: 'Hour 6', unit: 'UNIT III', topics: 'Annotated tree, 3-address code formats, backpatching' },
        { time: 'Hour 7', unit: 'UNIT IV', topics: 'Activation records, basic blocks, code generator' },
        { time: 'Hour 8', unit: 'UNIT V', topics: 'DAG + optimization techniques + data flow' },
        { time: 'Hour 9–10', unit: 'REVISION', topics: 'One problem per ⭐⭐⭐ row + flashcards' },
      ]}
      caption="Structured hourly syllabus to conquer Compiler Design in 24 hours."
    />
  ),

  // =========================================================================
  // 01-UNIT-1
  // =========================================================================
  '01-unit-1#1': () => (
    <FlowDiagram
      title="Lexical Analyzer and Parser Interaction"
      ariaLabel="Lexical Analyzer interaction with Parser and Symbol Table"
      direction="horizontal"
      customContent={
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-[var(--r-md)] border border-[var(--border)] bg-[var(--surface-2)]">
            <div className="p-3 rounded-[var(--r-md)] border border-[var(--border)] bg-[var(--surface)] text-center">
              <div className="font-mono font-bold text-sm text-[var(--text)]">Lexical Analyzer</div>
              <div className="text-[11px] text-[var(--text-muted)] mt-1 font-sans">
                source program reads characters
              </div>
            </div>

            <div className="flex flex-col items-center gap-1">
              <div className="text-xs font-mono text-[var(--accent)] font-semibold">
                ◄── &quot;get next token&quot; ──
              </div>
              <div className="text-xs font-mono text-[var(--success)] font-semibold">
                ── token ──►
              </div>
            </div>

            <div className="p-3 rounded-[var(--r-md)] border border-[var(--border)] bg-[var(--surface)] text-center">
              <div className="font-mono font-bold text-sm text-[var(--text)]">Parser</div>
              <div className="text-[11px] text-[var(--text-muted)] mt-1 font-sans">──► rest of compiler</div>
            </div>
          </div>

          <div className="flex justify-center">
            <div className="p-3 rounded-[var(--r-md)] border border-[var(--border)] bg-[var(--surface-2)] text-center w-full max-w-sm">
              <div className="font-mono font-bold text-xs text-[var(--accent)] uppercase">Symbol Table</div>
              <div className="text-[11px] text-[var(--text-muted)] mt-0.5">
                source program identifiers and tokens linked to Symbol Table
              </div>
            </div>
          </div>
        </div>
      }
    />
  ),

  '01-unit-1#2': () => (
    <MemoryDiagram
      title="Buffer Pairs & Sentinels"
      ariaLabel="Two buffer halves of N characters with eof sentinels and lexemeBegin, forward pointers"
      variant="cells"
      bufferHalves={[
        {
          title: 'Buffer Half 1 (N characters)',
          cells: [
            { char: 'E' },
            { char: ' ' },
            { char: '=' },
            { char: ' ' },
            { char: 'M' },
            { char: ' ' },
            { char: '*' },
            { char: 'eof', isSentinel: true },
          ],
        },
        {
          title: 'Buffer Half 2 (N characters)',
          cells: [
            { char: 'C' },
            { char: '*' },
            { char: '*' },
            { char: '2' },
            { char: 'eof', isSentinel: true },
            { char: ' ' },
            { char: ' ' },
            { char: 'eof', isSentinel: true },
          ],
        },
      ]}
      pointers={[
        { name: 'lexemeBegin', cellIndex: 2, colorVariant: 'purple' },
        { name: 'forward', cellIndex: 4, colorVariant: 'accent' },
      ]}
      bufferNotes="eof sentinels eliminate end-of-buffer bounds testing in the inner character scan loop."
    />
  ),

  '01-unit-1#3': () => (
    <GrammarBlock
      title="Regular Definitions for Tokens"
      ariaLabel="Regular definitions for letters, digits, id, and numbers"
      productions={[
        { lhs: 'letter', rhs: ['A', 'B', '…', 'Z', 'a', 'b', '…', 'z', '_'] },
        { lhs: 'digit', rhs: ['0', '1', '…', '9'] },
        { lhs: 'id', rhs: ['letter ( letter | digit )*'] },
        { lhs: 'digits', rhs: ['digit+'] },
        { lhs: 'number', rhs: ['digits ( . digits )? ( E [+-]? digits )?'] },
      ]}
    />
  ),

  '01-unit-1#4': () => (
    <AutomatonDiagram
      title="Transition Diagram: Relational Operators (relop)"
      ariaLabel="Transition diagram for relational operators <=, <>, <, =, >=, >"
      viewBox="0 0 540 220"
      startNodeId={0}
      nodes={[
        { id: 0, x: 50, y: 110, label: '0' },
        { id: 1, x: 170, y: 60, label: '1' },
        { id: 2, x: 300, y: 30, label: '2', isAccepting: true, returnToken: 'return(relop, LE)' },
        { id: 3, x: 300, y: 70, label: '3', isAccepting: true, returnToken: 'return(relop, NE)' },
        { id: 4, x: 300, y: 110, label: '4', isAccepting: true, retract: true, returnToken: 'return(relop, LT)' },
        { id: 5, x: 300, y: 150, label: '5', isAccepting: true, returnToken: 'return(relop, EQ)' },
        { id: 6, x: 170, y: 190, label: '6' },
        { id: 7, x: 300, y: 190, label: '7', isAccepting: true, returnToken: 'return(relop, GE)' },
        { id: 8, x: 440, y: 190, label: '8', isAccepting: true, retract: true, returnToken: 'return(relop, GT)' },
      ]}
      edges={[
        { from: 0, to: 1, label: '<' },
        { from: 1, to: 2, label: '=' },
        { from: 1, to: 3, label: '>' },
        { from: 1, to: 4, label: 'other' },
        { from: 0, to: 5, label: '=' },
        { from: 0, to: 6, label: '>' },
        { from: 6, to: 7, label: '=' },
        { from: 6, to: 8, label: 'other' },
      ]}
      legend="* = retract one char"
      subLegend="Final states return relational operator token and attribute value (LE, NE, LT, EQ, GE, GT)"
    />
  ),

  '01-unit-1#5': () => (
    <AutomatonDiagram
      title="Transition Diagram: Identifier & Keywords"
      ariaLabel="Transition diagram for identifiers with letter or digit loop"
      viewBox="0 0 420 160"
      startNodeId={9}
      nodes={[
        { id: 9, x: 60, y: 80, label: '9' },
        { id: 10, x: 200, y: 80, label: '10' },
        {
          id: 11,
          x: 340,
          y: 80,
          label: '11',
          isAccepting: true,
          retract: true,
          returnToken: 'return(getToken(), installID())',
        },
      ]}
      edges={[
        { from: 9, to: 10, label: 'letter' },
        { from: 10, to: 10, label: 'letter or digit', isSelfLoop: true },
        { from: 10, to: 11, label: 'other' },
      ]}
      legend="* = retract one character"
      subLegend="Installs identifier in Symbol Table if not already present"
    />
  ),

  '01-unit-1#6': () => (
    <AutomatonDiagram
      title="Thompson's Construction: The 5 Base Rules"
      ariaLabel="Five base rules of Thompson construction: epsilon, symbol a, union s|t, concatenation st, and Kleene star s*"
      subMachines={[
        {
          caption: 'Rule 1: ε (empty string)',
          viewBox: '0 0 200 120',
          startNodeId: 'i',
          nodes: [
            { id: 'i', x: 50, y: 60, label: 'i' },
            { id: 'f', x: 150, y: 60, label: 'f', isAccepting: true },
          ],
          edges: [{ from: 'i', to: 'f', label: 'ε', isEpsilon: true }],
        },
        {
          caption: 'Rule 2: a (symbol)',
          viewBox: '0 0 200 120',
          startNodeId: 'i',
          nodes: [
            { id: 'i', x: 50, y: 60, label: 'i' },
            { id: 'f', x: 150, y: 60, label: 'f', isAccepting: true },
          ],
          edges: [{ from: 'i', to: 'f', label: 'a' }],
        },
        {
          caption: 'Rule 3: s | t (union)',
          viewBox: '0 0 280 160',
          startNodeId: 'i',
          nodes: [
            { id: 'i', x: 40, y: 80, label: 'i' },
            { id: 's', x: 140, y: 40, label: 'N(s)' },
            { id: 't', x: 140, y: 120, label: 'N(t)' },
            { id: 'f', x: 240, y: 80, label: 'f', isAccepting: true },
          ],
          edges: [
            { from: 'i', to: 's', label: 'ε', isEpsilon: true },
            { from: 'i', to: 't', label: 'ε', isEpsilon: true },
            { from: 's', to: 'f', label: 'ε', isEpsilon: true },
            { from: 't', to: 'f', label: 'ε', isEpsilon: true },
          ],
        },
        {
          caption: 'Rule 4: st (concatenation: end of s = start of t)',
          viewBox: '0 0 280 120',
          startNodeId: 'i',
          nodes: [
            { id: 'i', x: 40, y: 60, label: 'i' },
            { id: 's', x: 120, y: 60, label: 'N(s)' },
            { id: 't', x: 200, y: 60, label: 'N(t)' },
            { id: 'f', x: 260, y: 60, label: 'f', isAccepting: true },
          ],
          edges: [
            { from: 'i', to: 's', label: 'start' },
            { from: 's', to: 't', label: 'join' },
            { from: 't', to: 'f', label: 'end' },
          ],
        },
        {
          caption: 'Rule 5: s* (Kleene closure: loop back or skip entirely: zero times)',
          viewBox: '0 0 280 160',
          startNodeId: 'i',
          nodes: [
            { id: 'i', x: 40, y: 80, label: 'i' },
            { id: 's', x: 140, y: 80, label: 'N(s)' },
            { id: 'f', x: 240, y: 80, label: 'f', isAccepting: true },
          ],
          edges: [
            { from: 'i', to: 's', label: 'ε', isEpsilon: true },
            { from: 's', to: 'f', label: 'ε', isEpsilon: true },
            { from: 's', to: 's', label: 'ε (loop back)', isSelfLoop: true, isEpsilon: true },
            { from: 'i', to: 'f', label: 'ε (skip entirely: zero times)', isCurved: true, curveOffset: 50, isEpsilon: true },
          ],
        },
      ]}
    />
  ),

  '01-unit-1#7': () => (
    <AutomatonDiagram
      title="Thompson NFA for (a|b)*abb"
      ariaLabel="NFA for regular expression (a|b)*abb with states 0 through 10"
      viewBox="0 0 680 220"
      startNodeId={0}
      nodes={[
        { id: 0, x: 40, y: 110, label: '0' },
        { id: 1, x: 100, y: 110, label: '1' },
        { id: 2, x: 170, y: 60, label: '2' },
        { id: 3, x: 250, y: 60, label: '3' },
        { id: 4, x: 170, y: 160, label: '4' },
        { id: 5, x: 250, y: 160, label: '5' },
        { id: 6, x: 320, y: 110, label: '6' },
        { id: 7, x: 390, y: 110, label: '7' },
        { id: 8, x: 470, y: 110, label: '8' },
        { id: 9, x: 550, y: 110, label: '9' },
        { id: 10, x: 630, y: 110, label: '10', isAccepting: true },
      ]}
      edges={[
        { from: 0, to: 1, label: 'ε', isEpsilon: true },
        { from: 1, to: 2, label: 'ε', isEpsilon: true },
        { from: 2, to: 3, label: 'a' },
        { from: 1, to: 4, label: 'ε', isEpsilon: true },
        { from: 4, to: 5, label: 'b' },
        { from: 3, to: 6, label: 'ε', isEpsilon: true },
        { from: 5, to: 6, label: 'ε', isEpsilon: true },
        { from: 6, to: 1, label: 'ε', isCurved: true, curveOffset: -55, isEpsilon: true },
        { from: 6, to: 7, label: 'ε', isEpsilon: true },
        { from: 0, to: 7, label: 'ε', isCurved: true, curveOffset: 65, isEpsilon: true },
        { from: 7, to: 8, label: 'a' },
        { from: 8, to: 9, label: 'b' },
        { from: 9, to: 10, label: 'b' },
      ]}
      legend="States 0–6 recognize (a|b)*; States 7–10 match trailing suffix abb"
    />
  ),

  '01-unit-1#8': () => (
    <StepList
      title="DFA Minimization via Partitioning"
      ariaLabel="Partitions of states during minimization"
      items={[
        {
          number: 'Π0',
          label: 'Initial Partition',
          chips: [
            { text: '{A B C D}', variant: 'default' },
            { text: '{E}', variant: 'accent' },
          ],
          reason: 'Non-accepting states {A B C D} vs accepting states {E}',
        },
        {
          number: 'Π1',
          label: 'First Refinement',
          chips: [
            { text: '{A B C}', variant: 'default' },
            { text: '{D}', variant: 'warning' },
            { text: '{E}', variant: 'accent' },
          ],
          reason: "D on b → E, others don't (D transitions to accepting state E while others don't)",
        },
        {
          number: 'Π2',
          label: 'Second Refinement',
          chips: [
            { text: '{A C}', variant: 'success' },
            { text: '{B}', variant: 'warning' },
            { text: '{D}', variant: 'warning' },
            { text: '{E}', variant: 'accent' },
          ],
          reason: "B on b → D, A and C don't",
        },
        {
          number: 'Final',
          label: 'Equivalence Classes',
          chips: [
            { text: '{A, C} → 0', variant: 'success' },
            { text: '{B} → 1', variant: 'default' },
            { text: '{D} → 2', variant: 'default' },
            { text: '{E} → 3', variant: 'accent' },
          ],
          reason: '{A,C} cannot split → 4 states',
        },
      ]}
      footerNote="Main path: ──► (0) ──a──► (1) ──b──► (2) ──b──► ((3))"
    />
  ),

  '01-unit-1#9': () => (
    <FlowDiagram
      title="Lex Specification to Executable Scanner Pipeline"
      ariaLabel="Lex build and execution pipeline"
      direction="horizontal"
      rows={[
        {
          rowTitle: 'Build Phase',
          steps: [
            { id: 'spec', label: 'lex.l' },
            { id: 'lexc', label: 'Lex compiler', highlight: true },
            { id: 'csrc', label: 'lex.yy.c' },
            { id: 'cc', label: 'C compiler', highlight: true },
            { id: 'bin', label: 'a.out' },
          ],
        },
        {
          rowTitle: 'Execution Phase',
          steps: [
            { id: 'in', label: 'input stream' },
            { id: 'exec', label: 'a.out', highlight: true },
            { id: 'out', label: 'tokens' },
          ],
        },
      ]}
    />
  ),

  '01-unit-1#10': () => (
    <FlowDiagram
      title="Lexical Engine Construction Chain"
      ariaLabel="RE to NFA to DFA to Minimized DFA pipeline"
      direction="horizontal"
      steps={[
        { id: 're', label: 'RE', subtext: '(describe)' },
        { id: 'nfa', label: 'NFA', badge: 'Thompson', subtext: '(easy to build)' },
        { id: 'dfa', label: 'DFA', badge: 'subset construction', subtext: '(fast to run)' },
        { id: 'min', label: 'min DFA', badge: 'partitioning', subtext: '(smallest)', highlight: true },
      ]}
    />
  ),

  // =========================================================================
  // 02-UNIT-2
  // =========================================================================
  '02-unit-2#1': () => (
    <FlowDiagram
      title="Parser in Compiler Front End"
      ariaLabel="Parser position between Lexer and rest of front end"
      direction="horizontal"
      steps={[
        { id: 'src', label: 'source' },
        { id: 'lex', label: 'Lexer', highlight: true },
        { id: 'parse', label: 'Parser', badge: 'token', highlight: true },
        { id: 'rest', label: 'rest of front end', badge: 'parse tree' },
        { id: 'ir', label: 'IR' },
      ]}
      sideBoxes={[
        {
          title: 'Interaction Details',
          items: [
            'Parser calls yylex() / "get next token"',
            'Lexer returns token + attribute value',
            'Both link to central Symbol Table',
          ],
        },
      ]}
    />
  ),

  '02-unit-2#2': () => (
    <GrammarBlock
      title="Arithmetic Expression Grammar"
      ariaLabel="Unambiguous grammar for arithmetic expressions with addition and multiplication"
      productions={[
        { lhs: 'E', rhs: ['E + T', 'T'] },
        { lhs: 'T', rhs: ['T * F', 'F'] },
        { lhs: 'F', rhs: ['( E )', 'id'] },
      ]}
    />
  ),

  '02-unit-2#3': () => (
    <ChainDiagram
      title="Leftmost Derivation for id + id * id"
      ariaLabel="Leftmost derivation steps replacing leftmost non-terminal"
      items={[
        { text: 'E', arrowType: '=>' },
        { text: 'E + T', arrowType: '=>' },
        { text: 'T + T', arrowType: '=>' },
        { text: 'F + T', arrowType: '=>' },
        { text: 'id + T', arrowType: '=>' },
        { text: 'id + T * F', arrowType: '=>' },
        { text: 'id + F * F', arrowType: '=>' },
        { text: 'id + id * F', arrowType: '=>' },
        { text: 'id + id * id', variant: 'accent' },
      ]}
      caption="At each derivation step, the leftmost non-terminal is replaced."
    />
  ),

  '02-unit-2#4': () => (
    <TreeDiagram
      title="Parse Tree for id + id * id"
      ariaLabel="Parse tree demonstrating multiplication precedence over addition"
      tree={{
        label: 'E',
        children: [
          {
            label: 'E',
            children: [
              {
                label: 'T',
                children: [
                  {
                    label: 'F',
                    children: [{ label: 'id' }],
                  },
                ],
              },
            ],
          },
          { label: '+' },
          {
            label: 'T',
            children: [
              {
                label: 'T',
                children: [
                  {
                    label: 'F',
                    children: [{ label: 'id' }],
                  },
                ],
              },
              { label: '*' },
              {
                label: 'F',
                children: [{ label: 'id' }],
              },
            ],
          },
        ],
      }}
    />
  ),

  '02-unit-2#5': () => (
    <TreeDiagram
      title="Ambiguity Demonstration: Two Parse Trees for the Same String"
      ariaLabel="Comparison of correct tree (precedence respected) vs wrong tree (violating precedence)"
      headerInfo="Grammar: E → E + E | E * E | id     String: id + id * id"
      trees={[
        {
          caption: 'Tree 1 (correct)',
          badge: '2 + (3*4) = 14',
          badgeVariant: 'success',
          tree: {
            label: 'E',
            children: [
              {
                label: 'E',
                children: [{ label: 'id' }],
              },
              { label: '+' },
              {
                label: 'E',
                children: [
                  {
                    label: 'E',
                    children: [{ label: 'id' }],
                  },
                  { label: '*' },
                  {
                    label: 'E',
                    children: [{ label: 'id' }],
                  },
                ],
              },
            ],
          },
        },
        {
          caption: 'Tree 2 (wrong)',
          badge: '(2+3) * 4 = 20',
          badgeVariant: 'danger',
          tree: {
            label: 'E',
            children: [
              {
                label: 'E',
                children: [
                  {
                    label: 'E',
                    children: [{ label: 'id' }],
                  },
                  { label: '+' },
                  {
                    label: 'E',
                    children: [{ label: 'id' }],
                  },
                ],
              },
              { label: '*' },
              {
                label: 'E',
                children: [{ label: 'id' }],
              },
            ],
          },
        },
      ]}
    />
  ),

  '02-unit-2#6': () => (
    <BeforeAfter
      title="Eliminating Immediate Left Recursion"
      ariaLabel="Grammar before and after eliminating left recursion"
      techniqueBadge="Left Recursion Removal"
      before={{
        title: 'BEFORE (Left-Recursive)',
        lines: [
          { text: 'E → E + T | T', type: 'removed' },
          { text: 'T → T * F | F', type: 'removed' },
        ],
      }}
      after={{
        title: 'AFTER (Right-Recursive)',
        lines: [
          { text: "E  → T E'", type: 'added' },
          { text: "E' → + T E' | ε", type: 'added' },
          { text: "T  → F T'", type: 'added' },
          { text: "T' → * F T' | ε", type: 'added' },
        ],
      }}
      footerNote="Converts left recursion A → Aα | β into right-recursive form A → βA', A' → αA' | ε."
    />
  ),

  '02-unit-2#7': () => (
    <BeforeAfter
      title="Left Factoring Grammar Transformation"
      ariaLabel="Grammar before and after left factoring common prefix"
      techniqueBadge="Left Factoring"
      before={{
        title: 'BEFORE (Common Prefix)',
        lines: [
          { text: 'S → i E t S | i E t S e S | a', type: 'removed' },
        ],
      }}
      after={{
        title: 'AFTER (Factored)',
        lines: [
          { text: "S  → i E t S S' | a", type: 'added' },
          { text: "S' → e S | ε", type: 'added' },
        ],
      }}
      footerNote="Defers the decision between 'then' and 'else' until after 'i E t S' is consumed."
    />
  ),

  '02-unit-2#8': () => (
    <FlowDiagram
      title="Parsing Paradigms Comparison"
      ariaLabel="Top-down root-first vs bottom-up leaves-first parsing"
      direction="horizontal"
      rows={[
        {
          rowTitle: 'Top-down (LL)',
          steps: [
            { id: 'td1', label: 'E (root first)' },
            { id: 'td2', label: 'grow tree' },
            { id: 'td3', label: '…' },
            { id: 'td4', label: 'id + id * id', highlight: true },
          ],
        },
        {
          rowTitle: 'Bottom-up (LR)',
          steps: [
            { id: 'bu1', label: 'id + id * id (leaves first)' },
            { id: 'bu2', label: 'shrink' },
            { id: 'bu3', label: '…' },
            { id: 'bu4', label: 'E', highlight: true },
          ],
        },
      ]}
    />
  ),

  '02-unit-2#9': () => (
    <FlowDiagram
      title="Table-Driven LL(1) Parsing Model"
      ariaLabel="Components of LL(1) table driven parser"
      direction="horizontal"
      customContent={
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
          <div className="p-3 rounded-[var(--r-md)] border border-[var(--border)] bg-[var(--surface-2)]">
            <div className="text-xs font-mono font-bold text-[var(--text-muted)] mb-1">input</div>
            <div className="font-mono text-sm text-[var(--accent)]">id + id * id $</div>
          </div>

          <div className="p-4 rounded-[var(--r-md)] border border-[var(--accent)] bg-[var(--accent-soft)] text-center">
            <div className="font-mono font-bold text-sm text-[var(--accent)] mb-1">LL(1) Parsing Program</div>
            <div className="text-xs text-[var(--text)]">stack (start: E $) + table ──►</div>
          </div>

          <div className="p-3 rounded-[var(--r-md)] border border-[var(--border)] bg-[var(--surface-2)]">
            <div className="text-xs font-mono font-bold text-[var(--text-muted)] mb-1">output</div>
            <div className="font-mono text-sm text-[var(--success)]">productions used</div>
          </div>
        </div>
      }
    />
  ),

  '02-unit-2#10': () => (
    <ChainDiagram
      title="Bottom-Up Reduction Sequence (Handle Pruning)"
      ariaLabel="Rightmost derivation in reverse reducing handles"
      items={[
        { text: 'id * id', arrowType: '=>', arrowLabel: 'reduce F→id' },
        { text: 'F * id', arrowType: '=>' },
        { text: 'T * id', arrowType: '=>' },
        { text: 'T * F', arrowType: '=>' },
        { text: 'T', arrowType: '=>' },
        { text: 'E', variant: 'accent' },
      ]}
      caption="Tracing reverse rightmost derivation back to start symbol E."
    />
  ),

  '02-unit-2#11': () => (
    <FlowDiagram
      title="Model of an LR Parser"
      ariaLabel="LR parsing program model with stack, input, and ACTION/GOTO tables"
      direction="horizontal"
      customContent={
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
          <div className="space-y-2">
            <div className="p-2.5 rounded-[var(--r-md)] border border-[var(--border)] bg-[var(--surface-2)] font-mono text-xs">
              <span className="text-[var(--text-muted)]">input: </span>
              <span className="text-[var(--accent)]">a1 … an $</span>
            </div>
            <div className="p-2.5 rounded-[var(--r-md)] border border-[var(--border)] bg-[var(--surface-2)] font-mono text-xs">
              <span className="text-[var(--text-muted)]">stack: </span>
              <span className="text-[var(--text)]">s0 X1 s1…</span>
            </div>
          </div>

          <div className="p-4 rounded-[var(--r-md)] border border-[var(--border)] bg-[var(--surface-2)] text-center">
            <div className="font-mono font-bold text-sm text-[var(--text)] mb-2">LR parsing program</div>
            <div className="grid grid-cols-1 gap-2 text-xs font-mono">
              <div className="p-1.5 rounded bg-[var(--surface)] border border-[var(--border)] text-[var(--accent)]">
                ACTION[state, terminal]
              </div>
              <div className="p-1.5 rounded bg-[var(--surface)] border border-[var(--border)] text-[var(--purple)]">
                GOTO[state, non-terminal]
              </div>
            </div>
          </div>

          <div className="p-3 rounded-[var(--r-md)] border border-[var(--border)] bg-[var(--surface-2)] font-mono text-center">
            <div className="text-xs text-[var(--text-muted)] uppercase mb-1">──► output</div>
            <div className="text-sm font-bold text-[var(--success)]">Shift / Reduce / Accept / Error</div>
          </div>
        </div>
      }
    />
  ),

  '02-unit-2#12': () => (
    <StepList
      title="Lifecycle of an LR(0) Item (The Dot • Movement)"
      ariaLabel="LR zero item dot progression"
      items={[
        {
          label: 'E → • E + T',
          reason: 'seen nothing yet',
        },
        {
          label: 'E → E • + T',
          reason: 'seen E, expecting +',
        },
        {
          label: 'E → E + • T',
          reason: 'seen E +, expecting T',
        },
        {
          label: 'E → E + T •',
          badge: 'REDUCE',
          badgeVariant: 'success',
          reason: 'seen everything → ready to REDUCE',
        },
      ]}
    />
  ),

  '02-unit-2#13': () => (
    <CardGrid
      title="Canonical LR(0) Collection (C for Expression Grammar)"
      ariaLabel="Item sets I0 through I11 for expression grammar"
      cards={[
        {
          id: 'I0',
          title: 'I0',
          subtitle: 'Start state closure',
          lines: ["E'→•E", 'E→•E+T', 'E→•T', 'T→•T*F', 'T→•F', 'F→•(E)', 'F→•id'],
        },
        {
          id: 'I1',
          title: 'I1',
          subtitle: '(from I0 on E)',
          lines: ["E'→E•", 'E→E•+T'],
        },
        {
          id: 'I2',
          title: 'I2',
          subtitle: '(from I0 on T)',
          lines: ['E→T•', 'T→T•*F'],
          isReduce: true,
        },
        {
          id: 'I3',
          title: 'I3',
          subtitle: '(from I0 on F)',
          lines: ['T→F•'],
          isReduce: true,
        },
        {
          id: 'I4',
          title: 'I4',
          subtitle: '(from I0 on ( )',
          lines: ['F→(•E)', 'E→•E+T', 'E→•T', 'T→•T*F', 'T→•F', 'F→•(E)', 'F→•id'],
        },
        {
          id: 'I5',
          title: 'I5',
          subtitle: '(from I0 on id)',
          lines: ['F→id•'],
          isReduce: true,
        },
        {
          id: 'I6',
          title: 'I6',
          subtitle: '(from I1 on +)',
          lines: ['E→E+•T', 'T→•T*F', 'T→•F', 'F→•(E)', 'F→•id'],
        },
        {
          id: 'I7',
          title: 'I7',
          subtitle: '(from I2 on *)',
          lines: ['T→T*•F', 'F→•(E)', 'F→•id'],
        },
        {
          id: 'I8',
          title: 'I8',
          subtitle: '(from I4 on E)',
          lines: ['F→(E•)', 'E→E•+T'],
        },
        {
          id: 'I9',
          title: 'I9',
          subtitle: '(from I6 on T)',
          lines: ['E→E+T•', 'T→T•*F'],
          isReduce: true,
        },
        {
          id: 'I10',
          title: 'I10',
          subtitle: '(from I7 on F)',
          lines: ['T→T*F•'],
          isReduce: true,
        },
        {
          id: 'I11',
          title: 'I11',
          subtitle: '(from I8 on ) )',
          lines: ['F→(E)•'],
          isReduce: true,
        },
      ]}
      footerNote="Items ending with • indicate complete handles ready for reduction."
    />
  ),

  '02-unit-2#14': () => (
    <CardGrid
      title="LALR(1) Merging of Common Core Item Sets"
      ariaLabel="Merging CLR(1) item sets into LALR(1) states"
      groups={[
        {
          label: 'Independent States',
          cards: [
            { id: 'I0', title: 'I0', lines: ["S'→•S,$", 'S→•CC,$', 'C→•cC,c/d', 'C→•d,c/d'] },
            { id: 'I1', title: 'I1', lines: ["S'→S•,$"], isReduce: true },
            { id: 'I2', title: 'I2', lines: ['S→C•C,$', 'C→•cC,$', 'C→•d,$'] },
            { id: 'I5', title: 'I5', lines: ['S→CC•,$'], isReduce: true },
          ],
        },
        {
          label: 'same core → merge 36',
          cards: [
            { id: 'I3', title: 'I3', lines: ['C→c•C,c/d', 'C→•cC,c/d', 'C→•d,c/d'] },
            { id: 'I6', title: 'I6', lines: ['C→c•C,$', 'C→•cC,$', 'C→•d,$'] },
          ],
        },
        {
          label: 'same core → merge 47',
          cards: [
            { id: 'I4', title: 'I4', lines: ['C→d•,c/d'], isReduce: true },
            { id: 'I7', title: 'I7', lines: ['C→d•,$'], isReduce: true },
          ],
        },
        {
          label: 'same core → merge 89',
          cards: [
            { id: 'I8', title: 'I8', lines: ['C→cC•,c/d'], isReduce: true },
            { id: 'I9', title: 'I9', lines: ['C→cC•,$'], isReduce: true },
          ],
        },
      ]}
      footerNote="Merging states with identical LR(0) cores reduces CLR table size to match SLR."
    />
  ),

  '02-unit-2#15': () => (
    <FlowDiagram
      title="Yacc & Lex Compilation Workflow"
      ariaLabel="Yacc and Lex build workflow generating compiler executable"
      direction="horizontal"
      customContent={
        <div className="space-y-4 font-mono text-xs sm:text-sm">
          <div className="flex flex-wrap items-center gap-3">
            <span className="px-2.5 py-1 rounded bg-[var(--surface-2)] border border-[var(--border)]">parser.y</span>
            <span className="text-[var(--text-muted)]">──►</span>
            <span className="px-2.5 py-1 rounded bg-[var(--accent-soft)] border border-[var(--accent)] text-[var(--accent)] font-bold">
              [ yacc ]
            </span>
            <span className="text-[var(--text-muted)]">──►</span>
            <span className="px-2.5 py-1 rounded bg-[var(--surface-2)] border border-[var(--border)]">y.tab.c</span>
            <span className="text-[var(--text-muted)]">──┐</span>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <span className="px-2.5 py-1 rounded bg-[var(--surface-2)] border border-[var(--border)]">lex.l</span>
            <span className="text-[var(--text-muted)]">──►</span>
            <span className="px-2.5 py-1 rounded bg-[var(--accent-soft)] border border-[var(--accent)] text-[var(--accent)] font-bold">
              [ lex ]
            </span>
            <span className="text-[var(--text-muted)]">──►</span>
            <span className="px-2.5 py-1 rounded bg-[var(--surface-2)] border border-[var(--border)]">lex.yy.c</span>
            <span className="text-[var(--text-muted)]">──┼──►</span>
            <span className="px-2.5 py-1 rounded bg-[var(--accent-soft)] border border-[var(--accent)] text-[var(--accent)] font-bold">
              [ cc ]
            </span>
            <span className="text-[var(--text-muted)]">──►</span>
            <span className="px-3 py-1 rounded bg-[var(--success)]/20 border border-[var(--success)] text-[var(--success)] font-bold">
              a.out
            </span>
          </div>
          <div className="text-xs text-[var(--text-muted)] pt-2 border-t border-[var(--border)] font-sans">
            (yylex() supplies tokens to yyparse())
          </div>
        </div>
      }
    />
  ),

  '02-unit-2#16': () => (
    <GrammarBlock
      title="Sample Language Grammar for Parser Construction"
      ariaLabel="Sample programming language grammar productions"
      productions={[
        { lhs: 'program', rhs: ['stmt_list'] },
        { lhs: 'stmt_list', rhs: ['stmt_list stmt', 'stmt'] },
        {
          lhs: 'stmt',
          rhs: [
            'id = expr ;',
            'if ( cond ) stmt else stmt',
            'while ( cond ) stmt',
            '{ stmt_list }',
          ],
        },
        { lhs: 'cond', rhs: ['expr relop expr'] },
        { lhs: 'expr', rhs: ['expr + term', 'expr - term', 'term'] },
        { lhs: 'term', rhs: ['term * factor', 'term / factor', 'factor'] },
        { lhs: 'factor', rhs: ['( expr )', 'id', 'num'] },
      ]}
    />
  ),

  '02-unit-2#17': () => (
    <FlowDiagram
      title="Parsing Design Strategy: Two Paths"
      ariaLabel="Branching strategy from grammar into Top-down and Bottom-up parsing"
      direction="horizontal"
      rows={[
        {
          rowTitle: 'top-down (LL)',
          steps: [
            { id: 'll1', label: 'Grammar' },
            { id: 'll2', label: 'remove left recursion + left factor' },
            { id: 'll3', label: 'FIRST/FOLLOW' },
            { id: 'll4', label: 'LL(1) table → trace', highlight: true },
          ],
        },
        {
          rowTitle: 'bottom-up (LR)',
          steps: [
            { id: 'lr1', label: 'Grammar' },
            { id: 'lr2', label: 'augment → items (closure/goto)' },
            { id: 'lr3', label: 'SLR / CLR / LALR table' },
            { id: 'lr4', label: 'shift-reduce trace', highlight: true },
          ],
        },
      ]}
    />
  ),

  // =========================================================================
  // 03-UNIT-3
  // =========================================================================
  '03-unit-3#1': () => (
    <TreeDiagram
      title="Annotated Parse Tree (S-Attributed SDD: 3 * 5 + 4n)"
      ariaLabel="Annotated parse tree showing synthesized attributes evaluated bottom-up"
      tree={{
        label: 'L',
        annotation: '(prints 19)',
        children: [
          {
            label: 'E.val=19',
            children: [
              {
                label: 'E.val=15',
                children: [
                  {
                    label: 'T.val=15',
                    children: [
                      {
                        label: 'T.val=3',
                        children: [
                          {
                            label: 'F.val=3',
                            children: [{ label: 'digit.lexval=3' }],
                          },
                        ],
                      },
                      { label: '*' },
                      {
                        label: 'F.val=5',
                        children: [{ label: 'digit.lexval=5' }],
                      },
                    ],
                  },
                ],
              },
              { label: '+' },
              {
                label: 'T.val=4',
                children: [
                  {
                    label: 'F.val=4',
                    children: [{ label: 'digit.lexval=4' }],
                  },
                ],
              },
            ],
          },
          { label: 'n' },
        ],
      }}
    />
  ),

  '03-unit-3#2': () => (
    <TreeDiagram
      title="Annotated Parse Tree (L-Attributed SDD: Type Declaration)"
      ariaLabel="Annotated tree showing inherited attribute type passing top-down and left-to-right"
      tree={{
        label: 'D',
        children: [
          {
            label: 'T.type=float',
            children: [{ label: 'float' }],
          },
          {
            label: 'L.inh=float',
            note: '──► addType(id3, float)',
            children: [
              {
                label: 'L.inh=float',
                note: '──► addType(id2, float)',
                children: [
                  {
                    label: 'L.inh=float',
                    note: '──► addType(id1, float)',
                    children: [{ label: 'id1' }],
                  },
                  { label: ',' },
                  { label: 'id2' },
                ],
              },
              { label: ',' },
              { label: 'id3' },
            ],
          },
        ],
      }}
    />
  ),

  '03-unit-3#3': () => (
    <TreeDiagram
      title="Parse Tree of a - 4 + c vs Syntax Tree of a - 4 + c"
      ariaLabel="Comparison of verbose parse tree vs compact syntax tree"
      trees={[
        {
          caption: 'Parse tree of a - 4 + c',
          tree: {
            label: 'E',
            children: [
              {
                label: 'E',
                children: [
                  {
                    label: 'E',
                    children: [
                      {
                        label: 'T',
                        children: [
                          {
                            label: 'F',
                            children: [{ label: 'a' }],
                          },
                        ],
                      },
                    ],
                  },
                  { label: '-' },
                  {
                    label: 'T',
                    children: [
                      {
                        label: 'F',
                        children: [{ label: 'num', note: '4' }],
                      },
                    ],
                  },
                ],
              },
              { label: '+' },
              {
                label: 'T',
                children: [
                  {
                    label: 'F',
                    children: [{ label: 'c' }],
                  },
                ],
              },
            ],
          },
        },
        {
          caption: 'Syntax tree of a - 4 + c',
          tree: {
            label: '+',
            children: [
              {
                label: '-',
                children: [{ label: 'a' }, { label: '4' }],
              },
              { label: 'c' },
            ],
          },
        },
      ]}
    />
  ),

  '03-unit-3#4': () => (
    <MemoryDiagram
      title="Bottom-Up Evaluation on Parser Stack (SDT Implementation)"
      ariaLabel="State stack and value stack in sync during reduction"
      variant="two-stacks"
      twoStacks={{
        rule: 'E → E1 + T   { val[top-2] = val[top-2] + val[top] ; pop 2 }',
        result: 'Result computed on stack: 15 + 4 ⇒ 19',
        stack1: {
          name: 'state stack',
          items: ['…', 'E', '+', 'T'],
          topPointer: 3,
          topPointerLabel: 'top (top-2 is E)',
        },
        stack2: {
          name: 'value stack',
          items: ['…', '15', '_', '4'],
          topPointer: 3,
          topPointerLabel: 'top ⇒ 19',
        },
      }}
    />
  ),

  '03-unit-3#6': () => (
    <TreeDiagram
      title="Widening hierarchy"
      ariaLabel="Widening hierarchy from char/short to double"
      tree={{
        label: 'double',
        children: [
          {
            label: 'float',
            children: [
              {
                label: 'long',
                children: [
                  {
                    label: 'int',
                    children: [{ label: 'short' }, { label: 'char' }],
                  },
                ],
              },
            ],
          },
        ],
      }}
      headerInfo="Widening hierarchy: double ─ float ─ long ─ int ─ short / char"
    />
  ),

  '03-unit-3#8': () => (
    <FlowDiagram
      title="Universal Intermediate Representation (Fan-in / Fan-out)"
      ariaLabel="M front ends to IR to N back ends"
      direction="horizontal"
      customContent={
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 p-4 rounded-[var(--r-md)] border border-[var(--border)] bg-[var(--surface-2)] font-mono text-xs sm:text-sm">
          <div className="space-y-2">
            <div className="px-3 py-1.5 rounded bg-[var(--surface)] border border-[var(--border)] text-center">C ─┐</div>
            <div className="px-3 py-1.5 rounded bg-[var(--surface)] border border-[var(--border)] text-center">C++ ─┼─►</div>
            <div className="px-3 py-1.5 rounded bg-[var(--surface)] border border-[var(--border)] text-center">Java─┘</div>
          </div>

          <div className="flex flex-col items-center">
            <div className="p-4 rounded-[var(--r-md)] border border-[var(--accent)] bg-[var(--accent-soft)] text-center font-bold text-[var(--accent)]">
              [ IR ] ─optimize─►
              <div className="text-[11px] font-normal text-[var(--text)] mt-1 font-sans">
                Universal target-independent intermediate representation
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <div className="px-3 py-1.5 rounded bg-[var(--surface)] border border-[var(--border)] text-center">┌─► x86</div>
            <div className="px-3 py-1.5 rounded bg-[var(--surface)] border border-[var(--border)] text-center">┼─► ARM</div>
            <div className="px-3 py-1.5 rounded bg-[var(--surface)] border border-[var(--border)] text-center">└─► RISC-V</div>
          </div>
        </div>
      }
    />
  ),

  '03-unit-3#9': () => (
    <TreeDiagram
      title="Syntax tree (things repeated) vs DAG (shared nodes, numbered)"
      ariaLabel="Syntax tree with repeated nodes compared to DAG with shared common subexpressions"
      headerInfo="a + a * (b - c) + (b - c) * d | DAG: n1=a, n2=b, n3=c, n4=n2-n3 (b-c used twice), n5=n1*n4, n6=n1+n5 (a used twice), n7=d, n8=n4*n7, n9=n6+n8 (root)"
      isDag={true}
      trees={[
        {
          caption: 'Syntax tree (things repeated)',
          tree: {
            label: '+',
            children: [
              {
                label: '+',
                children: [
                  { label: 'a' },
                  {
                    label: '*',
                    children: [
                      { label: 'a' },
                      {
                        label: '-',
                        children: [{ label: 'b' }, { label: 'c' }],
                      },
                    ],
                  },
                ],
              },
              {
                label: '*',
                children: [
                  {
                    label: '-',
                    children: [{ label: 'b' }, { label: 'c' }],
                  },
                  { label: 'd' },
                ],
              },
            ],
          },
        },
        {
          caption: 'DAG (shared nodes, numbered: root n9)',
          badge: 'root n9',
          tree: {
            label: 'n9 (+)',
            annotation: 'root',
            children: [
              {
                label: 'n6 (+)',
                children: [
                  { label: 'n1 (a)', shared: true },
                  {
                    label: 'n5 (*)',
                    children: [
                      { label: 'n1 (a)', shared: true },
                      {
                        label: 'n4 (-)',
                        shared: true,
                        children: [{ label: 'n2 (b)' }, { label: 'n3 (c)' }],
                      },
                    ],
                  },
                ],
              },
              {
                label: 'n8 (*)',
                children: [
                  {
                    label: 'n4 (-)',
                    shared: true,
                    note: 'used twice',
                  },
                  { label: 'n7 (d)' },
                ],
              },
            ],
          },
        },
      ]}
    />
  ),

  '03-unit-3#11': () => (
    <BeforeAfter
      title="Array Reference Translation: x = a[i][j]"
      ariaLabel="Translating 2D array reference into 3-address code instructions"
      techniqueBadge="x = a[i][j]"
      before={{
        title: 'x = a[i][j]',
        lines: [{ text: 'x = a[i][j]' }],
        notes: ['row-major array access translation'],
      }}
      after={{
        title: 'THREE-ADDRESS CODE',
        lines: [
          { text: 't1 = i * 12', type: 'added' },
          { text: 't2 = j * 4', type: 'added' },
          { text: 't3 = t1 + t2', type: 'added' },
          { text: 't4 = a[t3]', type: 'added' },
          { text: 'x  = t4', type: 'added' },
        ],
      }}
    />
  ),

  '03-unit-3#12': () => (
    <BeforeAfter
      title="Control Flow Translation: While Loop with If-Else"
      ariaLabel="Control flow source code translated into Three-Address Code with jump labels"
      techniqueBadge="Control Flow"
      before={{
        title: 'SOURCE CODE',
        lines: [
          { text: 'while (a < b) {' },
          { text: '    if (c < d) x = y + z;' },
          { text: '    else       x = y - z;' },
          { text: '}' },
        ],
      }}
      after={{
        title: 'THREE-ADDRESS CODE',
        lines: [
          { text: 'L1: if a < b goto L2', type: 'added' },
          { text: '    goto Lnext', type: 'added' },
          { text: 'L2: if c < d goto L3', type: 'added' },
          { text: '    goto L4', type: 'added' },
          { text: 'L3: t1 = y + z', type: 'added' },
          { text: '    x = t1', type: 'added' },
          { text: '    goto L1', type: 'added' },
          { text: 'L4: t2 = y - z', type: 'added' },
          { text: '    x = t2', type: 'added' },
          { text: '    goto L1', type: 'added' },
          { text: 'Lnext:', type: 'added' },
        ],
      }}
    />
  ),

  '03-unit-3#13': () => (
    <div className="space-y-4">
      <StepList
        title="Backpatching: Boolean Expression a < b || c < d && e < f"
        ariaLabel="Backpatching steps synthesizing true and false lists"
        items={[
          {
            number: 'Step 1',
            label: 'a<b',
            monoContent: '→ 100: if a<b goto _   101: goto _',
            chips: [{ text: 't={100}', variant: 'success' }, { text: 'f={101}', variant: 'danger' }],
          },
          { number: 'Step 2', label: 'Marker M1', monoContent: 'M1.instr = 102' },
          {
            number: 'Step 3',
            label: 'c<d',
            monoContent: '→ 102: if c<d goto _   103: goto _',
            chips: [{ text: 't={102}', variant: 'success' }, { text: 'f={103}', variant: 'danger' }],
          },
          { number: 'Step 4', label: 'Marker M2', monoContent: 'M2.instr = 104' },
          {
            number: 'Step 5',
            label: 'e<f',
            monoContent: '→ 104: if e<f goto _   105: goto _',
            chips: [{ text: 't={104}', variant: 'success' }, { text: 'f={105}', variant: 'danger' }],
          },
          {
            number: 'Step 6',
            label: '&& (binds tighter)',
            monoContent: 'backpatch({102}, 104)',
            chips: [{ text: 't={104}', variant: 'success' }, { text: 'f={103,105}', variant: 'danger' }],
          },
          {
            number: 'Step 7',
            label: '||',
            monoContent: 'backpatch({101}, 102)',
            chips: [{ text: 't={100,104}', variant: 'success' }, { text: 'f={103,105}', variant: 'danger' }],
          },
        ]}
      />

      <AnnotatedCode
        title="Final Backpatched Code"
        ariaLabel="Final backpatched 3-address code"
        lines={[
          { lineNum: 100, code: 'if a < b goto _', badge: 'true exit' },
          { lineNum: 101, code: 'goto 102' },
          { lineNum: 102, code: 'if c < d goto 104' },
          { lineNum: 103, code: 'goto _', badge: 'false exit' },
          { lineNum: 104, code: 'if e < f goto _', badge: 'true exit' },
          { lineNum: 105, code: 'goto _', badge: 'false exit' },
        ]}
      />
    </div>
  ),

  '03-unit-3#14': () => (
    <FlowDiagram
      title="Semantic Analysis & Intermediate Code Pipeline"
      ariaLabel="SDD to Annotated Tree to TAC to Backpatching"
      direction="horizontal"
      steps={[
        { id: 'pt', label: 'parse tree' },
        { id: 'sdd', label: 'annotated tree / syntax tree / types checked', badge: 'attributes + rules = SDD' },
        { id: 'tac', label: 'quadruples · triples · indirect triples', badge: 'gen TAC' },
        { id: 'ir', label: 'IR ready', badge: 'backpatch jumps', highlight: true },
      ]}
    />
  ),

  // =========================================================================
  // 04-UNIT-4
  // =========================================================================
  '04-unit-4#1': () => (
    <ChainDiagram
      title="Names, Identifiers, Environments & States"
      ariaLabel="Mapping name to location to value"
      items={[
        { text: 'name (x)', arrowLabel: 'environment' },
        { text: 'location (0x1000)', arrowLabel: 'state', variant: 'accent' },
        { text: 'value (42)', variant: 'success' },
      ]}
      caption="environment maps name to location; state maps location to value"
    />
  ),

  '04-unit-4#2': () => (
    <MemoryDiagram
      title="Run-Time Storage Organization"
      ariaLabel="Memory layout showing Code, Static, Heap, and Stack"
      topLabel="low address"
      bottomLabel="high address"
      bands={[
        { label: 'Code', notes: 'fixed size, known at compile time' },
        { label: 'Static / Global', notes: 'fixed size, known at compile time' },
        { label: 'Heap', growth: 'down', variant: 'accent', notes: 'grows downward ↓ (malloc / new)' },
        { label: 'free memory', variant: 'dashed', notes: 'unallocated address space' },
        { label: 'Stack', growth: 'up', variant: 'warning', notes: 'grows upward ↑ (function calls)' },
      ]}
    />
  ),

  '04-unit-4#3': () => (
    <MemoryDiagram
      title="General Activation Record (Stack Frame) Layout"
      ariaLabel="Components of an activation record"
      bands={[
        { label: 'Actual parameters', notes: 'values passed by the caller' },
        { label: 'Returned value', notes: 'space for the result' },
        { label: 'Control link (dynamic link)', notes: "→ caller's activation record" },
        { label: 'Access link (static link)', notes: '→ record of the enclosing scope (non-local data)' },
        { label: 'Saved machine status', notes: 'return address, saved registers' },
        { label: 'Local data', notes: 'local variables' },
        { label: 'Temporaries', notes: 't1, t2… from expression evaluation' },
      ]}
    />
  ),

  '04-unit-4#4': () => (
    <FlowDiagram
      title="Calling Sequence: Caller vs Callee Responsibilities"
      ariaLabel="Numbered steps divided between caller and callee"
      direction="horizontal"
      customContent={
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-4 rounded-[var(--r-md)] border border-[var(--border)] bg-[var(--surface-2)]">
            <div className="text-xs font-mono font-bold text-[var(--accent)] uppercase mb-3">
              CALLER
            </div>
            <ol className="space-y-2 text-xs font-mono list-decimal pl-4 text-[var(--text)]">
              <li>evaluate actual parameters</li>
              <li>store return address, old top_sp</li>
              <li>jump to callee</li>
              <li className="pt-2 text-[var(--accent)] font-semibold" value={9}>
                caller uses return value (on return)
              </li>
            </ol>
          </div>

          <div className="p-4 rounded-[var(--r-md)] border border-[var(--border)] bg-[var(--surface-2)]">
            <div className="text-xs font-mono font-bold text-[var(--purple)] uppercase mb-3">
              CALLEE
            </div>
            <ol className="space-y-2 text-xs font-mono list-decimal pl-4 text-[var(--text)]">
              <li value={4}>save registers &amp; status</li>
              <li>initialize local data</li>
              <li>begin execution</li>
              <li className="pt-2 text-[var(--purple)] font-semibold" value={7}>
                place return value
              </li>
              <li>restore top_sp &amp; registers, jump to return address</li>
            </ol>
          </div>
        </div>
      }
    />
  ),

  '04-unit-4#5': () => (
    <div className="space-y-4">
      <TreeDiagram
        title="Activation Tree & Stack for fact(3)"
        ariaLabel="Recursive activation tree and stack growth"
        headerInfo="fact(3) → fact(2) → fact(1)"
        tree={{
          label: 'main',
          children: [
            {
              label: 'fact(3)',
              children: [
                {
                  label: 'fact(2)',
                  children: [
                    {
                      label: 'fact(1)',
                    },
                  ],
                },
              ],
            },
          ],
        }}
      />

      <MemoryDiagram
        ariaLabel="Stack at deepest recursion point"
        title="Stack at deepest point"
        bands={[
          { label: 'main' },
          { label: 'fact(3) n=3' },
          { label: 'fact(2) n=2' },
          { label: 'fact(1) n=1', variant: 'accent', notes: '← top' },
        ]}
      />

      <ChainDiagram
        title="Returns"
        ariaLabel="Return values unwinding back to caller"
        items={[
          { text: 'Returns: fact(1)=1', variant: 'default' },
          { text: 'fact(2)=2', variant: 'default' },
          { text: 'fact(3)=6', variant: 'success' },
        ]}
      />
    </div>
  ),

  '04-unit-4#6': () => (
    <ChainDiagram
      title="Scoped Symbol Table Lookup Chain"
      ariaLabel="Symbol table resolution order from innermost block outward"
      items={[
        { text: "global table", variant: 'default' },
        { text: "main's table", variant: 'default' },
        { text: "block's table", subtext: '(search starts here →)', variant: 'accent' },
      ]}
      caption="global table ◄── main's table ◄── block's table (search starts here →)"
    />
  ),

  '04-unit-4#7': () => (
    <AnnotatedCode
      title="Basic Blocks and Control Flow Graph"
      ariaLabel="10 lines partitioned into basic blocks B1 and B2"
      lines={[
        { lineNum: 1, code: 'prod = 0', badge: '← leader (first)', blockId: 'B1' },
        { lineNum: 2, code: 'i = 1', blockId: 'B1' },
        { lineNum: 3, code: 't1 = 4 * i', badge: '← leader (target of 10)', blockId: 'B2' },
        { lineNum: 4, code: 't2 = a[t1]', blockId: 'B2' },
        { lineNum: 5, code: 't3 = 4 * i', blockId: 'B2' },
        { lineNum: 6, code: 't4 = b[t3]', blockId: 'B2' },
        { lineNum: 7, code: 't5 = t2 * t4', blockId: 'B2' },
        { lineNum: 8, code: 'prod = prod + t5', blockId: 'B2' },
        { lineNum: 9, code: 'i = i + 1', blockId: 'B2' },
        { lineNum: 10, code: 'if i <= 20 goto (3)', blockId: 'B2' },
      ]}
      miniFlow={{
        nodes: ['B1: 1–2', 'B2: 3–10 (loop back)', 'EXIT'],
        edges: [
          { from: 'B1', to: 'B2' },
          { from: 'B2', to: 'B2', isLoop: true, label: 'loop back' },
          { from: 'B2', to: 'EXIT' },
        ],
      }}
    />
  ),

  '04-unit-4#8': () => (
    <AnnotatedCode
      title="Leader Identification & Basic Block Partitioning"
      ariaLabel="17 intermediate code instructions partitioned into basic blocks B1 to B6"
      lines={[
        { lineNum: 1, code: 'i = 1', badge: '← leader (first)', blockId: 'B1' },
        { lineNum: 2, code: 'j = 1', badge: '← leader (target of 11)', blockId: 'B2' },
        { lineNum: 3, code: 't1 = 10 * i', badge: '← leader (target of 9)', blockId: 'B3' },
        { lineNum: 4, code: 't2 = t1 + j', blockId: 'B3' },
        { lineNum: 5, code: 't3 = 8 * t2', blockId: 'B3' },
        { lineNum: 6, code: 't4 = t3 - 88', blockId: 'B3' },
        { lineNum: 7, code: 'a[t4] = 0.0', blockId: 'B3' },
        { lineNum: 8, code: 'j = j + 1', blockId: 'B3' },
        { lineNum: 9, code: 'if j <= 10 goto (3)', blockId: 'B3' },
        { lineNum: 10, code: 'i = i + 1', badge: '← leader (after a jump)', blockId: 'B4' },
        { lineNum: 11, code: 'if i <= 10 goto (2)', blockId: 'B4' },
        { lineNum: 12, code: 'i = 1', badge: '← leader (after a jump)', blockId: 'B5' },
        { lineNum: 13, code: 't5 = i - 1', badge: '← leader (target of 17)', blockId: 'B6' },
        { lineNum: 14, code: 't6 = 88 * t5', blockId: 'B6' },
        { lineNum: 15, code: 'a[t6] = 1.0', blockId: 'B6' },
        { lineNum: 16, code: 'i = i + 1', blockId: 'B6' },
        { lineNum: 17, code: 'if i <= 10 goto (13)', blockId: 'B6' },
      ]}
    />
  ),

  '04-unit-4#9': () => (
    <TreeDiagram
      title="Ershov Register Labeling for (a - b) + e * (c + d)"
      ariaLabel="Expression tree labeled with Ershov numbers indicating required registers"
      headerInfo="(a - b) + e * (c + d)"
      tree={{
        label: '+',
        annotation: '[3]',
        children: [
          {
            label: '−',
            annotation: '[2]',
            children: [
              { label: 'a[1]' },
              { label: 'b[1]' },
            ],
          },
          {
            label: '*',
            annotation: '[2]',
            children: [
              { label: 'e[1]' },
              {
                label: '+',
                annotation: '[2]',
                children: [
                  { label: 'c[1]' },
                  { label: 'd[1]' },
                ],
              },
            ],
          },
        ],
      }}
    />
  ),

  '04-unit-4#11': () => (
    <FlowDiagram
      title="Code Generation Pipeline"
      ariaLabel="Runtime memory to basic blocks to code generation to target code"
      direction="horizontal"
      steps={[
        { id: 'mem', label: 'memory plan (static | stack | heap) + activation records + parameter passing + symbol table' },
        { id: 'bb', label: 'basic blocks + flow graph' },
        { id: 'cg', label: 'code generator (getReg + descriptors)', highlight: true },
        { id: 'target', label: 'target code', highlight: true },
      ]}
    />
  ),

  // =========================================================================
  // 05-UNIT-5
  // =========================================================================
  '05-unit-5#1': () => (
    <BeforeAfter
      title="Redundant Instruction Elimination (Common Subexpression)"
      ariaLabel="Eliminating redundant 4 * i multiplication"
      techniqueBadge="Common Subexpression Elimination"
      before={{
        lines: [
          { text: 't1 = 4 * i' },
          { text: 't2 = a[t1]' },
          { text: 't3 = 4 * i', type: 'removed' },
          { text: 't4 = b[t3]', type: 'removed' },
        ],
      }}
      after={{
        lines: [
          { text: 't1 = 4 * i' },
          { text: 't2 = a[t1]' },
          { text: 't4 = b[t1]', type: 'added' },
        ],
      }}
    />
  ),

  '05-unit-5#2': () => (
    <BeforeAfter
      title="Copy Propagation"
      ariaLabel="Propagating variable copy and eliminating dead store"
      techniqueBadge="Copy Propagation"
      before={{
        lines: [
          { text: 'x = y' },
          { text: 'z = x + 1', type: 'removed' },
        ],
      }}
      after={{
        lines: [
          { text: 'x = y', note: '(now possibly dead)' },
          { text: 'z = y + 1', type: 'added' },
        ],
      }}
    />
  ),

  '05-unit-5#3': () => (
    <BeforeAfter
      title="Dead Code / Unreachable Code Elimination"
      ariaLabel="Removing conditional branch that never executes"
      techniqueBadge="Dead Code Elimination"
      before={{
        lines: [
          { text: 'debug = false' },
          { text: 'if (debug) print(x)', type: 'removed' },
        ],
      }}
      after={{
        lines: [
          { text: 'debug = false' },
          { text: '(removed: condition is always false)', type: 'added' },
        ],
      }}
    />
  ),

  '05-unit-5#4': () => (
    <BeforeAfter
      title="Constant Folding & Propagation"
      ariaLabel="Evaluating constant expressions at compile time"
      techniqueBadge="Constant Folding"
      before={{
        lines: [
          { text: 'area = 3.14 * 2 * 2', type: 'removed' },
          { text: 'n = 10; m = n * 2', type: 'removed' },
        ],
      }}
      after={{
        lines: [
          { text: 'area = 12.56', type: 'added' },
          { text: 'n = 10; m = 20', type: 'added', badge: '(propagation, then folding)' },
        ],
      }}
    />
  ),

  '05-unit-5#5': () => (
    <BeforeAfter
      title="Loop Optimization: Code Motion"
      ariaLabel="Moving loop-invariant computation out of loop header"
      techniqueBadge="Code Motion"
      before={{
        lines: [
          { text: 'while (i < n) {' },
          { text: '    x = y + z;', type: 'removed' },
          { text: '    a[i] = x * i;' },
          { text: '    i++;' },
          { text: '}' },
        ],
      }}
      after={{
        lines: [
          { text: 'x = y + z;', type: 'added' },
          { text: 'while (i < n) {' },
          { text: '    a[i] = x * i;' },
          { text: '    i++;' },
          { text: '}' },
        ],
      }}
    />
  ),

  '05-unit-5#6': () => (
    <BeforeAfter
      title="Dot-Product Loop Optimization Suite"
      ariaLabel="Applying CSE, strength reduction, and induction variable elimination"
      techniqueBadge="Loop Optimization"
      before={{
        title: 'BEFORE',
        lines: [
          { text: 'B1: prod = 0' },
          { text: '    i = 1' },
          { text: 'B2: t1 = 4 * i' },
          { text: '    t2 = a[t1]' },
          { text: '    t3 = 4 * i', type: 'removed', badge: '← CSE (= t1)' },
          { text: '    t4 = b[t3]', type: 'removed' },
          { text: '    t5 = t2 * t4' },
          { text: '    prod = prod + t5' },
          { text: '    i = i + 1' },
          { text: '    if i <= 20 goto B2' },
        ],
        notes: ['8 instructions in the loop'],
      }}
      after={{
        title: 'AFTER',
        lines: [
          { text: 'B1: prod = 0' },
          { text: '    t1 = 4', type: 'added' },
          { text: 'B2: t2 = a[t1]' },
          { text: '    t4 = b[t1]', type: 'added' },
          { text: '    t5 = t2 * t4' },
          { text: '    prod = prod + t5' },
          { text: '    t1 = t1 + 4', type: 'added', badge: '← strength reduction' },
          { text: '    if t1 <= 80 goto B2', type: 'added', badge: '← i eliminated' },
        ],
        notes: ['6 instructions in the loop, no multiplication'],
      }}
      footerNote="8 instructions in the loop → 6 instructions, no multiplication"
    />
  ),

  '05-unit-5#7': () => (
    <div className="space-y-4">
      <TreeDiagram
        title="DAG Representation of Basic Block"
        ariaLabel="DAG nodes n1, n2, n3 showing common subexpression elimination"
        isDag={true}
        tree={{
          label: 'n3 (+) [c]',
          children: [
            {
              label: 'n2 (−) [b, d]',
              children: [
                {
                  label: 'n1 (+) [a]',
                  children: [{ label: 'b0' }, { label: 'c0', shared: true }],
                },
                { label: 'd0' },
              ],
            },
            { label: 'c0', shared: true, note: '(c0 is the SAME leaf as below; drawn twice only for space)' },
          ],
        }}
        headerInfo="a = b + c; b = a - d; c = b + c; d = a - d ← same as b's computation (a - d0)! Nodes: n1=(+ b0 c0) labels: a; n2=(− n1 d0) labels: b, d ← d attached to the existing node; n3=(+ n2 c0) labels: c"
      />

      <BeforeAfter
        title="Reconstructed Code"
        ariaLabel="Code reconstructed from basic block DAG"
        before={{
          title: 'Optimized (if b is not live at exit):',
          lines: [
            { text: 'a = b + c' },
            { text: 'd = a - d' },
            { text: 'c = d + c' },
          ],
        }}
        after={{
          title: 'If b is live at exit, add:',
          lines: [
            { text: 'b = d', type: 'added' },
          ],
          notes: ['if b is live at exit: b = d'],
        }}
      />
    </div>
  ),

  '05-unit-5#9': () => (
    <FlowDiagram
      title="Control Flow Graph with Reaching Definitions"
      ariaLabel="Flow graph with blocks B1 to B4 and definition sites d1 to d7"
      direction="horizontal"
      customContent={
        <div className="space-y-4 font-mono text-xs sm:text-sm">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <div className="p-3 rounded-[var(--r-md)] border border-[var(--border)] bg-[var(--surface-2)]">
              <div className="font-bold text-[var(--accent)] mb-1">B1</div>
              <div className="text-[11px] space-y-0.5 text-[var(--text)]">
                <div>d1: i = m - 1</div>
                <div>d2: j = n</div>
                <div>d3: a = u1</div>
              </div>
            </div>

            <div className="p-3 rounded-[var(--r-md)] border border-[var(--border)] bg-[var(--surface-2)]">
              <div className="font-bold text-[var(--accent)] mb-1">B2</div>
              <div className="text-[11px] space-y-0.5 text-[var(--text)]">
                <div>d4: i = i + 1</div>
                <div>d5: j = j - 1</div>
              </div>
            </div>

            <div className="p-3 rounded-[var(--r-md)] border border-[var(--border)] bg-[var(--surface-2)]">
              <div className="font-bold text-[var(--accent)] mb-1">B3</div>
              <div className="text-[11px] space-y-0.5 text-[var(--text)]">
                <div>d6: a = u2</div>
              </div>
            </div>

            <div className="p-3 rounded-[var(--r-md)] border border-[var(--border)] bg-[var(--surface-2)]">
              <div className="font-bold text-[var(--accent)] mb-1">B4</div>
              <div className="text-[11px] space-y-0.5 text-[var(--text)]">
                <div>d7: i = u3</div>
              </div>
            </div>
          </div>

          <div className="p-3 rounded-[var(--r-md)] border border-[var(--border)] bg-[var(--surface)] text-xs text-[var(--text-muted)]">
            <span className="font-bold text-[var(--text)]">Edges: </span>
            ENTRY→B1, B1→B2, B2→B3, B2→B4, B3→B4, B4→B2 (loop), B4→EXIT
          </div>
        </div>
      }
    />
  ),

  '05-unit-5#11': () => (
    <FlowDiagram
      title="Code Optimization Roadmap"
      ariaLabel="Local optimizations to global optimizations to loop optimizations to peephole"
      direction="horizontal"
      steps={[
        { id: 'loc', label: 'local (block, DAG)' },
        { id: 'glob', label: 'global (flow graph + data-flow equations)' },
        { id: 'loop', label: 'loops (motion, strength, IV)' },
        { id: 'peep', label: 'peephole on target code', highlight: true },
      ]}
    />
  ),
};

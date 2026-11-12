# Final Revision Sheet

## How to use this page

Use this page in the last 1–2 hours. First run through the **flashcards** (built from every "Check yourself" question), then rehearse each **problem recipe** below from memory, then skim the 2-mark answers.

{{widget:flashcards}}

## All problem recipes on one page

> [!RECIPE]
> **RE → NFA (Thompson)**
> Bracket by precedence (`*` > concat > `|`) → build symbol pieces → union / star / concat with ε-edges → number the states → mark start and final.

> [!RECIPE]
> **NFA → DFA (subset construction)**
> A = ε-closure(start) → for each state and symbol: ε-closure(move(S, a)) → name new sets → repeat → accepting = contains an NFA final state.

> [!RECIPE]
> **Minimize DFA**
> {final} vs {non-final} → split groups whose members go to different groups on some symbol → repeat → one state per group.

> [!RECIPE]
> **Left recursion and left factoring**
> `A → Aα | β` ⇒ `A → βA'`, `A' → αA' | ε`. `A → αβ1 | αβ2` ⇒ `A → αA'`, `A' → β1 | β2`.

> [!RECIPE]
> **FIRST / FOLLOW**
> FIRST: look at the first symbol; if it can vanish, look at the next. FOLLOW: $ for the start symbol; FIRST of what comes after (minus ε); if nothing comes after or it can vanish, inherit FOLLOW of the left side. Never ε in FOLLOW.

> [!RECIPE]
> **LL(1) table and parse**
> `A → α` in M[A, a] for a ∈ FIRST(α); if ε ∈ FIRST(α), also in M[A, b] for b ∈ FOLLOW(A). Trace: non-terminal on top → expand (push reversed); terminal on top → match; `$ $` → accept.

> [!RECIPE]
> **LR(0) items → SLR table → parse**
> Augment → I0 = closure(S' → •S) → goto on every symbol after a dot → shift = goto on a terminal; reduce `A → α•` on FOLLOW(A); accept on `S' → S•` with $; GOTO columns for non-terminals. Parse: shift pushes state; reduce pops |β| states, then pushes GOTO.

> [!RECIPE]
> **CLR → LALR**
> LR(1) items `[A → α•β, a]`; closure adds `[B → •γ, FIRST(βa)]` → reduce only on the item's lookahead → merge states with the same core → union lookaheads.

> [!RECIPE]
> **Annotated parse tree**
> Parse tree → fill leaves → apply rules bottom-up (synthesized) or top-down/left-right (inherited) → write values at nodes.

> [!RECIPE]
> **TAC → quadruples, triples, indirect triples**
> TAC by precedence → quad (op, a1, a2, result) → triple (drop result, use row numbers) → indirect (pointer list to triples).

> [!RECIPE]
> **Backpatching**
> Each relation emits `if … goto _` + `goto _` (truelist, falselist) → `&&`: patch B1.true to B2's start → `||`: patch B1.false to B2's start → handle `&&` before `||`.

> [!RECIPE]
> **Basic blocks + flow graph**
> Leaders: first instruction, jump targets, instruction after a jump → block = leader up to the next leader → edges by jump or fall-through.

> [!RECIPE]
> **Simple code generator**
> For `x = y op z`: getReg → `MOV y, R` if needed → `OP z, R` → update register and address descriptors → store live variables at block end → cost = 1 + operand costs.

> [!RECIPE]
> **DAG of a basic block**
> Leaves for initial values → reuse an existing op-node with the same children → move the label to the newest node → regenerate one instruction per node, plus copies for live labels.

> [!RECIPE]
> **Reaching definitions**
> GEN/KILL per block → OUT = GEN ∪ (IN − KILL), IN = ∪ OUT(preds) → iterate until no change.

## 2-mark quick answers

| Question | Answer in two lines |
|---|---|
| Compiler vs interpreter | A compiler translates the whole program before running it (faster to run). An interpreter translates and runs line by line (easier to debug). |
| Phases of a compiler | Lexical, syntax, semantic analysis, intermediate code generation, code optimization, code generation, plus the symbol table and error handler. |
| Token, lexeme, pattern | Lexeme = the actual text (`count`); token = its category (`id`); pattern = the rule describing the category (letter (letter\|digit)*). |
| Sentinel | A special `eof` character at the end of each buffer half, so each character needs only one test instead of two. |
| NFA vs DFA | An NFA may have several moves per symbol and ε-moves; a DFA has exactly one move per symbol and no ε-moves. |
| ε-closure | The set of states reachable from a state using only ε-transitions, including the state itself. |
| Ambiguous grammar | A grammar where some string has two or more parse trees (or leftmost derivations). |
| Handle | A substring matching a production's right side whose reduction is one step of the reverse rightmost derivation. |
| Left recursion | `A ⇒+ Aα`; it sends top-down parsers into an infinite loop. |
| LL(1) | Left-to-right scan, Leftmost derivation, 1 lookahead; table cells hold at most one production. |
| Shift/reduce conflict | The parser can't decide whether to shift the next token or reduce the handle on the stack. |
| SLR vs LALR vs CLR | All are LR parsers: SLR reduces on FOLLOW; CLR on exact lookaheads (largest); LALR merges CLR states (YACC). |
| Synthesized vs inherited | Synthesized is computed from children; inherited is computed from parent or siblings. |
| S- vs L-attributed | S: only synthesized attributes. L: inherited only from parent or left siblings. |
| Three-address code | An IR where each instruction has at most one operator and three addresses, e.g. `x = y op z`. |
| Quadruple vs triple | A quadruple has an explicit result field; a triple refers to results by position, so it's harder to reorder. |
| Backpatching | Leave jump targets blank in lists and fill them in once the targets are known, so translation needs one pass. |
| Activation record | A block on the stack per call: parameters, return value, control link, access link, saved status, locals, temporaries. |
| Static vs stack allocation | Static: fixed addresses at compile time, no recursion. Stack: a record per call, supports recursion. |
| Call by value vs reference | Value passes a copy, so the caller is unaffected. Reference passes the address, so changes affect the caller. |
| Basic block | A maximal sequence of instructions with one entry (first) and one exit (last). |
| Leaders | The first instruction, any jump target, and any instruction right after a jump. |
| DAG uses | Detect common subexpressions, find values used outside the block, and remove dead code. |
| Peephole optimization | Examine a small window of target code and replace it with shorter/faster code (redundant loads, jumps to jumps, idioms). |
| Code motion | Move loop-invariant computations out of the loop. |
| Strength reduction | Replace an expensive operation with a cheaper one (`4*i` → `t = t + 4`). |
| Reaching definitions | Definition d reaches point p if there's a path from d to p with no redefinition of its variable. |
| Live variable | x is live at p if its value at p may be used along some path before being reassigned. |

## Final exam strategy

1. **Part A (2-mark):** two lines plus a tiny example or diagram each. Don't write essays.
2. **Part B/C (problems):** write the **recipe steps as headings** ("Step 1: FIRST sets", "Step 2: FOLLOW sets"…). Examiners award marks per step, even if your final table has a slip.
3. Always **state your grammar numbering** before filling LR tables (r1, r2, …).
4. **Draw diagrams** for theory answers: phases, storage organization, activation record, buffer pairs, Lex/YACC flow. A labelled diagram earns marks quickly.
5. **Time per problem:** NFA→DFA→min ≈ 15 min · LL(1) full ≈ 20 min · SLR full ≈ 25 min · DAG ≈ 8 min.

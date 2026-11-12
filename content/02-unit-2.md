# Unit II · Syntax Analysis

## The job: checking the grammar

The lexer gives us words. Now we need to know whether those words form a **valid sentence**, and what its **structure** is. That's the **parser's** job.

> [!ANALOGY]
> "The dog chased the cat" and "Chased the the cat dog" use the same words. Only one follows English grammar. A parser is the grammar teacher: it checks the order of words and draws the sentence diagram (the **parse tree**).

### Role of the parser

```text
 source ──► [ Lexer ] ──token──► [ Parser ] ──parse tree──► [ rest of front end ] ──► IR
                ▲   ◄─get next token─┘   │
                └──────── Symbol Table ──┘
```
1. Check that the token stream follows the grammar.
2. Build a parse tree (or syntax tree).
3. Report syntax errors clearly and **recover**, so it can keep finding more errors.

## Grammars: the rulebook

Regular expressions can't describe **nesting** like balanced brackets `((()))`, because an FA has no memory to count. So we need a stronger tool: the **context-free grammar (CFG)**.

A CFG has four parts, **G = (V, T, P, S)**:

| Part | Meaning | Example |
|---|---|---|
| **T**: terminals | actual tokens (the words) | `id`, `+`, `*`, `(`, `)` |
| **V**: non-terminals | category names (placeholders) | `E`, `T`, `F` |
| **P**: productions | rewrite rules `A → α` | `E → E + T` |
| **S**: start symbol | where every derivation begins | `E` |

```text
 E → E + T | T
 T → T * F | F
 F → ( E ) | id
```

### Derivations

A **derivation** rewrites the start symbol step by step until only terminals remain.

**Leftmost derivation** (always replace the leftmost non-terminal) of `id + id * id`:
```text
E ⇒ E + T ⇒ T + T ⇒ F + T ⇒ id + T ⇒ id + T * F ⇒ id + F * F ⇒ id + id * F ⇒ id + id * id
```
A **rightmost derivation** always replaces the rightmost non-terminal. Bottom-up parsers trace a rightmost derivation in reverse.

```text
 Parse tree for id + id * id:
              E
           /  |  \
          E   +   T
          |     / | \
          T    T  *  F
          |    |     |
          F    F     id
          |    |
          id   id
```

### Ambiguity

A grammar is **ambiguous** if some string has **two different parse trees** (equivalently, two leftmost derivations).

{{widget:ambiguity-trees}}

```text
 Grammar: E → E + E | E * E | id      String: id + id * id

     Tree 1 (correct)             Tree 2 (wrong)
          E                            E
        / | \                        / | \
       E  +  E                      E  *  E
       |   / | \                  / | \   |
      id  E  *  E                E  +  E  id
          |     |                |     |
          id    id               id    id
     2 + (3*4) = 14             (2+3) * 4 = 20
```

**Fixes:** rewrite the grammar with one level per precedence (E, T, F as above), or tell the parser generator precedence rules (YACC's `%left`).

> [!TRAP]
> The **dangling else** `if a then if b then s1 else s2` is the classic ambiguity: which `if` owns the `else`? The convention is to match `else` with the **nearest unmatched `then`**.

> [!CHECK]
> How do you prove a grammar is ambiguous?
> **Answer:** Find **one** string that has two different parse trees (or two different leftmost derivations). One example is enough.

## Writing a grammar for top-down parsing

Top-down parsers (LL) **cannot handle** two things, so we fix the grammar first.

### 1. Left recursion: A → A α

A top-down parser expanding `E → E + T` would expand `E` again, then again… forever. That's an infinite loop.

> [!RECIPE]
> **Remove immediate left recursion**
> 1. Group the rules: `A → Aα1 | Aα2 | … | β1 | β2 | …` (β's don't start with A).
> 2. Replace with:
>    `A  → β1 A' | β2 A' | …`
>    `A' → α1 A' | α2 A' | … | ε`
> 3. Memory trick: **"β goes first, then α repeats in A', and A' can stop with ε."**

```text
 E → E + T | T         ⇒   E  → T E'
                           E' → + T E' | ε
 T → T * F | F         ⇒   T  → F T'
                           T' → * F T' | ε
```

### 2. Left factoring: A → αβ1 | αβ2

If two choices start the same way, the parser can't tell which to pick by looking at one token. So we postpone the decision.

> [!RECIPE]
> **Left factoring**
> `A → αβ1 | αβ2`  ⇒  `A → α A'` and `A' → β1 | β2`

```text
 S → i E t S | i E t S e S | a     ⇒     S  → i E t S S' | a
                                         S' → e S | ε
```

{{widget:left-recursion-fixer}}

> [!CHECK]
> Remove left recursion from `S → S a | b`.
> **Answer:** `S → b S'` and `S' → a S' | ε`. Here β = b goes first and α = a repeats.

## Top-down parsing: the general idea

Top-down parsing starts from the start symbol and **grows the tree downward**, trying to match the input from left to right. It builds a **leftmost derivation**.

```text
 Top-down:  E  ─► grow tree ─► … ─► id + id * id        (root first)
 Bottom-up: id + id * id ─► shrink ─► … ─► E            (leaves first)
```

### Recursive descent parsing

Write **one function per non-terminal**. Each function follows its production.

```c
// Grammar: E → T E'   E' → + T E' | ε   T → F T'   T' → * F T' | ε   F → ( E ) | id
void E()      { T(); Eprime(); }
void Eprime() { if (look == '+') { match('+'); T(); Eprime(); } /* else ε: do nothing */ }
void T()      { F(); Tprime(); }
void Tprime() { if (look == '*') { match('*'); F(); Tprime(); } }
void F()      { if (look == '(') { match('('); E(); match(')'); }
                else if (look == ID) match(ID);
                else error(); }
void match(int t) { if (look == t) look = nextToken(); else error(); }
```

- **With backtracking:** try one alternative, and if it fails, rewind the input and try the next one. This is slow.
- **Predictive (no backtracking):** look at the **next token** and know immediately which alternative to use. That needs an LL(1) grammar.

## FIRST and FOLLOW

These two sets answer the predictive parser's question: "Looking at this token, which rule should I use?"

- **FIRST(α)** = the set of terminals that can appear **first** in something derived from α (plus ε if α can vanish).
- **FOLLOW(A)** = the set of terminals that can appear **immediately after** A in some sentence (plus `$` for end of input).

> [!ANALOGY]
> FIRST is "how can this word begin?" FOLLOW is "what can come right after this word?" If A can disappear (become ε), you need FOLLOW to know when to make it disappear.

> [!RECIPE]
> **FIRST rules**
> 1. If X is a terminal: FIRST(X) = {X}.
> 2. If X → ε: add ε.
> 3. If X → Y1 Y2 … Yk: add FIRST(Y1) − {ε}. If Y1 can be ε, also add FIRST(Y2) − {ε}, and so on. If **all** can be ε, add ε.

> [!RECIPE]
> **FOLLOW rules** (repeat until nothing changes)
> 1. Put `$` in FOLLOW(Start).
> 2. For `A → α B β`: add FIRST(β) − {ε} to FOLLOW(B).
> 3. For `A → α B`, or `A → α B β` where β can be ε: add **all of FOLLOW(A)** to FOLLOW(B).
> 4. FOLLOW **never** contains ε.

{{widget:first-follow-stepper}}

| Non-terminal | FIRST | FOLLOW |
|---|---|---|
| E | { (, id } | { ), $ } |
| E' | { +, ε } | { ), $ } |
| T | { (, id } | { +, ), $ } |
| T' | { *, ε } | { +, ), $ } |
| F | { (, id } | { +, *, ), $ } |

> [!TRAP]
> 1. Writing ε inside a FOLLOW set is always wrong.
> 2. Students forget rule 3 when the following symbol can vanish. In `T → F T'`, since T' ⇒ ε, FOLLOW(T) flows into FOLLOW(F).

## LL(1) parsing table

**LL(1)** means: scan **L**eft to right, build a **L**eftmost derivation, use **1** lookahead token.

> [!RECIPE]
> **Build the LL(1) table M[A, a]**
> For each production `A → α`:
> 1. For each terminal `a` in FIRST(α), put `A → α` in M[A, a].
> 2. If ε ∈ FIRST(α), put `A → α` in M[A, b] for **each b in FOLLOW(A)** (including `$`).
> 3. Empty cells mean **error**.
> 4. If any cell gets **two** productions, the grammar is **not LL(1)**.

| | id | + | * | ( | ) | $ |
|---|---|---|---|---|---|---|
| **E** | E→TE' | | | E→TE' | | |
| **E'** | | E'→+TE' | | | E'→ε | E'→ε |
| **T** | T→FT' | | | T→FT' | | |
| **T'** | | T'→ε | T'→*FT' | | T'→ε | T'→ε |
| **F** | F→id | | | F→(E) | | |

### Running the predictive parser

```text
 ┌─────────────────────────┐
 │ input:  id + id * id $  │
 └─────────────────────────┘
 stack (start: E $)  +  table  ──►  output: productions used
```

> [!RECIPE]
> **Parsing a string with the table**
> Let X = top of stack, a = current input.
> 1. If X = a = `$`: **accept**.
> 2. If X = a (a terminal): **pop and advance** ("match").
> 3. If X is a non-terminal: look up M[X, a]. If it's `X → Y1…Yk`, pop X and push Yk…Y1 (so **Y1 ends up on top**).
> 4. Otherwise: **error**.

{{widget:ll1-parser}}

| # | Stack | Input | Action |
|---|---|---|---|
| 1 | E $ | id+id*id$ | E→TE' |
| 2 | T E' $ | id+id*id$ | T→FT' |
| 3 | F T' E' $ | id+id*id$ | F→id |
| 4 | id T' E' $ | id+id*id$ | match id |
| 5 | T' E' $ | +id*id$ | T'→ε |
| 6 | E' $ | +id*id$ | E'→+TE' |
| 7 | + T E' $ | +id*id$ | match + |
| 8 | T E' $ | id*id$ | T→FT' |
| 9 | F T' E' $ | id*id$ | F→id |
| 10 | id T' E' $ | id*id$ | match id |
| 11 | T' E' $ | *id$ | T'→*FT' |
| 12 | * F T' E' $ | *id$ | match * |
| 13 | F T' E' $ | id$ | F→id |
| 14 | id T' E' $ | id$ | match id |
| 15 | T' E' $ | $ | T'→ε |
| 16 | E' $ | $ | E'→ε |
| 17 | $ | $ | **accept** |

> [!CHECK]
> Why does M[T', +] contain `T' → ε` and not something else?
> **Answer:** `+` is not in FIRST(T') = {*, ε}, but ε is, and `+` ∈ FOLLOW(T'). So when T' is on top and `+` is next, T' must vanish.

> [!EXAM]
> Typical 16-mark question: "Construct the predictive parsing table for the grammar … and parse the string …". Steps: (1) remove left recursion, (2) left factor, (3) FIRST, (4) FOLLOW, (5) table, (6) trace. Show every step for full marks.

## Bottom-up parsing: shift-reduce

Bottom-up parsing starts from the **input** and **shrinks** it back to the start symbol. Each shrink step is a **reduction**: replace the right side of a production with its left side.

```text
 id * id  ⇒(reduce F→id)  F * id  ⇒  T * id  ⇒  T * F  ⇒  T  ⇒  E
```

A **handle** is the substring that matches a production's right side **and** whose reduction is a correct step back toward the start symbol (one step of the reversed rightmost derivation).

A shift-reduce parser has a **stack** and four actions:

| Action | Meaning |
|---|---|
| **Shift** | push the next input token onto the stack |
| **Reduce** | the handle is on top of the stack, so replace it with the left-hand side |
| **Accept** | stack holds only the start symbol and input is `$` |
| **Error** | none of the above is possible |

**Conflicts:**
- **Shift/reduce:** the parser can't decide whether to shift or reduce (e.g. dangling else).
- **Reduce/reduce:** two different productions could be reduced.

> [!KEY]
> The whole LR family (LR(0), SLR, CLR, LALR) is just **different ways of building a table that tells a shift-reduce parser when to shift and when to reduce**.

## LR parsers: the big family

**LR(k)**: scan **L**eft to right, build a **R**ightmost derivation in reverse, use **k** lookahead.

```text
                   ┌──────────────────────────────┐
  input: a1 … an $ │                              │
                   │  LR parsing program          │──► output
  stack: s0 X1 s1… │  ACTION[state, terminal]     │
                   │  GOTO[state, non-terminal]   │
                   └──────────────────────────────┘
```

| Parser | Items used | Reduce on which lookaheads | Power | Table size |
|---|---|---|---|---|
| LR(0) | LR(0) items | all terminals | weakest | small |
| **SLR(1)** | LR(0) items | FOLLOW(A) | better | small |
| **CLR(1)** | LR(1) items (item + lookahead) | the item's own lookahead | strongest | **large** |
| **LALR(1)** | merged LR(1) items | merged lookaheads | almost CLR | small (= SLR size) |

Power: **LR(0) ⊂ SLR ⊂ LALR ⊂ CLR**. YACC builds **LALR** parsers.

## LR(0) items and the canonical collection

An **item** is a production with a **dot (•)** showing how much we've already seen.

```text
 E → • E + T     seen nothing yet
 E → E • + T     seen E, expecting +
 E → E + • T     seen E +, expecting T
 E → E + T •     seen everything → ready to REDUCE
```

Two operations:
- **CLOSURE(I):** if an item has `• B` (dot before a non-terminal B), add `B → • γ` for every production of B. Repeat.
- **GOTO(I, X):** move the dot over X in every item that has `• X`, then take the CLOSURE.

> [!RECIPE]
> **Canonical LR(0) collection**
> 1. Augment the grammar: add `S' → S`.
> 2. I0 = CLOSURE({ S' → • S }).
> 3. For each state and each grammar symbol X after a dot, compute GOTO. New set → new state.
> 4. Repeat until no new sets appear.
> 5. Draw the states as boxes with GOTO arrows. This is the **LR(0) automaton (DFA of items)**.

Grammar: `E → E + T | T`, `T → T * F | F`, `F → ( E ) | id` gives 12 states:

{{widget:lr0-automaton}}

```text
 I0: E'→•E  E→•E+T  E→•T  T→•T*F  T→•F  F→•(E)  F→•id
 I1: E'→E•  E→E•+T                         (from I0 on E)
 I2: E→T•   T→T•*F                         (from I0 on T)
 I3: T→F•                                  (from I0 on F)
 I4: F→(•E) E→•E+T E→•T T→•T*F T→•F F→•(E) F→•id   (from I0 on ( )
 I5: F→id•                                 (from I0 on id)
 I6: E→E+•T T→•T*F T→•F F→•(E) F→•id      (from I1 on +)
 I7: T→T*•F F→•(E) F→•id                  (from I2 on *)
 I8: F→(E•) E→E•+T                         (from I4 on E)
 I9: E→E+T• T→T•*F                         (from I6 on T)
 I10: T→T*F•                               (from I7 on F)
 I11: F→(E)•                               (from I8 on ) )
```

## SLR parsing table

> [!RECIPE]
> **Fill the SLR table**
> Number the productions: 1 E→E+T, 2 E→T, 3 T→T*F, 4 T→F, 5 F→(E), 6 F→id.
> 1. **Shift:** if GOTO(Ii, a) = Ij for a terminal a → ACTION[i, a] = **sj**.
> 2. **Reduce:** if Ii has a complete item `A → α •` (A ≠ S') → ACTION[i, b] = **r(number)** for every b ∈ **FOLLOW(A)**.
> 3. **Accept:** if Ii has `S' → S •` → ACTION[i, $] = **acc**.
> 4. **GOTO:** if GOTO(Ii, A) = Ij for a non-terminal A → GOTO[i, A] = j.
> 5. Two entries in one cell means a conflict, so the grammar is **not SLR**.

FOLLOW(E) = { +, ), $ } and FOLLOW(T) = FOLLOW(F) = { +, *, ), $ }

| St | id | + | * | ( | ) | $ | E | T | F |
|---|---|---|---|---|---|---|---|---|---|
| 0 | s5 | | | s4 | | | 1 | 2 | 3 |
| 1 | | s6 | | | | acc | | | |
| 2 | | r2 | s7 | | r2 | r2 | | | |
| 3 | | r4 | r4 | | r4 | r4 | | | |
| 4 | s5 | | | s4 | | | 8 | 2 | 3 |
| 5 | | r6 | r6 | | r6 | r6 | | | |
| 6 | s5 | | | s4 | | | | 9 | 3 |
| 7 | s5 | | | s4 | | | | | 10 |
| 8 | | s6 | | | s11 | | | | |
| 9 | | r1 | s7 | | r1 | r1 | | | |
| 10 | | r3 | r3 | | r3 | r3 | | | |
| 11 | | r5 | r5 | | r5 | r5 | | | |

### LR parsing algorithm

> [!RECIPE]
> **Parse with an LR table.** Let s = state on top of the stack and a = current input.
> - ACTION[s, a] = **sj** → push j, advance input.
> - ACTION[s, a] = **r(A→β)** → pop |β| states; let t be the new top; push GOTO[t, A].
> - **acc** → done. Blank → error.

{{widget:slr-parser}}

| # | Stack | Symbols | Input | Action |
|---|---|---|---|---|
| 1 | 0 | | id*id+id$ | shift 5 |
| 2 | 0 5 | id | *id+id$ | reduce F→id |
| 3 | 0 3 | F | *id+id$ | reduce T→F |
| 4 | 0 2 | T | *id+id$ | shift 7 |
| 5 | 0 2 7 | T * | id+id$ | shift 5 |
| 6 | 0 2 7 5 | T * id | +id$ | reduce F→id |
| 7 | 0 2 7 10 | T * F | +id$ | reduce T→T*F |
| 8 | 0 2 | T | +id$ | reduce E→T |
| 9 | 0 1 | E | +id$ | shift 6 |
| 10 | 0 1 6 | E + | id$ | shift 5 |
| 11 | 0 1 6 5 | E + id | $ | reduce F→id |
| 12 | 0 1 6 3 | E + F | $ | reduce T→F |
| 13 | 0 1 6 9 | E + T | $ | reduce E→E+T |
| 14 | 0 1 | E | $ | **accept** |

> [!CHECK]
> In state 2 with `*` as input, why do we shift instead of reducing E → T?
> **Answer:** Reducing E→T happens only on FOLLOW(E) = {+, ), $}. `*` isn't in it, and I2 contains `T → T • * F`, which says shift. That's how precedence (`*` before `+`) comes out of the table.

## CLR(1) and LALR(1)

SLR sometimes reduces on a lookahead that can't actually follow **in this particular situation**, which causes false conflicts. **CLR(1)** fixes this by carrying the exact lookahead inside each item.

**LR(1) item** = `[A → α • β, a]`, meaning "if we finish this item, we'll reduce only when the next token is a".

**CLOSURE for LR(1):** for item `[A → α • B β, a]`, add `[B → • γ, b]` for every b ∈ **FIRST(βa)**.

> [!RECIPE]
> **CLR → LALR**
> 1. Build LR(1) items: I0 = CLOSURE([S' → • S, $]).
> 2. CLR table: shift exactly like SLR. **Reduce `A → α •, a` only on lookahead a.**
> 3. For LALR: find states with the **same core** (same items, ignoring lookaheads). **Merge** them and union the lookaheads.
> 4. Rebuild the table with merged state names (e.g. 36, 47, 89).
> 5. Merging can create **reduce/reduce** conflicts, never new shift/reduce ones.

Example: `S → C C`, `C → c C | d`

{{widget:clr-lalr-merge}}

```text
 I0: S'→•S,$  S→•CC,$  C→•cC,c/d  C→•d,c/d
 I1: S'→S•,$
 I2: S→C•C,$  C→•cC,$  C→•d,$
 I3: C→c•C,c/d  C→•cC,c/d  C→•d,c/d       ┐ same core
 I6: C→c•C,$    C→•cC,$    C→•d,$          ┘ → merge 36
 I4: C→d•,c/d                              ┐ same core
 I7: C→d•,$                                ┘ → merge 47
 I8: C→cC•,c/d                             ┐ same core
 I9: C→cC•,$                               ┘ → merge 89
 I5: S→CC•,$
```

| LALR | c | d | $ | S | C |
|---|---|---|---|---|---|
| 0 | s36 | s47 | | 1 | 2 |
| 1 | | | acc | | |
| 2 | s36 | s47 | | | 5 |
| 36 | s36 | s47 | | | 89 |
| 47 | r3 | r3 | r3 | | |
| 5 | | | r1 | | |
| 89 | r2 | r2 | r2 | | |

> [!CHECK]
> In I0, why do the C-items have lookahead c/d and not $?
> **Answer:** In `[S → • C C, $]` the dot is before the first C, and what follows that C is "C $". So the lookaheads are FIRST(C $) = FIRST(C) = {c, d}. A first C is always followed by a second C, never by end of input.

## Error handling and recovery

Goals: report errors **clearly** (where and what), **recover quickly** to find more errors, and add **little overhead** to correct programs.

| Strategy | How it works | Example |
|---|---|---|
| **Panic mode** | Discard tokens until a **synchronizing token** (like `;` or `}`) appears | skip to the next `;` |
| **Phrase level** | Make a **local fix** to the rest of the input | insert a missing `;` |
| **Error productions** | Add grammar rules for **common mistakes** | `stmt → if expr stmt` without `then` |
| **Global correction** | Find the **fewest changes** that make the input valid | theoretical, too costly |

In LL(1) tables, panic mode uses FOLLOW(A) as the synchronizing set. In LR parsers, the parser pops states until one has a GOTO on an error non-terminal, then discards input.

## YACC: a parser generator

**YACC** ("Yet Another Compiler-Compiler") takes a grammar plus actions and generates an **LALR(1)** parser in C (`y.tab.c`). Bison is the GNU version.

```text
 parser.y ──► [ yacc ] ──► y.tab.c ──► [ cc ] ──► a.out
 lex.l    ──► [ lex  ] ──► lex.yy.c ──┘      (yylex() supplies tokens to yyparse())
```

```c
%{
#include <stdio.h>
#include <ctype.h>
int yylex(void);
void yyerror(const char *s) { printf("syntax error\n"); }
%}
%token DIGIT
%left '+' '-'          /* lower precedence  */
%left '*' '/'          /* higher precedence */
%%
line : expr '\n'          { printf("%d\n", $1); }
     ;
expr : expr '+' expr      { $$ = $1 + $3; }
     | expr '-' expr      { $$ = $1 - $3; }
     | expr '*' expr      { $$ = $1 * $3; }
     | expr '/' expr      { $$ = $1 / $3; }
     | '(' expr ')'       { $$ = $2; }
     | DIGIT
     ;
%%
int yylex(void) {
    int c = getchar();
    if (isdigit(c)) { yylval = c - '0'; return DIGIT; }
    return c;
}
int main(void) { return yyparse(); }
```
(This mini calculator reads single digits with no spaces, e.g. `2+3*4`, and prints 14.)

| Symbol | Meaning |
|---|---|
| `$$` | value of the left-hand side |
| `$1, $2, …` | values of the right-hand-side symbols |
| `%token` | declares token names |
| `%left`, `%right` | associativity; later lines have **higher** precedence |
| `yylval` | value passed from the lexer with a token |

> [!KEY]
> The `%left` lines solve the ambiguity of `E → E + E | E * E` without rewriting the grammar. YACC resolves shift/reduce conflicts using them.

## Designing a syntax analyzer for a sample language

Exam approach for "Design a syntax analyzer for a sample language":
1. **Define the tokens** (Lex): keywords, id, num, operators.
2. **Write the grammar** (CFG) for statements: declarations, assignment, if, while, blocks.
3. **Choose the method**: hand-written recursive descent (needs LL(1) form) or YACC (LALR).
4. **Add error recovery** (panic mode on `;` and `}`).
5. **Show a sample input and its parse tree.**

```text
 program → stmt_list
 stmt_list → stmt_list stmt | stmt
 stmt → id = expr ;
      | if ( cond ) stmt else stmt
      | while ( cond ) stmt
      | { stmt_list }
 cond → expr relop expr
 expr → expr + term | expr - term | term
 term → term * factor | term / factor | factor
 factor → ( expr ) | id | num
```

## Unit II in one glance

```text
 Grammar ─┬─► top-down (LL):  remove left recursion + left factor → FIRST/FOLLOW → LL(1) table → trace
          └─► bottom-up (LR): augment → items (closure/goto) → SLR / CLR / LALR table → shift-reduce trace
```

| Must-know 2-mark points |
|---|
| Define CFG (four parts), derivation, parse tree, ambiguity |
| Why left recursion breaks top-down parsing |
| Definition of a handle, and handle pruning |
| The four shift-reduce actions; the two kinds of conflict |
| LR(0) item definition; closure and goto |
| SLR vs CLR vs LALR (power and table size) |
| Four error-recovery strategies |
| Structure of a YACC program; meaning of `$$` and `$1` |

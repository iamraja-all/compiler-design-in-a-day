# Unit I · Lexical Analysis

## The job: turning letters into words

When you read `count = count + 10;` you don't see 18 separate characters. You instantly see **words**: a name, an equals sign, the name again, a plus, a number, a semicolon. The lexical analyzer (also called the **scanner** or **lexer**) does exactly that for the compiler.

> [!ANALOGY]
> A lexer is like your eyes reading a sentence. It doesn't care whether the sentence makes sense ("Banana sings blue"). It only groups letters into valid words. Checking whether the sentence makes sense is the parser's job in Unit II.

### Why make it a separate phase?

1. **Simpler design.** The parser deals with clean words, not spaces, comments and newlines.
2. **Speed.** Reading characters is the slowest part, and a dedicated lexer can use clever buffering.
3. **Portability.** Character-set quirks stay inside the lexer.

### Role of the lexical analyzer

```text
                   "get next token"
   ┌──────────┐ ◄──────────────────── ┌──────────┐
   │  Lexical │                       │  Parser  │ ──► rest of compiler
   │ Analyzer │ ────────────────────► │          │
   └────┬─────┘     token             └────┬─────┘
        │ reads characters                 │
   source program        ┌──────────────┐  │
        └───────────────►│ Symbol Table │◄─┘
                         └──────────────┘
```
Other jobs: strip **comments and whitespace**, count **line numbers** for error messages, and expand **macros** in some languages.

## Tokens, patterns and lexemes

These three words are the vocabulary of the whole unit.

| Term | Plain meaning | Example |
|---|---|---|
| **Lexeme** | The actual characters in the program | `count`, `10`, `<=` |
| **Token** | The *category* name (token name + optional attribute) | `id`, `num`, `relop` |
| **Pattern** | The *rule* describing which lexemes belong to a token | "letter followed by letters or digits" |

| Token | Pattern (informal) | Sample lexemes |
|---|---|---|
| `if` | the characters i, f | `if` |
| `relop` | `<` `<=` `>` `>=` `==` `!=` | `<=`, `!=` |
| `id` | letter followed by letters/digits | `pi`, `count`, `D2` |
| `num` | any numeric constant | `3.14`, `0`, `6.02e23` |
| `literal` | anything between quotes | `"core dumped"` |

> [!KEY]
> A **token = ⟨token-name, attribute-value⟩**. For `count` the token is `⟨id, pointer to symbol-table entry for count⟩`. For `<=` it's `⟨relop, LE⟩`. For `10` it's `⟨num, 10⟩`.

Try it yourself. Type any C-like line:

{{widget:tokenizer-playground}}

> [!CHECK]
> How many tokens are in `count = count + 10;`?
> **Answer:** 6, namely `id(count)` `=` `id(count)` `+` `num(10)` `;`. The spaces are not tokens; the lexer throws them away.

> [!TRAP]
> In `ifx = 5;` the lexer gives `id(ifx)`, **not** keyword `if` followed by `x`. The rule is **longest match**: take the longest lexeme that fits any pattern.

### Lexical errors

A lexer can only spot errors at the word level, such as a character that fits no pattern (`@` in C) or an unterminated string. It **cannot** spot `int 9x;` as a grammar problem. It just gives `num(9) id(x)`.

Recovery strategies: **panic mode** (delete characters until a valid token appears), delete one character, insert a missing character, replace a character, or swap two adjacent characters.

## Input buffering

Reading the disk one character at a time is very slow. And sometimes the lexer must **look ahead** before deciding: after `<` it has to peek at the next character to tell `<` from `<=`.

**Solution: a two-half buffer with sentinels.**

```text
 ┌───┬───┬───┬───┬───┬───┬───┬────┐┌───┬───┬───┬───┬───┬────┬───┬────┐
 │ E │   │ = │   │ M │   │ * │eof ││ C │ * │ * │ 2 │eof │    │   │eof │
 └───┴───┴───┴───┴───┴───┴───┴────┘└───┴───┴───┴───┴────┴────┴───┴────┘
           ▲          ▲
   lexemeBegin      forward
```
- **lexemeBegin** marks where the current word starts.
- **forward** runs ahead until the word ends.
- When forward reaches the end of one half, the other half is reloaded.
- **Sentinel (`eof`)** is a special character placed at the end of each half. Without it, every move needs two checks: "end of buffer?" and "which character is this?". With the sentinel, only one check is needed, because seeing `eof` means either "reload" or "real end".

{{widget:input-buffer}}

> [!EXAM]
> "Explain input buffering with sentinels" (8 marks): draw the two halves, the two pointers, the sentinel, and write the lookahead code idea: `switch(*forward++) { case eof: if at end of half 1 → reload half 2 … else terminate }`.

## Specifying tokens: regular expressions

To describe a pattern precisely, we need a tiny language. That language is **regular expressions** (RE).

### Building blocks

- **Alphabet (Σ):** the allowed symbols, e.g. {a, b}.
- **String:** a finite sequence of symbols. **ε** is the empty string.
- **Language:** a set of strings.

| Operation | Notation | Meaning | Example (Σ={a,b}) |
|---|---|---|---|
| Union (OR) | r \| s | either | `a\|b` → {a, b} |
| Concatenation | rs | one after the other | `ab` → {ab} |
| Kleene star | r* | zero or more times | `a*` → {ε, a, aa, …} |
| Positive closure | r+ | one or more times | `a+` → {a, aa, …} |
| Optional | r? | zero or one | `a?` → {ε, a} |

**Precedence:** `*` binds tightest, then concatenation, then `|`. So `a|bc*` means `a | (b(c*))`.

### Regular definitions (giving names to patterns)

```text
letter  →  A | B | … | Z | a | b | … | z | _
digit   →  0 | 1 | … | 9
id      →  letter ( letter | digit )*
digits  →  digit+
number  →  digits ( . digits )? ( E [+-]? digits )?
```

> [!CHECK]
> Describe in words the strings matched by `(a|b)*abb`.
> **Answer:** Any string of a's and b's that **ends with abb**, for example abb, aabb, babb, ababb.

## Recognizing tokens: transition diagrams

A RE *describes* a pattern. To *recognize* one, the lexer uses a flowchart of states called a **transition diagram**.

```text
 Relational operators:
                   =
          ┌──► (1) ──────► ((2))  return(relop, LE)
          │ <    │  >
   ──►(0)─┤      ├──────► ((3))  return(relop, NE)
          │      │ other
          │      └──────► ((4))* return(relop, LT)   * = retract one char
          │ =
          ├──────────────► ((5))  return(relop, EQ)
          │ >            =
          └──► (6) ──────► ((7))  return(relop, GE)
                 │ other
                 └──────► ((8))* return(relop, GT)
```
The `*` means "we read one character too many, so push it back" (**retract**).

```text
 Identifier:      letter or digit
                     ┌──┐
          letter     ▼  │      other
   ──►(9) ──────► (10) ─┴───────────► ((11))*  return(getToken(), installID())
```
`installID()` puts the lexeme in the symbol table (if it's new), and `getToken()` checks whether it's actually a **keyword** (keywords are pre-loaded into the table).

## Finite automata: the machines behind patterns

A transition diagram turned into a precise machine is a **finite automaton (FA)**: a set of states with arrows labelled by input symbols, one start state and some accepting states. Feed it a string one symbol at a time. If you finish in an accepting state, the string is **accepted**.

> [!ANALOGY]
> An FA is like a board game. Each input letter tells you which arrow to follow. When you run out of letters, you win if you're standing on a winning square (a double circle).

| | NFA (Non-deterministic) | DFA (Deterministic) |
|---|---|---|
| Arrows per symbol from a state | 0, 1 **or many** | **exactly 1** |
| ε-moves (move without reading) | allowed | not allowed |
| Easy to **build** from RE | ✅ yes | ❌ harder |
| Easy to **run** fast | ❌ must track many states | ✅ one state at a time |

> [!KEY]
> The whole unit is one pipeline: **RE → NFA (easy to build) → DFA (fast to run) → minimized DFA (smallest)**. Lex tools do exactly this automatically.

Play with real DFAs:

{{widget:dfa-simulator}}

## Problem 1: RE → NFA (Thompson's construction)

**Idea:** build tiny NFAs for single symbols, then glue them together with ε-arrows according to `|`, concatenation and `*`.

```text
 ε:      (i) ──ε──► ((f))

 a:      (i) ──a──► ((f))

 s|t:         ┌─ε─► [ N(s) ] ─ε─┐
         (i) ─┤                 ├─► ((f))
              └─ε─► [ N(t) ] ─ε─┘

 st:     (i) ─► [ N(s) ] ──► [ N(t) ] ─► ((f))      (end of s = start of t)

 s*:              ┌──────ε──────┐  (loop back)
                  ▼             │
         (i) ─ε─► [   N(s)    ] ─ε─► ((f))
          │                           ▲
          └─────────────ε─────────────┘  (skip entirely: zero times)
```

> [!RECIPE]
> **RE → NFA in an exam**
> 1. Add brackets to show precedence: `(a|b)*abb` = `((a|b)*)·a·b·b`.
> 2. Build the innermost pieces first (single symbols).
> 3. Combine with the rules: union, then star, then concatenation, from inside out.
> 4. Number states left to right (0, 1, 2, …). Mark the start with an arrow and the final state with a double circle.
> 5. Each Thompson rule adds **at most 2 new states**, so the NFA has at most 2 × (number of symbols + operators) states. Use that to sanity-check.

Worked example `(a|b)*abb` gives 11 states (0–10):

{{widget:thompson-builder}}

```text
              ┌────────────────ε──────────────────┐
              │        a                          │
              ▼    ┌─►(2)──►(3)─┐                 │
   ──►(0)─ε─►(1)─ε─┤            ├─ε─►(6)──────────┘
       │           └─►(4)──►(5)─┘     │
       │               b              ε
       │                              ▼    a      b      b
       └──────────────ε─────────────►(7)──►(8)──►(9)──►((10))
```

## Problem 2: NFA → DFA (subset construction)

**Idea:** an NFA can be in *several* states at once. So let each DFA state be a **set of NFA states**.

Two helper operations:
- **ε-closure(S):** all NFA states reachable from S using only ε-arrows (including S itself).
- **move(S, a):** all states reachable from S by one arrow labelled `a`.

> [!RECIPE]
> **Subset construction**
> 1. Start state **A = ε-closure({start})**.
> 2. For each new DFA state and each symbol `a`: compute **ε-closure(move(state, a))**.
> 3. If the resulting set is new, give it the next letter (B, C, …) and add it to the to-do list.
> 4. Repeat until no new sets appear.
> 5. **Accepting** DFA states are those containing any NFA accepting state.
> 6. Present it as a transition table, then draw the DFA.

{{widget:subset-construction}}

| DFA state | NFA states | on a | on b |
|---|---|---|---|
| →A | {0,1,2,4,7} | B | C |
| B | {1,2,3,4,6,7,8} | B | D |
| C | {1,2,4,5,6,7} | B | C |
| D | {1,2,4,5,6,7,9} | B | E |
| *E | {1,2,4,5,6,7,10} | B | C |

> [!TRAP]
> Students often forget to take the ε-closure **after** `move`. Always do both: `move`, then `ε-closure`.

> [!CHECK]
> In the table above, why is only E accepting?
> **Answer:** Only E's set contains NFA state 10, the NFA's final state.

## Problem 3: Minimizing a DFA

**Idea:** two states are "the same" if, for **every** possible future input, they either both accept or both reject. Merge such states.

> [!RECIPE]
> **Partition refinement**
> 1. Split states into two groups: **accepting** and **non-accepting**.
> 2. For each group and each symbol, check where each state goes. If two states in the same group go to **different groups**, split them.
> 3. Repeat until no group splits.
> 4. Each final group becomes one state. Add a dead state only if the question asks for a complete DFA.

{{widget:dfa-minimization}}

```text
 Π0 = {A B C D} {E}
 Π1 = {A B C} {D} {E}        (D on b → E, others don't)
 Π2 = {A C} {B} {D} {E}      (B on b → D, A and C don't)
 Final: {A,C} cannot split → 4 states

 Main path:   ──► (0) ──a──► (1) ──b──► (2) ──b──► ((3))
```

| Min state | Old states | on a | on b |
|---|---|---|---|
| →0 | {A, C} | 1 | 0 |
| 1 | {B} | 1 | 2 |
| 2 | {D} | 1 | 3 |
| *3 | {E} | 1 | 0 |

Read the table as a story: state 0 means "nothing useful seen yet", state 1 "seen a", state 2 "seen ab" and state 3 "seen abb". Any `a` sends you back to "seen a", because that `a` could be the start of a new `abb`.

> [!EXAM]
> A full question often says: "Construct the NFA for (a|b)*abb using Thompson's construction, convert it to a DFA, and minimize it." That's 16 marks covering all three problems. Practise this exact example until you can do it in 15 minutes.

## Lex: a tool that builds lexers for you

You write patterns plus actions, and **Lex** (or **Flex**) generates a C program `lex.yy.c` that does RE → NFA → DFA automatically.

```text
  lex.l ──► [ Lex compiler ] ──► lex.yy.c ──► [ C compiler ] ──► a.out
                                                     input stream ──► a.out ──► tokens
```

A Lex file has three parts separated by `%%`:

```c
%{
#include <stdio.h>          /* 1. declarations: C code + regular definitions */
%}
digit   [0-9]
letter  [a-zA-Z_]
%%
"if"|"else"|"while"|"int"      { printf("KEYWORD: %s\n", yytext); }
{letter}({letter}|{digit})*    { printf("ID: %s\n", yytext); }
{digit}+                       { printf("NUM: %s\n", yytext); }
"<="|">="|"=="|"!="|"<"|">"    { printf("RELOP: %s\n", yytext); }
[ \t\n]+                       ;   /* skip whitespace */
.                              { printf("SYMBOL: %s\n", yytext); }
%%
int yywrap(void) { return 1; }    /* 3. user subroutines */
int main(void)   { yylex(); return 0; }
```

| Name | Meaning |
|---|---|
| `yytext` | the current lexeme |
| `yyleng` | its length |
| `yylex()` | the generated scanner function |
| `yywrap()` | called at end of input; returning 1 means stop |

**Conflict rules in Lex:**
1. Prefer the **longest** match.
2. If two patterns match the same length, prefer the one **listed first**. That's why keywords are written above the identifier rule.

> [!CHECK]
> In the Lex file above, input `while` matches both the keyword rule and the identifier rule with the same length. Which wins, and why?
> **Answer:** The keyword rule wins because it is listed first. Same length means the earlier rule is chosen.

## Unit I in one glance

```text
 RE ──Thompson──► NFA ──subset construction──► DFA ──partitioning──► min DFA
   (describe)        (easy to build)              (fast to run)        (smallest)
```

| Must-know 2-mark points |
|---|
| Token vs lexeme vs pattern (with one example each) |
| Why separate lexical analysis from parsing (simplicity, efficiency, portability) |
| What a sentinel is and why it saves a comparison |
| NFA vs DFA (four differences) |
| ε-closure definition |
| Three parts of a Lex program, and Lex's two conflict rules |

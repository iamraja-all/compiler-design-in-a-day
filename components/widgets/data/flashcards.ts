export interface FlashcardItem {
  id: string;
  unitSlug: string;
  unitTitle: string;
  question: string;
  answer: string;
}

export const ALL_FLASHCARDS: FlashcardItem[] = [
  {
    "id": "00-introduction-q0",
    "unitSlug": "00-introduction",
    "unitTitle": "Introduction: The Big Picture",
    "question": "Which phase would catch the error in `int x = \"hello\" * 3;`, and which would catch `x = = 5;`?",
    "answer": "`\"hello\" * 3` is grammatically fine but meaningless (you can't multiply a string), so the **semantic analyzer** (type checking) catches it. `x = = 5` breaks the grammar, so the **syntax analyzer** catches it."
  },
  {
    "id": "00-introduction-q1",
    "unitSlug": "00-introduction",
    "unitTitle": "Introduction: The Big Picture",
    "question": "Name two jobs of the symbol table.",
    "answer": "It stores each identifier's information (name, type, scope, memory location), and it lets every phase look that information up quickly, for example during type checking and code generation."
  },
  {
    "id": "01-unit-1-q0",
    "unitSlug": "01-unit-1",
    "unitTitle": "Unit I · Lexical Analysis",
    "question": "How many tokens are in `count = count + 10;`?",
    "answer": "6, namely `id(count)` `=` `id(count)` `+` `num(10)` `;`. The spaces are not tokens; the lexer throws them away."
  },
  {
    "id": "01-unit-1-q1",
    "unitSlug": "01-unit-1",
    "unitTitle": "Unit I · Lexical Analysis",
    "question": "Describe in words the strings matched by `(a|b)*abb`.",
    "answer": "Any string of a's and b's that **ends with abb**, for example abb, aabb, babb, ababb."
  },
  {
    "id": "01-unit-1-q2",
    "unitSlug": "01-unit-1",
    "unitTitle": "Unit I · Lexical Analysis",
    "question": "In the table above, why is only E accepting?",
    "answer": "Only E's set contains NFA state 10, the NFA's final state."
  },
  {
    "id": "01-unit-1-q3",
    "unitSlug": "01-unit-1",
    "unitTitle": "Unit I · Lexical Analysis",
    "question": "In the Lex file above, input `while` matches both the keyword rule and the identifier rule with the same length. Which wins, and why?",
    "answer": "The keyword rule wins because it is listed first. Same length means the earlier rule is chosen."
  },
  {
    "id": "02-unit-2-q0",
    "unitSlug": "02-unit-2",
    "unitTitle": "Unit II · Syntax Analysis",
    "question": "How do you prove a grammar is ambiguous?",
    "answer": "Find **one** string that has two different parse trees (or two different leftmost derivations). One example is enough."
  },
  {
    "id": "02-unit-2-q1",
    "unitSlug": "02-unit-2",
    "unitTitle": "Unit II · Syntax Analysis",
    "question": "Remove left recursion from `S → S a | b`.",
    "answer": "`S → b S'` and `S' → a S' | ε`. Here β = b goes first and α = a repeats."
  },
  {
    "id": "02-unit-2-q2",
    "unitSlug": "02-unit-2",
    "unitTitle": "Unit II · Syntax Analysis",
    "question": "Why does M[T', +] contain `T' → ε` and not something else?",
    "answer": "`+` is not in FIRST(T') = {*, ε}, but ε is, and `+` ∈ FOLLOW(T'). So when T' is on top and `+` is next, T' must vanish."
  },
  {
    "id": "02-unit-2-q3",
    "unitSlug": "02-unit-2",
    "unitTitle": "Unit II · Syntax Analysis",
    "question": "In state 2 with `*` as input, why do we shift instead of reducing E → T?",
    "answer": "Reducing E→T happens only on FOLLOW(E) = {+, ), $}. `*` isn't in it, and I2 contains `T → T • * F`, which says shift. That's how precedence (`*` before `+`) comes out of the table."
  },
  {
    "id": "02-unit-2-q4",
    "unitSlug": "02-unit-2",
    "unitTitle": "Unit II · Syntax Analysis",
    "question": "In I0, why do the C-items have lookahead c/d and not $?",
    "answer": "In `[S → • C C, $]` the dot is before the first C, and what follows that C is \"C $\". So the lookaheads are FIRST(C $) = FIRST(C) = {c, d}. A first C is always followed by a second C, never by end of input."
  },
  {
    "id": "03-unit-3-q0",
    "unitSlug": "03-unit-3",
    "unitTitle": "Unit III · SDT & Intermediate Code",
    "question": "Is `A → B C { B.i = C.s }` allowed in an L-attributed SDD?",
    "answer": "No. B's inherited attribute comes from C, its **right** sibling. L-attributed only allows inheriting from the parent or **left** siblings."
  },
  {
    "id": "03-unit-3-q1",
    "unitSlug": "03-unit-3",
    "unitTitle": "Unit III · SDT & Intermediate Code",
    "question": "Under name equivalence, are `next` and `p` the same type in the example above?",
    "answer": "No. `next` has type name `link`, while `p` was declared directly as `↑cell`. Different names mean different types, even though their structure is identical."
  },
  {
    "id": "03-unit-3-q2",
    "unitSlug": "03-unit-3",
    "unitTitle": "Unit III · SDT & Intermediate Code",
    "question": "Write the TAC for `x = (a + b) * (a + b) - c`.",
    "answer": "`t1 = a + b`, `t2 = a + b`, `t3 = t1 * t2`, `t4 = t3 - c`, `x = t4`. An optimizer would later reuse t1 instead of computing t2."
  },
  {
    "id": "03-unit-3-q3",
    "unitSlug": "03-unit-3",
    "unitTitle": "Unit III · SDT & Intermediate Code",
    "question": "In `B1 && M B2`, why is B1.truelist patched to M.instr?",
    "answer": "If B1 is true, the whole AND is still undecided, so control must go to the start of B2 to check it. M.instr is exactly B2's first instruction."
  },
  {
    "id": "04-unit-4-q0",
    "unitSlug": "04-unit-4",
    "unitTitle": "Unit IV · Run-Time & Code Generation",
    "question": "Why can't static allocation support recursion?",
    "answer": "With static allocation each function has exactly **one** fixed memory area for its locals. A recursive call would overwrite the caller's locals, because both calls share the same space."
  },
  {
    "id": "04-unit-4-q1",
    "unitSlug": "04-unit-4",
    "unitTitle": "Unit IV · Run-Time & Code Generation",
    "question": "Why is line 10 a leader in Example B even though nothing jumps to it?",
    "answer": "It comes **immediately after** a conditional jump (line 9). When `j <= 10` is false, control falls through to line 10, so a new block starts there."
  },
  {
    "id": "05-unit-5-q0",
    "unitSlug": "05-unit-5",
    "unitTitle": "Unit V · Code Optimization",
    "question": "In `for (i = 0; i < n; i++) a[i] = b * c + i;`, which part can be moved out of the loop?",
    "answer": "`b * c`. Neither b nor c changes inside the loop, so it is **loop-invariant**. Compute `t = b * c` once before the loop and use `a[i] = t + i`."
  },
  {
    "id": "05-unit-5-q1",
    "unitSlug": "05-unit-5",
    "unitTitle": "Unit V · Code Optimization",
    "question": "When building the DAG for `d = a - d`, why don't we create a new `−` node?",
    "answer": "The node for `a − d0` already exists (it was made for `b = a - d`), and neither `a` nor `d` has changed since. So we just attach the label `d` to that node. That's common subexpression elimination."
  },
  {
    "id": "05-unit-5-q2",
    "unitSlug": "05-unit-5",
    "unitTitle": "Unit V · Code Optimization",
    "question": "Why is \"available expressions\" combined with **intersection** while \"reaching definitions\" uses **union**?",
    "answer": "An expression is *available* only if it was computed on **every** path (all must agree), which means intersection. A definition *reaches* if it arrives along **any** path, which means union."
  }
];

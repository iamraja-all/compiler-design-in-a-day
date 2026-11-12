# Introduction: The Big Picture

## Why do compilers exist?

A computer only understands very simple instructions, like "load this number", "add these two" or "store it there". People want to write readable lines like `x = a + b * 2`.

A **compiler is a translator.** It turns what people write (source code) into what the machine can run (target code), and it does that **once, ahead of time**.

> [!ANALOGY]
> Imagine translating an English recipe for a kitchen robot that only understands tiny commands like "pick up", "pour" and "stir". You would:
> 1. read the letters and group them into **words**,
> 2. check the words form a **proper sentence**,
> 3. understand what the sentence **means**,
> 4. plan **where everything goes** and write the **robot commands**,
> 5. **shorten** the commands so the robot finishes faster.
>
> Those five jobs are exactly the five units of this subject.

### Translator, compiler, interpreter

| Kind | What it does | Everyday picture |
|---|---|---|
| **Translator** | Any program that converts one language to another | Any translator |
| **Compiler** | Translates the *whole* program first, then you run the output | Translating a whole book, then printing it |
| **Interpreter** | Reads and runs the program *line by line*, with no separate output file | A live interpreter at a meeting, sentence by sentence |
| **Assembler** | Turns assembly language into machine code | Dictionary lookup, word for word |
| **Hybrid (Java)** | Compile to bytecode, then the JVM interprets or JIT-compiles it | Translate to a common language, then interpret locally |

| | Compiler | Interpreter |
|---|---|---|
| Speed of running | Fast (already translated) | Slower (translates while running) |
| Error reporting | All errors after the full scan | Stops at the first error line |
| Memory | Needs memory for the output program | No output program |
| Examples | C, C++ | Python, early BASIC |

### The language-processing system

Your C code doesn't go straight to the compiler. It passes through a chain of tools:

```text
 source program (with #include, #define)
        │
   [ Preprocessor ]   expands macros, pastes header files
        │
   [ Compiler ]       → assembly program
        │
   [ Assembler ]      → relocatable machine code (.o)
        │
   [ Linker / Loader ] joins library files (.o, .a) and loads into memory
        │
   target machine code (runs!)
```

> [!EXAM]
> "Explain the language processing system with a neat diagram" is a common 8-mark question. Draw the chain above and write two lines per box.

## The phases of a compiler

```text
                    source program
                          │
          ┌───────────────▼───────────────┐
          │ 1. Lexical Analyzer  (Unit I)  │──┐
          ├───────────────────────────────┤  │
          │ 2. Syntax Analyzer   (Unit II) │  │
          ├───────────────────────────────┤  │
          │ 3. Semantic Analyzer (Unit III)│  │     ┌───────────────┐
          ├───────────────────────────────┤  ├────►│ SYMBOL TABLE  │
          │ 4. Intermediate Code (Unit III)│  │     │ (shared notes)│
          │    Generator                   │  │     └───────────────┘
          ├───────────────────────────────┤  │     ┌───────────────┐
          │ 5. Code Optimizer    (Unit V)  │  ├────►│ ERROR HANDLER │
          ├───────────────────────────────┤  │     └───────────────┘
          │ 6. Code Generator    (Unit IV) │──┘
          └───────────────┬───────────────┘
                          ▼
                    target program
```

- **Front end** (phases 1–4) depends on the *source language*.
- **Back end** (phases 5–6) depends on the *target machine*.
- The **symbol table** is a shared notebook of every name (variable, function), its type, scope and memory location.
- The **error handler** lets every phase report problems and keep going.

> [!KEY]
> Because the front end and back end are split, you can write **one front end per language** and **one back end per machine**, then mix and match them. That's why intermediate code exists.

## One line through all five units

Follow the single line `x = a + b * 2` through the whole compiler. Press **Next** to move it along.

{{widget:pipeline-journey}}

### Unit I: letters become words (Lexical Analysis)

```text
 Characters:  x   =   a   +   b   *   2
 Tokens:     id  =   id  +   id  *  num
             (x)     (a)     (b)    (2)
```
The scanner also writes x, a and b into the symbol table.

### Unit II: grammar check plus a tree (Syntax Analysis)

```text
            =
          /   \
         x     +
             /   \
            a     *
                /   \
               b     2
```
`*` sits deeper, so it's done first. That's how the tree captures BODMAS.

### Unit III: meaning plus baby steps (Semantic Analysis and Intermediate Code)

Type check: are a, b and 2 numbers? Yes. Then the line is split into three-address code:
```text
t1 = b * 2
t2 = a + t1
x  = t2
```

### Unit IV: memory plus machine commands (Run-time and Code Generation)

```text
MOV b, R0     ; put b in register R0
MUL #2, R0    ; R0 = R0 * 2
ADD a, R0     ; R0 = R0 + a
MOV R0, x     ; store result in x
```

### Unit V: make it faster (Optimization)

```text
 BEFORE                 AFTER
 t1 = b * 2     ──►     t1 = b + b     (adding is cheaper than multiplying)
 t2 = a + t1            x  = a + t1    (t2 was not needed)
 x  = t2
```

> [!CHECK]
> Which phase would catch the error in `int x = "hello" * 3;`, and which would catch `x = = 5;`?
> **Answer:** `"hello" * 3` is grammatically fine but meaningless (you can't multiply a string), so the **semantic analyzer** (type checking) catches it. `x = = 5` breaks the grammar, so the **syntax analyzer** catches it.

> [!CHECK]
> Name two jobs of the symbol table.
> **Answer:** It stores each identifier's information (name, type, scope, memory location), and it lets every phase look that information up quickly, for example during type checking and code generation.

## Where the exam marks are

| Unit | Problem type | Frequency |
|---|---|---|
| I | Regular expression → NFA (Thompson) | ⭐⭐⭐ |
| I | NFA → DFA (subset construction) | ⭐⭐⭐ |
| I | Minimize a DFA | ⭐⭐ |
| II | Remove left recursion / left factoring | ⭐⭐⭐ |
| II | FIRST and FOLLOW | ⭐⭐⭐ |
| II | LL(1) table + parse a string | ⭐⭐⭐ |
| II | LR(0) items + SLR table + parse | ⭐⭐⭐ |
| II | CLR / LALR table | ⭐⭐ |
| III | Annotated parse tree (SDD) | ⭐⭐ |
| III | Quadruples, triples, indirect triples | ⭐⭐⭐ |
| III | Backpatching | ⭐⭐ |
| IV | Activation records, storage allocation | ⭐⭐ |
| IV | Basic blocks + flow graph | ⭐⭐⭐ |
| IV | Simple code generator | ⭐⭐ |
| V | DAG of a basic block | ⭐⭐⭐ |
| V | Optimization techniques with examples | ⭐⭐⭐ |
| V | Peephole optimization | ⭐⭐ |
| V | Data-flow analysis (reaching definitions / live variables) | ⭐⭐ |

The stars reflect typical Anna University paper patterns, not official statistics.

## Your one-day study plan

```text
 Hour 1–2   UNIT I    RE → NFA → DFA → Minimize        (one machine, three steps)
 Hour 3–5   UNIT II   FIRST/FOLLOW → LL(1) → SLR → LALR (most marks live here)
 Hour 6     UNIT III  Annotated tree, 3-address code formats, backpatching
 Hour 7     UNIT IV   Activation records, basic blocks, code generator
 Hour 8     UNIT V    DAG + optimization techniques + data flow
 Hour 9–10  REVISION  One problem per ⭐⭐⭐ row + flashcards
```

> [!EXAM]
> Master the ⭐⭐⭐ rows (about 10 problem types) and you've covered most numerical marks. Unit II is the heaviest, so give it three hours.

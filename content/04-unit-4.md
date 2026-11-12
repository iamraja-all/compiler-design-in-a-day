# Unit IV · Run-Time Environment & Code Generation

## The job: what happens when the program actually runs

Up to now, the compiler has only *read* the program. But code runs on a real machine with real memory. Before generating machine code, the compiler must decide:
- **Where** does each variable live in memory?
- What happens in memory when a **function is called** and when it **returns**?
- How are **parameters passed**?

That plan is called the **run-time environment**. Then the **code generator** writes the final instructions.

> [!ANALOGY]
> Think of a hotel. The compiler is the manager planning rooms **before guests arrive**: permanent residents get fixed rooms (static), short-stay guests get rooms on a stack of floors that are freed when they leave (stack), and surprise guests get whatever space is free (heap).

## Source language issues

Questions the language design forces the run-time system to answer:

| Issue | Question |
|---|---|
| **Procedures** | Can functions be recursive? Nested inside each other? |
| **Activations** | Each *call* of a function is an **activation**, with a **lifetime** from call to return |
| **Activation tree** | Shows which call called which: parent = caller, children = callees in order |
| **Control stack** | Holds the activations that are currently alive (a path in the activation tree) |
| **Scope** | Which declaration does a name refer to here? (static/lexical vs dynamic scope) |
| **Binding** | name → storage location (environment) → value (state) |

```text
     environment          state
 name ──────────► location ──────► value
  x                 0x1000          42
```

## Storage organization

```text
 low address  ┌─────────────────────┐
              │        Code         │  fixed size, known at compile time
              ├─────────────────────┤
              │   Static / Global   │  fixed size, known at compile time
              ├─────────────────────┤
              │        Heap         │  grows downward ↓  (malloc / new)
              │          ↓          │
              │                     │
              │     free memory     │
              │                     │
              │          ↑          │
              │        Stack        │  grows upward ↑  (function calls)
 high address └─────────────────────┘
```
Heap and stack grow **toward each other** so that the free space can be used by whichever needs it.

### Activation record (stack frame)

Every function call gets one block of memory on the stack:

```text
 ┌──────────────────────────────┐
 │ Actual parameters            │  values passed by the caller
 ├──────────────────────────────┤
 │ Returned value               │  space for the result
 ├──────────────────────────────┤
 │ Control link (dynamic link)  │  → caller's activation record
 ├──────────────────────────────┤
 │ Access link (static link)    │  → record of the enclosing scope (non-local data)
 ├──────────────────────────────┤
 │ Saved machine status         │  return address, saved registers
 ├──────────────────────────────┤
 │ Local data                   │  local variables
 ├──────────────────────────────┤
 │ Temporaries                  │  t1, t2… from expression evaluation
 └──────────────────────────────┘
```

> [!KEY]
> **Control link** = "who called me" (follows the *run-time* call chain). **Access link** = "where was I defined" (follows the *source-code* nesting). Students mix these up often.

## Storage allocation strategies

| Strategy | Where | When decided | Recursion? | Dynamic data? |
|---|---|---|---|---|
| **Static** | fixed addresses | compile time | ❌ no (one copy of each local) | ❌ no |
| **Stack** | activation records pushed/popped | at each call/return | ✅ yes | ❌ sizes fixed per call |
| **Heap** | any free block | at run time, any order | ✅ yes | ✅ yes (lists, trees, objects) |

**Static allocation** (old FORTRAN): simple and fast, but no recursion, and data structure sizes must be known at compile time.

**Stack allocation** (C, Java methods): call → push record, return → pop record. Locals vanish on return.

**Heap allocation**: memory is allocated and freed in any order, so data can **outlive** the function that created it.

### Calling sequence (who does what)

```text
 CALLER                                   CALLEE
 1. evaluate actual parameters            4. save registers & status
 2. store return address, old top_sp      5. initialize local data
 3. jump to callee                        6. begin execution
                     ── on return ──
 9. caller uses return value              7. place return value
                                          8. restore top_sp & registers, jump to return address
```

Watch the stack grow and shrink during recursion:

{{widget:activation-stack}}

```text
 fact(3) → fact(2) → fact(1)

 Activation tree:           Stack at deepest point:
      main                  ┌──────────────┐
        │                   │ main         │
     fact(3)                ├──────────────┤
        │                   │ fact(3) n=3  │
     fact(2)                ├──────────────┤
        │                   │ fact(2) n=2  │
     fact(1)                ├──────────────┤
                            │ fact(1) n=1  │ ← top
                            └──────────────┘
 Returns: fact(1)=1 → fact(2)=2 → fact(3)=6
```

> [!CHECK]
> Why can't static allocation support recursion?
> **Answer:** With static allocation each function has exactly **one** fixed memory area for its locals. A recursive call would overwrite the caller's locals, because both calls share the same space.

## Parameter passing

| Method | What is passed | Changes visible to caller? |
|---|---|---|
| **Call by value** | a copy of the value | ❌ no |
| **Call by reference** | the address (an alias) | ✅ yes, immediately |
| **Copy-restore** (value-result) | a copy in, and on return the final value is **copied back** | ✅ yes, at return |
| **Call by name** | the argument **text** is substituted (like a macro) and re-evaluated each use | ✅ yes |

Example that shows all four differently:

```c
void f(int x, int y) { x = x + 1; y = y + x; }
main() { int a = 2; f(a, a); print(a); }
```

{{widget:param-passing-lab}}

| Method | Trace | Prints |
|---|---|---|
| Value | x=2, y=2 → x=3 → y=5 (copies thrown away) | **2** |
| Reference | x and y are both `a`: a = 3 → a = 3 + 3 | **6** |
| Copy-restore | x=2, y=2 → x=3, y=5 → copy back x then y: a=3, a=5 | **5** |
| Name | replace x, y by `a`: a = a + 1 → 3; a = a + a → 6 | **6** |

> [!TRAP]
> Copy-restore depends on the **order of copying back**. Always state your assumption (here: left to right, so the last copy wins).

## Symbol tables

The **symbol table** stores everything the compiler knows about each name.

| Field | Example |
|---|---|
| Name | `count` |
| Kind | variable / function / array / type |
| Type | integer |
| Scope / nesting level | 1 (inside `main`) |
| Offset / address | 12 |
| Size | 4 bytes |
| Extra | number of parameters, array dimensions, line declared |

**Operations:** `insert(name, info)`, `lookup(name)`, plus `enterScope()` and `exitScope()`.

| Implementation | Insert | Lookup | Notes |
|---|---|---|---|
| Linear list | O(1) | O(n) | simple, slow for big programs |
| Binary search tree | O(log n) | O(log n) | can become unbalanced |
| **Hash table** | O(1) avg | O(1) avg | **used in practice** |

**Scopes:** keep **one table per scope**, chained to the enclosing scope's table. To look up a name, search the current table, then the parent, and so on outward. This is the "most closely nested" rule.

```text
 global table ◄── main's table ◄── block's table   (search starts here →)
```

## Dynamic storage allocation (heap management)

The **heap manager** handles `malloc`/`free` (or `new`/garbage collection).

| Problem | Meaning |
|---|---|
| **Fragmentation** | free memory is split into small holes, so a big request fails even though total free space is enough |
| **Dangling pointer** | pointer to memory that was already freed |
| **Memory leak** | memory that is no longer reachable but was never freed |

| Placement strategy | Picks |
|---|---|
| First fit | the first hole that is big enough (fast) |
| Best fit | the smallest hole that is big enough (less waste) |
| Next fit | first fit, but starting from where the last search ended |

**Freed neighbours are merged (coalescing)** to reduce fragmentation.

**Garbage collection** (automatic freeing):
- **Reference counting:** each object counts the pointers to it, and is freed at 0. Simple, but can't free **cycles**.
- **Mark-and-sweep:** mark everything reachable from the roots (stack, globals), then sweep away the unmarked objects.
- **Copying collector:** copy live objects into a fresh space, which also compacts them.

## Issues in the design of a code generator

| Issue | What must be decided |
|---|---|
| **Input** | IR form (TAC, trees…), assumed free of errors and type-checked |
| **Target program** | absolute machine code, relocatable code, or assembly |
| **Memory management** | map names to addresses using the symbol table |
| **Instruction selection** | pick good instructions, e.g. `INC a` instead of `MOV a,R0; ADD #1,R0; MOV R0,a` |
| **Register allocation** | which values live in registers (fast but few) |
| **Evaluation order** | some orders need fewer registers |

### The target machine (used in exam problems)

Instructions: `MOV source, dest` · `ADD source, dest` · `SUB source, dest` · `MUL source, dest` (dest = dest op source).

| Mode | Form | Address | Added cost |
|---|---|---|---|
| Absolute | M | M | 1 |
| Register | R | R | 0 |
| Indexed | c(R) | c + contents(R) | 1 |
| Indirect register | *R | contents(R) | 0 |
| Literal | #c | the constant c | 1 |

**Instruction cost = 1 + the added cost of each operand.** For example, `MOV a, R0` costs 1 + 1 + 0 = **2**, and `ADD R1, R0` costs **1**.

## Basic blocks and flow graphs

A **basic block** is a straight run of instructions with **one entry** (the first) and **one exit** (the last). No jumps into the middle and no jumps out of the middle.

> [!RECIPE]
> **Find basic blocks (leaders algorithm)**
> 1. **Leaders** are:
>    a. the **first** instruction;
>    b. any instruction that is the **target** of a jump;
>    c. any instruction **immediately after** a jump (conditional or unconditional).
> 2. Each block = a leader + everything up to (not including) the next leader.
> 3. **Flow graph:** draw an edge B→C if C's first instruction can follow B's last one, either by a jump to C or because C comes right after B and B doesn't end with an unconditional goto.

{{widget:basic-block-finder}}

### Example A: dot product of two arrays

```text
 1) prod = 0                ← leader (first)
 2) i = 1
 3) t1 = 4 * i              ← leader (target of 10)
 4) t2 = a[t1]
 5) t3 = 4 * i
 6) t4 = b[t3]
 7) t5 = t2 * t4
 8) prod = prod + t5
 9) i = i + 1
10) if i <= 20 goto (3)

   ┌───────────┐
   │ B1: 1–2   │
   └─────┬─────┘
         ▼
   ┌───────────┐◄──┐
   │ B2: 3–10  │───┘ (loop back)
   └─────┬─────┘
         ▼
        EXIT
```

### Example B: set a 10×10 matrix to identity (exam level)

```text
 1) i = 1                   ← leader
 2) j = 1                   ← leader (target of 11)
 3) t1 = 10 * i             ← leader (target of 9)
 4) t2 = t1 + j
 5) t3 = 8 * t2
 6) t4 = t3 - 88
 7) a[t4] = 0.0
 8) j = j + 1
 9) if j <= 10 goto (3)
10) i = i + 1               ← leader (after a jump)
11) if i <= 10 goto (2)
12) i = 1                   ← leader (after a jump)
13) t5 = i - 1              ← leader (target of 17)
14) t6 = 88 * t5
15) a[t6] = 1.0
16) i = i + 1
17) if i <= 10 goto (13)
```

| Block | Lines | Successors |
|---|---|---|
| B1 | 1 | B2 |
| B2 | 2 | B3 |
| B3 | 3–9 | B3, B4 |
| B4 | 10–11 | B2, B5 |
| B5 | 12 | B6 |
| B6 | 13–17 | B6, EXIT |

A **loop** in a flow graph is a set of blocks with a single entry (the **header**) where every block can reach the header. Here {B3}, {B2, B3, B4} and {B6} are loops.

> [!CHECK]
> Why is line 10 a leader in Example B even though nothing jumps to it?
> **Answer:** It comes **immediately after** a conditional jump (line 9). When `j <= 10` is false, control falls through to line 10, so a new block starts there.

## Design of a simple code generator

The generator walks through a basic block, one TAC instruction at a time, keeping two notebooks:
- **Register descriptor:** what each register currently holds.
- **Address descriptor:** where the current value of each variable can be found (register, memory or both).

> [!RECIPE]
> **For each instruction x = y op z**
> 1. Call **getReg** to choose a register L for x:
>    a. if y is already in a register that holds nothing else needed later, use it;
>    b. else use an empty register;
>    c. else spill some register (store its value to memory) and reuse it.
> 2. If y isn't already in L, emit `MOV y, L`.
> 3. Emit `OP z, L` (use z's register if it's in one).
> 4. Update the descriptors: L now holds x, and x is in L.
> 5. At the end of the block, store variables that are **live** (needed later) back to memory.

Example: `d = (a - b) + (a - c) + (a - c)` with TAC `t = a - b`, `u = a - c`, `v = t + u`, `d = v + u`, and registers R0 and R1:

{{widget:codegen-stepper}}

| TAC | Code | Register descriptor | Address descriptor | Cost |
|---|---|---|---|---|
| t = a − b | MOV a, R0 ; SUB b, R0 | R0: t | t in R0 | 2 + 2 |
| u = a − c | MOV a, R1 ; SUB c, R1 | R0: t, R1: u | t in R0, u in R1 | 2 + 2 |
| v = t + u | ADD R1, R0 | R0: v, R1: u | v in R0, u in R1 | 1 |
| d = v + u | ADD R1, R0 | R0: d | d in R0 | 1 |
| end of block | MOV R0, d | | d in R0 and memory | 2 |
| | | | **Total cost** | **12** |

## Optimal code generation for expressions

How many registers does an expression tree need, at minimum? The **Ershov number** (labelling algorithm) tells us.

> [!RECIPE]
> **Label the tree (bottom-up)**
> 1. Every **leaf** gets label **1**.
> 2. A node with **one child** gets the child's label.
> 3. A node with two children labelled L and R gets:
>    - **max(L, R)** if L ≠ R
>    - **L + 1** if L = R
> 4. The root's label is the number of registers needed. Generate code for the **child with the bigger label first**.

{{widget:ershov-labeler}}

```text
 (a - b) + e * (c + d)

              + [3]
            /       \
        − [2]        * [2]
        /   \       /    \
     a[1]  b[1]  e[1]   + [2]
                        /   \
                     c[1]   d[1]
```
The root needs **3 registers**. With only 2 registers, one intermediate result must be stored to memory (spilled).

## Dynamic programming code generation

This is a more general method for machines with complex instructions. For each node of the expression tree, compute the **cheapest cost** of evaluating it using **i registers** (for i = 1, 2, … r), **bottom-up**:

```text
 cost[node][i] = min over all instructions that match this node of
                 ( instruction cost + cost of evaluating the children in the best order with the available registers )
```
1. Compute cost vectors bottom-up (each node has a vector C[0], C[1], …, C[r]; C[0] means "result stored in memory").
2. At the root, pick the minimum cost.
3. Walk back down the tree to emit the chosen instructions.

It's called **dynamic programming** because the optimal solution for a tree is built from optimal solutions for its subtrees.

## Unit IV in one glance

```text
 memory plan (static | stack | heap) + activation records + parameter passing + symbol table
    ──► basic blocks + flow graph ──► code generator (getReg + descriptors) ──► target code
```

| Must-know 2-mark points |
|---|
| Storage organization diagram |
| Fields of an activation record; control link vs access link |
| Static vs stack vs heap allocation |
| Four parameter-passing methods with one example |
| Symbol table: contents and implementations |
| Fragmentation, dangling pointer, garbage collection |
| Issues in code generator design |
| Basic block definition; the three leader rules |
| Register and address descriptors |
| Ershov number rule |

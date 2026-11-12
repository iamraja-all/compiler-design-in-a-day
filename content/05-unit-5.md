# Unit V · Code Optimization

## The job: same result, less work

The code generator produces **correct** code, but often **wasteful** code: the same value is computed twice, work is repeated inside loops, and some lines are never used. The optimizer rewrites the code so it runs **faster** or is **smaller**, without changing what the program does.

> [!ANALOGY]
> You're making 20 sandwiches. A naive plan takes the butter out of the fridge and puts it back for **every** sandwich. An optimized plan takes it out **once**, before starting (code motion), and stops buttering the sandwich nobody ordered (dead code).

### Three rules every optimization must follow

1. **Preserve meaning.** The output must be exactly the same.
2. **Be worth it.** Speed up the program by a measurable amount.
3. **Be worth the effort.** The compile-time cost must be reasonable.

| Level | Scope |
|---|---|
| **Local** | inside one basic block |
| **Global** | across basic blocks in one function (uses the flow graph) |
| **Peephole** | tiny windows of target code |
| **Machine-independent** | on the IR (most of this unit) |
| **Machine-dependent** | on target code (registers, special instructions) |

## Principal sources of optimization

The classic list. Learn each with its one-line example.

{{widget:optimization-gallery}}

### 1. Common subexpression elimination (CSE)

If an expression was **already computed** and its operands haven't changed since, reuse the old result.
```text
 t1 = 4 * i                     t1 = 4 * i
 t2 = a[t1]           ⇒         t2 = a[t1]
 t3 = 4 * i                     t4 = b[t1]
 t4 = b[t3]
```

### 2. Copy propagation

After `x = y`, use `y` wherever `x` is used (until either changes). This often makes `x = y` itself dead.
```text
 x = y                ⇒         x = y          (now possibly dead)
 z = x + 1                      z = y + 1
```

### 3. Dead code elimination

Remove code whose result is **never used**, or that can **never execute**.
```text
 debug = false                  debug = false
 if (debug) print(x)  ⇒         (removed: condition is always false)
```

### 4. Constant folding (and constant propagation)

Compute constant expressions **at compile time**.
```text
 area = 3.14 * 2 * 2  ⇒         area = 12.56
 n = 10; m = n * 2    ⇒         n = 10; m = 20       (propagation, then folding)
```

### 5. Loop optimizations (the biggest wins, since loops run many times)

**a) Code motion:** move **loop-invariant** computations (same value every iteration) outside the loop.
```text
 while (i < n) {                x = y + z;
     x = y + z;       ⇒         while (i < n) {
     a[i] = x * i;                  a[i] = x * i;
     i++;                           i++;
 }                              }
```

**b) Induction variables and strength reduction:** an **induction variable** changes by a fixed amount each iteration (i += 1, so 4*i += 4). **Strength reduction** replaces an expensive operation with a cheaper one (× becomes +).

**c) Induction variable elimination:** if `i` is now used only in the loop test, rewrite the test in terms of the other variable and drop `i`.

### Worked example: dot product loop

```text
 BEFORE                               AFTER
 B1: prod = 0                         B1: prod = 0
     i = 1                                t1 = 4
 B2: t1 = 4 * i                       B2: t2 = a[t1]
     t2 = a[t1]                           t4 = b[t1]
     t3 = 4 * i      ← CSE (= t1)         t5 = t2 * t4
     t4 = b[t3]                           prod = prod + t5
     t5 = t2 * t4                         t1 = t1 + 4      ← strength reduction
     prod = prod + t5                     if t1 <= 80 goto B2  ← i eliminated
     i = i + 1
     if i <= 20 goto B2
 8 instructions in the loop       →   6 instructions, no multiplication
```

> [!RECIPE]
> **"Apply optimization techniques to this code" questions**
> 1. Split into basic blocks and draw the flow graph.
> 2. Inside each block: CSE → copy propagation → constant folding → dead code.
> 3. Find loops: code motion of invariants out to a **preheader** block.
> 4. Find induction variables: strength reduction, then induction variable elimination.
> 5. Show the code **after each technique**, naming it. That's where the marks are.

> [!CHECK]
> In `for (i = 0; i < n; i++) a[i] = b * c + i;`, which part can be moved out of the loop?
> **Answer:** `b * c`. Neither b nor c changes inside the loop, so it is **loop-invariant**. Compute `t = b * c` once before the loop and use `a[i] = t + i`.

## Peephole optimization

Slide a small **window** (2–3 instructions) over the **target code** and replace any wasteful pattern with a better one. Repeat until nothing changes.

{{widget:peephole-lab}}

| Pattern | Before | After |
|---|---|---|
| **Redundant load/store** | `MOV R0, a` / `MOV a, R0` | `MOV R0, a` (a is already in R0) |
| **Unreachable code** | `goto L2` / `x = 1` (no label) | `goto L2` |
| **Flow-of-control** (jump to jump) | `goto L1` … `L1: goto L2` | `goto L2` … `L1: goto L2` |
| **Algebraic simplification** | `x = x + 0`, `x = x * 1` | remove them |
| **Strength reduction** | `x = y * 2`, `x = y ^ 2` | `x = y + y`, `x = y * y` |
| **Machine idioms** | `i = i + 1` | `INC i` |

> [!TRAP]
> For the redundant load, `MOV a, R0` can be removed **only if** it doesn't have a label. If something jumps to it, R0 may not hold `a` on that path.

## Optimization of basic blocks with a DAG

A **DAG for a basic block** shows how each value is computed from initial values. It automatically finds **common subexpressions** and lets you regenerate shorter code.

> [!RECIPE]
> **Build the DAG of a basic block**
> For each statement `x = y op z`:
> 1. Find the node currently labelled y (or create a **leaf** y0 for its initial value). Do the same for z.
> 2. Look for an existing node `op` with exactly those children. If found, **reuse it** (that's a common subexpression). Otherwise create it.
> 3. **Attach the label x** to that node, and **remove x from any other node**.
> For `x = y`: just attach label x to y's node.
> **Regenerate code:** one instruction per interior node, in bottom-up order, assigning to a **live** label. Add copies for other live labels.

{{widget:dag-builder}}

```text
 a = b + c
 b = a - d
 c = b + c
 d = a - d       ← same as b's computation (a - d0)!

  Nodes:  n1 = (+ b0 c0)  labels: a
          n2 = (− n1 d0)  labels: b, d    ← d attached to the existing node
          n3 = (+ n2 c0)  labels: c

               n3 (+) [c]
              /         \
       n2 (−) [b, d]     c0      (c0 is the SAME leaf as below;
         /       \                drawn twice only for space)
   n1 (+) [a]     d0
     /     \
   b0       c0

 Optimized (if b is not live at exit):    If b is live at exit, add:
   a = b + c                                b = d
   d = a - d
   c = d + c
```

**Other uses of the DAG:**
- Find **dead code**: nodes with no live labels and no parents can be deleted.
- Apply **algebraic identities**: `x + 0 = x`, `x * 1 = x`, `x * 2 = x + x`, and commutativity (treat `b + c` and `c + b` as the same node).

> [!CHECK]
> When building the DAG for `d = a - d`, why don't we create a new `−` node?
> **Answer:** The node for `a − d0` already exists (it was made for `b = a - d`), and neither `a` nor `d` has changed since. So we just attach the label `d` to that node. That's common subexpression elimination.

## Global data-flow analysis

Local optimization sees one block. To optimize **across** blocks, the compiler needs facts like "which definitions of x can reach this point?" Data-flow analysis computes those facts for every block, using **equations** over the flow graph.

| Analysis | Question it answers | Direction | Combine at joins | Used for |
|---|---|---|---|---|
| **Reaching definitions** | which assignments `d: x = …` may reach this point unchanged? | forward | union ∪ | constant propagation, detecting undefined use |
| **Live variables** | is x used later before being reassigned? | backward | union ∪ | register allocation, dead code |
| **Available expressions** | has `y op z` already been computed on **every** path here? | forward | intersection ∩ | global CSE |

### Reaching definitions

- **GEN[B]** = definitions made in B that reach B's end.
- **KILL[B]** = definitions elsewhere of the same variables B assigns.

```text
 OUT[B] = GEN[B] ∪ ( IN[B] − KILL[B] )
 IN[B]  = ∪ OUT[P]   over all predecessors P of B
```

> [!RECIPE]
> **Iterative solution**
> 1. List definitions d1, d2, … and compute GEN and KILL for each block (as bit vectors).
> 2. Set all OUT[B] = ∅.
> 3. Repeat: for each block in order, IN = union of predecessors' OUT; OUT = GEN ∪ (IN − KILL).
> 4. Stop when a full pass changes **nothing**.

{{widget:reaching-defs}}

```text
 Edges: ENTRY→B1, B1→B2, B2→B3, B2→B4, B3→B4, B4→B2 (loop), B4→EXIT

 B1: d1: i = m - 1   d2: j = n   d3: a = u1
 B2: d4: i = i + 1   d5: j = j - 1
 B3: d6: a = u2
 B4: d7: i = u3
```

| Block | GEN | KILL |
|---|---|---|
| B1 | 111 0000 | 000 1111 |
| B2 | 000 1100 | 110 0001 |
| B3 | 000 0010 | 001 0000 |
| B4 | 000 0001 | 100 1000 |

| Block | IN (pass 1) | OUT (pass 1) | IN (pass 2) | OUT (pass 2) |
|---|---|---|---|---|
| B1 | 000 0000 | 111 0000 | 000 0000 | 111 0000 |
| B2 | 111 0000 | 001 1100 | 111 0111 | 001 1110 |
| B3 | 001 1100 | 000 1110 | 001 1110 | 000 1110 |
| B4 | 001 1110 | 001 0111 | 001 1110 | 001 0111 |

Pass 3 changes nothing, so the solution is final. (Bits are d1…d7, read left to right.)

### Live variables

- **USE[B]** = variables used in B **before** any assignment to them in B.
- **DEF[B]** = variables assigned in B (before any use in B).

```text
 IN[B]  = USE[B] ∪ ( OUT[B] − DEF[B] )
 OUT[B] = ∪ IN[S]   over all successors S of B
```
It runs **backward**: start with IN = ∅ and process blocks from last to first.

> [!KEY]
> Forward problems (reaching definitions, available expressions) look at **predecessors**. Backward problems (live variables) look at **successors**. Remember this, and you can write any data-flow equation yourself.

## Efficient data-flow algorithms

- The iterative algorithm always **terminates**: sets only grow (or only shrink), and there are finitely many definitions.
- **Visit order matters.** For forward problems, process blocks in **depth-first (reverse postorder)** order. Then values flow forward in one pass, and most programs converge in 2–3 passes. Use reverse order for backward problems.
- **Bit vectors** make union, intersection and minus single machine operations (OR, AND, AND-NOT), so the analysis is fast.
- A **worklist** algorithm only reprocesses blocks whose inputs changed.

> [!CHECK]
> Why is "available expressions" combined with **intersection** while "reaching definitions" uses **union**?
> **Answer:** An expression is *available* only if it was computed on **every** path (all must agree), which means intersection. A definition *reaches* if it arrives along **any** path, which means union.

## Recent trends in compiler design

| Trend | In one line |
|---|---|
| **LLVM and SSA-based IR** | a shared modular back end (Clang, Rust, Swift) where each variable is assigned once, which makes optimizations simpler |
| **Just-In-Time (JIT) compilation** | compile at run time using real usage data (Java HotSpot, JavaScript V8) |
| **MLIR / multi-level IR** | IRs at several abstraction levels for domain-specific compilers |
| **AI/ML compilers** | compile neural networks for GPUs/TPUs (XLA, TVM, Triton) |
| **ML-guided optimization** | machine learning models decide inlining or register allocation (e.g. LLVM's MLGO) |
| **WebAssembly** | a portable compiled target that runs in browsers at near-native speed |
| **Parallelizing and polyhedral compilers** | automatically turn loops into parallel/vectorized code for multi-core CPUs |
| **Verified compilers** | mathematically proven correct (CompCert) |
| **Incremental and language-server compilers** | recompile only what changed, and power IDE features instantly |

## Unit V in one glance

```text
 local (block, DAG) ──► global (flow graph + data-flow equations) ──► loops (motion, strength, IV)
 ──► peephole on target code
```

| Must-know 2-mark points |
|---|
| Criteria for code-improving transformations |
| CSE, copy propagation, dead code, constant folding (one example each) |
| Code motion, induction variable, strength reduction |
| Six peephole patterns |
| Uses of a DAG for a basic block |
| GEN/KILL and the reaching-definitions equations |
| Live variable equations (backward) |
| Two recent trends in compiler design |

# Unit III · Syntax-Directed Translation & Intermediate Code Generation

## The job: from structure to meaning

After parsing we have a **tree**, but a tree by itself doesn't *do* anything. This unit answers two questions:
1. How do we attach **meaning** (values, types, code) to each part of the tree?
2. How do we turn the tree into **simple, machine-independent steps** (intermediate code)?

> [!ANALOGY]
> A parse tree is a family tree of a sentence. **Syntax-directed translation** gives each family member a small job ("add your children's numbers", "tell your children their type"). When everyone does their job, the meaning of the whole sentence appears at the root.

## Syntax-directed definitions (SDD)

An **SDD** = a grammar + **attributes** attached to symbols + **semantic rules** that compute them.

| Attribute kind | Value comes from | Direction in tree | Example |
|---|---|---|---|
| **Synthesized** | the node's **children** | upward ↑ | `E.val = E1.val + T.val` |
| **Inherited** | the node's **parent or siblings** | downward ↓ / sideways → | `L.inh = T.type` |

### Example: desk calculator (synthesized only)

| Production | Semantic rule |
|---|---|
| L → E **n** | print(E.val) |
| E → E1 + T | E.val = E1.val + T.val |
| E → T | E.val = T.val |
| T → T1 * F | T.val = T1.val × F.val |
| T → F | T.val = F.val |
| F → ( E ) | F.val = E.val |
| F → **digit** | F.val = **digit**.lexval |

An **annotated parse tree** shows the attribute values at each node. For input `3 * 5 + 4 n`:

{{widget:annotated-tree}}

```text
                    L  (prints 19)
                  /   \
         E.val=19       n
        /    |    \
  E.val=15   +    T.val=4
     |              |
  T.val=15        F.val=4
  /   |   \         |
T.val=3 *  F.val=5  digit.lexval=4
  |          |
F.val=3    digit.lexval=5
  |
digit.lexval=3
```

> [!RECIPE]
> **Draw an annotated parse tree**
> 1. Draw the ordinary parse tree for the input.
> 2. Fill leaves first (digit.lexval).
> 3. Move **upward** (post-order: children before parent), applying each node's rule.
> 4. Write each value next to its node, as in `T.val = 15`.

### S-attributed vs L-attributed

| | S-attributed | L-attributed |
|---|---|---|
| Attributes allowed | **only synthesized** | synthesized + inherited from **parent or left siblings only** |
| Evaluation | bottom-up (post-order), fits LR parsers | depth-first left-to-right, fits LL parsers |
| Example | desk calculator | type declarations |

Every S-attributed SDD is also L-attributed.

### Example with an inherited attribute: declarations

Input: `float id1, id2, id3`

| Production | Semantic rule |
|---|---|
| D → T L | L.inh = T.type |
| T → **int** | T.type = integer |
| T → **float** | T.type = float |
| L → L1 , **id** | L1.inh = L.inh ; addType(**id**.entry, L.inh) |
| L → **id** | addType(**id**.entry, L.inh) |

```text
            D
          /   \
  T.type=float  L.inh=float  ──► addType(id3, float)
     |         /   |   \
   float  L.inh=float ,  id3
          /   |   \
  L.inh=float  ,  id2   ──► addType(id2, float)
       |
      id1                ──► addType(id1, float)
```
The type is decided once at T and then **passed down and across** the list. That's an inherited attribute.

### Dependency graph

A **dependency graph** draws an arrow from attribute A to attribute B whenever B's rule uses A. Any **topological order** of this graph is a valid evaluation order. If the graph has a **cycle**, no order works.

> [!CHECK]
> Is `A → B C { B.i = C.s }` allowed in an L-attributed SDD?
> **Answer:** No. B's inherited attribute comes from C, its **right** sibling. L-attributed only allows inheriting from the parent or **left** siblings.

## Construction of syntax trees

A **syntax tree** (abstract syntax tree) is a compressed parse tree: operators become interior nodes, operands become leaves, and chain nodes like E→T→F disappear.

```text
 Parse tree of a - 4 + c                 Syntax tree of a - 4 + c
          E                                       +
       /  |  \                                  /   \
      E   +   T                                -     c
    / | \     |                              /   \
   E  -  T    F                             a     4
   |     |    |
   T     F    c
   |     |
   F    num
   |
   a
```

SDD to build it (each rule creates a node):

| Production | Semantic rule |
|---|---|
| E → E1 + T | E.node = new **Node**('+', E1.node, T.node) |
| E → E1 − T | E.node = new **Node**('−', E1.node, T.node) |
| E → T | E.node = T.node |
| T → ( E ) | T.node = E.node |
| T → **id** | T.node = new **Leaf**(id, id.entry) |
| T → **num** | T.node = new **Leaf**(num, num.val) |

Steps for `a - 4 + c`: p1 = Leaf(id, a); p2 = Leaf(num, 4); p3 = Node('−', p1, p2); p4 = Leaf(id, c); p5 = Node('+', p3, p4).

## Bottom-up evaluation of S-attributed definitions

An LR parser keeps an extra **value stack** next to the state stack. On every **reduce**, it runs the rule using the values on top of the stack.

```text
 E → E1 + T   { val[top-2] = val[top-2] + val[top] ; pop 2 }

   state stack  …  E    +    T        value stack  …  15   _   4
                   ▲top-2    ▲top                          ⇒ 19
```
This is exactly what YACC's `$$ = $1 + $3` does.

## Design of a predictive translator

To turn an L-attributed SDD into code for a top-down parser:
1. Make **one function per non-terminal**, as in recursive descent.
2. **Inherited** attributes become **function parameters**.
3. **Synthesized** attributes become **return values**.
4. Place each semantic action at the matching position in the function body.

```c
// E' → + T E'1   { E'1.inh = E'.inh + T.val ; E'.syn = E'1.syn }
// E' → ε         { E'.syn = E'.inh }
int Eprime(int inh) {
    if (look == '+') { match('+'); int t = T(); return Eprime(inh + t); }
    return inh;       // ε case
}
```

## Type systems and type checking

A **type system** is a set of rules that assigns a type to every part of a program and checks they fit together. A **type checker** implements it.

> [!ANALOGY]
> Types are like plug shapes. A 3-pin plug doesn't fit a 2-pin socket. The type checker stops you from "adding a string to a number" before the program runs.

| | Static checking | Dynamic checking |
|---|---|---|
| When | at **compile** time | at **run** time |
| Example | C: `int x = "hi";` is an error | Python: `"a" + 1` fails while running |

**Strongly typed language:** the compiler guarantees no type errors will occur at run time.

### Type expressions

| Constructor | Type expression | Example declaration |
|---|---|---|
| Basic | `integer`, `float`, `char`, `boolean`, `void`, `type_error` | `int` |
| Array | `array(I, T)` | `int a[10]` → `array(0..9, integer)` |
| Pointer | `pointer(T)` | `int *p` → `pointer(integer)` |
| Product | `T1 × T2` | function arguments |
| Function | `D → R` | `int f(char, int)` → `char × integer → integer` |
| Record | `record((name × T) …)` | `struct` |

### A simple type checker (rules)

| Production | Semantic rule |
|---|---|
| E → **literal** | E.type = char |
| E → **num** | E.type = integer |
| E → **id** | E.type = lookup(id.entry) |
| E → E1 **mod** E2 | E.type = if E1.type = integer and E2.type = integer then integer else type_error |
| E → E1 [ E2 ] | E.type = if E2.type = integer and E1.type = array(s, t) then t else type_error |
| E → E1 ↑ | E.type = if E1.type = pointer(t) then t else type_error |
| S → **id** = E | S.type = if id.type = E.type then void else type_error |
| S → **if** E **then** S1 | S.type = if E.type = boolean then S1.type else type_error |
| S → **while** E **do** S1 | S.type = if E.type = boolean then S1.type else type_error |

### Equivalence of type expressions

| Kind | Two types are equal when… |
|---|---|
| **Structural equivalence** | they are built the **same way** from the same basic types |
| **Name equivalence** | they have the **same type name** (each name is a separate type) |

```text
 type link = ↑cell;
 var next : link;
     last : link;
     p    : ↑cell;
     q, r : ↑cell;
```
- **Name equivalence:** `next` ≡ `last` (both `link`), and `p` ≡ `q` ≡ `r`, but `next` ≢ `p`.
- **Structural equivalence:** all five are equivalent (all are pointer(cell)).

### Type conversions

- **Implicit conversion (coercion):** done automatically by the compiler, usually **widening** (no information lost).
- **Explicit conversion (cast):** written by the programmer, e.g. `(int) 3.7`.

```text
 Widening hierarchy:   double
                         │
                       float
                         │
                       long
                         │
                        int
                       /   \
                   short   char
```
For `x = i + f` (i: int, f: float):
```text
t1 = (float) i
t2 = t1 + f
x  = t2
```

> [!CHECK]
> Under name equivalence, are `next` and `p` the same type in the example above?
> **Answer:** No. `next` has type name `link`, while `p` was declared directly as `↑cell`. Different names mean different types, even though their structure is identical.

## Intermediate languages

Why not go straight to machine code? Because an IR gives you **retargeting** (one front end, many back ends) and a **clean place to optimize**.

```text
  C ─┐                     ┌─► x86
 C++ ─┼─► [ IR ] ─optimize─┼─► ARM
 Java─┘                     └─► RISC-V
```

Three common IR forms:
1. **Syntax tree / DAG**: graphical.
2. **Postfix notation**: `a b c * +` for `a + b * c`.
3. **Three-address code (TAC)**: the exam favourite.

### Syntax tree vs DAG

A **DAG** (directed acyclic graph) is a syntax tree where **identical subexpressions are shared**.

{{widget:dag-vs-tree}}

```text
 a + a * (b - c) + (b - c) * d

 Syntax tree (things repeated):          DAG (shared nodes, numbered):
              +                            n1 = a
            /   \                          n2 = b
           +     *                         n3 = c
          / \   / \                        n4 = n2 - n3        (b - c)   ← used twice
         a   * -   d                       n5 = n1 * n4        a * (b-c)
            / \ / \                        n6 = n1 + n5        a + …     ← a used twice
           a  - b  c                       n7 = d
             / \                           n8 = n4 * n7        (b-c) * d
            b   c                          n9 = n6 + n8        root
```
In the DAG, `a` and `(b - c)` each exist **once** and have two parents. That's why DAGs help find common subexpressions.

## Three-address code

Each instruction has **at most one operator on the right side**, so at most three addresses (two operands plus a result).

| Form | Example |
|---|---|
| Assignment (binary) | `x = y op z` |
| Assignment (unary) | `x = op y` (e.g. `minus`, `!`) |
| Copy | `x = y` |
| Unconditional jump | `goto L` |
| Conditional jump | `if x relop y goto L` / `if x goto L` / `ifFalse x goto L` |
| Procedure call | `param x1` … `param xn` ; `call p, n` ; `y = call p, n` ; `return y` |
| Indexed copy | `x = y[i]` ; `x[i] = y` |
| Address and pointer | `x = &y` ; `x = *y` ; `*x = y` |

### Three ways to store TAC

Expression: `a = b * -c + b * -c`

```text
 t1 = minus c
 t2 = b * t1
 t3 = minus c
 t4 = b * t3
 t5 = t2 + t4
 a  = t5
```

{{widget:tac-formats}}

**Quadruples** (op, arg1, arg2, result):

| # | op | arg1 | arg2 | result |
|---|---|---|---|---|
| 0 | minus | c | | t1 |
| 1 | * | b | t1 | t2 |
| 2 | minus | c | | t3 |
| 3 | * | b | t3 | t4 |
| 4 | + | t2 | t4 | t5 |
| 5 | = | t5 | | a |

**Triples** (no result field; results are referred to by **position** in brackets):

| # | op | arg1 | arg2 |
|---|---|---|---|
| 0 | minus | c | |
| 1 | * | b | (0) |
| 2 | minus | c | |
| 3 | * | b | (2) |
| 4 | + | (1) | (3) |
| 5 | = | a | (4) |

**Indirect triples** (a separate list of pointers to triples):

| Instruction | → Triple |
|---|---|
| 35 | (0) |
| 36 | (1) |
| 37 | (2) |
| 38 | (3) |
| 39 | (4) |
| 40 | (5) |

| | Quadruples | Triples | Indirect triples |
|---|---|---|---|
| Temporaries named? | yes | no (positions) | no |
| Easy to **reorder** (optimizer moves code)? | ✅ yes | ❌ no, positions change | ✅ yes, just reorder the pointer list |
| Space | most | least | medium |

> [!RECIPE]
> **Quadruples/triples exam question**
> 1. Write the TAC first, respecting precedence (unary minus → `*` → `+` → `=`).
> 2. Quadruples: copy each TAC line into op/arg1/arg2/result.
> 3. Triples: drop the result column and replace each temp with the **row number** that made it, e.g. (0).
> 4. Indirect triples: same triples plus a pointer table, usually numbered from 35 or 100.
> 5. For `=` in triples: arg1 = the variable, arg2 = the value's row.

> [!CHECK]
> Write the TAC for `x = (a + b) * (a + b) - c`.
> **Answer:** `t1 = a + b`, `t2 = a + b`, `t3 = t1 * t2`, `t4 = t3 - c`, `x = t4`. An optimizer would later reuse t1 instead of computing t2.

## Types and declarations: computing storage layout

As declarations are processed, the compiler records each name's **type** and **relative address (offset)**.

| Production | Semantic rule |
|---|---|
| P → D | offset = 0 |
| D → T **id** ; D1 | enter(id.lexeme, T.type, offset); offset = offset + T.width |
| T → **int** | T.type = integer; T.width = 4 |
| T → **float** | T.type = float; T.width = 8 |
| T → T1 [ **num** ] | T.type = array(num.val, T1.type); T.width = num.val × T1.width |

Example: `int a; float b; int c[10];`

| Name | Type | Width | Offset |
|---|---|---|---|
| a | integer | 4 | 0 |
| b | float | 8 | 4 |
| c | array(10, integer) | 40 | 12 |
| (total) | | 52 | |

## Translation of expressions

| Production | Semantic rule (emits TAC) |
|---|---|
| S → **id** = E ; | gen(top.get(id.lexeme) '=' E.addr) |
| E → E1 + E2 | E.addr = new Temp(); gen(E.addr '=' E1.addr '+' E2.addr) |
| E → − E1 | E.addr = new Temp(); gen(E.addr '=' 'minus' E1.addr) |
| E → ( E1 ) | E.addr = E1.addr |
| E → **id** | E.addr = top.get(id.lexeme) |

### Array references

For `int a[2][3]` stored **row-major** with w = 4 bytes per int, the address of `a[i][j]` is
`base + (i × 3 + j) × 4` = `base + i × 12 + j × 4`.

```text
x = a[i][j]   ⇒   t1 = i * 12
                  t2 = j * 4
                  t3 = t1 + t2
                  t4 = a[t3]
                  x  = t4
```

### Control flow to TAC

```text
 while (a < b) {                 L1: if a < b goto L2
     if (c < d) x = y + z;           goto Lnext
     else       x = y - z;       L2: if c < d goto L3
 }                                   goto L4
                                 L3: t1 = y + z
                                     x = t1
                                     goto L1
                                 L4: t2 = y - z
                                     x = t2
                                     goto L1
                                 Lnext:
```

## Backpatching

**Problem:** when generating `if a < b goto ___`, we often **don't yet know** the target address, because that code hasn't been generated.

**Idea:** leave the target blank, keep a **list** of all blanks that should go to the same place, and fill them in ("**backpatch**") once the address is known. This works in **one pass**.

> [!ANALOGY]
> Like writing "see page ___" in your notes, keeping a list of every blank that means "the summary page", and filling them all in once you've written that page.

Three helper functions:

| Function | Does |
|---|---|
| `makelist(i)` | new list containing only instruction i |
| `merge(p1, p2)` | joins two lists |
| `backpatch(p, i)` | writes target i into every instruction on list p |

Each boolean expression B has **B.truelist** (jumps to take when true) and **B.falselist** (jumps to take when false). The marker **M → ε** records **M.instr = nextinstr**, the address of the next instruction.

| Production | Semantic actions |
|---|---|
| B → B1 \|\| M B2 | backpatch(B1.falselist, M.instr); B.truelist = merge(B1.truelist, B2.truelist); B.falselist = B2.falselist |
| B → B1 && M B2 | backpatch(B1.truelist, M.instr); B.truelist = B2.truelist; B.falselist = merge(B1.falselist, B2.falselist) |
| B → ! B1 | B.truelist = B1.falselist; B.falselist = B1.truelist |
| B → E1 **rel** E2 | B.truelist = makelist(nextinstr); B.falselist = makelist(nextinstr + 1); emit('if' E1 rel E2 'goto _'); emit('goto _') |
| M → ε | M.instr = nextinstr |

**Why it works:** for `||`, if B1 is **false** we must try B2, so B1's false jumps go to the start of B2 (M.instr). For `&&`, if B1 is **true** we must check B2, so B1's true jumps go to B2.

### Worked example: `a < b || c < d && e < f` (starting at 100)

{{widget:backpatch-stepper}}

```text
 Step 1  a<b   → 100: if a<b goto _   101: goto _      t={100}  f={101}
 Step 2  M1.instr = 102
 Step 3  c<d   → 102: if c<d goto _   103: goto _      t={102}  f={103}
 Step 4  M2.instr = 104
 Step 5  e<f   → 104: if e<f goto _   105: goto _      t={104}  f={105}
 Step 6  &&  (binds tighter): backpatch({102}, 104)
               t={104}   f={103,105}
 Step 7  ||  : backpatch({101}, 102)
               t={100,104}   f={103,105}

 Final:
 100: if a < b goto _       ← true exit
 101: goto 102
 102: if c < d goto 104
 103: goto _                ← false exit
 104: if e < f goto _       ← true exit
 105: goto _                ← false exit
```
The remaining blanks get filled later by the statement that uses B (e.g. the `if` statement's then-part and else-part).

> [!TRAP]
> Remember precedence: **&& binds tighter than ||**. So `a<b || c<d && e<f` means `a<b || (c<d && e<f)`. Do the `&&` patch first.

> [!CHECK]
> In `B1 && M B2`, why is B1.truelist patched to M.instr?
> **Answer:** If B1 is true, the whole AND is still undecided, so control must go to the start of B2 to check it. M.instr is exactly B2's first instruction.

## Unit III in one glance

```text
 parse tree ──(attributes + rules = SDD)──► annotated tree / syntax tree / types checked
            ──(gen TAC)──► quadruples · triples · indirect triples ──(backpatch jumps)──► IR ready
```

| Must-know 2-mark points |
|---|
| Synthesized vs inherited attribute (with example) |
| S-attributed vs L-attributed SDD |
| Annotated parse tree, dependency graph |
| Syntax tree vs DAG |
| Static vs dynamic type checking; strongly typed language |
| Structural vs name equivalence |
| Coercion vs cast; widening |
| Quadruple vs triple vs indirect triple (and their advantages) |
| What backpatching is and the three list functions |

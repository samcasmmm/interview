# ⏱️ Time & Space Complexity Master Guide

> A crystal-clear, exhaustive reference for calculating, reasoning about, and speaking time and space complexity in technical interviews. Designed to make complexity analysis second nature without skipping mathematical foundations or real-world implementation traps.

---

## 📑 Table of Contents

1. [The Core Mental Model](#1-the-core-mental-model)
   - 1.1 What is Big O Notation?
   - 1.2 Time Complexity & Core Classes ($O(1), O(\log n), O(n), O(n^2), O(n^3)$)
   - 1.3 Space Complexity & Memory Scaling
   - 1.4 Operations vs Clock Time (Why Asymptotics Matter)
   - 1.5 Auxiliary Space vs Total Space
   - 1.6 How to Read & Speak Complexities Out Loud
2. [The 4 Golden Rules of Big-O Calculation](#2-the-4-golden-rules-of-big-o-calculation)
   - Rule 1: Worst-Case Guarantee
   - Rule 2: Drop the Constants
   - Rule 3: Drop Non-Dominant Terms
   - Rule 4: Multi-Variable Inputs
3. [Loop Patterns & Iterative Analysis](#3-loop-patterns--iterative-analysis)
   - 3.1 [Sequential Statements — $O(A + B)$](#31-sequential-statements--oa--b)
   - 3.2 [Simple Loops — $O(n)$](#32-simple-loops--on)
   - 3.3 [Nested Loops: Independent vs Dependent — $O(n^2)$](#33-nested-loops-independent-vs-dependent--on2)
   - 3.4 [Logarithmic Loops: Doubling & Halving — $O(\log n)$](#34-logarithmic-loops-doubling--halving--olog-n)
   - 3.5 [Square Root Loops — $O(\sqrt{n})$](#35-square-root-loops--osqrtn)
   - 3.6 [Two-Pointer & Sliding Window Loops — $O(n)$](#36-two-pointer--sliding-window-loops--on)
4. [Recursive Time Complexity & Recursion Trees](#4-recursive-time-complexity--recursion-trees)
   - 4.1 The Recursion Tree Formula
   - 4.2 Linear Recursion ($O(n)$)
   - 4.3 Branching Recursion without Memoization ($O(2^n)$)
   - 4.4 Divide & Conquer (Merge Sort $O(n \log n)$)
   - 4.5 Master Theorem Cheat Sheet
5. [Space Complexity & Memory Internals](#5-space-complexity--memory-internals)
   - 5.1 Stack Memory vs Heap Memory
   - 5.2 Call Stack Depth in Recursion
   - 5.3 In-Place vs Out-of-Place
   - 5.4 Hidden Memory Allocations (Strings, Slices, Pass-by-Value)
6. [Amortized Complexity Analysis Demystified](#6-amortized-complexity-analysis-demystified)
   - 6.1 What is Amortized Complexity?
   - 6.2 The Three Proof Methods (Aggregate, Banker's, Potential)
   - 6.3 Classic Case 1: Dynamic Array Resizing
   - 6.4 Classic Case 2: Queue Implemented via Two Stacks
7. [Hidden Traps & Common Interview Mistakes](#7-hidden-traps--common-interview-mistakes)
   - Trap 1: String Concatenation in Loops ($O(n^2)$)
   - Trap 2: Array Prepending (`shift` / `insert(0)`)
   - Trap 3: Passing Arrays to Recursive Calls
   - Trap 4: Substring & Slicing Operations
   - Trap 5: Hash Map Worst-Case Collision
8. [Practical Code Drills (10 Real-World Interview Snippets)](#8-practical-code-drills)
9. [Interview Self-Check Framework & Constraints Guide](#9-interview-self-check-framework--constraints-guide)

---

## 1. The Core Mental Model

### 1.1 What is Big O Notation?

**Big O notation** describes the complexity (efficiency) of an algorithm using algebraic terms. It has two main characteristics:
1. **Expressed in terms of the input size ($n$)**: As $n$ grows larger, how does the runtime or memory scale?
2. **Focuses on the bigger picture**: It ignores minor details, machine speeds, and less significant terms to reveal the fundamental growth rate.

---

### 1.2 Time Complexity & Core Classes

**Time complexity** is determined by counting **how many times statements execute** based on the input size $n$, rather than measuring absolute clock running time.

- **Constant Time** — $O(1)$:
  - *Read as*: "Big O of one"
  - *Meaning*: Execution time does not change regardless of input size (e.g., a single arithmetic operation, accessing an array element by index).
- **Logarithmic Time** — $O(\log n)$:
  - *Read as*: "Big O of log n"
  - *Meaning*: The problem size is divided by a constant factor (usually cut in half) in every iteration (e.g., Binary Search).
- **Linear Time** — $O(n)$:
  - *Read as*: "Big O of n"
  - *Meaning*: Operations grow directly in proportion to input size (e.g., a single loop over $n$ items).
  - *Simplification rule*: If an algorithm takes $n + 2$ steps, the constant $+2$ is ignored because it becomes insignificant as $n$ grows. Thus, it simplifies to $O(n)$.
- **Quadratic Time** — $O(n^2)$:
  - *Read as*: "Big O of n squared"
  - *Meaning*: Nested loops where every element interacts with every other element.
  - *Simplification rule*: Even if the exact count is $3n^2 + 5n + 1$, we drop the less dominant terms and coefficients and keep only the highest-order term: $O(n^2)$.
- **Cubic Time** — $O(n^3)$:
  - *Read as*: "Big O of n cubed"
  - *Meaning*: Three nested loops (e.g., naive matrix multiplication, all triplets).

---

### 1.3 Space Complexity & Memory Scaling

**Space complexity** measures the extra memory an algorithm needs relative to the input size $n$.

- **Constant Space** — $O(1)$:
  - *Read as*: "Big O of one"
  - *Meaning*: Extra memory does not depend on input size.
  - *Example*: A few tracking pointer variables, in-place array reversing or sorting.
- **Logarithmic Space** — $O(\log n)$:
  - *Read as*: "Big O of log n"
  - *Meaning*: Extra memory grows, but far slower than the input size.
  - *Example*: Recursion call stack of balanced divide-and-conquer algorithms (e.g., MergeSort tree or balanced QuickSort recursion).
- **Linear Space** — $O(n)$:
  - *Read as*: "Big O of n"
  - *Meaning*: Extra memory grows proportionally with input size.
  - *Example*: Allocating a new result array, creating a frequency hash map of all elements.
- **Quadratic Space** — $O(n^2)$:
  - *Read as*: "Big O of n squared"
  - *Meaning*: Allocating a full 2D matrix ($n \times n$) or graph adjacency matrix.
  - > ⚠️ **Interview Note**: Quadratic space complexity ($O(n^2)$) consumes massive RAM for large $n$ (for $n = 10^5$, $n^2$ 4-byte integers = 40 GB) and is generally something to actively optimize or avoid.

---

### 1.4 Operations vs Clock Time (Why Asymptotics Matter)

Why don't we measure algorithm performance in seconds or milliseconds?
- **Hardware differences**: A modern 4.5 GHz CPU runs faster than an old laptop.
- **Operating system load**: Background processes, CPU throttling, and cache misses distort clock benchmarks.
- **Compiler optimizations**: JIT compilers vectorize or unroll loops in unpredictable ways.

Instead, we count the **number of fundamental operations** (comparisons, additions, memory reads/writes) as a function of the input size $n$:

$$T(n) = \text{number of operations executed on an input of size } n$$

Asymptotic analysis focuses on the **rate of growth** as $n \to \infty$.

---

### 1.5 Auxiliary Space vs Total Space

In technical interviews, always distinguish between **Auxiliary Space** and **Total Space Complexity**:

$$\text{Total Space Complexity} = \text{Input Space} + \text{Auxiliary Space}$$

- **Input Space**: The memory needed to store the inputs themselves (e.g., an array of size $n$ takes $O(n)$ space). You rarely control this.
- **Auxiliary Space**: The **extra or temporary memory** allocated by the algorithm to solve the problem (local variables, dynamic heap allocations, recursion call stack frames).

> **Interview Standard**: When interviewers ask *"What is the space complexity?"*, they almost always mean **Auxiliary Space**. If an algorithm sorts an array of size $n$ in-place using two pointer variables, its Auxiliary Space is **$O(1)$**, even though the input array takes $O(n)$ total space.

---

### 1.6 How to Read & Speak Complexities Out Loud

In technical interviews, clear verbal communication is critical. Here is how to pronounce each notation and complexity class:

#### Asymptotic Notations

| Notation | Read Out Loud As | Interview Meaning |
| :--- | :--- | :--- |
| **$O(f(n))$** | **"Big O of $f(n)$"** | Upper bound: worst-case runtime ceiling |
| **$\Omega(f(n))$** | **"Big Omega of $f(n)$"** | Lower bound: best-case runtime floor |
| **$\Theta(f(n))$** | **"Big Theta of $f(n)$"** | Tight bound: grows at exactly this rate |
| **$o(f(n))$** | **"Little o of $f(n)$"** | Strict upper bound (grows strictly slower) |
| **$\omega(f(n))$** | **"Little omega of $f(n)$"** | Strict lower bound (grows strictly faster) |

#### Common Complexity Classes

| Complexity | Read Out Loud As | Common Name | Typical Example |
| :--- | :--- | :--- | :--- |
| **$O(1)$** | **"Big O of one"** | Constant | Hash table lookup, array indexing |
| **$O(\log \log n)$** | **"Big O of log log n"** | Double logarithmic | Interpolation search, Van Emde Boas tree |
| **$O(\log n)$** | **"Big O of log n"** | Logarithmic | Binary search, BST search |
| **$O(\sqrt{n})$** | **"Big O of square root n"** | Square root / Sub-linear | Primality trial division up to $\sqrt{n}$ |
| **$O(n)$** | **"Big O of n"** | Linear | Single pass over array, linear search |
| **$O(n \log n)$** | **"Big O of n log n"** | Linearithmic / Quasilinear | MergeSort, QuickSort (average), HeapSort |
| **$O(n^2)$** | **"Big O of n squared"** | Quadratic | Nested loops, bubble sort, pair comparisons |
| **$O(n^3)$** | **"Big O of n cubed"** | Cubic | Floyd-Warshall, 3 nested loops |
| **$O(2^n)$** | **"Big O of two to the n"** | Exponential | Generating all subsets, naive recursive Fibonacci |
| **$O(n!)$** | **"Big O of n factorial"** | Factorial | Generating all permutations, TSP brute force |
| **$O(n^n)$** | **"Big O of n to the n"** | Hyper-exponential | Enumerating all functions from $n$ to $n$ elements |

---

## 2. The 4 Golden Rules of Big-O Calculation

### Rule 1: Worst-Case Guarantee

Unless explicitly stated otherwise (e.g., "average case of QuickSort"), Big-O describes the **worst-case input scenario**.

```typescript
function findItem(arr: number[], target: number): number {
  for (let i = 0; i < arr.length; i++) {
    if (arr[i] === target) return i;
  }
  return -1;
}
```
- **Best Case ($\Omega(1)$)**: Target is at index `0`.
- **Worst Case ($O(n)$)**: Target is at the very end or absent completely.
- **Report**: $O(n)$.

---

### Rule 2: Drop the Constants

$O(2n) \to O(n)$, $O(500) \to O(1)$, $O(\frac{1}{2} n^2) \to O(n^2)$.

```typescript
function printTwice(arr: number[]): void {
  // Loop 1: n operations
  for (const x of arr) console.log(x);
  // Loop 2: n operations
  for (const x of arr) console.log(x);
}
```
Total operations $= n + n = 2n \implies \mathbf{O(n)}$.

*Why?* For huge values of $n$ (say, $n = 10^9$), whether an algorithm takes $n$ steps or $2n$ steps is negligible compared to an $O(n^2)$ algorithm ($10^{18}$ steps).

---

### Rule 3: Drop Non-Dominant Terms

If a function has multiple additive terms of the same variable, keep only the term with the fastest growth rate:

$$O(n^2 + 100n + 5000) \implies \mathbf{O(n^2)}$$
$$O(n \log n + n) \implies \mathbf{O(n \log n)}$$
$$O(2^n + n^5) \implies \mathbf{O(2^n)}$$

```typescript
function mixedOperations(arr: number[]): void {
  const n = arr.length;

  // Dominant part: O(n^2)
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) {
      console.log(arr[i] + arr[j]);
    }
  }

  // Non-dominant part: O(n)
  for (let i = 0; i < n; i++) {
    console.log(arr[i]);
  }
}
```
Total: $O(n^2 + n) = \mathbf{O(n^2)}$.

---

### Rule 4: Multi-Variable Inputs

When an algorithm takes **multiple independent inputs**, you **cannot** collapse them into a single variable:

```typescript
function processTwoArrays(a: number[], b: number[]): void {
  for (const x of a) console.log(x); // O(a)
  for (const y of b) console.log(y); // O(b)
}
```
- **Time Complexity**: $\mathbf{O(a + b)}$ (or $O(n + m)$).
- **Common Mistake**: Calling this $O(n)$. If array `a` has $10$ items and array `b` has $10^7$ items, assuming they are identical produces incorrect estimates.

If nested:
```typescript
function compareTwoArrays(a: number[], b: number[]): void {
  for (const x of a) {
    for (const y of b) {
      if (x === y) console.log("Match!");
    }
  }
}
```
- **Time Complexity**: $\mathbf{O(a \cdot b)}$ (or $O(n \cdot m)$).

---

## 3. Loop Patterns & Iterative Analysis

### 3.1 Sequential Statements — $O(A + B)$

- **Spoken as**: *"Big O of A plus B"*
- **The Addition Rule**: Consecutive independent code blocks add their execution times:

$$\text{Total Time} = \text{Time}(\text{Block 1}) + \text{Time}(\text{Block 2})$$

```typescript
function sequentialExample(arrA: number[], arrB: number[]): void {
  // Block 1: runs A times -> O(A)
  for (let i = 0; i < arrA.length; i++) {
    console.log(arrA[i]);
  }

  // Block 2: runs B times -> O(B)
  for (let j = 0; j < arrB.length; j++) {
    console.log(arrB[j]);
  }
}
```

- **Key Takeaways**:
  - If inputs are independent ($A$ and $B$), the runtime is **$O(A + B)$**. You *cannot* collapse this to $O(n)$ unless $A = B$.
  - If both sequential loops iterate over the **same array of size $n$**, the runtime is $O(n) + O(n) = O(2n) \implies \mathbf{O(n)}$ (constants drop).

---

### 3.2 Simple Loops — $O(n)$

- **Spoken as**: *"Big O of n"*
- **The Linear Step Rule**: Any loop that increases or decreases its counter by a constant step $c$ runs in $O(n)$ time.

```typescript
// Increment by 1: runs n times -> O(n)
for (let i = 0; i < n; i++) { /* O(1) work */ }

// Increment by 2: runs n / 2 times -> O(n / 2) -> O(n)
for (let i = 0; i < n; i += 2) { /* O(1) work */ }

// Decrement by 1: runs n times -> O(n)
for (let i = n; i > 0; i--) { /* O(1) work */ }
```

- **Key Insight**: Step increments like `i += 2`, `i += 5`, or `i += 100` divide the iteration count by a constant ($n/100$), but Big-O drops constants: $O(n / 100) \implies \mathbf{O(n)}$.

---

### 3.3 Nested Loops: Independent vs Dependent — $O(n^2)$

- **Spoken as**: *"Big O of n squared"*
- **The Multiplication Rule**: When loop 2 is nested inside loop 1, multiply their iteration counts.

#### Case A: Independent Bounds ($n \times n$ or $n \times m$)
The inner loop runs the exact same number of times regardless of the outer loop variable:

```typescript
for (let i = 0; i < n; i++) {       // Runs n times
  for (let j = 0; j < n; j++) {     // Runs n times for EACH i
    console.log(i, j);              // Total executions: n * n = n^2 -> O(n^2)
  }
}
```
*Multi-variable note*: If the outer loop runs $n$ times and inner loop runs $m$ times, total time is **$O(n \cdot m)$**.

#### Case B: Dependent Bounds (Triangular Loops)
The inner loop start or end point depends on the outer loop index `i`:

```typescript
for (let i = 0; i < n; i++) {
  for (let j = i + 1; j < n; j++) {
    // Generates all unique pairs (i, j)
  }
}
```

**Iteration Count Trace**:
- When $i = 0$, inner loop runs $n - 1$ times.
- When $i = 1$, inner loop runs $n - 2$ times.
- When $i = 2$, inner loop runs $n - 3$ times.
- $\dots$
- When $i = n - 2$, inner loop runs $1$ time.
- When $i = n - 1$, inner loop runs $0$ times.

**Mathematical Sum**:

$$\text{Total Steps} = (n - 1) + (n - 2) + \dots + 2 + 1 + 0 = \sum_{k=1}^{n-1} k = \frac{n(n - 1)}{2} = \frac{n^2 - n}{2} \implies \mathbf{O(n^2)}$$

> **Universal Pattern**: Whenever an inner loop shrinks or expands by a constant step ($1, 2, \dots$) relative to outer loop $i$, the total work forms an arithmetic series summing to $\frac{n^2}{2} \implies \mathbf{O(n^2)}$.

---

### 3.4 Logarithmic Loops: Doubling & Halving — $O(\log n)$

- **Spoken as**: *"Big O of log n"*
- **The Halving / Doubling Rule**: Whenever a loop multiplies or divides its variable by a constant factor $c > 1$ each iteration, it runs in logarithmic time.

```typescript
// Halving (Division by 2):
let i = n;
while (i > 1) {
  i = Math.floor(i / 2);
}

// Doubling (Multiplication by 2):
for (let j = 1; j < n; j *= 2) {
  // j takes values: 1, 2, 4, 8, 16, 32, ..., 2^k
}
```

#### Step-by-Step Mathematical Walkthrough
For doubling (`j *= 2`), at iteration $k$, the value of $j$ is $2^k$. The loop terminates when:

$$2^k \ge n \implies k = \log_2 n \implies \mathbf{O(\log n)}$$

| Iteration ($k$) | Value of $j$ | Remaining Distance to $n$ |
| :---: | :---: | :---: |
| 0 | $2^0 = 1$ | $n - 1$ |
| 1 | $2^1 = 2$ | $n - 2$ |
| 2 | $2^2 = 4$ | $n - 4$ |
| 3 | $2^3 = 8$ | $n - 8$ |
| $k$ | $2^k = n$ | $0 \implies k = \log_2 n$ |

> **Does the Logarithm Base Matter in Big-O?**
> **No.** If a loop triples (`j *= 3`), it takes $\log_3 n$ steps. By the logarithmic change of base formula:
> $$\log_3 n = \frac{\log_2 n}{\log_2 3} = \frac{1}{\log_2 3} \cdot \log_2 n \approx 0.63 \cdot \log_2 n$$
> Since $0.63$ is a constant multiplier, it drops in Big-O: $\mathbf{O(\log_3 n) = O(\log_2 n) = O(\log n)}$.

---

### 3.5 Square Root Loops — $O(\sqrt{n})$

- **Spoken as**: *"Big O of square root n"*
- **The Termination Condition Rule**: When loop termination is governed by $i \cdot i \le n$ (or $i \le \sqrt{n}$):

```typescript
function isPrime(n: number): boolean {
  if (n <= 1) return false;
  // Loop condition: i * i <= n is equivalent to i <= Math.sqrt(n)
  for (let i = 2; i * i <= n; i++) {
    if (n % i === 0) return false;
  }
  return true;
}
```

#### Why Does This Run in $O(\sqrt{n})$?
- $i$ starts at $2$ and increments by $1$: $2, 3, 4, 5, \dots$
- The loop stops when $i^2 > n \implies i > \sqrt{n}$.
- Total iterations: $\sqrt{n} - 1 \implies \mathbf{O(\sqrt{n})}$.

#### Why Do Factor / Prime Tests Only Need to Go Up to $\sqrt{n}$?
If a number $n$ has factors $a \times b = n$, both factors cannot simultaneously be greater than $\sqrt{n}$:
- If $a > \sqrt{n}$ and $b > \sqrt{n}$, then $a \times b > \sqrt{n} \times \sqrt{n} = n$ (a mathematical impossibility!).
- Therefore, at least one factor **must be $\le \sqrt{n}$**. If you check all integers up to $\sqrt{n}$ and find no divisors, $n$ is guaranteed prime.

---

### 3.6 Two-Pointer & Sliding Window Loops — $O(n)$

- **Spoken as**: *"Big O of n"*
- **The Amortized Pointer Rule**: A nested `while` loop inside a `for` loop does **not** necessarily mean $O(n^2)$. If inner pointers only move forward and never reset backwards, the overall time is **$O(n)$**.

```typescript
function lengthOfLongestSubstring(s: string): number {
  const seen = new Set<string>();
  let left = 0;
  let maxLen = 0;

  // Outer loop: right pointer sweeps from 0 to n - 1
  for (let right = 0; right < s.length; right++) {
    // Inner while loop: left pointer only moves forward!
    while (seen.has(s[right])) {
      seen.delete(s[left]);
      left++;
    }
    seen.add(s[right]);
    maxLen = Math.max(maxLen, right - left + 1);
  }
  return maxLen;
}
```

```
Visual Pointer Sweep:
String:   [ a , b , c , a , b , c , b , b ]
Indices:    0   1   2   3   4   5   6   7

Step 1: left = 0, right = 0 -> 'a'
Step 2: left = 0, right = 1 -> 'b'
Step 3: left = 0, right = 2 -> 'c'
Step 4: duplicate 'a'! left advances 0 -> 1.
Total movements of `right`: exactly n steps.
Total movements of `left`: at most n steps.
Combined pointer movements: <= 2n steps.
```

#### Why is this $O(n)$ and NOT $O(n^2)$?
1. The `right` pointer increments by 1 in each step of the outer loop $\implies$ exactly $n$ increments.
2. The `left` pointer **never resets back to 0**. It only increments forward $\implies$ at most $n$ total increments across the entire runtime.
3. Every character is added to `seen` at most once and deleted from `seen` at most once.
4. Total operations $= n \text{ (right increments)} + n \text{ (left increments)} = 2n \implies \mathbf{O(n)}$.

---

## 4. Recursive Time Complexity & Recursion Trees

### 4.1 The Recursion Tree Formula

Every recursive algorithm can be visualized as a **Recursion Tree**:

$$\text{Total Time} = \sum_{\text{all levels}} (\text{Number of nodes at level}) \times (\text{Work done per node at level})$$

Key metrics to calculate:
1. **Branching Factor ($b$)**: Number of recursive calls spawned per invocation.
2. **Tree Depth ($d$)**: Number of levels until the base case is reached.
3. **Total Nodes**: $\approx b^d$.
4. **Work per Node**: Auxiliary work done inside the function outside the recursive calls.

```
                  Root (Problem size n)               Level 0: 1 node
                 /                     \
       Subproblem (n/2)            Subproblem (n/2)    Level 1: 2 nodes
         /          \                /          \
     (n/4)          (n/4)        (n/4)          (n/4)  Level 2: 4 nodes
      ...            ...          ...            ...
     Base           Base         Base           Base   Level d: b^d leaves
```

---

### 4.2 Linear Recursion ($O(n)$)

Single recursive call per invocation (Branching factor $b = 1$):

```typescript
function countdown(n: number): void {
  if (n <= 0) return;
  console.log(n);
  countdown(n - 1);
}
```
- **Depth**: $n$ levels.
- **Nodes**: $n$ nodes.
- **Work per node**: $O(1)$.
- **Time Complexity**: $O(n)$.
- **Space Complexity**: $O(n)$ call stack frames!

---

### 4.3 Branching Recursion without Memoization ($O(2^n)$)

Multiple recursive calls per invocation (Branching factor $b = 2$):

```typescript
function naiveFib(n: number): number {
  if (n <= 1) return n;
  return naiveFib(n - 1) + naiveFib(n - 2);
}
```

```
                        fib(4)
                     /          \
              fib(3)              fib(2)
             /      \            /      \
         fib(2)    fib(1)     fib(1)    fib(0)
        /      \
     fib(1)   fib(0)
```

- **Branching Factor**: 2 calls per level.
- **Tree Depth**: $n$.
- **Number of Leaf Nodes**: $\approx 2^n$.
- **Time Complexity**: $\mathbf{O(2^n)}$ (tightly $\Theta(1.618^n)$ based on the Golden Ratio).
- **Space Complexity**: $\mathbf{O(n)}$ (the maximum height of the call stack at any one instant!).

> **Crucial Difference**: Time is proportional to the **total number of nodes** ($2^n$), but Space is proportional to the **maximum depth of the call stack** ($n$).

---

### 4.4 Divide & Conquer: Merge Sort ($O(n \log n)$)

Recurrence relation:

$$T(n) = 2 \cdot T\left(\frac{n}{2}\right) + O(n)$$

Let's compute the work at each level of the tree:
- **Level 0**: 1 node of size $n$, work to merge $= n$.
- **Level 1**: 2 nodes of size $n/2$, work $= 2 \times (n/2) = n$.
- **Level 2**: 4 nodes of size $n/4$, work $= 4 \times (n/4) = n$.
- $\dots$
- **Level $k$**: $2^k$ nodes of size $n/2^k$, work $= 2^k \times (n/2^k) = n$.

Every single level does **exactly $n$ work**!
How many levels are there?

$$\frac{n}{2^k} = 1 \implies k = \log_2 n \text{ levels}$$

$$\text{Total Time} = (\text{Work per level}) \times (\text{Number of levels}) = n \times \log_2 n = \mathbf{O(n \log n)}$$

---

### 4.5 Master Theorem Cheat Sheet

For recurrences of the form $T(n) = a \cdot T(n/b) + \Theta(n^c)$:

1. **If $\log_b a > c$**: Leaves dominate $\implies \mathbf{\Theta(n^{\log_b a})}$.
2. **If $\log_b a == c$**: Work is evenly distributed $\implies \mathbf{\Theta(n^c \log n)}$.
3. **If $\log_b a < c$**: Root dominates $\implies \mathbf{\Theta(n^c)}$.

---

## 5. Space Complexity & Memory Internals

### 5.1 Stack Memory vs Heap Memory

| Memory Region | What Lives Here | Allocation & Deallocation | Speed | Size Limit |
| :--- | :--- | :--- | :--- | :--- |
| **Call Stack** | Function execution frames, primitive local variables, return pointers | Automatic (pushed on function call, popped on return) | Blazing fast | Small (typically 1–8 MB; exceeds $\implies$ Stack Overflow) |
| **Heap Memory** | Dynamically allocated objects, arrays, hash maps, reference types | Managed by Garbage Collector / manual `free` | Slower | Large (bounded only by system RAM) |

---

### 5.2 Call Stack Depth in Recursion

Every time a function calls itself, a new **stack frame** is allocated to store its local variables and return address:

```typescript
function sumUp(n: number): number {
  if (n <= 1) return 1;
  return n + sumUp(n - 1);
}
```
When `sumUp(1000)` executes, there are 1,000 stack frames active simultaneously:

$$\text{Stack Space} = \mathbf{O(n)}$$

If rewritten iteratively:
```typescript
function sumUpIterative(n: number): number {
  let total = 0;
  for (let i = 1; i <= n; i++) total += i;
  return total;
}
```
Only a single stack frame exists:

$$\text{Stack Space} = \mathbf{O(1)}$$

---

### 5.3 In-Place vs Out-of-Place

- **In-Place**: An algorithm that transforms data structures without using extra auxiliary memory proportional to input size (Auxiliary Space is $O(1)$ or $O(\log n)$ for recursive stack frames).
  - *Examples*: In-place QuickSort ($O(\log n)$ stack space), Reversing an array in-place ($O(1)$).
- **Out-of-Place**: An algorithm that creates brand new copies of data structures to produce the answer.
  - *Examples*: MergeSort ($O(n)$ auxiliary array), `arr.map()` or `arr.filter()` ($O(n)$ new array).

---

### 5.4 Hidden Memory Allocations

These operations silently allocate memory behind the scenes:

1. **String Slicing / Substrings**:
   In JavaScript and Python, `s.substring(i, j)` or `s[i:j]` creates a **new copy** of the substring, taking $O(j - i)$ time and memory!
2. **Array Spreading / Slicing**:
   `[...arr]` or `arr.slice()` allocates a new array of size $n \implies O(n)$ space.
3. **Pass-by-Value in Some Languages**:
   Passing large arrays or structs by value (like in C++ without `&`, or Go without pointers) copies the entire memory on every function call!

---

## 6. Amortized Complexity Analysis Demystified

### 6.1 What is Amortized Complexity?

Some operations are cheap most of the time, but occasionally very expensive.
Amortized analysis gives the **average cost per operation in the worst-case sequence**.

```
Cost per push:
Cost
  ^
  |          [Resize to 8]
8 |                |
  |    [Resize 4]  |
4 |        |       |
2 |  [R2]  |       |
1 |   *    *   *   *   *   *   *
  +-----------------------------> Operation #
      1    2   3   4   5   6   7
```

Even though operation #5 cost $O(n)$ time to resize, operations #1, #2, #3, #4, #6, #7 each took only $O(1)$.
Averaged across all operations, the cost per operation is **$O(1)$**.

---

### 6.2 The Three Proof Methods

1. **Aggregate Method**:
   Calculate the total cost of all $n$ operations combined, then divide by $n$:
   $$T_{\text{amortized}} = \frac{T(n)}{n}$$
2. **Accounting (Banker's) Method**:
   Charge artificial "credits" to cheap operations. Save the surplus to pay for future expensive operations. As long as credit balance never goes negative, the charged rate is a valid upper bound.
3. **Potential (Physicist's) Method**:
   Define an energy state $\Phi(\text{data structure})$. High potential means work is stored up; low potential means work was recently consumed.

---

### 6.3 Classic Case 1: Dynamic Array Resizing

Consider a dynamic array starting at capacity 1 that doubles whenever full:

| Insert # | New Element | Resizing Copies | Total Cost for this Insert |
| :---: | :---: | :---: | :---: |
| 1 | 1 | 0 | 1 |
| 2 (doubles to 2) | 1 | 1 | 2 |
| 3 (doubles to 4) | 1 | 2 | 3 |
| 4 | 1 | 0 | 1 |
| 5 (doubles to 8) | 1 | 4 | 5 |
| 6 | 1 | 0 | 1 |
| 7 | 1 | 0 | 1 |
| 8 | 1 | 0 | 1 |

For $N$ total insertions:
- Direct writes $= N$
- Resizing copies $= 1 + 2 + 4 + 8 + \dots + \frac{N}{2} < N$
- **Total Work** $\le N + N = 2N$ operations.
- **Amortized Cost per Push**:

$$\frac{2N}{N} = \mathbf{O(1)}$$

---

### 6.4 Classic Case 2: Queue Implemented via Two Stacks

A classic interview question: Implement a Queue using two Stacks (`inStack` and `outStack`).

```typescript
class MyQueue {
  private inStack: number[] = [];
  private outStack: number[] = [];

  enqueue(val: number): void {
    this.inStack.push(val); // O(1)
  }

  dequeue(): number | undefined {
    // If outStack is empty, dump ALL items from inStack to outStack
    if (this.outStack.length === 0) {
      while (this.inStack.length > 0) {
        this.outStack.push(this.inStack.pop()!);
      }
    }
    return this.outStack.pop(); // O(1)
  }
}
```

- When `outStack` is empty, `dequeue()` takes $O(n)$ to move all elements.
- **Is `dequeue()` $O(n)$?**
  - Worst single call: $O(n)$.
  - **Amortized cost**: Every element is pushed to `inStack` once, popped from `inStack` once, pushed to `outStack` once, and popped from `outStack` once.
  - Exactly **4 operations per element** over its entire lifetime.
  - **Amortized cost per operation**: $\mathbf{O(1)}$.

---

## 7. Hidden Traps & Common Interview Mistakes

### Trap 1: String Concatenation in Loops ($O(n^2)$)

In many languages (JavaScript, Python, Java), **strings are immutable**.

```typescript
// ❌ DANGEROUS: O(n^2) time!
let s = "";
for (let i = 0; i < n; i++) {
  s += "a"; // Creates a BRAND NEW string of length i + 1 each time!
}
```
- Iteration 1 copies 1 char.
- Iteration 2 copies 2 chars.
- $\dots$
- Iteration $n$ copies $n$ chars.
- Total cost: $1 + 2 + 3 + \dots + n = \frac{n(n+1)}{2} \implies \mathbf{O(n^2)}$.

```typescript
// ✅ OPTIMAL: O(n) time
const chars: string[] = [];
for (let i = 0; i < n; i++) {
  chars.push("a");
}
const s = chars.join(""); // Single pass at the end
```

---

### Trap 2: Array Prepending (`shift` / `unshift` / `insert(0)`)

Arrays store elements in contiguous memory:

```typescript
// ❌ O(n) per call!
arr.unshift(val); // Shifts all n existing elements one index to the right
arr.shift();      // Shifts all n elements one index to the left
```

If you call `shift()` inside a loop of size $n$, the overall time is **$O(n^2)$**, not $O(n)$!
- **Fix**: Use a double-ended queue (Deque), linked list, or push to the end and reverse once at the conclusion.

---

### Trap 3: Passing Arrays to Recursive Calls

```typescript
// ❌ Slices create a shallow copy: O(n) time and O(n) space per call!
function helper(arr: number[]): void {
  if (arr.length <= 1) return;
  helper(arr.slice(1)); // Copies n - 1 elements!
}
```
A recursion of depth $n$ copying $n$ elements each time results in **$O(n^2)$ time** and **$O(n^2)$ space**!
- **Fix**: Pass indices `left` and `right` instead of slicing the array:
```typescript
// ✅ O(n) time, O(n) stack space
function helper(arr: number[], index: number): void {
  if (index >= arr.length) return;
  helper(arr, index + 1);
}
```

---

### Trap 4: Substring & Slicing Operations

```typescript
const sub = s.slice(i, j); // Takes O(j - i) time!
```
Never assume substring extraction is $O(1)$. If you slice inside a loop, factor in the substring length.

---

### Trap 5: Hash Map Worst-Case Collision

Hash tables have an **average** lookup and insertion time of $O(1)$.
However, in the **worst case** (hash collisions where all keys map to the same bucket):
- Chaining with linked lists degrades to **$O(n)$**.
- Java 8+ converts buckets with $> 8$ collisions into Red-Black trees, degrading to **$O(\log n)$**.

In interviews, state: *"Hash map operations are $O(1)$ on average, with an $O(n)$ worst-case under adversarial hash collisions."*

---

## 8. Practical Code Drills

### Drill 1: Two Independent Counters
```typescript
function drill1(n: number): void {
  let count = 0;
  for (let i = 0; i < n; i++) count++;
  for (let j = 0; j < n; j++) count++;
}
```
- **Time Complexity**: $O(n + n) = \mathbf{O(n)}$.
- **Space Complexity**: $\mathbf{O(1)}$.

---

### Drill 2: Jumping Multiples
```typescript
function drill2(n: number): void {
  for (let i = 1; i < n; i *= 3) {
    console.log(i);
  }
}
```
- **Time Complexity**: Variable triples each step ($3^k = n \implies k = \log_3 n$) $\implies \mathbf{O(\log n)}$.
- **Space Complexity**: $\mathbf{O(1)}$.

---

### Drill 3: Dependent Inner Loop
```typescript
function drill3(n: number): void {
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < i; j++) {
      console.log(i, j);
    }
  }
}
```
- **Time Complexity**: $0 + 1 + 2 + \dots + (n - 1) = \frac{n(n-1)}{2} \implies \mathbf{O(n^2)}$.
- **Space Complexity**: $\mathbf{O(1)}$.

---

### Drill 4: Geometric Step Outer Loop
```typescript
function drill4(n: number): void {
  for (let i = 1; i <= n; i *= 2) {
    for (let j = 0; j < i; j++) {
      console.log(i, j);
    }
  }
}
```
Notice: The outer loop runs $\log_2 n$ times, but how many total times does the inner loop run?
- When $i = 1$: inner runs 1
- When $i = 2$: inner runs 2
- When $i = 4$: inner runs 4
- $\dots$
- When $i = n$: inner runs $n$

Total sum:

$$1 + 2 + 4 + 8 + \dots + n = 2n - 1 \implies \mathbf{O(n)}$$

*Insight*: Do not blindly multiply loop bounds! Even though there are nested loops, total operations sum to $2n \to \mathbf{O(n)}$.

---

### Drill 5: Binary Search on Matrix
```typescript
function searchMatrix(matrix: number[][], target: number): boolean {
  const rows = matrix.length;
  const cols = matrix[0].length;
  let low = 0;
  let high = rows * cols - 1;

  while (low <= high) {
    const mid = low + Math.floor((high - low) / 2);
    const val = matrix[Math.floor(mid / cols)][mid % cols];
    if (val === target) return true;
    if (val < target) low = mid + 1;
    else high = mid - 1;
  }
  return false;
}
```
- Total elements $= R \times C$.
- Binary search halves the space each step:
- **Time Complexity**: $\mathbf{O(\log(R \cdot C))} = \mathbf{O(\log R + \log C)}$.
- **Space Complexity**: $\mathbf{O(1)}$.

---

### Drill 6: Recursive Tree with Halving
```typescript
function drill6(n: number): void {
  if (n <= 1) return;
  drill6(Math.floor(n / 2));
  drill6(Math.floor(n / 2));
}
```
- Recurrence: $T(n) = 2T(n/2) + O(1)$.
- Master Theorem: $a = 2, b = 2, c = 0$. $\log_2 2 = 1 > 0 \implies \mathbf{O(n^1)} = \mathbf{O(n)}$.
- Alternatively, count nodes: $1 + 2 + 4 + \dots + n \approx 2n \implies \mathbf{O(n)}$.
- **Space Complexity**: Maximum call stack depth $= \log_2 n \implies \mathbf{O(\log n)}$.

---

### Drill 7: Array Deduplication with Hash Set
```typescript
function removeDuplicates(nums: number[]): number[] {
  const seen = new Set<number>();
  const result: number[] = [];

  for (const x of nums) {
    if (!seen.has(x)) {
      seen.add(x);
      result.push(x);
    }
  }
  return result;
}
```
- Loop runs $n$ times; Set `has` and `add` are $O(1)$ average.
- **Time Complexity**: $\mathbf{O(n)}$.
- **Auxiliary Space**: Set and result array hold at most $n$ elements $\implies \mathbf{O(n)}$.

---

### Drill 8: Depth-First Search on a Graph
```typescript
function dfs(node: number, adj: number[][], visited: boolean[]): void {
  visited[node] = true;
  for (const neighbor of adj[node]) {
    if (!visited[neighbor]) {
      dfs(neighbor, adj, visited);
    }
  }
}
```
- Every vertex is visited at most once: $O(V)$.
- Every edge is traversed at most twice (undirected) or once (directed): $O(E)$.
- **Time Complexity**: $\mathbf{O(V + E)}$.
- **Space Complexity**: Visited array takes $O(V)$ and call stack can reach depth $O(V)$ in a line graph $\implies \mathbf{O(V)}$.

---

### Drill 9: Permutations Generation (Backtracking)
```typescript
function permute(nums: number[]): number[][] {
  const res: number[][] = [];

  function backtrack(curr: number[], used: boolean[]): void {
    if (curr.length === nums.length) {
      res.push([...curr]); // O(n) copy!
      return;
    }
    for (let i = 0; i < nums.length; i++) {
      if (used[i]) continue;
      used[i] = true;
      curr.push(nums[i]);
      backtrack(curr, used);
      curr.pop();
      used[i] = false;
    }
  }

  backtrack([], new Array(nums.length).fill(false));
  return res;
}
```
- Number of leaves in tree $= n!$.
- Copying `[...curr]` at each leaf takes $O(n)$.
- **Time Complexity**: $\mathbf{O(n \cdot n!)}$.
- **Space Complexity**: Recursion depth is $n \implies \mathbf{O(n)}$ auxiliary stack space (excluding output space).

---

### Drill 10: Fibonacci with Memoization
```typescript
function memoFib(n: number, memo = new Map<number, number>()): number {
  if (n <= 1) return n;
  if (memo.has(n)) return memo.get(n)!;

  const result = memoFib(n - 1, memo) + memoFib(n - 2, memo);
  memo.set(n, result);
  return result;
}
```
- Each state from $0$ to $n$ is computed **exactly once**.
- Once computed, subsequent calls return in $O(1)$.
- **Time Complexity**: Reduced from $O(2^n)$ down to $\mathbf{O(n)}$!
- **Space Complexity**: Map stores $n$ entries + recursion depth is $n \implies \mathbf{O(n)}$.

---

## 9. Interview Self-Check Framework & Constraints Guide

### 9.1 The 3-Step Interview Formula

When asked for complexity at the end of an interview problem, follow this structured template:

1. **State the Result Clearly**:
   > *"The overall time complexity is **Big O of N log N**, and the auxiliary space complexity is **Big O of N**."*
2. **Define Every Variable**:
   > *"Here, $N$ represents the number of elements in the input array, and $M$ is the length of the query string."*
3. **Justify Step-by-Step**:
   > *"The sorting step takes $O(N \log N)$ time. Then we do a linear scan of size $N$ with constant-time hash set lookups, taking $O(N)$ time. Since $N \log N$ dominates $N$, the overall runtime is $O(N \log N)$. For space, our hash set stores at most $N$ unique elements, giving $O(N)$ auxiliary space."*

---

### 9.2 The "Rule of $10^8$" (Hardware Reality)

In modern competitive programming and interview online assessments (LeetCode, HackerRank, Codeforces):

$$\text{A standard judge executes roughly } \mathbf{10^8 \text{ operations per second}}.$$

Use this rule to determine the target time complexity based on input constraints:

| Input Constraint $N$ | Target Time Complexity | Acceptable Algorithms |
| :--- | :--- | :--- |
| **$N \le 10$** | $O(N!)$ or $O(N^2 \cdot 2^N)$ | Exhaustive search, Travelling Salesperson, Bitmask DP |
| **$N \le 20$** | $O(2^N)$ | Backtracking, Generating all subsets, Meet-in-the-middle |
| **$N \le 100$** | $O(N^4)$ or $O(N^3)$ | Floyd-Warshall all-pairs shortest paths, 3D Dynamic Programming |
| **$N \le 1,000$** | $O(N^2)$ | 2D Dynamic Programming, nested loops, bubble/insertion sort |
| **$N \le 10^5$** | $O(N \log N)$ or $O(N \sqrt{N})$ | MergeSort, QuickSort, Binary Search, Heap, Segment Tree |
| **$N \le 10^6$ to $10^7$** | $O(N)$ | Two Pointers, Sliding Window, Prefix Sums, Hash Tables, BFS/DFS |
| **$N \ge 10^9$** | $O(\log N)$ or $O(1)$ | Binary Search on Answer Space, Fast Exponentiation, Math formula |

> **Pro Tip**: If the problem statement says $N \le 10^5$, an $O(N^2)$ solution will **Time Out (TLE)** because $10^{10} \gg 10^8$. You must aim for $O(N \log N)$ or $O(N)$.

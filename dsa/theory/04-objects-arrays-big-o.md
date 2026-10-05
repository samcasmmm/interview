# 📦 Objects & Arrays Big-O Master Guide

> A clear, intuitive, and exhaustive technical guide to the time and space complexity, memory mechanics, and performance trade-offs of Objects (Hash Maps) and Arrays (Lists) for technical interviews.

---

> 💡 **Related Guides**:
> - Complexity foundations & spoken pronunciations: [**02-time-space-complexity.md**](./02-time-space-complexity.md)
> - General data structure internals (Trees, Heaps, Lists): [**03-data-structures.md**](./03-data-structures.md)
> - Algorithmic paradigms & search/sort mechanics: [**01-algorithm.md**](./01-algorithm.md)

---

## 📑 Table of Contents

1. [The Two Workhorses: Array vs Object Mental Model](#1-the-two-workhorses-array-vs-object-mental-model)
2. [Objects (Hash Maps / Dictionaries) Big-O](#2-objects-hash-maps--dictionaries-big-o)
   - 2.1 [Operations Complexity Matrix](#21-operations-complexity-matrix)
   - 2.2 [Why Object Key Access is O(1)](#22-why-object-key-access-is-o1)
   - 2.3 [Object Built-in Methods Big-O](#23-object-built-in-methods-big-o)
   - 2.4 [Plain Object `{}` vs `Map` in Modern JavaScript](#24-plain-object--vs-map-in-modern-javascript)
3. [Arrays (Dynamic Arrays / Lists) Big-O](#3-arrays-dynamic-arrays--lists-big-o)
   - 3.1 [Operations Complexity Matrix](#31-operations-complexity-matrix)
   - 3.2 [Why Index Access is O(1)](#32-why-index-access-is-o1)
   - 3.3 [The End vs The Front: Append vs Prepend](#33-the-end-vs-the-front-append-vs-prepend)
4. [Master Built-in Array Methods Reference](#4-master-built-in-array-methods-reference)
   - 4.1 [O(1) Constant Time Methods](#41-o1-constant-time-methods)
   - 4.2 [O(n) Linear Time Methods](#42-on-linear-time-methods)
   - 4.3 [O(n log n) & Higher Complexity Methods](#43-on-log-n--higher-complexity-methods)
5. [Memory Layout & Hardware Efficiency](#5-memory-layout--hardware-efficiency)
   - 5.1 [CPU Cache Locality: Array vs Object](#51-cpu-cache-locality-array-vs-object)
   - 5.2 [Dense vs Sparse (Holey) Arrays](#52-dense-vs-sparse-holey-arrays)
6. [Top Interview Traps & Anti-Patterns](#6-top-interview-traps--anti-patterns)
   - 6.1 [Trap 1: Array `shift()` / `unshift()` in Loops (O(n²) Trap)](#61-trap-1-array-shift--unshift-in-loops-on-trap)
   - 6.2 [Trap 2: `indexOf()` / `includes()` in Loops (O(n²) Trap)](#62-trap-2-indexof--includes-in-loops-on-trap)
   - 6.3 [Trap 3: Hidden Memory from `slice()` and Spreading `[...arr]`](#63-trap-3-hidden-memory-from-slice-and-spreading-arr)
   - 6.4 [Trap 4: In-Place vs New Array Mutation](#64-trap-4-in-place-vs-new-array-mutation)
7. [Decision Matrix: Array vs Object vs Map vs Set](#7-decision-matrix-array-vs-object-vs-map-vs-set)

---

## 1. The Two Workhorses: Array vs Object Mental Model

In programming and technical interviews, virtually every problem revolves around choosing between:

| Dimension | **Array (List / Vector)** | **Object (Hash Map / Dictionary)** |
| :--- | :--- | :--- |
| **Data Organization** | **Ordered sequence** indexed by sequential integers ($0, 1, 2, \dots$) | **Unordered key-value pairs** indexed by unique keys |
| **Primary Strength** | Fast positional indexing `arr[i]`, order preservation | Instant key lookup `obj[key]`, fast membership checks |
| **Primary Weakness** | Slow insertions/deletions at front or middle ($O(n)$ shifts) | No guaranteed index ordering, memory overhead per key |
| **When to Use** | When order matters, duplicate elements allowed, sorting needed | When fast key lookup, deduplication, or frequency counting needed |

---

## 2. Objects (Hash Maps / Dictionaries) Big-O

An Object (or Hash Table / Dictionary) stores data as key-value pairs using a **hash function** that converts keys into memory bucket indices.

### 2.1 Operations Complexity Matrix

| Operation | Spoken As | Average Time | Worst Time | Space Overhead | Notes |
| :--- | :--- | :---: | :---: | :---: | :--- |
| **Insertion** (`obj[key] = val`) | *"Big O of one"* | **$O(1)$** | $O(n)$ | $O(1)$ | Worst-case occurs only during severe hash collisions or table resizing |
| **Deletion** (`delete obj[key]`) | *"Big O of one"* | **$O(1)$** | $O(n)$ | $O(1)$ | Reclaims slot; leaving tombstone in open addressing |
| **Access by Key** (`obj[key]`) | *"Big O of one"* | **$O(1)$** | $O(n)$ | $O(1)$ | Hashes key, jumps directly to bucket index |
| **Key Check** (`key in obj` / `map.has(key)`) | *"Big O of one"* | **$O(1)$** | $O(n)$ | $O(1)$ | Verifies if bucket contains the key |
| **Search by Value** | *"Big O of n"* | **$O(n)$** | $O(n)$ | $O(1)$ | Must scan all entries because values are unindexed |

---

### 2.2 Why Object Key Access is $O(1)$

Unlike an array where searching for a value requires checking element by element ($O(n)$), an object accesses a key in **constant time $O(1)$**:

```
Key: "user_42"
       |
       v
[ Hash Function ] ---> Computes integer: 8392104
       |
       v
[ Modulo Bucket Size (% 8) ] ---> Index 0
       |
       v
Direct Memory Jump to Bucket 0! (Takes ~1 CPU cycle)
```

No matter whether the object contains $10$ keys or $10,000,000$ keys, hashing the string `"user_42"` and jumping to the bucket index takes the exact same number of operations: **$O(1)$**.

---

### 2.3 Object Built-in Methods Big-O

In modern languages, inspecting an object's keys, values, or entries requires visiting every single property:

| Method | Spoken As | Time Complexity | Auxiliary Space | Explanation |
| :--- | :--- | :---: | :---: | :--- |
| `Object.keys(obj)` | *"Big O of n"* | **$O(n)$** | $O(n)$ | Iterates all keys, allocates and returns an array of size $n$ |
| `Object.values(obj)` | *"Big O of n"* | **$O(n)$** | $O(n)$ | Iterates all entries, allocates and returns array of values |
| `Object.entries(obj)` | *"Big O of n"* | **$O(n)$** | $O(n)$ | Allocates an array of $[key, value]$ 2-element tuples |
| `hasOwnProperty(key)` | *"Big O of one"* | **$O(1)$** | $O(1)$ | Checks key presence directly on instance without prototype scan |

> **Interview Trap**: Calling `Object.keys(obj).includes(key)` is **$O(n)$**! Use `key in obj`, `obj.hasOwnProperty(key)`, or `map.has(key)` for **$O(1)$**.

---

### 2.4 Plain Object `{}` vs `Map` in Modern JavaScript

| Feature | Plain Object `{}` | `Map` | Interview Recommendation |
| :--- | :--- | :--- | :--- |
| **Key Types** | Strings and Symbols only | **Any type** (objects, functions, numbers) | Use `Map` if keys are not strings |
| **Key Ordering** | Mostly arbitrary / integer-sorted | **Strict insertion order** | Use `Map` if order of keys matters (e.g., LRU Cache) |
| **Size Tracking** | Manual (`Object.keys(obj).length` $\to O(n)$) | `map.size` $\to \mathbf{O(1)}$ instant | Use `Map` if you frequently check collection size |
| **Prototype Chain** | Inherits `Object.prototype` (has default keys like `toString`) | Clean; contains only explicitly inserted keys | Use `Map` for arbitrary user-provided input |
| **Performance** | Optimized for small static property sets | Optimized for **frequent additions and removals** | Use `Map` for heavy dynamic caching |

---

## 3. Arrays (Dynamic Arrays / Lists) Big-O

An Array stores elements in a contiguous block of memory with zero-based sequential integer indices ($0, 1, 2, \dots, n-1$).

### 3.1 Operations Complexity Matrix

| Operation | Spoken As | Time Complexity | Auxiliary Space | Why? |
| :--- | :--- | :---: | :---: | :--- |
| **Access by Index** (`arr[i]`) | *"Big O of one"* | **$O(1)$** | $O(1)$ | Direct pointer arithmetic calculation |
| **Write by Index** (`arr[i] = val`) | *"Big O of one"* | **$O(1)$** | $O(1)$ | Direct memory overwrite |
| **Append to End** (`push`) | *"Big O of one amortized"* | **$O(1)$** amortized | $O(1)$ | Adds to next empty capacity slot; resizes occasionally |
| **Remove from End** (`pop`) | *"Big O of one"* | **$O(1)$** | $O(1)$ | Decrements array length counter; zero shifts |
| **Prepend to Front** (`unshift`) | *"Big O of n"* | **$O(n)$** | $O(1)$ | Must shift all $n$ existing elements one index right |
| **Remove from Front** (`shift`) | *"Big O of n"* | **$O(n)$** | $O(1)$ | Must shift all $n - 1$ remaining elements one index left |
| **Insert / Delete at Index $k$** | *"Big O of n"* | **$O(n)$** | $O(1)$ | Must shift $n - k$ elements |
| **Linear Search** (`indexOf`, `find`) | *"Big O of n"* | **$O(n)$** | $O(1)$ | Worst case scans up to end of array |

---

### 3.2 Why Index Access is $O(1)$

Arrays achieve $O(1)$ index access because they are allocated as a **contiguous block in RAM**:

$$\text{Memory Address of } arr[i] = \text{Base Address} + (i \times \text{Size of One Element})$$

```
Base Address = 1000, Size of Integer = 4 bytes
arr[0] = 1000 + (0 * 4) = Address 1000
arr[1] = 1000 + (1 * 4) = Address 1004
arr[2] = 1000 + (2 * 4) = Address 1008
arr[500] = 1000 + (500 * 4) = Address 3000
```

The CPU computes this single multiplication and addition in **1 clock cycle**, jumping instantly to `arr[500]` without looking at indices $0$ through $499$.

---

### 3.3 The End vs The Front: Append vs Prepend

Understanding this difference is critical for passing algorithmic coding interviews:

```
Array: [ 10 , 20 , 30 , 40 , _ ]  (Capacity = 5, Length = 4)

1. PUSH (Append to End): O(1)
   Write 50 at index 4:
   [ 10 , 20 , 30 , 40 , 50 ]  --> Done instantly! No elements moved.

2. UNSHIFT (Prepend to Front): O(n)
   To insert 99 at index 0, every existing element MUST move right:
   40 moves to index 4
   30 moves to index 3
   20 moves to index 2
   10 moves to index 1
   [ 99 , 10 , 20 , 30 , 40 ]  --> n shift operations required!
```

> **Interview Golden Rule**: Operations at the **end** of an array are **$O(1)$**; operations at the **front** or **middle** are **$O(n)$**.

---

## 4. Master Built-in Array Methods Reference

### 4.1 $O(1)$ Constant Time Methods

| Method | Modifies Original? | Time Complexity | Explanation |
| :--- | :---: | :---: | :--- |
| `arr.push(val)` | ✅ Yes | **$O(1)$** amortized | Appends to end of array |
| `arr.pop()` | ✅ Yes | **$O(1)$** | Removes and returns last element |
| `arr.length` | ❌ No | **$O(1)$** | Property read from internal header counter |

---

### 4.2 $O(n)$ Linear Time Methods

| Method | Modifies Original? | Time Complexity | Auxiliary Space | Explanation |
| :--- | :---: | :---: | :---: | :--- |
| `arr.shift()` | ✅ Yes | **$O(n)$** | $O(1)$ | Removes first element; shifts remaining $n-1$ elements left |
| `arr.unshift(val)` | ✅ Yes | **$O(n)$** | $O(1)$ | Inserts at front; shifts all $n$ elements right |
| `arr.slice(start, end)` | ❌ No | **$O(k)$** | $O(k)$ | Copies $k = end - start$ elements into a new array |
| `arr.splice(start, deleteCount, ...items)` | ✅ Yes | **$O(n)$** | $O(\text{deleted})$ | Removes and/or inserts elements; shifts remaining tail |
| `arr.concat(otherArr)` | ❌ No | **$O(n + m)$** | $O(n + m)$ | Allocates new array combining elements of both |
| `arr.indexOf(val)` / `includes(val)` | ❌ No | **$O(n)$** | $O(1)$ | Scans from left to right until match or end |
| `arr.find()` / `findIndex()` | ❌ No | **$O(n)$** | $O(1)$ | Evaluates predicate on elements sequentially |
| `arr.forEach()` | ❌ No | **$O(n)$** | $O(1)$ | Invokes callback for all $n$ elements |
| `arr.map(fn)` | ❌ No | **$O(n)$** | $O(n)$ | Transforms elements into a **new array** of size $n$ |
| `arr.filter(predicate)` | ❌ No | **$O(n)$** | $O(n)$ | Allocates a **new array** containing matching items |
| `arr.reduce(fn, initial)` | ❌ No | **$O(n)$** | $O(1)$ | Accumulates values across single linear pass |
| `arr.reverse()` | ✅ Yes | **$O(n)$** | $O(1)$ | In-place two-pointer swap from both ends |
| `arr.join(separator)` | ❌ No | **$O(n)$** | $O(n)$ | Concatenates elements into a new string |

---

### 4.3 $O(n \log n)$ & Higher Complexity Methods

| Method | Modifies Original? | Time Complexity | Auxiliary Space | Algorithm Used |
| :--- | :---: | :---: | :---: | :--- |
| `arr.sort(compareFn)` | ✅ Yes | **$O(n \log n)$** | $O(n)$ | Modern engines (V8, SpiderMonkey) use **TimSort** |
| `arr.flat(depth)` | ❌ No | **$O(n \cdot d)$** | $O(n)$ | Recursively flattens nested arrays up to depth $d$ |
| `arr.flatMap(fn)` | ❌ No | **$O(n)$** | $O(n)$ | Map followed by flat of depth 1 |

---

## 5. Memory Layout & Hardware Efficiency

### 5.1 CPU Cache Locality: Array vs Object

Why is iterating through an Array dramatically faster in practice than iterating through an Object, even when both have identical $O(n)$ Big-O complexity?

```
Array in RAM (Contiguous):
[ 10 ][ 20 ][ 30 ][ 40 ][ 50 ][ 60 ]
  ^
CPU loads entire 64-byte Cache Line!
Result: arr[1], arr[2], arr[3] are ALREADY in L1 CPU Cache. ZERO RAM wait!

Object / Map in RAM (Fragmented Pointers):
[ Key "a" | Ptr ] ------> [ Key "b" | Ptr ] ------> [ Key "c" | Ptr ]
(Addr 0x100)               (Addr 0x890)              (Addr 0x320)
Result: Each key lookup jumps to a distant RAM address -> Frequent CPU Cache Misses!
```

- **Arrays have optimal Spatial Cache Locality**: Reading `arr[i]` automatically pulls neighboring elements into the processor's ultra-fast L1 cache (1–2 nanoseconds latency).
- **Objects have poor Cache Locality**: Pointer hopping causes main RAM reads (50–100 nanoseconds latency).

---

### 5.2 Dense vs Sparse (Holey) Arrays

In JavaScript (V8 engine), arrays can exist in two internal representations:

1. **Dense (Packed) Arrays**:
   ```javascript
   const dense = [1, 2, 3, 4, 5];
   ```
   Stored as a contiguous C++ style flat buffer. Fast and memory-efficient.

2. **Sparse (Holey) Arrays**:
   ```javascript
   const sparse = [];
   sparse[0] = "a";
   sparse[10000] = "b"; // Gap of 9,999 empty holes!
   ```
   V8 detects the large gaps and downgrades the array into a **Dictionary (Hash Map)** under the hood!
   - Index access drops from pure pointer arithmetic ($O(1)$ fast) to dictionary lookups ($O(1)$ slow).
   - Iteration methods (`forEach`, `map`) must check for missing indices on every step.

---

## 6. Top Interview Traps & Anti-Patterns

### 6.1 Trap 1: Array `shift()` / `unshift()` in Loops ($O(n^2)$ Trap)

```typescript
// ❌ WRONG: O(n^2) Quadratic Time!
function processQueue(items: number[]): void {
  while (items.length > 0) {
    const item = items.shift(); // O(n) shift on EVERY iteration!
    console.log(item);
  }
}
```

- If `items` has $100,000$ elements, `shift()` moves $100,000 + 99,999 + \dots + 1 \approx 5 \times 10^9$ operations $\implies$ **Time Limit Exceeded (TLE)**!
- **Fix**: Use a pointer index or a dedicated Queue / Deque:
```typescript
// ✅ OPTIMAL: O(n) Linear Time
function processQueue(items: number[]): void {
  for (let i = 0; i < items.length; i++) {
    const item = items[i]; // O(1) access
    console.log(item);
  }
}
```

---

### 6.2 Trap 2: `indexOf()` / `includes()` in Loops ($O(n^2)$ Trap)

```typescript
// ❌ WRONG: O(n^2) Quadratic Time!
function findDuplicates(a: number[], b: number[]): number[] {
  const common: number[] = [];
  for (const x of a) {           // Runs n times
    if (b.includes(x)) {         // O(m) linear scan on EVERY iteration!
      common.push(x);
    }
  }
  return common;                 // Total: O(n * m) -> O(n^2)
}
```

- **Fix**: Convert `b` into a `Set` for $O(1)$ lookups:
```typescript
// ✅ OPTIMAL: O(n + m) Linear Time
function findDuplicates(a: number[], b: number[]): number[] {
  const setB = new Set(b);       // O(m) one-time build
  const common: number[] = [];
  for (const x of a) {           // Runs n times
    if (setB.has(x)) {           // O(1) instant lookup!
      common.push(x);
    }
  }
  return common;                 // Total: O(n + m) -> O(n)
}
```

---

### 6.3 Trap 3: Hidden Memory from `slice()` and Spreading `[...arr]`

```typescript
// ❌ Slices create brand-new array allocations: O(n) time & O(n) space!
function helper(arr: number[]): void {
  if (arr.length <= 1) return;
  helper(arr.slice(1)); // Copies n - 1 elements onto the heap on every call!
}
```

- A recursion of depth $n$ slicing the array produces **$O(n^2)$ total memory allocations**!
- **Fix**: Pass index pointers `(arr, index)` instead of copying slices.

---

### 6.4 Trap 4: In-Place vs New Array Mutation

In technical interviews, state clearly whether your approach modifies the input array or produces an immutable copy:

- **In-Place (Mutates input)**:
  - Methods: `push()`, `pop()`, `shift()`, `unshift()`, `splice()`, `reverse()`, `sort()`.
  - Auxiliary Space: **$O(1)$** (no new array allocated).
- **Out-of-Place (Returns fresh copy)**:
  - Methods: `slice()`, `concat()`, `map()`, `filter()`, spreading `[...arr]`.
  - Auxiliary Space: **$O(n)$** (allocates new memory on the heap).

---

## 7. Decision Matrix: Array vs Object vs Map vs Set

Use this quick guide to choose the optimal data structure during technical interviews:

```mermaid
graph TD
    Start{What are you storing?}

    Start -->|Sequence where index order matters| Q1{Need fast insert at front?}
    Q1 -->|Yes| Deq[Deque / Doubly Linked List]
    Q1 -->|No| Arr[Array List / Vector]

    Start -->|Unique values without duplicates| Set[Set]

    Start -->|Key-Value associations| Q2{What type of keys?}
    Q2 -->|Strings / Symbols only| Obj[Plain Object {} or Map]
    Q2 -->|Objects / Functions / Arbitrary keys| Map[Map]
```

| Problem Requirement | Best Choice | Why? |
| :--- | :--- | :--- |
| Need ordered sequence, random access by index $i$ | **Array** | $O(1)$ instant index read via pointer math |
| Need fast check: *"Have I seen this value before?"* | **Set** | $O(1)$ `has()` check vs $O(n)$ `includes()` |
| Need frequency count: *"How many times did each item appear?"* | **Object / Map** | $O(1)$ key increment: `map[x] = (map[x] || 0) + 1` |
| Need key-value mapping with non-string keys | **Map** | Plain objects coerce all keys to strings |
| Need to track insertion order while deleting/updating keys | **Map** | Guarantees insertion order (ideal for LRU cache) |
| Need to remove duplicates from an array | **Set** | `[...new Set(arr)]` runs in $O(n)$ time |

# 📘 JavaScript & TypeScript Interview Master Guide

> A comprehensive study guide containing **109 in-depth interview questions and code examples** covering JavaScript fundamentals, modern ES6+ patterns, asynchronous architectures, and advanced TypeScript type systems.

---

## 📑 Table of Contents

- [JavaScript (80 Questions)](#-javascript-80-questions)
  - [1. Basics, Variables & Scope (Q1–Q10)](#1-basics-variables--scope)
  - [2. Equality, Types & Coercion (Q11–Q15)](#2-equality-types--coercion)
  - [3. Functions, Closures & Execution (Q16–Q24)](#3-functions-closures--execution)
  - [4. Objects, Prototypes & Classes (Q25–Q32)](#4-objects-prototypes--classes)
  - [5. Arrays & Iteration (Q33–Q40)](#5-arrays--iteration)
  - [6. Asynchronous JavaScript & Event Loop (Q41–Q50)](#6-asynchronous-javascript--event-loop)
  - [7. Modules, Memory & Garbage Collection (Q51–Q56)](#7-modules-memory--garbage-collection)
  - [8. Modern ES6+ Features (Q57–Q65)](#8-modern-es6-features)
  - [9. Error Handling & Edge Cases (Q66–Q69)](#9-error-handling--edge-cases)
  - [10. Execution Context, Performance & Misc (Q70–Q80)](#10-execution-context-performance--misc)
- [TypeScript (29 Questions)](#-typescript-29-questions)
  - [1. Core Types & Fundamentals (Q1–Q10)](#1-core-types--fundamentals)
  - [2. Generics & Utility Types (Q11–Q18)](#2-generics--utility-types)
  - [3. Advanced Types, Classes & Runtime (Q19–Q29)](#3-advanced-types-classes--runtime)

---

# 💛 JavaScript (80 Questions)

---

### 1. Basics, Variables & Scope

#### 1. What is the difference between `var`, `let`, and `const`?

- **`var`**: Function-scoped, hoisted and initialized as `undefined`, allows re-declaration and reassignment.
- **`let`**: Block-scoped, hoisted but kept uninitialized in the _Temporal Dead Zone (TDZ)_, allows reassignment, disallows re-declaration.
- **`const`**: Block-scoped, resides in TDZ, disallows reassignment and re-declaration (object/array properties can still mutate).

```javascript
// Scope differences
function scopeDemo() {
  if (true) {
    var functionScoped = 'Accessible outside block';
    let blockScoped = 'Blocked';
    const constantVal = { count: 1 };

    constantVal.count = 2; // ✅ Allowed (mutation)
    // constantVal = {};   // ❌ TypeError: Assignment to constant variable
  }
  console.log(functionScoped); // "Accessible outside block"
  // console.log(blockScoped); // ReferenceError: blockScoped is not defined
}
scopeDemo();
```

---

#### 2. What is hoisting?

Hoisting is JavaScript's compilation behavior where variable and function declarations are moved to the top of their containing scope prior to code execution.

- Function declarations are hoisted with their **entire implementation**.
- `var` is hoisted and initialized with `undefined`.
- `let` and `const` are hoisted without initialization (TDZ).

```javascript
// Function declarations work before definition
greet(); // "Hello from hoisted function!"
function greet() {
  console.log('Hello from hoisted function!');
}

// var vs let/const hoisting
console.log(hoistedVar); // undefined
var hoistedVar = 42;

// console.log(hoistedLet); // ❌ ReferenceError: Cannot access 'hoistedLet' before initialization
let hoistedLet = 100;
```

---

#### 3. What is the Temporal Dead Zone (TDZ)?

The TDZ is the period between entering a scope and the actual execution of the `let` or `const` variable declaration. Accessing the identifier during this window throws a `ReferenceError`.

```javascript
{
  // TDZ for variable 'user' starts here
  // console.log(user); // ❌ ReferenceError: Cannot access 'user' before initialization

  const greeting = 'Hello';
  console.log(greeting); // "Hello"

  let user = 'Alice'; // TDZ for 'user' ends here
  console.log(user); // "Alice"
}
```

---

#### 4. Explain closures with an example.

A **closure** is the combination of a function bundled together with references to its lexical environment. A closure allows an inner function to retain access to variables of an outer function even after the outer function has finished executing.

```javascript
function createCounter(initialValue = 0) {
  let count = initialValue; // Private state encapsulated in closure

  return {
    increment() {
      count++;
      return count;
    },
    decrement() {
      count--;
      return count;
    },
    getCount() {
      return count;
    },
  };
}

const counter = createCounter(10);
console.log(counter.increment()); // 11
console.log(counter.increment()); // 12
console.log(counter.getCount()); // 12
```

---

#### 5. What is the difference between function declarations and function expressions?

- **Function Declaration**: Hoisted with complete body; can be called before its line of declaration.
- **Function Expression**: Stored in a variable; only the variable binding is hoisted (as `undefined` for `var` or TDZ for `let`/`const`), so it cannot be invoked before evaluation.

```javascript
// 1. Function Declaration
console.log(add(2, 3)); // 5
function add(a, b) {
  return a + b;
}

// 2. Function Expression
// console.log(multiply(2, 3)); // ❌ ReferenceError or TypeError
const multiply = function (a, b) {
  return a * b;
};
console.log(multiply(2, 3)); // 6
```

---

#### 6. What is `this` in JavaScript and how is it determined?

`this` refers to the execution context of a function call. It is determined by the **call site** (how the function is called), following 4 core rules in order of priority:

1. **`new` binding**: Point to newly constructed object.
2. **Explicit binding**: `call()`, `apply()`, `bind()`.
3. **Implicit binding**: Invoked as a method (`obj.method()`).
4. **Default binding**: Global object (`window` / `global`) or `undefined` in strict mode.
   _Note: Arrow functions do not have their own `this`; they capture `this` lexically from their enclosing scope._

```javascript
const person = {
  name: 'Sarah',
  regularFn: function () {
    return `Hello, ${this.name}`;
  },
  arrowFn: () => {
    return `Hello, ${this?.name}`;
  },
};

console.log(person.regularFn()); // "Hello, Sarah" (Implicit binding)
console.log(person.arrowFn()); // "Hello, undefined" (Lexical/Global scope)
```

---

#### 7. Difference between `call`, `apply`, and `bind`.

- **`call(thisArg, arg1, arg2, ...)`**: Invokes the function immediately with comma-separated arguments.
- **`apply(thisArg, [argsArray])`**: Invokes the function immediately with arguments passed as an array.
- **`bind(thisArg, arg1, ...)`**: Returns a **new function** with `this` and initial arguments permanently bound.

```javascript
function introduce(greeting, punctuation) {
  return `${greeting}, I am ${this.name}${punctuation}`;
}

const user = { name: 'Alex' };

// call: comma separated arguments
console.log(introduce.call(user, 'Hello', '!')); // "Hello, I am Alex!"

// apply: array of arguments
console.log(introduce.apply(user, ['Hey', '.'])); // "Hey, I am Alex."

// bind: returns bound function for later invocation
const boundIntro = introduce.bind(user, 'Welcome');
console.log(boundIntro('!')); // "Welcome, I am Alex!"
```

---

#### 8. What are arrow functions and how do they differ from regular functions?

- Do not have their own `this`, `arguments`, `super`, or `new.target`.
- Inherit `this` lexically from the parent enclosing scope.
- Cannot be used as constructor functions with `new` (lack `[[Construct]]` internal method).
- Do not have a `prototype` property.

```javascript
const obj = {
  multiplier: 2,
  compute: function (numbers) {
    // Arrow function preserves 'this' from compute method
    return numbers.map((n) => n * this.multiplier);
  },
};

console.log(obj.compute([1, 2, 3])); // [2, 4, 6]
```

---

#### 9. What is the difference between `null` and `undefined`?

- **`undefined`**: A variable that has been declared but never assigned a value, missing function parameters, or uninitialized object properties.
- **`null`**: An explicit assignment representing intentional absence of any object value.
- Type check: `typeof undefined === 'undefined'`, while `typeof null === 'object'` (historical JS bug).

```javascript
let unassignedVar;
let emptyVar = null;

console.log(typeof unassignedVar); // "undefined"
console.log(typeof emptyVar); // "object"
console.log(unassignedVar == emptyVar); // true  (loose equality)
console.log(unassignedVar === emptyVar); // false (strict equality)
```

---

#### 10. What are primitive data types in JavaScript?

There are **7 primitive types** (immutable, passed by value):

1. `string`
2. `number`
3. `bigint`
4. `boolean`
5. `undefined`
6. `symbol`
7. `null`
   All other values (Objects, Arrays, Functions, Dates) are **reference types**.

```javascript
let num = 10;
let str = 'Hello';
let bool = true;
let sym = Symbol('id');
let big = 9007199254740991n;
let u = undefined;
let n = null;

console.log(typeof sym); // "symbol"
console.log(typeof big); // "bigint"
```

---

### 2. Equality, Types & Coercion

#### 11. Difference between `==` and `===`.

- **`==` (Abstract / Loose Equality)**: Performs implicit type conversion (coercion) if operands are of different types before comparison.
- **`===` (Strict Equality)**: Compares both type and value without coercion.

```javascript
console.log(5 == '5'); // true  (string "5" is coerced to number 5)
console.log(5 === '5'); // false (number !== string)
console.log(0 == false); // true  (false is coerced to 0)
console.log(0 === false); // false (different types)
console.log(null == undefined); // true
console.log(null === undefined); // false
```

---

#### 12. What is type coercion? Give examples.

Type coercion is the automatic or implicit conversion of values from one data type to another.

- **String Coercion (`+`)**: When one operand is a string, `+` concatenates.
- **Numeric Coercion (`-`, `*`, `/`, `%`)**: Non-numbers are converted to numbers.

```javascript
// String coercion
console.log('5' + 2); // "52"
console.log([] + []); // ""
console.log([] + {}); // "[object Object]"

// Numeric coercion
console.log('10' - 2); // 8
console.log('10' * '2'); // 20
console.log(+'42'); // 42 (unary plus)
console.log(true + 1); // 2 (true becomes 1)
```

---

#### 13. How do you check if a value is an array?

Use `Array.isArray(value)`. Avoid `typeof` because it returns `"object"` for arrays, null, and plain objects.

```javascript
const arr = [1, 2, 3];
const obj = { 0: 'a', length: 1 };

console.log(Array.isArray(arr)); // true
console.log(Array.isArray(obj)); // false
console.log(arr instanceof Array); // true (may fail across iframes/execution contexts)
```

---

#### 14. What is `NaN` and how do you check for it?

`NaN` ("Not a Number") represents an invalid numeric computation result.
`NaN` is the only value in JavaScript that is **not equal to itself** (`NaN !== NaN`).

- Use `Number.isNaN()` (strict check without coercion) rather than global `isNaN()` (which coerces argument first).

```javascript
console.log(0 / 0); // NaN
console.log(NaN === NaN); // false

console.log(Number.isNaN(NaN)); // true
console.log(Number.isNaN('hello')); // false (safe: does not coerce)
console.log(isNaN('hello')); // true  (unsafe: coerces "hello" to NaN)
```

---

#### 15. Explain truthy and falsy values in JavaScript.

There are **8 falsy values** in JavaScript:

- `false`, `0`, `-0`, `0n` (BigInt zero), `""` (empty string), `null`, `undefined`, `NaN`.
  **Everything else is truthy**, including `"0"`, `"false"`, `[]`, `{}`, and `function() {}`.

```javascript
const values = [0, '', '0', [], {}, null, undefined, false];

values.forEach((v) => {
  console.log(v, '->', Boolean(v) ? 'truthy' : 'falsy');
});
// 0 -> falsy
// "" -> falsy
// "0" -> truthy
// [] -> truthy
// {} -> truthy
// null -> falsy
// undefined -> falsy
// false -> falsy
```

---

### 3. Functions, Closures & Execution

#### 16. What is a higher-order function?

A **higher-order function** is a function that either takes one or more functions as arguments, returns a function as its result, or both.

```javascript
// Takes a function as argument
const numbers = [1, 2, 3, 4];
const doubled = numbers.map((n) => n * 2); // map is higher-order

// Returns a function
function multiplyBy(factor) {
  return function (number) {
    return number * factor;
  };
}

const triple = multiplyBy(3);
console.log(triple(5)); // 15
```

---

#### 17. What is currying?

Currying transforms a function with multiple arguments into a chain of unary (single-argument) functions.

```javascript
// Normal function
const add3 = (a, b, c) => a + b + c;

// Curried version
const curriedAdd = (a) => (b) => (c) => a + b + c;

console.log(curriedAdd(1)(2)(3)); // 6

// Reusable partial application
const add5 = curriedAdd(2)(3);
console.log(add5(10)); // 15
```

---

#### 18. Explain debounce vs throttle.

- **Debounce**: Delays function execution until `N` ms have passed since the **last** event trigger (e.g., search autocomplete, resize).
- **Throttle**: Ensures the function executes at most **once every `N` ms**, even if triggered continuously (e.g., scroll handler, game loop).

```javascript
// Debounce implementation
function debounce(fn, delay) {
  let timer;
  return function (...args) {
    clearTimeout(timer);
    timer = setTimeout(() => fn.apply(this, args), delay);
  };
}

// Throttle implementation
function throttle(fn, interval) {
  let lastTime = 0;
  return function (...args) {
    const now = Date.now();
    if (now - lastTime >= interval) {
      lastTime = now;
      fn.apply(this, args);
    }
  };
}
```

---

#### 19. What is memoization?

Memoization is an optimization technique that caches the return values of expensive pure function calls keyed by input arguments.

```javascript
function memoize(fn) {
  const cache = new Map();
  return function (...args) {
    const key = JSON.stringify(args);
    if (cache.has(key)) {
      console.log('Returned from cache!');
      return cache.get(key);
    }
    const result = fn.apply(this, args);
    cache.set(key, result);
    return result;
  };
}

const slowFactorial = (n) => (n <= 1 ? 1 : n * slowFactorial(n - 1));
const fastFactorial = memoize(slowFactorial);

console.log(fastFactorial(5)); // Computes and returns 120
console.log(fastFactorial(5)); // "Returned from cache!" -> 120
```

---

#### 20. What are default parameters?

Default parameters allow initializing named parameters with default values if no value or `undefined` is passed.

```javascript
function sendEmail(to, subject = 'No Subject', isUrgent = false) {
  return `To: ${to} | Subject: ${subject} | Urgent: ${isUrgent}`;
}

console.log(sendEmail('test@example.com'));
// "To: test@example.com | Subject: No Subject | Urgent: false"

console.log(sendEmail('test@example.com', undefined, true));
// "To: test@example.com | Subject: No Subject | Urgent: true"
```

---

#### 21. What is the `arguments` object?

The `arguments` object is an array-like local variable available inside non-arrow functions containing all passed parameters. It lacks array prototype methods like `map` or `forEach`.

```javascript
function sumAll() {
  // Convert array-like object to actual array
  const args = Array.from(arguments);
  return args.reduce((acc, curr) => acc + curr, 0);
}

console.log(sumAll(1, 2, 3, 4)); // 10
```

---

#### 22. What are rest and spread operators?

- **Rest Operator (`...`)**: Gathers multiple arguments or remaining elements into a single array.
- **Spread Operator (`...`)**: Unpacks elements from an iterable (Array, String, Set) or properties from an object.

```javascript
// 1. Rest operator in function parameters
function collectDetails(name, ...skills) {
  console.log(name); // "Bob"
  console.log(skills); // ["JavaScript", "React", "Node"]
}
collectDetails('Bob', 'JavaScript', 'React', 'Node');

// 2. Spread operator in array and object merging
const arr1 = [1, 2];
const arr2 = [...arr1, 3, 4]; // [1, 2, 3, 4]

const base = { theme: 'dark' };
const userConfig = { ...base, lang: 'en' }; // { theme: "dark", lang: "en" }
```

---

#### 23. What is an IIFE (Immediately Invoked Function Expression)?

An IIFE is a function that runs immediately as soon as it is defined: `(function(){ ... })()`. It was historically used to create a private scope to prevent polluting the global namespace.

```javascript
const result = (function () {
  const privateSecret = 'top_secret_token';
  return {
    getSecretLength: () => privateSecret.length,
  };
})();

console.log(result.getSecretLength()); // 16
// console.log(privateSecret); // ❌ ReferenceError
```

---

#### 24. What is recursion, and what's a potential downside?

Recursion is when a function calls itself until reaching a base condition.

- **Downside**: Deep recursion can exceed the maximum call stack size, resulting in a `RangeError: Maximum call stack size exceeded` (Stack Overflow).

```javascript
// Recursive function to calculate Fibonacci
function fibonacci(n) {
  if (n <= 1) return n; // Base case
  return fibonacci(n - 1) + fibonacci(n - 2); // Recursive step
}

console.log(fibonacci(7)); // 13
```

---

### 4. Objects, Prototypes & Classes

#### 25. Explain prototypal inheritance.

Every JavaScript object has an internal `[[Prototype]]` link pointing to another object. When a property or method is accessed on an object, JavaScript looks at the object itself; if not found, it traverses up the prototype chain until it finds the property or reaches `null`.

```javascript
const animal = {
  eats: true,
  walk() {
    return 'Animal walking';
  },
};

const dog = Object.create(animal);
dog.barks = true;

console.log(dog.barks); // true (own property)
console.log(dog.eats); // true (inherited from animal prototype)
console.log(dog.walk()); // "Animal walking" (inherited method)
console.log(Object.getPrototypeOf(dog) === animal); // true
```

---

#### 26. What is the difference between `Object.freeze()` and `Object.seal()`?

- **`Object.freeze()`**: Makes an object completely immutable (shallow). Cannot add, delete, or modify properties.
- **`Object.seal()`**: Prevents adding or deleting properties, but **allows modifying existing properties**.

```javascript
const sealed = Object.seal({ x: 10 });
sealed.x = 20; // ✅ Allowed (modified existing)
sealed.y = 30; // ❌ Not added
delete sealed.x; // ❌ Not deleted
console.log(sealed); // { x: 20 }

const frozen = Object.freeze({ x: 10 });
frozen.x = 20; // ❌ Not allowed
console.log(frozen); // { x: 10 }
```

---

#### 27. How do you clone an object in JavaScript?

- **Shallow Clone**: `{ ...obj }` or `Object.assign({}, obj)`
- **Deep Clone**: `structuredClone(obj)` (Modern native standard), or `JSON.parse(JSON.stringify(obj))` (limitations: strips functions/Symbols/undefined).

```javascript
const original = { name: 'John', address: { city: 'New York' } };

// Shallow clone (nested objects share references)
const shallow = { ...original };
shallow.address.city = 'Boston';
console.log(original.address.city); // "Boston" (mutated!)

// Deep clone
const deep = structuredClone(original);
deep.address.city = 'Seattle';
console.log(original.address.city); // "Boston" (unaffected)
```

---

#### 28. Difference between `Object.keys()`, `Object.values()`, and `Object.entries()`.

- **`Object.keys(obj)`**: Returns an array of an object's own enumerable string property **names**.
- **`Object.values(obj)`**: Returns an array of property **values**.
- **`Object.entries(obj)`**: Returns an array of `[key, value]` pairs.

```javascript
const user = { name: 'Maya', role: 'Admin', active: true };

console.log(Object.keys(user)); // ["name", "role", "active"]
console.log(Object.values(user)); // ["Maya", "Admin", true]
console.log(Object.entries(user)); // [["name","Maya"], ["role","Admin"], ["active",true]]
```

---

#### 29. How does the `class` keyword relate to prototypes?

ES6 `class` syntax is syntactic sugar over prototype-based inheritance. Methods defined within the class body are attached to `ClassName.prototype`.

```javascript
class Vehicle {
  constructor(wheels) {
    this.wheels = wheels;
  }
  drive() {
    return `Driving with ${this.wheels} wheels`;
  }
}

const car = new Vehicle(4);
console.log(car.drive()); // "Driving with 4 wheels"
console.log(typeof Vehicle); // "function"
console.log(car.__proto__ === Vehicle.prototype); // true
```

---

#### 30. What are getters and setters?

Getters and setters are special methods that bind an object property to a function call upon reading (`get`) or writing (`set`).

```javascript
const account = {
  _balance: 100,
  get balance() {
    return `$${this._balance.toFixed(2)}`;
  },
  set balance(amount) {
    if (amount < 0) throw new Error('Balance cannot be negative');
    this._balance = amount;
  },
};

console.log(account.balance); // "$100.00"
account.balance = 250;
console.log(account.balance); // "$250.00"
```

---

#### 31. What is `Object.create()` used for?

`Object.create(proto, [propertiesObject])` creates a new object using the specified prototype object, without executing constructor code.

```javascript
const protoHelper = {
  calculateTax(amount) {
    return amount * 0.2;
  },
};

const invoice = Object.create(protoHelper);
invoice.total = 1000;

console.log(invoice.calculateTax(invoice.total)); // 200
```

---

#### 32. Explain the difference between shallow and deep equality.

- **Shallow Equality**: Compares object references (`obj1 === obj2`) or compares only the first level of property keys and values.
- **Deep Equality**: Recursively compares all nested properties and values across all depths.

```javascript
const a = { details: { id: 1 } };
const b = { details: { id: 1 } };

console.log(a === b); // false (different memory references)

// Simple deep equality helper
function deepEqual(obj1, obj2) {
  if (obj1 === obj2) return true;
  if (typeof obj1 !== 'object' || typeof obj2 !== 'object' || !obj1 || !obj2) return false;

  const keysA = Object.keys(obj1),
    keysB = Object.keys(obj2);
  if (keysA.length !== keysB.length) return false;

  return keysA.every((key) => keysB.includes(key) && deepEqual(obj1[key], obj2[key]));
}

console.log(deepEqual(a, b)); // true
```

---

### 5. Arrays & Iteration

#### 33. Difference between `map()`, `forEach()`, and `filter()`.

- **`map()`**: Returns a **new array** transformed by the callback function.
- **`forEach()`**: Executes a function for each element; **returns `undefined`** (used for side effects).
- **`filter()`**: Returns a **new array** containing only elements that pass the boolean condition.

```javascript
const nums = [1, 2, 3, 4, 5];

const squared = nums.map((n) => n * n); // [1, 4, 9, 16, 25]
const evens = nums.filter((n) => n % 2 === 0); // [2, 4]
nums.forEach((n) => console.log(n)); // Logs 1, 2, 3, 4, 5 (returns undefined)
```

---

#### 34. How does `reduce()` work? Give a use case.

`reduce(callback, initialValue)` executes a reducer function on each array element, carrying over an accumulator value to result in a single aggregated value.

```javascript
// Use case: Group objects by property
const items = [
  { name: 'Apple', category: 'Fruit' },
  { name: 'Carrot', category: 'Vegetable' },
  { name: 'Banana', category: 'Fruit' },
];

const grouped = items.reduce((acc, item) => {
  acc[item.category] = acc[item.category] || [];
  acc[item.category].push(item.name);
  return acc;
}, {});

console.log(grouped);
// { Fruit: ["Apple", "Banana"], Vegetable: ["Carrot"] }
```

---

#### 35. Difference between `slice()` and `splice()`.

- **`slice(start, end)`**: **Non-mutating**. Returns a shallow copy portion of the array.
- **`splice(start, deleteCount, ...items)`**: **Mutating**. Modifies the original array by removing, replacing, or inserting elements.

```javascript
const letters = ['a', 'b', 'c', 'd', 'e'];

// slice (immutable)
const sliced = letters.slice(1, 3);
console.log(sliced); // ["b", "c"]
console.log(letters); // ["a", "b", "c", "d", "e"] (unchanged)

// splice (mutable)
const removed = letters.splice(1, 2, 'X', 'Y');
console.log(removed); // ["b", "c"]
console.log(letters); // ["a", "X", "Y", "d", "e"] (mutated!)
```

---

#### 36. How do you remove duplicates from an array?

- For primitives: Use `[...new Set(array)]`.
- For objects: Use `Map` keyed by a unique identifier.

```javascript
// Primitives
const duplicates = [1, 2, 2, 3, 4, 4, 5];
const unique = [...new Set(duplicates)];
console.log(unique); // [1, 2, 3, 4, 5]

// Array of Objects
const users = [
  { id: 1, name: 'A' },
  { id: 2, name: 'B' },
  { id: 1, name: 'A' },
];
const uniqueUsers = Array.from(new Map(users.map((u) => [u.id, u])).values());
console.log(uniqueUsers); // [{ id: 1, name: "A" }, { id: 2, name: "B" }]
```

---

#### 37. What is the difference between `find()` and `filter()`?

- **`find()`**: Returns the **first single element** matching the predicate and stops iterating immediately. Returns `undefined` if not found.
- **`filter()`**: Iterates through the entire array and returns an **array of all matching elements**.

```javascript
const inventory = [
  { item: 'book', qty: 0 },
  { item: 'pen', qty: 5 },
  { item: 'notebook', qty: 10 },
];

const firstInStock = inventory.find((i) => i.qty > 0);
console.log(firstInStock); // { item: "pen", qty: 5 }

const allInStock = inventory.filter((i) => i.qty > 0);
console.log(allInStock); // [{ item: "pen", qty: 5 }, { item: "notebook", qty: 10 }]
```

---

#### 38. How do array destructuring and default values work together?

Default values provide a fallback when an element is `undefined` or missing from the target array.

```javascript
const colors = ['red'];
const [primary, secondary = 'blue', tertiary = 'green'] = colors;

console.log(primary); // "red"
console.log(secondary); // "blue" (fallback used)
console.log(tertiary); // "green" (fallback used)
```

---

#### 39. What is the difference between `Array.from()` and `Array.of()`?

- **`Array.from(iterable, mapFn)`**: Converts an iterable or array-like object (e.g. Set, NodeList, arguments) into a true array.
- **`Array.of(...elements)`**: Creates an array from arguments, solving the quirk of `new Array(3)` (which creates an empty array of length 3).

```javascript
// Array.from
const set = new Set([1, 2, 3]);
const fromSet = Array.from(set, (x) => x * 10);
console.log(fromSet); // [10, 20, 30]

// Array.of vs new Array
console.log(Array.of(3)); // [3]
console.log(new Array(3)); // [ <3 empty items> ]
```

---

#### 40. How does `sort()` work by default, and what's a common pitfall?

By default, `Array.prototype.sort()` converts elements to strings and compares UTF-16 code units lexicographically.

- **Pitfall**: Numbers sort alphabetically (`[10, 2, 5]` -> `[10, 2, 5]`).
- **Fix**: Always provide a compare function `(a, b) => a - b`.

```javascript
const numbers = [10, 5, 40, 25, 1000, 1];

// Default sort (Lexicographical)
numbers.sort();
console.log(numbers); // [1, 10, 1000, 25, 40, 5] ❌ Unexpected

// Numeric sort with comparator
numbers.sort((a, b) => a - b);
console.log(numbers); // [1, 5, 10, 25, 40, 1000] ✅ Correct
```

---

### 6. Asynchronous JavaScript & Event Loop

#### 41. Explain the JavaScript event loop.

JavaScript is single-threaded with a non-blocking concurrency model.

1. **Call Stack**: Executes synchronous code line by line.
2. **Web APIs / Node APIs**: Offloads asynchronous operations (HTTP, timers, DOM).
3. **Microtask Queue**: High priority queue (Promises, `queueMicrotask`, `process.nextTick`).
4. **Macrotask / Task Queue**: Lower priority queue (`setTimeout`, `setInterval`, I/O).
5. **Event Loop**: If the Call Stack is empty, it flushes **all** microtasks before executing the next macrotask.

```javascript
console.log('1: Synchronous');

setTimeout(() => {
  console.log('4: Macrotask (setTimeout)');
}, 0);

Promise.resolve().then(() => {
  console.log('3: Microtask (Promise)');
});

console.log('2: Synchronous');

// Output Order:
// 1: Synchronous
// 2: Synchronous
// 3: Microtask (Promise)
// 4: Macrotask (setTimeout)
```

---

#### 42. Difference between microtasks and macrotasks.

- **Microtasks**: Run immediately after the current synchronous script and before rendering or any macrotask. (e.g., `Promise.then()`, `queueMicrotask`, `MutationObserver`).
- **Macrotasks**: Executed one by one from the event queue after all microtasks have resolved. (e.g., `setTimeout`, `setInterval`, `setImmediate`).

```javascript
queueMicrotask(() => console.log('Microtask 1'));
setTimeout(() => console.log('Macrotask 1'), 0);
queueMicrotask(() => console.log('Microtask 2'));

// Output:
// Microtask 1
// Microtask 2
// Macrotask 1
```

---

#### 43. What is a Promise and what states can it have?

A Promise represents the eventual completion or failure of an asynchronous operation.
It has 3 mutually exclusive states:

1. **`pending`**: Initial state, neither fulfilled nor rejected.
2. **`fulfilled`**: Operation completed successfully (`resolve()`).
3. **`rejected`**: Operation failed (`reject()`).

```javascript
const fetchUserData = new Promise((resolve, reject) => {
  const success = true;
  setTimeout(() => {
    if (success) resolve({ id: 1, name: 'Alice' });
    else reject(new Error('Network Error'));
  }, 100);
});

fetchUserData
  .then((user) => console.log('User:', user.name))
  .catch((err) => console.error('Failed:', err.message))
  .finally(() => console.log('Operation settled'));
```

---

#### 44. Difference between `Promise.all`, `Promise.allSettled`, `Promise.race`, and `Promise.any`.

- **`Promise.all`**: Resolves when **all** resolve; rejects immediately if **any** rejects (fail-fast).
- **`Promise.allSettled`**: Waits for **all** to complete regardless of resolution/rejection; returns status objects `{ status, value/reason }`.
- **`Promise.race`**: Settles as soon as the **first** promise settles (resolves or rejects).
- **`Promise.any`**: Resolves as soon as the **first** promise **fulfills**; rejects only if all reject (`AggregateError`).

```javascript
const p1 = Promise.resolve('Fast');
const p2 = new Promise((resolve) => setTimeout(() => resolve('Slow'), 200));
const p3 = Promise.reject('Failed');

// Promise.allSettled never short-circuits on rejection
Promise.allSettled([p1, p2, p3]).then((results) => console.log(results));
// [
//   { status: 'fulfilled', value: 'Fast' },
//   { status: 'fulfilled', value: 'Slow' },
//   { status: 'rejected', reason: 'Failed' }
// ]
```

---

#### 45. How does `async`/`await` relate to Promises?

`async`/`await` is syntactic sugar built on top of Promises and Generators.

- An `async` function automatically wraps its return value in a Promise.
- `await` pauses function execution until the Promise settles without blocking the JS main thread.

```javascript
async function loadDashboard() {
  try {
    const user = await Promise.resolve({ id: 101, name: 'Eve' });
    console.log(`Loaded dashboard for ${user.name}`);
    return user;
  } catch (error) {
    console.error('Dashboard error', error);
  }
}

loadDashboard();
```

---

#### 46. How do you handle errors in `async`/`await`?

Use standard `try...catch...finally` blocks, or append a `.catch()` method to the returned Promise.

```javascript
async function apiCall() {
  try {
    const response = await fetch('https://invalid-url.fake');
    const data = await response.json();
    return data;
  } catch (err) {
    console.error('Caught error in async handler:', err.message);
  } finally {
    console.log('Cleanup executed.');
  }
}
```

---

#### 47. What is callback hell and how is it solved?

Callback hell refers to deeply nested callback functions resembling a pyramid shape, making error handling, debugging, and sequential async flows unmaintainable.

- **Solution**: Refactor to Promises or `async`/`await`.

```javascript
// ❌ Callback Hell
/*
getUser(userId, (user) => {
  getOrders(user.id, (orders) => {
    getOrderDetails(orders[0].id, (details) => {
      console.log(details);
    });
  });
});
*/

// ✅ Modern async/await solution
async function fetchDetails(userId) {
  const user = await getUser(userId);
  const orders = await getOrders(user.id);
  const details = await getOrderDetails(orders[0].id);
  return details;
}
```

---

#### 48. What's the difference between `setTimeout(fn, 0)` and `Promise.resolve().then()` execution order?

`Promise.then` callbacks are **microtasks** and execute immediately after the current call stack clears, before any **macrotasks** like `setTimeout(fn, 0)`.

```javascript
setTimeout(() => console.log('Timeout (macrotask)'), 0);
Promise.resolve().then(() => console.log('Promise (microtask)'));

// Logs:
// 1. "Promise (microtask)"
// 2. "Timeout (macrotask)"
```

---

#### 49. What is a race condition in async JS, and how do you avoid one (e.g. in a search input)?

A race condition occurs when asynchronous responses arrive out of order, causing old/stale requests to overwrite newer user input.

- **Solution**: Use `AbortController` to cancel in-flight requests when a new search starts.

```javascript
let currentController = null;

async function searchInputHandler(searchTerm) {
  // Abort previous pending request
  if (currentController) {
    currentController.abort();
  }

  currentController = new AbortController();
  const { signal } = currentController;

  try {
    const res = await fetch(`/api/search?q=${searchTerm}`, { signal });
    const data = await res.json();
    console.log('Render search results:', data);
  } catch (err) {
    if (err.name === 'AbortError') {
      console.log('Fetch aborted for stale search query');
    }
  }
}
```

---

#### 50. What is `Promise.resolve()` and `Promise.reject()` used for?

Static helper methods to create pre-settled Promises without needing `new Promise((res, rej) => ...)`.

```javascript
// Wrap a cached value in a Promise
function getUser(id) {
  const cache = { 1: { name: 'Sam' } };
  if (cache[id]) {
    return Promise.resolve(cache[id]); // Instant fulfilled promise
  }
  return Promise.reject(new Error('User not found'));
}

getUser(1).then((u) => console.log('Found:', u.name));
```

---

### 7. Modules, Scope & Memory

#### 51. Difference between CommonJS and ES Modules.

- **CommonJS (`require` / `module.exports`)**: Synchronous loading, dynamic (can be conditionally called anywhere), evaluated at runtime, default in older Node.js.
- **ES Modules (`import` / `export`)**: Asynchronous loading, static analysis (enables tree-shaking), top-level imports, native in browsers and modern Node.

```javascript
// --- CommonJS (CJS) ---
// const math = require('./math');
// module.exports = { add: (a, b) => a + b };

// --- ES Modules (ESM) ---
// import { add } from './math.js';
// export const add = (a, b) => a + b;
```

---

#### 52. What is the module pattern and why was it used before ES Modules?

The module pattern used IIFEs and closures to encapsulate private variables and functions while exporting a public API object.

```javascript
const CartModule = (function () {
  let cart = []; // Private state

  return {
    addItem(item) {
      cart.push(item);
    },
    getItems() {
      return [...cart];
    },
  };
})();

CartModule.addItem({ product: 'Laptop', price: 1200 });
console.log(CartModule.getItems());
```

---

#### 53. What causes memory leaks in JavaScript?

1. **Uncleaned intervals/timers** (`setInterval` without `clearInterval`).
2. **Forgotten event listeners** attached to removed DOM elements.
3. **Detached DOM nodes** retained in JavaScript memory.
4. **Accidental global variables** (missing `let`/`const`).
5. **Closures** unintentionally keeping references to large objects.

```javascript
// ❌ Memory leak example
function startTracking() {
  const hugeData = new Array(1000000).fill('leak');
  setInterval(() => {
    // hugeData is captured in closure and never garbage collected!
    console.log('Tick:', hugeData.length);
  }, 1000);
}
```

---

#### 54. How does garbage collection work in JavaScript (Mark-and-Sweep)?

The JavaScript engine periodically runs the **Mark-and-Sweep** algorithm:

1. It identifies a set of **roots** (global object, local variables in current call stack).
2. Traverses and "marks" all objects reachable from the roots.
3. Reclaims and sweeps memory occupied by any unmarked (unreachable) objects.

```javascript
let objA = { name: 'A' };
let objB = { name: 'B' };

objA.neighbor = objB;
objB.neighbor = objA; // Circular reference

objA = null;
objB = null;
// Mark-and-sweep detects both are unreachable from the root,
// so circular reference memory is safely reclaimed!
```

---

#### 55. What are `WeakMap` and `WeakSet`, and why use them?

- **`WeakMap`**: Keys must be objects; holds **weak references** to keys. If no other reference to a key object exists, it can be garbage collected automatically.
- **`WeakSet`**: Values must be objects; holds weak references to values.
- **Use Case**: Storing private data or DOM node metadata without creating memory leaks.

```javascript
const metaMap = new WeakMap();

let domElement = { id: 'btn-submit' };
metaMap.set(domElement, { clickCount: 5 });

console.log(metaMap.get(domElement)); // { clickCount: 5 }

domElement = null;
// Metadata entry in metaMap is automatically cleaned up during garbage collection!
```

---

#### 56. Difference between global scope, function scope, and block scope.

- **Global Scope**: Accessible everywhere across all scripts and functions.
- **Function Scope**: Accessible only within the enclosing function (declared with `var` or functions).
- **Block Scope**: Accessible only inside `{ ... }` blocks (declared with `let` or `const`).

```javascript
var globalVar = 'global';

function testScope() {
  var functionVar = 'func';
  if (true) {
    let blockVar = 'block';
    console.log(globalVar, functionVar, blockVar); // All accessible here
  }
  // console.log(blockVar); // ❌ ReferenceError
}
testScope();
```

---

### 8. Modern ES6+ Features

#### 57. What are template literals and tagged templates?

- **Template Literals**: Strings enclosed in backticks (` `) allowing multiline strings and expression interpolation (`${expr}`).
- **Tagged Templates**: Prefixing a template literal with a function to parse string tokens and substitutions.

```javascript
// 1. Template literal
const user = 'David';
console.log(`Hello, ${user}!`);

// 2. Tagged template function (useful for sanitizing or styling)
function highlight(strings, ...values) {
  return strings.reduce((prev, str, i) => `${prev}${str}<b>${values[i] || ''}</b>`, '');
}

const name = 'Alice',
  role = 'Admin';
const formatted = highlight`User ${name} has role ${role}.`;
console.log(formatted); // "User <b>Alice</b> has role <b>Admin</b>."
```

---

#### 58. What is destructuring assignment?

A syntax that unpacks values from arrays or properties from objects into distinct variables.

```javascript
// Object destructuring with renaming and defaults
const profile = { username: 'dev_guru', followers: 150 };
const { username: handle, followers, verified = false } = profile;

console.log(handle, followers, verified); // "dev_guru", 150, false

// Array destructuring with skipping
const coordinates = [10, 20, 30];
const [x, , z] = coordinates;
console.log(x, z); // 10, 30
```

---

#### 59. What are Symbols used for?

`Symbol` is a primitive type that produces unique, immutable identifiers.

- **Use cases**: Hidden/non-enumerable object property keys to prevent property collisions; implementing built-in hooks (`Symbol.iterator`).

```javascript
const ID = Symbol('id');
const person = {
  name: 'Leo',
  [ID]: 'EMP-90210',
};

console.log(person[ID]); // "EMP-90210"
console.log(Object.keys(person)); // ["name"] (Symbol keys are hidden from normal iteration)
```

---

#### 60. What is optional chaining (`?.`) and nullish coalescing (`??`)?

- **Optional Chaining (`?.`)**: Safely accesses nested properties without throwing if an intermediate reference is `null` or `undefined`.
- **Nullish Coalescing (`??`)**: Fallback operator that only applies when the left-hand side is `null` or `undefined` (unlike `||`, which treats `0`, `""`, and `false` as missing).

```javascript
const user = {
  profile: {
    address: null,
  },
  settings: {
    notificationsCount: 0,
  },
};

console.log(user.profile?.address?.street); // undefined (no crash!)

// ?? vs ||
console.log(user.settings.notificationsCount ?? 10); // 0  (0 is valid!)
console.log(user.settings.notificationsCount || 10); // 10 (treats 0 as falsy)
```

---

#### 61. What are generators and the `yield` keyword?

A generator function (`function*`) can pause execution at `yield` statements and resume later when `.next()` is called, producing a sequence of values lazily.

```javascript
function* idGenerator() {
  let id = 1;
  while (id <= 3) {
    yield `ID_${id++}`;
  }
}

const gen = idGenerator();
console.log(gen.next()); // { value: 'ID_1', done: false }
console.log(gen.next()); // { value: 'ID_2', done: false }
console.log(gen.next()); // { value: 'ID_3', done: false }
console.log(gen.next()); // { value: undefined, done: true }
```

---

#### 62. What is an iterator/iterable in JavaScript?

An **iterable** is an object implementing the `[Symbol.iterator]` method, which returns an **iterator** object with a `next()` method returning `{ value, done }`.

```javascript
const customRange = {
  start: 1,
  end: 3,
  [Symbol.iterator]() {
    let current = this.start;
    const end = this.end;
    return {
      next() {
        if (current <= end) {
          return { value: current++, done: false };
        }
        return { value: undefined, done: true };
      },
    };
  },
};

for (const num of customRange) {
  console.log(num); // 1, then 2, then 3
}
```

---

#### 63. What is the difference between `Map`/`Set` and plain objects/arrays?

- **`Map`**: Keys can be **any type** (including functions, objects), retains insertion order, provides `.size` property.
- **`Set`**: Stores **unique values only**, provides fast $O(1)$ lookups via `.has()`.

```javascript
const map = new Map();
const keyObj = { id: 1 };
map.set(keyObj, 'Admin User');
console.log(map.get(keyObj)); // "Admin User"
console.log(map.size); // 1

const uniqueSet = new Set([1, 2, 2, 3]);
console.log(uniqueSet.has(2)); // true
console.log(uniqueSet.size); // 3
```

---

#### 64. What are computed property names?

Computed property names let you evaluate an expression inside brackets `[expr]` as an object key during object literal creation.

```javascript
const dynamicPrefix = 'user_';
const role = 'admin';

const permissions = {
  [`${dynamicPrefix}${role}`]: ['read', 'write', 'delete'],
};

console.log(permissions.user_admin); // ["read", "write", "delete"]
```

---

#### 65. What is exponentiation operator and other notable modern ES additions?

- **Exponentiation (`**`)**: `2 \*\* 3`is equivalent to`Math.pow(2, 3)`.
- **`Array.prototype.flat(depth)`**: Flattens nested arrays.
- **`Object.fromEntries()`**: Reconstructs an object from an array of entries.

```javascript
console.log(2 ** 4); // 16

const nested = [1, [2, [3, [4]]]];
console.log(nested.flat(2)); // [1, 2, 3, [4]]

const entries = [
  ['name', 'Ken'],
  ['age', 28],
];
console.log(Object.fromEntries(entries)); // { name: "Ken", age: 28 }
```

---

### 9. Error Handling & Edge Cases

#### 66. How does `try/catch/finally` work?

- `try`: Code block tested for errors.
- `catch(err)`: Executes if an exception is thrown in `try`.
- `finally`: Executes unconditionally after `try`/`catch`, ideal for cleanup.

```javascript
function processFile() {
  try {
    console.log('Opening connection...');
    throw new Error('Disk read failure');
  } catch (err) {
    console.error('Handling error:', err.message);
  } finally {
    console.log('Closing connection.'); // Always executes
  }
}
processFile();
```

---

#### 67. What is the difference between throwing an `Error` object vs a plain string?

Throwing an `Error` object automatically captures a **stack trace** (filename, line number, call hierarchy), whereas throwing a primitive string loses the execution context.

```javascript
// ❌ Discouraged
// throw "Something failed";

// ✅ Recommended
function validateAge(age) {
  if (age < 0) {
    throw new RangeError('Age cannot be negative');
  }
  return true;
}

try {
  validateAge(-5);
} catch (error) {
  console.log(error.name); // "RangeError"
  console.log(error.message); // "Age cannot be negative"
  console.log(error.stack); // Full stack trace
}
```

---

#### 68. What are custom error classes and why use them?

Subclassing `Error` allows you to create domain-specific error types that can be matched using `instanceof`.

```javascript
class DatabaseError extends Error {
  constructor(message, query) {
    super(message);
    this.name = 'DatabaseError';
    this.query = query;
  }
}

try {
  throw new DatabaseError('Timeout reached', 'SELECT * FROM users');
} catch (err) {
  if (err instanceof DatabaseError) {
    console.error(`DB Error on query: ${err.query}`);
  }
}
```

---

#### 69. What happens if a Promise rejection is unhandled?

If a rejected promise has no `.catch()` handler, it triggers an `unhandledrejection` event in the browser or process event in Node.js, and will terminate Node processes with a non-zero exit code.

```javascript
// In Node.js environment
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection caught globally:', reason);
});

Promise.reject(new Error('Uncaught async failure'));
```

---

### 10. Execution Context, Performance & Misc

#### 70. What is the JavaScript execution context and call stack?

An **Execution Context** is an environment in which JavaScript code evaluates (Global Execution Context or Function Execution Context). The **Call Stack** follows a LIFO (Last-In-First-Out) structure to track running execution contexts.

```javascript
function first() {
  console.log('Entering first');
  second();
  console.log('Exiting first');
}

function second() {
  console.log('Inside second');
}

first();
// Call stack order: [Global] -> [first] -> [second] -> pops [second] -> pops [first]
```

---

#### 71. What is event delegation and why is it useful?

Event delegation is a technique where you attach a **single event listener** to a parent element rather than many listeners to individual child elements, leveraging **event bubbling**.

```javascript
// Example HTML: <ul id="user-list"><li>User 1</li><li>User 2</li></ul>
const list = document.getElementById('user-list');

list.addEventListener('click', function (event) {
  if (event.target && event.target.nodeName === 'LI') {
    console.log('Clicked item text:', event.target.innerText);
  }
});
```

---

#### 72. Difference between synchronous and asynchronous code execution.

- **Synchronous**: Code executes sequentially. Each statement blocks the execution thread until finished.
- **Asynchronous**: Long-running operations execute in the background and notify the main thread via callbacks/promises when finished without freezing the UI.

```javascript
// Synchronous (Blocking)
console.log('Start');
const syncSum = [1, 2, 3].reduce((a, b) => a + b);
console.log('Sync Sum:', syncSum);

// Asynchronous (Non-blocking)
setTimeout(() => console.log('Async Task Complete'), 100);
console.log('End');
```

---

#### 73. What are pure functions and why do they matter?

A pure function satisfies two rules:

1. Returns the **exact same output** given the same arguments.
2. Produces **no side effects** (does not mutate external state, perform I/O, or modify arguments).

```javascript
// ❌ Impure function (mutates global state)
let tax = 0.05;
const calculateTotalImpure = (price) => price + price * tax;

// ✅ Pure function
const calculateTotalPure = (price, taxRate) => price + price * taxRate;
console.log(calculateTotalPure(100, 0.05)); // Always 105
```

---

#### 74. What is immutability and why is it preferred in state management?

Immutability means values cannot be modified after creation. State changes produce **new objects** rather than mutating existing ones.

- **Benefits**: Enables fast shallow reference checks (`prevObj !== nextObj`), time-travel debugging, and prevents unexpected mutations.

```javascript
const state = { user: 'Dan', preferences: { theme: 'light' } };

// ✅ Immutable update with spread
const updatedState = {
  ...state,
  preferences: {
    ...state.preferences,
    theme: 'dark',
  },
};

console.log(state.preferences.theme); // "light"
console.log(updatedState.preferences.theme); // "dark"
```

---

#### 75. What is structural sharing?

Structural sharing is a technique used in immutable data structures where unchanged nodes/branches are shared across new versions, minimizing memory overhead and cloning cost.

```javascript
const originalTree = { left: { val: 1 }, right: { val: 2 } };

// Only copy the modified branch; re-use unchanged 'right' branch reference
const updatedTree = {
  ...originalTree,
  left: { val: 10 },
};

console.log(originalTree.right === updatedTree.right); // true (Shared reference!)
```

---

#### 76. What is `strict mode` (`'use strict'`) and what does it change?

Strict mode enforces stricter parsing and error handling at runtime:

- Disallows accidental global variables (`x = 10` throws).
- Changes `this` in plain function invocations to `undefined` (instead of `window`).
- Disallows duplicate parameter names.

```javascript
'use strict';

function strictDemo() {
  // accidentalGlobal = 100; // ❌ ReferenceError: accidentalGlobal is not defined
  console.log('this is:', this); // undefined
}
strictDemo();
```

---

#### 77. Difference between `Array.prototype.some()` and `every()`.

- **`some()`**: Returns `true` if **at least one** element meets the condition.
- **`every()`**: Returns `true` only if **all** elements meet the condition.

```javascript
const scores = [65, 80, 92, 45];

const hasFailingGrade = scores.some((score) => score < 50); // true
const allPassed = scores.every((score) => score >= 50); // false
```

---

#### 78. How would you flatten a deeply nested array?

Use `Array.prototype.flat(Infinity)` or a recursive helper function.

```javascript
const deeplyNested = [1, [2, [3, [4, [5]]]]];

// Built-in
console.log(deeplyNested.flat(Infinity)); // [1, 2, 3, 4, 5]

// Custom recursive implementation
function flattenArray(arr) {
  return arr.reduce((acc, item) => acc.concat(Array.isArray(item) ? flattenArray(item) : item), []);
}
console.log(flattenArray(deeplyNested)); // [1, 2, 3, 4, 5]
```

---

#### 79. What is tree-shaking and how does it relate to ES Modules?

Tree-shaking is a dead-code elimination process where bundlers (Webpack, Vite, Rollup) remove unused exports from the final production bundle.

- It relies on the static structure of ES Module `import`/`export` syntax.

```javascript
// mathUtils.js
export const add = (a, b) => a + b;
export const unusedHeavyFunction = () => {
  /* 500 lines */
};

// main.js
import { add } from './mathUtils.js';
console.log(add(2, 3));
// Bundler automatically strips 'unusedHeavyFunction' from bundle!
```

---

#### 80. Difference between imperative and declarative programming.

- **Imperative**: Focuses on explicitly describing **how** to achieve a result step by step.
- **Declarative**: Focuses on describing **what** result is desired, abstracting the internal mechanics.

```javascript
const numbers = [1, 2, 3, 4, 5];

// Imperative (Step-by-step instructions)
const doubledImperative = [];
for (let i = 0; i < numbers.length; i++) {
  doubledImperative.push(numbers[i] * 2);
}

// Declarative (Focus on outcome)
const doubledDeclarative = numbers.map((n) => n * 2);
```

---

# 💙 TypeScript (29 Questions)

---

### 1. Core Types & Fundamentals

#### 1. What is TypeScript and what problem does it solve?

TypeScript is a strongly typed superset of JavaScript that compiles to plain JavaScript.

- **Solves**: Catches type errors at compile time before production, improves developer tooling (autocomplete, inline documentation, refactoring safety), and provides static self-documenting contracts.

```typescript
interface User {
  id: number;
  name: string;
}

function printUser(user: User): string {
  return `User #${user.id}: ${user.name}`;
}

// printUser({ id: "10" }); // ❌ Compile-time error: Type 'string' is not assignable to type 'number'
```

---

#### 2. Difference between `interface` and `type`.

- **`interface`**: Can be merged (declaration merging), ideal for object shapes and public library APIs, supports `extends`.
- **`type`**: Supports unions (`A | B`), primitives, tuples, intersections, and mapped types. Cannot be reopened for merging.

```typescript
// Interface supports declaration merging
interface Point {
  x: number;
}
interface Point {
  y: number;
}
const p: Point = { x: 10, y: 20 }; // Merged!

// Type alias is versatile for unions and primitives
type Status = 'pending' | 'success' | 'error';
type ID = string | number;
```

---

#### 3. What are generics in TypeScript?

Generics allow writing flexible, reusable functions, interfaces, and classes that work across various types while retaining complete type safety.

```typescript
function wrapInArray<T>(item: T): T[] {
  return [item];
}

const numArr = wrapInArray(42); // Inferred as number[]
const strArr = wrapInArray('hello'); // Inferred as string[]
```

---

#### 4. What is the `any` type and why should it be avoided?

`any` completely disables TypeScript's type checking for a variable, allowing any property access or method invocation. Overusing `any` undermines TypeScript's type safety.

```typescript
let value: any = 'hello';
value.nonExistentMethod(); // ❌ Compiles without warning, but crashes at runtime!
```

---

#### 5. Difference between `any` and `unknown`.

- **`any`**: Opts out of all type checking.
- **`unknown`**: Type-safe counterpart to `any`. Accepts any value, but **requires type narrowing/checking** before performing any operations.

```typescript
let data: unknown = 'Welcome to TS';

// data.toUpperCase(); // ❌ Error: Object is of type 'unknown'

if (typeof data === 'string') {
  console.log(data.toUpperCase()); // ✅ Safe: Narrowed to string
}
```

---

#### 6. What are union and intersection types?

- **Union (`|`)**: A value can be one of several types.
- **Intersection (`&`)**: Combines multiple types into one entity that must satisfy all members.

```typescript
// Union
type ID = string | number;

// Intersection
interface HasName {
  name: string;
}
interface HasAge {
  age: number;
}
type Person = HasName & HasAge;

const worker: Person = { name: 'Mark', age: 30 };
```

---

#### 7. What are type guards?

Type guards are expressions used in conditional logic that narrow down a broader type to a more specific type (e.g., `typeof`, `instanceof`, `in`, equality).

```typescript
function formatInput(input: string | number) {
  if (typeof input === 'string') {
    return input.trim(); // Narrowed to string
  }
  return input.toFixed(2); // Narrowed to number
}
```

---

#### 8. What is a type predicate?

A type predicate is a return type annotation of the form `parameterName is Type` used in custom type guard functions.

```typescript
interface Cat {
  meow: () => void;
}
interface Dog {
  bark: () => void;
}

function isCat(animal: Cat | Dog): animal is Cat {
  return (animal as Cat).meow !== undefined;
}

function makeSound(pet: Cat | Dog) {
  if (isCat(pet)) {
    pet.meow(); // Narrowed to Cat
  } else {
    pet.bark(); // Narrowed to Dog
  }
}
```

---

#### 9. What are enums in TypeScript?

Enums allow developers to define a set of named constants.

```typescript
enum Direction {
  Up = 'UP',
  Down = 'DOWN',
  Left = 'LEFT',
  Right = 'RIGHT',
}

const move = Direction.Up;
```

---

#### 10. Difference between numeric enums and string enums.

- **Numeric Enums**: Auto-increment values starting from 0 and support reverse mapping (`Enum[0]` -> `"Key"`).
- **String Enums**: Require explicit string values, provide better debugging readability, but have no reverse mapping.

```typescript
// Numeric enum with reverse mapping
enum StatusNumeric {
  Active, // 0
  Inactive, // 1
}
console.log(StatusNumeric[0]); // "Active"

// String enum
enum StatusString {
  Active = 'ACTIVE',
  Inactive = 'INACTIVE',
}
console.log(StatusString.Active); // "ACTIVE"
```

---

### 2. Generics & Utility Types

#### 11. What are utility types?

Built-in generic transformations that construct new types from existing types. Common utility types include `Partial`, `Required`, `Readonly`, `Record`, `Pick`, and `Omit`.

```typescript
interface Todo {
  title: string;
  description: string;
  completed: boolean;
}

type TodoPreview = Pick<Todo, 'title' | 'completed'>;
type TodoWithoutDesc = Omit<Todo, 'description'>;
type ReadonlyTodo = Readonly<Todo>;
```

---

#### 12. What is `Partial<T>` used for, with an example?

`Partial<T>` converts all properties of type `T` to optional (`?`). Commonly used for update/patch operations.

```typescript
interface UserProfile {
  id: string;
  name: string;
  email: string;
}

function updateUser(id: string, updates: Partial<UserProfile>) {
  console.log(`Updating ${id}:`, updates);
}

updateUser('usr_1', { name: 'New Name' }); // ✅ Allowed: email is optional
```

---

#### 13. What are mapped types?

Mapped types create new types by iterating over keys of an existing type using the `[K in keyof T]` syntax.

```typescript
interface Flags {
  darkMode: boolean;
  betaFeatures: boolean;
}

// Make all properties nullable
type Nullable<T> = {
  [K in keyof T]: T[K] | null;
};

type NullableFlags = Nullable<Flags>;
// Result: { darkMode: boolean | null; betaFeatures: boolean | null; }
```

---

#### 14. What are conditional types?

Conditional types choose one of two types based on a condition matching the ternary syntax: `T extends U ? X : Y`.

```typescript
type IsString<T> = T extends string ? 'Yes' : 'No';

type A = IsString<string>; // "Yes"
type B = IsString<number>; // "No"

// Extracting array element type using infer
type ElementType<T> = T extends (infer U)[] ? U : T;
type NumType = ElementType<number[]>; // number
```

---

#### 15. What does the `keyof` operator do?

`keyof` produces a union of string or numeric literal types representing the keys of a given type.

```typescript
interface Car {
  make: string;
  model: string;
  year: number;
}

type CarKeys = keyof Car; // "make" | "model" | "year"

function getProperty<T, K extends keyof T>(obj: T, key: K): T[K] {
  return obj[key];
}

const myCar: Car = { make: 'Toyota', model: 'Corolla', year: 2022 };
console.log(getProperty(myCar, 'make')); // "Toyota"
```

---

#### 16. What is the difference between `readonly` properties and `const`?

- **`const`**: Applied to variable declarations, preventing variable reassignment.
- **`readonly`**: Applied to object properties or arrays in TypeScript types, preventing property mutation after initialization.

```typescript
interface Book {
  readonly isbn: string;
  title: string;
}

const book: Book = { isbn: '978-0-13-235088-4', title: 'Clean Code' };
book.title = 'Refactoring'; // ✅ Allowed
// book.isbn = "123";       // ❌ Error: Cannot assign to 'isbn' because it is a read-only property
```

---

#### 17. What are tuples in TypeScript?

Tuples are arrays with a fixed number of elements whose types are known at specific index positions.

```typescript
let responseStatus: [number, string];
responseStatus = [200, 'OK']; // ✅ Valid
// responseStatus = ["OK", 200]; // ❌ Error: Type mismatch at index 0 and 1
```

---

#### 18. What is declaration merging?

Declaration merging occurs when the TypeScript compiler merges two separate declarations with the exact same name into a single definition.

```typescript
interface Cart {
  items: string[];
}
interface Cart {
  total: number;
}

// Resulting Cart type has both 'items' and 'total'
const myCart: Cart = {
  items: ['Apples', 'Oranges'],
  total: 4.5,
};
```

---

### 3. Advanced Types, Classes & Runtime

#### 19. What are decorators in TypeScript?

Decorators are special declarations prefixed with `@expression` that can be attached to classes, methods, accessors, properties, or parameters to modify or add metadata to behavior.

```typescript
function LogExecution(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
  const originalMethod = descriptor.value;
  descriptor.value = function (...args: any[]) {
    console.log(`Executing ${propertyKey} with args:`, args);
    return originalMethod.apply(this, args);
  };
}

class Calculator {
  @LogExecution
  add(a: number, b: number) {
    return a + b;
  }
}
```

---

#### 20. Difference between an abstract class and an interface.

- **Abstract Class**: Can contain both implemented methods and abstract method declarations. Cannot be instantiated directly.
- **Interface**: Pure contract with zero implementation code (erased at compile time).

```typescript
abstract class BaseRepository<T> {
  abstract findById(id: string): T;

  logAccess(id: string): void {
    console.log(`Accessing record: ${id}`);
  }
}

interface IRepository<T> {
  findById(id: string): T;
}
```

---

#### 21. What is module augmentation?

Module augmentation lets you add new property/method declarations to existing modules or third-party packages without modifying their source code.

```typescript
// Augmenting Express Request object
declare global {
  namespace Express {
    interface Request {
      currentUser?: { id: string; role: string };
    }
  }
}
```

---

#### 22. What are namespaces and how do they compare to ES modules?

Namespaces are a legacy TypeScript-specific way to organize code into global scopes (`namespace Utils { ... }`). In modern development, standard **ES Modules (`import`/`export`)** are preferred.

```typescript
// Modern ESM approach (Preferred)
export function sanitize(input: string): string {
  return input.trim();
}
```

---

#### 23. What is type assertion (`as`) and when is it appropriate?

Type assertion tells the TypeScript compiler to treat an expression as a specific type. It does not perform any runtime verification.

- **Appropriate**: When you have more accurate information about a type than the compiler (e.g., querying DOM elements).

```typescript
const inputElement = document.getElementById('search-input') as HTMLInputElement;
console.log(inputElement.value); // Valid because HTMLInputElement has .value
```

---

#### 24. What is the `satisfies` operator and why was it introduced?

Introduced in TypeScript 4.9, `satisfies` verifies that an expression matches a given type **without widening or losing the specific literal inferred type**.

```typescript
type Color = string | { r: number; g: number; b: number };

const palette = {
  primary: 'red',
  secondary: { r: 0, g: 255, b: 0 },
} satisfies Record<string, Color>;

// Inferred precisely as string, preserving string methods!
palette.primary.toUpperCase(); // ✅ Works! (No union type widening)
```

---

#### 25. What is structural typing (duck typing) in TypeScript?

TypeScript checks type compatibility based on the **structure and shape** of values rather than explicit nominal declarations or inheritance.

```typescript
interface Point2D {
  x: number;
  y: number;
}

class Vector {
  constructor(
    public x: number,
    public y: number,
    public name: string,
  ) {}
}

const v = new Vector(10, 20, 'velocity');
const p: Point2D = v; // ✅ Allowed because 'v' has compatible 'x' and 'y' properties
```

---

#### 26. What does `strict` mode in `tsconfig.json` enable?

Enabling `"strict": true` activates a suite of strict type-checking flags including:

- `strictNullChecks`
- `noImplicitAny`
- `strictFunctionTypes`
- `strictBindCallApply`
- `strictPropertyInitialization`

---

#### 27. What is `strictNullChecks` and why is it important?

When enabled, `null` and `undefined` are not assignable to other types unless explicitly included in a union (`string | null`), preventing runtime `"Cannot read properties of undefined"` errors.

```typescript
let title: string;
// title = null; // ❌ Error with strictNullChecks enabled

let nullableTitle: string | null = null; // ✅ Explicit union required
```

---

#### 28. How do generics with constraints work (`extends` in generics)?

Using `extends` inside generic parameters restricts allowed types to those matching a required structure.

```typescript
interface HasLength {
  length: number;
}

function logLength<T extends HasLength>(item: T): number {
  return item.length;
}

console.log(logLength('Hello')); // 5
console.log(logLength([1, 2, 3, 4])); // 4
// logLength(123);                   // ❌ Error: number has no 'length' property
```

---

#### 29. Difference between compile-time type checking and runtime validation (e.g. Zod).

- **TypeScript**: Types are completely erased during compilation and offer **zero runtime validation**.
- **Runtime Validation (Zod, Yup)**: Parses and validates dynamic external data (e.g., API responses, user inputs) at runtime and infers static TypeScript types.

```typescript
import { z } from 'zod';

// Runtime schema definition
const UserSchema = z.object({
  id: z.number(),
  name: z.string().min(1),
  email: z.string().email(),
});

// Infer static TypeScript type
type User = z.infer<typeof UserSchema>;

// Validate runtime data safely
function handleIncomingApiData(rawData: unknown): User {
  return UserSchema.parse(rawData); // Throws if schema is violated
}
```

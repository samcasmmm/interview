# ⚛️ React & Next.js Interview Master Guide

> A comprehensive study guide containing **100 in-depth interview questions and code examples** covering React fundamentals, modern hooks, Concurrent Mode, React Server Components (RSC), App Router architecture, caching strategies, and performance optimizations.

---

## 📑 Table of Contents

- [React (70 Questions)](#-react-70-questions)
  - [1. Fundamentals & JSX (Q1–Q10)](#1-fundamentals--jsx)
  - [2. Hooks Deep Dive (Q11–Q25)](#2-hooks-deep-dive)
  - [3. Lifecycle, Rendering & Virtual DOM (Q26–Q35)](#3-lifecycle-rendering--virtual-dom)
  - [4. State Management & Data Flow (Q36–Q40)](#4-state-management--data-flow)
  - [5. Performance Optimization (Q41–Q46)](#5-performance-optimization)
  - [6. Forms, Events & Refs (Q47–Q50)](#6-forms-events--refs)
  - [7. Advanced Patterns & React 18/19 Features (Q51–Q59)](#7-advanced-patterns--react-1819-features)
  - [8. Testing, Tooling & Architecture (Q60–Q70)](#8-testing-tooling--architecture)
- [Next.js (30 Questions)](#-nextjs-30-questions)
  - [1. Core Architecture & Rendering Modes (Q1–Q10)](#1-core-architecture--rendering-modes)
  - [2. Data Fetching, Caching & Streaming (Q11–Q17)](#2-data-fetching-caching--streaming)
  - [3. Routing, Layouts & Middleware (Q18–Q23)](#3-routing-layouts--middleware)
  - [4. Optimization & Assets (Q24–Q26)](#4-optimization--assets)
  - [5. Deployment, Runtimes & Config (Q27–Q30)](#5-deployment-runtimes--config)

---

# ⚛️ React (70 Questions)

---

### 1. Fundamentals & JSX

#### 1. What is React and what problem does it solve?
React is a declarative, component-based JavaScript library for building user interfaces.
- **Problem solved**: Directly mutating the DOM with vanilla JS (`document.getElementById`, `innerHTML`) is slow, error-prone, and difficult to keep in sync with application state. React introduces declarative component state and an in-memory Virtual DOM to calculate the minimal set of real DOM updates required.

```jsx
// Declarative UI: Describe WHAT should be rendered based on state
function Counter() {
  const [count, setCount] = React.useState(0);

  return (
    <div>
      <p>Current count: {count}</p>
      <button onClick={() => setCount(count + 1)}>Increment</button>
    </div>
  );
}
```

---

#### 2. What is JSX?
JSX (JavaScript XML) is a syntax extension for JavaScript that allows you to write HTML-like markup inside JS files. Under the hood, transpilers (Babel, SWC) convert JSX into standard `React.createElement()` or `_jsx()` calls.

```jsx
// What you write (JSX):
const element = <h1 className="title">Hello World</h1>;

// What it compiles to (JS):
const compiled = React.createElement("h1", { className: "title" }, "Hello World");
```

---

#### 3. What is the Virtual DOM and how does it improve performance?
The Virtual DOM (VDOM) is a lightweight, in-memory tree representation of the actual DOM elements.
1. When state changes, React constructs a **new Virtual DOM tree**.
2. It compares this new tree with the previous snapshot (**Diffing / Reconciliation algorithm**).
3. It computes the smallest set of patches needed and batches writes to the real DOM (**Commit phase**).

```jsx
// Diffing example:
// Previous VDOM: <div className="box"><p>Count: 1</p></div>
// Next VDOM:     <div className="box"><p>Count: 2</p></div>
// React only updates the innerText of the <p> node in the real DOM, leaving <div> untouched.
```

---

#### 4. What is the difference between a React Element and a Component?
- **React Element**: An immutable plain JavaScript object describing a DOM node or component (`{ type: 'h1', props: { children: 'Hello' } }`).
- **React Component**: A function or class that accepts props and returns a tree of React Elements.

```jsx
// Component (Function Blueprint)
function Welcome({ name }) {
  return <h1>Hello, {name}</h1>;
}

// React Element (Plain JS Object describing instance)
const welcomeElement = <Welcome name="Alice" />;
console.log(welcomeElement);
// Output: { type: Welcome, props: { name: "Alice" }, ... }
```

---

#### 5. What is the difference between props and state?
- **Props (Properties)**: Read-only inputs passed down from parent to child to configure the component (immutable to the receiver).
- **State**: Mutable data encapsulated and managed internally within a component that triggers a re-render upon change.

```jsx
function UserCard({ username }) { // username is a prop (read-only)
  const [likes, setLikes] = React.useState(0); // likes is local state

  return (
    <div className="card">
      <h3>{username}</h3>
      <button onClick={() => setLikes(l => l + 1)}>Likes: {likes}</button>
    </div>
  );
}
```

---

#### 6. What are controlled vs uncontrolled components?
- **Controlled Component**: Form input value is driven strictly by React state (`value` + `onChange`). React is the single source of truth.
- **Uncontrolled Component**: Form input value is managed by the browser DOM itself and accessed imperatively using a `ref`.

```jsx
function FormComparison() {
  // 1. Controlled Input
  const [text, setText] = React.useState("");

  // 2. Uncontrolled Input
  const inputRef = React.useRef(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Controlled:", text);
    console.log("Uncontrolled:", inputRef.current.value);
  };

  return (
    <form onSubmit={handleSubmit}>
      <input value={text} onChange={(e) => setText(e.target.value)} placeholder="Controlled" />
      <input ref={inputRef} defaultValue="Initial" placeholder="Uncontrolled" />
      <button type="submit">Submit</button>
    </form>
  );
}
```

---

#### 7. What is the significance of keys in lists?
Keys provide a stable identity for list items across renders. During reconciliation, React uses keys to match existing DOM elements with new items to determine whether an element was added, removed, or reordered.
- **Rule**: Avoid array indices as keys when items can be filtered, sorted, inserted, or deleted.

```jsx
function TodoList({ todos }) {
  return (
    <ul>
      {todos.map(todo => (
        // ✅ Use unique and stable IDs
        <li key={todo.id}>{todo.text}</li>
      ))}
    </ul>
  );
}
```

---

#### 8. What are React Fragments and why use them?
React Fragments (`<React.Fragment>` or shorthand `<>...</>`) let you group a list of children without adding extra wrapper nodes (e.g. `<div>`) to the DOM tree, keeping the HTML semantic and styling intact (e.g. for flexbox or tables).

```jsx
function TableColumns() {
  return (
    <>
      <td>Column 1</td>
      <td>Column 2</td>
    </>
  );
}
```

---

#### 9. What is prop drilling and how can it be avoided?
Prop drilling occurs when data is passed through several layers of intermediate components that do not need the data, solely to deliver it to a deeply nested child.
- **Solutions**: Context API, Component Composition (passing elements as props/children), or state management libraries (Zustand, Redux).

```jsx
// Avoiding prop drilling with Component Composition
function Layout({ header, content, sidebar }) {
  return (
    <div>
      <header>{header}</header>
      <main>{content}</main>
      <aside>{sidebar}</aside>
    </div>
  );
}
```

---

#### 10. What is composition vs inheritance in React?
React strongly favors **Composition** over Inheritance. Instead of extending classes, you build flexible components by combining smaller components via `props` and `children`.

```jsx
// Base Dialog (Container Component)
function Modal({ title, children, footer }) {
  return (
    <div className="modal-backdrop">
      <div className="modal">
        <h2>{title}</h2>
        <div className="modal-body">{children}</div>
        <div className="modal-footer">{footer}</div>
      </div>
    </div>
  );
}

// Composed Specific Component
function ConfirmationModal({ onConfirm, onCancel }) {
  return (
    <Modal
      title="Confirm Delete"
      footer={
        <>
          <button onClick={onCancel}>Cancel</button>
          <button onClick={onConfirm}>Delete</button>
        </>
      }
    >
      <p>Are you sure you want to delete this record permanently?</p>
    </Modal>
  );
}
```

---

### 2. Hooks Deep Dive

#### 11. What is `useState` and how does it work?
`useState` declares a local state variable and returns an array of two elements: `[currentState, updaterFunction]`. Calling the updater triggers a re-render with the new state.
- **Functional updates** (`setCount(prev => prev + 1)`) should be used when the new state depends on the previous state.

```jsx
function Counter() {
  const [count, setCount] = React.useState(0);

  const incrementBatch = () => {
    // Correct way to queue multiple updates safely
    setCount(prev => prev + 1);
    setCount(prev => prev + 1);
    setCount(prev => prev + 1);
  };

  return <button onClick={incrementBatch}>Count: {count}</button>;
}
```

---

#### 12. What is `useEffect` used for, and how does the dependency array work?
`useEffect` lets you perform side effects (data fetching, subscriptions, DOM manipulation, timers) in functional components after rendering.
- `useEffect(fn)`: Runs after **every** render.
- `useEffect(fn, [])`: Runs **once** after the initial mount.
- `useEffect(fn, [dep1, dep2])`: Runs on mount and whenever `dep1` or `dep2` changes.

```jsx
function UserProfile({ userId }) {
  const [user, setUser] = React.useState(null);

  React.useEffect(() => {
    let isCancelled = false;

    fetch(`/api/users/${userId}`)
      .then(res => res.json())
      .then(data => {
        if (!isCancelled) setUser(data);
      });

    return () => {
      isCancelled = true; // Cleanup on unmount or userId change
    };
  }, [userId]); // Only re-runs if userId changes

  return <div>{user ? user.name : "Loading..."}</div>;
}
```

---

#### 13. What is the cleanup function in `useEffect`?
The function returned from `useEffect` runs before the component unmounts and before every subsequent execution of the effect when dependencies change. It is used to clean up subscriptions, event listeners, and timers to prevent memory leaks.

```jsx
function WindowResizeTracker() {
  const [width, setWidth] = React.useState(window.innerWidth);

  React.useEffect(() => {
    const handleResize = () => setWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);

    // Cleanup function
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return <p>Window Width: {width}px</p>;
}
```

---

#### 14. Difference between `useEffect` and `useLayoutEffect`.
- **`useEffect`**: Runs **asynchronously after the browser paints** the screen. Does not block UI painting (best for data fetching, event listeners).
- **`useLayoutEffect`**: Runs **synchronously after DOM mutations but before the browser paints**. Used for measuring DOM elements (scroll position, layout dimensions) to prevent visual flickering.

```jsx
function TooltipPositioner({ anchorRef }) {
  const [coords, setCoords] = React.useState({ top: 0, left: 0 });

  React.useLayoutEffect(() => {
    // Measure DOM synchronously before user sees paint
    const rect = anchorRef.current.getBoundingClientRect();
    setCoords({ top: rect.bottom + 5, left: rect.left });
  }, [anchorRef]);

  return <div style={{ position: "absolute", top: coords.top, left: coords.left }}>Tooltip</div>;
}
```

---

#### 15. What is `useMemo` and when should you use it?
`useMemo` caches the calculated result of an expensive function between renders, recomputing it only when designated dependencies change.

```jsx
function FilteredProductList({ products, searchFilter }) {
  // Expensive sorting & filtering calculation cached
  const visibleProducts = React.useMemo(() => {
    console.log("Filtering products...");
    return products.filter(p => p.name.toLowerCase().includes(searchFilter.toLowerCase()));
  }, [products, searchFilter]);

  return (
    <ul>
      {visibleProducts.map(p => <li key={p.id}>{p.name}</li>)}
    </ul>
  );
}
```

---

#### 16. What is `useCallback` and how does it differ from `useMemo`?
- **`useMemo`**: Memoizes the **result value** of a function call.
- **`useCallback`**: Memoizes the **function reference itself** to prevent child components wrapped in `React.memo` from re-rendering due to new function references on every render.

```jsx
const ChildButton = React.memo(({ onClick, label }) => {
  console.log(`Rendered: ${label}`);
  return <button onClick={onClick}>{label}</button>;
});

function ParentContainer() {
  const [count, setCount] = React.useState(0);

  // Function reference is preserved across renders
  const handleClick = React.useCallback(() => {
    console.log("Button clicked");
  }, []);

  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => setCount(c => c + 1)}>Re-render Parent</button>
      <ChildButton onClick={handleClick} label="Fixed Button" />
    </div>
  );
}
```

---

#### 17. What is `useRef` used for?
`useRef` returns a mutable object `{ current: initialValue }` that persists across all renders.
1. **Direct DOM access** (focus, scroll, measurement).
2. **Holding mutable values** that do not trigger a re-render when changed (e.g. interval IDs, previous state snapshots).

```jsx
function AutoFocusTextInput() {
  const inputEl = React.useRef(null);
  const timerRef = React.useRef(null);

  const handleStartTimer = () => {
    timerRef.current = setInterval(() => console.log("Tick"), 1000);
  };

  const handleFocus = () => {
    inputEl.current.focus();
  };

  return (
    <div>
      <input ref={inputEl} type="text" />
      <button onClick={handleFocus}>Focus Input</button>
      <button onClick={handleStartTimer}>Start Timer</button>
    </div>
  );
}
```

---

#### 18. What is `useContext` and how does it help avoid prop drilling?
`useContext` allows a component to subscribe directly to a React Context value without passing props through intermediate components.

```jsx
const ThemeContext = React.createContext("light");

function ThemedButton() {
  const theme = React.useContext(ThemeContext);
  return <button className={`btn-${theme}`}>Theme: {theme}</button>;
}

function App() {
  return (
    <ThemeContext.Provider value="dark">
      <ThemedButton />
    </ThemeContext.Provider>
  );
}
```

---

#### 19. What are custom hooks and why write one?
Custom hooks are JavaScript functions prefixed with `use` that can call other built-in React hooks. They encapsulate and share stateful logic across multiple components.

```jsx
// Custom Hook for Debouncing Values
function useDebounce(value, delay) {
  const [debouncedValue, setDebouncedValue] = React.useState(value);

  React.useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);

  return debouncedValue;
}

// Usage
function SearchBar() {
  const [query, setQuery] = React.useState("");
  const debouncedQuery = useDebounce(query, 500);

  React.useEffect(() => {
    if (debouncedQuery) {
      console.log("Searching API for:", debouncedQuery);
    }
  }, [debouncedQuery]);

  return <input value={query} onChange={e => setQuery(e.target.value)} />;
}
```

---

#### 20. What are the Rules of Hooks?
1. **Only call hooks at the top level**: Never call hooks inside loops, conditional statements, or nested functions. This guarantees that hooks are called in the exact same order on every render.
2. **Only call hooks from React functions**: Call them from React function components or custom hooks, not plain JS helper functions.

---

#### 21. What is `useReducer` and when is it preferable to `useState`?
`useReducer(reducer, initialState)` handles complex state transitions involving multiple sub-values or when the next state depends on complex rules.

```jsx
const initialState = { count: 0, step: 1 };

function reducer(state, action) {
  switch (action.type) {
    case "increment":
      return { ...state, count: state.count + state.step };
    case "setStep":
      return { ...state, step: action.payload };
    case "reset":
      return initialState;
    default:
      return state;
  }
}

function CounterWithStep() {
  const [state, dispatch] = React.useReducer(reducer, initialState);

  return (
    <div>
      <p>Count: {state.count}</p>
      <button onClick={() => dispatch({ type: "increment" })}>+</button>
      <input 
        type="number" 
        value={state.step} 
        onChange={e => dispatch({ type: "setStep", payload: Number(e.target.value) })} 
      />
    </div>
  );
}
```

---

#### 22. What is `useImperativeHandle` used for?
`useImperativeHandle` customizes the instance value exposed to parent components when using `ref` with `React.forwardRef`.

```jsx
const CustomInput = React.forwardRef((props, ref) => {
  const realInputRef = React.useRef();

  React.useImperativeHandle(ref, () => ({
    focusAndClear: () => {
      realInputRef.current.focus();
      realInputRef.current.value = "";
    }
  }));

  return <input ref={realInputRef} {...props} />;
});

function Parent() {
  const inputRef = React.useRef();
  return (
    <div>
      <CustomInput ref={inputRef} />
      <button onClick={() => inputRef.current.focusAndClear()}>Reset Input</button>
    </div>
  );
}
```

---

#### 23. What is `useId` used for?
`useId` generates a stable, unique ID across both server and client renders, preventing hydration mismatch warnings when creating accessible form associations (`htmlFor` + `id`).

```jsx
function AccessibleField({ label }) {
  const id = React.useId();

  return (
    <div>
      <label htmlFor={id}>{label}</label>
      <input id={id} type="text" />
    </div>
  );
}
```

---

#### 24. What is `useTransition` and what problem does it solve?
`useTransition` is a Concurrent React hook that marks state updates as non-urgent transitions. This allows urgent updates (like typing in a text field) to interrupt non-urgent rendering work (like filtering a 10,000-item table), keeping the UI responsive.

```jsx
function FilterableList({ items }) {
  const [query, setQuery] = React.useState("");
  const [filteredItems, setFilteredItems] = React.useState(items);
  const [isPending, startTransition] = React.useTransition();

  const handleSearch = (e) => {
    const value = e.target.value;
    setQuery(value); // Urgent update (updates text field immediately)

    startTransition(() => {
      // Non-urgent update (can be interrupted)
      setFilteredItems(items.filter(item => item.includes(value)));
    });
  };

  return (
    <div>
      <input value={query} onChange={handleSearch} placeholder="Type to search..." />
      {isPending && <p>Loading list...</p>}
      <ul>
        {filteredItems.map((item, idx) => <li key={idx}>{item}</li>)}
      </ul>
    </div>
  );
}
```

---

#### 25. What is `useDeferredValue`?
`useDeferredValue(value)` accepts a value and returns a deferred version of that value that "lags behind" during high-priority rendering updates, similar to debouncing but integrated with React's concurrency scheduler.

```jsx
function SearchResults({ query }) {
  const deferredQuery = React.useDeferredValue(query);
  const isStale = query !== deferredQuery;

  return (
    <div style={{ opacity: isStale ? 0.5 : 1 }}>
      <HeavyList query={deferredQuery} />
    </div>
  );
}
```

---

### 3. Lifecycle, Rendering & Virtual DOM

#### 26. What are the phases of a React component's lifecycle?
In modern function components:
1. **Mount**: Initial render executes; DOM nodes are created; `useEffect` with `[]` executes.
2. **Update**: State or props change; component re-renders; DOM diffs and commits; `useEffect` with changed dependencies runs.
3. **Unmount**: Component is removed from DOM; effect cleanup functions execute.

---

#### 27. What causes a component to re-render?
A component re-renders when:
1. Its **local state changes** (`useState` setter or `useReducer` dispatch).
2. Its **parent component re-renders** (by default all child components re-render unless wrapped in `React.memo`).
3. A **Context value it consumes changes** via `useContext`.
4. Its **props change** referentially.

---

#### 28. What is reconciliation?
Reconciliation is React's algorithm for diffing two Virtual DOM trees to determine which parts of the real DOM need to be updated.
- **Key Heuristics**:
  - Two elements of different types produce different trees (old tree is unmounted and replaced).
  - Keys allow matching children in dynamic lists across re-renders.

---

#### 29. What is `React.memo` and when should you use it?
`React.memo` is a higher-order component that wraps a functional component. It skips re-rendering if its props have not shallowly changed.

```jsx
const ExpensiveCard = React.memo(function ExpensiveCard({ title, stats }) {
  console.log("Rendered ExpensiveCard");
  return <div>{title}: {stats.total}</div>;
});
```

---

#### 30. What is the difference between `React.memo` and `useMemo`?
- **`React.memo`**: Memoizes an entire **component** based on shallow prop comparisons.
- **`useMemo`**: Memoizes a specific **computed value** inside a component.

---

#### 31. Why does React re-render child components even if their props didn't change?
By default, React recursively re-renders the entire subtree under a parent component when that parent updates. This design guarantees UI consistency. To prevent child re-renders when props haven't changed, wrap the child with `React.memo` and ensure passed callbacks and objects have stable references (`useCallback`, `useMemo`).

---

#### 32. What is an Error Boundary?
An Error Boundary is a class component that implements `componentDidCatch` or `getDerivedStateFromError`. It catches JavaScript errors anywhere in its child component tree, logs the error, and displays a fallback UI instead of crashing the whole application.

```jsx
class ErrorBoundary extends React.Component {
  state = { hasError: false, error: null };

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Error boundary caught:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return <h2>Something went wrong: {this.state.error?.message}</h2>;
    }
    return this.props.children;
  }
}
```

---

#### 33. What are portals in React?
`ReactDOM.createPortal(children, domNode)` lets you render child elements into a different DOM subtree outside of the parent component hierarchy (e.g. into `document.body`), while preserving React event bubbling and Context access.

```jsx
function ModalPortal({ children }) {
  return ReactDOM.createPortal(
    <div className="modal-overlay">{children}</div>,
    document.getElementById("modal-root") || document.body
  );
}
```

---

#### 34. What is the difference between class components and function components?
- **Class Components**: Use `class`, `this.state`, and lifecycle methods (`componentDidMount`, `componentDidUpdate`).
- **Function Components**: Use plain functions and **Hooks** (`useState`, `useEffect`). They result in cleaner code, easier logic reuse, and better tree-shaking.

---

#### 35. Why shouldn't you use array index as a key for dynamic lists?
Using the index as a key ties element identity to array position. If items are inserted, deleted, or reordered, React matches DOM nodes to the wrong stateful child elements, leading to broken animations and input state corruption.

```jsx
// ❌ Bug prone if items are reordered or removed:
items.map((item, index) => <InputItem key={index} data={item} />);

// ✅ Safe:
items.map(item => <InputItem key={item.uniqueId} data={item} />);
```

---

### 4. State Management & Data Flow

#### 36. What is the Context API and its limitations?
Context shares data across the component tree without prop drilling.
- **Limitation**: Any update to the context value triggers a re-render in **every** component that calls `useContext(MyContext)`, even if the component only uses an unchanged slice of the value.

---

#### 37. When would you choose Zustand / Redux over Context API?
- **Choose Zustand / Redux when**:
  - State updates frequently (e.g., streaming data, live charts, high-frequency forms).
  - Components need **fine-grained selector subscriptions** (`useStore(state => state.user.name)`) to avoid re-rendering on other property changes.
  - You need middleware (logging, persistence, devtools time-travel).

```javascript
// Zustand fine-grained selector
import create from 'zustand';

const useStore = create(set => ({
  count: 0,
  text: "Hello",
  inc: () => set(state => ({ count: state.count + 1 }))
}));

function CounterDisplay() {
  // Only re-renders when count changes; ignores text changes
  const count = useStore(state => state.count);
  return <h1>{count}</h1>;
}
```

---

#### 38. What is "lifting state up"?
Lifting state up is moving state to the closest common ancestor of two or more components that need to share that state, allowing them to coordinate via props and callbacks.

```jsx
function TemperatureCalculator() {
  const [temperature, setTemperature] = React.useState("");

  return (
    <div>
      <TemperatureInput scale="c" temp={temperature} onTempChange={setTemperature} />
      <TemperatureInput scale="f" temp={temperature} onTempChange={setTemperature} />
    </div>
  );
}
```

---

#### 39. What is unidirectional data flow in React?
Data flows in a single downward direction: from parents to children via `props`. Children communicate state changes back up by triggering callback functions passed as props, making data changes traceable and predictable.

---

#### 40. What are derived state issues and why is `getDerivedStateFromProps` discouraged?
Duplicating props into state creates two sources of truth that can easily fall out of sync.
- **Best Practice**: Compute values on the fly during render or with `useMemo`.

```jsx
// ❌ Anti-pattern: Syncing prop to local state
// const [fullName, setFullName] = useState(props.firstName + ' ' + props.lastName);

// ✅ Best Practice: Compute directly during render
function UserBadge({ firstName, lastName }) {
  const fullName = `${firstName} ${lastName}`;
  return <span>{fullName}</span>;
}
```

---

### 5. Performance Optimization

#### 41. What are common causes of unnecessary re-renders in React?
1. Passing newly created inline object/array literals or arrow functions as props to components wrapped in `React.memo`.
2. Broad Context updates without splitting contexts.
3. Placing state high up in the tree when only a small leaf component needs it.

---

#### 42. What is code splitting and how is it done in React?
Code splitting divides large JavaScript bundles into smaller chunks loaded on demand. In React, this is achieved using dynamic `import()`, `React.lazy()`, and `<Suspense>`.

```jsx
const HeavyChart = React.lazy(() => import('./HeavyChart'));

function AnalyticsDashboard() {
  return (
    <div>
      <h2>Analytics</h2>
      <React.Suspense fallback={<div>Loading chart component...</div>}>
        <HeavyChart />
      </React.Suspense>
    </div>
  );
}
```

---

#### 43. What is `React.lazy` and `Suspense` used for?
- **`React.lazy`**: Lets you render a dynamic import as a regular React component.
- **`Suspense`**: Specifies a fallback UI (spinner, skeleton) while lazy child components are being fetched over the network.

---

#### 44. How would you profile and identify performance bottlenecks in a React app?
1. **React DevTools Profiler**: Record render sessions to identify "Why did this render?" and measure component render duration.
2. **Highlight Updates**: Enable "Highlight updates when components render" in DevTools settings.
3. **`why-did-you-render`**: NPM library that logs unneeded re-renders in development.

---

#### 45. What is windowing / virtualization?
Virtualization renders only the items currently visible in the user's viewport (plus a small buffer) rather than mounting thousands of DOM nodes.
- Popular libraries: `@tanstack/react-virtual`, `react-window`.

```jsx
import { useVirtualizer } from '@tanstack/react-virtual';

function VirtualList({ items }) {
  const parentRef = React.useRef();

  const rowVirtualizer = useVirtualizer({
    count: items.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 35,
  });

  return (
    <div ref={parentRef} style={{ height: "400px", overflow: "auto" }}>
      <div style={{ height: `${rowVirtualizer.getTotalSize()}px`, position: "relative" }}>
        {rowVirtualizer.getVirtualItems().map(virtualRow => (
          <div
            key={virtualRow.index}
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              transform: `translateY(${virtualRow.start}px)`,
              height: `${virtualRow.size}px`
            }}
          >
            {items[virtualRow.index]}
          </div>
        ))}
      </div>
    </div>
  );
}
```

---

#### 46. How does referential equality affect `useEffect` and `useMemo` dependencies?
Objects, arrays, and functions defined inside a component body receive a **new memory reference on every render**. Passing them directly into dependency arrays causes hooks to re-run on every render.
- **Fix**: Move them outside the component, define them inside the effect, or wrap with `useMemo`/`useCallback`.

---

### 6. Forms, Events & Refs

#### 47. How does event handling differ in React vs plain DOM (SyntheticEvent)?
React wraps native browser events in a cross-browser wrapper called `SyntheticEvent`.
- Event names are camelCase (`onClick`, `onSubmit`).
- Event handlers are functions, not strings.
- `e.preventDefault()` must be called explicitly (cannot return `false`).

---

#### 48. How do you forward a ref through a component with `forwardRef`?
`React.forwardRef` allows a component to pass a received `ref` down to a nested child DOM node.

```jsx
const TextInput = React.forwardRef((props, ref) => {
  return <input ref={ref} className="custom-input" {...props} />;
});

// Parent can now directly access the underlying <input> element:
function ParentForm() {
  const inputRef = React.useRef();
  return <TextInput ref={inputRef} placeholder="Enter name" />;
}
```

---

#### 49. How do you manage complex forms in React?
For complex forms with dynamic fields and validation schemas, use libraries like **React Hook Form** (uncontrolled-based, minimal re-renders) paired with **Zod** schema validation.

```jsx
import { useForm } from "react-hook-form";

function RegistrationForm() {
  const { register, handleSubmit, formState: { errors } } = useForm();

  const onSubmit = (data) => console.log(data);

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input {...register("email", { required: "Email is required" })} />
      {errors.email && <span>{errors.email.message}</span>}
      <button type="submit">Submit</button>
    </form>
  );
}
```

---

#### 50. Difference between `onChange` in React and native `change` event.
- Native `change`: Only fires when the element loses focus (`blur`) after the value changes.
- React `onChange`: Fires on **every single keystroke/character input**, behaving identically to the native `input` event.

---

### 7. Advanced Patterns & React 18/19 Features

#### 51. What is a Higher-Order Component (HOC)?
An HOC is a pure function that takes a component as an argument and returns an enhanced component (e.g. `withAuth(ProfilePage)`).

```jsx
function withAuthentication(WrappedComponent) {
  return function AuthenticatedComponent(props) {
    const isAuthenticated = checkAuthToken();
    if (!isAuthenticated) return <div>Please log in to continue.</div>;
    return <WrappedComponent {...props} />;
  };
}
```

---

#### 52. What is the render props pattern?
A technique for sharing code between components using a prop whose value is a function that returns JSX.

```jsx
function MouseTracker({ render }) {
  const [pos, setPos] = React.useState({ x: 0, y: 0 });

  return (
    <div onMouseMove={e => setPos({ x: e.clientX, y: e.clientY })}>
      {render(pos)}
    </div>
  );
}

// Usage
<MouseTracker render={({ x, y }) => <h1>Mouse is at ({x}, {y})</h1>} />
```

---

#### 53. What is the compound components pattern?
A pattern where multiple components collaborate via shared state (using Context) to create an expressive, declarative API.

```jsx
const TabsContext = React.createContext();

function Tabs({ children, defaultTab }) {
  const [activeTab, setActiveTab] = React.useState(defaultTab);
  return (
    <TabsContext.Provider value={{ activeTab, setActiveTab }}>
      <div className="tabs">{children}</div>
    </TabsContext.Provider>
  );
}

Tabs.Tab = function Tab({ id, children }) {
  const { activeTab, setActiveTab } = React.useContext(TabsContext);
  return (
    <button 
      className={activeTab === id ? "active" : ""} 
      onClick={() => setActiveTab(id)}
    >
      {children}
    </button>
  );
};

Tabs.Panel = function Panel({ id, children }) {
  const { activeTab } = React.useContext(TabsContext);
  return activeTab === id ? <div>{children}</div> : null;
};
```

---

#### 54. What are React Server Components (RSC)?
RSC is an architecture where components can run and render **exclusively on the server**.
- **Benefits**: Zero impact on client bundle size, direct access to server databases/filesystems, sensitive API keys stay secure on the server.

---

#### 55. What is the Suspense pattern for data fetching?
Components can "suspend" execution while waiting for async data. React catches this suspension and renders the nearest `<Suspense fallback={<Spinner />}>` until the promise resolves.

```jsx
function App() {
  return (
    <React.Suspense fallback={<p>Loading user feed...</p>}>
      <AsyncUserFeed />
    </React.Suspense>
  );
}
```

---

#### 56. What is automatic batching in React 18?
In React 18, React automatically batches all state updates into a single re-render, regardless of where they originate (inside `setTimeout`, `fetch` callbacks, or native event handlers).

```jsx
// In React 18: Only 1 re-render occurs!
setTimeout(() => {
  setCount(c => c + 1);
  setFlag(f => !f);
}, 1000);
```

---

#### 57. What is hydration in React?
Hydration is the client-side process where React takes static HTML generated on the server (SSR), inspects the markup, matches the Virtual DOM, and attaches event listeners to make the page interactive.

---

#### 58. What is the difference between client-side rendering (CSR) and server-side rendering (SSR)?
- **CSR**: Browser downloads a blank HTML shell and large JS bundle, then builds the DOM in the browser.
- **SSR**: Server generates full HTML for each request and sends ready-to-view markup immediately, improving initial page load and SEO.

---

#### 59. What is `React.StrictMode`?
A development-only helper component that activates checks and warnings:
- Double-invokes component bodies and effects (`mount -> unmount -> mount`) to catch unintended side effects and cleanup bugs.
- Warns about deprecated APIs.

---

### 8. Testing, Tooling & Architecture

#### 60. How do you test React components with React Testing Library (RTL)?
RTL encourages testing components from the user's perspective rather than testing internal implementation details.

```jsx
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import Counter from './Counter';

test('increments counter on button click', () => {
  render(<Counter />);
  
  const button = screen.getByRole('button', { name: /increment/i });
  fireEvent.click(button);
  
  expect(screen.getByText(/current count: 1/i)).toBeInTheDocument();
});
```

---

#### 61. Difference between shallow rendering and full DOM rendering in tests.
- **Shallow Rendering**: Renders only the component itself, stubbing out all child components (Enzyme).
- **Full DOM Rendering**: Renders the entire component tree into a simulated browser DOM (jsdom via RTL), giving realistic confidence in real user behavior.

---

#### 62. How do you mock API calls in React tests?
Use **Mock Service Worker (MSW)** to intercept network requests at the HTTP layer.

```javascript
import { rest } from 'msw';
import { setupServer } from 'msw/node';

const server = setupServer(
  rest.get('/api/user', (req, res, ctx) => {
    return res(ctx.json({ name: 'Alice' }));
  })
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());
```

---

#### 63. How does React handle conditional rendering?
Using JavaScript logic inside JSX:
1. **Ternary Operator**: `{isLoggedIn ? <Dashboard /> : <Login />}`
2. **Logical AND (`&&`)**: `{hasNotifications && <Badge />}` *(Be careful: `0 && <Component />` prints `0`)*.
3. **Early Returns**: `if (isLoading) return <Spinner />;`

---

#### 64. What is the significance of `children` prop?
`props.children` allows components to act as generic wrappers, passing nested JSX content into the component layout.

---

#### 65. What is the difference between `key` and `ref` as special props?
- **`key`**: Used internally by React reconciliation to identify list elements across renders; not accessible inside the component via `props.key`.
- **`ref`**: Provides a direct handle to a DOM node or instance; passed via `forwardRef`.

---

#### 66. Difference between Presentational ("Dumb") and Container ("Smart") components.
- **Presentational Component**: Focuses purely on UI markup and styling; receives data via props.
- **Container Component**: Manages data fetching, global state subscriptions, and business logic.

---

#### 67. How do you share logic between components in modern React?
Using **Custom Hooks** (e.g. `useFetch`, `useAuth`, `useLocalStorage`).

---

#### 68. What are `React.Children` utilities?
Utility functions (`React.Children.map`, `React.Children.count`, `React.Children.only`) that safely handle opaque `props.children` structures when children can be a single element, array, or undefined.

---

#### 69. What is the difference between `useImperativeHandle` and standard ref assignment?
Standard ref attaches directly to the underlying DOM node. `useImperativeHandle` lets the child component expose a restricted, customized API object to the parent ref.

---

#### 70. What is the difference between PropTypes and TypeScript?
- **PropTypes**: Runtime validation that prints console warnings in development mode.
- **TypeScript**: Static compile-time type-checking that prevents bugs before code is built or shipped.

---

# 🔺 Next.js (30 Questions)

---

### 1. Core Architecture & Rendering Modes

#### 1. What is Next.js and why use it over plain React?
Next.js is a fullstack React framework providing built-in server-side rendering (SSR), static site generation (SSG), file-based routing, automated asset optimization (images/fonts), and API route handlers.

---

#### 2. What is the difference between the Pages Router and the App Router?
- **Pages Router (`/pages`)**: File-based routing where every component is a Client Component; data fetching uses `getServerSideProps` and `getStaticProps`.
- **App Router (`/app`)**: Built on React Server Components (RSC) by default, supports nested layouts, streaming via Suspense, and colocated async data fetching.

```tree
# App Router Structure:
app/
├── layout.tsx         # Root layout wrapping all pages
├── page.tsx           # Home route (/)
└── dashboard/
    ├── layout.tsx     # Nested layout for /dashboard
    └── page.tsx       # /dashboard page
```

---

#### 3. What is Server-Side Rendering (SSR) in Next.js?
SSR generates HTML on the server for **every incoming user request**.
- **Use Case**: Personalized, dynamic pages with frequent data updates and strict SEO requirements.

```typescript
// App Router SSR (Dynamic on every request)
export default async function FeedPage() {
  const res = await fetch("https://api.example.com/feed", { cache: "no-store" });
  const feed = await res.json();

  return <main>{feed.map((post: any) => <p key={post.id}>{post.title}</p>)}</main>;
}
```

---

#### 4. What is Static Site Generation (SSG)?
SSG pre-renders HTML at **build time**. The resulting static HTML is served instantly from a global CDN.

```typescript
// App Router SSG (Default behavior for fetch without no-store)
export default async function AboutPage() {
  const res = await fetch("https://api.example.com/company-info", { cache: "force-cache" });
  const info = await res.json();

  return <div>{info.description}</div>;
}
```

---

#### 5. What is Incremental Static Regeneration (ISR)?
ISR allows you to update static pages in the background after deployment without rebuilding the entire website.
- You specify a `revalidate` time in seconds.

```typescript
export default async function BlogListPage() {
  // Revalidates at most once every 60 seconds
  const res = await fetch("https://api.example.com/posts", {
    next: { revalidate: 60 }
  });
  const posts = await res.json();

  return <div>{/* Render posts */}</div>;
}
```

---

#### 6. Summary of SSR vs SSG vs ISR vs CSR.

| Mode | Render Time | Performance / CDN | Freshness |
|---|---|---|---|
| **CSR** | Client browser | Slowest initial load | Always live |
| **SSG** | Build time | Fastest (CDN cached) | Static until rebuild |
| **ISR** | Build time + Background interval | Fast (CDN cached) | Periodically updated |
| **SSR** | Per-request on server | Moderate | Real-time fresh |

---

#### 7. What are Server Components vs Client Components in the App Router?
- **Server Component (Default)**: Executes only on the server; zero client JS bundle; direct DB/filesystem access.
- **Client Component (`'use client'`)**: Runs on server (pre-render) and hydrates on client; supports hooks (`useState`, `useEffect`), event listeners, and browser APIs.

```tsx
// Client Component (Must declare at top)
'use client';

import { useState } from 'react';

export default function InteractiveLikeButton() {
  const [likes, setLikes] = useState(0);
  return <button onClick={() => setLikes(likes + 1)}>Likes: {likes}</button>;
}
```

---

#### 8. How do you fetch data in the App Router?
Directly using async/await inside Server Components:

```tsx
async function getProjectData(id: string) {
  const res = await fetch(`https://api.example.com/projects/${id}`);
  return res.json();
}

export default async function ProjectPage({ params }: { params: { id: string } }) {
  const project = await getProjectData(params.id);
  return <h1>{project.title}</h1>;
}
```

---

#### 9. What is file-based routing in Next.js?
Special reserved filenames in `/app` define the routing behavior:
- `page.tsx`: Unique UI for a route.
- `layout.tsx`: Shared UI wrapping route and its children.
- `loading.tsx`: Loading UI fallback powered by Suspense.
- `error.tsx`: Error UI boundary.
- `not-found.tsx`: 404 UI.

---

#### 10. How do dynamic routes work?
- `app/blog/[slug]/page.tsx` -> Matches `/blog/react-guide` (`params.slug = "react-guide"`).
- `app/shop/[...slug]/page.tsx` -> Catch-all route matching `/shop/clothes/shirts`.
- `app/docs/[[...slug]]/page.tsx` -> Optional catch-all matching `/docs` or `/docs/a/b`.

---

### 2. Data Fetching, Caching & Streaming

#### 11. What is `generateStaticParams` used for?
In the App Router, `generateStaticParams` pre-populates dynamic route segments at build time for Static Site Generation (SSG).

```tsx
export async function generateStaticParams() {
  const posts = await fetch('https://api.example.com/posts').then(res => res.json());

  return posts.map((post: any) => ({
    slug: post.slug,
  }));
}

export default async function PostPage({ params }: { params: { slug: string } }) {
  return <h1>Post: {params.slug}</h1>;
}
```

---

#### 12. How does caching work with `fetch()` in the App Router?
Next.js extends the native `fetch` Web API with caching options:
- `fetch(url, { cache: 'force-cache' })`: Default (SSG indefinitely cached).
- `fetch(url, { cache: 'no-store' })`: Always fetch fresh data on every request (SSR).
- `fetch(url, { next: { revalidate: 3600 } })`: Cache for 1 hour (ISR).
- `fetch(url, { next: { tags: ['products'] } })`: On-demand tag-based caching.

---

#### 13. What is streaming in Next.js and how does Suspense relate to it?
Streaming allows the server to send rendered HTML chunks progressively as they become ready, preventing slow database queries on one component from blocking the entire page render.

```tsx
import { Suspense } from 'react';

export default function Dashboard() {
  return (
    <div>
      <h1>My Dashboard</h1>
      <Suspense fallback={<p>Loading chart data...</p>}>
        <SlowDataChart />
      </Suspense>
    </div>
  );
}
```

---

#### 14. What are Route Handlers in Next.js?
Route Handlers (`app/api/user/route.ts`) allow you to create custom backend API endpoints using Web `Request` and `Response` APIs.

```typescript
// app/api/users/route.ts
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const users = [{ id: 1, name: 'Alice' }, { id: 2, name: 'Bob' }];
  return NextResponse.json(users);
}

export async function POST(request: Request) {
  const body = await request.json();
  return NextResponse.json({ success: true, user: body }, { status: 201 });
}
```

---

#### 15. What is on-demand revalidation?
Allows programmatically purging and re-generating specific cached pages or tags via `revalidatePath` or `revalidateTag` (e.g. inside a Server Action or webhook).

```typescript
import { revalidateTag } from 'next/cache';

export async function handleCmsWebhook() {
  revalidateTag('blog-posts'); // Immediately invalidates all queries tagged with 'blog-posts'
}
```

---

#### 16. What is `loading.tsx` vs manually using `Suspense`?
- **`loading.tsx`**: Automatically wraps the entire route `page.tsx` in a `<Suspense>` boundary.
- **Manual `<Suspense>`**: Allows granular, component-level loading skeletons so fast components load immediately while slower components stream in.

---

#### 17. What is `generateMetadata` used for?
Dynamically generates `<head>` metadata (title, description, Open Graph tags) based on dynamic route parameters for SEO.

```typescript
export async function generateMetadata({ params }: { params: { id: string } }) {
  const product = await fetchProduct(params.id);
  return {
    title: product.name,
    description: product.description,
    openGraph: { images: [product.imageUrl] }
  };
}
```

---

### 3. Routing, Layouts & Middleware

#### 18. What are nested layouts in Next.js?
A `layout.tsx` file wraps all child route segments and persists across navigations without re-mounting, preserving nested component state (e.g., sidebar scroll position, audio players).

```tsx
// app/dashboard/layout.tsx
export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="dashboard-container">
      <nav><DashboardSidebar /></nav>
      <section className="dashboard-content">{children}</section>
    </div>
  );
}
```

---

#### 19. What is `next/link` and why use it over standard `<a>` tags?
`<Link>` performs client-side single-page navigation without full page reloads and automatically **prefetches route segments in the viewport** in the background for instant navigation.

```tsx
import Link from 'next/link';

export default function Nav() {
  return <Link href="/dashboard">Go to Dashboard</Link>;
}
```

---

#### 20. How does `useRouter` from `next/navigation` differ from `next/router`?
- `next/router` (Pages Router): Included `router.pathname`, `router.query`.
- `next/navigation` (App Router): Only contains navigational methods (`router.push()`, `router.replace()`, `router.refresh()`). For route info, use separate hooks: `usePathname()` and `useSearchParams()`.

---

#### 21. What are Route Groups in Next.js?
Folders wrapped in parentheses, e.g. `(marketing)` or `(shop)`, organize routes and layouts logically without modifying the public URL path.

```tree
app/
├── (marketing)/
│   ├── layout.tsx     # Marketing specific layout
│   └── about/page.tsx # Maps to /about
└── (dashboard)/
    ├── layout.tsx     # Admin specific layout
    └── settings/page.tsx # Maps to /settings
```

---

#### 22. What is Middleware in Next.js?
`middleware.ts` runs code at the Edge before a request is completed, ideal for authentication, authorization redirects, geo-routing, and header rewrites.

```typescript
// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const token = request.cookies.get('auth_token')?.value;

  if (!token && request.nextUrl.pathname.startsWith('/dashboard')) {
    return NextResponse.redirect(new URL('/login', request.url));
  }
  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*'],
};
```

---

#### 23. What are parallel and intercepting routes?
- **Parallel Routes (`@slot`)**: Render multiple pages simultaneously inside the same layout (e.g. `@analytics` and `@team` on a dashboard).
- **Intercepting Routes (`(.)modal`)**: Intercepts a route to display it inside a modal on client-side navigation while keeping the URL shareable for full page refreshes.

---

### 4. Optimization & Assets

#### 24. How does `next/image` optimize images?
1. **Format Optimization**: Converts images to modern formats like AVIF and WebP.
2. **Responsive Resizing**: Generates `srcset` for various screen resolutions.
3. **Lazy Loading**: Images below the fold are loaded only when scrolled into view.
4. **Prevents Layout Shift (CLS)**: Enforces aspect ratio or explicit `width`/`height`.

```tsx
import Image from 'next/image';

export default function Avatar() {
  return (
    <Image
      src="/profile.jpg"
      alt="Profile picture"
      width={100}
      height={100}
      priority // Preloads above-the-fold hero images
    />
  );
}
```

---

#### 25. How does `next/font` optimize fonts?
Automatically downloads and self-hosts Google Fonts or local font files at build time. No external network requests are made by the browser to Google servers, eliminating Layout Shift (CLS).

```tsx
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.className}>
      <body>{children}</body>
    </html>
  );
}
```

---

#### 26. What is automatic code splitting in Next.js?
Next.js automatically splits JavaScript bundles by route. When navigating to `/about`, only the JavaScript code required for the about page is loaded, keeping initial page load times fast.

---

### 5. Deployment, Runtimes & Config

#### 27. Difference between `next dev`, `next build`, and `next start`.
- `next dev`: Starts development server with hot-module reloading and source maps.
- `next build`: Generates optimized production build artifacts.
- `next start`: Starts production Node.js server.

---

#### 28. How do environment variables work in Next.js?
- **Server Only**: Variables in `.env.local` (e.g. `DATABASE_URL`, `STRIPE_SECRET_KEY`) are accessible **only on the server**.
- **Client Accessible**: Must be prefixed with `NEXT_PUBLIC_` (e.g. `NEXT_PUBLIC_ANALYTICS_ID`) to be inlined into the client bundle at build time.

---

#### 29. Deploying Next.js on Vercel vs custom Docker/Node server.
- **Vercel**: Managed serverless platform with zero-configuration Edge middleware, global ISR cache invalidation, and automated image optimization.
- **Docker / Self-Hosted**: Requires configuring `output: 'standalone'` in `next.config.js` to create a lightweight Docker container with minimal dependencies.

---

#### 30. What is the Edge Runtime and when should you use it?
The Edge Runtime is a lightweight JavaScript environment built on V8 primitives (not full Node.js) deployed globally across CDN edge nodes.
- **Use When**: Running low-latency middleware, authentication checks, geo-targeting, or lightweight API route handlers close to end users.

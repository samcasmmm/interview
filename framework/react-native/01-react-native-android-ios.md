# 📱 React Native, Android & iOS Interview Master Guide (250 Questions)

> A comprehensive, production-grade study guide containing **250 in-depth interview questions, architectural breakdowns, code implementations, and native platform internals** covering the New Architecture (Fabric, TurboModules, JSI, Hermes), advanced state management, 60fps animations (Reanimated 3, Skia), Android & iOS native engineering, Gradle/Xcode configurations, code signing, and CI/CD Fastlane deployment pipelines.

---

## 📑 Table of Contents

- [React Native (130 Questions)](#-react-native-130-questions)
  - [1. Core Architecture & New Architecture (Fabric, TurboModules, JSI, Hermes) (Q1–Q15)](#1-core-architecture--new-architecture-fabric-turbomodules-jsi-hermes)
  - [2. React Hooks, State Management & Lifecycles (Q16–Q35)](#2-react-hooks-state-management--lifecycles)
  - [3. List Virtualization, Layout & UI Performance (Q36–Q50)](#3-list-virtualization-layout--ui-performance)
  - [4. Animations & Gesture Handling (Reanimated 3, Gesture Handler, Skia) (Q51–Q65)](#4-animations--gesture-handling-reanimated-3-gesture-handler-skia)
  - [5. Navigation & Deep Linking (React Navigation, Expo Router) (Q66–Q80)](#5-navigation--deep-linking-react-navigation-expo-router)
  - [6. Networking, Offline Sync & Local Storage (MMKV, SQLite, WatermelonDB) (Q81–Q95)](#6-networking-offline-sync--local-storage-mmkv-sqlite-watermelondb)
  - [7. Native Modules, Bridges & Codegen (Q96–Q110)](#7-native-modules-bridges--codegen)
  - [8. Testing, Security, Profiling & Production Scenarios (Q111–Q130)](#8-testing-security-profiling--production-scenarios)
- [Android for React Native Developers (50 Questions)](#-android-for-react-native-developers-50-questions)
  - [1. Android Manifest, Application Lifecycle & Intents (Q131–Q145)](#1-android-manifest-application-lifecycle--intents)
  - [2. Gradle Build System, ProGuard/R8 & Dependencies (Q146–Q160)](#2-gradle-build-system-proguardr8--dependencies)
  - [3. Native Services, Background Tasks & Permissions (Q161–Q170)](#3-native-services-background-tasks--permissions)
  - [4. Native Modules, Security & Google Play Policies (Q171–Q180)](#4-native-modules-security--google-play-policies)
- [iOS for React Native Developers (50 Questions)](#-ios-for-react-native-developers-50-questions)
  - [1. iOS Architecture, CocoaPods & Workspace Setup (Q181–Q195)](#1-ios-architecture-cocoapods--workspace-setup)
  - [2. Code Signing, Certificates & Provisioning Profiles (Q196–Q205)](#2-code-signing-certificates--provisioning-profiles)
  - [3. Native Modules, Swift/Objective-C++ & Memory Management (Q206–Q218)](#3-native-modules-swiftobjective-c--memory-management)
  - [4. Capabilities, Privacy Manifests & App Store Guidelines (Q219–Q230)](#4-capabilities-privacy-manifests--app-store-guidelines)
- [Build, Deployment & Production (20 Questions)](#-build-deployment--production-20-questions)
  - [1. CI/CD Pipelines, Fastlane & OTA Updates (Q231–Q240)](#1-cicd-pipelines-fastlane--ota-updates)
  - [2. Production Monitoring, Sentry, Vitals & Release Management (Q241–Q250)](#2-production-monitoring-sentry-vitals--release-management)

---


# 📱 React Native (130 Questions)

---


### 1. Core Architecture & New Architecture (Fabric, TurboModules, JSI, Hermes)

#### 1. What is React Native, and how does its core architecture differ from React on the web?

React Native is an open-source framework created by Meta that allows developers to build truly native mobile applications for Android and iOS using JavaScript or TypeScript and React paradigms. Unlike React on the web, which renders HTML elements to the browser's Document Object Model (Virtual DOM to DOM), React Native translates React components into platform-native UI widgets (e.g., `<View>` becomes `android.view.ViewGroup` on Android and `UIView` on iOS) through native platform bindings, completely bypassing browser rendering engines.

```tsx
// React Native: Native primitives rendered by platform widgets
import { View, Text, StyleSheet } from 'react-native';

export function NativeCard({ title }: { title: string }) {
  return (
    <View style={styles.card}>
      <Text style={styles.text}>{title}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { padding: 16, backgroundColor: '#fff', borderRadius: 8 },
  text: { fontSize: 16, color: '#333' },
});
```

---

#### 2. How did the legacy (old) React Native Architecture work, and what were its primary bottlenecks?

The legacy architecture relied on the "Bridge," an asynchronous, serialized JSON communication bus connecting the JavaScript thread, the Native/UI thread, and the Shadow/Layout thread. Its main bottlenecks were:
1. serialization/deserialization overhead of sending large JSON payloads across the bridge,
2. strictly asynchronous communication preventing synchronous layout measurements and leading to visual jumps, and
3. unnecessary data copying between memory heaps, which degraded performance during rapid gestures, high-frequency events, and heavy list scrolling.

```
// Legacy Architecture: Asynchronous JSON Bridge bottleneck
[ JavaScript Thread ] <--- (Async JSON String) ---> [ Bridge ] <--- (Async JSON String) ---> [ Native UI Thread ]
// Issues: JSON serialization overhead, non-synchronous layout reads, high-frequency event lag
```

---

#### 3. What is the New Architecture in React Native, and what are its core pillars?

The New Architecture is a complete re-engineering of React Native's core internals designed to eliminate the Bridge bottleneck and support concurrent React 18 features. Its four main pillars are:
1. JavaScript Interface (JSI), replacing JSON serialization with direct C++ memory sharing,
2. Fabric, the new concurrent rendering engine that directly creates and manages native UI views,
3. TurboModules, a lazy-loading native module system with direct C++ bindings, and
4. Codegen, a build-time tool that enforces static type safety between TypeScript/Flow specs and native C++/Java/Objective-C code.

```
// New Architecture Pillars: Direct synchronous memory sharing
[ JavaScript (Hermes) ] <======== JSI (C++ Host Objects) ========> [ Native (Java/Swift) ]
                                |
             +------------------+------------------+
             |                                     |
       [ Fabric Renderer ]                 [ TurboModules ]
    (C++ Concurrent Rendering)            (Lazy-loaded Native APIs)
             |                                     |
             +------------------+------------------+
                                |
                         [ Codegen Engine ]
```

---

#### 4. What is the JavaScript Interface (JSI), and how does it enable direct communication between JS and Native?

JSI is a lightweight, general-purpose C++ abstraction layer embedded within the JavaScript runtime (Hermes, V8, or JSC) that allows JavaScript to hold direct references to C++ Host Objects and invoke their methods synchronously. Because native code (Java/Kotlin on Android via JNI, and Objective-C/Swift on iOS) can interface directly with C++, JavaScript can directly execute native methods in the same thread and access native memory buffers without converting data to JSON strings or passing messages through an asynchronous queue.

```cpp
// JSI C++ Host Object Example: Synchronous native call without JSON
class JSIStorageHostObject : public jsi::HostObject {
public:
  jsi::Value get(jsi::Runtime& rt, const jsi::PropNameID& name) override {
    if (name.utf8(rt) == "getItem") {
      return jsi::Function::createFromHostFunction(rt, name, 1, 
        [](jsi::Runtime& rt, const jsi::Value& thisVal, const jsi::Value* args, size_t count) -> jsi::Value {
          std::string key = args[0].asString(rt).utf8(rt);
          std::string val = ReadNativeFastKey(key); // Synchronous native memory read
          return jsi::String::createFromUtf8(rt, val);
        });
    }
    return jsi::Value::undefined();
  }
};
```

---

#### 5. How does the Fabric renderer work, and what are its three render phases?

Fabric is React Native's modern rendering system that unifies UI layout calculation across platforms using C++ and the Yoga layout engine. It processes UI updates in three distinct phases:
1. **Render Phase**: React executes component functions in JavaScript, creates a React Element Tree, and Fabric builds an immutable, thread-safe C++ Shadow Tree
2. **Commit Phase**: Yoga computes layout metrics (flexbox positioning, coordinates, sizes) on the Shadow Tree
3. **Mount Phase**: Fabric transforms the calculated Shadow Tree into actual platform-native views on the main UI thread with minimal overhead.

---

#### 6. What are TurboModules, and how do they improve on legacy Native Modules?

TurboModules are the New Architecture's native module system built on top of JSI. Unlike legacy Native Modules, which were all eagerly instantiated, bound, and initialized on app startup over the asynchronous bridge (slowing down Time-To-Interactive), TurboModules are loaded lazily on-demand only when first accessed in JavaScript. Furthermore, TurboModules utilize Codegen to generate typed C++ boilerplate from TypeScript/Flow specifications, guaranteeing compile-time type safety across JavaScript and native layers.

```typescript
// TurboModule TypeScript Specification (Codegen input)
import type { TurboModule } from 'react-native';
import { TurboModuleRegistry } from 'react-native';

export interface Spec extends TurboModule {
  readonly getDeviceModel: () => string;
  readonly calculateHash: (input: string) => Promise<string>;
}

export default TurboModuleRegistry.getEnforcing<Spec>('NativeDeviceModule');
```

---

#### 7. What is Bridgeless Mode in modern React Native?

Bridgeless Mode is the operational mode in modern React Native where the legacy Bridge is completely disabled and omitted from the runtime. In Bridgeless Mode, 100% of native communication—including UI rendering, native module calls, runtime events, and error handling—routes exclusively through JSI, Fabric, and TurboModules, reducing binary size, eliminating legacy synchronization overhead, and maximizing execution speed.

---

#### 8. What is the Hermes engine, and why is it the default JavaScript engine for React Native?

Hermes is an open-source JavaScript engine optimized by Meta specifically for running React Native apps on Android and iOS. Unlike standard engines that parse and compile JavaScript code to bytecode at runtime (JIT), Hermes performs Ahead-Of-Time (AOT) bytecode compilation during the app build process. This eliminates JavaScript parsing at runtime, resulting in significantly faster app launch times (TTI), reduced memory (RAM) consumption, and smaller compiled binary sizes.

```bash
# Ahead-Of-Time (AOT) bytecode compilation with Hermes CLI
hermesc -emit-binary -out index.android.bundle.hbc index.android.bundle
```

---

#### 9. How does React Native execute Flexbox layout via the Yoga engine?

React Native uses Yoga, a cross-platform C++ layout engine that implements the W3C Flexbox specification. When a component renders, Yoga calculates node dimensions, margins, paddings, and absolute coordinates based on flex rules without needing a browser engine. Key differences from web CSS include: the default `flexDirection` is `column` (not `row`), `flexShrink` defaults to `0`, all dimensions are unitless density-independent pixels (dp/pt), and there is no cascading inheritance of styles.

```tsx
import { StyleSheet, View } from 'react-native';

// Yoga Flexbox: column default, dp units, no cascading
const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column', // Default in React Native (unlike web row)
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16, // Density-independent pixels (dp/pt)
  },
});
```

---

#### 10. What are the key threads in a React Native application and their responsibilities?

A React Native application operates across four primary threads:
1. **Main/UI Thread**: Handles native Android/iOS platform rendering, touch gesture reception, and user interactions
2. **JavaScript Thread**: Executes the business logic, React component lifecycles, API network handling, and state updates
3. **Shadow/Layout Thread**: (In legacy architecture) uses Yoga to calculate view layouts before dispatching commands to the UI thread (Fabric now executes this flexibly across threads); and
4. **Native Modules Background Thread**: Executes asynchronous tasks spawned by native modules (such as file I/O, location, or image processing) without blocking the UI.

---

#### 11. How do React 18 Concurrent Features (e.g., `useTransition`, `useDeferredValue`) function in React Native?

React 18 Concurrent Features allow React Native to interrupt non-urgent UI renders to prioritize urgent user inputs like typing, pressing buttons, or scrolling. Using `useTransition`, developers can mark heavy list filtering or navigation changes as secondary transitions, allowing the JS engine and Fabric to process urgent touch events on the main thread immediately, thereby eliminating input lag and frame drops during heavy state changes.

```tsx
import React, { useState, useTransition } from 'react';
import { TextInput, FlatList, Text } from 'react-native';

export function SearchList({ items }: { items: string[] }) {
  const [query, setQuery] = useState('');
  const [filtered, setFiltered] = useState(items);
  const [isPending, startTransition] = useTransition();

  const handleSearch = (text: string) => {
    setQuery(text); // Urgent update: immediate input reflection
    startTransition(() => {
      // Non-urgent transition: interruptible list filtering
      setFiltered(items.filter((item) => item.includes(text)));
    });
  };

  return (
    <>
      <TextInput value={query} onChangeText={handleSearch} />
      <FlatList data={filtered} renderItem={({ item }) => <Text>{item}</Text>} />
    </>
  );
}
```

---

#### 12. What is the role of `AppRegistry` in a React Native application?

`AppRegistry` is the JavaScript entry point that registers the root React component with the native runtime. When the native host environment (`MainActivity` on Android or `AppDelegate` on iOS) initializes the React Native surface, it invokes `AppRegistry.runApplication(appName, initialProps)`, which mounts the root React component tree into the native view container.

```javascript
// index.js: JavaScript entry point binding root component to Native Surface
import { AppRegistry } from 'react-native';
import App from './App';
import { name as appName } from './app.json';

AppRegistry.registerComponent(appName, () => App);
```

---

#### 13. What is the difference between Controlled and Uncontrolled `TextInput` components in React Native, and what is the "text jumping" glitch?

A controlled `TextInput` derives its value strictly from React state (`value={text}` with `onChangeText={setText}`), while an uncontrolled component manages its own internal native text buffer using `defaultValue`. The "text jumping" glitch occurs in legacy controlled inputs when rapid typing sends native text events asynchronously over the bridge to JS; by the time the JS state update returns to the native view, the native cursor and text buffer are out of sync, causing characters to duplicate or flicker.

```tsx
import React, { useState, useRef } from 'react';
import { TextInput } from 'react-native';

// Controlled TextInput (Sync state)
function ControlledInput() {
  const [text, setText] = useState('');
  return <TextInput value={text} onChangeText={setText} />;
}

// Uncontrolled TextInput (Avoids bridge jumping on rapid typing)
function UncontrolledInput() {
  const inputRef = useRef<TextInput>(null);
  return <TextInput ref={inputRef} defaultValue="Initial Text" />;
}
```

---

#### 14. How do custom Native UI Components work in React Native Fabric?

In Fabric, a custom Native UI Component is defined with a TypeScript spec file (`<ComponentName>NativeComponent.ts`) that specifies props and native events. Codegen parses this spec to generate C++ ShadowNode definitions, interface protocols, and event dispatchers. The developer implements the native view in Kotlin/Java (Android) or Swift/Objective-C++ (iOS) by subclassing the generated ViewManager/ComponentDescriptor, ensuring synchronous prop updates and direct native event dispatching to JavaScript via JSI.

```typescript
// Custom Fabric UI Component Spec (NativeCustomButtonNativeComponent.ts)
import type { ViewProps, HostComponent } from 'react-native';
import type { DirectEventHandler } from 'react-native/Libraries/Types/CodegenTypes';
import codegenNativeComponent from 'react-native/Libraries/Utilities/codegenNativeComponent';

type ButtonPressEvent = Readonly<{ timestamp: number }>;

export interface NativeProps extends ViewProps {
  buttonText: string;
  onNativePress?: DirectEventHandler<ButtonPressEvent>;
}

export default codegenNativeComponent<NativeProps>(
  'NativeCustomButton'
) as HostComponent<NativeProps>;
```

---

#### 15. Why should you avoid inline function declarations and object literals in JSX props for complex screens?

Passing inline functions (e.g., `onPress={() => doSomething(id)}`) or inline object literals (e.g., `style={{ marginTop: 10 }}`) creates new function/object references in memory on every single render. When passed to child components wrapped in `React.memo` or items in a `FlatList`, the shallow equality comparison of props fails, causing unnecessary, expensive sub-tree re-renders and potential frame rate stutter.

```tsx
import React, { memo, useCallback, useState } from 'react';
import { Button, View } from 'react-native';

const MemoizedChild = memo(({ onPress }: { onPress: () => void }) => {
  return <Button title="Tap" onPress={onPress} />;
});

export function ParentScreen() {
  const [count, setCount] = useState(0);

  // ✅ Stable function reference prevents child re-render
  const handlePress = useCallback(() => {
    console.log('Button pressed');
  }, []);

  return (
    <View>
      <MemoizedChild onPress={handlePress} />
      <Button title="Increment" onPress={() => setCount((c) => c + 1)} />
    </View>
  );
}
```

---


### 2. React Hooks, State Management & Lifecycles

#### 16. What is the difference between `useState` and `useRef` in React Native, and when is `useRef` preferred?

`useState` holds state that, when updated via its setter, triggers a component re-render to reflect changes in the UI. `useRef` returns a mutable object whose `.current` property persists across renders without triggering a re-render when mutated. `useRef` is preferred for storing timer IDs, mutable business flags, previous prop values, and direct imperative native component references (such as `TextInput` focus or `ScrollView` scroll offsets).

```tsx
import React, { useState, useRef } from 'react';
import { View, Button, TextInput } from 'react-native';

export function InputWithTimer() {
  const [count, setCount] = useState(0); // Triggers re-render on change
  const timerRef = useRef<NodeJS.Timeout | null>(null); // Persists without re-render
  const inputRef = useRef<TextInput>(null); // Native view reference

  const startTimer = () => {
    timerRef.current = setTimeout(() => {
      inputRef.current?.focus(); // Direct imperative action
    }, 1000);
  };

  return (
    <View>
      <TextInput ref={inputRef} placeholder="Target input" />
      <Button title="Focus in 1s" onPress={startTimer} />
    </View>
  );
}
```

---

#### 17. When would you use `useLayoutEffect` instead of `useEffect` in React Native?

`useEffect` runs asynchronously after the render has been committed and painted to the screen, preventing UI blocking. `useLayoutEffect` runs synchronously immediately after React has performed DOM/Shadow Tree mutations but before the native platform paints the UI. In React Native, `useLayoutEffect` is used when you need to measure native view dimensions (via `measure()` or `onLayout`) and update state or adjust layout synchronously to prevent visual flickering before the user sees the frame.

```tsx
import React, { useState, useLayoutEffect, useRef } from 'react';
import { View, Text, LayoutChangeEvent } from 'react-native';

export function Tooltip({ targetX }: { targetX: number }) {
  const [tooltipX, setTooltipX] = useState(0);
  const viewRef = useRef<View>(null);

  // useLayoutEffect runs before native paint to prevent visual jump/flicker
  useLayoutEffect(() => {
    viewRef.current?.measure((x, y, width, height, pageX) => {
      setTooltipX(targetX - width / 2);
    });
  }, [targetX]);

  return (
    <View ref={viewRef} style={{ transform: [{ translateX: tooltipX }] }}>
      <Text>Tooltip</Text>
    </View>
  );
}
```

---

#### 18. How do `useCallback` and `useMemo` prevent performance regressions in React Native?

`useMemo` caches the calculated result of an expensive calculation between renders based on a dependency array, preventing repetitive CPU-intensive data transformations. `useCallback` caches a callback function instance between renders. They prevent performance regressions when passing callbacks or complex data to memoized child components (`React.memo`) or `FlatList` render items, ensuring props maintain referential identity and do not trigger cascading child re-renders.

---

#### 19. How do you create a custom hook to listen to hardware events like keyboard visibility or device orientation?

You encapsulate native event subscription inside a custom hook using `useEffect`. For example, for keyboard visibility, you call `Keyboard.addListener('keyboardDidShow', handler)` and `Keyboard.addListener('keyboardDidHide', handler)`, store the keyboard height and visibility status in local hook state, and critically return a cleanup function from `useEffect` that calls `.remove()` on the subscriptions to prevent memory leaks and dangling listeners when the host component unmounts.

```typescript
// Custom Hook: Device Keyboard Height Listener
import { useState, useEffect } from 'react';
import { Keyboard, KeyboardEvent } from 'react-native';

export function useKeyboard() {
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const showSub = Keyboard.addListener('keyboardDidShow', (e: KeyboardEvent) => {
      setKeyboardHeight(e.endCoordinates.height);
      setIsVisible(true);
    });
    const hideSub = Keyboard.addListener('keyboardDidHide', () => {
      setKeyboardHeight(0);
      setIsVisible(false);
    });

    // Cleanup listener on unmount to prevent memory leaks
    return () => {
      showSub.remove();
      hideSub.remove();
    };
  }, []);

  return { keyboardHeight, isVisible };
}
```

---

#### 20. What are the performance pitfalls of React Context in large React Native apps, and how do you mitigate them?

Whenever any value within a React Context provider object changes, every consumer component that calls `useContext(MyContext)` is forced to re-render, even if the component only consumes a property that did not change. To mitigate this:
1. split monolithic contexts into small, focused contexts (e.g., separate `AuthContext`, `ThemeContext`, `UserCartContext`),
2. memoize provider `value` objects using `useMemo`, or
3. use atomic state libraries (Zustand, Jotai) or `use-context-selector` for fine-grained subscriptions.

---

#### 21. What are the key architectural differences between Redux Toolkit (RTK) and Zustand in React Native?

Redux Toolkit enforces a centralized, unidirectional flux pattern with immutable state slices, reducers, action dispatchers, and middleware, using a single global store wrapped in a Context Provider. Zustand is a minimalist, un-opinionated store built using closure-based pub/sub state outside the React tree that requires no Context Providers. Zustand avoids boilerplate, supports direct transient updates without re-renders, and provides built-in fine-grained selector subscriptions out of the box.

```typescript
// Zustand: Lightweight, no Provider, direct selector subscriptions
import { create } from 'zustand';

interface AuthState {
  token: string | null;
  setToken: (token: string | null) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  token: null,
  setToken: (token) => set({ token }),
}));

// Component usage:
const token = useAuthStore((state) => state.token);
```

---

#### 22. How does RTK Query / TanStack Query improve mobile data fetching compared to traditional Redux thunks?

Traditional thunks require extensive boilerplate for managing loading, success, and error states, manual caching, and manual deduplication. RTK Query and TanStack Query automate the entire server-state lifecycle by providing out-of-the-box request deduplication, automatic caching, background refetching on app focus/reconnect, cache garbage collection, optimistic updates, and normalized cache invalidation based on query tags.

---

#### 23. How do you implement selective subscriptions in Zustand to avoid unnecessary component re-renders?

In Zustand, you pass a selector function to the custom store hook: `const userName = useUserStore((state) => state.name)`. The component will only re-render if `state.name` changes based on strict equality (`===`). If you need to select multiple properties or an object, you pass Zustand's `shallow` comparator: `const { name, email } = useUserStore(useShallow((state) => ({ name: state.name, email: state.email })))`, preventing re-renders when other unrelated store properties mutate.

```tsx
import { useShallow } from 'zustand/react/shallow';
import { useUserStore } from './userStore';

// Selective subscription: re-renders ONLY when name or email change
export function UserProfileHeader() {
  const { name, email } = useUserStore(
    useShallow((state) => ({ name: state.name, email: state.email }))
  );

  return <Text>{name} ({email})</Text>;
}
```

---

#### 24. How do `forwardRef` and `useImperativeHandle` work together in React Native?

`forwardRef` allows a parent component to pass a ref down to a child custom component. `useImperativeHandle` customizes the instance value that is exposed to the parent component when using that ref. This is commonly used in custom UI components (like bottom sheets or modal dialogs) to expose imperative native actions—such as `ref.current.open()`, `ref.current.close()`, or `ref.current.snapToIndex(1)`—without forcing parent state changes and re-renders.

```tsx
import React, { forwardRef, useImperativeHandle, useState } from 'react';
import { View, Text } from 'react-native';

export interface BottomSheetRef {
  open: () => void;
  close: () => void;
}

export const CustomBottomSheet = forwardRef<BottomSheetRef>((props, ref) => {
  const [isOpen, setIsOpen] = useState(false);

  useImperativeHandle(ref, () => ({
    open: () => setIsOpen(true),
    close: () => setIsOpen(false),
  }));

  if (!isOpen) return null;
  return <View><Text>Sheet Content</Text></View>;
});
```

---

#### 25. What is the stale closure problem in React Native `useEffect` and event callbacks, and how is it resolved?

The stale closure problem occurs when a callback or effect captures variables from its enclosing render scope, but due to an empty or incomplete dependency array (`[]`), the closure continues referencing the outdated variables from the initial render rather than the latest values. It is resolved by:
1. correctly listing all referenced variables in the dependency array,
2. using functional state updates (e.g., `setCount((prev) => prev + 1)`), or
3. storing the latest value in a `useRef` which is read imperatively inside the closure.

---

#### 26. How does `React.memo` work, and when should you provide a custom `areEqual` comparison function?

`React.memo` is a higher-order component that wraps a functional component and performs a shallow equality comparison on incoming props; if props are unchanged, it reuses the previous rendered output. A custom `areEqual(prevProps, nextProps)` function is necessary when props contain complex nested objects or arrays where only specific fields affect visual rendering, allowing you to return `true` to skip re-rendering even if parent object references differ.

---

#### 27. How does the `AppState` API work, and how do you handle app transitions between foreground and background?

The `AppState` API allows React Native apps to detect the current execution state of the app (`active`, `background`, or `inactive` on iOS). By subscribing to `AppState.addEventListener('change', nextState)`, developers can pause expensive background animations, stop polling timers, disconnect WebSockets, or lock the app with biometric authentication when transitioning to the background, and resume synchronization when the app returns to `active`.

```tsx
import React, { useEffect } from 'react';
import { AppState, AppStateStatus } from 'react-native';

export function AppLifecycleManager() {
  useEffect(() => {
    const sub = AppState.addEventListener('change', (nextState: AppStateStatus) => {
      if (nextState === 'background') {
        // Pause audio, stop polling, disconnect WebSocket
      } else if (nextState === 'active') {
        // Resume synchronization, check session validity
      }
    });

    return () => sub.remove();
  }, []);

  return null;
}
```

---

#### 28. How do you handle the Android hardware Back button using `BackHandler` in React Native?

You use the `BackHandler` API inside a `useEffect` hook by adding a listener to the `hardwareBackPress` event: `const subscription = BackHandler.addEventListener('hardwareBackPress', onBackPress)`. Inside `onBackPress`, if you handle the action (e.g., closing a custom modal or showing an exit alert), you return `true` to stop event bubbling; if you want the default OS behavior (navigating back in history or exiting), you return `false`. Always remove the listener in the cleanup function.

```tsx
import { useEffect } from 'react';
import { BackHandler, Alert } from 'react-native';

export function useHardwareBackExit() {
  useEffect(() => {
    const onBackPress = () => {
      Alert.alert('Exit App', 'Do you want to exit?', [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Exit', onPress: () => BackHandler.exitApp() },
      ]);
      return true; // Return true to prevent default back behavior
    };

    const sub = BackHandler.addEventListener('hardwareBackPress', onBackPress);
    return () => sub.remove();
  }, []);
}
```

---

#### 29. What is the difference between `Dimensions.get()` and the `useWindowDimensions` hook?

`Dimensions.get('window')` retrieves the screen/window width and height at the exact moment of execution as a static snapshot, failing to trigger re-renders when dimensions change unless a manual event listener is attached. The `useWindowDimensions` hook automatically subscribes to window dimension changes and returns live width, height, scale, and fontScale, automatically triggering a component re-render upon screen orientation changes, window resizing, or foldable device unfolding.

---

#### 30. How does `InteractionManager.runAfterInteractions` optimize screen navigation transitions?

`InteractionManager.runAfterInteractions(task)` defers the execution of long-running, CPU-intensive JavaScript tasks (such as complex data processing, heavy database queries, or large state updates) until all active UI animations and navigation screen transitions have finished. This guarantees that frame rates remain at 60 FPS during page push/pop animations without stutter or dropped frames.

```tsx
import React, { useEffect, useState } from 'react';
import { InteractionManager, ActivityIndicator, View, Text } from 'react-native';

export function HeavyDetailsScreen() {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    // Run heavy JS processing only after screen push animation finishes
    const handle = InteractionManager.runAfterInteractions(() => {
      setIsReady(true);
    });
    return () => handle.cancel();
  }, []);

  if (!isReady) return <ActivityIndicator size="large" />;
  return <View><Text>Heavy Complex Content</Text></View>;
}
```

---

#### 31. How does `FlatList` virtualization work under the hood?

`FlatList` is built on top of `VirtualizedList` and optimizes memory and CPU usage by maintaining a sliding render window. It renders only the items currently visible in the viewport plus a small buffer before and after (determined by `windowSize`), completely unmounting offscreen items and replacing them with empty spacer views of equivalent height. This keeps memory usage bounded regardless of whether the list contains 10 or 100,000 items.

---

#### 32. What is the purpose of the `getItemLayout` prop in `FlatList`, and why is it a critical optimization?

When items in a `FlatList` have fixed, predictable heights (or widths in horizontal lists), `getItemLayout={(data, index) => ({ length: ITEM_HEIGHT, offset: ITEM_HEIGHT * index, index })}` provides the exact pixel offset and size of every item directly to the list. This allows `FlatList` to calculate scroll offsets and render windows instantly without measuring items asynchronously on the native UI thread, enabling instantaneous scrolling to specific indices (`scrollToIndex`) without layout lag.

---

#### 33. What are the roles of `initialNumToRender`, `maxToRenderPerBatch`, and `windowSize` in tuning `FlatList`?

1. `initialNumToRender` defines the exact count of items rendered on initial mount; keeping this close to the visible screen capacity speeds up initial screen render.
2. `maxToRenderPerBatch` controls the number of items rendered in each incremental batch during scrolling; lower values keep the JS thread responsive, while higher values reduce blank spaces during fast scrolling.
3. `windowSize` sets the measurement multiplier of the visible viewport (e.g., `5` means 2 screens above, 1 visible screen, 2 screens below); lower values conserve RAM, while higher values prevent blank areas during rapid scrolling.

```tsx
import { FlatList } from 'react-native';

<FlatList
  data={largeDataset}
  renderItem={renderItem}
  keyExtractor={(item) => item.id}
  initialNumToRender={8}         // Render enough for first viewport
  maxToRenderPerBatch={5}         // Render in small chunks during scroll
  windowSize={5}                  // 2 screens above + 1 visible + 2 below
  removeClippedSubviews={true}    // Unmount off-screen native views
/>
```

---

#### 34. Why is using array index as `keyExtractor` in `FlatList` dangerous, and what are the consequences?

Using array index as a key (`keyExtractor={(item, index) => index.toString()}`) breaks React's reconciliation algorithm when items are added, removed, reordered, or filtered. React uses keys to match existing component instances with new data; with index keys, deleting the first item causes React to re-render all subsequent items and reuse existing component internal states (like input values or animations) for the wrong data, leading to severe visual bugs and performance degradation.

---

#### 35. How does Shopify's `FlashList` differ architecturally from React Native's standard `FlatList`?

While `FlatList` continually creates new native views and unmounts/destroys offscreen views as the user scrolls (incurring garbage collection spikes and native allocation overhead), `FlashList` implements view recycling similar to Android's `RecyclerView` and iOS's `UICollectionView`. It creates a fixed pool of native views once and simply re-binds new data to existing native views as they scroll into view, resulting in up to 10x faster performance, zero blank spaces, and consistent 60/120 FPS.

---


### 3. List Virtualization, Layout & UI Performance

#### 36. What causes the "blank area / white flash" when fast scrolling in `FlatList`, and how do you fix it?

Blank areas appear when the user scrolls faster than the asynchronous JavaScript thread can compute layouts, render items, and send native draw commands across to the UI thread. To fix this:
1. enable Hermes for faster JS execution,
2. specify `getItemLayout` for fixed-height rows,
3. increase `windowSize` and `maxToRenderPerBatch` slightly to expand the pre-rendered buffer,
4. simplify item view hierarchies and memoize render items with `React.memo`, or
5. migrate the list to `FlashList`.

---

#### 37. What is `SectionList`, and when should you use it instead of `FlatList`?

`SectionList` is a specialized virtualization component designed for rendering sectioned, grouped data with dedicated section headers and footers (e.g., contacts grouped alphabetically or transactions grouped by date). It supports sticky section headers (`stickySectionHeadersEnabled={true}`) that pin to the top of the viewport natively as the user scrolls, which is complex and inefficient to achieve manually in a standard `FlatList`.

```tsx
import { FlashList } from '@shopify/flash-list';

// FlashList recycles native cell views instead of unmounting/remounting
export function FastProductList({ products }: { products: Product[] }) {
  return (
    <FlashList
      data={products}
      renderItem={({ item }) => <ProductRow item={item} />}
      estimatedItemSize={80} // Crucial for accurate initial scroll offset calculation
      keyExtractor={(item) => item.id}
    />
  );
}
```

---

#### 38. Why does placing a `FlatList` inside a vertical `ScrollView` produce a warning, and how do you resolve it?

Placing a `FlatList` inside a vertical `ScrollView` with the same scroll orientation triggers the warning `"VirtualizedLists should never be nested inside plain ScrollViews with the same orientation"`. This is because the outer `ScrollView` provides infinite height, forcing `FlatList` to render all items simultaneously at once, completely disabling virtualization and causing massive memory bloat. To resolve it: use `ListHeaderComponent` and `ListFooterComponent` inside `FlatList` for header/footer content, or use a single outer `FlatList`.

```tsx
// Constant item height allows instant O(1) scroll indexing
const ITEM_HEIGHT = 70;

const getItemLayout = (data: any, index: number) => ({
  length: ITEM_HEIGHT,
  offset: ITEM_HEIGHT * index,
  index,
});

<FlatList
  data={items}
  renderItem={renderRow}
  getItemLayout={getItemLayout} // Skips asynchronous native layout measurements
/>
```

---

#### 39. How do you implement infinite scrolling (pagination) in a `FlatList` reliably?

You implement infinite scrolling by configuring `onEndReached` and `onEndReachedThreshold` (e.g., `0.5`). To prevent duplicate requests, you maintain a boolean `isFetchingMore` flag and check `if (!isFetchingMore && hasNextPage) fetchMore()`. You display an `ActivityIndicator` in the `ListFooterComponent` while loading, and append new page data immutably to the existing array state.

---

#### 40. Scenario: A `FlatList` displaying 5,000 items with images and live badges is severely lagging and dropping frames. What is your step-by-step optimization strategy?

1. Wrap the item component in `React.memo` with a strict comparison function
2. ensure `keyExtractor` uses unique string IDs
3. implement `getItemLayout` if item heights are fixed
4. tune list parameters (`initialNumToRender={8}`, `maxToRenderPerBatch={5}`, `windowSize={5}`, `removeClippedSubviews={Platform.OS === 'android'}`)
5. replace standard `<Image>` with `react-native-fast-image` for memory/disk caching and downsampling
6. isolate live badge updates into dedicated child components to avoid re-rendering entire list items
7. if performance remains inadequate, migrate to Shopify's `FlashList`.

---

#### 41. What is the fundamental difference between React Native's built-in `Animated` API and `react-native-reanimated`?

The built-in `Animated` API calculates animation values either on the JS thread (causing frame drops whenever the JS thread is busy) or offloads purely transform/opacity animations to the native UI thread via `useNativeDriver: true`. `react-native-reanimated` (v2/v3) executes animations directly on the UI thread using JS Worklets running in a dedicated secondary JS runtime, allowing complex gesture interactions, layout calculations, and dynamic style properties (including colors and dimensions) to run at a continuous 60/120 FPS without bridge roundtrips.

---

#### 42. Why does `useNativeDriver: true` fail when animating properties like `width`, `height`, or `backgroundColor` in the `Animated` API?

The native driver works by serializing the animation configuration once and sending it to the native platform, where native animation drivers update the view directly on the UI thread. However, properties like `width`, `height`, `top`, or `padding` alter the layout dimensions, requiring Yoga to recalculate the flexbox layout on the Shadow thread before redrawing. Because the legacy native animation driver cannot trigger Yoga layout passes dynamically per frame, `useNativeDriver` is strictly limited to non-layout visual transforms (`transform: [{ translateX }, { scale }]`) and `opacity`.

---

#### 43. What is a "Worklet" in React Native Reanimated, and how does it work?

A Worklet is a small JavaScript function marked with the `'worklet';` directive that is compiled by the Reanimated Babel plugin to run inside a separate JavaScript runtime directly on the UI/Main thread. Worklets can read and mutate shared values (`useSharedValue`), execute mathematical physics calculations, and update native view styles synchronously per frame (via `useAnimatedStyle`) without dispatching messages across the bridge or pausing for main JS thread execution.

---

#### 44. How does `react-native-gesture-handler` achieve superior touch responsiveness compared to React Native's `PanResponder`?

`PanResponder` intercepts touch events at the native platform level, serializes raw touch coordinates into JSON, and sends them across the bridge to the JavaScript thread to evaluate gesture recognizer logic, introducing noticeable latency. `react-native-gesture-handler` binds directly to platform-native gesture recognizers (`UIGestureRecognizer` on iOS and Android gesture detectors) on the UI thread; gesture states and thresholds are evaluated natively, completely bypassing the JS thread during continuous pan, pinch, and swipe interactions.

---

#### 45. How do you compose multiple gestures using `react-native-gesture-handler` v2?

In RNGH v2, gestures are constructed using the builder API (`Gesture.Pan()`, `Gesture.Tap()`, etc.) and composed using three combinators:
1. `Gesture.Simultaneous(gesture1, gesture2)` allows both gestures to recognize and activate concurrently (e.g., zooming and panning a map at the same time)
2. `Gesture.Exclusive(singleTap, doubleTap)` prioritizes one gesture over another (e.g., waiting for double-tap to fail before firing single-tap); and
3. `Gesture.Race(gesture1, gesture2)` activates whichever gesture satisfies its recognition criteria first and cancels the other.

---

#### 46. What is `LayoutAnimation`, and when should you use it over Reanimated or `Animated`?

`LayoutAnimation` is a global API that automatically animates all subsequent layout changes (creations, movements, deletions, and resizes) on the native UI thread across the entire view hierarchy with zero JavaScript calculation overhead. It is triggered by calling `LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut)` immediately before updating state (such as expanding an accordion or removing an item from a list). On Android, it requires `UIManager.setLayoutAnimationEnabledExperimental(true)` to be enabled.

---

#### 47. How do `useSharedValue` and `useAnimatedStyle` collaborate in Reanimated?

`useSharedValue(initialValue)` creates a thread-safe, mutable memory container that can be read and written synchronously on both the JS and UI threads without causing React component re-renders. `useAnimatedStyle(() => { return { transform: [{ translateX: sharedValue.value }] } })` creates a reactive worklet that listens for mutations to any shared value accessed inside its body and automatically updates the corresponding native view properties directly on the UI thread at 60/120 FPS.

---

#### 48. How do you implement a 60 FPS swipeable bottom sheet using Reanimated and Gesture Handler?

You wrap the bottom sheet view in a `GestureDetector` configured with `Gesture.Pan()`. In `onUpdate((event) => { translateY.value = Math.max(minSnap, Math.min(maxSnap, event.translationY + context.value)) })`, you update a shared value `translateY` synchronously on the UI thread. In `onEnd((event) => { translateY.value = withSpring(targetSnapPoint, { velocity: event.velocityY }) })`, you animate to the nearest snap point using spring physics. The container uses `useAnimatedStyle` to apply `transform: [{ translateY: translateY.value }]`, ensuring completely smooth gestures with zero JS thread dependency.

---

#### 49. What is React Native Skia, and what are its advantages for high-performance graphics?

React Native Skia brings Google's Skia 2D graphic library (the same engine powering Flutter, Chrome, and Android UI) to React Native. It allows developers to render complex custom 2D graphics, vector paths, shaders, gradients, particle systems, and high-framerate real-time charts directly to a hardware-accelerated GPU canvas via JSI, bypassing both the bridge and standard native platform view hierarchies for unmatched graphic rendering speed.

---

#### 50. How do you prevent UI thread blocking during continuous gestures in React Native?

To prevent UI thread blocking during gestures:
1. use `react-native-gesture-handler` combined with Reanimated worklets so all gesture math runs on the UI thread
2. avoid calling `runOnJS` inside high-frequency gesture callbacks (`onUpdate`)
3. avoid setting React state (`setState`) on every gesture frame tick
4. defer heavy background calculations using `InteractionManager.runAfterInteractions` or Web Workers; and
5. keep view hierarchies shallow under the gesture responder.

---


### 4. Animations & Gesture Handling (Reanimated 3, Gesture Handler, Skia)

#### 51. What is the difference between React Navigation's standard Stack Navigator and Native Stack Navigator?

The standard JS Stack Navigator (`@react-navigation/stack`) renders screens as JavaScript views and animates screen transitions using the `Animated` library on the JS/UI thread. The Native Stack Navigator (`@react-navigation/native-stack`) leverages `react-native-screens` to render screens using platform-native navigation primitives (`UINavigationController` on iOS and Android Fragment management), providing native screen transitions, native swipe-to-back gestures, platform-native header styling, and superior memory optimization.

---

#### 52. How do you configure Deep Linking in React Navigation?

You define a `linking` configuration object containing the URI `prefixes` (e.g., `['myapp://', 'https://myapp.com']`) and a `config` object mapping URL path segments to screen names (e.g., `screens: { Profile: 'user/:id' }`). You pass this object to the root `<NavigationContainer linking={linking} fallback={<ActivityIndicator />} />`. When an incoming deep link or universal link activates the app, React Navigation automatically parses the URL and navigates to the matching screen with route parameters extracted.

---

#### 53. Why is passing large objects through navigation route parameters considered an anti-pattern?

Passing large objects via route parameters:
1. degrades navigation transition performance due to object serialization and parameter cloning across screens,
2. makes deep linking fragile because URLs cannot easily represent complex nested objects, and
3. causes data staleness where the destination screen displays outdated cached parameters if the underlying data updates elsewhere in the app. The best practice is to pass only lightweight entity IDs (e.g., `{ userId: '123' }`) and fetch or select the data from global state/cache inside the target screen.

```tsx
import React from 'react';
import { Button, View } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated';

export function SpringBox() {
  const offset = useSharedValue(0);

  // Computed on UI Thread (Worklet)
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: withSpring(offset.value * 100) }],
  }));

  return (
    <View>
      <Animated.View style={[{ width: 80, height: 80, backgroundColor: 'royalblue' }, animatedStyle]} />
      <Button title="Move" onPress={() => (offset.value = offset.value === 0 ? 1 : 0)} />
    </View>
  );
}
```

---

#### 54. How do you handle navigation lifecycle events like screen focus and blur in React Navigation?

You can listen to screen lifecycle events using the `useFocusEffect` hook or navigation event listeners (`navigation.addListener('focus', callback)` and `navigation.addListener('blur', callback)`). `useFocusEffect(useCallback(() => { fetchData(); return () => cleanup(); }, []))` executes its callback every time the screen comes into active focus and runs the returned cleanup function when the screen loses focus or unmounts, making it ideal for polling, screen analytics, and hardware listeners.

---

#### 55. How do you achieve strict type safety in React Navigation with TypeScript?

You define a TypeScript type mapping every route name to its parameter list (e.g., `type RootStackParamList = { Home: undefined; Details: { itemId: string } }`). You then type your screen components using `NativeStackScreenProps<RootStackParamList, 'Details'>`, which strictly types `navigation` methods (preventing navigation to invalid routes or missing parameters) and guarantees type safety for `route.params`. Global typing can be registered via `declare global { namespace ReactNavigation { interface RootParamList extends RootStackParamList {} } }`.

```tsx
import React from 'react';
import { StyleSheet } from 'react-native';
import { GestureDetector, Gesture } from 'react-native-gesture-handler';
import Animated, { useSharedValue, useAnimatedStyle } from 'react-native-reanimated';

export function DraggableCard() {
  const translationX = useSharedValue(0);
  const translationY = useSharedValue(0);
  const prevX = useSharedValue(0);
  const prevY = useSharedValue(0);

  const panGesture = Gesture.Pan()
    .onStart(() => {
      prevX.value = translationX.value;
      prevY.value = translationY.value;
    })
    .onUpdate((event) => {
      translationX.value = prevX.value + event.translationX;
      translationY.value = prevY.value + event.translationY;
    });

  const animStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translationX.value }, { translateY: translationY.value }],
  }));

  return (
    <GestureDetector gesture={panGesture}>
      <Animated.View style={[styles.box, animStyle]} />
    </GestureDetector>
  );
}

const styles = StyleSheet.create({ box: { width: 100, height: 100, backgroundColor: 'tomato' } });
```

---

#### 56. How does `react-native-screens` optimize memory consumption across large navigation stacks?

`react-native-screens` integrates directly with native navigation containers (`UIViewController` and `Fragment`). When a screen is pushed onto the stack, `react-native-screens` detaches inactive background screens from the native view hierarchy while preserving their native controller state. This reclaims GPU and native memory buffers from offscreen views, preventing memory pressure crashes on low-end devices with deep navigation stacks.

---

#### 57. How do you architect an Authentication flow in React Navigation without navigation bugs?

The recommended architecture is conditional screen rendering at the root navigator level based on global authentication state: `isSignedIn ? <AppStack /> : <AuthStack />`. When the user logs in or logs out, React re-renders the navigator and automatically switches the active stack. This eliminates the need to imperatively call `navigation.navigate()` or manually reset the navigation history, making unauthorized screen access impossible.

```tsx
import { Canvas, Circle, Group } from '@shopify/react-native-skia';

// High-performance GPU-rendered vector graphics at 60/120 FPS
export function SkiaGraphic() {
  return (
    <Canvas style={{ width: 256, height: 256 }}>
      <Group color="lightblue">
        <Circle cx={128} cy={128} r={100} />
      </Group>
    </Canvas>
  );
}
```

---

#### 58. How do you handle Android hardware back button presses in nested React Navigation structures?

React Navigation automatically handles back navigation through its active navigation tree. However, for custom screen behavior (like preventing back navigation on an unfinished form), you use the `beforeRemove` event: `navigation.addListener('beforeRemove', (e) => { e.preventDefault(); showConfirmDialog(() => navigation.dispatch(e.data.action)); })`. This intercepts any back action—whether from the hardware back button, header back button, or swipe gesture—and presents a confirmation dialog.

---

#### 59. What is the difference between `AsyncStorage` and `react-native-mmkv`?

`AsyncStorage` is an asynchronous, bridge-dependent key-value store that writes unencrypted data to SQLite or file storage, suffering from slow I/O and serialization latency. `react-native-mmkv` (developed by Tencent and wrapped for RN) is a high-performance, synchronous key-value storage engine written in C++ that interfaces directly with JavaScript via JSI. It utilizes memory-mapped files (`mmap`) for instant read/write operations (up to 30x faster than AsyncStorage), supports AES-256 encryption, and requires no async/await promises.

---

#### 60. When should you use SQLite (or WatermelonDB) instead of key-value storage in React Native?

SQLite or WatermelonDB should be used when the application requires complex offline-first capabilities, relational data models, structured queries, multi-table indexing, full-text search, and persistence of tens of thousands of records. WatermelonDB is particularly optimized for React Native because it is lazy-loaded, observable (automatically updating React components when database rows change), and runs SQLite queries in a separate background thread.

---

#### 61. What is SSL Pinning, and how is it implemented in React Native to prevent Man-in-the-Middle (MITM) attacks?

SSL Pinning is a security technique where the mobile app is hardcoded to trust only a specific cryptographic public key or SSL certificate belonging to the backend server, rejecting any connection signed by unknown or compromised Certificate Authorities (CAs). In React Native, it is implemented natively using libraries like `react-native-ssl-pinning` or by configuring native network security configs (`network_security_config.xml` on Android and `TrustKit` on iOS) to intercept all HTTPS requests and validate the server's public key hash.

---

#### 62. How should sensitive data like JWT tokens and encryption keys be stored in React Native?

Sensitive data should never be stored in plain text in `AsyncStorage` or unencrypted `MMKV`. It should be stored in platform-native secure hardware storage: iOS Keychain (using `kSecAttrAccessibleAfterFirstUnlockThisDeviceOnly`) and Android Keystore (backed by `EncryptedSharedPreferences` and Hardware Security Modules / StrongBox). In React Native, this is achieved using libraries such as `react-native-keychain` or `expo-secure-store`.

---

#### 63. How do you implement an offline synchronization queue with conflict resolution in React Native?

You maintain a local SQLite/WatermelonDB mutation queue table. When the device is offline, outgoing API mutations (POST/PUT/DELETE) are saved locally with a pending status and timestamp. A network listener (`@react-native-community/netinfo`) triggers a background sync worker when connectivity returns. The worker processes the queue sequentially, applying conflict resolution strategies such as "Last-Write-Wins" (LWW based on server timestamps), field-level merging, or flagging conflicts for user manual resolution.

---

#### 64. How does `react-native-fast-image` improve image performance over standard `<Image>`?

Standard React Native `<Image>` suffers from lack of aggressive caching, image flickering on re-render, and memory bloat. `react-native-fast-image` is a wrapper around the battle-tested native image caching engines SDWebImage (iOS) and Glide (Android). It provides:
1. aggressive disk and memory caching,
2. image preloading,
3. cache priority levels (low, normal, high),
4. GIF and WebP support, and
5. automatic native downsampling to match view dimensions, drastically reducing RAM usage.

---

#### 65. Scenario: An API request works on Android but fails on iOS with "Network Request Failed". What are the likely causes and solutions?

1. **App Transport Security (ATS)**: iOS blocks unencrypted HTTP requests by default; resolve by using HTTPS or adding an exception domain in `Info.plist` under `NSAppTransportSecurity`
2. **Localhost IP mismatch**: Android emulator uses `10.0.2.2` to access host localhost, while iOS simulator uses `128.0.0.1` or `localhost`
3. **Self-signed SSL Certificates**: iOS strictly rejects invalid or self-signed certs in development unless explicitly trusted in the simulator settings
4. **Trailing slashes or malformed headers**: iOS networking stack is stricter with RFC standards than Android OkHttp.

---


### 5. Navigation & Deep Linking (React Navigation, Expo Router)

#### 66. How do you create a legacy Native Module in Android using Java/Kotlin?

You create a class that extends `ReactContextBaseJavaModule`, override `getName()` to return the module name exposed to JavaScript, and annotate public methods with `@ReactMethod` taking a `Promise` parameter (`@ReactMethod fun doAction(param: String, promise: Promise)`). You then create a `ReactPackage` that implements `createNativeModules()`, add your module instance to the list, and register this package in `MainApplication.kt`'s `getPackages()` list.

```tsx
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';

// Native Stack uses platform UIViewController (iOS) and Fragment (Android)
const Stack = createNativeStackNavigator();

export function RootNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerBackTitleVisible: false }}>
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Details" component={DetailsScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
```

---

#### 67. How do you create a legacy Native Module in iOS using Objective-C and Swift?

In Objective-C, you create a class implementing the `RCTBridgeModule` protocol, use the macro `RCT_EXPORT_MODULE(ModuleName)` to expose it to JS, and use `RCT_EXPORT_METHOD(methodName:(NSString *)param resolver:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject)` to expose methods. In Swift, you annotate the class and methods with `@objc`, create an Objective-C bridging header, and use `RCT_EXTERN_MODULE` and `RCT_EXTERN_METHOD` in an auxiliary `.m` file to export the Swift interfaces to React Native.

```typescript
// Deep Linking Configuration Object
const linking = {
  prefixes: ['myapp://', 'https://myapp.com'],
  config: {
    screens: {
      Home: 'feed',
      Details: 'product/:id', // Maps to myapp://product/123
      Settings: 'settings',
    },
  },
};

<NavigationContainer linking={linking} fallback={<ActivityIndicator />}>
  {/* Navigator */}
</NavigationContainer>
```

---

#### 68. How do you build a TurboModule using TypeScript Spec and Codegen in the New Architecture?

1. Define a strict TypeScript interface extending `TurboModule` (e.g., `NativeCalculator.ts`) containing method signatures with typed parameters and return promises
2. run Codegen during the native build, which parses the TS spec and generates C++ abstract base classes (`NativeCalculatorSpecJSI`)
3. **implement the generated interface in native code**: on Android, subclass `NativeCalculatorSpec` in Kotlin/Java; on iOS, implement the `NativeCalculatorSpec` protocol in Objective-C++ or Swift
4. import the module in JS via `TurboModuleRegistry.getEnforcing<Spec>('NativeCalculator')`.

---

#### 69. How do you emit events from a Native Module to JavaScript in Android and iOS?

On Android, you obtain the `ReactApplicationContext` and dispatch events to the `DeviceEventManagerModule.RCTDeviceEventEmitter` via `.emit("eventName", params)`. On iOS, your native module subclasses `RCTEventEmitter`, implements `supportedEvents` returning an array of event name strings, and dispatches events via `[self sendEventWithName:@"eventName" body:params]`. In JavaScript, you listen to events using `new NativeEventEmitter(NativeModule).addListener('eventName', callback)` and remove subscriptions on cleanup.

---

#### 70. How do you ensure thread safety when developing Native Modules in React Native?

By default, Native Module methods in iOS execute on a shared background queue, and in Android, they run on the Catalyst/JS background thread. Any operation that touches or mutates native UI elements must be explicitly dispatched to the platform Main/UI Thread: on Android using `UiThreadUtil.runOnUiThread { ... }` or `activity.runOnUiThread { ... }`, and on iOS using `dispatch_async(dispatch_get_main_queue(), ^{ ... })` or overriding `methodQueue` to return `dispatch_get_main_queue()`.

---

#### 71. What is the role of Codegen in the React Native New Architecture?

Codegen is a build-time code generator that reads static TypeScript or Flow interface specifications for TurboModules and Fabric components. It automatically generates strongly-typed C++ header files, glue code, JNI bindings for Android, and Objective-C++ protocols for iOS. This guarantees compile-time type safety across language boundaries, eliminates manual runtime argument validation, and prevents runtime type mismatches between JS and native layers.

---

#### 72. What are C++ TurboModules, and what advantages do they offer over platform-specific modules?

C++ TurboModules are native modules written entirely in C++ rather than separate Java/Kotlin and Objective-C/Swift files. Because C++ is natively compiled on both Android (via NDK) and iOS (via Clang), a single C++ TurboModule codebase runs cross-platform without duplicating business logic, native networking, or cryptography across platforms, providing maximum execution performance and zero JNI bridge overhead on Android.

```typescript
// RootNavigation.ts: Imperative navigation without passing navigation prop
import { createNavigationContainerRef } from '@react-navigation/native';

export const navigationRef = createNavigationContainerRef();

export function navigate(name: string, params?: object) {
  if (navigationRef.isReady()) {
    navigationRef.navigate(name as never, params as never);
  }
}

// In App.tsx:
<NavigationContainer ref={navigationRef}>...</NavigationContainer>
```

---

#### 73. What is the difference between JS thread bottlenecks and UI thread bottlenecks, and how do you diagnose them?

A JS thread bottleneck occurs when heavy JavaScript execution (large state processing, JSON parsing, unoptimized loops) delays business logic and touch event responses; it is diagnosed when FPS drops on the JS thread while the UI thread stays at 60 FPS in the React Native Performance Monitor. A UI thread bottleneck occurs when the native main thread is overwhelmed by deeply nested view hierarchies, heavy native view creation, or expensive layout passes; it is diagnosed when UI FPS drops while JS FPS remains at 60 FPS.

---

#### 74. How do you identify and debug memory leaks in a React Native application?

You identify memory leaks by:
1. monitoring memory growth across screen transitions using Android Studio Memory Profiler and Xcode Instruments (Leaks & Allocations)
2. generating and comparing Chrome DevTools / Hermes Heap Snapshots before and after mounting/unmounting screens to identify detached DOM/React fiber trees; and
3. **inspecting codebase for common culprits**: uncleaned `setInterval`/`addEventListener` subscriptions, closures retaining large objects, circular references in native modules, and un-evicted global caches.

---

#### 75. How does Hermes Memory Profiling work with Chrome DevTools?

When running a Hermes-enabled app in debug mode, developers can capture heap profiles by connecting to the Metro bundler via `chrome://inspect`. Hermes records memory allocations and object graphs. Analyzing the resulting `.heapsnapshot` file displays object constructors, shallow size (memory held by the object itself), and retained size (memory freed if the object is garbage collected), allowing developers to pinpoint retaining paths for leaked component instances.

---

#### 76. What are the best practices for reducing the final app bundle size in React Native?

1. Enable Hermes for pre-compiled bytecode
2. enable ProGuard/R8 code shrinking and `shrinkResources true` on Android
3. enable ABI splits on Android to generate architecture-specific APKs (`arm64-v8a`, `armeabi-v7a`) rather than a single bloated universal APK
4. convert large PNG/JPEG assets to WebP format or host them on a CDN
5. use vector icons (`react-native-vector-icons`) and custom SVGs
6. remove unused npm dependencies and utilize tree-shaking with `babel-plugin-transform-remove-console` in production.

---

#### 77. How do you optimize heavy JSON parsing in React Native to prevent JS thread freezes?

Parsing a multi-megabyte JSON payload on the single JS thread can freeze the UI for hundreds of milliseconds. Optimizations include:
1. paginating or streaming API responses so the backend sends smaller chunks,
2. offloading JSON parsing to a C++ TurboModule that parses the data natively on a background thread and creates JSI Host Objects, or
3. using Web Workers / quick-js worker threads to parse data off the main JavaScript thread.

---

#### 78. What is `removeClippedSubviews`, and when should you use it?

`removeClippedSubviews` is a native prop available on `View`, `ScrollView`, and `FlatList`. When set to `true`, native views that are currently outside the clipping boundaries of the screen are detached from the native view hierarchy, immediately freeing native GPU and memory rendering buffers. It is particularly effective on Android for long lists, though it should be tested thoroughly to avoid blank clipping glitches during fast scrolling.

---

#### 79. How do you optimize SVG performance in React Native using `react-native-svg`?

Complex SVGs with thousands of nodes and paths can degrade render performance. To optimize:
1. clean and minimize SVGs using tools like SVGO to remove redundant metadata, groups, and hidden paths
2. convert static SVGs into pre-compiled React Native components using `@svgr/cli`
3. avoid animating individual internal SVG path coordinates with React state; and
4. for high-performance dynamic vector animations, use React Native Skia or Lottie rather than continuously re-rendering `react-native-svg`.

---

#### 80. What is the difference between `KeyboardAvoidingView` and `react-native-keyboard-controller`?

`KeyboardAvoidingView` is React Native's built-in component that shifts screen contents when the soft keyboard appears using `padding`, `height`, or `position` behaviors, but it often suffers from jitter, delayed animation synchronization, and cross-platform inconsistencies. `react-native-keyboard-controller` is a modern native library that synchronizes keyboard height changes with interactive keyboard dismissal gestures at 60/120 FPS natively, providing smooth, physics-based keyboard animations and full interactive keyboard tracking.

---


### 6. Networking, Offline Sync & Local Storage (MMKV, SQLite, WatermelonDB)

#### 81. Scenario: App RAM usage steadily increases from 120MB to 800MB as the user navigates between screens, resulting in an Out-Of-Memory (OOM) crash. How do you diagnose and fix this?

1. **Diagnose**: Connect the app to Xcode Instruments Allocations / Android Studio Profiler and observe which objects survive screen unmounting; take Hermes heap snapshots before and after navigating through 10 screens
2. **Common Causes**: Global event listeners not unsubscribed in `useEffect` cleanup, images cached indefinitely in memory without size limits, global Redux/Zustand state accumulating un-purged list data, or native views held by detached navigation controllers
3. **Fix**: Add cleanups to all `useEffect` listeners, enable `react-native-screens` to freeze background screens, configure `react-native-fast-image` with explicit memory limits, and clear offscreen screen caches upon unmount.

```typescript
import { MMKV } from 'react-native-mmkv';

// Synchronous, C++ mmap-backed key-value store (30x faster than AsyncStorage)
export const storage = new MMKV({
  id: 'user-storage',
  encryptionKey: 'secure-encryption-key',
});

// Fast Synchronous Read/Write
storage.set('user.token', 'jwt-token-string');
const token = storage.getString('user.token');
storage.delete('user.token');
```

---

#### 82. How does a React `ErrorBoundary` work in React Native, and what are its limitations?

An `ErrorBoundary` is a class component that implements `static getDerivedStateFromError()` and `componentDidCatch()` to catch JavaScript errors anywhere in its child component tree, log the error, and display a fallback UI instead of crashing the app. Limitations: Error boundaries do NOT catch errors in asynchronous code (e.g., `setTimeout`, async thunks, promise rejections), native module crashes (C++/Java/Obj-C exceptions), event handlers (e.g., `onPress`), or errors thrown in the ErrorBoundary component itself.

---

#### 83. How do you catch global unhandled JavaScript errors and unhandled Promise rejections in React Native?

You use global error handlers:
1. for unhandled synchronous and render JS errors, use `ErrorUtils.setGlobalHandler((error, isFatal) => { Sentry.captureException(error); ... })`
2. for unhandled Promise rejections, set `require('promise/setimmediate/rejection-tracking').enable({ allRejections: true, onUnhandled: (id, error) => { Sentry.captureException(error); } })` or use modern global hooks like `react-native-exception-handler` to intercept fatal crashes and display an emergency fallback screen before native termination.

---

#### 84. How do source maps work in React Native, and how are production crash stack traces symbolicated?

During production builds, Metro compiles and minifies all JavaScript files into a single bundle file (`index.android.bundle` / `main.jsbundle`), generating a corresponding `.map` source map file that maps minified line/column numbers back to original source code files. When a production crash occurs, crash monitoring tools (like Sentry or Bugsnag) take the minified stack trace from the client, look up the corresponding release source map on their servers, and symbolicate the trace into human-readable TypeScript file names and line numbers.

```tsx
import React, { useEffect, useState } from 'react';
import NetInfo from '@react-native-community/netinfo';
import { View, Text } from 'react-native';

export function OfflineBanner() {
  const [isConnected, setIsConnected] = useState<boolean | null>(true);

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state) => {
      setIsConnected(state.isConnected && state.isInternetReachable !== false);
    });
    return () => unsubscribe();
  }, []);

  if (isConnected) return null;
  return <View><Text>No Internet Connection</Text></View>;
}
```

---

#### 85. How do you implement End-to-End (E2E) testing in React Native using Maestro or Detox?

Detox runs on real devices/simulators by synchronizing with the React Native bridge and executing gray-box tests written in JavaScript/Jest, asserting UI element presence using testIDs (`element(by.id('login_button')).tap()`). Maestro is a modern, lightweight, black-box UI testing tool that operates via declarative YAML test flows (e.g., `- tapOn: "Login"`), requiring no test framework configuration or bridge synchronization, making tests fast, resilient to timing issues, and easy to run in CI/CD.

```typescript
import axios from 'axios';
import { storage } from './storage';

const apiClient = axios.create({ baseURL: 'https://api.example.com' });

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      const newToken = await refreshAuthToken(); // Refresh JWT
      storage.set('token', newToken);
      originalRequest.headers.Authorization = `Bearer ${newToken}`;
      return apiClient(originalRequest); // Retry original request
    }
    return Promise.reject(error);
  }
);
```

---

#### 86. How do you mock Native Modules in Jest for unit testing React Native components?

You mock native modules in Jest setup files (`jest.setup.js`) using `jest.mock('react-native', () => { const RN = jest.requireActual('react-native'); RN.NativeModules.MyCustomModule = { fetchData: jest.fn().mockResolvedValue({ status: 'success' }) }; return RN; })`. For third-party libraries (e.g., `react-native-keychain` or `react-native-reanimated`), you use their official Jest mocks (e.g., `require('react-native-reanimated/mock')`) to simulate native behaviors in a Node.js test environment.

---

#### 87. Scenario: A mysterious production crash `SIGSEGV` / `EXC_BAD_ACCESS` in native C++ code is reported in Sentry without a JavaScript stack trace. How do you investigate it?

1. **Obtain the native crash dump and platform symbol files**: dSYM files for iOS and `mapping.txt` / unstripped native `.so` symbol files for Android
2. symbolicate the native backtrace using `atos` / Xcode Crash Organizer (iOS) or `ndk-stack` (Android) to identify the exact C++ file and line number
3. **check for common causes**: race conditions where native code accesses a deallocated JSI Host Object, memory corruption in a third-party C++ library, or a background thread attempting to invoke JNI methods after the React instance has been destroyed.

---

#### 88. How do you protect a React Native application against reverse engineering and tampering?

1. Enable Hermes to compile JavaScript into binary bytecode, making reverse engineering significantly harder than plain minified JS
2. enable R8/ProGuard on Android for native code obfuscation and dead-code stripping
3. utilize JavaScript obfuscators (like Jscrambler) for high-security logic
4. implement Root/Jailbreak detection
5. enforce SSL Pinning to prevent MITM proxy inspection
6. never store private API secrets or private keys in the client-side JavaScript bundle.

---

#### 89. How do you implement Root and Jailbreak detection in React Native?

You use native detection libraries like `react-native-jail-monkey` or custom native modules that check for:
1. presence of common root/jailbreak binaries and paths (e.g., `/system/app/Superuser.apk`, `/Applications/Cydia.app`, `su` binary in `$PATH`),
2. ability to write to read-only system directories,
3. hooking frameworks (Frida, Xposed, Substrate), and
4. emulator detection. If compromised, the app can alert the user, disable sensitive features, or terminate immediately.

---

#### 90. How do you implement Biometric Authentication (FaceID/TouchID/BiometricPrompt) with native cryptographic security?

You integrate libraries like `react-native-biometrics` or `react-native-keychain`. Rather than simply relying on a boolean check (`isSuccess === true`), secure implementations generate a public/private cryptographic keypair stored in the hardware Secure Enclave / Android Keystore, gated behind biometric authorization (`BIOMETRIC_STRONG`). When authenticating, the app prompts the user for biometrics, signs a server-generated nonce with the private key, and verifies the signature on the backend server.

---

#### 91. What are the essential Accessibility (a11y) properties in React Native, and how do they impact Screen Readers?

Essential a11y properties include:
1. `accessible={true}`: groups child components into a single selectable accessibility element
2. `accessibilityLabel="string"`: provides the localized text spoken by screen readers (TalkBack on Android, VoiceOver on iOS)
3. `accessibilityRole="button" | "header" | "link"`: communicates the element's semantic purpose
4. `accessibilityState={{ disabled: true, selected: true }}`: conveys dynamic state; and
5. `accessibilityHint="string"`: describes the action outcome for the user.

---

#### 92. How do you handle Push Notifications across all three application states (Foreground, Background, Killed)?

Using Firebase Cloud Messaging (FCM) / Notifee:
1. **Foreground**: `messaging().onMessage(async remoteMessage => { ... })` receives the payload while the app is active and presents a local notification via Notifee
2. **Background**: `messaging().setBackgroundMessageHandler(async remoteMessage => { ... })` processes the payload silently in the background
3. **Killed / Quit State**: when a user taps a notification that launches the app from a terminated state, `messaging().getInitialNotification()` retrieves the payload on launch, allowing you to route to the target screen.

---

#### 93. How do you handle deep link routing when an app is opened from a push notification in a terminated (killed) state?

In the root component or navigation container, call `messaging().getInitialNotification()` inside a `useEffect` on app startup. If an initial notification payload exists, extract the deep link URL or route parameters (e.g., `{ screen: 'OrderDetails', orderId: '987' }`). Ensure the navigation container is fully initialized and ready (using `onReady` on `<NavigationContainer>`) before dispatching the navigation action to prevent race conditions and failed transitions.

---

#### 94. How do you handle dynamic font scaling without breaking UI layouts in React Native?

When users increase system font size for accessibility, text can truncate or overflow containers. Best practices include:
1. design flexible layouts using `minHeight` and flex wrapping instead of rigid, fixed `height` on containers
2. use `numberOfLines` combined with `ellipsizeMode="tail"` where appropriate
3. cap the maximum scaling multiplier using `maxFontSizeMultiplier={1.3}` on `<Text>` components to prevent extreme UI breakage while maintaining accessibility compliance; avoid setting `allowFontScaling={false}` globally as it violates accessibility guidelines.

---

#### 95. Scenario: Push notifications work reliably in development and staging, but fail silently in production. What are the most likely root causes?

1. **iOS APNs Certificate/Environment Mismatch**: The production build was signed with a Production Provisioning Profile, but the backend is sending notifications to the Sandbox APNs endpoint (or using a development APNs Auth Key)
2. Missing `google-services.json` or `GoogleService-Info.plist` for the production build flavor
3. Missing Push Notification entitlement or capability in the production App ID / Provisioning Profile on Apple Developer Portal
4. User notification permissions were denied or not requested properly on Android 13+ (`POST_NOTIFICATIONS`) or iOS.

---


### 7. Native Modules, Bridges & Codegen

#### 96. Scenario: App startup time (TTI) increased from 1.2 seconds to 4.8 seconds after integrating several new libraries. How do you conduct an audit and fix it?

1. **Audit**: Profile the startup sequence using Hermes Profiler and Android Systrace / Xcode Time Profiler to identify whether the delay is in native initialization, JS bundle loading, or React root rendering
2. **Bundle Analysis**: Run `react-native-bundle-visualizer` to identify bloated dependencies and duplicate packages
3. **Fixes**: Ensure Hermes is enabled with AOT bytecode compilation; convert legacy eagerly-loaded Native Modules to lazy TurboModules; defer non-critical SDK initializations (e.g., analytics, crash reporting, ads) until after the root component mounts; enable `react-native-screens` to prevent pre-rendering inactive navigation tabs.

```kotlin
// Android Native Module (Kotlin)
package com.myapp

import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import com.facebook.react.bridge.Promise

class DeviceInfoModule(reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext) {
    override fun getName(): String = "DeviceInfoModule"

    @ReactMethod
    fun getBatteryLevel(promise: Promise) {
        try {
            val level = 85 // Read battery manager
            promise.resolve(level)
        } catch (e: Exception) {
            promise.reject("BATTERY_ERROR", e.message)
        }
    }
}
```

---

#### 97. What is the difference between `Platform.select()` and platform-specific file extensions (`.android.js` / `.ios.js`)?

`Platform.select({ ios: valueA, android: valueB })` is evaluated at runtime to return platform-specific values or inline styles. Platform-specific file extensions (`Button.android.tsx` and `Button.ios.tsx`) are resolved at build time by the Metro bundler; Metro only bundles the target platform's file into the binary, resulting in smaller bundle sizes, cleaner architecture, and zero runtime platform checking overhead for platform-divergent components.

```objc
// iOS Native Module (Objective-C)
#import <React/RCTBridgeModule.h>

@interface DeviceInfoModule : NSObject <RCTBridgeModule>
@end

@implementation DeviceInfoModule
RCT_EXPORT_MODULE();

RCT_EXPORT_METHOD(getBatteryLevel:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)
{
    resolve(@85);
}
@end
```

---

#### 98. How do you implement responsive layouts for Tablets, Foldables, and Phones in React Native?

1. Use `useWindowDimensions()` to reactively obtain screen width and height
2. establish responsive breakpoint utilities (e.g., `isTablet = width >= 768`)
3. use percentage-based dimensions or responsive scaling utilities (`react-native-size-matters`)
4. **utilize Flexbox `flexWrap**: 'wrap'` and multi-column `FlatList` layouts (`numColumns={isTablet ? 3 : 1}`)
5. test dynamically on foldable devices when transitioning between folded and unfolded screen sizes.

---

#### 99. What are Microtasks vs Macrotasks in the React Native event loop?

Microtasks include `Promise.then()`, `queueMicrotask()`, and `async/await` continuations; they are executed immediately after the currently running script and before the JavaScript engine yields control or processes the next macrotask. Macrotasks include `setTimeout`, `setInterval`, `setImmediate`, and bridge event callbacks. Microtask queues run to complete exhaustion before the next macrotask is dequeued, meaning long microtask chains can starve UI events and cause frame drops.

---

#### 100. How does the `StyleSheet.create()` method optimize styling in React Native?

`StyleSheet.create()` validates style properties at initialization and assigns each style declaration an internal integer ID in the style registry (in legacy architecture) or optimizes them into static immutable structures. This avoids generating new JavaScript style objects on every render pass, speeds up serialization/C++ property lookups, and ensures cleaner separation of styling logic from component markup.

---

#### 101. How do you handle App State restoration after Android OS kills the app in the background to reclaim memory?

When Android kills an app process in the background due to low memory, it recreates `MainActivity` from scratch when the user returns. To restore state:
1. persist critical navigation state and screen inputs to `MMKV` or `AsyncStorage` on state changes
2. use React Navigation's built-in `initialState` persistence mechanism with `onStateChange`
3. on app launch, read the persisted state and hydrate the global store and navigation container seamlessly before rendering the UI.

---

#### 102. What is the difference between shallow and deep linking, and how do Universal Links / App Links differ from custom URI schemes?

Custom URI schemes (e.g., `myapp://product/123`) are simple URLs registered by the app, but if the app is not installed, the browser displays a broken page error, and multiple apps can register the same scheme. Universal Links (iOS) and Android App Links (Android) use standard HTTPS URLs (e.g., `https://myapp.com/product/123`) verified via domain association files (`apple-app-site-association` and `assetlinks.json`). If the app is installed, the OS opens it directly without opening the browser; if not installed, it gracefully falls back to the web page.

---

#### 103. How do you implement dark mode theming cleanly across a React Native codebase?

1. Create a centralized theme object with semantic color tokens (e.g., `background`, `surface`, `textPrimary`)
2. listen to system theme changes using the `useColorScheme()` hook (`'light' | 'dark'`)
3. provide the theme via a React Context or a reactive global Zustand store
4. create a custom hook `useTheme()` that returns the active color palette and style generator functions, ensuring instant re-theming across all screens when the user or OS toggles dark mode.

---

#### 104. How do you handle multi-language internationalization (i18n) and RTL (Right-to-Left) layouts in React Native?

For internationalization, use `i18next` and `react-i18next` with localized JSON translation strings. For RTL layout support (e.g., Arabic, Hebrew), use React Native's `I18nManager`. React Native automatically mirrors Flexbox layouts (`start` and `end` replace `left` and `right`) when RTL is active. If switching languages at runtime requires an RTL direction change, call `I18nManager.forceRTL(true)` and trigger an app reload using `react-native-restart` because native layout directions require root view recreation.

---

#### 105. How do you handle background file downloads or uploads that persist even if the user leaves the app?

Standard `fetch` and `axios` calls terminate when the app process is suspended in the background. To execute persistent background transfers, use native background download managers such as `@kesha-antonov/react-native-background-downloader` or `react-native-fs` background upload capabilities. These libraries leverage iOS `NSURLSessionConfiguration.backgroundSession` and Android `WorkManager` / `DownloadManager` to manage file I/O at the OS level and notify the JS layer upon completion.

---

#### 106. What is the difference between `useTransition` and `useDeferredValue` in React Native 18?

`useTransition` gives you a setter wrapper (`startTransition(() => setSearchQuery(text))`) and a pending state boolean `isPending` to mark a state update as non-urgent. `useDeferredValue(value)` accepts an existing value and returns a deferred version of that value that lags behind urgent renders, allowing the component to render the current urgent value (like an input field) while deferring expensive child subtrees (like a 200-item filtered list) until the main thread is idle.

---

#### 107. How does the `memoize` pattern prevent redundant calculations in Redux selectors with Reselect?

Standard Redux selectors recalculate their output whenever the root Redux state changes, even if the relevant sub-slice did not change. Reselect's `createSelector` creates memoized selectors that store the previous input parameters and calculated result. If the input references have not changed, it returns the cached result immediately, preventing expensive filtering, sorting, or mapping operations from running on every dispatched action.

---

#### 108. What are `ShadowNode` and `ShadowTree` in React Native's C++ core?

In the React Native rendering pipeline, a `ShadowNode` is an immutable C++ object representing a React component in the layout hierarchy. It contains component props, layout styles, and layout calculation results computed by Yoga. The `ShadowTree` is the complete immutable hierarchy of these `ShadowNode`s. Fabric computes layout operations directly on C++ ShadowTrees across threads, enabling non-blocking background layout calculation and instantaneous mounting to native views.

---

#### 109. How do you integrate third-party C++ libraries into a modern React Native app?

You integrate third-party C++ libraries via CMake (Android) and Xcode build settings (iOS) within a TurboModule. On Android, you configure `CMakeLists.txt` in `android/` to compile the C++ source files and link shared libraries via JNI/JSI. On iOS, you add the C++ source files and headers directly into the Podspec. The TurboModule then interfaces directly with the C++ library functions via JSI without bridging layers.

---

#### 110. How do you handle deep link security vulnerabilities (e.g., Parameter Tampering, Open Redirects) in React Native?

1. Validate and sanitize all incoming route parameters before acting on them (e.g., verifying that IDs match expected formats)
2. never execute sensitive actions (like money transfers, account deletion, or password reset) directly from a deep link without explicit user authentication and confirmation
3. restrict URL redirects to an explicit whitelist of trusted domains to prevent open redirect vulnerabilities
4. use signed tokens (JWTs) with short expirations for sensitive deep-linked flows.

---


### 8. Testing, Security, Profiling & Production Scenarios

#### 111. What is the difference between `react-native-config`, `.env` files, and dynamic runtime configuration?

`react-native-config` exposes `.env` variables to both JavaScript and native iOS (`Info.plist`, Objective-C) and Android (`build.gradle`, Java/Kotlin) code at build time. Plain JS `.env` plugins (like `babel-plugin-inline-dotenv`) only inject variables into the JavaScript bundle. Because all build-time `.env` variables are compiled into client-side code and easily extracted via reverse engineering, private secrets should never be placed in `.env` files; they should be fetched dynamically from a secure authenticated backend at runtime.

```tsx
// React Native Testing Library (RNTL) Unit Test
import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { CounterScreen } from '../CounterScreen';

test('increments counter on button press', () => {
  const { getByText } = render(<CounterScreen />);
  const button = getByText('Increment');
  
  fireEvent.press(button);
  expect(getByText('Count: 1')).toBeTruthy();
});
```

---

#### 112. How do you profile React Native rendering performance using the React DevTools Profiler?

You connect React DevTools to your running React Native debug build, start recording, interact with the app (e.g., open a screen or scroll a list), and stop recording. The Flamegraph and Ranked charts display every component that rendered, the time taken to render each component, and why each component rendered (e.g., "hook 1 changed" or "props changed: [onPress]"). This quickly highlights unnecessary renders and expensive component trees.

---

#### 113. How do you implement a robust Offline-First Image Caching layer with fallback placeholders?

1. Use `react-native-fast-image` or an image wrapper with disk caching enabled
2. pre-fetch critical images using `FastImage.preload([{ uri: imageUrl }])` when data loads
3. provide a low-resolution thumbnail placeholder or local vector asset that displays immediately while the high-res image is loading
4. listen to network status and display an offline fallback icon if an uncached image request fails.

---

#### 114. What are the common causes of Android-specific crashes during React Native build time?

1. Incompatible Java/JDK version (e.g., using JDK 8 or 21 when Gradle requires JDK 17)
2. Gradle dependency version conflicts or mismatched Kotlin Gradle Plugin versions
3. NDK version mismatches when compiling C++ / Hermes libraries
4. AndroidX / Jetifier issues with legacy libraries
5. `minSdkVersion` mismatches where a third-party library requires a higher Android SDK than declared in `app/build.gradle`.

---

#### 115. How do you optimize React Native FlatList for heterogenous item layouts (multiple distinct row types)?

1. Avoid conditional branching inside a single massive component; split each row type into its own dedicated, memoized component
2. use the `getItemType` prop (or `viewType` in `FlashList`) to allow the virtualization engine to recycle and categorize matching view types accurately
3. if row heights vary by type, calculate precise offsets in `getItemLayout` based on item type definitions rather than measuring dynamically.

---

#### 116. How do you implement dynamic feature flags in a React Native app?

You integrate a feature flag service (such as LaunchDarkly, PostHog, or Firebase Remote Config). On app launch, the SDK fetches feature flag configurations and caches them in local storage. A custom hook `useFeatureFlag('new_checkout_flow')` reads the flag value from the cache (or fallback defaults if offline) and conditionally renders the corresponding feature component without requiring an app store update.

---

#### 117. What is the role of the Metro Bundler, and what are its main configuration options in `metro.config.js`?

Metro is the dedicated JavaScript bundler for React Native that resolves asset paths, transforms TypeScript/JSX via Babel, and bundles JavaScript files into a single optimized bundle file for Android and iOS. Key configuration options in `metro.config.js` include: `resolver.sourceExts` (defining file extensions like `['jsx', 'js', 'ts', 'tsx', 'json', 'svg']`), `resolver.assetExts`, `transformer.babelTransformerPath`, and `resolver.extraNodeModules` for symlink/monorepo resolution.

---

#### 118. How do you configure a React Native monorepo with Yarn Workspaces or Turborepo?

1. Define workspace packages in root `package.json` (`"workspaces": ["packages/*", "apps/*"]`)
2. hoist shared dependencies to the root `node_modules`
3. configure `metro.config.js` in the mobile app with `watchFolders` pointing to root and shared workspace packages
4. configure `resolver.nodeModulesPaths` so Metro can locate dependencies in both local and hoisted `node_modules`
5. configure the build pipeline (Turborepo) to build shared C++/TypeScript packages before compiling the React Native app.

---

#### 119. How do you prevent layout shifts and flickering when loading dynamic content in React Native?

1. Use Skeleton loaders that mimic the exact dimensions and layout of the expected content
2. define explicit `aspectRatio` or `width` and `height` on images and media containers before they finish downloading
3. avoid mounting and unmounting nested layouts conditionally; instead, use opacity transitions or preserve container layout bounds while content is loading.

---

#### 120. How do you implement In-App Purchases (IAP) in React Native reliably?

Use `react-native-iap` or RevenueCat (`react-native-purchases`).
1. Initialize the native billing connection on app mount
2. retrieve product details and localized pricing from Apple StoreKit / Google Play Billing
3. when the user initiates a purchase, call `requestPurchase()`
4. listen to the purchase update listener
5. send the purchase receipt to your secure backend for cryptographic server-to-server validation with Apple/Google
6. call `finishTransaction()` to complete the transaction and prevent refund loops.

---

#### 121. What is the difference between `react-native-reanimated` v2 and v3?

Reanimated v2 introduced Worklets, `useSharedValue`, `useAnimatedStyle`, and UI-thread animations using Babel transformations. Reanimated v3 builds upon v2 by introducing:
1. complete Shared Element Transitions without external libraries,
2. automatic Layout Animations (entering, exiting, and layout transitions) with pre-built modifiers (`FadeIn`, `SlideOutRight`, `Layout.springify()`),
3. improved TypeScript APIs, and
4. native C++ integration with the New Architecture and Fabric.

---

#### 122. How do you handle memory cleanup for high-resolution images in React Native?

1. Ensure all images are resized/downsampled on the native side to match the actual display view size rather than decoding full-resolution 4K/12MP raw bitmaps into memory
2. use `react-native-fast-image` which clears memory caches during native low-memory warnings
3. nullify image source references when screens unmount
4. limit the concurrent active image decoding pool in lists.

---

#### 123. What are the best practices for structuring a scalable React Native codebase?

1. Feature-first folder structure (grouping components, hooks, services, and tests by feature module rather than technical layer)
2. clean separation of concerns (UI components strictly presentational, business logic in custom hooks, server state in queries, global client state in Zustand/RTK)
3. shared design system with strictly typed design tokens
4. absolute imports with path aliases (`tsconfig.json`)
5. strict ESLint, Prettier, and TypeScript checks in CI.

---

#### 124. How do you implement an optimistic UI update in React Native with TanStack Query or RTK Query?

When a user performs an action (e.g., liking a post), the mutation's `onMutate` handler runs immediately before the network request is sent:
1. cancel outgoing refetches for that query key
2. snapshot the previous cache state
3. optimistically update the cache with the expected new data, updating the UI instantly
4. if the network request fails, `onError` rolls back the cache to the saved snapshot
5. `onSettled` invalidates the query to sync with server truth.

---

#### 125. What is the purpose of the `InteractionManager` and how does it prevent frame drops?

`InteractionManager` coordinates long-running JavaScript work with active UI interactions and animations. By registering animation handles via `InteractionManager.createInteractionHandle()`, React Native knows an animation is active. Tasks wrapped in `InteractionManager.runAfterInteractions(() => { ... })` are queued and executed only after all active handles are cleared and navigation transitions complete, preventing CPU contention and dropped frames.

---

#### 126. How do you implement a custom Native Splash Screen that transitions smoothly into React Native without flickering?

Use `react-native-bootsplash` or Android 12 `SplashScreen` API. On Android, configure a native `styles.xml` splash theme with a `windowBackground` drawable that displays immediately while the OS boots the process. In React Native, keep the native splash screen visible over the React root view until all initial data, fonts, and authentication states have loaded, then call `RNBootSplash.hide({ fade: true })` to smoothly crossfade into the interactive app.

---

#### 127. What are the common performance pitfalls of using React Native SVG icons, and what are the alternatives?

Rendering hundreds of individual `<Svg>` components (e.g., in list items) creates hundreds of native view nodes, consuming significant memory and slowing down layout passes. Alternatives include:
1. using custom icon fonts via `react-native-vector-icons` (which render as simple, lightweight native `<Text>` glyphs),
2. using single combined SVG sprites, or
3. rendering vector paths via React Native Skia.

---

#### 128. How do you handle Bluetooth Low Energy (BLE) communication in React Native?

Use `react-native-ble-plx` or `react-native-ble-manager`.
1. Check and request runtime location and bluetooth permissions (`BLUETOOTH_SCAN`, `BLUETOOTH_CONNECT`)
2. initialize the BLE manager and scan for peripheral UUIDs
3. establish a GATT connection to the peripheral
4. discover services and characteristics
5. read, write, or subscribe to characteristic notifications
6. handle connection drops and automatic reconnections in background states.

---

#### 129. How do you manage WebSocket connections across app foreground and background states in React Native?

When the app enters the background (`AppState === 'background'`), the OS will eventually suspend network sockets, causing silent disconnections. Best practices:
1. cleanly close or pause the WebSocket when entering the background
2. when `AppState` returns to `active`, verify socket health and initiate an exponential-backoff reconnection
3. implement heartbeat ping/pong messages to detect broken connections
4. queue outgoing messages during disconnected states in an offline buffer.

---

#### 130. Scenario: A user reports that an interactive chart screen becomes completely unresponsive after 2 minutes of continuous live stock ticker updates. How do you diagnose and fix this?

1. **Diagnose**: Inspect the WebSocket message handler and chart component using React Profiler and memory profilers
2. **Culprit**: High-frequency WebSocket ticks (e.g., 20 messages/second) triggering `setState` and full chart SVG recalculations on every tick, overwhelming the JS event loop and creating massive garbage collection pauses
3. **Fix**: Throttle or buffer incoming data ticks using `rxjs` or a 250ms batching interval; update chart values using Reanimated Shared Values or React Native Skia running on the GPU/UI thread directly, completely bypassing React component re-rendering.

---

# 🤖 Android for React Native Developers (50 Questions)

---


### 1. Android Manifest, Application Lifecycle & Intents

#### 131. What is the standard directory structure of the `android` folder in a React Native project?

The `android` directory follows standard Android Gradle conventions: `android/app/` contains application-specific code and configuration (`src/main/java` or `kotlin` for native code, `src/main/res/` for native drawables, strings, and layouts, `src/main/AndroidManifest.xml`, and `app/build.gradle`); `android/build.gradle` is the top-level project build configuration; `android/settings.gradle` defines subprojects and auto-linked native modules; and `android/gradle/wrapper/` contains the Gradle wrapper executable and configuration.

---

#### 132. What is the role of `AndroidManifest.xml`, and what are its key tags?

`AndroidManifest.xml` is the root configuration file that describes essential information about the Android application to the Android OS and Google Play. Key tags include: `<manifest>` (defines package name and permissions), `<uses-permission>` (declares hardware/system permissions like Camera or Internet), `<application>` (configures app-level attributes, custom `MainApplication` class, icons, and themes), `<activity>` (declares app screens, specifically `MainActivity`), `<service>` (declares background services), and `<intent-filter>` (declares deep link handlers and the launcher entry point).

```xml
<!-- AndroidManifest.xml Key Declarations -->
<manifest xmlns:android="http://schemas.android.com/apk/res/android"
    package="com.myapp">

    <uses-permission android:name="android.permission.INTERNET" />
    <uses-permission android:name="android.permission.POST_NOTIFICATIONS" />

    <application
        android:name=".MainApplication"
        android:label="@string/app_name"
        android:allowBackup="false">
        
        <activity
            android:name=".MainActivity"
            android:launchMode="singleTask"
            android:windowSoftInputMode="adjustResize"
            android:exported="true">
            <intent-filter>
                <action android:name="android.intent.action.MAIN" />
                <category android:name="android.intent.category.LAUNCHER" />
            </intent-filter>
        </activity>
    </application>
</manifest>
```

---

#### 133. What is the difference between `MainApplication.kt` and `MainActivity.kt` in a React Native Android project?

`MainApplication.kt` initializes the application-level context and the React Native runtime (configuring Hermes, TurboModules, Fabric, and auto-linked packages) once when the app process is created. `MainActivity.kt` is the principal `Activity` (screen) that hosts the React Native root view (`ReactRootView`); it handles native window lifecycle events, hardware back button presses, runtime permissions callbacks, and activity pause/resume states.

---

#### 134. Why is `launchMode="singleTask"` typically configured for `MainActivity` in `AndroidManifest.xml`?

`launchMode="singleTask"` ensures that only a single instance of `MainActivity` exists in the task stack at any time. If the app is already open and a user taps a deep link, app icon, or push notification, the Android OS routes the intent to the existing `MainActivity` instance via `onNewIntent()` rather than creating a duplicate activity instance and reinitializing the entire React Native JavaScript bundle from scratch.

---

#### 135. What is the difference between `windowSoftInputMode="adjustResize"` and `"adjustPan"` in Android?

`adjustResize` resizes the entire Android window when the soft keyboard appears, shrinking available screen space so React Native layout containers (and `KeyboardAvoidingView`) can recalculate dimensions and adjust views accordingly. `adjustPan` keeps the window dimensions unchanged and simply shifts the entire display upward so the currently focused input view remains visible, which often causes fixed headers and background elements to scroll out of view.

---

#### 136. How do runtime permissions work in Android 13+ (API 33+), and how do you request `POST_NOTIFICATIONS`?

Starting in Android 13, runtime permissions must be explicitly requested at runtime before accessing sensitive features, including push notifications (`android.permission.POST_NOTIFICATIONS`) and granular media access (`READ_MEDIA_IMAGES`). In React Native, you declare the permission in `AndroidManifest.xml` and call `PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS)` in JavaScript; the OS displays a system dialog, and the user's decision (`granted`, `denied`, or `never_ask_again`) is returned as a promise.

---

#### 137. What is the Android 12+ (API 31+) SplashScreen API, and how does it affect React Native apps?

Android 12 introduced a system-standard `SplashScreen` API that automatically displays an app icon window animation during cold and warm app startups. In React Native, if a custom splash screen library (like legacy `react-native-splash-screen`) is not updated to support this API, users experience an awkward double splash screen (the system splash followed by the custom splash). To prevent this, developers integrate `react-native-bootsplash` or `androidx.core.splashscreen.SplashScreen` to seamlessly merge the native launch animation with the JS UI.

---

#### 138. What is the difference between the root `android/build.gradle` and `android/app/build.gradle` files?

The root `android/build.gradle` configures build repositories (Maven Central, Google), global build dependencies (Android Gradle Plugin version, Kotlin Gradle Plugin version), and global buildscript configurations shared across all subprojects. The `android/app/build.gradle` configures specific application build parameters, such as `compileSdkVersion`, `defaultConfig` (`applicationId`, `minSdkVersion`, `targetSdkVersion`, `versionCode`), signing configurations, build types (Debug/Release), product flavors, and direct library dependencies.

```groovy
// android/app/build.gradle
android {
    compileSdkVersion 34
    
    defaultConfig {
        applicationId "com.myapp"
        minSdkVersion 24
        targetSdkVersion 34
        versionCode 100
        versionName "1.0.0"
    }

    signingConfigs {
        release {
            storeFile file('my-release-key.keystore')
            storePassword System.getenv("KEYSTORE_PASSWORD")
            keyAlias System.getenv("KEY_ALIAS")
            keyPassword System.getenv("KEY_PASSWORD")
        }
    }
}
```

---

#### 139. What do `compileSdkVersion`, `minSdkVersion`, and `targetSdkVersion` signify?

`minSdkVersion` is the lowest Android OS API level capable of installing and running the app (e.g., API 24 = Android 7.0). `compileSdkVersion` is the Android SDK version used to compile the native Java/Kotlin code and against which APIs are validated during compilation. `targetSdkVersion` specifies the Android API level that the app was tested against and informs the OS to enable forward-compatible security and behavioral changes (e.g., API 34 = Android 14) without breaking legacy behavior.

---

#### 140. What is the Gradle Wrapper (`gradlew`), and why is it essential in React Native development?

The Gradle Wrapper (`gradlew` for Unix, `gradlew.bat` for Windows) is a batch/shell script committed to the repository that automatically downloads and executes the exact declared version of Gradle specified in `gradle-wrapper.properties`. This ensures that every developer on the team and all automated CI/CD build environments build the Android app using the identical Gradle runtime version without needing manual local Gradle installations.

---

#### 141. What are Android Build Variants and Product Flavors, and how are they used in React Native?

Build Variants are the combination of Product Flavors (custom app configurations like `dev`, `staging`, `prod`) and Build Types (`debug`, `release`). Defined in `app/build.gradle`, Product Flavors allow developers to generate distinct app binaries from the same codebase with unique application IDs (`com.myapp.dev` vs `com.myapp`), different native app names, distinct app icons, and environment-specific API endpoints.

---

#### 142. How do you resolve Android dependency version conflicts in Gradle?

Dependency version conflicts occur when different React Native native libraries pull in incompatible versions of the same transitive dependency (e.g., different versions of `play-services` or Kotlin libraries). You resolve them in `app/build.gradle` using Gradle's `resolutionStrategy`: `configurations.all { resolutionStrategy { force "org.jetbrains.kotlin:kotlin-stdlib:$kotlin_version" } }` or by declaring a Gradle Bill of Materials (BOM) to enforce consistent versioning across dependencies.

---

#### 143. What was the Jetifier tool, and what is the status of AndroidX in modern React Native?

AndroidX is the modern, redesigned Android support library. Jetifier was a migration tool (`jetifier` / `npx jetify`) that inspected legacy npm packages and translated legacy Android Support Library imports (`android.support.*`) into modern AndroidX (`androidx.*`) packages at build time. In modern React Native (0.68+), all maintained libraries natively support AndroidX, rendering Jetifier largely obsolete, though it remains available as a fallback for unmaintained legacy modules.

---

#### 144. How does R8 / ProGuard code shrinking and obfuscation work in React Native Android builds?

R8 is the default code shrinker and optimizer in Android. When `enableProguardInReleaseBuilds = true` is configured in `app/build.gradle`, R8 performs three optimizations:
1. **Tree Shaking / Shrinking**: identifies and removes unused Java/Kotlin classes, methods, and attributes
2. **Optimization**: inlines code and simplifies method invocations
3. **Obfuscation**: renames remaining classes and methods to short, meaningless identifiers (e.g., `a.b.c`), reducing APK size and making reverse engineering difficult.

```groovy
// android/app/build.gradle
def enableProguardInReleaseBuilds = true

android {
    buildTypes {
        release {
            minifyEnabled enableProguardInReleaseBuilds
            shrinkResources true
            proguardFiles getDefaultProguardFile("proguard-android.txt"), "proguard-rules.pro"
        }
    }
}
```

---

#### 145. Why do React Native release builds crash if ProGuard rules (`proguard-rules.pro`) are missing for native modules?

React Native relies heavily on reflection and Java Native Interface (JNI) calls to invoke methods between C++, Java/Kotlin, and JavaScript. Because R8/ProGuard cannot detect reflection or JNI references statically at build time, it may mistakenly rename or strip classes, methods, or constructors needed by JNI (such as `@DoNotStrip` annotations or TurboModule specs). When the app runs in release mode, JNI lookups fail, triggering fatal `ClassNotFoundException` or `NoSuchMethodError` crashes.

```proguard
# android/app/proguard-rules.pro
-keep class com.facebook.react.** { *; }
-keep class com.facebook.jni.** { *; }
-keepattributes *Annotation*
-dontwarn com.facebook.react.**
```

---


### 2. Gradle Build System, ProGuard/R8 & Dependencies

#### 146. How do you generate an Android Keystore and configure `signingConfigs` in `app/build.gradle`?

You generate a cryptographically secure keystore using the Java `keytool` command (`keytool -genkey -v -keystore my-release-key.keystore -alias my-key-alias -keyalg RSA -keysize 2048 -validity 10000`). In `app/build.gradle`, you define a `signingConfigs { release { storeFile file('my-release-key.keystore'); storePassword System.getenv("KEYSTORE_PASSWORD"); keyAlias System.getenv("KEY_ALIAS"); keyPassword System.getenv("KEY_PASSWORD") } }` and bind it to `buildTypes { release { signingConfig signingConfigs.release } }`.

---

#### 147. What is the difference between an APK and an Android App Bundle (AAB)?

An APK (Android Package) is a complete, self-contained binary containing all compiled DEX bytecode, assets, and native C++ `.so` libraries for all device CPU architectures (`arm64-v8a`, `armeabi-v7a`, `x86_64`) and all screen densities. An AAB (Android App Bundle) is an upload format published to Google Play; Google Play's Dynamic Delivery system processes the AAB to generate and serve optimized, device-tailored APKs containing only the specific CPU architecture, screen density, and language resources required for the user's specific device, reducing download size by up to 50%.

---

#### 148. What are ABI Splits in React Native Android builds?

ABI (Application Binary Interface) splits allow Gradle to generate separate, individual APKs for each target CPU architecture (`arm64-v8a`, `armeabi-v7a`, `x86`, `x86_64`) instead of a single massive universal APK. Configured in `app/build.gradle` via `splits { abi { enable true; reset(); include "armeabi-v7a", "arm64-v8a"; universalApk false } }`, ABI splits significantly reduce standalone APK distribution sizes for direct sideloading or alternative app stores.

---

#### 149. What is Google Play App Signing, and how does the Upload Key differ from the App Signing Key?

With Google Play App Signing, the developer signs the AAB with an "Upload Key" before uploading to the Play Console. Google verifies the upload key, strips it, and re-signs the final delivered APKs using the master "App Signing Key," which is stored securely in Google's cloud infrastructure. This ensures that if a developer loses their local upload key, Google can reset the upload key without preventing the developer from updating their existing app.

---

#### 150. What is an ANR (Application Not Responding) in Android, and what causes it in React Native apps?

An ANR occurs when an Android application's main (UI) thread is blocked and unable to process user input events or system broadcast intents for more than 5 seconds. In React Native, ANRs are typically caused by:
1. native modules executing long-running, synchronous tasks (e.g., file I/O, heavy cryptography, database operations) on the main UI thread instead of a background thread
2. deadlocks between the native UI thread and C++/JS threads during layout calculation; or
3. synchronous layout measurement loops in custom view managers.

---

#### 151. How does Android's Activity Lifecycle map to React Native application execution?

Android Activities move through `onCreate()`, `onStart()`, `onResume()`, `onPause()`, `onStop()`, and `onDestroy()`. In React Native: `onCreate()` initializes the `ReactRootView` and starts the JS runtime; `onResume()` connects hardware listeners and sets React Native `AppState` to `active`; `onPause()` / `onStop()` detaches UI rendering, sets `AppState` to `background`, and pauses timers; `onDestroy()` terminates the JS engine and releases native memory unless persistent background services are running.

---

#### 152. What is Headless JS in React Native Android, and when is it used?

Headless JS is an Android-specific mechanism that allows React Native to execute JavaScript tasks in the background without launching an Activity (UI screen). It is used for handling background events like incoming data push notifications, periodic data synchronization via WorkManager, geofencing triggers, or sensor updates. A Java `HeadlessJsTaskService` spins up the React Native JS runtime in the background, executes a registered JS task function, and shuts down upon completion.

---

#### 153. What are Android Foreground Services, and why are they mandatory for persistent background tasks in modern Android?

Android strictly throttles and kills background execution when an app is not in the foreground to preserve battery life. A Foreground Service is a native Android service that performs operations noticeable to the user and MUST display an ongoing, non-dismissible system notification (e.g., ongoing audio playback, live GPS navigation, active step tracking). Modern Android (API 26+) requires any continuous background execution exceeding a few minutes to be declared and run as a Foreground Service.

---

#### 154. How do Android Notification Channels work, and why are they required?

Starting in Android 8.0 (API 26), all local and push notifications must be assigned to a user-configurable Notification Channel (e.g., "Order Updates", "Promotional Alerts"). Each channel specifies its own visual and auditory behavior (importance level, vibration pattern, sound, LED light). If a React Native app posts a notification without a valid `channelId` on Android 8+, the system silently drops the notification.

---

#### 155. What is the Android WorkManager, and how is it utilized in React Native?

`WorkManager` is Android's recommended background processing library for deferrable, guaranteed background work that must execute even if the app process exits or the device restarts. It respects system health constraints (e.g., waiting until the device is connected to Wi-Fi, charging, or idle). React Native libraries use `WorkManager` for background database syncing, image uploading queues, and periodic telemetry reporting.

---

#### 156. How do Android BroadcastReceivers interact with React Native?

A `BroadcastReceiver` is an Android component that listens for system-wide broadcast announcements (e.g., `BOOT_COMPLETED`, network connectivity changes, battery low) or custom application broadcasts. When an intent is received, the native receiver can start a React Native Headless JS task or dispatch an event across the bridge/JSI to the JavaScript layer via `DeviceEventManagerModule.RCTDeviceEventEmitter` if the app process is alive.

---

#### 157. How do Android Doze Mode and App Standby affect React Native background execution?

Introduced to optimize battery consumption, Doze Mode suspends network access, defers background jobs, and stops wake locks when an unplugged device is stationary with the screen off for a period of time. Standard network requests and timers in React Native will freeze during Doze mode. To wake the app for critical tasks, developers must use high-priority Firebase Cloud Messages (FCM) or request battery optimization exemption via `ACTION_REQUEST_IGNORE_BATTERY_OPTIMIZATIONS`.

---

#### 158. How do you inspect and filter React Native logs using Android `adb logcat`?

You execute `adb logcat` in the terminal to view Android system logs in real time. To filter React Native logs:
1. `adb logcat *:S ReactNative:V ReactNativeJS:V` displays only native React Native logs and JavaScript `console.log` statements
2. `adb logcat -s AndroidRuntime` displays fatal native Java/Kotlin crash stack traces
3. `adb logcat | grep -i "ReactNative"` performs a general text search across all log tags.

---

#### 159. What is a Native Crash (Tombstone) on Android, and how do you symbolicate `libhermes.so` or `libfbjni.so` crashes?

A native crash occurs in C++ code, producing an OS crash dump known as a "Tombstone" containing raw memory registers, signal codes (`SIGSEGV`, `SIGABRT`), and un-symbolicated memory addresses. To symbolicate it, you use the Android NDK `ndk-stack` tool: `adb logcat | ndk-stack -sym /path/to/unstripped/native/libs/` or supply the unstripped `.so` symbol files (generated in `app/build/intermediates/merged_native_libs/`) to Google Play Console / Sentry to resolve memory offsets to exact C++ source lines.

---

#### 160. What is Multi-Dex support in Android, and why was it required?

Android APK executables store compiled bytecode in Dalvik Executable (DEX) files. A single DEX file has a hard limit of 65,536 total method references. When large React Native apps and dependencies exceeded this limit, builds failed with `Cannot fit requested classes in a single dex file`. Enabling `multiDexEnabled = true` allowed Gradle to generate multiple DEX files. For apps with `minSdkVersion >= 21`, Multi-Dex is enabled by default natively and requires no manual configuration.

---


### 3. Native Services, Background Tasks & Permissions

#### 161. What are the requirements for 64-bit architecture support on the Google Play Store?

Google Play mandates that all apps containing native C++ code (`.so` files) must provide 64-bit versions alongside any 32-bit versions. For React Native, this requires that `app/build.gradle` includes `arm64-v8a` and `x86_64` in `ndk.abiFilters`. If any third-party native library lacks 64-bit binaries, Google Play will reject the release bundle upload.

---

#### 162. How does Android's 16 KB page size support in Android 15 impact React Native apps?

Historically, Android used 4 KB memory page sizes. Android 15 introduces support for 16 KB memory pages to improve CPU performance. Any React Native app containing native C++ shared libraries (`.so`) compiled with 4 KB alignment will fail to load and crash on 16 KB devices. React Native 0.75+ and modern NDKs (r27+) recompile all core C++ libraries with 16 KB page alignment to ensure full Android 15 compatibility.

---

#### 163. How do you configure Deep Links and Android App Links in `AndroidManifest.xml`?

You add an `<intent-filter>` inside the `<activity>` tag for `MainActivity`: `<action android:name="android.intent.action.VIEW" />`, `<category android:name="android.intent.category.DEFAULT" />`, `<category android:name="android.intent.category.BROWSABLE" />`, and specify `<data android:scheme="https" android:host="myapp.com" android:pathPrefix="/user" />`. To enable verified Android App Links (opening the app without a browser prompt), you add `android:autoVerify="true"` to the `<intent-filter>` and host a verified `assetlinks.json` file at `https://myapp.com/.well-known/assetlinks.json`.

---

#### 164. What is `assetlinks.json`, and how does Android verify domain ownership for App Links?

`assetlinks.json` is a JSON file hosted on the website domain at `/.well-known/assetlinks.json` that contains the app's `package_name` and the SHA-256 fingerprint of the app's signing certificate. When the app is installed, the Android OS queries this URL, compares the SHA-256 fingerprint with the installed APK's certificate, and if they match, grants automatic domain ownership, routing all matching HTTPS URLs directly to the app without opening the web browser.

---

#### 165. What is the Android Predictive Back Gesture (Android 14+), and how do you enable it in React Native?

Predictive Back allows users to preview the destination screen or home launcher during a swipe-to-back gesture before completing the swipe. In React Native, developers enable it by setting `android:enableOnBackInvokedCallback="true"` in `AndroidManifest.xml` under `<application>` and using `react-native-screens` (v3.21+), which hooks into Android's `OnBackInvokedDispatcher` to smoothly animate the React Native view during predictive gestures.

---

#### 166. Scenario: The Android build fails with `Duplicate class found in modules` or `Manifest merger failed`. What is your troubleshooting process?

1. **For `Duplicate class`**: Run `./gradlew :app:dependencies` to identify which two third-party dependencies are pulling conflicting versions of the same library (e.g., `kotlin-stdlib` or `androidx.core`); resolve by adding an `exclude group: '...', module: '...'` or forcing the version in `configurations.all { resolutionStrategy.force '...' }`
2. **For `Manifest merger failed`**: Inspect the merged manifest report at `app/build/outputs/logs/manifest-merger-release-report.txt` to find conflicting XML attributes (e.g., conflicting `android:allowBackup` or `android:theme`), and resolve by adding `tools:replace="android:allowBackup"` in `AndroidManifest.xml`.

---

#### 167. Scenario: The Android app runs perfectly in Debug mode but crashes immediately upon launch in Release mode. What are the common causes and diagnostic steps?

1. Run `adb logcat *:S AndroidRuntime:E ReactNative:V` to capture the fatal crash stack trace
2. **Common Causes**: (a) ProGuard/R8 stripped reflection/JNI classes or native module specs (fix: add `-keep` rules in `proguard-rules.pro`); (b) Hermes bytecode compilation failed on an unhandled JS syntax error; (c) Missing release signing configuration or invalid release keystore credentials; (d) Unhandled `null` environment variables in release JS bundle; (e) Missing runtime permissions required by native release SDKs.

---

#### 168. Scenario: Background location tracking ceases after 10–15 minutes when the screen is locked on Samsung or Xiaomi devices. Why does this happen and how do you fix it?

1. **Cause**: Aggressive OEM-specific battery optimization software (e.g., Samsung OneUI, Xiaomi MIUI) kills background services and network access when the device is locked, ignoring standard Android background rules
2. **Fix**: (a) Run location tracking inside an explicit native Foreground Service with a persistent status bar notification; (b) acquire a partial wake lock (`PowerManager.PARTIAL_WAKE_LOCK`); (c) prompt the user with system settings intents to disable OEM battery optimizations (`dontkillmyapp.com` guidelines); (d) use Google FusedLocationProvider with appropriate batching intervals.

---

#### 169. How do you implement Secure Key Storage on Android using the Android Keystore system?

The Android Keystore system lets developers generate and store cryptographic keys in dedicated hardware security modules (TEE / StrongBox) where keys never enter application memory and cannot be extracted even if the device is rooted. Libraries like `react-native-keychain` use the Keystore to generate AES/RSA keys, encrypt sensitive user data (tokens, credentials), and store the resulting ciphertext in `EncryptedSharedPreferences`.

---

#### 170. What are the Google Play Data Safety Form requirements for React Native developers?

Google Play mandates that developers declare all data collected, processed, and shared by the application AND any integrated third-party SDKs (e.g., Firebase Analytics, Sentry, AdMob, Facebook SDK). This includes personal information, precise location, financial data, device identifiers, and crash logs, along with whether data is encrypted in transit, optional or mandatory, and whether users can request data deletion.

---


### 4. Native Modules, Security & Google Play Policies

#### 171. What is the difference between `java` and `kotlin` integration in React Native native modules?

React Native supports both languages seamlessly. Java was the historical standard, requiring verbose boilerplate for JNI bindings and null-safety checks. Kotlin is modern, concise, and fully interoperable with Java; it offers built-in null safety, coroutines for asynchronous tasks, and modern extension functions. In modern React Native (0.73+), project templates default to Kotlin for `MainActivity` and `MainApplication`.

---

#### 172. How do you implement multi-language resources in Android for native strings?

In `android/app/src/main/res/`, you create localized resource directories: `values/strings.xml` for default language (e.g., English), `values-es/strings.xml` for Spanish, `values-fr/strings.xml` for French. The Android OS automatically selects the appropriate `strings.xml` file based on the device's active locale when rendering native UI dialogs, permission alerts, and app launcher names.

---

#### 173. What is the Android `ndkVersion`, and why must it match the React Native requirement?

The NDK (Native Development Kit) is the toolset used to compile C++ code (including Hermes, React Native core, Yoga, and TurboModules) into native machine code. `ndkVersion` specified in `app/build.gradle` must match the specific NDK version validated for that React Native release (e.g., NDK 26.1.10909125 for RN 0.73+). Mismatched NDK versions cause C++ compilation errors, missing standard library symbols, and unexpected runtime crashes.

---

#### 174. How does the Android Vector Asset Studio optimize icons for React Native Android builds?

Vector Asset Studio in Android Studio converts SVG files into Android `VectorDrawable` XML files. Unlike raster PNGs, which require multiple density assets (`mdpi`, `hdpi`, `xhdpi`, `xxhdpi`, `xxxhdpi`), a single `VectorDrawable` scales losslessly to all screen densities without pixelation, reducing APK size and memory footprint for native icons, splash graphics, and drawables.

---

#### 175. What is the role of `settings.gradle` in React Native Android autolinking?

`settings.gradle` includes all Gradle subprojects in the build. In React Native, it executes the `@react-native-community/cli` autolinking script (`apply from: file("../node_modules/@react-native-community/cli-platform-android/native_modules.gradle"); applyNativeModulesSettingsGradle(settings)`). This script scans `package.json` and `node_modules` at build time and automatically registers all installed native React Native module subprojects into the Gradle build without manual editing.

---

#### 176. What is the `shrinkResources` flag in `app/build.gradle`, and how does it work with R8?

`shrinkResources true` is configured alongside `minifyEnabled true` in the release build type. While R8 strips unused Java/Kotlin code, resource shrinking analyzes the remaining code to find unused drawables, layouts, and XML resources in `res/` and strips them from the packaged APK/AAB, replacing them with empty dummy entries to minimize final binary size.

---

#### 177. How do you troubleshoot Out Of Memory (OOM) heap issues during Gradle builds in CI environments?

Gradle build OOM errors (`java.lang.OutOfMemoryError: Java heap space` or `Metaspace`) occur when CI runners have insufficient memory allocated to the JVM. To fix:
1. **increase Gradle JVM memory in `android/gradle.properties`**: `org.gradle.jvmargs=-Xmx4096m -XX:MaxMetaspaceSize=1024m -XX:+HeapDumpOnOutOfMemoryError`
2. disable the Gradle daemon in CI (`--no-daemon`)
3. limit parallel workers with `--max-workers=2`.

---

#### 178. What is the purpose of `android:exported` in `AndroidManifest.xml` components?

Starting in Android 12 (API 31), every `<activity>`, `<service>`, and `<receiver>` tag that contains an `<intent-filter>` must explicitly declare `android:exported="true"` or `android:exported="false"`. Setting `android:exported="true"` makes the component accessible to external apps and the OS (mandatory for `MainActivity` launcher and deep link handlers); setting it to `false` secures private internal components from unauthorized external invocation.

---

#### 179. How do you test Android deep links locally via the command line?

You trigger deep links on a connected emulator or device using the Android Debug Bridge (`adb`): `adb shell am start -W -a android.intent.action.VIEW -d "myapp://user/profile/123" com.myapp` or for App Links: `adb shell am start -W -a android.intent.action.VIEW -d "https://myapp.com/user/profile/123" com.myapp`. The `-W` flag waits for the launch to complete and outputs detailed resolution logs.

```bash
# Test Android Deep Link via ADB
adb shell am start -W -a android.intent.action.VIEW -d "myapp://product/123" com.myapp
```

---

#### 180. Scenario: Google Play rejects an app update citing "Violation of Permissions Policy regarding Background Location or Foreground Service". How do you resolve this?

1. Identify whether background location or foreground service is strictly necessary for the core app functionality
2. if not required, remove `ACCESS_BACKGROUND_LOCATION` and use foreground location (`ACCESS_FINE_LOCATION`) only while the app is in active use
3. if required, update the Google Play Console declaration form: provide a detailed explanation, submit a clear in-app video demonstration showing why the feature requires background access, ensure prominent in-app disclosure dialogs are shown before requesting the permission, and declare specific foreground service types (e.g., `android:foregroundServiceType="location"`) in `AndroidManifest.xml`.

---

# 🍎 iOS for React Native Developers (50 Questions)

---


### 1. iOS Architecture, CocoaPods & Workspace Setup

#### 181. What is the standard directory structure of the `ios` folder in a React Native project?

The `ios` folder contains: `ProjectName.xcworkspace` (the Xcode workspace containing the app project and Pods project), `ProjectName.xcodeproj` (the core Xcode project file), `Podfile` and `Podfile.lock` (CocoaPods dependency declarations and locked versions), `ProjectName/` (contains `AppDelegate.mm`/`.swift`, `Info.plist`, `Images.xcassets`, `LaunchScreen.storyboard`, and bridging headers), and `Pods/` (downloaded native CocoaPods dependencies).

---

#### 182. Why MUST developers open `ProjectName.xcworkspace` instead of `ProjectName.xcodeproj` in Xcode?

React Native relies on CocoaPods to manage native dependencies, libraries, and C++ frameworks. CocoaPods creates an Xcode Workspace (`.xcworkspace`) that groups the primary application project (`.xcodeproj`) and the `Pods.xcodeproj` dependency project together, linking header search paths and compiled static libraries/frameworks. Opening `.xcodeproj` directly bypasses the Pods project, causing immediate `Header not found` and `Undefined symbols` compilation failures.

---

#### 183. What is CocoaPods, and how do `Podfile` and `Podfile.lock` function in React Native?

CocoaPods is the standard dependency manager for Swift and Objective-C iOS projects. The `Podfile` defines target iOS platforms, auto-linking scripts, build configurations, and third-party native libraries (Pods). `Podfile.lock` records the exact resolved cryptographic versions of all installed pods and transitive dependencies, ensuring that all developers and CI pipelines build against the identical native dependency tree.

```ruby
# ios/Podfile
platform :ios, '15.1'
prepare_react_native_project!

target 'MyApp' do
  use_react_native!(
    :path => config[:reactNativePath],
    :hermes_enabled => true,
    :fabric_enabled => true
  )
  use_frameworks! :linkage => :static
end
```

---

#### 184. What is the difference between `use_frameworks!` and static libraries in a CocoaPods `Podfile`?

By default, CocoaPods links dependencies as static libraries (`.a` files). Adding `use_frameworks!` instructs CocoaPods to compile dependencies as dynamic frameworks (`.framework` bundles), which was historically required for Swift dependencies. In modern React Native with C++ and TurboModules, static linkage is preferred (`use_frameworks! :linkage => :static`), enabling Swift compatibility while avoiding dynamic linking startup latency and complex C++ header visibility issues.

---

#### 185. What is `Info.plist`, and what are its critical keys in a React Native app?

`Info.plist` (Information Property List) is a structured XML file that provides essential configuration metadata to iOS. Critical keys include: `CFBundleIdentifier` (unique App Bundle ID), `CFBundleShortVersionString` (marketing version), `CFBundleVersion` (build number), `UIBackgroundModes` (declares background audio, fetch, or push capabilities), `NSAppTransportSecurity` (network security policies), and privacy usage descriptions (e.g., `NSCameraUsageDescription`, `NSLocationWhenInUseUsageDescription`).

```xml
<!-- ios/MyApp/Info.plist -->
<plist version="1.0">
<dict>
    <key>CFBundleIdentifier</key>
    <string>$(PRODUCT_BUNDLE_IDENTIFIER)</string>
    <key>CFBundleShortVersionString</key>
    <string>1.0.0</string>
    <key>CFBundleVersion</key>
    <string>1</string>
    <key>NSCameraUsageDescription</key>
    <string>We need camera access to scan QR codes.</string>
</dict>
</plist>
```

---

#### 186. What is the role of `AppDelegate.mm` (or `AppDelegate.swift`) in a React Native iOS application?

`AppDelegate` is the root entry point for the iOS application lifecycle. It implements the `UIApplicationDelegate` protocol. In React Native, its primary responsibilities are:
1. initializing the `RCTBridge` or `RCTHost` (in New Architecture),
2. creating the `RCTRootView` (or `RCTFabricSurfaceHostingProxyRootView`) and setting it as the root view of the `UIWindow`,
3. handling push notification registration and incoming APNs tokens, and
4. intercepting Universal Links and Custom URL schemes for deep linking.

---

#### 187. How do iOS Application Lifecycle methods map to React Native execution?

`didFinishLaunchingWithOptions`: initializes the React Native bridge and mounts the UI; `applicationDidEnterBackground`: pauses rendering, sets React Native `AppState` to `background`, and suspends timers; `applicationWillEnterForeground`: sets `AppState` to `active` and resumes animations/sync; `applicationWillTerminate`: terminates the app, destroys the JS runtime, and closes active sockets.

---

#### 188. What is App Transport Security (ATS), and how do you configure it in `Info.plist`?

App Transport Security (ATS) is an iOS security feature that forces apps to connect only over secure HTTPS with strong TLS ciphers, blocking all unencrypted HTTP traffic. In development, Metro bundler requires HTTP (`http://localhost:8081`). This is configured in `Info.plist` under `NSAppTransportSecurity` by adding `NSExceptionDomains` for `localhost` with `NSExceptionAllowsInsecureHTTPLoads = true`. In production, ATS exceptions should be removed unless connecting to legacy enterprise servers.

---

#### 189. What are iOS Provisioning Profiles, and what do they contain?

A Provisioning Profile is a cryptographically signed file from Apple that authorizes an app binary to be installed and run on a physical iOS device. It bundles together:
1. an App ID (matching the app's Bundle Identifier),
2. one or more Development/Distribution Certificates (proving who built the app),
3. a list of authorized device UDIDs (for Development and Ad-Hoc profiles), and
4. explicit Entitlements (authorized capabilities like Push Notifications or Associated Domains).

---

#### 190. What is the difference between Development, Ad Hoc, App Store, and Enterprise Provisioning Profiles?

1. **Development**: allows developers to install and debug builds directly on registered test devices
2. **Ad Hoc**: allows distribution to up to 100 specific registered test devices per product family without using the App Store
3. **App Store**: used to sign release builds uploaded to TestFlight and the Apple App Store for public distribution (does not contain device UDIDs)
4. **Enterprise**: allows large organizations in the Apple Developer Enterprise Program to distribute proprietary in-house apps to employee devices without App Store review.

---

#### 191. What are Apple Signing Certificates (.p12 / CER), and how do Development and Distribution Certificates differ?

Signing Certificates contain a public/private cryptographic keypair used to digitally sign iOS apps. A Development Certificate (`Apple Development`) verifies the identity of an individual developer and allows building/debugging on personal devices. A Distribution Certificate (`Apple Distribution`) verifies the organization and is required for creating release archives for TestFlight, App Store submission, or Ad-Hoc distribution.

---

#### 192. What are Xcode Schemes, Build Configurations, and Targets?

1. **Target**: specifies the product to build (e.g., main iOS App, App Extension, Widget, Watch App) and its source files and build settings
2. **Build Configuration**: defines a set of build flags (e.g., `Debug` with debugging symbols, `Release` with compiler optimizations)
3. **Scheme**: defines a collection of targets, a build configuration, and an environment to execute during Run, Test, Profile, and Archive actions.

---

#### 193. What is an Entitlements file (`.entitlements`), and what does it configure?

An Entitlements file is an XML plist file that declares the specific platform capabilities and security permissions granted to the app by Apple. It configures features such as: Apple Pay (`merchant.com.myapp`), Associated Domains for Universal Links (`applinks:myapp.com`), Push Notifications (`aps-environment`), Keychain Access Groups (for sharing keychain items across apps), and In-App Purchases.

---

#### 194. What is the Apple Privacy Manifest (`PrivacyInfo.xcprivacy`), and why is it mandatory?

Introduced by Apple in 2024, the Privacy Manifest is an XML file (`PrivacyInfo.xcprivacy`) that must be included in all iOS apps and third-party SDKs. It declares:
1. the specific categories of user data collected (e.g., email, analytics, crash data),
2. the specific "Required Reason APIs" used by the app (e.g., File timestamp APIs, System boot time, Disk space, User defaults), and
3. tracking domains. Submissions without valid privacy manifests are rejected by App Store Connect.

---

#### 195. How do Universal Links work on iOS, and how do you configure the `apple-app-site-association` (AASA) file?

Universal Links allow standard HTTPS URLs to seamlessly open the app without launching Safari. Configuration:
1. Add the `Associated Domains` capability in Xcode with `applinks:example.com`
2. host an unencrypted JSON file at `https://example.com/.well-known/apple-app-site-association` containing the app's `appID` (`<TeamID>.<BundleID>`) and path routes (e.g., `{"components": [{"/": "/user/*"}]}`)
3. handle the incoming URL in `AppDelegate` via `continueUserActivity:restorationHandler:`.

```json
// https://example.com/.well-known/apple-app-site-association
{
  "applinks": {
    "apps": [],
    "details": [
      {
        "appID": "TEAMID12345.com.myapp",
        "paths": ["/product/*", "/profile/*"]
      }
    ]
  }
}
```

---


### 2. Code Signing, Certificates & Provisioning Profiles

#### 196. How do you export a Native Module from Objective-C / Swift to React Native?

In Objective-C, import `<React/RCTBridgeModule.h>`, add `RCT_EXPORT_MODULE(MyModule)`, and export methods using `RCT_EXPORT_METHOD(myMethod:(NSString *)param resolve:(RCTPromiseResolveBlock)resolve reject:(RCTPromiseRejectBlock)reject)`. In Swift, mark the class with `@objc(MyModule)` subclassing `NSObject`, mark methods with `@objc`, and create an auxiliary Objective-C file (`MyModule.m`) using `RCT_EXTERN_MODULE` and `RCT_EXTERN_METHOD` to register the Swift class with the React Native bridge.

---

#### 197. What is the purpose of `dispatch_async(dispatch_get_main_queue(), ...)` in iOS Native Modules?

In iOS, all UIKit UI components (such as `UIView`, `UIViewController`, `UIAlertController`, and window animations) MUST be manipulated exclusively on the platform Main Thread. Because React Native Native Modules execute on background queues by default, any native code that creates, modifies, or presents UI elements must dispatch its execution block to the main queue via `dispatch_async(dispatch_get_main_queue(), ^{ /* UI code */ });` to prevent crashes and UI corruption.

---

#### 198. How do you implement Secure Storage on iOS using the iOS Keychain?

The iOS Keychain provides encrypted, hardware-backed storage (Secure Enclave) for sensitive items like passwords, authentication tokens, and private keys. In React Native, libraries like `react-native-keychain` call the `SecItemAdd`, `SecItemUpdate`, and `SecItemCopyMatching` C APIs, specifying accessibility policies like `kSecAttrAccessibleAfterFirstUnlockThisDeviceOnly` to ensure data remains encrypted when the device is locked and is never backed up to iCloud.

---

#### 199. What are iOS Background Modes, and what are their limitations for React Native apps?

Configured under `UIBackgroundModes` in `Info.plist`, iOS Background Modes permit apps to execute specific tasks in the background: Audio playback, Location updates, Background fetch, and Remote push notifications (`remote-notification`). Apple strictly restricts arbitrary background code execution; apps that run CPU-intensive tasks or linger in the background without active background modes are terminated by the iOS Watchdog within 30 seconds.

---

#### 200. What is an iOS Watchdog Termination (`0x8badf00d`), and how do you prevent it in React Native?

An iOS Watchdog crash (crash log code `0x8badf00d` - "ate bad food") occurs when the operating system terminates an app for blocking the main UI thread for too long during startup (exceeding ~20 seconds) or failing to suspend promptly when entering the background (exceeding ~30 seconds). To prevent it: never perform synchronous network requests, heavy file I/O, or massive database migrations on the main thread or inside `didFinishLaunchingWithOptions`.

---

#### 201. What is an iOS Jetsam event (OOM Kill), and why is there no JavaScript crash log?

When total device RAM is depleted, the iOS kernel's low-memory killer (Jetsam) abruptly terminates background and foreground apps that exceed their allowable memory budget. Because Jetsam sends a `SIGKILL` directly from the OS kernel, the React Native JavaScript runtime and crash reporters (like Sentry) have no opportunity to catch an exception or write a JS stack trace. Jetsam events can only be identified via native iOS Jetsam crash reports in Xcode Organizer.

---

#### 202. How do you symbolicate iOS crash logs using `.dSYM` files and the `atos` command?

A `.dSYM` (Debug Symbol) file contains the debug symbol tables that map compiled binary memory addresses back to original source code files, method names, and line numbers. When analyzing a raw native iOS crash log with un-symbolicated hex memory addresses (e.g., `0x0000000104a32b40`), you run `atos -o MyApp.app.dSYM/Contents/Resources/DWARF/MyApp -arch arm64 -l <LoadAddress> <CrashAddress>` to resolve the exact source code location.

```bash
# Symbolicate iOS Crash Address using atos CLI
atos -o MyApp.app.dSYM/Contents/Resources/DWARF/MyApp -l 0x104000000 0x000000010412ab4c
```

---

#### 203. How do you use Xcode Instruments to profile a React Native iOS application?

In Xcode, select `Product -> Profile` to launch Instruments. Key profiling templates include:
1. **Time Profiler**: pinpoints CPU bottlenecks, heavy JavaScript engine execution, and main thread blocking
2. **Allocations**: tracks native and JS heap memory growth over time, identifying memory bloat
3. **Leaks**: detects unreferenced native memory blocks that remain allocated
4. **Core Animation**: measures real-time screen frame rates (FPS) and detects GPU offscreen rendering.

---

#### 204. What is App Tracking Transparency (ATT), and how do you implement it in React Native?

Starting in iOS 14.5, Apple mandates that apps must receive explicit user permission before tracking their activity across other companies' apps and websites for advertising or data broker purposes (IDFA access). Developers must:
1. add `NSUserTrackingUsageDescription` to `Info.plist`
2. integrate `react-native-tracking-transparency`
3. call `requestTrackingPermission()` before initializing any advertising or tracking SDKs (e.g., Facebook SDK, AppsFlyer).

---

#### 205. How does Apple's TestFlight service work, and what is the difference between Internal and External Testing?

TestFlight is Apple's official beta testing platform built into App Store Connect.
1. **Internal Testing**: allows distribution to up to 100 members of your App Store Connect development team immediately upon processing, requiring zero App Review
2. **External Testing**: allows distribution to up to 10,000 external beta testers via email or public link, but requires an expedited "Beta App Review" by Apple for every new major build version.

---


### 3. Native Modules, Swift/Objective-C++ & Memory Management

#### 206. What is the difference between CocoaPods Header Search Paths and Framework Search Paths?

`Header Search Paths` tell the C/C++/Objective-C compiler which directory folders to search when resolving `#include` and `#import <Header.h>` header declarations during compilation. `Framework Search Paths` tell the linker which directories contain compiled `.framework` bundles (containing both headers and compiled binary code). Misconfigured Header Search Paths in Xcode are the leading cause of `Lexical or Preprocessor Issue: 'React/RCTBridge.h' file not found`.

---

#### 207. What is the purpose of the Bridging Header (`ProjectName-Bridging-Header.h`) in iOS?

A Bridging Header is an Objective-C header file that exposes Objective-C headers and React Native core classes (`RCTBridgeModule.h`, `RCTEventEmitter.h`) to Swift. When developing native modules in Swift, the Swift compiler reads the Bridging Header, allowing Swift code to subclass Objective-C classes and implement React Native protocols without compilation errors.

---

#### 208. How do you configure Multiple Environments (Dev, Staging, Prod) in iOS using Xcode Schemes and Configurations?

1. In Xcode Project settings, duplicate the `Debug` and `Release` configurations to create `Debug-Staging`, `Release-Staging`, `Debug-Prod`, `Release-Prod`
2. create custom Xcode Schemes for each environment (`MyApp-Dev`, `MyApp-Staging`, `MyApp-Prod`)
3. use custom `.xcconfig` files to bind distinct Bundle Identifiers (`com.app.dev`), display names, and `Info.plist` files to each configuration
4. configure `react-native-config` to automatically swap environment files per scheme.

---

#### 209. What causes the `duplicate symbol '_OBJC_CLASS_$_...'` build error in Xcode, and how do you fix it?

This linker error (`ld: duplicate symbol`) occurs when the same class or symbol is compiled or linked multiple times into the same binary. Common causes:
1. importing a `.m` implementation file instead of a `.h` header file in an Objective-C file
2. a static library dependency is linked both directly in the main target and transitively inside a CocoaPod
3. both Swift and Objective-C declare identical class names without distinct namespace qualifiers.

---

#### 210. What is the iOS Safe Area, and how is it managed across modern iOS devices?

The iOS Safe Area defines the portion of the screen view that is guaranteed not to be covered by device hardware features (the top notch, Dynamic Island, status bar, or bottom home indicator bar). In React Native, developers use `react-native-safe-area-context` (`SafeAreaProvider` and `useSafeAreaInsets()`), which reads native window insets in real time and provides padding values (`top`, `bottom`, `left`, `right`) to ensure UI controls remain fully interactable.

---

#### 211. How do you implement Live Activities and Dynamic Island in React Native using ActivityKit?

Live Activities (iOS 16.1+) display real-time app data (e.g., food delivery progress, sports scores) on the Lock Screen and Dynamic Island. Because ActivityKit and Dynamic Island widgets must be built using native Swift and SwiftUI (`WidgetExtension`), React Native developers create a native Swift module that exposes start, update, and end methods to JavaScript via TurboModules, passing dynamic JSON state payloads to update the native SwiftUI Live Activity.

---

#### 212. What are iOS Capabilities, and how do you enable them in Xcode?

Capabilities are native platform features configured in Xcode under `Signing & Capabilities` that automatically update both the project's `.entitlements` file and the App ID configuration on Apple Developer Portal. Examples include: Push Notifications, Background Modes, Associated Domains (Universal Links), Sign in with Apple, Game Center, and In-App Purchases.

---

#### 213. How does Apple's In-App Purchase (StoreKit 2) workflow operate in React Native?

Using `react-native-iap`, the app requests product definitions from StoreKit via JSI/native bridge. When the user purchases an item, StoreKit presents the native Apple payment sheet and processes the transaction through Apple's servers. StoreKit 2 returns a cryptographically signed JWS (JSON Web Signature) transaction receipt. The React Native app sends this JWS token to its backend, which verifies the signature with Apple's Root CA before unlocking the purchased content.

---

#### 214. Scenario: An iOS build fails with "No signing certificate 'iOS Distribution' found" in CI. How do you diagnose and fix it?

1. **Cause**: The CI runner machine's macOS keychain is missing the private key and Apple Distribution Certificate (.p12) required by the selected Distribution Provisioning Profile
2. **Fix**: Use Fastlane `match` to securely synchronize encrypted certificates and provisioning profiles from a private Git repository into the CI keychain, or manually import the valid `.p12` certificate and `.mobileprovision` file into the CI runner keychain using security CLI commands before executing the build.

---

#### 215. Scenario: Push notifications arrive in the iOS notification center but tapping them fails to navigate to the target screen. What is wrong?

1. In `AppDelegate.mm`, ensure `UNUserNotificationCenterDelegate` is implemented and `[UNUserNotificationCenter currentNotificationCenter].delegate = self;` is set in `didFinishLaunchingWithOptions`
2. implement `userNotificationCenter:didReceiveNotificationResponse:withCompletionHandler:` in `AppDelegate` to extract the notification `userInfo` payload and pass it to React Native via `RCTDeviceEventEmitter` or Linking API
3. in JS, ensure the navigation container is ready before consuming the notification response.

---

#### 216. What is the difference between Automatic Signing and Manual Signing in Xcode?

Automatic Signing allows Xcode to automatically create and manage App IDs, development certificates, and provisioning profiles using the developer's connected Apple ID in App Store Connect. Manual Signing requires the developer to explicitly specify exact pre-generated Provisioning Profiles and Signing Certificates for each build configuration (`Debug`, `Release`), which is mandatory for predictable, deterministic CI/CD build pipelines.

---

#### 217. How do you handle App Store Review Rejections for Guideline 2.1 (Performance - App Completeness)?

Guideline 2.1 rejections occur when the app crashes on launch, displays broken UI/empty screens, fails to connect to backend APIs during review, or provides non-functional test accounts. To resolve: test release builds on physical devices using IPv6-only network simulations, verify that test credentials provided in App Store Connect have full access to active staging data, ensure all placeholder text/dummy buttons are removed, and provide a clear demo video in the Resolution Center.

---

#### 218. What is the purpose of `RCT_REMAP_METHOD` in React Native iOS modules?

`RCT_REMAP_METHOD(jsMethodName, nativeMethodSignature)` is an Objective-C macro used to export a native method to JavaScript under a custom JS method name that differs from the native Objective-C selector. It is particularly useful for mapping Objective-C multi-argument selectors (e.g., `fetchItem:(NSString *)itemId withOptions:(NSDictionary *)options`) into clean, single-identifier JavaScript function names (`fetchItem(itemId, options)`).

---


### 4. Capabilities, Privacy Manifests & App Store Guidelines

#### 219. How do you configure CocoaPods to support C++20 in a React Native iOS project?

In the `Podfile`, you add a `post_install` hook that iterates through all Pod targets and sets the C++ language standard build setting to C++20: `post_install do |installer| installer.pods_project.targets.each do |target| target.build_configurations.each do |config| config.build_settings['CLANG_CXX_LANGUAGE_STANDARD'] = 'c++20' end end end`. This is required when integrating modern C++ TurboModules and libraries requiring modern C++ features.

---

#### 220. What is the difference between `UIModalPresentationStyle.fullScreen` and `pageSheet` in React Native iOS modals?

`fullScreen` covers the entire device screen, completely obscuring the presenting view controller. `pageSheet` (the default card-style presentation in iOS 13+) displays the modal as a floating sheet with rounded top corners that partially reveals the darkened parent screen behind it; it natively supports interactive downward drag-to-dismiss gestures. In React Native, this is controlled via the `presentation: 'modal' | 'card' | 'pageSheet'` options in `@react-navigation/native-stack`.

---

#### 221. How do you implement Apple's "Sign in with Apple" requirement in React Native?

Apple App Store Review Guidelines mandate that if an app provides any third-party social login (e.g., Google, Facebook), it MUST also provide "Sign in with Apple" with equal prominence. Developers implement this using `@invertase/react-native-apple-authentication`, adding the `Sign in with Apple` capability in Xcode, requesting the user's Apple ID credential (identity token and authorization code), and verifying the token signature on the backend server against Apple's public keys.

---

#### 222. What are CocoaPods transitive dependencies, and how do they cause build breaks?

A transitive dependency is a dependency required by a third-party library rather than directly by your project. If library A requires pod X v1.2 and library B requires pod X v2.0, CocoaPods cannot resolve a compatible version graph unless dynamic framework versioning or dependency overrides are configured, resulting in `CocoaPods could not find compatible versions for pod` errors during `pod install`.

---

#### 223. How do you configure an iOS Launch Screen using `LaunchScreen.storyboard`?

In Xcode, open `LaunchScreen.storyboard`, place a `UIImageView` or view hierarchy in the view controller, and apply AutoLayout constraints pinning it to the top, bottom, leading, and trailing edges of the Superview or Safe Area. In `Info.plist`, set `UILaunchStoryboardName` to `LaunchScreen`. Avoid using static PNG splash images (`UILaunchImages`) as they are deprecated and lead to black bar letterboxing on new device screen sizes.

---

#### 224. How do you debug native iOS memory issues using Xcode Memory Graph Debugger?

While running the app from Xcode, click the "Debug Memory Graph" button in the debug bar. Xcode pauses the app and renders a visual 3D graph of every allocated object in the native and JS heap along with directed reference pointers. Retained object cycles and memory leaks are highlighted with purple exclamation marks, allowing developers to inspect the exact retaining reference chain holding deallocated views.

---

#### 225. What is the role of `Target Deployment Version` in Xcode?

The Target Deployment Version (iOS Deployment Target) defines the minimum iOS OS version that the compiled binary will support. Setting the deployment target to e.g. iOS 15.1 prevents the app from being installed on devices running iOS 14, while allowing the compiler to use modern iOS 15 APIs and optimizations. In React Native, the deployment target in the Xcode project and `Podfile` must match (e.g., `platform :ios, '15.1'`).

---

#### 226. Scenario: An app crashes on iOS devices during fast text input in Arabic or Japanese. What is the cause?

1. **Cause**: Complex non-Latin script input methods (IMEs) use multi-stage character composition where uncommitted phonetic characters reside in a temporary composition buffer. If a controlled React Native `TextInput` forces synchronous state updates (`onChangeText`) on every intermediate keystroke, it interrupts the native IME composition buffer, causing text corruption, cursor jumping, and native `UITextView` layout assertion crashes
2. **Fix**: Use uncontrolled inputs with `defaultValue` or debounce state updates.

---

#### 227. What is `Podfile.lock`, and why should it ALWAYS be committed to Git?

`Podfile.lock` records the exact resolved version numbers and SHA hashes of every CocoaPod and transitive dependency installed in the project. Committing `Podfile.lock` to version control guarantees deterministic builds across all developer workstations and CI/CD pipelines, preventing random build failures caused by third-party pods releasing breaking minor or patch updates upstream.

---

#### 228. Scenario: Universal links open Safari instead of your React Native app when tapped from Slack or Chrome. Why?

1. When a user taps a link inside third-party apps like Slack or Chrome, those apps may handle links internally via in-app web views (`SFSafariViewController`) or explicit browser intents rather than passing the URL to the iOS system router
2. If a user navigates to the Universal Link domain within Safari and pulls down to open Safari, iOS remembers the user's preference to open that domain in the browser; to reset, long-press the link in Safari and select "Open in [App Name]".

---

#### 229. How do you handle iOS Keychain data persistence across app uninstallation and reinstallation?

By default, iOS Keychain items persist even after a user uninstalls and deletes the app from their device. When the user reinstalls the app later, reading the Keychain returns old, orphaned authentication tokens from the previous installation. To prevent this: generate a unique random UUID on first app launch, store it in `NSUserDefaults` (which IS wiped on uninstall), and if the UUID is missing on launch, programmatically clear legacy Keychain items before initializing user sessions.

---

#### 230. Scenario: An iOS app build succeeds locally on Mac M1/M2 but fails on Intel CI runners with `Undefined symbols for architecture x86_64`. What is the fix?

1. **Cause**: A third-party pre-compiled native framework or CocoaPod only contains ARM64 binary slices and lacks `x86_64` simulator architecture slices
2. **Fix**: In Xcode Build Settings and `Podfile` post-install hook, ensure `EXCLUDED_ARCHS[sdk=iphonesimulator*] = ""` is configured properly or exclude `i386`/`arm64` specifically for Intel simulator builds, or migrate CI runners to native Apple Silicon (M1/M2/M3) runners.

---

# 🚀 Build, Deployment & Production (20 Questions)

---


### 1. CI/CD Pipelines, Fastlane & OTA Updates

#### 231. Describe the end-to-end React Native build lifecycle from source code to final native binary.

1. **JavaScript Compilation**: Metro bundler traverses the dependency graph from the entry file (`index.js`), transforms JSX/TypeScript via Babel, and compiles the bundle into optimized Hermes bytecode (`index.android.bundle` / `main.jsbundle`)
2. **Codegen Execution**: parses TypeScript specs to generate C++ JSI bindings and native interfaces for TurboModules and Fabric components
3. **Native Compilation**: Gradle (Android) compiles Java/Kotlin code, invokes CMake/NDK for C++ code, and compiles resources into DEX and `.so` files; Xcode (iOS) compiles Objective-C/Swift/C++ code and links CocoaPods frameworks
4. Packaging & Signing: Android packages bytecode, native libraries, and assets into an AAB/APK and signs it with a Keystore; iOS packages compiled binaries, dSYMs, and assets into an `.ipa` archive signed with a Provisioning Profile and Certificate.

---

#### 232. How do you manage multi-environment configurations (Dev, Staging, Production) in React Native?

1. Store environment variables in separate files (`.env.development`, `.env.staging`, `.env.production`)
2. use `react-native-config` or custom native build flavor scripts to inject variables into both JavaScript and native code (`AndroidManifest.xml`, `Info.plist`)
3. configure matching native Product Flavors in Android (`app/build.gradle`) and Schemes/Configurations in iOS Xcode
4. define distinct Application IDs (`com.app.dev`, `com.app`) so all environment variants can be installed side-by-side on the same physical device.

---

#### 233. How do you construct an automated CI/CD pipeline for React Native using GitHub Actions?

A robust GitHub Actions pipeline includes:
1. **Quality Checks**: runs on pull requests to execute TypeScript type checking (`tsc --noEmit`), ESLint, Prettier, and Jest unit tests
2. **Android Build Job**: sets up JDK 17, caches Gradle dependencies (`~/.gradle/caches`), builds release Android App Bundle (`./gradlew bundleRelease`), and uploads the `.aab` artifact
3. **iOS Build Job**: runs on a macOS runner, installs CocoaPods (`pod install`), uses Fastlane `match` for code signing, executes `fastlane gym` to build the signed `.ipa`, and uploads the artifact to TestFlight.

```yaml
# .github/workflows/ci.yml
name: CI/CD Pipeline

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: 20 }
      - run: yarn install --frozen-lockfile
      - run: yarn tsc --noEmit
      - run: yarn jest
```

---

#### 234. What is Fastlane, and how do tools like `match`, `gym`, `supply`, and `pilot` streamline React Native releases?

Fastlane is an open-source automation engine for building, signing, and releasing mobile apps. Key tools:
1. **`match`**: automates iOS code signing across teams by storing encrypted certificates and provisioning profiles in a private Git repo
2. **`gym` (`build_app`)**: compiles and packages signed iOS `.ipa` binaries
3. **`pilot`**: uploads iOS builds to TestFlight and manages internal/external beta testers
4. **`supply`**: automates uploading Android AABs, APKs, release notes, and store assets directly to Google Play Console tracks.

```ruby
# fastlane/Fastfile
default_platform(:ios)

platform :ios do
  lane :beta do
    match(type: "appstore", readonly: true)
    gym(scheme: "MyApp", export_method: "app-store")
    pilot(skip_waiting_for_build_processing: true)
  end
end

platform :android do
  lane :beta do
    gradle(task: "bundleRelease")
    supply(track: "internal", aab: "app/build/outputs/bundle/release/app-release.aab")
  end
end
```

---

#### 235. How does Fastlane `match` work, and why is it superior to manual certificate management?

Fastlane `match` implements the concept of Git-based centralized code signing. It creates and stores all iOS Development and Distribution Certificates (.p12) and Provisioning Profiles in an encrypted private Git repository (secured with OpenSSL). When a new developer joins the team or a CI/CD runner executes a build, `match` clones the repository, decrypts the certificates, and installs them into the local macOS keychain, completely eliminating signing certificate conflicts and expired profile issues across teams.

---

#### 236. How do Over-The-Air (OTA) updates work in React Native, and what are their limitations?

OTA update services (like Microsoft CodePush or EAS Update) allow developers to instantly push updated JavaScript bundles and asset files directly to users' devices without submitting a new binary to the App Store or Google Play. Limitations: OTA updates CANNOT modify native code (e.g., adding new native libraries, updating `AndroidManifest.xml`, `Info.plist`, or changing native Kotlin/Swift files); attempting to push native changes via OTA causes instant app crashes on launch. Apple also prohibits OTA updates that fundamentally alter the app's primary purpose.

---

#### 237. What is the recommended Mobile App Versioning strategy?

Mobile versioning requires two distinct values:
1. Marketing Version (`versionName` on Android, `CFBundleShortVersionString` on iOS): follows Semantic Versioning (`MAJOR.MINOR.PATCH`, e.g., `2.1.0`) and is visible to users on the app stores
2. Internal Build Number (`versionCode` on Android, `CFBundleVersion` on iOS): a strictly monotonically increasing integer (e.g., `142`) incremented with every CI/CD build. Google Play and TestFlight reject any upload whose internal build number is not strictly greater than the previously uploaded build.

---

#### 238. What are the key architectural differences between Expo EAS (Expo Application Services) and Bare React Native workflows?

Bare React Native gives developers full manual control over the native `android/` and `ios/` folders, requiring local Xcode, Android Studio, and custom CI/CD scripting. Expo EAS (EAS Build, EAS Submit, EAS Update) is a managed cloud infrastructure that generates native projects on-the-fly using Prebuild (`npx expo prebuild`) based on `app.json` configuration, compiles native iOS/Android binaries in managed cloud containers, automates store submissions, and handles seamless OTA updates without maintaining checked-in native directories.

---

#### 239. How do you automate ProGuard / R8 mapping file and iOS dSYM file uploads to Sentry in CI?

1. **For Android**: Configure the `@sentry/react-native` Gradle plugin in `app/build.gradle`, which automatically hooks into the `assembleRelease` / `bundleRelease` tasks to locate the R8 `mapping.txt` file and upload it to Sentry via the Sentry CLI
2. **For iOS**: Configure the Sentry Xcode build phase script (`sentry-cli upload-dif`) in the main app target or use the Fastlane `sentry_upload_dsym` action inside the Fastlane release lane to automatically locate and upload `.dSYM` archives generated during the `gym` build.

```groovy
// android/app/build.gradle
apply plugin: "com.facebook.react"
apply plugin: "io.sentry.android.gradle"

sentry {
    includeProguardMapping = true
    autoUploadProguardMapping = true
}
```

---

#### 240. How do you design backward-compatible APIs and database migrations for mobile applications?

Unlike web apps where all clients load the newest frontend immediately, mobile apps exist in the wild across dozens of older versions simultaneously. Strategies:
1. Version all backend API endpoints (`/v1/`, `/v2/`)
2. never rename or delete existing API response fields—always deprecate fields and add new fields additively
3. for local SQLite/WatermelonDB schema updates, implement incremental database migration scripts that run sequentially on app launch (`migration 1 -> 2 -> 3`) to update local schemas without wiping user data.

---


### 2. Production Monitoring, Sentry, Vitals & Release Management

#### 241. How do Phased Releases (Staged Rollouts) work on Google Play and Apple App Store?

Phased releases allow developers to release an app update gradually to a percentage of production users over time (e.g., Day 1: 1%, Day 2: 2%, Day 3: 5%, Day 4: 10%, Day 5: 20%, Day 6: 50%, Day 7: 100%). This allows teams to monitor production crash rates and backend server loads on a small user subset, providing the ability to pause or halt the rollout immediately if a critical crash or regression is detected before it impacts the entire user base.

---

#### 242. How do you implement Feature Flags and Remote Configuration for safe mobile deployments?

Integrate services like Firebase Remote Config or LaunchDarkly. Wrap new features in conditional checks: `if (remoteConfig.getBoolean('enable_new_payment_gateway')) { ... }`. When deploying major changes, release the app binary with the flag set to `false`. Once the binary is distributed and stable, enable the flag remotely on the server for 5% of users, gradually increasing to 100%. If unexpected production bugs emerge, toggle the flag to `false` instantly to kill the feature without requiring an app store update.

---

#### 243. How do you handle Google Play's 14-day 20-tester closed testing requirement for new personal developer accounts?

Google Play mandates that new personal developer accounts must run a closed internal test with at least 20 opted-in testers continuously for at least 14 consecutive days before applying for production access. Teams must:
1. recruit 20+ testers via Google Groups or email lists
2. publish the build to the Closed Testing track
3. ensure testers install and interact with the app throughout the 14-day window
4. complete the production access application answering Google's questions regarding testing feedback and bug resolution.

---

#### 244. How do you monitor Real User Monitoring (RUM) and performance metrics in production?

Integrate Sentry Performance, Firebase Performance Monitoring, or Datadog RUM. These SDKs automatically track:
1. App Startup Time (Cold, Warm, and Hot starts)
2. Screen Rendering Metrics (Time to Initial Display, Frozen Frames, Slow Frames)
3. Network Latency and Failure Rates per endpoint
4. Custom User Transactions (e.g., measuring the exact duration from tapping "Checkout" to receiving payment confirmation).

---

#### 245. What is a "Kill Switch" mechanism in mobile apps, and how is it implemented?

A Kill Switch (Force Update mechanism) forces users running outdated or broken app versions to update before continuing to use the app. On app launch, the app queries a version endpoint: `{ min_required_version: "2.1.0", latest_version: "2.3.0" }`. If the installed app version is below `min_required_version`, the app presents a blocking, non-dismissible modal informing the user that their version is no longer supported, with a direct link opening the App Store or Google Play Store page.

```tsx
// Force Update / Kill Switch Component
export function ForceUpdateModal({ isRequired }: { isRequired: boolean }) {
  if (!isRequired) return null;
  return (
    <Modal visible={true} backdropDismiss={false}>
      <View style={styles.container}>
        <Text style={styles.title}>Update Required</Text>
        <Text>Please update to the latest version to continue using the app.</Text>
        <Button title="Update Now" onPress={() => Linking.openURL('https://apps.apple.com/...')} />
      </View>
    </Modal>
  );
}
```

---

#### 246. How do you ensure PII (Personally Identifiable Information) masking in production crash reporting?

Data privacy regulations (GDPR, CCPA, HIPAA) prohibit sending unencrypted PII to crash analytics servers. Implement:
1. Sentry `beforeSend(event)` hooks to sanitize and strip credit card numbers, passwords, email addresses, and auth tokens from error breadcrumbs and stack traces
2. configure network logging interceptors to omit `Authorization` headers and request bodies from crash logs
3. enable automated PII scrubbing rules in the crash monitoring dashboard.

```typescript
// Sentry PII Masking in React Native
import * as Sentry from '@sentry/react-native';

Sentry.init({
  dsn: 'https://key@sentry.io/12345',
  beforeSend(event) {
    // Strip sensitive user auth headers and email addresses
    if (event.request?.headers) {
      delete event.request.headers['Authorization'];
    }
    if (event.user) {
      delete event.user.email;
      delete event.user.ip_address;
    }
    return event;
  },
});
```

---

#### 247. Scenario: A critical bug is discovered in production that crashes the app immediately for all users opening the checkout screen. What is your emergency triage protocol?

1. **Triage**: Immediately inspect Sentry to identify the exact stack trace and affected app versions
2. **Feature Flag Kill**: If the checkout screen or underlying feature is behind a remote feature flag, disable it immediately to mitigate the crash
3. **OTA Patch**: If the fix involves only JavaScript/React Native logic, deploy an emergency Over-The-Air (OTA) update via CodePush / EAS Update to patch live users within minutes
4. **Native Hotfix**: If the bug requires native code changes, cherry-pick the fix into a hotfix branch, increment build numbers, compile release binaries via Fastlane, and submit an Expedited App Review request to Apple and Google Play.

---

#### 248. Scenario: React Native builds successfully on local developer MacBooks (M1/M2) but consistently fails in GitHub Actions CI runners. What is your diagnostic checklist?

1. Environment & Tooling: Compare Node.js, Ruby, JDK, CocoaPods, and NDK versions between local and CI environments to ensure exact parity
2. Missing Secrets & Environment Variables: Verify that all signing keys, Keystores, `.env` files, and API secrets are correctly injected into CI runner environment variables
3. **File Path Casing**: Linux CI runners have case-sensitive filesystems (unlike macOS default case-insensitive filesystems), causing imports like `./Button` vs `./button` to fail
4. **Missing `Podfile.lock` or `yarn.lock`**: Ensure lockfiles are committed so CI does not install newer breaking transitive dependencies.

---

#### 249. Scenario: Google Play reports that your app's ANR rate and Crash rate exceed the "Bad Behavior Threshold" (0.47%), threatening search discovery. How do you remediate?

1. Analyze Android Vitals in Google Play Console to identify the top crash clusters and ANR traces exceeding thresholds
2. **For ANRs**: Identify long-running tasks executing on the main UI thread (heavy SQLite queries, synchronous file I/O, synchronous native module methods) and offload them to background worker threads
3. **For Crashes**: Fix top null-pointer exceptions, handle background permission rejections, and resolve out-of-memory image bloat
4. Release a hotfix update with a staged rollout, monitoring Android Vitals daily until rates drop safely below 0.47%.

---

#### 250. Scenario: You are leading the release of a major v2.0 React Native app to 5 million users. What is your comprehensive pre-release checklist?

1. Quality & Testing: 100% pass rate on unit, integration, and E2E regression test suites across physical low-end Android and iOS devices
2. Performance & Profiling: Verify cold startup time (<2s), steady 60 FPS scrolling on major lists, and zero memory leaks over 30 minutes of continuous use
3. Security & Compliance: Verified SSL Pinning, Privacy Manifest (`PrivacyInfo.xcprivacy`) complete, ProGuard/R8 obfuscation enabled, and zero API keys in plain JS
4. Monitoring & Tooling: Sentry crash reporting active with automated source map / dSYM upload, Firebase Analytics and Performance monitoring verified
5. **Release Strategy**: Configured 7-day phased rollout on Google Play and App Store, tested emergency Force Update kill-switch endpoint, and verified rollback / OTA hotfix pipeline.

---

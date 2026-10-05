# 📱 React Native Core Architecture & Internals

> Comprehensive deep-dive into React Native's architectural evolution: Old Architecture vs New Architecture, JSI (JavaScript Interface), Fabric Renderer, TurboModules, Bridgeless Mode, Hermes JavaScript Engine, Threading Model, and Yoga Layout Engine.

---

## 📑 Table of Contents
1. [Old Architecture vs New Architecture Overview](#1-old-architecture-vs-new-architecture-overview)
2. [The JSON Bridge & Its Performance Bottlenecks](#2-the-json-bridge--its-performance-bottlenecks)
3. [JSI (JavaScript Interface) Deep Dive](#3-jsi-javascript-interface-deep-dive)
4. [Fabric: The New Native Rendering System](#4-fabric-the-new-native-rendering-system)
5. [TurboModules: Dynamic Native Module System](#5-turbomodules-dynamic-native-module-system)
6. [Bridgeless Mode in React Native 0.74+](#6-bridgeless-mode-in-react-native-074)
7. [Hermes JavaScript Engine Internals](#7-hermes-javascript-engine-internals)
8. [The React Native Threading Model](#8-the-react-native-threading-model)
9. [Yoga Layout Engine & Flexbox Calculations](#9-yoga-layout-engine--flexbox-calculations)
10. [Codegen & Type Safety between JS and Native](#10-codegen--type-safety-between-js-and-native)

---

## 1. Old Architecture vs New Architecture Overview

```
+-----------------------------------------------------------------------------------------+
|                                    OLD ARCHITECTURE                                     |
|                                                                                         |
|   JavaScript Realm                     The Bridge                     Native Realm      |
|  +------------------+             +------------------+            +------------------+  |
|  | JS App Code      |  JSON async |  Serialization   |  Native UI | Native Modules   |  |
|  | React Virtual DOM| <=========> |  Queue / Batches | <========> | Shadow Tree      |  |
|  | JS Engine (JSC)  |             |  JSON stringify  |            | Android/iOS Views|  |
|  +------------------+             +------------------+            +------------------+  |
+-----------------------------------------------------------------------------------------+

+-----------------------------------------------------------------------------------------+
|                              NEW ARCHITECTURE (Bridgeless)                              |
|                                                                                         |
|   JavaScript Realm                        JSI                         Native Realm      |
|  +------------------+             +------------------+            +------------------+  |
|  | JS App Code      |   Direct    | C++ Host Objects | Synchronous| Fabric Renderer  |  |
|  | Hermes Engine    | <=========> | Memory Sharing   | <========> | TurboModules     |  |
|  | Concurrent React |  Zero-Copy  | No Serialization |  or Async  | Yoga Layout (C++)|  |
|  +------------------+             +------------------+            +------------------+  |
+-----------------------------------------------------------------------------------------+
```

| Dimension | Old Architecture | New Architecture |
| :--- | :--- | :--- |
| **Communication Layer** | Asynchronous JSON Bridge | **JSI (JavaScript Interface)** direct C++ invocations |
| **Data Transfer** | Serialized JSON strings copied across memory | Direct memory sharing via **C++ Host Objects** |
| **Rendering System** | Legacy UI Manager (Shadow Nodes on background thread) | **Fabric Renderer** (immutable C++ shadow tree) |
| **Module Loading** | All native modules eagerly initialized at app launch | **TurboModules** loaded lazily on-demand |
| **Execution Mode** | Strictly Asynchronous | Synchronous and Asynchronous options |
| **Default JS Engine** | JavaScriptCore (JSC) | **Hermes** (AOT bytecode compiled) |
| **Bridge Status** | Mandatory | Deprecated $\rightarrow$ **Bridgeless Mode** |

---

## 2. The JSON Bridge & Its Performance Bottlenecks

### How the Legacy Bridge Worked
1. JavaScript thread serializes an array of method calls, IDs, and arguments into a JSON string via `JSON.stringify()`.
2. The serialized payload is transferred across the asynchronous message queue.
3. The Native thread (Android/iOS) receives the message, parses the JSON (`JSON.parse()`), and executes the corresponding native UI or platform API call.

### Why the Bridge Caused Janky 60fps Drops
1. **Serialization Overhead**: Complex objects, lists, and rapid gestures generated megabytes of JSON string allocations per second, triggering severe Garbage Collection (GC) pauses.
2. **Asynchronous Lag on Gestures**: Touch events traveled: *Native Touch $\rightarrow$ Bridge $\rightarrow$ JS Handler $\rightarrow$ State Update $\rightarrow$ Bridge $\rightarrow$ Native View Layout*. This multi-hop asynchronous journey caused touches and animations to lag behind the user's finger.
3. **Blank Spaces in Fast Lists**: When scrolling a `FlatList` rapidly, the native scroll view updated faster than the bridge could send new row layout instructions, causing visible white flashes.

---

## 3. JSI (JavaScript Interface) Deep Dive

### What is JSI?
**JSI (JavaScript Interface)** is a lightweight, general-purpose C++ abstraction layer that allows a JavaScript runtime (like Hermes or V8) to directly interact with C++ host objects, and vice versa, without any serialization.

### Core Mechanics
- The JavaScript engine holds direct pointers to C++ objects (`jsi::HostObject`).
- JavaScript can invoke C++ functions directly in the same memory address space synchronously.
- C++ can instantiate and invoke JavaScript functions directly.

#### C++ JSI HostObject Example:
```cpp
// FastMathModule.h
#include <jsi/jsi.h>

using namespace facebook;

class FastMathModule : public jsi::HostObject {
public:
  jsi::Value get(jsi::Runtime &rt, const jsi::PropNameID &name) override {
    auto propName = name.utf8(rt);
    if (propName == "fastMultiply") {
      return jsi::Function::createFromHostFunction(
          rt, name, 2,
          [](jsi::Runtime &rt, const jsi::Value &thisVal, const jsi::Value *args, size_t count) -> jsi::Value {
            double a = args[0].asNumber();
            double b = args[1].asNumber();
            return jsi::Value(a * b); // Synchronous direct return!
          });
    }
    return jsi::Value::undefined();
  }
};
```

---

## 4. Fabric: The New Native Rendering System

Fabric is React Native’s modern rendering engine built entirely around JSI and C++.

```
   React Component Tree (JavaScript)
                 │
                 ▼
    Fabric C++ Shadow Tree (Yoga Layout)
                 │
                 ▼
  Platform Native Views (Android / iOS UI)
```

### Key Innovations of Fabric
1. **Thread-Safe Immutable Trees**: The shadow tree is immutable and managed in C++. Any UI state mutation produces a new shadow tree in C++ without blocking the main UI thread.
2. **Synchronous Measuring & Layout**: Allows measuring native views synchronously on the JavaScript thread (eliminating layout jumps in Tooltips, Popovers, and Inputs).
3. **Multi-Priority Scheduling**: Integrates natively with React 18/19 Concurrent features (`startTransition`, Suspense). User interactions (typing, scrolling) take immediate priority over background data updates.

---

## 5. TurboModules: Dynamic Native Module System

### The Problem with Legacy Native Modules
In the old architecture, all native modules (Camera, Bluetooth, Location, SQLite, 50+ third-party libraries) had to be initialized and registered on app startup, even if the user never opened the camera screen! This caused slow app cold starts (2–4 seconds).

### How TurboModules Solve This
1. **Lazy Initialization**: TurboModules are initialized **on-demand** only when first called in JavaScript (`NativeModules.Camera.open()`).
2. **Compile-Time Type Safety**: Specs written in TypeScript or Flow are passed to **Codegen**, which generates C++ header files and interfaces.
3. **Direct C++ Binding**: Bypasses the JSON bridge; native methods are invoked via JSI pointers.

---

## 6. Bridgeless Mode in React Native 0.74+

In React Native 0.74+, **Bridgeless Mode** is enabled by default with the New Architecture.
- The legacy C++ Bridge code is completely removed from runtime memory.
- All native communications use TurboModules and Fabric via JSI.
- Built-in compatibility shims redirect legacy `NativeModules` calls through an internal TurboModule adapter, ensuring backward compatibility while maximizing performance.

---

## 7. Hermes JavaScript Engine Internals

**Hermes** is an open-source JavaScript engine optimized by Meta specifically for running React Native on mobile devices.

### Ahead-of-Time (AOT) Bytecode Compilation
In standard engines (V8, JSC), JavaScript is parsed, compiled, and optimized at runtime on the device, consuming battery and CPU during app launch.
- **Hermes Strategy**: At build time (during Gradle/Xcode build), Metro compiles all JavaScript files into **Hermes Bytecode (`.hbc`)**.
- The mobile app ships with pre-compiled bytecode:
  - **Cold Start Time**: Reduced by up to 50%.
  - **Memory Footprint (RAM)**: Significantly reduced because the AST and parser do not need to live in memory.
  - **APK / IPA Size**: Smaller bundle footprint.

### Hermes Garbage Collector (Hades)
Hermes features **Hades**, a generational, concurrent garbage collector that runs mostly in the background on a separate thread, keeping UI frame drops to near zero during memory collection.

---

## 8. The React Native Threading Model

React Native coordinates work across **three dedicated threads** and a native thread pool:

```
+─────────────────────────────────────────────────────────────+
|                         Main Thread                         |
|   (Android UI Thread / iOS Main RunLoop)                    |
|   - Handles touch events, gestures, screen draws            |
|   - Updates native Android Views and iOS UIViews            |
+──────────────────────────────┬──────────────────────────────+
                               │ Synchronous / JSI
+──────────────────────────────▼──────────────────────────────+
|                       JavaScript Thread                     |
|   - Executes application React logic and business code      |
|   - Handles API network callbacks and state updates         |
+──────────────────────────────┬──────────────────────────────+
                               │ Layout instructions
+──────────────────────────────▼──────────────────────────────+
|                     Shadow / Layout Thread                  |
|   (Executed in C++ via Yoga Layout Engine)                  |
|   - Computes CSS Flexbox dimensions and exact pixel offsets |
+─────────────────────────────────────────────────────────────+
                               │ Offloads heavy tasks
+──────────────────────────────▼──────────────────────────────+
|                   Native Modules Thread Pool                |
|   - Background disk I/O, SQLite queries, network calls      |
+─────────────────────────────────────────────────────────────+
```

---

## 9. Yoga Layout Engine & Flexbox Calculations

React Native does not use a browser rendering engine, so how does it support CSS Flexbox?
- **Yoga** is an open-source, high-performance layout engine written in C++ by Meta.
- It implements a subset of W3C CSS Flexbox.
- When you define styles in React Native (`flexDirection: 'row'`, `justifyContent: 'space-between'`), Yoga computes the exact pixel coordinates (`x, y, width, height`) for each element on the background Shadow Thread and dispatches the calculated geometry to the platform UI thread.

---

## 10. Codegen & Type Safety between JS and Native

In the New Architecture, **Codegen** automates the generation of native scaffolding:
1. Developer writes a typed Spec file in TypeScript (`NativeCalculator.ts`):
```typescript
import { TurboModule, TurboModuleRegistry } from 'react-native';

export interface Spec extends TurboModule {
  add(a: number, b: number): Promise<number>;
}

export default TurboModuleRegistry.getEnforcing<Spec>('NativeCalculator');
```
2. Codegen parses this interface during build and generates:
   - C++ glue code and JSI binding wrappers.
   - Objective-C++ protocols (`NativeCalculatorSpec.h`) for iOS.
   - Java/Kotlin abstract classes (`NativeCalculatorSpec.java`) for Android.
3. If the native implementation does not match the TypeScript signature, the build fails at compile time, eliminating runtime type mismatch crashes.

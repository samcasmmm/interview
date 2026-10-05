# 🔍 React Native Debugging, Profiling & Troubleshooting

> Production engineering guide on debugging tools (Flipper, Chrome DevTools, Hermes Profiler), diagnosing mobile memory leaks, Xcode Instruments & Android Studio Profiler, resolving Native Crashes & ANRs, and Symbolication with Sentry / Crashlytics.

---

## 📑 Table of Contents
1. [Modern Debugging Ecosystem: Dev Menu, Chrome DevTools & Flipper](#1-modern-debugging-ecosystem-dev-menu-chrome-devtools--flipper)
2. [Hermes CPU Profiling & Flamegraph Analysis](#2-hermes-cpu-profiling--flamegraph-analysis)
3. [Native Profiling: Xcode Instruments & Android Studio Profiler](#3-native-profiling-xcode-instruments--android-studio-profiler)
4. [Diagnosing & Eliminating Mobile Memory Leaks](#4-diagnosing--eliminating-mobile-memory-leaks)
5. [Troubleshooting Native Crashes: `SIGSEGV`, `EXC_BAD_ACCESS` & NPEs](#5-troubleshooting-native-crashes-sigsegv-exc_bad_access--npes)
6. [Android ANRs (Application Not Responding): Diagnosis & Fixes](#6-android-anrs-application-not-responding-diagnosis--fixes)
7. [Crash Symbolication: dSYM (iOS) & ProGuard Mapping Files (Android)](#7-crash-symbolication-dsym-ios--proguard-mapping-files-android)

---

## 1. Modern Debugging Ecosystem: Dev Menu, Chrome DevTools & Flipper

### 1. React Native Dev Menu
- Triggered via `Cmd + D` (iOS Simulator), `Cmd + M` / `adb shell input keyevent 82` (Android Emulator), or physically shaking the device.
- Features: Reload JS, Toggle Element Inspector, Toggle Performance Monitor.

### 2. Chrome DevTools & Experimental Hermes Debugger (React Native 0.73+)
React Native 0.73+ natively integrates Chrome DevTools directly via CDP (Chrome DevTools Protocol) without requiring external third-party tools:
- Connects directly to Hermes runtime.
- Step-by-step breakpoints, watch expressions, console logging, and CPU profiling.

---

## 2. Hermes CPU Profiling & Flamegraph Analysis

To capture JS thread CPU execution:
1. Open Dev Menu $\rightarrow$ Tap **"Start Hermes Profiler"**.
2. Perform the slow user flow (e.g. scrolling a heavy list or opening a modal).
3. Tap **"Stop Hermes Profiler"**.
4. Pull the recorded `.cpuprofile` file via adb:
   ```bash
   adb pull /data/user/0/com.myapp/cache/sampling-profiler-trace*.cpuprofile ./
   ```
5. Open Chrome DevTools $\rightarrow$ Performance Tab $\rightarrow$ Load Profile to view interactive flame graphs showing hot JS functions causing frame drops.

---

## 3. Native Profiling: Xcode Instruments & Android Studio Profiler

JavaScript profilers only show JS execution. When dropped frames stem from native layouts, images, or native modules, use native profilers:

### 1. Xcode Instruments (iOS)
- **Time Profiler**: Analyzes native CPU usage on the main thread.
- **Allocations & Leaks**: Tracks retain cycles and unreleased memory buffers.

### 2. Android Studio Profiler & Perfetto
- **CPU Profiler**: Tracks native thread activity (`main`, `mqt_js`, `mqt_native_modules`).
- **Memory Profiler**: Visualizes Java Heap vs Native Heap allocations.
- **Perfetto / Systrace**: Inspects the exact time spent in the Android UI rendering pipeline (`Choreographer#doFrame`).

---

## 4. Diagnosing & Eliminating Mobile Memory Leaks

### Common Mobile Leak Culprits:
1. **Unmounted Event Listeners & Subscriptions**:
   ```tsx
   // LEAK: Listener never removed when component unmounts!
   useEffect(() => {
     Dimensions.addEventListener('change', handleResize);
   }, []);

   // FIX: Always return cleanup function
   useEffect(() => {
     const sub = Dimensions.addEventListener('change', handleResize);
     return () => sub.remove();
   }, []);
   ```
2. **Retained Image Bitmaps**:
   - Loading uncompressed 4K images into standard `<Image>` tags allocates raw decoded bitmap buffers in native RAM (a 4000x3000 image consumes $\sim 48\text{MB}$ of RAM!).
   - **Fix**: Use `react-native-fast-image` which downsamples images to the exact target display dimensions before decoding into memory.

---

## 5. Troubleshooting Native Crashes: `SIGSEGV`, `EXC_BAD_ACCESS` & NPEs

When React Native crashes without displaying the red screen, the crash occurred in the **Native OS layer**:
- **`EXC_BAD_ACCESS` (iOS)**: Attempting to access deallocated memory (dangling pointer). Often caused by improper C++ memory management in custom native modules.
- **`NullPointerException` (Android)**: A native module method attempted to invoke an action on a `null` Android `Context` or uninitialized native reference.
- **`SIGSEGV` (Segmentation Fault)**: Invalid memory address accessed.

#### Inspecting Crash Logs:
- Android: `adb logcat *:E` or `adb logcat | grep -E "AndroidRuntime|ReactNative"`
- iOS: Open macOS **Console.app** and filter by device logs and process name.

---

## 6. Android ANRs (Application Not Responding): Diagnosis & Fixes

### What triggers an ANR?
The Android OS displays the dreaded *"App is not responding"* dialog whenever the **Main UI Thread is blocked for more than 5 seconds** (or broadcast receiver takes $>10\text{s}$).

### How React Native Causes ANRs:
Even though business logic runs on the JS thread, synchronous native module calls (`@ReactMethod(isBlockingSynchronousMethod = true)`) or heavy layout operations on `MainActivity` freeze the Android UI thread.

### Solution:
1. Never execute file I/O, database queries, or heavy crypto on the main thread in native modules.
2. Dispatch background work using Kotlin Coroutines (`Dispatchers.IO`) or Java `ExecutorService`.

---

## 7. Crash Symbolication: dSYM (iOS) & ProGuard Mapping Files (Android)

When production apps crash, stack traces sent to Sentry or Firebase Crashlytics are obfuscated:
- Android trace: `at com.myapp.a.b.c(Unknown Source:12)`
- iOS trace: `MyApp 0x0000000104a3f81c 0x1049e0000 + 391196`

### Symbolication Workflow:
1. **Android (ProGuard Mapping File)**:
   - When building release AABs with `minifyEnabled true`, Gradle generates `mapping.txt` inside `android/app/build/outputs/mapping/release/`.
   - Upload `mapping.txt` to Sentry/Crashlytics to de-obfuscate class and method names.
2. **iOS (dSYM Files)**:
   - Xcode archives produce **Debug Symbol files (`.dSYM`)** containing memory address maps.
   - Upload dSYMs via `fastlane run upload_symbols_to_crashlytics` or Sentry CLI to translate hexadecimal memory addresses into exact source filenames and line numbers.

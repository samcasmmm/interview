# 📱 React Native, Android & iOS Mobile Engineering Master Roadmap

Comprehensive, end-to-end interview preparation and architectural reference guides for **React Native, Android Internals, iOS Internals, Build & Deployment (Fastlane / CI/CD), and Debugging / Profiling**.

---

## 📚 Specialized Topic Master Guides

| # | Topic Area | File Link | Focus & Highlights |
| :---: | :--- | :--- | :--- |
| **01** | **Core Architecture & Internals** | [01-react-native-core-architecture.md](file:///e:/code/study/prep-month/interview/framework/react-native/01-react-native-core-architecture.md) | Old Architecture vs New Architecture, JSI, Fabric, TurboModules, Bridgeless Mode, Hermes Bytecode, Threading Model, Yoga Layout |
| **02** | **UI Components, Styling & Layout** | [02-react-native-ui-components-styling.md](file:///e:/code/study/prep-month/interview/framework/react-native/02-react-native-ui-components-styling.md) | Primitives vs Web widgets, StyleSheet optimizations, `useWindowDimensions`, Safe Area (Notches/Dynamic Island), Keyboard handling, a11y, Dark Mode |
| **03** | **State, Hooks & Lifecycle** | [03-react-native-state-and-hooks.md](file:///e:/code/study/prep-month/interview/framework/react-native/03-react-native-state-and-hooks.md) | Mobile `AppState`, `BackHandler`, React 18/19 concurrent hooks, Zustand vs Redux Toolkit, Context API performance traps, TanStack Query offline sync |
| **04** | **Lists & UI Performance** | [04-react-native-lists-and-performance.md](file:///e:/code/study/prep-month/interview/framework/react-native/04-react-native-lists-and-performance.md) | FlatList vs SectionList, `windowSize`, `getItemLayout`, `removeClippedSubviews`, Shopify FlashList cell recycling, eliminating blank spaces |
| **05** | **Animations, Gestures & Skia** | [05-react-native-animations-and-gestures.md](file:///e:/code/study/prep-month/interview/framework/react-native/05-react-native-animations-and-gestures.md) | `Animated` with `useNativeDriver`, Reanimated 3 Worklets, Gesture Handler v2, Layout Transitions, React Native Skia GPU canvas |
| **06** | **Navigation & Deep Linking** | [06-react-native-navigation-and-routing.md](file:///e:/code/study/prep-month/interview/framework/react-native/06-react-native-navigation-and-routing.md) | Native Stack vs JS Stack, Nested navigators, Universal Links, Android App Links, Cold-start vs Warm-start, Expo Router, State persistence |
| **07** | **Storage, DB & Networking** | [07-react-native-storage-and-networking.md](file:///e:/code/study/prep-month/interview/framework/react-native/07-react-native-storage-and-networking.md) | MMKV (JSI synchronous) vs AsyncStorage, WatermelonDB, SQLite, iOS Keychain & Android Keystore, SSL Pinning, Offline-first sync |
| **08** | **Native Modules & Codegen** | [08-react-native-native-modules-and-codegen.md](file:///e:/code/study/prep-month/interview/framework/react-native/08-react-native-native-modules-and-codegen.md) | Writing TurboModules from scratch with TypeScript Codegen, Kotlin (Android), Swift/Obj-C++ (iOS), Custom Fabric UI Components |
| **09** | **Android Internals** | [09-android-internals-for-react-native.md](file:///e:/code/study/prep-month/interview/framework/react-native/09-android-internals-for-react-native.md) | Application & Activity lifecycle, AndroidManifest.xml, Gradle build system, ProGuard & R8 reflection rules, Headless JS, Android 13/14+ permissions |
| **10** | **iOS Internals** | [10-ios-internals-for-react-native.md](file:///e:/code/study/prep-month/interview/framework/react-native/10-ios-internals-for-react-native.md) | `AppDelegate.mm`, CocoaPods (`.xcworkspace`, `use_frameworks!`), Info.plist permissions, Code Signing (Certificates, Provisioning Profiles), Privacy Manifests |
| **11** | **Build, Deploy & CI/CD** | [11-build-deploy-and-ci-cd.md](file:///e:/code/study/prep-month/interview/framework/react-native/11-build-deploy-and-ci-cd.md) | Android Keystore & signed AAB, iOS Xcode Archive & IPA, Fastlane (`match`, `gym`, `supply`), Over-The-Air (OTA) updates (EAS / CodePush), GitHub Actions |
| **12** | **Debugging & Troubleshooting** | [12-debugging-profiling-and-troubleshooting.md](file:///e:/code/study/prep-month/interview/framework/react-native/12-debugging-profiling-and-troubleshooting.md) | Flipper, Chrome DevTools, Hermes CPU Profiler, Xcode Instruments, Android Studio Profiler, Memory Leaks, ANRs, dSYM & ProGuard symbolication |

---

## 🎯 Architecture Summary
- **12 Comprehensive Specialized Guides** covering every layer from JS runtime to native OS internals.
- Code examples in **TypeScript, Kotlin, Swift, Objective-C++, C++, Groovy Gradle, and Ruby Fastlane**.
- Real-world production engineering practices for enterprise mobile applications.

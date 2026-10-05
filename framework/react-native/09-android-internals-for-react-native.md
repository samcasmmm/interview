# 🤖 Android Internals for React Native Developers

> Comprehensive deep-dive into Android engineering for React Native developers: Application & Activity lifecycles, AndroidManifest configuration, Gradle build system & dependencies, ProGuard & R8 obfuscation, Foreground Services, Headless JS, WorkManager, and Android 13/14+ runtime permissions.

---

## 📑 Table of Contents
1. [Android Core Architecture: Application vs Activity](#1-android-core-architecture-application-vs-activity)
2. [The Activity Lifecycle in React Native](#2-the-activity-lifecycle-in-react-native)
3. [AndroidManifest.xml Configuration Deep-Dive](#3-androidmanifestxml-configuration-deep-dive)
4. [Gradle Build System: Project vs App Gradle & Autolinking](#4-gradle-build-system-project-vs-app-gradle--autolinking)
5. [Code Shrinking & Obfuscation: ProGuard & R8 Rules](#5-code-shrinking--obfuscation-proguard--r8-rules)
6. [Background Execution: Services, WorkManager & Headless JS](#6-background-execution-services-workmanager--headless-js)
7. [Modern Android Requirements: Android 13/14+ API Changes](#7-modern-android-requirements-android-1314-api-changes)

---

## 1. Android Core Architecture: Application vs Activity

In React Native Android apps:
- **`MainApplication.kt`**: Extends `android.app.Application`.
  - The entry point for the entire OS process.
  - Instantiates `ReactNativeHost`, configures the JavaScript engine (Hermes), and registers autolinked package lists.
  - Runs once when the app process is created.
- **`MainActivity.kt`**: Extends `com.facebook.react.ReactActivity`.
  - The UI window hosting the native `ReactRootView`.
  - Maps to the React component registered via `AppRegistry.registerComponent('AppName', () => App)`.

---

## 2. The Activity Lifecycle in React Native

```
            +--------------------+
            |     onCreate()     |  <- Activity created; ReactRootView attached
            +---------┬----------+
                      ▼
            +--------------------+
            |     onStart()      |  <- Activity becomes visible
            +---------┬----------+
                      ▼
            +--------------------+
     ┌─────>|     onResume()     |  <- AppState becomes 'active'; JS resumed
     │      +---------┬----------+
     │                ▼
     │      +--------------------+
     │      |     onPause()      |  <- Interrupted (incoming call); AppState 'inactive'
     │      +---------┬----------+
     │                ▼
     │      +--------------------+
     └──────|      onStop()      |  <- Minimized; AppState 'background'
            +---------┬----------+
                      ▼
            +--------------------+
            |    onDestroy()     |  <- Process terminated / React context destroyed
            +--------------------+
```

---

## 3. AndroidManifest.xml Configuration Deep-Dive

Located at `android/app/src/main/AndroidManifest.xml`:

```xml
<manifest xmlns:android="http://schemas.android.com/apk/res/android"
    package="com.myapp">

    <!-- Normal & Runtime Permissions -->
    <uses-permission android:name="android.permission.INTERNET" />
    <uses-permission android:name="android.permission.CAMERA" />
    <uses-permission android:name="android.permission.POST_NOTIFICATIONS" /> <!-- Android 13+ -->

    <application
      android:name=".MainApplication"
      android:label="@string/app_name"
      android:icon="@mipmap/ic_launcher"
      android:allowBackup="false"
      android:theme="@style/AppTheme">

      <activity
        android:name=".MainActivity"
        android:exported="true"
        android:launchMode="singleTask" <!-- Prevents duplicate activity instances on deep links -->
        android:windowSoftInputMode="adjustResize" <!-- Keyboard resizes UI smoothly -->
        android:configChanges="keyboard|keyboardHidden|orientation|screenSize|screenLayout|uiMode">

        <intent-filter>
            <action android:name="android.intent.action.MAIN" />
            <category android:name="android.intent.category.LAUNCHER" />
        </intent-filter>

        <!-- Deep Link Intent Filter (myapp://) -->
        <intent-filter>
            <action android:name="android.intent.action.VIEW" />
            <category android:name="android.intent.category.DEFAULT" />
            <category android:name="android.intent.category.BROWSABLE" />
            <data android:scheme="myapp" android:host="details" />
        </intent-filter>
      </activity>
    </application>
</manifest>
```

---

## 4. Gradle Build System: Project vs App Gradle & Autolinking

### Structure:
1. **`android/settings.gradle`**: Configures plugins and includes native library paths via `@react-native/gradle-plugin` autolinking.
2. **`android/build.gradle` (Project-level)**: Defines repositories (Google Maven, Maven Central) and Kotlin/Gradle build tools versions.
3. **`android/app/build.gradle` (App-level)**:
   - `compileSdk`: Target API used to compile Java/Kotlin code (e.g. 34).
   - `minSdkVersion`: Minimum Android OS version supported (e.g. 24 for Android 7.0).
   - `targetSdkVersion`: Informs Android OS of the exact behavior your app was tested against.
   - `dependencies`: Lists native libraries and third-party SDKs.

---

## 5. Code Shrinking & Obfuscation: ProGuard & R8 Rules

### What is R8?
R8 is Android's default code shrinker:
- **Tree-Shaking**: Discards unused Java classes and methods.
- **Obfuscation**: Renames classes and methods to short unreadable names (`a.b.c()`).

### The Danger with React Native:
React Native’s bridge and JSI rely on **Java Reflection** to discover Native Module methods by name (e.g. `@ReactMethod`). If R8 renames or strips these methods, the app compiles fine but **crashes immediately at runtime**!

### Adding Rules in `android/app/proguard-rules.pro`:
```pro
# Keep React Native classes and reflection methods
-keepclassmembers class * {
    @com.facebook.react.uimanager.annotations.ReactProp <methods>;
}
-keep class com.facebook.react.** { *; }

# Keep your custom native modules
-keep class com.myapp.nativemodules.** { *; }
```

---

## 6. Background Execution: Services, WorkManager & Headless JS

Android aggressively kills background apps to conserve battery.

### 1. Headless JS (`AppRegistry.registerHeadlessTask`)
Allows running JavaScript tasks in the background without launching any Android UI (e.g. handling silent Firebase push notifications, location updates).

```javascript
// index.js
import { AppRegistry } from 'react-native';

const BackgroundTask = async (data) => {
  console.log('Received background push event:', data);
  // Perform network sync...
};

AppRegistry.registerHeadlessTask('BackgroundTaskKey', () => BackgroundTask);
```

### 2. Android Foreground Service
A native service that displays a persistent, non-dismissible notification in the status bar (e.g. Spotify music playing, Uber driver GPS navigation). The OS guarantees this service will not be killed by battery optimizations.

---

## 7. Modern Android Requirements: Android 13/14+ API Changes

1. **Android 13 (API 33) Notification Permission**:
   - `android.permission.POST_NOTIFICATIONS` is now a dangerous runtime permission; apps must prompt users before sending push notifications.
2. **Photo Picker**:
   - Replaces broad `READ_EXTERNAL_STORAGE` permission with granular photo selection.
3. **Android 14 (API 34) Foreground Service Types**:
   - Requires declaring exact foreground service types (`camera`, `location`, `dataSync`) in the manifest.

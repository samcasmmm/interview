# 📱 React Native Native Modules, TurboModules & Codegen

> Complete step-by-step engineering guide to extending React Native: Legacy Bridge vs TurboModules, TypeScript Codegen specifications, building custom TurboModules in Kotlin and Swift, building custom Fabric UI Components, and writing pure C++ JSI modules.

---

## 📑 Table of Contents
1. [Legacy Native Modules vs New Architecture TurboModules](#1-legacy-native-modules-vs-new-architecture-turbomodules)
2. [Step-by-Step: Writing a TurboModule with Codegen](#2-step-by-step-writing-a-turbomodule-with-codegen)
3. [Android Implementation in Kotlin](#3-android-implementation-in-kotlin)
4. [iOS Implementation in Swift / Objective-C++](#4-ios-implementation-in-swift--objective-c)
5. [Building a Custom Fabric Native UI Component](#5-building-a-custom-fabric-native-ui-component)
6. [Emitting Native Platform Events to JavaScript](#6-emitting-native-platform-events-to-javascript)

---

## 1. Legacy Native Modules vs New Architecture TurboModules

```
+-----------------------------------------------------------------------------------+
|                         LEGACY NATIVE MODULE FLOW                                 |
|                                                                                   |
|  JavaScript Call  ----->  JSON.stringify()  ----->  Queue over Bridge  ----->     |
|  JSON.parse()     ----->  Java / Obj-C Native Execution                           |
+-----------------------------------------------------------------------------------+

+-----------------------------------------------------------------------------------+
|                         TURBOMODULE JSI FLOW                                      |
|                                                                                   |
|  JavaScript Call  =====>  Direct C++ Pointer (JSI)  =====>  Kotlin / Swift        |
|  (Zero JSON Serialization, Synchronous or Async, Lazy-Loaded on Demand)           |
+-----------------------------------------------------------------------------------+
```

---

## 2. Step-by-Step: Writing a TurboModule with Codegen

### Step 1: Define TypeScript Specification File
Create `specs/NativeDeviceInfo.ts`:
```typescript
import { TurboModule, TurboModuleRegistry } from 'react-native';

export interface Spec extends TurboModule {
  getBatteryLevel(): Promise<number>;
  getDeviceModel(): string; // Synchronous JSI call!
}

export default TurboModuleRegistry.getEnforcing<Spec>('NativeDeviceInfo');
```

### Step 2: Configure `package.json` for Codegen
```json
{
  "name": "react-native-device-info",
  "codegenConfig": {
    "name": "NativeDeviceInfoSpec",
    "type": "modules",
    "jsTransforms": true
  }
}
```

---

## 3. Android Implementation in Kotlin

Codegen automatically generates an abstract base class `NativeDeviceInfoSpec`. Implement it in Kotlin:

```kotlin
// android/src/main/java/com/deviceinfo/NativeDeviceInfoModule.kt
package com.deviceinfo

import android.os.BatteryManager
import android.content.Context
import android.os.Build
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext

class NativeDeviceInfoModule(reactContext: ReactApplicationContext) : NativeDeviceInfoSpec(reactContext) {

  override fun getName(): String {
    return "NativeDeviceInfo"
  }

  // Synchronous method via JSI
  override fun getDeviceModel(): String {
    return Build.MODEL ?: "Unknown"
  }

  // Asynchronous method via Promise
  override fun getBatteryLevel(promise: Promise) {
    try {
      val batteryManager = reactApplicationContext.getSystemService(Context.BATTERY_SERVICE) as BatteryManager
      val level = batteryManager.getIntProperty(BatteryManager.BATTERY_PROPERTY_CAPACITY)
      promise.resolve(level)
    } catch (e: Exception) {
      promise.reject("BATTERY_ERROR", e.message)
    }
  }
}
```

---

## 4. iOS Implementation in Swift / Objective-C++

Codegen generates the C++ protocol `NativeDeviceInfoSpec.h`.

#### Objective-C++ Header (`NativeDeviceInfo.h`):
```objc
#import <React/RCTBridgeModule.h>
#import <NativeDeviceInfoSpec/NativeDeviceInfoSpec.h>

@interface NativeDeviceInfo : NSObject <NativeDeviceInfoSpec>
@end
```

#### Objective-C++ Implementation (`NativeDeviceInfo.mm`):
```objc
#import "NativeDeviceInfo.h"
#import <UIKit/UIKit.h>

@implementation NativeDeviceInfo
RCT_EXPORT_MODULE()

- (NSString *)getDeviceModel {
  return [[UIDevice currentDevice] model];
}

- (void)getBatteryLevel:(RCTPromiseResolveBlock)resolve reject:(RCTPromiseRejectBlock)reject {
  [[UIDevice currentDevice] setBatteryMonitoringEnabled:YES];
  float level = [[UIDevice currentDevice] batteryLevel];
  resolve(@(level * 100));
}

- (std::shared_ptr<facebook::react::TurboModule>)getTurboModule:
    (const facebook::react::TurboModulePerfLogger::Options &)options {
  return std::make_shared<facebook::react::NativeDeviceInfoSpecJSI>(options);
}

@end
```

---

## 5. Building a Custom Fabric Native UI Component

A Fabric Component renders a native platform view (e.g., native PDF viewer, video player, camera preview) managed by Fabric's C++ shadow tree.

### TypeScript Component Specification:
```typescript
import codegenNativeComponent from 'react-native/Libraries/Utilities/codegenNativeComponent';
import type { ViewProps } from 'react-native';

interface NativeCustomVideoProps extends ViewProps {
  videoUrl: string;
  autoPlay: boolean;
  onPlaybackComplete?: (event: { nativeEvent: { duration: number } }) => void;
}

export default codegenNativeComponent<NativeCustomVideoProps>('NativeCustomVideo');
```

---

## 6. Emitting Native Platform Events to JavaScript

When the native OS needs to send asynchronous alerts (e.g. incoming call, Bluetooth device discovered), use `RCTDeviceEventEmitter`:

```typescript
// JavaScript consumer:
import { NativeEventEmitter, NativeModules } from 'react-native';

const eventEmitter = new NativeEventEmitter(NativeModules.BluetoothScanner);
const subscription = eventEmitter.addListener('onDeviceFound', (device) => {
  console.log('Discovered device:', device.name);
});
```

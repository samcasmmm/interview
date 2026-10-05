# 🍎 iOS Internals for React Native Developers

> Comprehensive guide to iOS native engineering for React Native: AppDelegate lifecycle, CocoaPods vs SPM, Info.plist configurations, Code Signing (Certificates, Provisioning Profiles), Capabilities & Entitlements, and Apple Privacy Manifests (`PrivacyInfo.xcprivacy`).

---

## 📑 Table of Contents
1. [iOS Architecture: `AppDelegate.mm`, RootViewController & UIWindow](#1-ios-architecture-appdelegatemm-rootviewcontroller--uiwindow)
2. [CocoaPods Deep-Dive: `.xcodeproj` vs `.xcworkspace` & `use_frameworks!`](#2-cocoapods-deep-dive-xcodeproj-vs-xcworkspace--use_frameworks)
3. [Info.plist: Privacy Permissions & App Transport Security (ATS)](#3-infoplist-privacy-permissions--app-transport-security-ats)
4. [iOS Code Signing: Certificates, App IDs & Provisioning Profiles](#4-ios-code-signing-certificates-app-ids--provisioning-profiles)
5. [Capabilities & Entitlements (Push Notifications, Universal Links)](#5-capabilities--entitlements-push-notifications-universal-links)
6. [Apple Privacy Manifests (`PrivacyInfo.xcprivacy`) & SDK Signatures](#6-apple-privacy-manifests-privacyinfoxcprivacy--sdk-signatures)

---

## 1. iOS Architecture: `AppDelegate.mm`, RootViewController & UIWindow

In iOS, the native entry point is managed by `ios/AppName/AppDelegate.mm`:
- **`didFinishLaunchingWithOptions`**: Initializes the React Native runtime, instantiates the `RCTBridge` (or `RCTHost` in Bridgeless Mode), creates the root `UIViewController`, and sets it as the root of the `UIWindow`.
- **`openURL`**: Intercepts custom URL scheme deep links (`myapp://`).
- **`continueUserActivity`**: Intercepts iOS **Universal Links** (`https://myapp.com`) and Handoff events.

#### Example `AppDelegate.mm` Setup:
```objc
#import "AppDelegate.h"
#import <React/RCTBundleURLProvider.h>
#import <React/RCTLinkingManager.h>

@implementation AppDelegate

- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions {
  self.moduleName = @"MyApp";
  self.initialProps = @{};
  return [super application:application didFinishLaunchingWithOptions:launchOptions];
}

// Deep Linking Handler
- (BOOL)application:(UIApplication *)app openURL:(NSURL *)url options:(NSDictionary<UIApplicationOpenURLOptionsKey,id> *)options {
  return [RCTLinkingManager application:app openURL:url options:options];
}

// Universal Links Handler
- (BOOL)application:(UIApplication *)application continueUserActivity:(nonnull NSUserActivity *)userActivity restorationHandler:(nonnull void (^)(NSArray<id<UIUserActivityRestoring>> * _Nullable))restorationHandler {
  return [RCTLinkingManager application:application continueUserActivity:userActivity restorationHandler:restorationHandler];
}

@end
```

---

## 2. CocoaPods Deep-Dive: `.xcodeproj` vs `.xcworkspace` & `use_frameworks!`

### Why You Must ALWAYS Open `.xcworkspace`
- **`.xcodeproj`**: Contains only your primary app project files.
- **`.xcworkspace`**: A multi-project container that bundles your primary app project alongside the **Pods project** (all third-party React Native native libraries). Opening `.xcodeproj` directly results in build errors: `React/RCTBridge.h file not found`.

### `use_frameworks! :linkage => :static`
In modern React Native with Swift libraries:
- CocoaPods traditionally links libraries as static C/C++ libraries (`.a`).
- Swift libraries often require modular frameworks (`.framework`). Setting static linkage in `ios/Podfile` ensures compatibility without breaking C++ header imports in Hermes and Fabric.

---

## 3. Info.plist: Privacy Permissions & App Transport Security (ATS)

Located at `ios/AppName/Info.plist`:

### 1. Mandatory Privacy Strings
Apple’s App Store review team **instantly rejects** any app binary requesting hardware access without user-facing explanation strings:
```xml
<key>NSCameraUsageDescription</key>
<string>This app requires access to your camera to scan QR codes for login.</string>
<key>NSPhotoLibraryUsageDescription</key>
<string>This app requires access to your photo library to select a profile picture.</string>
```

### 2. App Transport Security (ATS)
By default, iOS blocks all unencrypted HTTP connections (`http://`). For development, local IP exceptions are allowed:
```xml
<key>NSAppTransportSecurity</key>
<dict>
    <key>NSAllowsArbitraryLoads</key>
    <false/> <!-- Never set true in production! -->
    <key>NSExceptionDomains</key>
    <dict>
        <key>localhost</key>
        <dict>
            <key>NSExceptionAllowsInsecureHTTPLoads</key>
            <true/>
        </dict>
    </dict>
</dict>
```

---

## 4. iOS Code Signing: Certificates, App IDs & Provisioning Profiles

To install an app on a physical iOS device or submit to TestFlight, Apple requires a **Cryptographic Chain of Trust**:

```
+-----------------------------------------------------------------------------------+
|                        APPLE CODE SIGNING TRIANGLE                                |
|                                                                                   |
|           1. Certificate (.p12 / Apple Developer)                                |
|              - Proves WHO YOU ARE (Developer or Distribution identity)           |
|                                     │                                             |
|                                     ▼                                             |
|           2. App ID (e.g. com.company.myapp)                                      |
|              - Unique bundle identifier + enabled capabilities                    |
|                                     │                                             |
|                                     ▼                                             |
|           3. Provisioning Profile (.mobileprovision)                              |
|              - Glues Certificate + App ID + Registered Test Device UDIDs         |
+-----------------------------------------------------------------------------------+
```

- **Development Profile**: Allows installing on registered developer devices for debugging.
- **App Store Profile**: Signed with a Distribution Certificate, used exclusively for TestFlight and App Store submission.

---

## 5. Capabilities & Entitlements (Push Notifications, Universal Links)

Configured in `ios/AppName/AppName.entitlements`:
```xml
<dict>
    <!-- Push Notifications -->
    <key>aps-environment</key>
    <string>production</string>

    <!-- Universal Links (Associated Domains) -->
    <key>com.apple.developer.associated-domains</key>
    <array>
        <string>applinks:myapp.com</string>
    </array>
</dict>
```

---

## 6. Apple Privacy Manifests (`PrivacyInfo.xcprivacy`) & SDK Signatures

Starting Spring 2024, Apple requires all iOS apps and third-party SDKs to include a **Privacy Manifest (`PrivacyInfo.xcprivacy`)**.

### Required Declarations:
1. **Required Reason APIs**: If your app or any dependency accesses system APIs like `UserDefaults`, file modification timestamps, disk space, or system boot time, you must declare an approved reason code.
2. **Data Collected**: Contact info, identifiers, financial data.
3. **Tracking Domains**: Domains used for user tracking (requires App Tracking Transparency permission).

# 🚀 React Native Build, Deployment & CI/CD Pipelines

> Production-grade release engineering guide: Android Keystore & App Bundles (AAB), iOS Xcode Archive & IPAs, Fastlane automation (`match`, `gym`, `supply`), Over-The-Air (OTA) updates (EAS / CodePush), and automated GitHub Actions CI/CD workflows.

---

## 📑 Table of Contents
1. [Android Production Release: Keystore & Android App Bundle (AAB)](#1-android-production-release-keystore--android-app-bundle-aab)
2. [iOS Production Release: Xcode Archive & IPA Generation](#2-ios-production-release-xcode-archive--ipa-generation)
3. [Fastlane Automation: Complete Fastfile Architecture](#3-fastlane-automation-complete-fastfile-architecture)
4. [Certificate Management with `fastlane match`](#4-certificate-management-with-fastlane-match)
5. [Over-The-Air (OTA) Updates: CodePush & EAS Update](#5-over-the-air-ota-updates-codepush--eas-update)
6. [Complete GitHub Actions Mobile CI/CD Pipeline](#6-complete-github-actions-mobile-cicd-pipeline)

---

## 1. Android Production Release: Keystore & Android App Bundle (AAB)

Google Play requires the **Android App Bundle (.aab)** format instead of legacy `.apk`. Google Play generates device-specific optimized APKs containing only the user's specific screen density and CPU architecture (arm64-v8a vs armeabi-v7a).

### Step 1: Generate Cryptographic Signing Keystore
```bash
keytool -genkeypair -v -storetype PKCS12 -keystore release.keystore \
  -alias my-key-alias -keyalg RSA -keysize 2048 -validity 10000
```

### Step 2: Configure Gradle Signing in `android/app/build.gradle`
```groovy
android {
    signingConfigs {
        release {
            if (project.hasProperty('MYAPP_UPLOAD_STORE_FILE')) {
                storeFile file(MYAPP_UPLOAD_STORE_FILE)
                storePassword MYAPP_UPLOAD_STORE_PASSWORD
                keyAlias MYAPP_UPLOAD_KEY_ALIAS
                keyPassword MYAPP_UPLOAD_KEY_PASSWORD
            }
        }
    }
    buildTypes {
        release {
            signingConfig signingConfigs.release
            minifyEnabled true
            shrinkResources true
            proguardFiles getDefaultProguardFile("proguard-android.txt"), "proguard-rules.pro"
        }
    }
}
```

### Step 3: Compile Signed Release Bundle
```bash
cd android && ./gradlew bundleRelease
# Output generated at: android/app/build/outputs/bundle/release/app-release.aab
```

---

## 2. iOS Production Release: Xcode Archive & IPA Generation

### Command-Line Archive & Export via `xcodebuild`:
```bash
# 1. Create Archive
xcodebuild -workspace ios/MyApp.xcworkspace \
  -scheme MyApp \
  -configuration Release \
  -archivePath build/MyApp.xcarchive \
  archive

# 2. Export signed IPA
xcodebuild -exportArchive \
  -archivePath build/MyApp.xcarchive \
  -exportOptionsPlist ios/ExportOptions.plist \
  -exportPath build/
```

---

## 3. Fastlane Automation: Complete Fastfile Architecture

Fastlane eliminates manual builds and uploads by automating the entire lifecycle in Ruby scripts.

#### `fastlane/Fastfile`:
```ruby
default_platform(:ios)

platform :ios do
  desc "Push a new beta build to TestFlight"
  lane :beta do
    setup_ci if is_ci
    match(type: "appstore", readonly: is_ci)
    cocoapods(podfile: "ios/Podfile")
    increment_build_number(xcodeproj: "ios/MyApp.xcodeproj")
    gym(
      workspace: "ios/MyApp.xcworkspace",
      scheme: "MyApp",
      export_method: "app-store"
    )
    upload_to_testflight(skip_waiting_for_build_processing: true)
  end
end

platform :android do
  desc "Deploy a new version to the Google Play Internal Track"
  lane :internal do
    gradle(
      task: "bundleRelease",
      project_dir: "android/"
    )
    upload_to_play_store(
      track: "internal",
      release_status: "draft",
      aab: "android/app/build/outputs/bundle/release/app-release.aab"
    )
  end
end
```

---

## 4. Certificate Management with `fastlane match`

**The Pain**: In iOS engineering, developers frequently break provisioning profiles by clicking "Fix Issue" in Xcode, revoking certificates for the entire team.

### The Solution: `match`
- `fastlane match` stores all iOS certificates and provisioning profiles in an encrypted private Git repository (encrypted via OpenSSL with a team passphrase).
- Any developer or CI server runs `fastlane match development --readonly` and immediately syncs valid provisioning profiles in seconds.

---

## 5. Over-The-Air (OTA) Updates: CodePush & EAS Update

**Over-The-Air (OTA) Updates** allow pushing bug fixes and UI updates directly to user devices within seconds, bypassing the 24–48 hour Apple and Google store review queues.

### How OTA Works:
1. Metro compiles the updated JavaScript bundle (`index.android.bundle`) and static assets (images).
2. The bundle is uploaded to the OTA CDN (EAS Update / CodePush).
3. The native app checks for updates on startup, downloads the new JS bundle in the background, and applies it on the next app restart.

### ⚠️ The Golden Rule of OTA Updates:
OTA updates **CANNOT modify native code**.
- Allowed: JavaScript components, styling, logic, images, Redux/Zustand state changes.
- FORBIDDEN: Adding native packages (`npm install react-native-camera`), altering `AndroidManifest.xml`, modifying `Podfile`, or changing native SDK versions. Attempting to push native changes via OTA will immediately crash the application for all users!

---

## 6. Complete GitHub Actions Mobile CI/CD Pipeline

```yaml
name: Deploy Mobile Beta
on:
  push:
    branches: [main]

jobs:
  build-android:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: 20, cache: 'npm' }
      - uses: actions/setup-java@v4
        with: { distribution: 'zulu', java-version: 17 }

      - name: Install Dependencies
        run: npm ci

      - name: Build & Publish Android Internal Track
        env:
          MYAPP_UPLOAD_STORE_PASSWORD: ${{ secrets.KEYSTORE_PASSWORD }}
          SUPPLY_JSON_KEY_DATA: ${{ secrets.GOOGLE_PLAY_SERVICE_ACCOUNT_JSON }}
        run: |
          bundle install
          bundle exec fastlane android internal
```

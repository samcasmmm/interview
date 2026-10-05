# 📱 React Native UI Components, Styling & Layout

> Complete guide covering core native primitives, StyleSheet optimizations, responsive layouts, Safe Area management, keyboard avoidance, accessibility (a11y), dark mode theming, and SVG rendering.

---

## 📑 Table of Contents
1. [Core UI Primitives vs Web Equivalents](#1-core-ui-primitives-vs-web-equivalents)
2. [StyleSheet.create() Internals & Optimization](#2-stylesheetcreate-internals--optimization)
3. [Responsive Layouts: Dimensions vs useWindowDimensions](#3-responsive-layouts-dimensions-vs-usewindowdimensions)
4. [Safe Area Handling (Notches & Dynamic Island)](#4-safe-area-handling-notches--dynamic-island)
5. [Keyboard Avoidance & Keyboard Controller](#5-keyboard-avoidance--keyboard-controller)
6. [Mobile Accessibility (VoiceOver & TalkBack)](#6-mobile-accessibility-voiceover--talkback)
7. [System Theming & Dynamic Dark Mode](#7-system-theming--dynamic-dark-mode)
8. [SVG Rendering & Vector Icons](#8-svg-rendering--vector-icons)

---

## 1. Core UI Primitives vs Web Equivalents

In React Native, you cannot use HTML tags (`<div>`, `<p>`, `<span>`, `<button>`). Instead, React Native provides native primitives mapped directly to platform widgets:

| React Native Primitive | Web Equivalent | Android Native Widget | iOS Native Widget |
| :--- | :--- | :--- | :--- |
| `<View>` | `<div>` | `android.view.ViewGroup` | `UIView` |
| `<Text>` | `<p>`, `<span>` | `android.widget.TextView` | `UILabel` / `UITextView` |
| `<Image>` | `<img>` | `android.widget.ImageView` | `UIImageView` |
| `<TextInput>` | `<input type="text">` | `android.widget.EditText` | `UITextField` |
| `<ScrollView>` | `<div style="overflow:scroll">` | `android.widget.ScrollView` | `UIScrollView` |
| `<Pressable>` | `<button>` | `ViewGroup` with touch listener | `UIControl` / `UIButton` |
| `<Modal>` | `<dialog>` | `android.app.Dialog` | `UIViewController` modal |

### Critical Rule for `<Text>`
In React Native, raw string literals **MUST ALWAYS** be wrapped inside a `<Text>` component. Placing naked text inside a `<View>` causes a fatal native crash:
```tsx
// FATAL CRASH:
// <View>Hello World</View>

// CORRECT:
<View>
  <Text>Hello World</Text>
</View>
```

---

## 2. StyleSheet.create() Internals & Optimization

### Why use `StyleSheet.create()` instead of inline style objects?
1. **Memory Efficiency**: In the old architecture, `StyleSheet.create()` registers style definitions in an internal cache and replaces the object with an integer ID. Instead of transferring a heavy JS object across the bridge on every render, it only transfers an integer ID.
2. **Compile-Time Validation**: Validates style property names and values, throwing clear errors if invalid CSS properties are used (e.g. `display: block` which does not exist in React Native).
3. **No Per-Render Object Allocation**: Avoids creating new JavaScript object instances on every component re-render, reducing Garbage Collection pressure.

#### Example:
```tsx
import { StyleSheet, View, Text } from 'react-native';

export function Card({ title }: { title: string }) {
  return (
    <View style={styles.cardContainer}>
      <Text style={styles.cardTitle}>{title}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  cardContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginVertical: 8,
    // Native shadow properties:
    elevation: 4, // Android Material Elevation
    shadowColor: '#000', // iOS Shadow
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1a1a1a',
  },
});
```

---

## 3. Responsive Layouts: Dimensions vs useWindowDimensions

### Why prefer `useWindowDimensions()` over `Dimensions.get()`?
- `Dimensions.get('window')` returns static dimensions captured at the moment of evaluation. It **does not trigger component re-renders** when screen orientation changes, split-screen mode is toggled, or foldable devices unfold.
- `useWindowDimensions()` is a modern React Hook that automatically subscribes to window dimension changes and re-renders components with updated `width`, `height`, `scale`, and `fontScale`.

#### Example:
```tsx
import { useWindowDimensions, View, Text, StyleSheet } from 'react-native';

export function ResponsiveGrid() {
  const { width, height } = useWindowDimensions();
  const isLandscape = width > height;
  const numColumns = isLandscape ? 3 : 1;

  return (
    <View style={[styles.container, { flexDirection: isLandscape ? 'row' : 'column' }]}>
      <Text>Screen Width: {Math.round(width)}px</Text>
      <Text>Orientation: {isLandscape ? 'Landscape' : 'Portrait'}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
});
```

---

## 4. Safe Area Handling (Notches & Dynamic Island)

Modern mobile devices feature camera cutouts, notches, dynamic islands, and home indicator bars at the bottom. Writing UI without safe area boundaries causes content to be clipped behind the status bar or notch.

### The Standard: `react-native-safe-area-context`
Always use `react-native-safe-area-context` over the deprecated native `<SafeAreaView>`.

#### Example:
```tsx
import { SafeAreaProvider, useSafeAreaInsets } from 'react-native-safe-area-context';
import { View, Text } from 'react-native';

function MainScreen() {
  const insets = useSafeAreaInsets();

  return (
    <View style={{
      flex: 1,
      paddingTop: insets.top,       // Clear status bar / notch
      paddingBottom: insets.bottom, // Clear iOS home indicator bar
      paddingLeft: insets.left,
      paddingRight: insets.right,
    }}>
      <Text>Safe Area Protected Content</Text>
    </View>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <MainScreen />
    </SafeAreaProvider>
  );
}
```

---

## 5. Keyboard Avoidance & Keyboard Controller

When an input is focused, the virtual software keyboard slides up, often obstructing input fields.

### Approaches:
1. **`<KeyboardAvoidingView>` (Built-in)**:
   - Behavior options: `behavior={Platform.OS === 'ios' ? 'padding' : 'height'}`.
   - Simple, but often suffers from layout glitches and jerky animations on Android.
2. **`react-native-keyboard-controller` (Modern Standard)**:
   - Uses native WindowInsets on Android and Keyboard Layout Guides on iOS.
   - Synchronizes keyboard animations 1:1 with 60fps/120fps gesture transitions.

#### Example:
```tsx
import { KeyboardAvoidingView, Platform, StyleSheet, TextInput, View } from 'react-native';

export function LoginForm() {
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}
    >
      <View style={styles.inner}>
        <TextInput placeholder="Email" style={styles.input} />
        <TextInput placeholder="Password" secureTextEntry style={styles.input} />
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  inner: { flex: 1, justifyContent: 'flex-end', padding: 24 },
  input: { height: 48, borderColor: '#ccc', borderWidth: 1, marginBottom: 12, paddingHorizontal: 12 },
});
```

---

## 6. Mobile Accessibility (VoiceOver & TalkBack)

Mobile accessibility ensures visually impaired users can navigate via Apple VoiceOver and Android TalkBack:
- `accessible={true}`: Groups children into a single selectable accessibility element.
- `accessibilityLabel="string"`: Reads out a descriptive label for screen readers.
- `accessibilityHint="string"`: Explains what happens when interacting with the element.
- `accessibilityRole="button" | "header" | "link"`: Tells the user the component type.

#### Example:
```tsx
import { Pressable, Text, StyleSheet } from 'react-native';

export function AccessibleDeleteButton({ onDelete }: { onDelete: () => void }) {
  return (
    <Pressable
      accessible={true}
      accessibilityRole="button"
      accessibilityLabel="Delete item"
      accessibilityHint="Double tap to permanently remove this item from your cart"
      onPress={onDelete}
      style={styles.button}
    >
      <Text style={styles.btnText}>Delete</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: { backgroundColor: '#e53935', padding: 12, borderRadius: 8 },
  btnText: { color: '#fff', fontWeight: 'bold' },
});
```

---

## 7. System Theming & Dynamic Dark Mode

Use `useColorScheme()` from `react-native` to detect whether the user has enabled Light or Dark Mode at the OS level:

#### Example:
```tsx
import { useColorScheme, View, Text, StyleSheet } from 'react-native';

export function ThemedView() {
  const theme = useColorScheme(); // 'light' | 'dark' | null
  const isDark = theme === 'dark';

  return (
    <View style={[styles.container, { backgroundColor: isDark ? '#121212' : '#ffffff' }]}>
      <Text style={{ color: isDark ? '#ffffff' : '#000000' }}>
        Current Theme: {theme}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center' },
});
```

---

## 8. SVG Rendering & Vector Icons

React Native does not support inline `<svg>` elements out of the box.
- Use **`react-native-svg`** to render vector graphics.
- Use **`react-native-vector-icons`** or **`@expo/vector-icons`** for pre-bundled icon sets (Ionicons, MaterialIcons, Feather).
- Use `react-native-svg-transformer` to import `.svg` files directly as React components:
  ```tsx
  import Logo from './assets/logo.svg';
  <Logo width={120} height={40} fill="#007AFF" />
  ```

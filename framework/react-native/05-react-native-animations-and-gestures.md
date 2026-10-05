# 📱 React Native Animations, Gestures & Skia

> Comprehensive guide on 60fps/120fps mobile animations: Built-in `Animated` API with `useNativeDriver`, React Native Reanimated 3 Worklets, Gesture Handler v2, Layout & Shared Element Transitions, and React Native Skia GPU canvas rendering.

---

## 📑 Table of Contents
1. [Built-in `Animated` API & The `useNativeDriver` Constraint](#1-built-in-animated-api--the-usenativedriver-constraint)
2. [React Native Reanimated 3: Architecture & Worklets](#2-react-native-reanimated-3-architecture--worklets)
3. [Core Reanimated Primitives: `useSharedValue` & `useAnimatedStyle`](#3-core-reanimated-primitives-usesharedvalue--useanimatedstyle)
4. [React Native Gesture Handler v2 (`GestureDetector`)](#4-react-native-gesture-handler-v2-gesturedetector)
5. [Layout Animations & Shared Element Transitions](#5-layout-animations--shared-element-transitions)
6. [React Native Skia: 2D GPU Canvas Rendering](#6-react-native-skia-2d-gpu-canvas-rendering)
7. [Building a 60fps Swipeable Card with Reanimated & Gestures](#7-building-a-60fps-swipeable-card-with-reanimated--gestures)

---

## 1. Built-in `Animated` API & The `useNativeDriver` Constraint

React Native provides a built-in `Animated` library:
- **`useNativeDriver: false`**: The animation calculates step values on the **JavaScript Thread** and sends updated values across the bridge to the native thread on every single frame (16ms). If the JS thread blocks, the animation stutters.
- **`useNativeDriver: true`**: The JS thread sends the complete animation description to the **Native UI Thread once**. The native platform driver executes the animation directly at 60/120fps without crossing the bridge.

### The Critical Limitation of `useNativeDriver: true`:
Native driver **ONLY** supports non-layout properties:
- Supported: `transform` (`translateX`, `translateY`, `scale`, `rotate`), `opacity`.
- NOT Supported: `width`, `height`, `top`, `left`, `backgroundColor`, `flex`, `padding`. (Attempting to animate these with `useNativeDriver: true` throws a runtime crash).

---

## 2. React Native Reanimated 3: Architecture & Worklets

### What is a Worklet?
A **Worklet** is a tiny JavaScript function marked with the `'worklet'` directive that is extracted by the Babel/Metro plugin and compiled to run inside a **separate secondary JavaScript runtime on the Native UI Thread**.

```
    JavaScript Main Thread                     Native UI Thread (Worklet Runtime)
  +-------------------------+                 +-----------------------------------+
  | React Component State   |                 | Shared Values (useSharedValue)    |
  | Business Logic          |                 | Gesture Handler Callbacks         |
  | Network / DB queries    |                 | 60fps / 120fps Frame Calculations |
  +-------------------------+                 +-----------------------------------+
```

### Why Reanimated 3 Dominates Mobile Development:
1. **Zero Bridge Crossing**: Gestures and animations calculate their frame interpolations directly on the UI thread. Even if the JS thread is 100% frozen, animations remain silky smooth at 60/120fps.
2. **Animates Any Style Property**: Unlike the native driver, Reanimated can animate colors, widths, heights, border radiuses, and SVG paths.

---

## 3. Core Reanimated Primitives: `useSharedValue` & `useAnimatedStyle`

- **`useSharedValue(initialValue)`**: Allocates a mutable reference readable and writable on both the JS thread and the UI Worklet runtime without triggering React re-renders.
- **`useAnimatedStyle(() => { 'worklet'; return { ... }; })`**: Creates an animated style object that automatically updates when any referenced shared value changes.
- **Animation Helpers**: `withSpring()`, `withTiming()`, `withSequence()`, `withRepeat()`.

#### Example: Spring Button Animation:
```tsx
import React from 'react';
import { Pressable, StyleSheet } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated';

export function BouncyButton({ children }: { children: React.ReactNode }) {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = () => {
    scale.value = withSpring(0.9, { damping: 10, stiffness: 300 });
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, { damping: 10, stiffness: 300 });
  };

  return (
    <Pressable onPressIn={handlePressIn} onPressOut={handlePressOut}>
      <Animated.View style={[styles.btn, animatedStyle]}>
        {children}
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  btn: { padding: 16, backgroundColor: '#007AFF', borderRadius: 12 },
});
```

---

## 4. React Native Gesture Handler v2 (`GestureDetector`)

React Native’s built-in touch system (`PanResponder`) relies on passing touch events back and forth across the bridge.
**`react-native-gesture-handler`** maps directly to native platform gesture recognizers (`UIPanGestureRecognizer` on iOS, Android touch subsystem).

#### Chaining Gestures with `Gesture.Pan()`:
```tsx
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, { useSharedValue, useAnimatedStyle, withDecay } from 'react-native-reanimated';

export function DraggableBox() {
  const offset = useSharedValue(0);

  const panGesture = Gesture.Pan()
    .onChange((event) => {
      offset.value += event.changeX; // Runs on UI thread
    })
    .onEnd((event) => {
      offset.value = withDecay({ velocity: event.velocityX });
    });

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: offset.value }],
  }));

  return (
    <GestureDetector gesture={panGesture}>
      <Animated.View style={[{ width: 100, height: 100, backgroundColor: 'tomato' }, animatedStyle]} />
    </GestureDetector>
  );
}
```

---

## 5. Layout Animations & Shared Element Transitions

Reanimated provides native layout transition modifiers that animate elements when they mount, unmount, or change position in a list:

- **`entering`**: `FadeIn`, `SlideInDown`, `ZoomIn`
- **`exiting`**: `FadeOut`, `SlideOutUp`, `ZoomOut`
- **`layout`**: `LinearTransition.springify()` (animates remaining list items when an item is deleted)

#### Example:
```tsx
import Animated, { FadeIn, SlideOutRight, LinearTransition } from 'react-native-reanimated';

<Animated.View
  entering={FadeIn.duration(400)}
  exiting={SlideOutRight.duration(300)}
  layout={LinearTransition.springify()}
  style={styles.card}
>
  <Text>Animated Item</Text>
</Animated.View>
```

---

## 6. React Native Skia: 2D GPU Canvas Rendering

**React Native Skia** (`@shopify/react-native-skia`) brings Google's Skia 2D graphics engine (the same engine powering Chrome, Android, and Flutter) directly into React Native via C++ JSI:
- Direct GPU hardware-accelerated drawing.
- Supports custom GLSL fragment shaders, path morphing, complex particle systems, glassmorphism filters, and charts.

#### Example: Skia Gradient Circle:
```tsx
import { Canvas, Circle, RadialGradient, vec } from '@shopify/react-native-skia';

export function GlowingOrb() {
  return (
    <Canvas style={{ width: 256, height: 256 }}>
      <Circle cx={128} cy={128} r={100}>
        <RadialGradient
          c={vec(128, 128)}
          r={100}
          colors={['#ff007a', '#7928ca', '#000000']}
        />
      </Circle>
    </Canvas>
  );
}
```

---

## 7. Building a 60fps Swipeable Card with Reanimated & Gestures

```tsx
import React from 'react';
import { StyleSheet, Dimensions } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  runOnJS,
} from 'react-native-reanimated';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const SWIPE_THRESHOLD = SCREEN_WIDTH * 0.3;

export function SwipeableCard({ onDismiss }: { onDismiss: () => void }) {
  const translateX = useSharedValue(0);

  const panGesture = Gesture.Pan()
    .onUpdate((event) => {
      translateX.value = event.translationX;
    })
    .onEnd(() => {
      if (Math.abs(translateX.value) > SWIPE_THRESHOLD) {
        translateX.value = withSpring(Math.sign(translateX.value) * SCREEN_WIDTH * 1.5, {}, () => {
          runOnJS(onDismiss)(); // Bridge back to JS thread to delete item
        });
      } else {
        translateX.value = withSpring(0);
      }
    });

  const cardStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  return (
    <GestureDetector gesture={panGesture}>
      <Animated.View style={[styles.card, cardStyle]} />
    </GestureDetector>
  );
}

const styles = StyleSheet.create({
  card: { height: 100, backgroundColor: '#4CAF50', borderRadius: 16, margin: 16 },
});
```

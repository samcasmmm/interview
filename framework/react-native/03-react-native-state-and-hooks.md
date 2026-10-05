# 📱 React Native State Management, Hooks & Lifecycle

> Deep-dive guide covering mobile application state lifecycles (`AppState`, `BackHandler`), React 18/19 concurrent hooks on mobile, state management architecture (Zustand vs Redux Toolkit vs Jotai), Context API performance traps, and offline-first server state with TanStack Query.

---

## 📑 Table of Contents
1. [Mobile Application Lifecycle (`AppState`)](#1-mobile-application-lifecycle-appstate)
2. [Hardware Back Button Handling on Android (`BackHandler`)](#2-hardware-back-button-handling-on-android-backhandler)
3. [React Concurrent Hooks in React Native (`useTransition`, `useDeferredValue`)](#3-react-concurrent-hooks-in-react-native-usetransition-usedeferredvalue)
4. [State Management Architecture: Zustand vs Redux Toolkit](#4-state-management-architecture-zustand-vs-redux-toolkit)
5. [Context API Performance Pitfalls on Mobile](#5-context-api-performance-pitfalls-on-mobile)
6. [Server State & Offline Caching with TanStack Query](#6-server-state--offline-caching-with-tanstack-query)
7. [Production Custom Hooks: Network & Device Sensors](#7-production-custom-hooks-network--device-sensors)

---

## 1. Mobile Application Lifecycle (`AppState`)

Mobile apps do not behave like browser tabs. The operating system actively suspends or terminates apps in the background to preserve battery life and RAM.
- **`AppState`** provides the current execution state of the app:
  - `'active'`: App is running in the foreground and interactive.
  - `'background'`: App is minimized or user is on home screen / another app.
  - `'inactive'` (iOS only): App is transitioning between foreground and background (e.g. Notification Center pulled down, incoming phone call, app switcher open).

#### Example: Refreshing data when returning from background:
```tsx
import { useEffect, useRef } from 'react';
import { AppState, AppStateStatus } from 'react-native';

export function useOnAppForeground(onForeground: () => void) {
  const appState = useRef<AppStateStatus>(AppState.currentState);

  useEffect(() => {
    const subscription = AppState.addEventListener('change', (nextAppState) => {
      // Transition from background/inactive to active
      if (
        appState.current.match(/inactive|background/) &&
        nextAppState === 'active'
      ) {
        console.log('App has come to the foreground!');
        onForeground();
      }
      appState.current = nextAppState;
    });

    return () => subscription.remove();
  }, [onForeground]);
}
```

---

## 2. Hardware Back Button Handling on Android (`BackHandler`)

Android devices feature hardware or gestural "Back" buttons. In React Native, the `BackHandler` API intercepts this event.
- Return `true` in the event callback to **consume the event** (prevent the app from exiting or navigating back).
- Return `false` to let the default OS action occur (navigate back or exit app).

#### Example: Custom back press confirmation dialog:
```tsx
import { useEffect } from 'react';
import { BackHandler, Alert } from 'react-native';

export function useAndroidBackConfirm(isDirty: boolean) {
  useEffect(() => {
    const backAction = () => {
      if (!isDirty) return false; // Default back navigation

      Alert.alert('Discard Changes?', 'You have unsaved changes. Exit anyway?', [
        { text: 'Cancel', onPress: () => null, style: 'cancel' },
        { text: 'Discard', onPress: () => BackHandler.exitApp() },
      ]);
      return true; // Prevents default exit
    };

    const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction);
    return () => backHandler.remove();
  }, [isDirty]);
}
```

---

## 3. React Concurrent Hooks in React Native (`useTransition`, `useDeferredValue`)

React 18 Concurrent Mode features are critical on mobile devices with constrained CPU power:
- **`useTransition`**: Splits state updates into **Urgent** (touch feedback, typing) vs **Non-Urgent / Transition** (filtering 10,000 list items). If a user taps during a transition, the UI responds immediately without dropping frames.
- **`useDeferredValue`**: Defers updating a non-critical portion of the UI until higher-priority renders have completed.

#### Example:
```tsx
import { useState, useTransition } from 'react';
import { TextInput, View, Text } from 'react-native';

export function FilterableList({ allItems }: { allItems: string[] }) {
  const [query, setQuery] = useState('');
  const [filtered, setFiltered] = useState(allItems);
  const [isPending, startTransition] = useTransition();

  const handleSearch = (text: string) => {
    setQuery(text); // Urgent: Keep typing responsive!

    startTransition(() => {
      // Non-urgent: Computationally intensive list filtering
      const result = allItems.filter((item) =>
        item.toLowerCase().includes(text.toLowerCase())
      );
      setFiltered(result);
    });
  };

  return (
    <View>
      <TextInput value={query} onChangeText={handleSearch} placeholder="Search..." />
      {isPending && <Text>Filtering results...</Text>}
      {/* List rendering */}
    </View>
  );
}
```

---

## 4. State Management Architecture: Zustand vs Redux Toolkit

### Why is Zustand heavily favored in modern React Native?
1. **Zero Boilerplate**: No actions, reducers, or dispatch wrappers needed.
2. **Minimal Bundle Footprint**: ~1KB compared to Redux Toolkit (~12KB).
3. **Atomic State Subscriptions**: Components only re-render if the **exact selector value** changes, avoiding list frame drops.
4. **Direct Outside-React Access**: Can read and mutate state inside asynchronous background services, socket listeners, and interceptors without React hooks (`useStore.getState()`).

#### Zustand Store Example:
```tsx
// store/cartStore.ts
import { create } from 'zustand';

interface CartItem { id: string; name: string; price: number; }

interface CartState {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  clearCart: () => void;
  totalPrice: () => number;
}

export const useCartStore = create<CartState>((set, get) => ({
  items: [],
  addItem: (item) => set((state) => ({ items: [...state.items, item] })),
  clearCart: () => set({ items: [] }),
  totalPrice: () => get().items.reduce((sum, item) => sum + item.price, 0),
}));

// Component usage:
export function CartBadge() {
  // Only re-renders when items.length changes!
  const count = useCartStore((state) => state.items.length);
  return <Text>Items: {count}</Text>;
}
```

---

## 5. Context API Performance Pitfalls on Mobile

### Why Context API Kills Mobile Performance
When a React Context value updates, **every single component that calls `useContext(MyContext)` is forced to re-render**, even if it only consumes an unrelated property of that context! On low-end Android devices, this triggers massive frame rate drops down to 15–20 fps during animations.

### Best Practices:
1. **Split Contexts**: Never create a monolithic `AppContext`. Separate `AuthContext`, `ThemeContext`, and `UserPreferencesContext`.
2. **Separate State and Dispatch**: Put state in `StateContext` and mutation functions in `DispatchContext`. Components that only trigger actions won't re-render on state changes.
3. Use specialized state libraries (Zustand, Jotai) for high-frequency updates.

---

## 6. Server State & Offline Caching with TanStack Query

Mobile apps deal with intermittent network drops (tunnels, elevators, roaming). **TanStack Query (React Query)** provides mobile-optimized data fetching:
- **Offline Cache Persistence**: Persist query cache to disk using `MMKV` or `AsyncStorage`.
- **Refetch on App Foreground**: Automatically syncs stale queries when `AppState` changes back to `active`.
- **Automatic Exponential Retries**: Retries network calls when connectivity is restored.

#### Setup with React Native AppState:
```tsx
import { AppState, Platform } from 'react-native';
import { focusManager, QueryClient, QueryClientProvider } from '@tanstack/react-query';

// Configure TanStack Query to listen to mobile AppState:
focusManager.setEventListener((handleFocus) => {
  const subscription = AppState.addEventListener('change', (status) => {
    if (Platform.OS !== 'web') {
      focusManager.setFocused(status === 'active');
    }
  });
  return () => subscription.remove();
});

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      staleTime: 1000 * 60 * 5, // 5 minutes
    },
  },
});
```

---

## 7. Production Custom Hooks: Network & Device Sensors

#### Custom Hook: Online Network Connectivity
```tsx
import { useState, useEffect } from 'react';
import NetInfo from '@react-native-community/netinfo';

export function useIsOnline() {
  const [isOnline, setIsOnline] = useState<boolean>(true);

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state) => {
      setIsOnline(Boolean(state.isConnected && state.isInternetReachable !== false));
    });
    return () => unsubscribe();
  }, []);

  return isOnline;
}
```

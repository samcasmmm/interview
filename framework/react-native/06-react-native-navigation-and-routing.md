# 📱 React Native Navigation & Deep Linking

> Comprehensive guide covering React Navigation v6/v7 (`@react-navigation/native-stack` vs JS Stack), Nested Navigators, Deep Linking (Custom Schemes vs Universal Links vs Android App Links), Expo Router file-system routing, and Navigation State Persistence.

---

## 📑 Table of Contents
1. [React Navigation Architecture: Native Stack vs JS Stack](#1-react-navigation-architecture-native-stack-vs-js-stack)
2. [Structuring Complex Nested Navigators (Tabs, Drawers, Stacks)](#2-structuring-complex-nested-navigators-tabs-drawers-stacks)
3. [Deep Linking: Custom Schemes vs App Links vs Universal Links](#3-deep-linking-custom-schemes-vs-app-links-vs-universal-links)
4. [Handling Cold-Start vs Warm-Start Deep Links](#4-handling-cold-start-vs-warm-start-deep-links)
5. [Expo Router: File-System Based Native Routing](#5-expo-router-file-system-based-native-routing)
6. [Persisting Navigation State across App Reloads](#6-persisting-navigation-state-across-app-reloads)

---

## 1. React Navigation Architecture: Native Stack vs JS Stack

React Navigation provides two distinct stack navigator implementations:

| Dimension | `@react-navigation/native-stack` | `@react-navigation/stack` |
| :--- | :--- | :--- |
| **Underlying Mechanism** | Platform native widgets (`UINavigationController` on iOS, `Fragment` on Android) via `react-native-screens` | Pure JavaScript animated `View` layers |
| **Performance** | Native 60/120fps transitions, native memory management | Can drop frames if JS thread is under heavy load |
| **Native Gestures** | Native interactive swipe-to-back gesture (iOS) | JS simulated gesture |
| **Customizability** | Constrained to native OS platform capabilities | Highly customizable animations |
| **Recommendation** | **Industry Standard** for 95% of applications | Specialized custom animations only |

---

## 2. Structuring Complex Nested Navigators (Tabs, Drawers, Stacks)

### Standard Enterprise Pattern:
- **Root Navigator**: Native Stack
  - `(AuthGroup)`: Login, Register, ForgotPassword
  - `(AppGroup)`: BottomTabNavigator
    - `Tab 1 (FeedStack)`
    - `Tab 2 (SearchStack)`
    - `Tab 3 (ProfileStack)`
  - `(ModalGroup)`: Full-screen Modals (Settings, Checkout)

#### TypeScript Typed Navigation Pattern:
```tsx
import { createNativeStackNavigator, NativeStackScreenProps } from '@react-navigation/native-stack';

export type RootStackParamList = {
  Home: undefined;
  ProductDetails: { productId: string; title: string };
  CheckoutModal: { cartId: string };
};

export type ProductDetailsProps = NativeStackScreenProps<RootStackParamList, 'ProductDetails'>;

const Stack = createNativeStackNavigator<RootStackParamList>();

export function RootNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerBackTitleVisible: false }}>
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="ProductDetails" component={ProductDetailsScreen} />
      <Stack.Group screenOptions={{ presentation: 'modal' }}>
        <Stack.Screen name="CheckoutModal" component={CheckoutModalScreen} />
      </Stack.Group>
    </Stack.Navigator>
  );
}
```

---

## 3. Deep Linking: Custom Schemes vs App Links vs Universal Links

```
+-----------------------------------------------------------------------------------------+
|                                    DEEP LINK TYPES                                      |
|                                                                                         |
|  1. Custom URL Scheme: myapp://product/123                                              |
|     - Unverified. Any malicious app can register myapp:// and intercept intents.       |
|     - Browser prompts: "Open in My App?"                                                |
|                                                                                         |
|  2. Android App Links: https://myapp.com/product/123                                    |
|     - Verified cryptographically via assetlinks.json on your domain.                    |
|     - Opens app directly with NO disambiguation dialog.                                 |
|                                                                                         |
|  3. iOS Universal Links: https://myapp.com/product/123                                  |
|     - Verified cryptographically via apple-app-site-association (AASA) file.            |
|     - Seamlessly transitions from Safari to Native App without redirects.               |
+-----------------------------------------------------------------------------------------+
```

---

## 4. Handling Cold-Start vs Warm-Start Deep Links

- **Cold-Start**: The app was completely terminated. The user taps a link $\rightarrow$ OS boots the app $\rightarrow$ `Linking.getInitialURL()` retrieves the intent.
- **Warm-Start**: The app was already running in the background $\rightarrow$ `Linking.addEventListener('url', handler)` receives the incoming intent.

#### React Navigation Configuration:
```tsx
import { NavigationContainer, LinkingOptions } from '@react-navigation/native';

const linking: LinkingOptions<RootStackParamList> = {
  prefixes: ['myapp://', 'https://myapp.com'],
  config: {
    screens: {
      Home: 'home',
      ProductDetails: 'product/:productId',
      CheckoutModal: 'checkout/:cartId',
    },
  },
};

export default function App() {
  return (
    <NavigationContainer linking={linking} fallback={<LoadingSpinner />}>
      <RootNavigator />
    </NavigationContainer>
  );
}
```

---

## 5. Expo Router: File-System Based Native Routing

Inspired by Next.js, **Expo Router** brings file-based routing to React Native:
- `app/index.tsx` $\rightarrow$ `/`
- `app/settings.tsx` $\rightarrow$ `/settings`
- `app/user/[id].tsx` $\rightarrow$ `/user/123`
- `app/(tabs)/_layout.tsx` $\rightarrow$ Bottom tab configuration

```tsx
// app/user/[id].tsx
import { useLocalSearchParams } from 'expo-router';
import { View, Text } from 'react-native';

export default function UserScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  return (
    <View>
      <Text>User Profile ID: {id}</Text>
    </View>
  );
}
```

---

## 6. Persisting Navigation State across App Reloads

During local development or when Android kills background activities to reclaim memory, persisting navigation state restores the user to their exact screen.

```tsx
import { MMKV } from 'react-native-mmkv';

const storage = new MMKV();
const NAV_STATE_KEY = 'PERSISTED_NAV_STATE';

<NavigationContainer
  initialState={JSON.parse(storage.getString(NAV_STATE_KEY) || 'null')}
  onStateChange={(state) => storage.set(NAV_STATE_KEY, JSON.stringify(state))}
>
  <RootNavigator />
</NavigationContainer>
```

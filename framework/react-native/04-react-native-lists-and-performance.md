# 📱 React Native List Virtualization & UI Performance

> Comprehensive guide on high-performance mobile lists: ScrollView vs FlatList vs SectionList, FlatList tuning props (`windowSize`, `getItemLayout`, `removeClippedSubviews`), Shopify FlashList cell recycling, inline allocation pitfalls, and eliminating blank areas during rapid flings.

---

## 📑 Table of Contents
1. [ScrollView vs FlatList vs SectionList vs VirtualizedList](#1-scrollview-vs-flatlist-vs-sectionlist-vs-virtualizedlist)
2. [How FlatList Virtualization Works under the Hood](#2-how-flatlist-virtualization-works-under-the-hood)
3. [The Critical FlatList Optimization Props Deep-Dive](#3-the-critical-flatlist-optimization-props-deep-dive)
4. [Shopify FlashList: The Cell Recycling Revolution](#4-shopify-flashlist-the-cell-recycling-revolution)
5. [Anti-Patterns: Inline Objects, Functions & Render Cascades](#5-anti-patterns-inline-objects-functions--render-cascades)
6. [Eliminating Blank White Spaces During Fast Scrolling](#6-eliminating-blank-white-spaces-during-fast-scrolling)
7. [Profiling Mobile FPS & Dropped Frames](#7-profiling-mobile-fps--dropped-frames)

---

## 1. ScrollView vs FlatList vs SectionList vs VirtualizedList

| Component | Rendering Behavior | Memory Usage | Best For |
| :--- | :--- | :--- | :--- |
| **`<ScrollView>`** | Renders **all** children into memory immediately, even off-screen items | $O(N)$ memory — crashes if $N > 100$ | Small static screens (settings, forms, < 30 items) |
| **`<FlatList>`** | **Virtualizes** elements: unmounts off-screen rows outside the render window | $O(1)$ bounded memory | Dynamic, homogeneous lists (hundreds of items) |
| **`<SectionList>`** | Virtualized list with sticky section headers | Bounded memory | Grouped data (contacts A–Z, categorical feeds) |
| **`<VirtualizedList>`** | Low-level base component for FlatList/SectionList | Bounded memory | Custom non-array data structures |

---

## 2. How FlatList Virtualization Works under the Hood

`FlatList` does not render all items into the native view hierarchy. Instead:
1. It maintains a **Render Window** extending a configurable number of viewports above and below the visible screen.
2. Items entering the render window are mounted and rendered.
3. Items leaving the render window are unmounted and replaced with empty spacer views (`View` with calculated height) to maintain scroll offset.

```
       +-------------------------------+
       |       Unmounted Spacer        |  <- Outside Window (Unmounted from DOM)
       +-------------------------------+
       |                               |
       |     Render Window Buffer      |  <- windowSize pre-rendered
       |                               |
  ═════╪═══════════════════════════════╪═════  <- Top of Visible Screen
  ║    |                               |    ║
  ║    |    VISIBLE VIEWPORT (Screen)  |    ║  <- Actively visible to user
  ║    |                               |    ║
  ═════╪═══════════════════════════════╪═════  <- Bottom of Visible Screen
       |                               |
       |     Render Window Buffer      |  <- windowSize pre-rendered
       |                               |
       +-------------------------------+
       |       Unmounted Spacer        |  <- Outside Window
       +-------------------------------+
```

---

## 3. The Critical FlatList Optimization Props Deep-Dive

### 1. `getItemLayout` (The Single Most Effective Optimization)
By default, FlatList must dynamically measure the pixel height of every item on the layout thread as it scrolls.
- If item height is fixed (e.g. 80px), passing `getItemLayout` **completely skips layout measurement**, enabling instantaneous programmatic scrolling (`scrollToIndex`) without stuttering.

```tsx
const ITEM_HEIGHT = 80;

<FlatList
  data={data}
  renderItem={renderItem}
  getItemLayout={(data, index) => ({
    length: ITEM_HEIGHT,
    offset: ITEM_HEIGHT * index,
    index,
  })}
/>
```

### 2. `windowSize`
Defines the measurement unit for the render window (number of viewports). Default is `21` (10 screens above, 1 visible screen, 10 screens below).
- **On low-end Android**: Reduce to `5` or `7` (2 above, 1 visible, 2 below) to slash memory consumption by 60%.

### 3. `maxToRenderPerBatch`
The maximum number of items rendered in each incremental batch per scroll tick. Default is `10`. Lower numbers (e.g. `5`) prevent the JS thread from locking up during fast flings.

### 4. `initialNumToRender`
The exact number of items rendered on the very first frame. Match this to the exact number of items that fit on screen (e.g. `6`–`8`) to optimize Time-To-Interactive (TTI).

### 5. `removeClippedSubviews={true}`
Native memory optimization: detaches off-screen native views from the native parent window, drastically reducing native GPU memory on Android.

---

## 4. Shopify FlashList: The Cell Recycling Revolution

While `FlatList` unmounts off-screen components and creates brand new ones, **FlashList** (by Shopify) introduces **View Recycling** (similar to Android's `RecyclerView` and iOS's `UICollectionView`).

### How Cell Recycling Works
- FlashList creates a fixed pool of native views (e.g. 15 views).
- When Item #1 scrolls off the top of the screen, its native view is **recycled** and re-used for Item #16 appearing at the bottom.
- React does not unmount or re-create DOM nodes; it simply re-binds the new item props to the existing view, yielding:
  - Up to **10x higher FPS**.
  - Up to **70% less memory usage**.
  - Zero blank white spaces during fast scrolls.

#### FlashList Implementation:
```tsx
import { FlashList } from '@shopify/flash-list';
import React, { memo } from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface Message { id: string; sender: string; body: string; }

const MessageRow = memo(({ message }: { message: Message }) => {
  return (
    <View style={styles.row}>
      <Text style={styles.sender}>{message.sender}</Text>
      <Text style={styles.body}>{message.body}</Text>
    </View>
  );
});

export function ChatList({ messages }: { messages: Message[] }) {
  return (
    <FlashList
      data={messages}
      renderItem={({ item }) => <MessageRow message={item} />}
      estimatedItemSize={72} // Mandatory: exact or average row height
      keyExtractor={(item) => item.id}
    />
  );
}

const styles = StyleSheet.create({
  row: { height: 72, padding: 12, borderBottomWidth: 1, borderColor: '#eee' },
  sender: { fontWeight: 'bold' },
  body: { color: '#666' },
});
```

---

## 5. Anti-Patterns: Inline Objects, Functions & Render Cascades

### ❌ Anti-Pattern 1: Inline Arrow Functions in `renderItem`
```tsx
// BAD: Creates a new function instance on every parent re-render!
<FlatList
  data={data}
  renderItem={({ item }) => <UserItem item={item} onPress={() => selectUser(item.id)} />}
/>
```
### ✅ Optimized Pattern:
```tsx
// GOOD: Stable useCallback reference
const renderItem = useCallback(({ item }: { item: User }) => {
  return <UserItem item={item} onSelect={selectUser} />;
}, [selectUser]);

<FlatList data={data} renderItem={renderItem} />
```

### ❌ Anti-Pattern 2: Unstable `keyExtractor`
Never use array index as keys (`(item, index) => index.toString()`). If an item is inserted or deleted, React cannot track item identity, forcing all downstream rows to re-render. Always use stable unique database IDs (`item.id`).

---

## 6. Eliminating Blank White Spaces During Fast Scrolling

### Why Blank Spaces Occur:
The native UI thread scrolls the list physically at 60fps/120fps. If the JavaScript thread is busy parsing JSON, processing state, or allocating objects, it fails to send new row layout instructions to the native layer in time. The native scroll view continues moving, exposing un-rendered blank area.

### Fix Checklist:
1. Wrap list row components in `React.memo` with custom comparison function.
2. Provide exact `getItemLayout` or `estimatedItemSize` (FlashList).
3. Offload heavy computation from the JS thread.
4. Reduce `windowSize` to lessen off-screen memory pressure.
5. Replace `FlatList` with `FlashList`.

---

## 7. Profiling Mobile FPS & Dropped Frames

### Measuring Performance:
1. **In-App Performance Monitor**: In React Native Dev Menu, toggle **"Show Perf Monitor"**:
   - **UI FPS**: Measures native UI thread smoothness (Target: 60 or 120 FPS).
   - **JS FPS**: Measures JavaScript thread responsiveness (If JS drops to 0–10 FPS, UI cannot respond to new touches).
2. **Flipper / React DevTools Profiler**:
   - Record component render durations.
   - Filter by "Why did this component render?" to eliminate unnecessary row re-renders.

# 📱 React Native Storage, Databases & Networking

> Deep dive into mobile storage engines (MMKV vs AsyncStorage), embedded databases (WatermelonDB, SQLite), hardware-backed secure storage (iOS Keychain & Android Keystore), SSL Pinning, and Offline-First synchronization.

---

## 📑 Table of Contents
1. [Key-Value Storage: MMKV vs AsyncStorage](#1-key-value-storage-mmkv-vs-asyncstorage)
2. [Embedded Mobile Databases: SQLite vs WatermelonDB vs Realm](#2-embedded-mobile-databases-sqlite-vs-watermelondb-vs-realm)
3. [Secure Credential Storage: iOS Keychain & Android Keystore](#3-secure-credential-storage-ios-keychain--android-keystore)
4. [Mobile Networking: Axios vs Fetch & NetInfo](#4-mobile-networking-axios-vs-fetch--netinfo)
5. [SSL Pinning & Preventing Man-In-The-Middle (MITM) Attacks](#5-ssl-pinning--preventing-man-in-the-middle-mitm-attacks)
6. [Offline-First Architecture & Optimistic Synchronization](#6-offline-first-architecture--optimistic-synchronization)

---

## 1. Key-Value Storage: MMKV vs AsyncStorage

| Feature | `AsyncStorage` | `react-native-mmkv` |
| :--- | :--- | :--- |
| **Architecture** | Asynchronous JSON Bridge calls | Direct C++ JSI bindings |
| **Storage Engine** | SQLite (Android) / Serialized files (iOS) | Memory-mapped files (`mmap`) by Tencent |
| **Execution** | Strictly Asynchronous (`await storage.getItem()`) | **Synchronous** (`storage.getString()`) |
| **Performance** | ~20–50ms read latency | **< 0.1ms (up to 30x faster)** |
| **Encryption** | Requires manual crypto layers | Native AES-128 encryption built-in |

### Why MMKV is the Modern Standard:
Because MMKV reads synchronously via JSI, you can read theme preferences, auth tokens, and language settings **during the very first frame render**, completely eliminating UI flashes during app startup.

#### MMKV Example:
```tsx
import { MMKV } from 'react-native-mmkv';

export const storage = new MMKV({
  id: 'user-storage',
  encryptionKey: 'super-secret-key-123',
});

// Synchronous Fast Operations:
storage.set('user.name', 'Alice');
storage.set('user.age', 28);
storage.set('user.isPremium', true);

const name = storage.getString('user.name'); // Instant!
const isPremium = storage.getBoolean('user.isPremium');
```

---

## 2. Embedded Mobile Databases: SQLite vs WatermelonDB vs Realm

When your mobile app must store thousands of offline records (chat messages, product catalogs, offline audio tracks), key-value stores fail.

1. **`react-native-quick-sqlite`**:
   - Uses JSI to bind SQLite directly into JavaScript.
   - Ideal for developers comfortable writing raw SQL queries.
2. **WatermelonDB**:
   - Built specifically for high-scale React Native apps (scales to 100,000+ records).
   - **Lazy Loading**: Only loads records actively displayed on the screen.
   - **Observable**: Components automatically re-render when queried database rows mutate.

---

## 3. Secure Credential Storage: iOS Keychain & Android Keystore

Never store JWT access tokens, refresh tokens, passwords, or credit card numbers in plaintext in `AsyncStorage` or unencrypted `MMKV` because attackers can extract them from jailbroken devices or unencrypted backups.

- **iOS Keychain**: Hardware-backed encrypted database protected by the Apple Secure Enclave.
- **Android Keystore**: Uses Hardware-backed Keymaster / StrongBox to generate and store cryptographic keys, encrypting data stored in `EncryptedSharedPreferences`.

#### Implementation via `react-native-keychain`:
```tsx
import * as Keychain from 'react-native-keychain';

// Save JWT securely
export async function saveAuthTokens(username: string, jwtToken: string) {
  await Keychain.setGenericPassword(username, jwtToken, {
    accessible: Keychain.ACCESSIBLE.WHEN_UNLOCKED_THIS_DEVICE_ONLY,
    securityLevel: Keychain.SECURITY_LEVEL.SECURE_HARDWARE,
  });
}

// Retrieve JWT securely
export async function getAuthToken(): Promise<string | null> {
  const credentials = await Keychain.getGenericPassword();
  return credentials ? credentials.password : null;
}
```

---

## 4. Mobile Networking: Axios vs Fetch & NetInfo

Mobile networking must handle rapid drops and reconnects:
```tsx
import axios from 'axios';
import NetInfo from '@react-native-community/netinfo';

const apiClient = axios.create({
  baseURL: 'https://api.production.com/v1',
  timeout: 10000, // 10s timeout
});

apiClient.interceptors.request.use(async (config) => {
  const network = await NetInfo.fetch();
  if (!network.isConnected) {
    throw new Error('NETWORK_OFFLINE');
  }
  return config;
});
```

---

## 5. SSL Pinning & Preventing Man-In-The-Middle (MITM) Attacks

On rooted Android or jailbroken iOS devices, attackers can install custom CA certificates and use proxy tools (Charles, Proxyman, Wireshark) to inspect all HTTPS network traffic, stealing passwords and API keys.

### SSL Pinning Solution:
SSL Pinning bundles the server’s exact **public key certificate hash (SHA-256)** directly inside the mobile app binary.
- During the TLS handshake, the native app rejects the connection if the server’s certificate does not match the hardcoded pinned hash, rendering MITM proxies useless.
- Implemented via `react-native-ssl-pinning` or native network configs.

---

## 6. Offline-First Architecture & Optimistic Synchronization

In offline-first apps:
1. User creates a message while in airplane mode.
2. The message is immediately saved to the local SQLite/MMKV database and assigned a status of `'pending'`.
3. The UI updates optimistically with a gray clock icon.
4. When `NetInfo` reports network restoration, an **Offline Sync Queue Worker** reads all `'pending'` records and dispatches them sequentially to the backend server.

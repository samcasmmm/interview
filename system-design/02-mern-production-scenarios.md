# 🎯 MERN & PERN Production Scenario-Based Interview Master Guide (35 Real-World Scenarios)

> A comprehensive, battle-tested scenario guide for **Full-Stack MERN/PERN Engineers (3+ to 6+ Years Experience)** covering real production incident debugging, performance bottlenecks, race conditions, auth failures, database lockups, and distributed architecture trade-offs.

---

## 📑 Table of Contents

- [1. Authentication, Security & Cross-Origin Issues (Q1–Q7)](#1-authentication-security--cross-origin-issues)
- [2. Performance, Caching & Database Bottlenecks (Q8–Q15)](#2-performance-caching--database-bottlenecks)
- [3. Concurrency, Race Conditions & Distributed Systems (Q16–Q22)](#3-concurrency-race-conditions--distributed-systems)
- [4. Background Jobs, Queues & Real-Time Sync (Q23–Q28)](#4-background-jobs-queues--real-time-sync)
- [5. React & Frontend State Debugging (Q29–Q35)](#5-react--frontend-state-debugging)

---

# 🛠️ Real-World Production Scenarios

---

### 1. Authentication, Security & Cross-Origin Issues

#### 1. A login works perfectly in localhost development but fails in production (cookies not persisting / 401 Unauthorized). How do you diagnose and fix it?
- **Root Causes**:
  1. **`SameSite` & `Secure` Flag Mismatch**: In production (HTTPS across subdomains like `api.example.com` and `app.example.com`), `SameSite: 'None'` requires `Secure: true`. Without HTTPS or proper flags, modern browsers block third-party/cross-site cookies.
  2. **Missing `cors` Credentials**: Express CORS config missing `credentials: true` or `origin` set to wildcard `*` (browsers disallow credentials with `*`).
  3. **Proxy Headers Dropped**: Behind Nginx / AWS ALB, `req.secure` is `false` unless `app.set('trust proxy', 1)` is enabled in Express.

```javascript
// ✅ Production-Ready Express Cookie & CORS Configuration
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';

const app = express();

// 1. Trust Reverse Proxy (Nginx / CloudFront / ALB)
app.set('trust proxy', 1);

// 2. Exact Origin with Credentials
app.use(cors({
  origin: process.env.CLIENT_URL, // e.g. 'https://app.example.com' (Never '*')
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
}));

app.use(cookieParser());

// 3. Set Secure HTTP-Only Cookie
app.post('/api/auth/login', async (req, res) => {
  const { accessToken, refreshToken } = await authenticateUser(req.body);

  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,                                       // Prevent XSS access
    secure: process.env.NODE_ENV === 'production',        // HTTPS only
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
    domain: process.env.NODE_ENV === 'production' ? '.example.com' : undefined,
    maxAge: 7 * 24 * 60 * 60 * 1000,                      // 7 days
  });

  res.json({ success: true, accessToken });
});
```

---

#### 2. An API call succeeds in Postman but fails with CORS errors in Chrome/Safari. What is happening?
- **Why Postman succeeds**: Postman is a backend HTTP client without a browser security sandbox; it does not enforce the **Same-Origin Policy (SOP)** and does not issue **CORS Preflight (`OPTIONS`)** requests.
- **Why Browser fails**:
  - The frontend made a non-simple request (e.g., custom `Authorization: Bearer ...` header, `Content-Type: application/json`, or `PUT/DELETE` methods).
  - Browser sent an `OPTIONS` preflight request, but the server either did not handle `OPTIONS`, returned a non-200/204 status, or missed `Access-Control-Allow-Headers: Authorization, Content-Type`.
- **Diagnosis**: Inspect Network tab $\rightarrow$ Check the red `OPTIONS` request headers and response status.

---

#### 3. A tenant or user can see another customer's invoice or profile by manipulating IDs in the URL (`/api/invoices/105` $\rightarrow$ `/api/invoices/106`). How do you fix IDOR (Insecure Direct Object Reference)?
- **Root Cause**: The backend queried `SELECT * FROM invoices WHERE id = $1` without scoping the query to the authenticated `user_id` or `tenant_id`.
- **Fix**:
  1. Never trust user-supplied primary keys in isolation.
  2. Always scope queries to `req.user.id` or `req.user.tenantId`.
  3. Use non-sequential **UUIDv4** or **ULID** instead of auto-incrementing integers (`1, 2, 3...`) to prevent enumeration attacks.
  4. In PostgreSQL, enforce **Row-Level Security (RLS)** at the database engine level.

```javascript
// ❌ Vulnerable to IDOR
app.get('/api/invoices/:id', async (req, res) => {
  const invoice = await db.query('SELECT * FROM invoices WHERE id = $1', [req.params.id]);
  res.json(invoice.rows[0]);
});

// ✅ Secure: Ownership verified in database query
app.get('/api/invoices/:id', authenticateToken, async (req, res) => {
  const invoice = await db.query(
    'SELECT * FROM invoices WHERE id = $1 AND tenant_id = $2',
    [req.params.id, req.user.tenantId]
  );

  if (invoice.rows.length === 0) {
    return res.status(404).json({ error: 'Invoice not found' });
  }

  res.json(invoice.rows[0]);
});
```

---

#### 4. How do you implement Granular Role-Based Access Control (RBAC) with 8+ permission levels in Node.js?
In enterprise applications (like Hookfish / Texto SaaS), simple role checks (`req.user.role === 'admin'`) become unmaintainable when custom roles require combinations of granular permissions (`leads:read`, `leads:export`, `broadcast:create`, `billing:manage`).

```javascript
// Granular RBAC Middleware
export const Permissions = {
  LEADS_READ: 'leads:read',
  LEADS_EXPORT: 'leads:export',
  BROADCAST_SEND: 'broadcast:send',
  BILLING_MANAGE: 'billing:manage',
};

// Middleware Factory
export function requirePermission(...requiredPermissions) {
  return (req, res, next) => {
    const userPermissions = req.user?.permissions || []; // Array of permission strings loaded from JWT or Redis

    const hasAll = requiredPermissions.every(p => userPermissions.includes(p));
    if (!hasAll) {
      return res.status(403).json({
        error: 'Forbidden',
        message: 'You do not have sufficient permissions to perform this action.',
      });
    }
    next();
  };
}

// Usage in Express Route
app.post('/api/broadcasts/send',
  authenticateJwt,
  requirePermission(Permissions.BROADCAST_SEND),
  broadcastController.sendBroadcast
);
```

---

#### 5. An API endpoint is leaking sensitive user data (passwords, internal IDs, Stripe customer IDs). How do you enforce strict output sanitization?
- **Root Cause**: Passing raw Mongoose documents (`res.json(user)`) or SQL `SELECT *` rows directly to the client.
- **Fix**:
  1. In PostgreSQL, explicitly select only public columns in SQL queries (`SELECT id, name, email FROM users`).
  2. In Mongoose, use schemas with `select: false` or implement a `.toJSON()` transform.
  3. Enforce **Data Transfer Object (DTO)** validation with **Zod** before sending responses.

```javascript
// Mongoose Schema with secure toJSON transform
const userSchema = new mongoose.Schema({
  email: { type: String, required: true },
  passwordHash: { type: String, required: true, select: false },
  stripeSecretKey: { type: String, select: false },
});

userSchema.set('toJSON', {
  transform: (doc, ret) => {
    delete ret.passwordHash;
    delete ret.stripeSecretKey;
    delete ret.__v;
    return ret;
  }
});
```

---

#### 6. A security audit detects that your JWT tokens remain valid even after a user changes their password or logs out. How do you implement Token Revocation?
- **The Problem**: JWTs are cryptographically signed and stateless; once issued, they are valid until `exp` timestamp.
- **Solution: Dual-Token Architecture with Redis Token Blacklist / Version Counter**:
  1. Issue short-lived access tokens (10–15 mins).
  2. Store a `tokenVersion` integer in the User record. When password is changed, increment `tokenVersion` in PostgreSQL/MongoDB.
  3. Include `tokenVersion` inside the JWT payload. The auth middleware checks if token's version matches user's active version in Redis cache (sub-millisecond lookup).
  4. On explicit logout, write the token's `jti` (JWT ID) to Redis with a TTL equal to remaining token life.

---

#### 7. How do you protect a public webhook endpoint (e.g., WhatsApp Business API / Stripe) against spoofing and replay attacks?
1. **Verify Cryptographic HMAC SHA-256 Signatures**: Validate incoming payload against your shared webhook signing secret using constant-time string comparison (`crypto.timingSafeEqual`) to prevent timing attacks.
2. **Verify Timestamp**: Reject webhooks older than 5 minutes to prevent replay attacks.
3. **Idempotency Key Verification**: Check Redis for `webhook:id:<event_id>` before processing.

```javascript
import crypto from 'crypto';

export function verifyWhatsAppWebhook(req, res, next) {
  const signature = req.headers['x-hub-signature-256'];
  if (!signature) return res.status(401).send('Signature missing');

  const expectedSignature = 'sha256=' + crypto
    .createHmac('sha256', process.env.WHATSAPP_APP_SECRET)
    .update(req.rawBody) // Must use raw unparsed Buffer!
    .digest('hex');

  const isMatch = crypto.timingSafeEqual(
    Buffer.from(signature),
    Buffer.from(expectedSignature)
  );

  if (!isMatch) {
    return res.status(403).send('Invalid webhook signature');
  }

  next();
}
```

---

### 2. Performance, Caching & Database Bottlenecks

#### 8. Users report that the dashboard takes 6 seconds to load. How do you systematically isolate and resolve the bottleneck?
- **Step 1: Frontend Network Waterfall**: Check DevTools $\rightarrow$ Is it DNS lookup, SSL handshake, TTFB (Time to First Byte), or large asset download sizes?
- **Step 2: Backend APM / Logging**: Measure database query time vs Node.js processing time using OpenTelemetry / Pino duration timers.
- **Step 3: Database Query Profiling**:
  - In PostgreSQL: Run `EXPLAIN (ANALYZE, BUFFERS)` to spot `Seq Scan` (missing indexes), high disk buffer reads, or nested loop joins.
  - In MongoDB: Run `.explain("executionStats")` to spot `COLLSCAN` vs `IXSCAN`.
- **Step 4: Implement Redis Caching**: Cache aggregated stats (e.g., total active leads, revenue charts) with a 5-minute TTL and cache-aside invalidation on new entries.
- **Step 5: Query Parallelization**: Replace sequential `await`s with `Promise.all()`.

```javascript
// ❌ Sequential Execution: 300ms + 400ms + 500ms = 1200ms total
const metrics = await getMetrics();
const recentLeads = await getRecentLeads();
const broadcastStats = await getBroadcastStats();

// ✅ Parallel Execution: runs simultaneously in ~500ms total
const [metrics, recentLeads, broadcastStats] = await Promise.all([
  getMetrics(),
  getRecentLeads(),
  getBroadcastStats(),
]);
```

---

#### 9. Node.js backend CPU spikes to 100% and crashes under traffic. How do you find the CPU-blocking operation?
- **Root Cause**: Node.js event loop thread is blocked by a heavy synchronous CPU operation:
  1. Deep regular expressions vulnerable to **ReDoS** (e.g., `/(a+)+b/` on long strings).
  2. Heavy JSON parsing or transformation of huge payloads (50MB+).
  3. Synchronous cryptographic or compression routines (`crypto.pbkdf2Sync`, `fs.readFileSync`).
  4. Puppeteer / canvas image generation running directly in the main server process.
- **Fix**:
  - Profile with `clinic.js flame -- node server.js` or Node `--inspect` CPU Profiler.
  - Offload heavy tasks (e.g., Puppeteer, PDF rendering) to **Worker Threads** or dedicated background worker microservices using **BullMQ / Redis Queue**.

---

#### 10. How did you optimize Puppeteer / image generation from 6 seconds down to 100ms with a 40% CPU reduction?
*(Direct experience from your Hookfish.in production project)*:
1. **Browser Instance Pooling**: Never launch a new browser instance (`puppeteer.launch()`) per request (takes ~1.5s). Maintain a persistent warm pool of Chrome instances/pages.
2. **Resource Interception**: Block unnecessary network assets (disable loading external fonts, images, stylesheets, and tracking scripts if only rendering dynamic HTML cards).
3. **Redis Response Caching**: Hash input template variables into a cache key (`image:hash:${md5(payload)}`). If the same card is requested again, return the cached image buffer from Redis or S3 CloudFront CDN in <10ms.
4. **Queue Offloading**: Queue concurrent generation requests via **BullMQ** to cap simultaneous Puppeteer instances to available CPU cores ($N$ workers = $N$ CPU cores), preventing memory thrashing.

---

#### 11. MongoDB collection has 5 million documents. A search query for `{ tenantId, status, createdAt }` is taking 3.5s. How do you optimize it?
- **Issue**: Missing or improperly ordered **Compound Index**.
- **ESR Rule (Equality, Sort, Range)**:
  1. **E (Equality)**: Put exact match fields first (`tenantId: 1`, `status: 1`).
  2. **S (Sort)**: Put sorting fields second (`createdAt: -1`).
  3. **R (Range)**: Put range filter fields last (`price: { $gte: 100 }`).

```javascript
// ✅ Optimal Compound Index following ESR Rule
db.leads.createIndex({ tenantId: 1, status: 1, createdAt: -1 });

// Query utilizes Index Scan (IXSCAN) with 0 in-memory sorting:
db.leads.find({ tenantId: "tenant_101", status: "NEW" })
        .sort({ createdAt: -1 })
        .limit(20);
```

---

#### 12. PostgreSQL query performance degrades over time even though indexes exist. What database maintenance is missing?
- **Root Cause: Table & Index Bloat (MVCC dead tuples)**:
  - In PostgreSQL, `UPDATE` and `DELETE` write new row versions (dead tuples) that take up space until cleaned.
  - If `autovacuum` is misconfigured or long-running transactions block vacuuming, tables and indexes become bloated, forcing the query planner to scan fragmented disk blocks.
- **Resolution**:
  1. Run `VACUUM (ANALYZE, VERBOSE) tablename;` to clean dead tuples and update planner statistics.
  2. Run `REINDEX TABLE CONCURRENTLY tablename;` to rebuild bloated B-Tree indexes without locking writes.
  3. Tune `autovacuum_vacuum_scale_factor` from default 0.2 (20%) to 0.05 (5%) for high-write tables.

---

#### 13. A user updates their profile name, but when they refresh, they still see their old name. Why?
- **Root Causes**:
  1. **Stale Cache**: The backend updated the database but failed to invalidate or update the Redis cache key (`user:profile:101`).
  2. **Replication Lag**: Backend read request was routed to a read-replica that hasn't received the write-ahead log (WAL) from the primary database yet.
  3. **Browser HTTP Caching**: API response sent `Cache-Control: public, max-age=3600` instead of `no-cache, no-store`.
  4. **React Query / RTK Query**: Mutation did not call `queryClient.invalidateQueries(['userProfile'])`.

---

#### 14. How do you design an API endpoint to export 500,000 lead records to CSV without running out of RAM (`FATAL ERROR: Ineffective mark-compacts near heap limit Allocation failed - JavaScript heap out of memory`)?
- **Anti-Pattern**: Fetching all 500,000 records with `const leads = await Lead.find()` loads the entire dataset into V8 RAM (~800MB+ JSON), causing a crash.
- **Solution: Node.js Stream Pipeline**: Stream data row-by-row directly from the database through a CSV transformer and pipe directly into the HTTP response stream.

```javascript
import { pipeline } from 'stream/promises';
import { Transform } from 'stream';

app.get('/api/leads/export', async (req, res) => {
  res.setHeader('Content-Type', 'text/csv');
  res.setHeader('Content-Disposition', 'attachment; filename="leads_export.csv"');
  res.write('ID,Name,Phone,Status,Created At\n');

  // 1. Create database cursor stream (PostgreSQL or Mongoose)
  const cursor = Lead.find({ tenantId: req.user.tenantId }).cursor();

  // 2. Transform document to CSV line stream
  const csvTransformer = new Transform({
    objectMode: true,
    transform(doc, encoding, callback) {
      const line = `"${doc._id}","${doc.name}","${doc.phone}","${doc.status}","${doc.createdAt.toISOString()}"\n`;
      callback(null, line);
    }
  });

  // 3. Stream pipeline handling backpressure with ~30MB steady RAM
  await pipeline(cursor, csvTransformer, res);
});
```

---

#### 15. How do you prevent Cache Stampede (Dogpiling) when an ultra-hot Redis key expires?
When an entity queried 5,000 times/second expires, all 5,000 requests experience a cache miss simultaneously and flood PostgreSQL/MongoDB at the same millisecond.
- **Solution 1: Distributed Mutex Lock**: Only the first request acquires a lock in Redis to recompute the cache while other requests wait or return slightly stale data.
- **Solution 2: Probabilistic Early Expiration (XFetch)**: Compute a random probability based on remaining TTL; when TTL is under 20%, a single request asynchronously recomputes the cache in the background before it expires.

---

### 3. Concurrency, Race Conditions & Distributed Systems

#### 16. Two users click "Book Seat" on the exact same flight seat at the same millisecond. Both payments succeed, but only 1 seat exists. How do you prevent this race condition?
- **Solutions**:
  1. **PostgreSQL Row-Level Locking (`SELECT ... FOR UPDATE`)**:
     ```sql
     BEGIN;
     SELECT id, status FROM seats WHERE id = 'A1' FOR UPDATE;
     -- Other transactions wait here
     UPDATE seats SET status = 'BOOKED', user_id = 'u_101' WHERE id = 'A1' AND status = 'AVAILABLE';
     COMMIT;
     ```
  2. **Atomic Conditional Update**:
     ```javascript
     const result = await Seat.findOneAndUpdate(
       { _id: seatId, status: 'AVAILABLE' }, // Condition
       { $set: { status: 'BOOKED', userId: req.user.id } },
       { new: true }
     );
     if (!result) return res.status(409).json({ error: 'Seat already booked by another user' });
     ```
  3. **Redis Distributed Lock (Redlock)** around seat ID during checkout initiation.

---

#### 17. A user rapidly double-clicks the "Pay $100" button, causing two duplicate charges on Stripe. How do you guarantee Idempotency?
1. **Frontend**: Immediately disable the submit button and show a spinner upon click.
2. **Backend Idempotency Key**:
   - Frontend generates a unique UUID (`idempotency_key`) before sending the checkout request.
   - Express middleware sets an atomic key in Redis: `SET idempotency:<key> PENDING NX EX 120`.
   - If `SET NX` fails (key already exists), return status 409 or return the cached response of the previous completed transaction.
   - Pass this idempotency key directly to Stripe (`{ idempotencyKey: req.headers['idempotency-key'] }`).

---

#### 18. An external third-party API (e.g., WhatsApp Business API or SMS Gateway) slows down from 200ms to 8,000ms. Your Node.js server connections quickly saturate and crash. How do you protect your system?
- **Implement the Circuit Breaker Pattern (using Opossum)**:
  1. Wrap the external API call inside a Circuit Breaker.
  2. Set a strict request timeout (e.g., 2,500ms).
  3. If error/timeout rate exceeds 50%, the breaker **Opens** immediately for 15 seconds, returning fallback responses or queuing messages in BullMQ without hammering the failing downstream provider.
  4. Automatically transitions to **Half-Open** to probe downstream recovery.

---

#### 19. How do you implement Zero-Downtime database schema migrations in production?
*(The Expand-and-Contract / Parallel Run Pattern)*
- **Scenario**: Renaming column `full_name` $\rightarrow$ `first_name` and `last_name`.
  - **Step 1 (Expand)**: Add `first_name` and `last_name` columns as nullable in PostgreSQL.
  - **Step 2 (Dual-Write)**: Deploy backend code that reads from `full_name`, but writes to both `full_name` AND `(first_name, last_name)`.
  - **Step 3 (Backfill)**: Run an asynchronous background migration script to split and backfill historical records.
  - **Step 4 (Switch Read)**: Deploy new backend code that reads exclusively from `first_name` and `last_name`.
  - **Step 5 (Contract)**: Drop the obsolete `full_name` column in a safe subsequent migration.

---

#### 20. How do you design a multi-tenant WhatsApp Chatbot Flow Builder (like Texto) where businesses customize automated message triggers without code changes?
- **Architecture**:
  1. **Graph-Based Flow Data Model**: Store chatbot flows as a DAG (Directed Acyclic Graph) of Nodes (`TriggerNode`, `MessageNode`, `ConditionNode`, `ApiActionNode`) and Edges in MongoDB/PostgreSQL JSONB.
  2. **Execution Engine**: When an incoming message webhook hits the server, fetch tenant's active flow from Redis cache.
  3. **State Machine**: Track user conversation state (`currentNodeId`, session variables) in Redis with a 24-hour window.
  4. **Dynamic Variable Interpolation**: Replace template variables (`{{lead.name}}`, `{{order.id}}`) dynamically using a template evaluation engine.

---

#### 21. How do you safely shut down a Node.js server in Kubernetes/Docker without dropping in-flight HTTP requests or database transactions?
- Listen for `SIGTERM` and `SIGINT` process signals.
- Stop accepting new incoming HTTP connections (`server.close()`).
- Allow in-flight requests a grace period (e.g., 10 seconds) to complete.
- Close database pools (`pool.end()`), Redis connections (`redis.quit()`), and flush queue workers.
- Exit process with code 0.

```javascript
// Graceful Shutdown Handler
function setupGracefulShutdown(server, dbPool, redisClient) {
  const shutdown = async (signal) => {
    console.log(`\nReceived ${signal}. Starting graceful shutdown...`);

    // 1. Stop taking new HTTP requests
    server.close(async () => {
      console.log('HTTP server closed.');

      try {
        // 2. Cleanly close database pool and Redis
        await dbPool.end();
        await redisClient.quit();
        console.log('All connections drained. Exiting cleanly.');
        process.exit(0);
      } catch (err) {
        console.error('Error during shutdown:', err);
        process.exit(1);
      }
    });

    // 3. Force exit if shutdown hangs beyond 10s
    setTimeout(() => {
      console.error('Shutdown timed out. Forcing process kill.');
      process.exit(1);
    }, 10000).unref();
  };

  process.on('SIGTERM', () => shutdown('SIGTERM'));
  process.on('SIGINT', () => shutdown('SIGINT'));
}
```

---

#### 22. What happens during a split-brain scenario in a distributed Redis/PostgreSQL cluster?
A network partition separates cluster nodes into two isolated groups, each assuming the other is dead and electing its own primary node. Clients writing to both sides cause conflicting, unreconcilable data branches.
- **Prevention**: Enforce **Quorum Consensus** (e.g., minimum $(N/2) + 1$ node votes required to elect a primary or accept writes). Standalone partitions without a majority automatically switch to read-only mode.

---

### 4. Background Jobs, Queues & Real-Time Sync

#### 23. A background queue worker processing 50,000 broadcast messages crashes halfway through. How do you resume without sending duplicate messages?
1. **Message State Tracking**: Store individual recipient message status in database (`PENDING`, `PROCESSING`, `SENT`, `FAILED`).
2. **Chunking & Job Granularity**: Instead of one monolithic 50,000-message job, split the broadcast into small batches of 50–100 messages per BullMQ job.
3. **Idempotency Key at Delivery Layer**: Before sending via WhatsApp/FCM API, verify if `message_id` is already marked `SENT` in Redis.
4. **BullMQ Automatic Retries**: Configure exponential backoff with a Dead Letter Queue (DLQ) for permanently failed numbers.

---

#### 24. How did you engineer a real-time notification system (FCM + Firestore) delivering 500ms latency to 4,000 concurrent users with a 94% delivery rate?
*(Direct experience from your Catalyst Media Integrated LLP project)*:
1. **Asynchronous Dispatch Pipeline**: When a broadcast trigger fires, the API server publishes event payloads to a Redis queue rather than making synchronous FCM calls in the request thread.
2. **Batching FCM Payloads**: Use Firebase Admin SDK `sendEachForMulticast()` to batch up to 500 device tokens in a single network socket call.
3. **Token Pruning & Lifecycle Management**: Clean invalid/unregistered APNs/FCM tokens from database immediately when Firebase returns `messaging/registration-token-not-registered`.
4. **Intelligent Scheduling & Throttling**: Spread notification dispatches across time slices based on recipient time zones and user activity patterns to prevent downstream server crashes.

---

#### 25. WebSocket connections are dropping intermittently for mobile users on React Native. How do you make real-time syncing robust against network switches (WiFi $\rightarrow$ 4G)?
1. **Heartbeat / Ping-Pong Mechanism**: Send a ping every 25 seconds; if pong is missed twice, client tears down dead socket and initiates reconnect.
2. **Exponential Backoff Reconnection**: Reconnect with randomized jitter (`Math.random() * 2^retry`) to prevent thundering herd on server reboot.
3. **Sequence Numbering / Delta Sync**: When reconnecting, the mobile client sends its `last_seen_message_seq_id`. The server queries Redis/PostgreSQL and sends all missed delta messages instead of forcing a full page reload.

---

#### 26. What causes memory leaks in a long-running Node.js process and how do you diagnose them?
- **Common Culprits**:
  1. Global arrays or Maps accumulating data without eviction.
  2. Uncleaned event listeners (`socket.on('message')` added repeatedly on re-render or re-connection without `removeListener()`).
  3. Uncleared `setInterval` closures holding references to large scopes.
- **Diagnosis**:
  - Run Node with `--inspect` and connect Chrome DevTools.
  - Take **Heap Snapshot 1** $\rightarrow$ Simulate 1,000 user requests $\rightarrow$ Take **Heap Snapshot 2**.
  - Filter by **"Objects allocated between Snapshot 1 and 2"** to pinpoint leaking constructors and closures.

---

#### 27. How do you implement a secure direct-to-S3 media upload with thumbnail generation?
1. Client sends file metadata (`filename: "golf-swing.mp4"`, `fileType: "video/mp4"`) to Node API.
2. Node API validates file size and MIME type, then generates an **AWS S3 Pre-Signed PUT URL** (valid for 5 minutes).
3. Client uploads video directly to S3 via `PUT` with progress tracking.
4. S3 fires an `ObjectCreated` event to an **AWS Lambda function** which runs `ffmpeg` to extract a 60fps thumbnail, uploads the thumbnail to S3, and writes the asset URL to PostgreSQL.
5. Client serves media via **AWS CloudFront CDN**.

---

#### 28. How do you handle database deadlocks in PostgreSQL during concurrent multi-row updates?
- **Scenario**:
  - Transaction 1 locks Row A, then attempts to lock Row B.
  - Transaction 2 locks Row B, then attempts to lock Row A.
  - Both wait indefinitely until PostgreSQL detects the cycle and aborts one with `ERROR: deadlock detected`.
- **Prevention**:
  - **Deterministic Lock Ordering**: Always sort IDs in ascending order before locking or updating multiple rows: `SELECT * FROM accounts WHERE id IN (10, 20) ORDER BY id FOR UPDATE`.
  - Keep transactions as short and fast as possible.

---

### 5. React & Frontend State Debugging

#### 29. A React Native screen has severe frame drops (<30fps) during real-time video playback and canvas annotation. How do you achieve silky 60fps?
*(Direct experience from your Elevate Golf project)*:
1. **Use React Native Reanimated & Skia**: Move all gesture tracking and stroke calculations off the JavaScript thread and onto the **Native UI Thread** using worklets (`useAnimatedGestureHandler`).
2. **Eliminate React State during Gestures**: Do not call `setState()` on every `touchMove` (which causes JS-bridge serialization overhead). Update animated values directly via `useSharedValue()`.
3. **Offload Heavy Calculations**: Use `useMemo()` for complex trajectory calculations and memoize video overlay components with `React.memo(VideoOverlay, arePropsEqual)`.
4. **Hermes JS Engine**: Enable Hermes engine for fast TTI (Time to Interactive) and low memory footprint.

---

#### 30. A React component with a search input re-renders 50 times while typing. How do you optimize it?
1. **Debounce the API Query**: Do not trigger API calls on every keystroke; debounce by 300ms using a custom hook.
2. **Separate Controlled Input from Results List**: The input component handles local keystrokes, while the heavy results table only re-renders when the debounced query changes.
3. **React 18 `useDeferredValue`**: Mark results list updates as low priority so the input field remains responsive and instant.

```jsx
import { useState, useDeferredValue, useMemo } from 'react';

function SearchComponent({ allLeads }) {
  const [query, setQuery] = useState('');
  const deferredQuery = useDeferredValue(query); // Non-blocking deferred value

  const filteredLeads = useMemo(() => {
    if (!deferredQuery) return allLeads;
    return allLeads.filter(lead => lead.name.toLowerCase().includes(deferredQuery.toLowerCase()));
  }, [allLeads, deferredQuery]);

  return (
    <div>
      {/* Keystrokes are instant and never blocked */}
      <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search leads..." />
      <LeadsTable leads={filteredLeads} />
    </div>
  );
}
```

---

#### 31. An infinite scroll list becomes slow and laggy after scrolling past 500 items. How do you fix it?
- **Root Cause**: The browser DOM has thousands of rendered DOM nodes and attached event listeners, consuming massive layout/reflow calculation time.
- **Solution: Windowing / Virtualization**:
  - Use `@tanstack/react-virtual` or `react-window` (or `FlashList` in React Native).
  - Only render the 15–20 items currently visible inside the viewport, recycling off-screen DOM nodes dynamically.

---

#### 32. Why did `useEffect` trigger an infinite re-render loop and how do you fix it?
- **Root Cause**: An object or array is declared inside the component body and passed as a dependency to `useEffect`. Because objects are compared by **reference equality** ($O_1 \neq O_2$), every render creates a new object instance, re-triggering the effect endlessly.

```jsx
// ❌ Buggy: New options object created every render -> Infinite Loop
function Dashboard({ userId }) {
  const [data, setData] = useState(null);
  const options = { page: 1, limit: 10 }; // New reference every render!

  useEffect(() => {
    fetchData(userId, options).then(setData);
  }, [userId, options]); // 'options' reference always changes
}

// ✅ Fixed: Memoize object or pass primitive values
function Dashboard({ userId }) {
  const [data, setData] = useState(null);

  useEffect(() => {
    fetchData(userId, { page: 1, limit: 10 }).then(setData);
  }, [userId]); // Stable primitive dependency
}
```

---

#### 33. When should you choose TanStack Query (React Query) over Redux Toolkit?
- **TanStack Query (Server State)**: Purpose-built for remote asynchronous data (fetching, caching, deduplicating identical requests, auto-refetch on window focus, optimistic updates, pagination). Eliminates 90% of custom `useEffect` fetch boilerplate.
- **Redux Toolkit / Zustand (Client State)**: Best for purely synchronous local state that never lives on the server (e.g., active modal state, dark/light theme, complex multi-step canvas drawing state).

---

#### 34. How do you implement Optimistic UI Updates in React with immediate rollback on server failure?

```jsx
import { useMutation, useQueryClient } from '@tanstack/react-query';

function useUpdateLeadStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateLeadStatusOnServer,
    // 1. When mutation is fired, cancel outgoing refetches and snapshot previous value
    onMutate: async (newLead) => {
      await queryClient.cancelQueries({ queryKey: ['leads', newLead.id] });
      const previousLead = queryClient.getQueryData(['leads', newLead.id]);

      // 2. Optimistically update local cache with new value immediately
      queryClient.setQueryData(['leads', newLead.id], (old) => ({ ...old, ...newLead }));

      return { previousLead };
    },
    // 3. If server responds with error, rollback to previous snapshot
    onError: (err, newLead, context) => {
      queryClient.setQueryData(['leads', newLead.id], context.previousLead);
      toast.error('Update failed. Reverted changes.');
    },
    // 4. Always refetch to ensure source of truth
    onSettled: (newLead) => {
      queryClient.invalidateQueries({ queryKey: ['leads', newLead.id] });
    },
  });
}
```

---

#### 35. How do you prevent layout shifts (CLS) when loading dynamic images or fonts in Next.js/React?
1. Always specify explicit `width` and `height` (or `aspect-ratio` CSS) on image wrappers so browser reserves space before image loads.
2. Use Next.js `<Image src="..." placeholder="blur" blurDataURL="..." width={500} height={300} />`.
3. Use `next/font` to automatically preload Google fonts and apply CSS font metrics overrides (`size-adjust`), eliminating Flash of Unstyled Text (FOUT).

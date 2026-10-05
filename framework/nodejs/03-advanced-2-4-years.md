# 🟠 Node.js & Express Interview Preparation — Advanced Level (2–4 Years Experience)

> Advanced interview guide covering libuv thread pool internals, Worker Threads & SharedArrayBuffer, V8 memory & Garbage Collection (Scavenger vs Mark-Sweep), Memory leak diagnostics, AsyncLocalStorage, Custom Transform streams, RabbitMQ/BullMQ distributed queues, Cache Stampede & Redlock, Circuit Breakers, and API Gateway patterns.

---

## 📑 Table of Contents

- [Q01. What is `libuv` and how does the internal worker thread pool (`UV_THREADPOOL_SIZE`) work?](#q01-what-is-libuv-and-how-does-the-internal-worker-thread-pool-uv_threadpool_size-work)
- [Q02. Which specific Node.js core APIs use the libuv thread pool vs non-blocking OS system calls?](#q02-which-specific-nodejs-core-apis-use-the-libuv-thread-pool-vs-non-blocking-os-system-calls)
- [Q03. What are Worker Threads (`worker_threads` module) and how do they differ from `Cluster` and `Child Process`?](#q03-what-are-worker-threads-worker_threads-module-and-how-do-they-differ-from-cluster-and-child-process)
- [Q04. How do Worker Threads share memory using `SharedArrayBuffer` and `Atomics`?](#q04-how-do-worker-threads-share-memory-using-sharedarraybuffer-and-atomics)
- [Q05. How does V8 allocate memory (New Space, Old Space, Large Object Space, Code Space)?](#q05-how-does-v8-allocate-memory-new-space-old-space-large-object-space-code-space)
- [Q06. How does V8 Garbage Collection work (Scavenge / Semi-space Minor GC vs Mark-Sweep-Compact Major GC)?](#q06-how-does-v8-garbage-collection-work-scavenge--semi-space-minor-gc-vs-mark-sweep-compact-major-gc)
- [Q07. What triggers memory leaks in Node.js and how do you identify them using Chrome DevTools & Heap Snapshots?](#q07-what-triggers-memory-leaks-in-nodejs-and-how-do-you-identify-them-using-chrome-devtools--heap-snapshots)
- [Q08. How do you diagnose Event Loop Latency and CPU bottlenecks using `perf_hooks` and `clinic.js`?](#q08-how-do-you-diagnose-event-loop-latency-and-cpu-bottlenecks-using-perf_hooks-and-clinicjs)
- [Q09. What is `AsyncLocalStorage` in Node.js and how do you use it for request correlation IDs and context propagation?](#q09-what-is-asynclocalstorage-in-nodejs-and-how-do-you-use-it-for-request-correlation-ids-and-context-propagation)
- [Q10. How do you build a custom `Transform` stream in Node.js (e.g., CSV line parser or data masking)?](#q10-how-do-you-build-a-custom-transform-stream-in-nodejs-eg-csv-line-parser-or-data-masking)
- [Q11. How do you stream multi-gigabyte files directly from S3/Disk to an HTTP client without memory ballooning?](#q11-how-do-you-stream-multi-gigabyte-files-directly-from-s3disk-to-an-http-client-without-memory-ballooning)
- [Q12. What is Prototype Pollution in JavaScript/Node.js, how does it lead to RCE, and how do you defend against it?](#q12-what-is-prototype-pollution-in-javascriptnodejs-how-does-it-lead-to-rce-and-how-do-you-defend-against-it)
- [Q13. What is Regular Expression Denial of Service (ReDoS) and how do you prevent catastrophic backtracking?](#q13-what-is-regular-expression-denial-of-service-redos-and-how-do-you-prevent-catastrophic-backtracking)
- [Q14. How do you implement distributed asynchronous background job processing using `BullMQ` and Redis?](#q14-how-do-you-implement-distributed-asynchronous-background-job-processing-using-bullmq-and-redis)
- [Q15. How do you handle job retries, Dead-Letter Queues (DLQ), and delayed jobs in BullMQ?](#q15-how-do-you-handle-job-retries-dead-letter-queues-dlq-and-delayed-jobs-in-bullmq)
- [Q16. How do you integrate RabbitMQ with Node.js using `amqplib` (manual acknowledgments and prefetch)?](#q16-how-do-you-integrate-rabbitmq-with-nodejs-using-amqplib-manual-acknowledgments-and-prefetch)
- [Q17. What is Cache Stampede (Thundering Herd) and how do you prevent it using Mutexes or Probabilistic Early Expiration?](#q17-what-is-cache-stampede-thundering-herd-and-how-do-you-prevent-it-using-mutexes-or-probabilistic-early-expiration)
- [Q18. How do you implement Distributed Locking (Redlock) in Node.js to prevent race conditions across server pods?](#q18-how-do-you-implement-distributed-locking-redlock-in-nodejs-to-prevent-race-conditions-across-server-pods)
- [Q19. How do you build an API Idempotency Interceptor using Redis in Express?](#q19-how-do-you-build-an-api-idempotency-interceptor-using-redis-in-express)
- [Q20. What is HTTP Keep-Alive and how do you configure custom `http.Agent` connection pooling for outbound API requests?](#q20-what-is-http-keep-alive-and-how-do-you-configure-custom-httpagent-connection-pooling-for-outbound-api-requests)
- [Q21. How do you implement zero-downtime rolling reloads using Node.js Cluster or PM2?](#q21-how-do-you-implement-zero-downtime-rolling-reloads-using-nodejs-cluster-or-pm2)
- [Q22. How do you handle backpressure when consuming high-velocity Kafka or RabbitMQ streams in Node.js?](#q22-how-do-you-handle-backpressure-when-consuming-high-velocity-kafka-or-rabbitmq-streams-in-nodejs)
- [Q23. How do you implement Circuit Breakers in Node.js microservices using `opossum`?](#q23-how-do-you-implement-circuit-breakers-in-nodejs-microservices-using-opossum)
- [Q24. How do you manage Database Connection Pool starvation and deadlocks under high concurrency?](#q24-how-do-you-manage-database-connection-pool-starvation-and-deadlocks-under-high-concurrency)
- [Q25. How do you build an API Gateway in Node.js using `http-proxy-middleware` with auth offloading and rate limiting?](#q25-how-do-you-build-an-api-gateway-in-nodejs-using-http-proxy-middleware-with-auth-offloading-and-rate-limiting)
- [Q26. How do you implement dynamic secrets rotation (AWS Secrets Manager / Vault) in a long-running Node.js process?](#q26-how-do-you-implement-dynamic-secrets-rotation-aws-secrets-manager--vault-in-a-long-running-nodejs-process)
- [Q27. What are Native C++ Addons in Node.js (Node-API / N-API) and when should you write C++ instead of JavaScript?](#q27-what-are-native-c-addons-in-nodejs-node-api--n-api-and-when-should-you-write-c-instead-of-javascript)
- [Q28. How do you build robust Kubernetes Liveness and Readiness probes in Express?](#q28-how-do-you-build-robust-kubernetes-liveness-and-readiness-probes-in-express)
- [Q29. How do you resolve DNS caching issues in Node.js when calling external microservices (`lookup` vs `resolve`)?](#q29-how-do-you-resolve-dns-caching-issues-in-nodejs-when-calling-external-microservices-lookup-vs-resolve)
- [Q30. What is the difference between Server-Side Rendering (SSR) streaming and traditional client-side rendering performance?](#q30-what-is-the-difference-between-server-side-rendering-ssr-streaming-and-traditional-client-side-rendering-performance)
- [Q31. How do you scale Socket.IO across multiple Node.js instances using the Redis Adapter?](#q31-how-do-you-scale-socketio-across-multiple-nodejs-instances-using-the-redis-adapter)
- [Q32. How do you protect Express against HTTP Parameter Pollution (HPP) and Mass Assignment vulnerabilities?](#q32-how-do-you-protect-express-against-http-parameter-pollution-hpp-and-mass-assignment-vulnerabilities)
- [Q33. How do you benchmark and load-test Node.js APIs using `autocannon`?](#q33-how-do-you-benchmark-and-load-test-nodejs-apis-using-autocannon)
- [Q34. How does Node.js handle TLS termination, SNI, and SSL certificate renewals?](#q34-how-does-nodejs-handle-tls-termination-sni-and-ssl-certificate-renewals)

---

### Q01. What is `libuv` and how does the internal worker thread pool (`UV_THREADPOOL_SIZE`) work?

#### Answer:
**libuv** is a cross-platform C library that handles the event loop and asynchronous I/O in Node.js.
- For network I/O, libuv uses non-blocking OS primitives (`epoll` on Linux, `kqueue` on macOS, `IOCP` on Windows) which do **not** require background threads.
- For blocking operations where non-blocking OS APIs do not exist (filesystem I/O, DNS lookups, CPU-bound crypto), libuv maintains an internal **thread pool**.
- Default size is **4 threads**. Can be increased up to 1024 before process startup using the environment variable:
  ```bash
  UV_THREADPOOL_SIZE=16 node server.js
  ```

---

### Q02. Which specific Node.js core APIs use the libuv thread pool vs non-blocking OS system calls?

#### Answer:
- **Uses libuv Thread Pool**:
  1. `fs.*`: All asynchronous filesystem operations (`fs.readFile`, `fs.writeFile`).
  2. `crypto.*`: Expensive cryptographic operations (`crypto.pbkdf2`, `crypto.scrypt`, `crypto.randomBytes`).
  3. `dns.lookup()`: Resolves hostnames synchronously via OS `getaddrinfo(3)`.
  4. `zlib.*`: Asynchronous compression operations.
- **Uses Non-Blocking OS System Calls (No Thread Pool)**:
  1. `net.*` and `http.*`: All incoming and outgoing TCP/HTTP sockets.
  2. `dgram.*`: UDP sockets.
  3. `dns.resolve*()`: Direct asynchronous DNS queries bypassing OS resolver via `c-ares`.
  4. Pipes and UNIX Domain Sockets.

---

### Q03. What are Worker Threads (`worker_threads` module) and how do they differ from `Cluster` and `Child Process`?

#### Answer:
- **`Child Process`**: Separate OS processes with completely independent memory spaces and V8 instances. High memory overhead (~30MB+ per process). IPC is serialized over pipes.
- **`Cluster`**: Specialized child processes designed to share a single server port via OS socket sharing.
- **`Worker Threads`**: Separate OS threads running within the **same OS process**. Each worker has its own isolated V8 isolate and Event Loop, but can share memory directly with the parent thread using `SharedArrayBuffer` without serialization overhead.

#### Example:
```javascript
// main.js
const { Worker } = require('worker_threads');

function runService(workerData) {
  return new Promise((resolve, reject) => {
    const worker = new Worker('./worker.js', { workerData });
    worker.on('message', resolve);
    worker.on('error', reject);
    worker.on('exit', (code) => {
      if (code !== 0) reject(new Error(`Worker stopped with exit code ${code}`));
    });
  });
}

runService({ count: 100000000 }).then(console.log);

// worker.js
const { parentPort, workerData } = require('worker_threads');

let sum = 0;
for (let i = 0; i < workerData.count; i++) sum += i;
parentPort.postMessage({ sum });
```

---

### Q04. How do Worker Threads share memory using `SharedArrayBuffer` and `Atomics`?

#### Answer:
A `SharedArrayBuffer` allocates a chunk of raw shared binary memory accessible by both parent and worker threads simultaneously. To prevent race conditions, the `Atomics` API provides thread-safe atomic operations (`Atomics.add`, `Atomics.wait`, `Atomics.notify`).

#### Example:
```javascript
// Allocate 4 bytes of shared memory (1 Int32)
const sharedBuffer = new SharedArrayBuffer(4);
const sharedArray = new Int32Array(sharedBuffer);

// Thread-safe atomic increment:
Atomics.add(sharedArray, 0, 1);
console.log('Atomic value:', Atomics.load(sharedArray, 0)); // 1
```

---

### Q05. How does V8 allocate memory (New Space, Old Space, Large Object Space, Code Space)?

#### Answer:
The V8 heap is divided into distinct generations/spaces:
1. **New Space (Nursery & Intermediate)**: Small contiguous space (1–64MB) where all new objects are allocated. Fast allocation via bump pointer.
2. **Old Space (Old Pointer & Old Data)**: Holds surviving objects promoted from New Space after surviving two GC cycles.
3. **Large Object Space**: Allocations that exceed the capacity of other spaces to avoid moving them around during GC.
4. **Code Space**: Compilations produced by the JIT compiler.
5. **Map Space (Cell / PropertyCell)**: Stores hidden classes and property metadata.

---

### Q06. How does V8 Garbage Collection work (Scavenge / Semi-space Minor GC vs Mark-Sweep-Compact Major GC)?

#### Answer:
V8 uses a **generational garbage collector**:
- **Minor GC (Scavenger - Cheney's Algorithm)**:
  - Collects New Space.
  - Divided into "From-Space" and "To-Space".
  - Live objects are copied to "To-Space" (or promoted to Old Space if they survived previous cycles). Dead objects are discarded. Extremely fast (~1–5ms).
- **Major GC (Mark-Sweep-Compact)**:
  - Collects Old Space when memory threshold is reached.
  - **Marking**: Traverses object graph from roots to identify reachable objects (concurrent & incremental marking).
  - **Sweeping**: Frees memory addresses of unreachable objects.
  - **Compacting**: Defragments memory by moving live objects together to prevent memory fragmentation.

---

### Q07. What triggers memory leaks in Node.js and how do you identify them using Chrome DevTools & Heap Snapshots?

#### Answer:
**Common Leak Causes**:
1. Global variables (`global.cache = {}` without TTL).
2. Forgotten Timers/Intervals (`setInterval` capturing external variables in closure).
3. Unremoved Event Listeners (`emitter.on('event', fn)` called per request without `emitter.off()`).
4. Retained Closures holding references to large objects.

**Diagnosis Workflow**:
1. Run Node.js with `--inspect` flag: `node --inspect server.js`.
2. Open Chrome at `chrome://inspect`.
3. Take a **Heap Snapshot**, simulate load, take a second snapshot.
4. Use **Comparison View** in DevTools to sort by `Delta` and find constructor types multiplying endlessly.

---

### Q08. How do you diagnose Event Loop Latency and CPU bottlenecks using `perf_hooks` and `clinic.js`?

#### Answer:
Event Loop delay is the time elapsed between when a timer was scheduled to execute and when it actually ran.
- `perf_hooks.monitorEventLoopDelay({ resolution: 20 })`: Measures event loop delay percentiles (p50, p99).
- **`clinic.js` Suite**:
  - `clinic doctor -- node server.js`: Diagnoses whether bottleneck is I/O, Event Loop lag, or Garbage Collection.
  - `clinic flame`: Produces interactive flamegraphs showing CPU hot paths.
  - `clinic bubbleprof`: Visualizes asynchronous operation latency.

---

### Q09. What is `AsyncLocalStorage` in Node.js and how do you use it for request correlation IDs and context propagation?

#### Answer:
`AsyncLocalStorage` binds state to the current asynchronous execution context without passing it through function parameters.

#### Example:
```javascript
const { AsyncLocalStorage } = require('async_hooks');
const asyncLocalStorage = new AsyncLocalStorage();
const { v4: uuidv4 } = require('uuid');

// Express Middleware
const contextMiddleware = (req, res, next) => {
  const correlationId = req.headers['x-correlation-id'] || uuidv4();
  res.setHeader('x-correlation-id', correlationId);

  asyncLocalStorage.run(new Map([['correlationId', correlationId]]), () => {
    next();
  });
};

// Deeply nested service function (no req parameter needed!)
function logWithTrace(message) {
  const store = asyncLocalStorage.getStore();
  const traceId = store ? store.get('correlationId') : 'N/A';
  console.log(`[Trace: ${traceId}] ${message}`);
}
```

---

### Q10. How do you build a custom `Transform` stream in Node.js (e.g., CSV line parser or data masking)?

#### Answer:
Extend `stream.Transform` and implement the `_transform(chunk, encoding, callback)` and optional `_flush(callback)` methods.

#### Example:
```javascript
const { Transform } = require('stream');

class MaskEmailTransform extends Transform {
  _transform(chunk, encoding, callback) {
    const text = chunk.toString();
    // Replace emails with [MASKED]
    const masked = text.replace(/([a-zA-Z0-9._%+-]+)@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g, '[MASKED]');
    this.push(masked);
    callback();
  }
}

// Usage:
process.stdin.pipe(new MaskEmailTransform()).pipe(process.stdout);
```

---

### Q11. How do you stream multi-gigabyte files directly from S3/Disk to an HTTP client without memory ballooning?

#### Answer:
Never load the file into a variable. Pipe the stream directly to the HTTP `res` writable stream with proper headers (`Content-Type`, `Content-Length`).

#### Example:
```javascript
const fs = require('fs');
const { pipeline } = require('stream/promises');

app.get('/download/large-video', async (req, res) => {
  const filePath = '/data/videos/large-video.mp4';
  const stat = fs.statSync(filePath);

  res.writeHead(200, {
    'Content-Type': 'video/mp4',
    'Content-Length': stat.size,
  });

  const fileStream = fs.createReadStream(filePath);
  await pipeline(fileStream, res);
});
```

---

### Q12. What is Prototype Pollution in JavaScript/Node.js, how does it lead to RCE, and how do you defend against it?

#### Answer:
Prototype pollution occurs when an attacker injects properties into `Object.prototype` (usually via unsafe recursive deep object merge functions parsing JSON).
- If an application checks `if (user.isAdmin)`, and the attacker polluted `Object.prototype.isAdmin = true`, all objects inherit `isAdmin: true`.
- **Defenses**:
  1. Freeze prototype: `Object.freeze(Object.prototype)`.
  2. Use `Map` instead of plain object keys.
  3. Create objects with null prototype: `Object.create(null)`.
  4. Validate JSON keys against blacklist: reject keys named `__proto__`, `constructor`, `prototype`.

---

### Q13. What is Regular Expression Denial of Service (ReDoS) and how do you prevent catastrophic backtracking?

#### Answer:
ReDoS occurs when a regular expression contains nested quantifiers with overlapping states (e.g. `/^(a+)+$/`), causing $O(2^n)$ exponential backtracking steps when matched against a non-matching input like `'aaaaaaaaaaaaaaaaaaaaX'`.
- **Defenses**:
  1. Use safe regex linters (`safe-regex`).
  2. Avoid nested quantifiers (`(a+)+` or `(a|a)+`).
  3. Use regex matching libraries with timeout mechanisms or Google's **RE2** engine (`node-re2`).

---

### Q14. How do you implement distributed asynchronous background job processing using `BullMQ` and Redis?

#### Answer:
`BullMQ` manages message queues using Redis primitives (Streams / Hashes).
- **Producer**: Pushes tasks into the queue (`queue.add()`).
- **Worker**: Consumes and processes tasks with concurrency control (`new Worker()`).

#### Example:
```javascript
const { Queue, Worker } = require('bullmq');

const connection = { host: 'localhost', port: 6379 };

// 1. Producer Queue
const emailQueue = new Queue('email-queue', { connection });

async function enqueueEmail(data) {
  await emailQueue.add('welcome-email', data, { attempts: 3 });
}

// 2. Worker Consumer
const worker = new Worker('email-queue', async (job) => {
  console.log(`Processing email job ${job.id} for ${job.data.email}`);
  // Perform actual email delivery...
}, { connection, concurrency: 5 });
```

---

### Q15. How do you handle job retries, Dead-Letter Queues (DLQ), and delayed jobs in BullMQ?

#### Answer:
Configure exponential backoff and max retry limits. When retries are exhausted, move the failed job to a DLQ for inspection.

#### Example:
```javascript
await emailQueue.add('sendReport', reportData, {
  delay: 60000, // Run after 60s delay
  attempts: 5,
  backoff: {
    type: 'exponential',
    delay: 2000, // 2s, 4s, 8s, 16s...
  },
  removeOnComplete: true,
  removeOnFail: false, // Keep in failed set for DLQ processing
});
```

---

### Q16. How do you integrate RabbitMQ with Node.js using `amqplib` (manual acknowledgments and prefetch)?

#### Answer:
In high-throughput messaging, manual acknowledgments (`ch.ack(msg)`) and prefetch control (`ch.prefetch(10)`) prevent worker memory exhaustion by ensuring the broker only pushes new messages when the worker has finished current ones.

#### Example:
```javascript
const amqp = require('amqplib');

async function startConsumer() {
  const conn = await amqp.connect('amqp://localhost');
  const ch = await conn.createChannel();
  const queue = 'orders';

  await ch.assertQueue(queue, { durable: true });
  ch.prefetch(10); // Process max 10 messages concurrently per worker

  ch.consume(queue, async (msg) => {
    if (msg !== null) {
      try {
        const order = JSON.parse(msg.content.toString());
        await processOrder(order);
        ch.ack(msg); // Manual ACK
      } catch (err) {
        ch.nack(msg, false, true); // Requeue on transient failure
      }
    }
  });
}
```

---

### Q17. What is Cache Stampede (Thundering Herd) and how do you prevent it using Mutexes or Probabilistic Early Expiration?

#### Answer:
**Cache Stampede**: Occurs when a popular cached key expires, and thousands of concurrent requests simultaneously miss the cache and hammer the database with the exact same expensive query.
- **Prevention**:
  1. **Distributed Mutex (Lock)**: The first request acquires a Redis lock to query the DB and update the cache; all other requests wait or return stale cache.
  2. **XFetch (Probabilistic Early Refresh)**: Background worker refreshes the cache before it expires based on computation cost and remaining TTL.

---

### Q18. How do you implement Distributed Locking (Redlock) in Node.js to prevent race conditions across server pods?

#### Answer:
Use `redlock` with Redis to ensure only one instance executes a critical section across a distributed cluster.

#### Example:
```javascript
const Client = require('ioredis');
const Redlock = require('redlock').default;

const redisClient = new Client();
const redlock = new Redlock([redisClient], { retryCount: 3, retryDelay: 200 });

async function processPayment(orderId) {
  const lockKey = `locks:order:${orderId}`;
  const lock = await redlock.acquire([lockKey], 5000); // 5s lock TTL

  try {
    // Critical Section: Only 1 pod executes this
    await executePaymentGatewayCall(orderId);
  } finally {
    await lock.release();
  }
}
```

---

### Q19. How do you build an API Idempotency Interceptor using Redis in Express?

#### Answer:
Clients pass an `Idempotency-Key` header with mutation requests (`POST`). The middleware locks the key in Redis, caches the finished response, and returns the cached response if the same key is reused.

#### Example:
```javascript
const idempotencyMiddleware = (redis) => async (req, res, next) => {
  const key = req.headers['idempotency-key'];
  if (!key) return next();

  const cacheKey = `idempotency:${key}`;
  const cachedResponse = await redis.get(cacheKey);

  if (cachedResponse) {
    const { status, body } = JSON.parse(cachedResponse);
    return res.status(status).json(body);
  }

  // Intercept res.json
  const originalJson = res.json.bind(res);
  res.json = (body) => {
    redis.set(cacheKey, JSON.stringify({ status: res.statusCode, body }), 'EX', 86400); // 24h
    return originalJson(body);
  };

  next();
};
```

---

### Q20. What is HTTP Keep-Alive and how do you configure custom `http.Agent` connection pooling for outbound API requests?

#### Answer:
By default, Node's `http.request` opens and closes a new TCP connection for every outbound HTTP request. Creating an `http.Agent({ keepAlive: true })` reuses open TCP connections, cutting latency by 60–80%.

#### Example:
```javascript
const http = require('http');
const https = require('https');
const axios = require('axios');

const httpAgent = new http.Agent({ keepAlive: true, maxSockets: 50 });
const httpsAgent = new https.Agent({ keepAlive: true, maxSockets: 50 });

const client = axios.create({
  httpAgent,
  httpsAgent,
  timeout: 5000,
});
```

---

### Q21. How do you implement zero-downtime rolling reloads using Node.js Cluster or PM2?

#### Answer:
- With **PM2**: Run `pm2 reload ecosystem.config.js`. PM2 starts new replacement workers before terminating old workers one by one.
- In **Native Cluster**: Fork new worker, wait for `'listening'` event, then send `SIGTERM` to the old worker.

---

### Q22. How do you handle backpressure when consuming high-velocity Kafka or RabbitMQ streams in Node.js?

#### Answer:
When processing messages takes longer than consuming them, call `consumer.pause()` to stop reading from the broker, process in-flight buffers, and call `consumer.resume()` when downstream processing catches up.

---

### Q23. How do you implement Circuit Breakers in Node.js microservices using `opossum`?

#### Answer:
A Circuit Breaker stops making requests to a failing upstream service when the error threshold is breached, returning a fallback response immediately.

#### Example:
```javascript
const CircuitBreaker = require('opossum');

async function callPaymentGateway(order) {
  return await axios.post('https://payment.service/charge', order);
}

const breaker = new CircuitBreaker(callPaymentGateway, {
  timeout: 3000, // 3s timeout
  errorThresholdPercentage: 50, // Open breaker if 50% calls fail
  resetTimeout: 10000, // Wait 10s before probing service again
});

breaker.fallback(() => ({ status: 'PENDING', message: 'Payment queued for processing' }));

app.post('/checkout', async (req, res) => {
  const result = await breaker.fire(req.body);
  res.json(result);
});
```

---

### Q24. How do you manage Database Connection Pool starvation and deadlocks under high concurrency?

#### Answer:
1. Always acquire locks in a **consistent global order** across transactions (e.g. sort user IDs before locking accounts).
2. Set low connection acquire timeouts (`connectionTimeoutMillis: 2000`) so queries fail fast rather than stalling all HTTP requests.
3. Keep database transactions as short as possible; never make network/HTTP calls inside an open DB transaction.

---

### Q25. How do you build an API Gateway in Node.js using `http-proxy-middleware` with auth offloading and rate limiting?

#### Answer:
The Gateway verifies the JWT, injects user metadata into upstream request headers, and proxies the request to internal microservices.

#### Example:
```javascript
const { createProxyMiddleware } = require('http-proxy-middleware');

app.use(
  '/api/orders',
  authenticateJwt, // Centralized auth verification
  createProxyMiddleware({
    target: 'http://orders-service.internal:4001',
    changeOrigin: true,
    onProxyReq: (proxyReq, req) => {
      // Inject authenticated user ID into internal request
      proxyReq.setHeader('x-user-id', req.user.id);
    },
  })
);
```

---

### Q26. How do you implement dynamic secrets rotation (AWS Secrets Manager / Vault) in a long-running Node.js process?

#### Answer:
Implement a background polling service or webhook listener that fetches refreshed secrets periodically, updates in-memory variables, and refreshes database connection pool credentials without process restart.

---

### Q27. What are Native C++ Addons in Node.js (Node-API / N-API) and when should you write C++ instead of JavaScript?

#### Answer:
Native Addons are compiled C++ shared libraries loaded into Node.js using `require()`.
- Built using **Node-API (N-API)** which guarantees ABI (Application Binary Interface) stability across Node.js versions.
- **Use Cases**: Heavy cryptographic operations, image manipulation, low-level hardware drivers, bindings to legacy C libraries.

---

### Q28. How do you build robust Kubernetes Liveness and Readiness probes in Express?

#### Answer:
- **Liveness Probe (`/healthz/liveness`)**: Returns 200 if the Node.js event loop is running. (If failing, K8s restarts the pod).
- **Readiness Probe (`/healthz/readiness`)**: Returns 200 only if DB and Redis connection pools are healthy. (If failing, K8s removes pod from traffic routing).

#### Example:
```javascript
app.get('/healthz/liveness', (req, res) => res.status(200).send('OK'));

app.get('/healthz/readiness', async (req, res) => {
  try {
    await db.query('SELECT 1');
    await redisClient.ping();
    res.status(200).json({ status: 'READY' });
  } catch (err) {
    res.status(503).json({ status: 'UNAVAILABLE', error: err.message });
  }
});
```

---

### Q29. How do you resolve DNS caching issues in Node.js when calling external microservices (`lookup` vs `resolve`)?

#### Answer:
By default, Node's `http.request` uses `dns.lookup()`, which does not cache DNS responses and routes through the OS thread pool.
- Use an external DNS cache library like `dnscache` or `lookup-dns-cache` to enable TTL caching and prevent thread pool saturation.

---

### Q30. What is the difference between Server-Side Rendering (SSR) streaming and traditional client-side rendering performance?

#### Answer:
SSR streaming (`renderToPipeableStream`) begins sending HTML chunks to the browser immediately as components render, allowing the browser to parse HTML and download CSS/JS before the full server response is generated.

---

### Q31. How do you scale Socket.IO across multiple Node.js instances using the Redis Adapter?

#### Answer:
By default, WebSocket state is local to memory. The `@socket.io/redis-adapter` uses Redis Pub/Sub so that a message emitted on Pod A is broadcasted to connected clients on Pod B.

#### Example:
```javascript
const { createAdapter } = require('@socket.io/redis-adapter');
const pubClient = createClient({ url: 'redis://localhost:6379' });
const subClient = pubClient.duplicate();

Promise.all([pubClient.connect(), subClient.connect()]).then(() => {
  io.adapter(createAdapter(pubClient, subClient));
});
```

---

### Q32. How do you protect Express against HTTP Parameter Pollution (HPP) and Mass Assignment vulnerabilities?

#### Answer:
- **HPP**: When an attacker sends duplicate query parameters (`?role=user&role=admin`), Express turns `req.query.role` into an array `['user', 'admin']`. Protect using `hpp()` middleware.
- **Mass Assignment**: Validate DTOs strictly with `Zod` or `whitelist` filters to discard unexpected keys like `isAdmin`.

---

### Q33. How do you benchmark and load-test Node.js APIs using `autocannon`?

#### Answer:
`autocannon` is a high-performance HTTP benchmarking tool written in Node.js.

```bash
npx autocannon -c 100 -d 30 -p 10 http://localhost:3000/api/users
```
- `-c 100`: 100 concurrent connections.
- `-d 30`: 30-second duration.
- `-p 10`: 10 pipelined requests per connection.

---

### Q34. How does Node.js handle TLS termination, SNI, and SSL certificate renewals?

#### Answer:
Use `https.createServer({ key, cert })` or pass `SNICallback` to support multiple domains dynamically. In production, TLS is typically offloaded to reverse proxies (NGINX, Cloudflare, or AWS ALB) to save Node.js CPU cycles.

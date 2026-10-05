# 🔴 Node.js & Express Interview Preparation — Master Level (4–6+ Years Experience)

> Senior & Lead Architect interview guide covering V8 JIT internals (Ignition & TurboFan), Hidden Classes & Inline Caches, Event Loop starvation profiling, Zero-Copy buffer pooling, Linux kernel socket tuning, Transactional Outbox + CDC, Distributed Sagas with compensating transactions, High-throughput Kafka batch consumers, OpenTelemetry observability, Piscina worker pools, and Zero-Downtime deployments.

---

## 📑 Table of Contents

- [Q01. How does V8 JIT Compilation work under the hood (Ignition Bytecode Interpreter & TurboFan Optimizing Compiler)?](#q01-how-does-v8-jit-compilation-work-under-the-hood-ignition-bytecode-interpreter--turbofan-optimizing-compiler)
- [Q02. What causes V8 Deoptimizations (Bailouts) and "Polymorphic / Megamorphic Call Sites" in hot code paths?](#q02-what-causes-v8-deoptimizations-bailouts-and-polymorphic--megamorphic-call-sites-in-hot-code-paths)
- [Q03. How do Hidden Classes (Maps) and Inline Caches (IC) work in V8, and how do you write monomorphic code?](#q03-how-do-hidden-classes-maps-and-inline-caches-ic-work-in-v8-and-how-do-you-write-monomorphic-code)
- [Q04. How do you profile and eliminate Node.js Event Loop Starvation when CPU work cannot be offloaded?](#q04-how-do-you-profile-and-eliminate-nodejs-event-loop-starvation-when-cpu-work-cannot-be-offloaded)
- [Q05. How does Node.js manage memory at the OS level (RSS vs Heap Total vs Heap Used vs External Memory)?](#q05-how-does-nodejs-manage-memory-at-the-os-level-rss-vs-heap-total-vs-heap-used-vs-external-memory)
- [Q06. How do you build a zero-copy streaming pipeline using `Buffer.allocUnsafe()`, buffer pooling, and memory re-use?](#q06-how-do-you-build-a-zero-copy-streaming-pipeline-using-bufferallocunsafe-buffer-pooling-and-memory-re-use)
- [Q07. What are the kernel socket queue dynamics (TCP SYN backlog, accept queue, `SO_REUSEPORT`) in Node.js?](#q07-what-are-the-kernel-socket-queue-dynamics-tcp-syn-backlog-accept-queue-so_reuseport-in-nodejs)
- [Q08. How do you tune Linux kernel network parameters for 100,000+ concurrent Node.js connections?](#q08-how-do-you-tune-linux-kernel-network-parameters-for-100000-concurrent-nodejs-connections)
- [Q09. How do you architect a Multi-Tenant SaaS platform in Node.js with dynamic database connection pools?](#q09-how-do-you-architect-a-multi-tenant-saas-platform-in-nodejs-with-dynamic-database-connection-pools)
- [Q10. How do you detect and eradicate complex closure retainers and prototype leaks in long-running services?](#q10-how-do-you-detect-and-eradicate-complex-closure-retainers-and-prototype-leaks-in-long-running-services)
- [Q11. How do you implement the Transactional Outbox Pattern with PostgreSQL and Kafka in Node.js?](#q11-how-do-you-implement-the-transactional-outbox-pattern-with-postgresql-and-kafka-in-nodejs)
- [Q12. How do you design and implement Distributed Sagas with Orchestration and Compensating Transactions?](#q12-how-do-you-design-and-implement-distributed-sagas-with-orchestration-and-compensating-transactions)
- [Q13. How do you build an Event Sourcing engine in Node.js with append-only event logs and snapshotting?](#q13-how-do-you-build-an-event-sourcing-engine-in-nodejs-with-append-only-event-logs-and-snapshotting)
- [Q14. How do you design a 50,000 msg/sec Kafka processing pipeline in Node.js with batch commits and rebalancing?](#q14-how-do-you-design-a-50000-msgsec-kafka-processing-pipeline-in-nodejs-with-batch-commits-and-rebalancing)
- [Q15. How do you implement OpenTelemetry distributed tracing and metrics in Node.js without adding event loop lag?](#q15-how-do-you-implement-opentelemetry-distributed-tracing-and-metrics-in-nodejs-without-adding-event-loop-lag)
- [Q16. How do you implement sliding-window distributed rate limiting across hundreds of pods using Redis Lua scripts?](#q16-how-do-you-implement-sliding-window-distributed-rate-limiting-across-hundreds-of-pods-using-redis-lua-scripts)
- [Q17. How do you architect a high-scale Webhook Delivery Engine with HMAC signing and exponential jitter retries?](#q17-how-do-you-architect-a-high-scale-webhook-delivery-engine-with-hmac-signing-and-exponential-jitter-retries)
- [Q18. How do you prevent split-brain scenarios and race conditions in multi-pod distributed cron workers?](#q18-how-do-you-prevent-split-brain-scenarios-and-race-conditions-in-multi-pod-distributed-cron-workers)
- [Q19. How do you execute zero-downtime database schema migrations using the Expand/Contract pattern in Node.js?](#q19-how-do-you-execute-zero-downtime-database-schema-migrations-using-the-expandcontract-pattern-in-nodejs)
- [Q20. How do you architect a CQRS architecture in Node.js with eventual consistency and read model projections?](#q20-how-do-you-architect-a-cqrs-architecture-in-nodejs-with-eventual-consistency-and-read-model-projections)
- [Q21. How do you build a high-performance native addon using Node-API (N-API) and C++ or Rust?](#q21-how-do-you-build-a-high-performance-native-addon-using-node-api-n-api-and-c-or-rust)
- [Q22. How do you profile Node.js production performance using Linux `perf`, flamegraphs, and eBPF?](#q22-how-do-you-profile-nodejs-production-performance-using-linux-perf-flamegraphs-and-ebpf)
- [Q23. How do you handle graceful socket draining and connection migration during rolling updates in Kubernetes?](#q23-how-do-you-handle-graceful-socket-draining-and-connection-migration-during-rolling-updates-in-kubernetes)
- [Q24. How do you implement Zero-Trust mTLS and dynamic certificate rotation in Node.js internal microservices?](#q24-how-do-you-implement-zero-trust-mtls-and-dynamic-certificate-rotation-in-nodejs-internal-microservices)
- [Q25. How do you build an enterprise dynamic Feature Flagging engine with zero-latency evaluation?](#q25-how-do-you-build-an-enterprise-dynamic-feature-flagging-engine-with-zero-latency-evaluation)
- [Q26. How do you implement high-performance JSON serialization using `fast-json-stringify` or Protocol Buffers?](#q26-how-do-you-implement-high-performance-json-serialization-using-fast-json-stringify-or-protocol-buffers)
- [Q27. How do you design an API Idempotency layer in Node.js with distributed locks and TTL cache envelopes?](#q27-how-do-you-design-an-api-idempotency-layer-in-nodejs-with-distributed-locks-and-ttl-cache-envelopes)
- [Q28. How do you design a thread pool manager with Piscina and Worker Threads for CPU-bound microservices?](#q28-how-do-you-design-a-thread-pool-manager-with-piscina-and-worker-threads-for-cpu-bound-microservices)
- [Q29. How do you handle Poison Pills, Kafka consumer group rebalances, and consumer lag alerts in production?](#q29-how-do-you-handle-poison-pills-kafka-consumer-group-rebalances-and-consumer-lag-alerts-in-production)
- [Q30. How do you design a Resilient Multi-Region Active-Active backend in Node.js with conflict resolution?](#q30-how-do-you-design-a-resilient-multi-region-active-active-backend-in-nodejs-with-conflict-resolution)
- [Q31. How do you build a custom HTTP/2 and gRPC server in Node.js with multiplexed streaming?](#q31-how-do-you-build-a-custom-http2-and-grpc-server-in-nodejs-with-multiplexed-streaming)
- [Q32. What are the subtle differences and pitfalls between Node.js Fastify internals and Express internals under high load?](#q32-what-are-the-subtle-differences-and-pitfalls-between-nodejs-fastify-internals-and-express-internals-under-high-load)
- [Q33. How do you implement Contract Testing with Pact across Node.js microservices in CI/CD?](#q33-how-do-you-implement-contract-testing-with-pact-across-nodejs-microservices-in-cicd)
- [Q34. How do you build a plugin-based Microkernel architecture in Node.js allowing dynamic module hot-reloading?](#q34-how-do-you-build-a-plugin-based-microkernel-architecture-in-nodejs-allowing-dynamic-module-hot-reloading)

---

### Q01. How does V8 JIT Compilation work under the hood (Ignition Bytecode Interpreter & TurboFan Optimizing Compiler)?

#### Answer:
V8 uses a multi-tier compilation pipeline:
1. **Parser**: Converts JavaScript source code into an Abstract Syntax Tree (AST).
2. **Ignition (Bytecode Interpreter)**: Generates compact bytecode from the AST. Execution starts instantly with low memory overhead. As functions execute, Ignition collects profiling feedback (type feedback vectors).
3. **TurboFan (Optimizing Compiler)**: When a function becomes "hot" (called frequently with consistent argument types), TurboFan compiles the bytecode into highly optimized native machine code based on speculative assumptions.
4. **Deoptimization**: If a hot function is called with unexpected argument types, the assumptions are violated, and TurboFan bails out back to Ignition bytecode execution.

---

### Q02. What causes V8 Deoptimizations (Bailouts) and "Polymorphic / Megamorphic Call Sites" in hot code paths?

#### Answer:
An **Inline Cache (IC)** tracks property lookups and function calls:
- **Monomorphic**: Always receives objects with the exact same Hidden Class (Map). TurboFan inlines the property offset into 1 assembly instruction.
- **Polymorphic**: Sees 2 to 4 different Hidden Classes. TurboFan generates a decision tree.
- **Megamorphic**: Sees 5+ different Hidden Classes. TurboFan gives up on optimization and falls back to slow hash table lookups.
- **Bailout**: Passing an integer and then a string to a math function forces TurboFan to discard compiled machine code, causing sudden CPU spikes in production.

---

### Q03. How do Hidden Classes (Maps) and Inline Caches (IC) work in V8, and how do you write monomorphic code?

#### Answer:
JavaScript objects are dynamic dictionaries, but V8 creates internal C++ structs called **Hidden Classes (Maps)** to track object layout:
- If properties are added in different orders, V8 creates distinct hidden classes.
- **Best Practice for Monomorphic Code**: Always initialize all properties in the constructor in the **exact same order**, and never use `delete obj.prop` (which turns the object into a slow hash dictionary).

#### Example:
```javascript
// Monomorphic: Same hidden class transition
function Point(x, y) {
  this.x = x;
  this.y = y;
}

const p1 = new Point(1, 2);
const p2 = new Point(3, 4);

// ANTI-PATTERN (Megamorphic / Deoptimized):
const objA = {}; objA.x = 1; objA.y = 2;
const objB = {}; objB.y = 2; objB.x = 1; // Different transition tree!
```

---

### Q04. How do you profile and eliminate Node.js Event Loop Starvation when CPU work cannot be offloaded?

#### Answer:
When computational tasks cannot be offloaded to worker threads, break large loops into chunked micro-tasks using `setImmediate()` to interleave I/O events between CPU slices.

#### Example:
```javascript
function processMillions(items, chunkSize = 1000) {
  return new Promise((resolve) => {
    let index = 0;

    function step() {
      const end = Math.min(index + chunkSize, items.length);
      for (; index < end; index++) {
        // CPU work on items[index]
      }

      if (index < items.length) {
        // Yield control back to the Event Loop to handle I/O
        setImmediate(step);
      } else {
        resolve();
      }
    }

    step();
  });
}
```

---

### Q05. How does Node.js manage memory at the OS level (RSS vs Heap Total vs Heap Used vs External Memory)?

#### Answer:
- `process.memoryUsage()` metrics:
  1. **`rss` (Resident Set Size)**: Total memory allocated for the process in physical RAM (includes code segment, stack, V8 heap, and off-heap buffers).
  2. **`heapTotal`**: Total size allocated for the V8 engine heap.
  3. **`heapUsed`**: Actual memory occupied by JavaScript variables, objects, and closures.
  4. **`external`**: Memory bound to C++ objects managed outside V8 (e.g. Node.js `Buffer` instances).
  5. **`arrayBuffers`**: Memory allocated for `ArrayBuffer` and `SharedArrayBuffer`.

---

### Q06. How do you build a zero-copy streaming pipeline using `Buffer.allocUnsafe()`, buffer pooling, and memory re-use?

#### Answer:
`Buffer.alloc(n)` zeros out memory before returning it. `Buffer.allocUnsafe(n)` skips zero-filling, allocating raw memory instantaneously. In network servers handling gigabytes of throughput, reusing pooled buffers eliminates garbage collection churn.

#### Example:
```javascript
class MemoryPool {
  constructor(bufferSize = 65536, poolSize = 100) {
    this.bufferSize = bufferSize;
    this.pool = Array.from({ length: poolSize }, () => Buffer.allocUnsafe(bufferSize));
  }

  acquire() {
    return this.pool.pop() || Buffer.allocUnsafe(this.bufferSize);
  }

  release(buf) {
    if (this.pool.length < 100) {
      this.pool.push(buf);
    }
  }
}
```

---

### Q07. What are the kernel socket queue dynamics (TCP SYN backlog, accept queue, `SO_REUSEPORT`) in Node.js?

#### Answer:
- When a client connects:
  1. Sends `SYN` $\rightarrow$ Kernel places connection in **SYN Queue** (half-open).
  2. Handshake completes $\rightarrow$ Kernel moves connection to **Accept Queue** (backlog).
  3. Node.js calls `uv__accept()` to pull from Accept Queue.
- If the Node.js event loop blocks, the Accept Queue fills up, and incoming clients experience `ECONNREFUSED` or connect timeouts.
- `SO_REUSEPORT`: Allows multiple independent Node processes to bind to the exact same port, letting the Linux kernel distribute connections evenly across processes at the network layer.

---

### Q08. How do you tune Linux kernel network parameters for 100,000+ concurrent Node.js connections?

#### Answer:
In `/etc/sysctl.conf`:
```ini
# Increase socket listen backlog
net.core.somaxconn = 65535
net.ipv4.tcp_max_syn_backlog = 65535

# Enlarge local ephemeral port range
net.ipv4.ip_local_port_range = 1024 65535

# Fast TCP connection reuse
net.ipv4.tcp_tw_reuse = 1
net.ipv4.tcp_fin_timeout = 15

# File descriptor limits in /etc/security/limits.conf
* soft nofile 1000000
* hard nofile 1000000
```

---

### Q09. How do you architect a Multi-Tenant SaaS platform in Node.js with dynamic database connection pools?

#### Answer:
Maintain an in-memory cache of tenant connection pools keyed by tenant ID, backed by an LRU eviction strategy to prevent file descriptor exhaustion.

#### Example:
```javascript
const { Pool } = require('pg');

class TenantConnectionManager {
  constructor() {
    this.pools = new Map();
  }

  getPool(tenantId) {
    if (this.pools.has(tenantId)) {
      return this.pools.get(tenantId);
    }

    const pool = new Pool({
      connectionString: `postgres://user:pass@db.internal:5432/tenant_${tenantId}`,
      max: 10,
      idleTimeoutMillis: 30000,
    });

    this.pools.set(tenantId, pool);
    return pool;
  }
}
```

---

### Q10. How do you detect and eradicate complex closure retainers and prototype leaks in long-running services?

#### Answer:
1. Capture core dumps via `gcore <pid>` or `v8.writeHeapSnapshot()`.
2. Inspect the **Retainer Tree** in DevTools: look for closures capturing the outer scope variable `req` or `res`.
3. Eradicate leaks by explicitly assigning `null` to captured large variables (`largeData = null`) when done, and decoupling event listeners on response finish.

---

### Q11. How do you implement the Transactional Outbox Pattern with PostgreSQL and Kafka in Node.js?

#### Answer:
To guarantee at-least-once message delivery without distributed two-phase commits:
1. Persist the domain entity AND an outbox message inside the **same atomic database transaction**.
2. A Change Data Capture (CDC) tool (Debezium) or a dedicated polling worker reads the outbox table and streams events to Kafka.

#### Example:
```javascript
async function createOrderWithOutbox(client, orderData) {
  await client.query('BEGIN');
  try {
    const orderRes = await client.query(
      'INSERT INTO orders (customer_id, amount) VALUES ($1, $2) RETURNING id',
      [orderData.customerId, orderData.amount]
    );

    const orderId = orderRes.rows[0].id;

    // Outbox record in same transaction
    await client.query(
      'INSERT INTO outbox (aggregate_type, aggregate_id, event_type, payload) VALUES ($1, $2, $3, $4)',
      ['Order', orderId, 'OrderCreated', JSON.stringify({ orderId, ...orderData })]
    );

    await client.query('COMMIT');
    return orderId;
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  }
}
```

---

### Q12. How do you design and implement Distributed Sagas with Orchestration and Compensating Transactions?

#### Answer:
In a multi-service transaction:
- The **Orchestrator** coordinates each step.
- If Step 3 fails, the Orchestrator invokes **Compensating Transactions** in reverse order (e.g. `releaseInventory()` and `refundPayment()`).

#### Example:
```javascript
class OrderSagaOrchestrator {
  async execute(order) {
    try {
      await paymentService.charge(order.id, order.amount);
      await inventoryService.reserve(order.id, order.items);
      await shipmentService.createShipment(order.id);
    } catch (error) {
      console.error('Saga step failed, triggering rollback compensating actions...');
      await inventoryService.release(order.id).catch(console.error);
      await paymentService.refund(order.id, order.amount).catch(console.error);
      throw error;
    }
  }
}
```

---

### Q13. How do you build an Event Sourcing engine in Node.js with append-only event logs and snapshotting?

#### Answer:
Instead of updating row states, append immutable events (`OrderCreated`, `ItemAdded`, `OrderPaid`). Replay events to reconstitute entity state. Create periodic **Snapshots** (e.g., every 100 events) to optimize hydration performance.

---

### Q14. How do you design a 50,000 msg/sec Kafka processing pipeline in Node.js with batch commits and rebalancing?

#### Answer:
Using `kafkajs`:
- Enable `eachBatch` consumer mode.
- Process messages in parallel using worker concurrency pools.
- Commit consumer offsets periodically in batches (`resolveOffset` + `commitOffsetsIfNecessary`).
- Implement partition heartbeat calls (`heartbeat()`) during processing to prevent broker-triggered consumer group rebalancing.

---

### Q15. How do you implement OpenTelemetry distributed tracing and metrics in Node.js without adding event loop lag?

#### Answer:
- Initialize the OpenTelemetry SDK before any other module loads (`node --require ./tracer.js server.js`).
- Use **`BatchSpanProcessor`** with a non-blocking gRPC exporter instead of `SimpleSpanProcessor`.
- Export metrics periodically (e.g. every 10s) to Prometheus scrapers.

---

### Q16. How do you implement sliding-window distributed rate limiting across hundreds of pods using Redis Lua scripts?

#### Answer:
Fixed window counters allow double the permitted burst rate at boundary transitions. 
Use a Redis **Sorted Set (ZSET)** executed in an atomic Lua script:

```lua
-- ARGV[1]: now (timestamp), ARGV[2]: window (ms), ARGV[3]: limit
local key = KEYS[1]
local now = tonumber(ARGV[1])
local clearBefore = now - tonumber(ARGV[2])

redis.call('ZREMRANGEBYSCORE', key, 0, clearBefore)
local count = redis.call('ZCARD', key)

if count < tonumber(ARGV[3]) then
  redis.call('ZADD', key, now, now)
  redis.call('EXPIRE', key, math.ceil(tonumber(ARGV[2]) / 1000))
  return 1 -- Allowed
else
  return 0 -- Throttled
end
```

---

### Q17. How do you architect a high-scale Webhook Delivery Engine with HMAC signing and exponential jitter retries?

#### Answer:
1. Sign outgoing payloads using HMAC-SHA256 with a shared customer secret.
2. Include `X-Signature` and `X-Timestamp` in HTTP headers.
3. Queue outgoing deliveries in BullMQ with full jitter exponential backoff (`delay = random(0, base * 2^attempt)`).
4. Track consecutive failures to auto-disable broken endpoints (Circuit Breaker).

---

### Q18. How do you prevent split-brain scenarios and race conditions in multi-pod distributed cron workers?

#### Answer:
Never run raw `node-cron` across clustered pods.
- **Remedies**:
  1. Use **PostgreSQL Advisory Locks** (`pg_try_advisory_lock(key)`).
  2. Use Redis **Redlock** with TTL.
  3. Offload scheduling to a dedicated orchestrator (Kubernetes CronJobs or AWS EventBridge) that triggers a single worker pod.

---

### Q19. How do you execute zero-downtime database schema migrations using the Expand/Contract pattern in Node.js?

#### Answer:
1. **Expand**: Add new nullable column/table. Deploy code that writes to both old and new columns, reading from the old.
2. **Backfill**: Run asynchronous migration scripts to copy historical data from old to new.
3. **Switch**: Deploy code that reads and writes exclusively to the new column.
4. **Contract**: Once all old pod versions terminate, drop the old column/table.

---

### Q20. How do you architect a CQRS architecture in Node.js with eventual consistency and read model projections?

#### Answer:
- **Write Side (Commands)**: Optimized for fast ACID transactional writes (PostgreSQL).
- **Domain Event Bus**: Publishes change events to Kafka.
- **Read Side (Projections)**: Specialized projectors consume events and denormalize data into Elasticsearch or MongoDB for instantaneous $O(1)$ query reads.

---

### Q21. How do you build a high-performance native addon using Node-API (N-API) and C++ or Rust?

#### Answer:
Use `napi-rs` (Rust) or `node-addon-api` (C++):
- Compile native functions to `.node` shared libraries.
- Execute CPU-intensive algorithms directly on bare metal without V8 garbage collection overhead.

---

### Q22. How do you profile Node.js production performance using Linux `perf`, flamegraphs, and eBPF?

#### Answer:
Run Node.js with `--perf-basic-prof`:
1. Record CPU stack traces using Linux `perf record -F 99 -p <pid> -g -- sleep 30`.
2. Generate flamegraphs using `perf-script` to inspect JavaScript and C++ kernel stack frames together.
3. Use **eBPF (bcc-tools)** to trace off-CPU I/O block times and TCP queue latencies without impacting production throughput.

---

### Q23. How do you handle graceful socket draining and connection migration during rolling updates in Kubernetes?

#### Answer:
On `SIGTERM`:
1. Immediately fail Kubernetes Readiness probes (`503 Service Unavailable`) so endpoints remove the pod.
2. Stop accepting new HTTP connections via `server.close()`.
3. Set `Connection: close` header on remaining in-flight HTTP responses.
4. Wait for existing keep-alive connections to drain within a grace period (e.g. 15s) before closing DB connections and exiting.

---

### Q24. How do you implement Zero-Trust mTLS and dynamic certificate rotation in Node.js internal microservices?

#### Answer:
Configure `https.createServer` with:
- `requestCert: true` and `rejectUnauthorized: true`.
- Validate client certificates against internal CA authority.
- Implement `tlsSocket.setSecureContext()` to swap out expiring SSL certificates in memory without restarting the Node.js server.

---

### Q25. How do you build an enterprise dynamic Feature Flagging engine with zero-latency evaluation?

#### Answer:
Never make HTTP calls to third-party feature flag servers on every request.
- Establish an in-memory client connected via Server-Sent Events (SSE) or WebSockets to the feature flag control plane (e.g. LaunchDarkly / Unleash).
- Flags are evaluated synchronously in memory ($<1\mu\text{s}$) against user context.

---

### Q26. How do you implement high-performance JSON serialization using `fast-json-stringify` or Protocol Buffers?

#### Answer:
Standard `JSON.stringify` traverses objects dynamically via V8.
`fast-json-stringify` precompiles JSON schemas into static C++ string concatenations, achieving 2x–3x higher throughput for large API payloads.

#### Example:
```javascript
const fastJson = require('fast-json-stringify');

const stringify = fastJson({
  title: 'UserSchema',
  type: 'object',
  properties: {
    id: { type: 'integer' },
    name: { type: 'string' },
  },
});

// Up to 3x faster than JSON.stringify({ id: 1, name: 'Alice' })
const json = stringify({ id: 1, name: 'Alice' });
```

---

### Q27. How do you design an API Idempotency layer in Node.js with distributed locks and TTL cache envelopes?

#### Answer:
Using Redis:
1. `SET idempotency:key "LOCKED" NX EX 30`.
2. If key exists and is `"LOCKED"`, return `409 Conflict` (request currently in flight).
3. If key exists with payload, return cached response.
4. If acquired, execute business logic, write response envelope `{ status, data }` to Redis with 24h TTL, and return.

---

### Q28. How do you design a thread pool manager with Piscina and Worker Threads for CPU-bound microservices?

#### Answer:
**Piscina** is an efficient worker thread pool implementation with work-stealing scheduling.

#### Example:
```javascript
const Piscina = require('piscina');
const path = require('path');

const pool = new Piscina({
  filename: path.resolve(__dirname, 'worker-task.js'),
  minThreads: 4,
  maxThreads: 16,
});

async function computeHeavyTask(data) {
  return await pool.run(data);
}
```

---

### Q29. How do you handle Poison Pills, Kafka consumer group rebalances, and consumer lag alerts in production?

#### Answer:
- **Poison Pill**: A message that crashes the consumer code repeatedly. Catch unhandled deserialization/business errors, route message to a Dead Letter Queue (DLQ), and commit the offset to allow the partition to advance.
- Monitor consumer lag (`logEndOffset - currentOffset`) via Prometheus alerting when lag exceeds threshold.

---

### Q30. How do you design a Resilient Multi-Region Active-Active backend in Node.js with conflict resolution?

#### Answer:
1. Deploy stateless Node.js clusters in multiple regions behind global Anycast DNS.
2. Backed by multi-region distributed databases (CockroachDB, YugabyteDB, or DynamoDB Global Tables).
3. Handle concurrent mutations using **Last-Write-Wins (LWW)** with hybrid logical clocks (HLC) or **CRDTs (Conflict-free Replicated Data Types)**.

---

### Q31. How do you build a custom HTTP/2 and gRPC server in Node.js with multiplexed streaming?

#### Answer:
Use Node's native `http2` module or `@grpc/grpc-js`:
- HTTP/2 multiplexes hundreds of concurrent requests over a single TCP socket without head-of-line blocking.
- gRPC uses Protocol Buffers for compact binary serialization and bi-directional streaming.

---

### Q32. What are the subtle differences and pitfalls between Node.js Fastify internals and Express internals under high load?

#### Answer:
- **Routing**: Fastify uses a Radix Tree router ($O(k)$ lookup); Express uses a linear array router ($O(n)$ regex matches).
- **Serialization**: Fastify uses compiled JSON schemas; Express relies on `JSON.stringify`.
- **Pitfall**: Fastify does not allow mutating `res` once headers are sent, and Express middleware packages require compatibility adapters (`@fastify/middie`).

---

### Q33. How do you implement Contract Testing with Pact across Node.js microservices in CI/CD?

#### Answer:
- Consumer defines expectations in a Pact test file.
- The contract is published to the Pact Broker.
- Provider runs verification tests in CI to ensure downstream API changes never break consumer expectations before deployment.

---

### Q34. How do you build a plugin-based Microkernel architecture in Node.js allowing dynamic module hot-reloading?

#### Answer:
A microkernel core exports extension hooks. Plugins implement a lifecycle interface (`register()`, `boot()`). At runtime, plugins can be loaded or reloaded by invalidating the `require.cache[modulePath]` entry and instantiating the new module.

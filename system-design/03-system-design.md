# 🏗️ System Design Interview Master Guide (50 In-Depth Q&As)

> A comprehensive study guide containing **50 in-depth System Design interview questions, high-level architectures, capacity estimations, and distributed systems trade-offs** covering scalability fundamentals, caching layers, database partitioning, consensus protocols, and real-world system designs (URL Shortener, Chat System, Feed Engine, Video Streaming, Payment Processing, Rate Limiter).

---

## 📑 Table of Contents

- [1. Core Fundamentals & Scalability (Q1–Q20)](#1-core-fundamentals--scalability)
- [2. Distributed Systems & High-Level System Designs (Q21–Q50)](#2-distributed-systems--high-level-system-designs)
  - [Real-World System Architecture Case Studies (Q21–Q24, Q41, Q42, Q50)](#real-world-system-architecture-case-studies)
  - [Consistency, Distributed Storage & Concurrency (Q25–Q36)](#consistency-distributed-storage--concurrency)
  - [Reliability, Resilience & Consensus Protocols (Q37–Q49)](#reliability-resilience--consensus-protocols)

---

# 🚀 50 In-Depth System Design Questions

---

### 1. Core Fundamentals & Scalability

#### 1. What is System Design and what is the standard framework to tackle a System Design interview?
System Design is the process of architecting a software system’s modules, components, APIs, databases, and network topology to satisfy both functional requirements (user actions) and non-functional requirements (scalability, latency, availability, fault tolerance, and security).

**The 5-Step System Design Interview Framework**:
1. **Scope the Requirements**: Clarify Functional Requirements (core features) and Non-Functional Requirements (scale, availability 99.99%, latency < 100ms, data durability).
2. **Back-of-the-Envelope Capacity Estimation**: Estimate DAU/MAU, Read/Write QPS (Queries Per Second), Bandwidth (ingress/egress), and Storage for 5 years.
3. **API & Data Contract Design**: Define REST/gRPC endpoints and schema models (SQL vs NoSQL).
4. **High-Level Architecture**: Draw high-level blocks: Client $\rightarrow$ CDN $\rightarrow$ Load Balancer $\rightarrow$ API Gateway $\rightarrow$ Stateless App Servers $\rightarrow$ Cache $\rightarrow$ DB.
5. **Deep Dive & Bottleneck Resolution**: Address database sharding, caching policies, concurrency race conditions, replication lag, and single points of failure (SPOFs).

---

#### 2. What is Scalability and how does Vertical Scaling compare to Horizontal Scaling?
- **Scalability**: The capacity of a system to handle increased throughput or data volume without proportional degradation in performance.
- **Vertical Scaling (Scale-Up)**: Adding more CPU, RAM, or NVMe storage to a single server.
  - *Pros*: Simple, zero code changes, no distributed network latency.
  - *Cons*: Hard hardware ceiling, expensive, single point of failure (SPOF).
- **Horizontal Scaling (Scale-Out)**: Adding more commodity server instances behind a load balancer.
  - *Pros*: Infinite scaling headroom, high availability, fault tolerant.
  - *Cons*: Requires stateless application design, distributed caching, and database partitioning.

---

#### 3. What is Load Balancing and what algorithms are commonly used?
A **Load Balancer (LB)** sits between clients and server clusters, routing incoming traffic across healthy servers to maximize throughput, minimize latency, and prevent overload.
- **Algorithms**:
  1. **Round Robin**: Routes sequentially down the server list (assumes identical server hardware).
  2. **Least Connections**: Forwards requests to the instance with the fewest active TCP connections (ideal for long-lived WebSockets/transactions).
  3. **IP Hash**: Hashes the client’s IP address to route a specific user consistently to the same server (session affinity).
  4. **Weighted Round Robin / Least Connections**: Distributes traffic proportionally based on server hardware capacity.
  5. **Consistent Hashing**: Minimizes key remapping when cache servers scale up or down.

---

#### 4. What is Caching and what are the primary Cache Invalidation strategies?
Caching stores hot, computationally expensive, or frequently read data in fast in-memory stores (e.g., Redis, Memcached) to reduce latency and database I/O.
- **Caching Patterns**:
  - **Cache-Aside (Lazy Loading)**: App reads from cache; on miss, reads from DB and populates cache.
  - **Write-Through**: App writes to cache and DB simultaneously (consistent, higher write latency).
  - **Write-Back (Write-Behind)**: App writes to cache immediately; cache asynchronously flushes batch writes to DB (blazing write speed, risk of data loss on crash).
  - **Read-Through**: Cache intercepts read queries and fetches from DB automatically on miss.
- **Eviction Policies**: `LRU` (Least Recently Used), `LFU` (Least Frequently Used), `FIFO`, and `TTL` (Time-To-Live).

---

#### 5. What is a Content Delivery Network (CDN) and how does Edge Caching work?
A CDN is a geographically distributed network of proxy servers (Points of Presence - PoPs) that cache static assets (HTML, CSS, JS, images, video chunks) and API responses close to end users.
- **Push CDN**: Content is uploaded to the CDN proactively whenever changes occur (ideal for small, infrequently updated sites).
- **Pull CDN**: CDN fetches content from the origin server on the first user request and caches it for a set `TTL` (standard for web apps).
- **Benefits**: Cuts round-trip latency, offloads 80%+ traffic from origin servers, and provides DDoS shield.

---

#### 6. Latency vs Throughput: How do they relate?
- **Latency**: The time taken for a single unit of data (or request) to travel from the sender to the receiver and return a response (measured in milliseconds).
- **Throughput**: The volume of work or number of requests a system can successfully process per unit of time (measured in Requests Per Second - RPS or Megabytes/sec).
- *Analogy*: An 8-lane highway has high throughput (many cars per minute), but if the speed limit is 20 mph, travel latency is high.

---

#### 7. What is Database Indexing and how does a B-Tree Index operate?
An index is an auxiliary data structure that accelerates data retrieval without scanning every row in a table (`Seq Scan`).
- **B-Tree (Balanced Tree)**: Self-balancing tree structure where all leaf nodes reside at equal depth and contain ordered keys with pointers to heap table rows.
  - *Lookup / Insert / Delete Complexity*: $O(\log N)$.
  - Excellent for equality (`=`) and range queries (`BETWEEN`, `>`, `<`).
- **Trade-off**: Indexes significantly speed up `SELECT` reads, but add memory overhead and slow down `INSERT`, `UPDATE`, and `DELETE` writes (as indexes must be updated).

---

#### 8. Database Replication: Primary-Replica (Master-Slave) vs Multi-Primary.
- **Primary-Replica (Master-Slave)**:
  - **Primary Node**: Handles all writes (`INSERT`, `UPDATE`, `DELETE`) and streams Write-Ahead Logs (WAL) to replicas.
  - **Replica Nodes**: Handle read-only queries (`SELECT`).
  - *Replication Types*:
    - **Synchronous**: Primary waits for at least one replica to acknowledge write (strong consistency, higher latency).
    - **Asynchronous**: Primary commits immediately without waiting (sub-millisecond write, but potential replication lag).
- **Multi-Primary (Multi-Master)**: All nodes accept read and write traffic. Requires conflict resolution strategies (e.g., Last-Write-Wins, CRDTs).

---

#### 9. What is Database Sharding and what are common Sharding Keys?
Sharding is horizontal partitioning of a database across multiple physical database machines.
- **Sharding Strategies**:
  1. **Range-Based Sharding**: Sharding based on ranges (e.g., User IDs 1–1M on Shard 1, 1M–2M on Shard 2). Can lead to hotspot imbalances.
  2. **Hash-Based Sharding**: Computes `hash(shard_key) % num_shards` to evenly distribute rows.
  3. **Directory-Based Sharding**: Uses a lookup service to map shard keys to database nodes.
- **Challenges**: Cross-shard joins are slow and complex; re-sharding requires consistent hashing.

---

#### 10. Explain the CAP Theorem with real-world architectural examples.
In any distributed data store, under a **Network Partition ($P$)**, the system can guarantee at most **two** of the following three properties:
- **Consistency ($C$)**: Every read receives the latest write or an error.
- **Availability ($A$)**: Every non-failing node returns a response, without guarantee that it contains the most recent write.
- **Partition Tolerance ($P$)**: The system continues to operate despite arbitrary network packet drops or delays between nodes.

> **Real-World Reality**: Network partitions are inevitable in distributed systems. Therefore, systems must choose between **CP** (Consistency over Availability, e.g., PostgreSQL, HBase, Zookeeper) or **AP** (Availability over Consistency, e.g., Cassandra, DynamoDB, CouchDB).

---

#### 11. What is the PACELC Theorem?
An extension of the CAP theorem:
- **If there is a Partition ($P$)**: Trade-off between **Availability ($A$)** and **Consistency ($C$)**.
- **Else ($E$) (Normal Operation)**: Trade-off between **Latency ($L$)** and **Consistency ($C$)**.
- *Example*: MongoDB is **PC/EC** (prefers consistency under partition, and consistency over latency in normal operation). DynamoDB is **PA/EL** (prefers availability under partition, and low latency in normal operation).

---

#### 12. What is a Reverse Proxy and how does it differ from an API Gateway?
- **Reverse Proxy (e.g., Nginx, HAProxy)**: Sits in front of web servers to handle SSL/TLS termination, compression (Gzip/Brotli), static asset serving, and basic HTTP load balancing.
- **API Gateway (e.g., Kong, AWS API Gateway, Envoy)**: An application-level reverse proxy that adds advanced microservice management: JWT authentication, rate limiting, request validation, circuit breaking, path routing (`/api/v1/users` $\rightarrow$ User Service), and telemetry tracing.

---

#### 13. Monolith vs Microservices vs Modular Monolith: When to choose what?
- **Monolith**: Single unified codebase and deployment artifact.
  - *Best for*: Early-stage startups, MVPs, small teams (<15 engineers), low domain complexity.
- **Modular Monolith**: Single deployable codebase with strictly encapsulated domain boundaries and clear interfaces.
  - *Best for*: Growing teams needing domain isolation without the DevOps overhead of microservices.
- **Microservices**: Loosely coupled services owned by independent cross-functional teams, communicating over REST/gRPC/Kafka.
  - *Best for*: Large engineering organizations (50+ devs), independent scaling requirements, heterogeneous tech stacks.

---

#### 14. What is Consistent Hashing and why is it essential for Distributed Caching?
In traditional hash distribution `hash(key) % N`, adding or removing a single node invalidates nearly $100\%$ of keys, causing a catastrophic cache stampede on the underlying database.
- **Consistent Hashing**: Maps both server nodes and data keys to a virtual $360^\circ$ hash ring.
- A key is stored on the first server node encountered clockwise on the ring.
- When a server is added or removed, only $K/N$ keys need remapping (where $K$ is total keys and $N$ is total nodes).
- **Virtual Nodes**: Uses multiple virtual positions per physical server to ensure uniform key distribution and prevent hotspots.

---

#### 15. What is a Bloom Filter and where is it used in System Design?
A Bloom Filter is a space-efficient **probabilistic data structure** used to test whether an element is a member of a set.
- **Guarantees**:
  - *False Positive Rate*: Possible (may say "Item is in set" when it isn't).
  - *False Negative Rate*: **Zero** (if it says "Item is NOT in set", it is definitely not).
- **Use Cases**:
  - **Database Query Avoidance**: Cassandra/BigTable use Bloom filters to avoid reading disk blocks if a row key does not exist.
  - **URL Crawlers**: Prevents web crawlers from re-visiting billions of already indexed URLs.
  - **Cache Miss Elimination**: Checking if a username exists before querying PostgreSQL.

---

#### 16. What is Database Normalization vs Denormalization?
- **Normalization (3NF)**: Organizes tables to eliminate data redundancy and ensure referential integrity. Minimizes storage and prevents write anomalies.
- **Denormalization**: Intentionally adds redundant data or pre-computed aggregates to tables. Eliminates expensive multi-table `JOIN`s to deliver sub-millisecond read latency in read-heavy systems.

---

#### 17. What is the difference between Polling, Long Polling, WebSockets, and Server-Sent Events (SSE)?

| Protocol | Direction | Connection Lifecycle | Best Use Case |
| :--- | :---: | :--- | :--- |
| **Short Polling** | Client $\rightarrow$ Server | Repeated new HTTP requests | Simple, infrequent check |
| **Long Polling** | Client $\rightarrow$ Server | Server holds request open until data arrives | Basic fallback chat |
| **WebSockets** | Bidirectional | Persistent full-duplex TCP channel | Live chat, collaborative canvas, gaming |
| **Server-Sent Events (SSE)** | Server $\rightarrow$ Client | Persistent unidirectional HTTP/2 stream | AI streaming (ChatGPT), live dashboards |

---

#### 18. What is Database Connection Sizing and the Universal Scalability Law?
Having 10,000 open database connections degrades performance because CPU cores spend more time on context-switching and lock contention than executing queries.
- **PostgreSQL Connection Equation**:
  $$\text{Max Pool Connections} = (\text{CPU Cores} \times 2) + \text{Disk Spindle Count}$$
- *Example*: An 8-core database server performs optimally with 16–25 active connections pooled via **PgBouncer**.

---

#### 19. What is a Service Mesh (e.g., Istio, Linkerd)?
A dedicated infrastructure layer of lightweight sidecar network proxies deployed alongside microservice containers.
- **Capabilities**:
  - Transparent Mutual TLS (mTLS) encryption between services.
  - Fine-grained traffic splitting for Canary deployments.
  - Automatic retries, circuit breaking, and load balancing.
  - Distributed tracing and metric collection without touching application code.

---

#### 20. How do you estimate Storage and Bandwidth requirements in System Design interviews?
- **Quick Conversion Reference**:
  - 1 Byte = 8 bits
  - 1 Million requests/day $\approx$ 12 requests/second ($10^6 / 86400$).
  - 1 Billion requests/day $\approx$ 12,000 requests/second.
  - 1 KB = $10^3$ bytes, 1 MB = $10^6$ bytes, 1 GB = $10^9$ bytes, 1 TB = $10^{12}$ bytes.
- *Example*: 100 Million daily active users uploading one 200KB image daily:
  - Storage/day: $100 \times 10^6 \times 200\text{ KB} = 20\text{ TB/day}$.
  - Storage for 5 years: $20\text{ TB} \times 365 \times 5 \approx 36.5\text{ Petabytes}$.

---

### 2. Distributed Systems & High-Level System Designs

---

### Real-World System Architecture Case Studies

#### 21. How would you design a URL Shortener (e.g., Bitly / TinyURL)?
- **Functional Requirements**: Shorten long URL $\rightarrow$ 7-character short URL (`https://short.ly/7bX9k1`), redirect short URL to original destination, analytics (click counts).
- **Scale**: 100M new URLs created/month ($~40$ write QPS), 10 Billion redirects/month ($~4,000$ read QPS, 100:1 read-to-write ratio).

```
[Client] ---> [CloudFront CDN] ---> [Load Balancer]
                                          |
                                    [API Cluster]
                                     /         \
                 [Redis Cache (Hot URLs)]    [Distributed Token Generator (KGS)]
                            |                             |
                 [PostgreSQL / NoSQL DB] <----------------+
```

- **Core Architectural Components**:
  1. **Short Code Generation**:
     - 7 characters using Base62 (`[a-zA-Z0-9]`) yields $62^7 \approx 3.5\text{ Trillion}$ unique combinations.
     - **Key Generation Service (KGS)**: Pre-generates unique 7-character random tokens in memory to avoid hashing collision lookups in the database.
  2. **Database Schema**:
     ```sql
     CREATE TABLE urls (
         short_code VARCHAR(7) PRIMARY KEY,
         original_url TEXT NOT NULL,
         user_id UUID,
         created_at TIMESTAMPTZ DEFAULT NOW(),
         expires_at TIMESTAMPTZ
     );
     ```
  3. **High-Performance Redirects**:
     - Return HTTP `301 Moved Permanently` (browser caches redirect, lower server load) or `302 Found` (routes every click through server for analytics tracking).
     - Store top 20% hot URLs in Redis cache; cache hit ratio $>90\%$.

---

#### 22. How would you design a Real-Time Chat System (e.g., WhatsApp / Slack)?
- **Scale**: 500 Million DAU, 10 Billion messages/day, sub-100ms delivery, online/offline presence status.

```
[Client App] <==== (WebSocket) ====> [Chat Server Cluster]
                                            |
                              [Redis Pub/Sub / Kafka]
                                     /             \
                   [Presence Service]               [Message Queue (BullMQ)]
                                                             |
                                                 [Cassandra / ScyllaDB]
```

- **Core Architectural Components**:
  1. **Real-Time Gateway**: Persistent bidirectional **WebSocket** connections managed by a stateless Chat Gateway cluster.
  2. **Inter-Node Routing (Redis Pub/Sub)**: When User A (connected to Server 1) messages User B (connected to Server 2), Server 1 publishes to User B's channel on Redis. Server 2 receives the event and pushes it down User B's active WebSocket.
  3. **Data Storage (Cassandra / ScyllaDB)**:
     - Chat history is append-only with heavy write volume and queries ordered by time.
     - Primary key: `PRIMARY KEY ((conversation_id), message_time, message_id) WITH CLUSTERING ORDER BY (message_time DESC)`.
  4. **Offline Messages**: If recipient is offline, queue message in Kafka/RabbitMQ and dispatch a push notification via **APNs / FCM**.

---

#### 23. How would you design a Social Media News Feed (e.g., Instagram / Twitter)?
- **Two Core Operations**:
  - **Feed Publishing**: User posts photo/tweet.
  - **Feed Generation**: User opens app to view ranked posts from followed accounts.

```
[Publish Post] ---> [App Server] ---> [Write to Posts DB]
                           |
                     [Fanout Worker]
                     /             \
 [Push to Inactive Queue]    [Fanout-on-Write: Update Followers' Redis Timelines]
```

- **Architectural Approaches**:
  1. **Fanout-on-Read (Pull Model)**:
     - Fetch list of followed users, query their latest posts, and merge-sort in memory.
     - *Pros*: Cheap write operations.
     - *Cons*: Extremely slow read queries for users following 1,000+ accounts.
  2. **Fanout-on-Write (Push Model)**:
     - When a user posts, a background worker pushes the `post_id` into the Redis timeline lists (`ZSet`) of all their followers.
     - *Pros*: Blazing fast reads ($O(1)$ from Redis).
     - *Cons*: **Celebrity Problem**: A user with 50M followers causes 50M Redis writes on every post.
  3. **Hybrid Model (Industry Standard)**:
     - Push model for regular users ($<50,000$ followers).
     - Pull model for celebrities ($>50,000$ followers)—merge celebrity posts dynamically into the user’s feed at read time.

---

#### 24. How would you design a Video Streaming Platform (e.g., YouTube / Netflix)?
- **Key Bottlenecks**: Large file ingestion, multiple bitrates/resolutions, and global edge delivery.

```
[Upload Video] ---> [S3 Temp Bucket] ---> [Transcoding Pipeline]
                                                  |
                             [Encode 1080p / 720p / 480p HLS Chunks]
                                                  |
                                          [S3 Asset Storage]
                                                  |
                                         [Global CDN Edge] ---> [Video Player]
```

- **Core Architectural Components**:
  1. **Video Ingestion**: Direct multipart upload to AWS S3 via Pre-signed URLs.
  2. **Transcoding Pipeline**: Distributed worker pool (AWS Batch / Kafka) splits video into small 2–6 second chunks (`.ts` / `.m4s`) and encodes them into multiple resolutions (1080p, 720p, 480p) using **HLS (HTTP Live Streaming)** or **DASH**.
  3. **Adaptive Bitrate Streaming (ABR)**: Player monitors client network bandwidth and dynamically switches between 1080p and 480p chunks without buffering.
  4. **CDN Edge Caching**: 98%+ of video chunk traffic is served directly from global CDN edge caches.

---

#### 25. How would you design a Distributed Rate Limiter (e.g., Cloudflare API Shield)?
- **Algorithm: Sliding Window Counter with Redis Sorted Sets (ZSet)**:
  - Remove timestamps older than `now - window_size`.
  - Count remaining timestamps in ZSet.
  - If count $< \text{limit}$, add current timestamp `now` and allow request; else drop request (`429 Too Many Requests`).
- **Atomic Execution**: Executed via a **Redis Lua Script** to guarantee atomicity across cluster nodes in $<1\text{ms}$.

---

#### 26. How would you design a Distributed Notification System?
- **Requirements**: Deliver SMS, Email, and Push Notifications reliably with priority queues, rate limiting, and deduplication.
- **Architecture**:
  1. **API Ingestion**: Validates payloads, generates idempotency keys, and writes to Kafka topics partitioned by channel (`notifications.email`, `notifications.push`, `notifications.sms`).
  2. **Worker Pool**: Scalable worker containers consume from topics and dispatch via third-party gateways (Twilio for SMS, SendGrid/SES for Email, FCM/APNs for Push).
  3. **Rate Limiting & User Preferences**: Enforce per-user quiet hours and notification frequency caps.
  4. **Dead Letter Queue (DLQ)**: Failed dispatches retry with exponential backoff and route to DLQ on permanent exhaustion.

---

#### 27. How would you design a High-Scale Payment System (e.g., Stripe / PayPal)?
- **Key Principles**: 100% data consistency, zero double-charges, and strict compliance.
- **Architectural Safeguards**:
  1. **Idempotency Keys**: API enforces unique `Idempotency-Key` headers stored in Redis/DB to guarantee a retried charge never bills twice.
  2. **Double-Entry Bookkeeping**: Every transaction must record balanced debits and credits across ledger accounts ($ \sum \text{Debits} = \sum \text{Credits} $).
  3. **Reconciliation Engine**: Nightly batch jobs compare internal ledger records against external banking/card settlement files to detect anomalies.
  4. **ACID Isolation**: Use PostgreSQL / distributed SQL (CockroachDB) with `SERIALIZABLE` or `REPEATABLE READ` transaction isolation.

---

### Consistency, Distributed Storage & Concurrency

#### 28. Strong Consistency vs Eventual Consistency: Deep Architectural Comparison.
- **Strong Consistency**: All read operations return the result of the most recent write immediately across all replicas.
  - *Trade-off*: Higher write latency and reduced availability during network partitions.
  - *Use Cases*: Financial accounts, seat bookings, stock trading.
- **Eventual Consistency**: Replicas asynchronously sync updates; reads may return stale data temporarily, but all replicas converge eventually.
  - *Trade-off*: Sub-millisecond latency and high availability.
  - *Use Cases*: Social media likes, view counts, product reviews.

---

#### 29. What is a Distributed Lock and how do you implement it safely with Redlock?
A distributed lock ensures mutual exclusion across multiple microservices.
- **Single Redis Instance**: `SET resource_key my_random_token NX PX 30000`. Released atomically via Lua script checking token ownership.
- **Redlock Algorithm (Multi-Node)**:
  1. Acquire lock from $N$ independent Redis master nodes (typically 5).
  2. Lock is valid only if acquired from at least $\lfloor N/2 \rfloor + 1$ nodes within a timeout period smaller than the lock validity time.
  3. Release lock across all instances on completion.

---

#### 30. What is CQRS (Command Query Responsibility Segregation)?
CQRS separates write operations (**Commands**) from read operations (**Queries**).
- **Command Model**: Normalized SQL database optimized for strict business domain validation and ACID transactions.
- **Query Model**: Denormalized read replicas, Elasticsearch, or Redis optimized for low-latency joins and full-text search.
- **Synchronization**: Asynchronously propagated via event streams (Kafka/Debezium CDC).

---

#### 31. What is Event Sourcing?
Instead of storing only the *current state* of an entity, Event Sourcing records the full, immutable history of **state change events** in an append-only Event Store.
- State is reconstructed by replaying past events from the beginning or from the latest snapshot.
- *Benefits*: Perfect audit log, temporal queries (state at any past timestamp), and zero lost historical data.

---

#### 32. What is Database Denormalization and when should you use it?
Denormalization adds redundant columns or pre-aggregated tables to avoid heavy multi-table `JOIN` operations in high-throughput read systems.
- *Example*: Adding `comments_count` directly to a `posts` table instead of running `SELECT COUNT(*) FROM comments WHERE post_id = ?` on every feed load.

---

#### 33. What is a Data Lake vs Data Warehouse?
- **Data Lake (e.g., AWS S3 + Apache Iceberg / Parquet)**: Stores massive volumes of raw, unstructured, semi-structured, and structured data in native format. Highly scalable and cheap.
- **Data Warehouse (e.g., Snowflake, Google BigQuery, AWS Redshift)**: Stores cleaned, transformed, and highly structured data modeled for relational SQL analytical queries and BI reporting.

---

#### 34. What is Distributed Tracing and how do Correlation IDs work?
In microservices, a single client request can trigger 10 downstream API calls.
- **Correlation ID / Trace ID**: An `X-Correlation-ID` header injected at the API Gateway.
- Every downstream service propagates this ID in log statements and HTTP headers.
- Tools like **Jaeger / OpenTelemetry / Zipkin** reconstruct the complete request execution waterfall to isolate latency bottlenecks.

---

#### 35. How do you prevent cascading failures in Microservices?
1. **Circuit Breakers**: Trip open when a service fails, failing fast without draining threads.
2. **Timeouts & Deadlines**: Set strict HTTP/gRPC timeouts (e.g., 2000ms) on all outbound calls.
3. **Bulkheading**: Isolate connection pools per downstream service.
4. **Graceful Degradation**: Return cached or partial results when optional services fail.

---

#### 36. What is Database Connection Starvation and how do you mitigate it?
Occurs when all pooled database connections are held by slow queries or idle transactions, blocking incoming API requests.
- **Mitigation**: Add connection poolers (PgBouncer), enforce strict query timeouts (`statement_timeout = 2000ms`), separate read/write traffic across replicas, and eliminate blocking operations inside DB transactions.

---

### Reliability, Resilience & Consensus Protocols

#### 37. What is Service Discovery and how does it work (e.g., Consul / Eureka)?
In dynamic cloud environments (Kubernetes/AWS), container IP addresses change constantly due to autoscaling and restarts.
- **Service Registry**: A centralized key-value store (Consul, etcd, Eureka) tracking active service instances and their health status.
- **Client-Side Discovery**: Client queries registry and load-balances directly.
- **Server-Side Discovery**: Client queries an internal load balancer (e.g., AWS ALB / K8s ClusterIP) which queries the registry.

---

#### 38. Blue-Green vs Canary vs Rolling Deployments.

```
Blue-Green: [Traffic 100%] ---> [Blue: V1 (Active)]
                                [Green: V2 (Idle/Testing)] -> Switch 100%

Canary:     [Traffic 95%]  ---> [Fleet: V1 (Stable)]
            [Traffic 5%]   ---> [Canary: V2 (Monitoring)]

Rolling:    [V1] [V1] [V1] ---> [V2] [V1] [V1] ---> [V2] [V2] [V1] ---> [V2] [V2] [V2]
```

- **Blue-Green**: Two identical production environments; instant traffic switch with zero-downtime and instant rollback.
- **Canary**: Routes 2–5% of real traffic to the new version to monitor metrics before rolling out to 100%.
- **Rolling**: Sequentially updates instances batch by batch.

---

#### 39. What is Backpressure and how do Stream Pipelines prevent memory exhaustion?
Backpressure is a signaling mechanism where a slow data consumer notifies a fast data producer to pause or slow down message production when its internal buffer reaches capacity (`highWaterMark`), preventing `OutOfMemory` process crashes.

---

#### 40. What is Leader Election and how does the Raft / Paxos consensus protocol work?
Consensus algorithms ensure multiple distributed nodes agree on a single shared state or leader node even when some nodes fail.
- **Raft Protocol**:
  - Nodes exist in one of three states: **Follower**, **Candidate**, or **Leader**.
  - **Heartbeats**: Leader sends regular heartbeats. If followers miss heartbeats within a randomized election timeout, they become Candidates and request votes.
  - **Quorum**: A candidate becomes Leader upon receiving majority votes ($\lfloor N/2 \rfloor + 1$).

---

#### 41. What is the Gossip Protocol?
A decentralized, peer-to-peer communication protocol where nodes periodically exchange state information with a few randomly chosen peers (analogous to how rumors spread).
- Used in **Apache Cassandra**, **Amazon Dynamo**, and **Consul** for cluster node membership, failure detection, and metadata sync.

---

#### 42. What is Two-Phase Commit (2PC) and why is it avoided in modern Microservices?
2PC coordinates distributed transactions across multiple databases via a Coordinator:
- **Phase 1 (Prepare)**: Coordinator asks all participants to prepare and lock resources.
- **Phase 2 (Commit)**: If all agree, coordinator orders commit; else rollback.
- **Why Avoided**: Heavy blocking protocol, severe latency, single point of failure (if coordinator crashes during commit), and poor scalability. Replaced by the **Saga Pattern**.

---

#### 43. What is the Saga Pattern (Orchestration vs Choreography)?
Manages distributed transactions across microservices as a sequence of local transactions:
- **Choreography**: Services listen to domain events and execute local actions independently. (Best for simple workflows).
- **Orchestration**: A central Saga Orchestrator explicitly coordinates step execution and issues **Compensating Transactions** (e.g., refund payment) if a step fails. (Best for complex multi-step workflows).

---

#### 44. What is a Dead Letter Queue (DLQ)?
A specialized message queue where messages that fail processing after maximum retry attempts are routed. Prevents toxic messages from blocking the main queue and allows engineers to inspect and replay failed payloads.

---

#### 45. What is Shard Rebalancing and why is it complex?
When data grows beyond existing shards or nodes fail, data must be migrated to new shards without downtime.
- **Solution**: Use **Consistent Hashing** with virtual nodes or pre-split partitions (e.g., 1024 virtual shards mapped to physical nodes) so rebalancing only transfers a subset of partitions between servers.

---

#### 46. What is Write Amplification in Storage Engines?
The ratio of bytes written to persistent storage compared to the actual logical payload bytes requested.
- Common in **LSM-Trees (Log-Structured Merge Trees)** and SSDs due to continuous background compaction and garbage collection.

---

#### 47. What is Database Connection Pooling and Connection Leaks?
- **Pooling**: Maintaining a cache of established database socket connections ready for reuse.
- **Connection Leak**: Occurs when application code acquires a connection from the pool but fails to release it back in a `finally` block or on error, eventually draining the pool and freezing the application.

---

#### 48. What is Idempotency and how do you design Idempotent APIs?
An operation is idempotent if executing it multiple times produces the exact same result as executing it once ($f(f(x)) = f(x)$).
- `GET`, `PUT`, `DELETE` are idempotent by HTTP spec.
- `POST` is made idempotent by attaching a unique `Idempotency-Key` header verified against Redis/DB before processing.

---

#### 49. How do you design an Analytics & Metrics Ingestion Pipeline for 1 Billion events/day?
- **Architecture**:
  1. **Edge Collectors**: Lightweight Nginx/Go collectors accept events and batch writes to **Apache Kafka**.
  2. **Stream Processing**: **Apache Flink / Spark Streaming** reads from Kafka to perform windowed aggregations (e.g., unique visitors per minute).
  3. **Columnar Storage**: Ingests aggregated metrics into **ClickHouse** or **Snowflake** for sub-second analytical dashboard queries.

---

#### 50. What is the Golden Rule of System Design Interviews?
> **Always drive the discussion with trade-offs**. There is no single "perfect" architecture—every technical choice involves trade-offs between **Latency vs Consistency**, **Cost vs Availability**, and **Simplicity vs Scalability**. Clearly articulating *why* you chose a specific tool or architecture for the specific constraints given is what distinguishes a Senior/Principal Engineer.

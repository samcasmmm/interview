# 🛠️ Other Technologies Around MERN & Cloud Interview Master Guide

> A comprehensive study guide containing **50 in-depth interview questions and production-ready code examples** covering Git internals, Docker containerization, Nginx reverse proxying & load balancing, Redis caching architectures, Linux process management, PM2 zero-downtime clustering, CI/CD pipelines, AWS cloud infrastructure, Webhooks, and Microservices communication.

---

## 📑 Table of Contents

- [1. Git & Version Control (Q1–Q8)](#1-git--version-control)
- [2. Docker & Containerization (Q9–Q17)](#2-docker--containerization)
- [3. Nginx, Web Servers & Reverse Proxies (Q18–Q24)](#3-nginx-web-servers--reverse-proxies)
- [4. Redis & In-Memory Caching (Q25–Q32)](#4-redis--in-memory-caching)
- [5. Linux Process Management & PM2 (Q33–Q38)](#5-linux-process-management--pm2)
- [6. CI/CD & Automated Pipelines (Q39–Q43)](#6-cicd--automated-pipelines)
- [7. Cloud & AWS Infrastructure (Q44–Q48)](#7-cloud--aws-infrastructure)
- [8. Webhooks, Microservices & Architecture (Q49–Q50)](#8-webhooks-microservices--architecture)

---

# 🚀 50 In-Depth Interview Questions

---

### 1. Git & Version Control

#### 1. What is the difference between `git merge` and `git rebase`?

- **`git merge`**: Creates a new **merge commit** preserving the complete, non-linear chronological history of both branches. It is non-destructive and safe for shared public branches.
- **`git rebase`**: Rewrites project history by moving or reapplying your feature branch commits sequentially on top of the target base branch tip. It creates a clean, linear commit history, but you should never rebase shared public branches.

```bash
# Merge: preserves full branch history with a merge commit
git checkout main
git merge feature-auth

# Rebase: replays feature-auth commits on top of main (linear history)
git checkout feature-auth
git rebase main

# Interactive Rebase: squash, edit, or reword last 3 commits before merging
git rebase -i HEAD~3
```

---

#### 2. What is `git cherry-pick` and when should it be used?

`git cherry-pick <commit-hash>` applies the exact changes from a specific commit on one branch directly onto your currently checked-out branch without merging the entire branch.

- **Use Cases**:
  - Hotfixing a bug in production by pulling a fix commit from `main`/`develop` into a release branch.
  - Salvaging a specific feature or bugfix from an abandoned experiment branch.

```bash
# Switch to production hotfix branch
git checkout release-v1.4

# Cherry-pick a specific fix commit from main
git cherry-pick a1b2c3d4

# Cherry-pick without automatically committing (staging changes only)
git cherry-pick -n e5f6g7h8
```

---

#### 3. How does `git stash` work (`stash pop` vs `stash apply`)?

`git stash` temporarily shelves (or stashes) modified and staged tracking changes so you can work on a clean working directory without committing incomplete work.

- **`git stash pop`**: Applies the topmost stashed changes and **removes** them from the stash list.
- **`git stash apply`**: Applies the stashed changes while **retaining** them in the stash stack for potential reuse.

```bash
# Stash tracked and untracked files with a descriptive message
git stash push -u -m "WIP: login form validation"

# Inspect stash list
git stash list

# Apply stash without deleting it from stash stack
git stash apply stash@{0}

# Pop and discard topmost stash
git stash pop
```

---

#### 4. Difference between `git reset` (soft, mixed, hard) and `git revert`.

- **`git reset`** modifies the `HEAD` pointer and moves it backward in history (rewrites local history):
  - `--soft`: Moves `HEAD` back; leaves changes staged in Index.
  - `--mixed` (default): Moves `HEAD` back; unstages changes into Working Directory.
  - `--hard`: Moves `HEAD` back; permanently deletes all staged and unstaged working directory changes.
- **`git revert`**: Creates a **brand new commit** that inverses the changes of an older commit. Safe for public branches.

```bash
# Undo last commit but keep code staged in index
git reset --soft HEAD~1

# Discard all local commits and uncommitted file edits back to remote main
git reset --hard origin/main

# Safely revert a faulty commit already pushed to production
git revert 9c4f82a
```

---

#### 5. How do you resolve a Git merge conflict and what does `git bisect` do?

- **Merge Conflict Resolution**:
  1. Git marks conflicting lines between `<<<<<<< HEAD`, `=======`, and `>>>>>>> branch-name`.
  2. Developers edit the file to pick the correct logic and remove conflict markers.
  3. Stage the resolved files with `git add <file>` and complete with `git commit`.
- **`git bisect`**: Uses binary search across commit history to quickly isolate the exact commit that introduced a bug or regression.

```bash
# Find bug with binary search
git bisect start
git bisect bad                 # Current commit is broken
git bisect good v1.2.0         # Version 1.2.0 was known to be working

# Git checks out intermediate commits automatically:
git bisect good   # or 'git bisect bad' after running tests

# Reset back to original HEAD when finished
git bisect reset
```

---

#### 6. What are the key Git branching strategies?

1. **Git Flow**: Heavyweight strategy with long-lived branches (`main`, `develop`, `release/*`, `feature/*`, `hotfix/*`). Well-suited for scheduled enterprise releases.
2. **GitHub Flow**: Lightweight strategy centered around short-lived feature branches branched off `main`, merged via Pull Requests and continuously deployed.
3. **Trunk-Based Development**: Developers merge small, frequent updates directly into `main` (trunk) multiple times a day, relying heavily on automated CI tests and feature flags.

---

#### 7. What are Git Hooks and how does Husky work in JavaScript/MERN projects?

Git Hooks are custom scripts triggered automatically at key points in the Git workflow (e.g., `pre-commit`, `commit-msg`, `pre-push`).

- **Husky**: A popular npm tool that shares Git hooks across a development team via version control to run linters (ESLint), formatters (Prettier), type-checks (`tsc`), or test suites before code is committed.

```json
// package.json with Husky & lint-staged
{
  "scripts": {
    "prepare": "husky install"
  },
  "lint-staged": {
    "*.{js,ts,jsx,tsx}": ["eslint --fix", "prettier --write"]
  }
}
```

```bash
# .husky/pre-commit
#!/usr/bin/env sh
. "$(dirname -- "$0")/_/husky.sh"

npx lint-staged
```

---

#### 8. What is `git reflog` and how can it recover "lost" commits or deleted branches?

`git reflog` (Reference Log) records every movement of `HEAD` in your local repository (commits, checkouts, resets, merges, rebases). Even if you delete a branch or perform an accidental `git reset --hard`, the commits remain in the Git object database for a grace period (typically 30–90 days).

```bash
# View HEAD history
git reflog
# Output:
# 3a1f94b HEAD@{0}: reset: moving to HEAD~2
# 8b2c41e HEAD@{1}: commit: Add user billing webhook

# Recover the lost commit:
git checkout -b recovered-branch 8b2c41e
```

---

### 2. Docker & Containerization

#### 9. What is Docker, and what is the difference between an Image, Container, and Dockerfile?

- **Dockerfile**: A plain-text configuration file containing step-by-step instructions to assemble a container environment.
- **Docker Image**: An immutable, read-only package containing application code, runtime, system libraries, and dependencies.
- **Docker Container**: A runnable, isolated instance of a Docker image with a read-write layer on top.

```dockerfile
# Dockerfile example
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 3000
CMD ["node", "src/server.js"]
```

---

#### 10. Container vs Virtual Machine (VM): What are the core architectural differences?

- **Virtual Machines**: Include a full Guest OS on top of a hypervisor (Type 1 or Type 2). High memory footprint, slower startup times (minutes), heavy resource overhead.
- **Containers**: Share the host OS kernel and isolate processes using Linux kernel primitives (**Namespaces** for process/network/mount isolation and **cgroups** for CPU/RAM limits). Fast startup (milliseconds) and minimal resource overhead.

| Feature          | Virtual Machine (VM)          | Docker Container                       |
| :--------------- | :---------------------------- | :------------------------------------- |
| **OS Kernel**    | Dedicated Guest OS per VM     | Shared Host OS Kernel                  |
| **Isolation**    | Hardware-level via Hypervisor | Process-level via Namespaces & Cgroups |
| **Startup Time** | 30s to several minutes        | Sub-second to few seconds              |
| **Storage Size** | Gigabytes (GBs)               | Megabytes (MBs)                        |

---

#### 11. What is a Docker Multi-Stage Build and why is it essential for Node/React apps?

Multi-stage builds allow you to use multiple `FROM` statements in a single Dockerfile. Heavy build dependencies (compilers, TypeScript `tsc`, `devDependencies`, build tools) remain in earlier build stages and are excluded from the final production runtime image, minimizing image size and attack surface.

```dockerfile
# Stage 1: Build stage
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json tsconfig.json ./
RUN npm ci
COPY src/ ./src
RUN npm run build # Compiles TypeScript to dist/

# Stage 2: Minimal production runtime stage
FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY package*.json ./
RUN npm ci --only=production
COPY --from=builder /app/dist ./dist

USER node
EXPOSE 4000
CMD ["node", "dist/index.js"]
```

---

#### 12. Docker Volumes vs Bind Mounts vs tmpfs mounts.

- **Named Volumes**: Managed entirely by Docker (`/var/lib/docker/volumes/`). Best for database persistence (Postgres, MongoDB) across container lifecycles.
- **Bind Mounts**: Maps an exact directory or file from the host filesystem into the container. Ideal for local development live-reloading.
- **tmpfs Mounts**: Stored only in host memory (RAM), never written to disk. Ideal for sensitive secrets or temporary high-speed scratchpads.

```bash
# Named volume for persistent database storage
docker run -d --name pg-db -v pgdata:/var/lib/postgresql/data -p 5432:5432 postgres:16-alpine

# Bind mount for live development
docker run -d --name api-dev -v $(pwd):/app -v /app/node_modules -p 3000:3000 node:20-alpine
```

---

#### 13. What are Docker Network Modes?

1. **`bridge`** (default): Creates a private virtual network on the host; containers communicate via container names or internal IPs with port mapping (`-p 8080:80`).
2. **`host`**: Removes network isolation between the container and Docker host; container binds directly to host network interface.
3. **`overlay`**: Enables multi-host networking across different Docker daemons (used in Docker Swarm & Kubernetes clusters).
4. **`none`**: Disables all external networking for maximum security.

---

#### 14. What is Docker Compose and how do you orchestrate a multi-tier MERN stack?

Docker Compose is a declarative tool for defining and running multi-container Docker applications using a `docker-compose.yml` configuration file.

```yaml
# docker-compose.yml
version: '3.8'

services:
  api:
    build:
      context: ./backend
      dockerfile: Dockerfile
    ports:
      - '5000:5000'
    environment:
      - PORT=5000
      - MONGO_URI=mongodb://mongo:27017/appdb
      - REDIS_HOST=redis
    depends_on:
      - mongo
      - redis
    restart: unless-stopped

  mongo:
    image: mongo:7.0
    ports:
      - '27017:27017'
    volumes:
      - mongo_data:/data/db

  redis:
    image: redis:7-alpine
    ports:
      - '6379:6379'

volumes:
  mongo_data:
```

---

#### 15. How do Docker Layer Caching and ordering affect build performance?

Each command in a Dockerfile (`RUN`, `COPY`, `ADD`) generates a read-only cached layer. If a layer hasn't changed, Docker reuses the cached version.

- **Optimization Rule**: Order instructions from **least frequently changing** to **most frequently changing**.
- Always copy `package.json` and install dependencies _before_ copying the rest of application source code.

```dockerfile
# ❌ Inefficient: Code edit invalidates cache, forcing npm install every build
COPY . .
RUN npm install

# ✅ Highly Efficient: npm install is cached unless package.json changes
COPY package*.json ./
RUN npm ci
COPY . .
```

---

#### 16. What are Docker container security best practices?

- **Run as non-root user**: Specify `USER node` or create an unprivileged user inside the container.
- **Use minimal base images**: Prefer `alpine` or Google `distroless` images.
- **Use `.dockerignore`**: Exclude `.git`, `node_modules`, `.env`, and local build artifacts.
- **Scan for vulnerabilities**: Use `docker scout` or `trivy` to detect CVEs in base images and packages.
- **Make Root Filesystem Read-Only**: Use `--read-only` flag when feasible.

---

#### 17. What is the difference between Docker, Containerd, and Kubernetes (K8s)?

- **Docker**: A complete developer platform for building, running, and managing containers with a CLI, daemon, and image builder.
- **Containerd**: The core low-level container runtime (standardized under OCI) responsible for pulling images, managing storage, and running containers.
- **Kubernetes (K8s)**: An enterprise container orchestrator that manages thousands of containers across multiple server clusters, handling auto-scaling, self-healing, rolling updates, and service discovery.

---

### 3. Nginx, Web Servers & Reverse Proxies

#### 18. What is Nginx and why is it preferred over traditional multi-threaded web servers?

Nginx uses an **event-driven, asynchronous, non-blocking architecture** with a small number of worker processes running an event loop (using `epoll` on Linux or `kqueue` on BSD). Unlike traditional thread-per-request servers (like Apache MPM Prefork) which consume substantial RAM and encounter thread context-switching overhead under load, Nginx can comfortably handle 10,000+ concurrent connections (`C10k problem`) with minimal memory consumption.

---

#### 19. What is the difference between a Forward Proxy and a Reverse Proxy?

- **Forward Proxy**: Acts on behalf of the **client**. Sits between client and the public internet to bypass firewalls, mask client IP addresses, or filter outbound enterprise requests.
- **Reverse Proxy**: Acts on behalf of the **backend servers**. Sits in front of internal web services to intercept incoming client requests, route traffic, terminate SSL, load balance, and cache responses. Clients are unaware of the underlying internal servers.

```
Forward Proxy:  [Client] -> [Forward Proxy] -> (Public Internet) -> [Target Server]
Reverse Proxy:  [Client] -> (Public Internet) -> [Nginx Reverse Proxy] -> [App Server 1 / 2 / 3]
```

---

#### 20. How do you configure Nginx as a Reverse Proxy with Load Balancing for Node.js apps?

```nginx
# /etc/nginx/conf.d/app.conf
upstream nodejs_cluster {
    # Load balancing across 3 backend instances
    least_conn; # Route to instance with fewest active connections
    server 127.0.0.1:3001 max_fails=3 fail_timeout=10s;
    server 127.0.0.1:3002 max_fails=3 fail_timeout=10s;
    server 127.0.0.1:3003 max_fails=3 fail_timeout=10s;
}

server {
    listen 80;
    server_name api.example.com;

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;

    location / {
        proxy_pass http://nodejs_cluster;
        proxy_http_version 1.1;

        # Forward real client headers to Express
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;

        # Proxy timeouts
        proxy_connect_timeout 60s;
        proxy_read_timeout 60s;
    }
}
```

---

#### 21. What load balancing algorithms are supported in Nginx?

1. **Round Robin** (default): Distributes incoming requests sequentially down the list of servers.
2. **Least Connections (`least_conn`)**: Forwards requests to the server with the lowest number of active client connections. Ideal for long-lived operations.
3. **IP Hash (`ip_hash`)**: Hashes client IP address to ensure a specific client consistently routes to the same backend server (useful for stateful sessions).
4. **Weighted (`weight=N`)**: Distributes traffic proportionally based on server hardware capacity.
5. **Generic Hash / Key**: Routes based on a custom key like URI or request parameter.

---

#### 22. How does Nginx handle SSL/TLS Termination and HTTP to HTTPS redirection?

SSL termination decrypts incoming HTTPS traffic at the Nginx edge server so internal backend services can communicate over unencrypted, high-speed HTTP, reducing CPU encryption overhead on application servers.

```nginx
# Redirect HTTP to HTTPS
server {
    listen 80;
    server_name example.com www.example.com;
    return 301 https://$host$request_uri;
}

# HTTPS Server block
server {
    listen 443 ssl http2;
    server_name example.com www.example.com;

    ssl_certificate /etc/letsencrypt/live/example.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/example.com/privkey.pem;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;

    location / {
        proxy_pass http://127.0.0.1:3000;
    }
}
```

---

#### 23. How do you configure Gzip Compression and Static File Caching in Nginx?

```nginx
server {
    listen 80;
    server_name app.example.com;
    root /var/www/frontend/dist;
    index index.html;

    # Gzip Compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_proxied any;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml image/svg+xml;

    # Serve static assets with long cache TTL
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
        access_log off;
    }

    # SPA Client-side routing fallback (React / Vue / Vite)
    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

---

#### 24. How do you configure Nginx to proxy WebSocket connections (Socket.io / ws)?

WebSockets start as an HTTP handshake and upgrade to a persistent, bidirectional TCP connection. Nginx requires explicit `Upgrade` and `Connection` headers to maintain this channel.

```nginx
location /socket.io/ {
    proxy_pass http://127.0.0.1:5000;
    proxy_http_version 1.1;

    # Required for WebSocket handshake upgrade
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection "upgrade";

    proxy_set_header Host $host;
    proxy_cache_bypass $http_upgrade;
    proxy_read_timeout 86400s; # Keep alive for 24 hours
}
```

---

### 4. Redis & In-Memory Caching

#### 25. What is Redis and what are its primary data structures?

Redis (Remote Dictionary Server) is an open-source, in-memory key-value data structure store delivering sub-millisecond responses.

- **Primary Data Structures**:
  1. **Strings**: Plain text, JSON strings, counters (`INCR`, `DECR`).
  2. **Hashes**: Field-value pairs representing objects (`HSET`, `HGETALL`).
  3. **Lists**: Linked lists ordered by insertion (`LPUSH`, `RPOP`). Great for queues.
  4. **Sets**: Unordered collection of unique strings (`SADD`, `SINTER`, `SMEMBERS`).
  5. **Sorted Sets (ZSet)**: Sets ordered by a floating-point score (`ZADD`, `ZRANGEBYSCORE`). Ideal for leaderboards and rate limiting.
  6. **Bitmaps / HyperLogLogs**: Efficient probabilistic counters for unique DAU tracking.
  7. **Streams**: Append-only log for event sourcing and messaging.

```javascript
import { createClient } from 'redis';
const redis = createClient();
await redis.connect();

// String with TTL (in seconds)
await redis.set('user:101', JSON.stringify({ name: 'Alice' }), { EX: 3600 });

// Hash
await redis.hSet('session:xyz', { userId: '101', role: 'admin' });

// Sorted Set for Leaderboard
await redis.zAdd('leaderboard', { score: 950, value: 'player_one' });
```

---

#### 26. Explain the common Caching Strategies (Cache-Aside, Write-Through, Write-Back).

1. **Cache-Aside (Lazy Loading)**:
   - Application queries cache first. If found (_cache hit_), returns data.
   - If not found (_cache miss_), queries DB, populates cache with a TTL, and returns data.
2. **Write-Through**: Application writes data to the cache and database simultaneously. Ensures data consistency at the expense of higher write latency.
3. **Write-Back (Write-Behind)**: Application writes immediately to cache; cache asynchronously batches writes to the persistent DB in the background. High write performance, but risks data loss on cache crash.

```javascript
// Cache-Aside implementation in Node.js
async function getUserProfile(userId) {
  const cacheKey = `user:profile:${userId}`;

  // 1. Check Redis Cache
  const cachedData = await redis.get(cacheKey);
  if (cachedData) {
    return JSON.parse(cachedData); // Cache Hit
  }

  // 2. Cache Miss: Query SQL/Mongo Database
  const user = await db.users.findById(userId);
  if (user) {
    // 3. Save to Redis with 1 hour expiration
    await redis.set(cacheKey, JSON.stringify(user), { EX: 3600 });
  }

  return user;
}
```

---

#### 27. What is Cache Invalidation, TTL, and how do you prevent Cache Stampede (Dogpiling)?

- **Cache Invalidation**: Purging or updating cached values when source database records change.
- **TTL (Time-To-Live)**: Automatic expiration timestamp to prevent stale memory bloat.
- **Cache Stampede (Dogpiling)**: When a heavily queried hot key expires, thousands of simultaneous concurrent requests experience a cache miss and overwhelm the backend database at once.
- **Mitigation**:
  - **Mutex / Distributed Lock**: Only the first worker acquires a lock to recompute the cache while other requests wait.
  - **Probabilistic Early Expiration (XFetch)**: Recomputes cache in background shortly before expiry.

---

#### 28. What are Redis Memory Eviction Policies?

When Redis hits `maxmemory`, it evicts keys according to the configured policy:

- **`noeviction`** (default): Returns error on write operations when memory is full.
- **`allkeys-lru`**: Evicts least recently used keys out of all keys. (Most popular for web caching).
- **`volatile-lru`**: Evicts least recently used keys among those with an active `TTL` set.
- **`allkeys-lfu`**: Evicts least frequently used keys across the entire dataset.
- **`volatile-ttl`**: Evicts keys with the shortest remaining TTL.

---

#### 29. Redis Persistence: What is the difference between RDB and AOF?

- **RDB (Redis Database Snapshots)**:
  - Takes point-in-time binary snapshots of the entire memory dataset at configured intervals (e.g., every 5 minutes).
  - Compact file size, fast server restart, but risks losing recent minutes of data if server crashes between snapshots.
- **AOF (Append Only File)**:
  - Logs every write command received by the server to an append-only log file (`fsync everysec`).
  - High data durability, minimal data loss, but larger file sizes and slower startup times.
- **Production Standard**: Use **Hybrid Persistence (RDB + AOF)** combined.

---

#### 30. Redis Pub/Sub vs Redis Streams vs BullMQ Job Queue.

- **Pub/Sub**: Fire-and-forget message broadcasting. If a subscriber is offline, it loses messages permanently. No message history or persistence.
- **Redis Streams**: Persistent append-only event log with consumer groups, message acknowledgement (`XACK`), and historical replay.
- **BullMQ**: Production-grade NodeJS background job and message queue built on Redis, supporting delayed jobs, priority queues, automated retries, rate limiting, and parent-child jobs.

```javascript
import { Queue, Worker } from 'bullmq';

// Create queue
const emailQueue = new Queue('email-queue', { connection: { host: 'localhost', port: 6379 } });

// Producer: Add delayed job with 3 automatic retries
await emailQueue.add(
  'send-welcome-email',
  { email: 'user@test.com' },
  {
    attempts: 3,
    backoff: { type: 'exponential', delay: 2000 },
    delay: 5000, // Send after 5 seconds
  },
);

// Consumer Worker
const worker = new Worker(
  'email-queue',
  async (job) => {
    console.log(`Processing email job ${job.id} for ${job.data.email}`);
    await sendActualEmail(job.data.email);
  },
  { connection: { host: 'localhost', port: 6379 } },
);
```

---

#### 31. How do you implement a Distributed Lock in Redis?

A distributed lock ensures that only one microservice instance executes a critical section (e.g., processing a payment or generating an invoice).

- Uses `SET key value NX PX <milliseconds>`:
  - `NX`: Set only if key does not already exist.
  - `PX`: Auto-release lock after TTL to prevent deadlocks if the node crashes.
  - Value is a unique identifier (UUID) to ensure a node only releases its own lock via a Lua script.

```javascript
// Distributed Lock Acquisition & Release
async function acquireLock(lockKey, uniqueToken, ttlMs = 5000) {
  const result = await redis.set(lockKey, uniqueToken, { NX: true, PX: ttlMs });
  return result === 'OK';
}

async function releaseLock(lockKey, uniqueToken) {
  // Atomic release using Lua script to verify ownership
  const luaScript = `
    if redis.call("get", KEYS[1]) == ARGV[1] then
      return redis.call("del", KEYS[1])
    else
      return 0
    end
  `;
  return await redis.eval(luaScript, { keys: [lockKey], arguments: [uniqueToken] });
}
```

---

#### 32. How do you implement API Rate Limiting with Redis?

Rate limiting prevents abuse and DDoS attacks by restricting clients to $N$ requests per window.

- **Sliding Window Log / Counter with Redis Sorted Sets (ZSet)**:

```javascript
// Sliding Window Rate Limiter (e.g., max 100 requests per 60 seconds)
async function isRateLimited(userId, limit = 100, windowSec = 60) {
  const key = `ratelimit:${userId}`;
  const now = Date.now();
  const clearBefore = now - windowSec * 1000;

  const multi = redis.multi();
  multi.zRemRangeByScore(key, 0, clearBefore); // Remove expired requests
  multi.zAdd(key, { score: now, value: `${now}:${Math.random()}` }); // Add current request
  multi.zCard(key); // Count active requests in window
  multi.expire(key, windowSec); // Set TTL

  const results = await multi.exec();
  const requestCount = results[2];

  return requestCount > limit; // true if limit exceeded
}
```

---

### 5. Linux Process Management & PM2

#### 33. What are essential Linux diagnostic commands for backend engineers?

- `ps aux | grep node`: List running processes and their PIDs.
- `top` / `htop`: Interactive real-time CPU, RAM, and process monitoring.
- `lsof -i :3000` / `ss -tulpn`: Check which process is listening on a specific network port.
- `netstat -an | grep 5432`: Inspect active network socket connections.
- `df -h` & `du -sh *`: Check disk space usage and folder sizes.
- `journalctl -u nginx -f`: Follow real-time systemd service logs.
- `kill -9 <PID>` / `kill -15 <PID>`: Terminate process forcefully (`SIGKILL`) or gracefully (`SIGTERM`).

---

#### 34. Linux Process Signals and Graceful Shutdown in Node.js.

- **`SIGINT`** (Signal Interrupt - Ctrl+C) and **`SIGTERM`** (Signal Terminate - default kill signal from Docker/K8s/PM2) request clean termination.
- **`SIGKILL`** (Signal Kill - `kill -9`): Immediate uncatchable kill by OS kernel (risks database corruption and interrupted transactions).

```javascript
// Graceful Shutdown Pattern in Express.js
const server = app.listen(3000, () => console.log('Server online'));

function gracefulShutdown(signal) {
  console.log(`Received ${signal}. Closing HTTP server and database connections...`);

  server.close(async () => {
    console.log('HTTP server closed. No new requests accepted.');
    try {
      await mongoose.connection.close(false);
      await redisClient.quit();
      console.log('Database & Redis connections closed cleanly.');
      process.exit(0);
    } catch (err) {
      console.error('Error during shutdown:', err);
      process.exit(1);
    }
  });

  // Force exit after 10 seconds if shutdown hangs
  setTimeout(() => {
    console.error('Forced shutdown timeout reached.');
    process.exit(1);
  }, 10000);
}

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));
```

---

#### 35. What is PM2 and why use Cluster Mode over Fork Mode?

PM2 is an enterprise production process manager for Node.js.

- **Fork Mode**: Runs a single Node.js process instance.
- **Cluster Mode**: Uses Node's built-in `cluster` module to spawn multiple worker processes (one per CPU core) that share the exact same server port, maximizing multi-core CPU utilization and increasing throughput without code changes.

```bash
# Start in cluster mode utilizing all available CPU cores
pm2 start app.js -i max --name "prod-api"

# Monitor CPU and memory usage
pm2 monit

# Save process list to resurrect on server reboot
pm2 save
pm2 startup
```

---

#### 36. What is Zero-Downtime Reload in PM2 (`pm2 reload` vs `pm2 restart`)?

- **`pm2 restart`**: Kills all worker processes simultaneously and restarts them (causes a brief service outage / downtime).
- **`pm2 reload`**: Restarts worker processes **one by one (rolling fashion)**. It waits for the new worker to come online and begin receiving traffic before terminating the old worker, resulting in $0$ seconds of downtime.

```javascript
// ecosystem.config.js for PM2
module.exports = {
  apps: [
    {
      name: 'mern-backend',
      script: './dist/server.js',
      instances: 'max',
      exec_mode: 'cluster',
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
      env_production: {
        NODE_ENV: 'production',
        PORT: 5000,
      },
    },
  ],
};
```

---

#### 37. Linux File Permissions: Explain `chmod`, `chown`, and octal permissions (`755` vs `644`).

- **Permission Matrix**: `r` (Read = 4), `w` (Write = 2), `x` (Execute = 1).
- Three User Categories: **Owner**, **Group**, **Others**.
  - **`755`** (`rwxr-xr-x`): Owner has full read/write/execute ($4+2+1=7$). Group & Others can read and execute ($4+1=5$). Standard for directories and executable scripts.
  - **`644`** (`rw-r--r--`): Owner can read and write ($4+2=6$). Group & Others can read only ($4$). Standard for public web files.
  - **`chown -R www-data:www-data /var/www/app`**: Recursively changes user and group ownership.

---

#### 38. How do you create a Linux Systemd Service to manage a background daemon?

```ini
# /etc/systemd/system/nodeapp.service
[Unit]
Description=Node.js Production Application
After=network.target mongodb.service

[Service]
Type=simple
User=ubuntu
WorkingDirectory=/var/www/nodeapp
ExecStart=/usr/bin/node /var/www/nodeapp/dist/server.js
Restart=always
RestartSec=5
Environment=NODE_ENV=production PORT=8080

[Install]
WantedBy=multi-user.target
```

```bash
# Enable on boot and start service
sudo systemctl daemon-reload
sudo systemctl enable nodeapp
sudo systemctl start nodeapp
sudo systemctl status nodeapp
```

---

### 6. CI/CD & Automated Pipelines

#### 39. What is CI/CD and what are the core differences between CI, CDelivery, and CDeployment?

- **Continuous Integration (CI)**: Automates building and testing code whenever a developer pushes a branch or opens a Pull Request, catching merge defects and lint issues early.
- **Continuous Delivery (CD)**: Automatically tests and builds deployment artifacts (e.g., Docker image) and stages them for release, requiring a manual human approval button to trigger production deployment.
- **Continuous Deployment (CD)**: Every commit that passes automated CI pipelines is automatically and safely deployed straight to production without manual intervention.

---

#### 40. Write a complete GitHub Actions CI/CD pipeline for a MERN / TypeScript application.

```yaml
# .github/workflows/deploy.yml
name: CI/CD Pipeline

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  test-and-lint:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout Code
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'

      - name: Install Dependencies
        run: npm ci

      - name: Run Linter
        run: npm run lint

      - name: Run Unit Tests
        run: npm test -- --coverage

  build-and-push-docker:
    needs: test-and-lint
    if: github.ref == 'refs/heads/main' && github.event_name == 'push'
    runs-on: ubuntu-latest
    steps:
      - name: Checkout Code
        uses: actions/checkout@v4

      - name: Log in to Docker Hub
        uses: docker/login-action@v3
        with:
          username: ${{ secrets.DOCKERHUB_USERNAME }}
          password: ${{ secrets.DOCKERHUB_TOKEN }}

      - name: Build and Push Docker Image
        uses: docker/build-push-action@v5
        with:
          context: .
          push: true
          tags: ${{ secrets.DOCKERHUB_USERNAME }}/mern-app:latest
```

---

#### 41. How should Secrets, API Keys, and Environment Variables be managed in CI/CD?

- Never commit `.env` or raw credentials into Git.
- Use encrypted repository secret managers (e.g., GitHub Secrets, AWS Secrets Manager, HashiCorp Vault).
- Inject secrets as masked environment variables during pipeline runtime.
- Use automated scanners (e.g., Gitleaks, GitGuardian) to block commits containing sensitive strings.

---

#### 42. Deployment Strategies: Blue-Green vs Canary vs Rolling Deployments.

- **Blue-Green Deployment**:
  - Maintains two identical production environments: Blue (Active) and Green (Idle with new release).
  - Once Green passes health checks, the load balancer switches 100% of traffic to Green instantly. Rapid rollback if issues arise.
- **Canary Deployment**:
  - Routes a small percentage of real user traffic (e.g., 5%) to the new release while monitoring error rates. Gradually scales to 100% if stable.
- **Rolling Deployment**:
  - Sequentially updates nodes/pods one batch at a time until the entire fleet runs the new version.

---

#### 43. What is Infrastructure as Code (IaC) and how does Terraform work?

Infrastructure as Code manages and provisions cloud resources (servers, databases, VPCs, DNS records) via declarative machine-readable configuration files rather than manual web console clicks.

- **Terraform Workflow**:
  1. `terraform init`: Initializes provider plugins (AWS, GCP, Azure).
  2. `terraform plan`: Generates an execution spec showing what will be created, updated, or destroyed.
  3. `terraform apply`: Provisions real cloud infrastructure and updates state file `terraform.tfstate`.

---

### 7. Cloud & AWS Infrastructure

#### 44. AWS EC2 vs AWS Lambda (Serverless): Key architectural trade-offs.

- **AWS EC2**:
  - Virtual servers in the cloud with complete OS control.
  - Predictable cost for steady 24/7 workloads, zero cold starts, but requires OS patching, scaling configuration, and maintenance.
- **AWS Lambda**:
  - Event-driven compute service running functions on-demand without server management.
  - Auto-scales instantly from 0 to thousands of requests, pay only for execution milliseconds ($0$ when idle).
  - Trade-offs: 15-minute maximum execution limit, stateless, and cold start latency on initial invocations.

---

#### 45. AWS S3: What are Buckets, Object Storage, and Pre-signed URLs?

AWS S3 (Simple Storage Service) is highly durable (99.999999999% - 11 9's) object storage for storing images, documents, and backups.

- **Pre-Signed URLs**: Allows a backend server to generate a secure, temporary cryptographic URL that grants a frontend client direct upload/download access to S3 without exposing AWS secret keys or routing large files through the backend API server.

```javascript
// Generate S3 Pre-signed Upload URL in Node.js
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

const s3 = new S3Client({ region: 'us-east-1' });

async function generateUploadUrl(fileName, fileType) {
  const command = new PutObjectCommand({
    Bucket: 'my-app-uploads-bucket',
    Key: `avatars/${Date.now()}-${fileName}`,
    ContentType: fileType,
  });

  // URL expires in 5 minutes (300 seconds)
  const uploadUrl = await getSignedUrl(s3, command, { expiresIn: 300 });
  return uploadUrl;
}
```

---

#### 46. What is AWS CloudFront (CDN) and how does Edge Caching work?

AWS CloudFront is a global Content Delivery Network (CDN) that securely caches and delivers static assets, API responses, and video streams from 400+ globally distributed Edge Locations closer to the end user.

- **Benefits**: Drastically reduces latency, offloads traffic from origin servers, and integrates with AWS Shield for DDoS mitigation.
- **Cache-Control Headers**: Origin returns `Cache-Control: public, max-age=31536000, immutable` for versioned bundle files.
- **Cache Invalidation**: Explicitly purges outdated assets from edge caches on new deployments (`aws cloudfront create-invalidation`).

---

#### 47. AWS IAM: Principle of Least Privilege, Roles, and Policies.

- **IAM Users**: Individual human identity with credentials.
- **IAM Policies**: JSON documents explicitly defining `Allow` or `Deny` permissions on AWS resources.
- **IAM Roles**: An identity with temporary permissions assumed by AWS services (e.g., an EC2 instance assuming an S3-ReadOnly role without storing secret keys on the filesystem).
- **Principle of Least Privilege**: Grant only the minimal necessary permissions required to perform a specific task.

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": ["s3:GetObject", "s3:PutObject"],
      "Resource": "arn:aws:s3:::my-production-bucket/uploads/*"
    }
  ]
}
```

---

#### 48. AWS Networking Basics: VPC, Subnets, Internet Gateway, and Security Groups.

- **VPC (Virtual Private Cloud)**: Isolated private virtual network in AWS cloud.
- **Public Subnet**: Has a direct route to an **Internet Gateway (IGW)**; hosts public-facing load balancers and reverse proxies.
- **Private Subnet**: No direct route to public internet; hosts internal database clusters and private application workers. (Outbound internet updates route through a **NAT Gateway**).
- **Security Groups**: Virtual stateful firewall operating at the instance level controlling inbound and outbound IP traffic and ports.

---

### 8. Webhooks, Microservices & Architecture

#### 49. Webhooks: Architecture, Security (HMAC Signature Verification), and Idempotency.

A **Webhook** is an automated HTTP POST callback sent by a source service (e.g., Stripe, GitHub, Shopify) to a destination server when an event occurs.

- **Security**: Prevent spoofing by verifying the payload's **HMAC SHA-256 signature** using a shared webhook signing secret.
- **Idempotency**: External providers may retry webhooks if network glitches occur. Process each event by saving its unique `event_id` in a database/Redis to avoid double-charging or duplicate processing.

```javascript
// Stripe Webhook Endpoint with HMAC Verification & Idempotency in Express
import crypto from 'crypto';

app.post('/api/webhooks/stripe', express.raw({ type: 'application/json' }), async (req, res) => {
  const sig = req.headers['stripe-signature'];
  const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

  let event;
  try {
    // 1. Verify cryptographic signature
    event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // 2. Idempotency Check: Prevent duplicate processing
  const isProcessed = await redis.get(`webhook:event:${event.id}`);
  if (isProcessed) {
    return res.status(200).json({ received: true, note: 'Already processed' });
  }

  // 3. Handle Business Event
  if (event.type === 'payment_intent.succeeded') {
    const paymentIntent = event.data.object;
    await fulfillOrder(paymentIntent.metadata.orderId);
  }

  // Mark event as processed with 24h retention
  await redis.set(`webhook:event:${event.id}`, 'true', { EX: 86400 });
  res.status(200).json({ received: true });
});
```

---

#### 50. Monolith vs Microservices vs Modular Monolith: Communication Patterns (REST, gRPC, Event-Driven).

- **Monolith**: Single unified codebase. Simple to develop, deploy, and debug, but hard to scale across large independent teams.
- **Modular Monolith**: Single deployable artifact with strictly bounded internal modules. Often the ideal middle-ground for fast-growing startups.
- **Microservices**: Decomposed suite of small, independently deployable services owned by separate teams.
- **Inter-Service Communication**:
  - **Synchronous (Request-Response)**:
    - **REST (JSON/HTTP)**: Simple, human-readable, universal.
    - **gRPC (HTTP/2 + Protocol Buffers)**: Binary serialization, high throughput, low latency, strictly typed contract.
  - **Asynchronous (Event-Driven)**:
    - **Message Brokers (Apache Kafka, RabbitMQ, AWS SQS/SNS)**: Decouples services, handles traffic spikes with buffer queues, and provides high fault tolerance.

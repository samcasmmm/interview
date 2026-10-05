# 🟡 Node.js & Express Interview Preparation — Intermediate Level (1–2 Years Experience)

> Comprehensive interview guide covering Event Loop phases, Microtasks, Streams & Buffers, JWT & Session Auth, PostgreSQL connection pooling & transactions, Multer uploads, Winston logging, Helmet security, Rate limiting, Child processes, Jest testing, WebSockets, and Clustering.

---

## 📑 Table of Contents

- [Q01. What are the exact phases of the libuv Event Loop and what executes in each phase?](#q01-what-are-the-exact-phases-of-the-libuv-event-loop-and-what-executes-in-each-phase)
- [Q02. What is the Microtask Queue and how does execution priority differ between `process.nextTick()` and Promises?](#q02-what-is-the-microtask-queue-and-how-does-execution-priority-differ-between-processnexttick-and-promises)
- [Q03. What is a `Buffer` in Node.js and how does it represent raw binary memory outside the V8 heap?](#q03-what-is-a-buffer-in-nodejs-and-how-does-it-represent-raw-binary-memory-outside-the-v8-heap)
- [Q04. What are Streams in Node.js and what are the four stream types (`Readable`, `Writable`, `Duplex`, `Transform`)?](#q04-what-are-streams-in-nodejs-and-what-are-the-four-stream-types-readable-writable-duplex-transform)
- [Q05. What is Stream "Backpressure" and how does `stream.pipeline()` manage it safely?](#q05-what-is-stream-backpressure-and-how-does-streampipeline-manage-it-safely)
- [Q06. How do you securely hash passwords using `bcrypt` or `argon2`?](#q06-how-do-you-securely-hash-passwords-using-bcrypt-or-argon2)
- [Q07. How do you implement JWT authentication in Express with Access and Refresh tokens?](#q07-how-do-you-implement-jwt-authentication-in-express-with-access-and-refresh-tokens)
- [Q08. How do you build an Authentication & Role-Based Authorization Middleware in Express?](#q08-how-do-you-build-an-authentication--role-based-authorization-middleware-in-express)
- [Q09. How does session-based authentication work with `express-session` and Redis?](#q09-how-does-session-based-authentication-work-with-express-session-and-redis)
- [Q10. How do you handle multipart file uploads safely using `multer` with MIME type and size filters?](#q10-how-do-you-handle-multipart-file-uploads-safely-using-multer-with-mime-type-and-size-filters)
- [Q11. How do you configure a PostgreSQL connection pool using `pg.Pool` for high-throughput queries?](#q11-how-do-you-configure-a-postgresql-connection-pool-using-pgpool-for-high-throughput-queries)
- [Q12. How do you prevent SQL Injection in Node.js database queries using parameterized inputs?](#q12-how-do-you-prevent-sql-injection-in-nodejs-database-queries-using-parameterized-inputs)
- [Q13. How do you execute atomic database transactions in Node.js using `BEGIN`, `COMMIT`, and `ROLLBACK`?](#q13-how-do-you-execute-atomic-database-transactions-in-nodejs-using-begin-commit-and-rollback)
- [Q14. How do you handle asynchronous errors in Express route handlers without crashing the server?](#q14-how-do-you-handle-asynchronous-errors-in-express-route-handlers-without-crashing-the-server)
- [Q15. What is the distinction between Operational Errors and Programmer Errors in Node.js?](#q15-what-is-the-distinction-between-operational-errors-and-programmer-errors-in-nodejs)
- [Q16. How do you handle `uncaughtException` and `unhandledRejection` events on the `process` object?](#q16-how-do-you-handle-uncaughtexception-and-unhandledrejection-events-on-the-process-object)
- [Q17. How do you configure structured JSON logging using `winston` and HTTP request logging using `morgan`?](#q17-how-do-you-configure-structured-json-logging-using-winston-and-http-request-logging-using-morgan)
- [Q18. How do you implement API rate limiting in Express using `express-rate-limit` backed by Redis?](#q18-how-do-you-implement-api-rate-limiting-in-express-using-express-rate-limit-backed-by-redis)
- [Q19. How do you harden HTTP response headers using `helmet`?](#q19-how-do-you-harden-http-response-headers-using-helmet)
- [Q20. What is Cross-Site Request Forgery (CSRF) and how do you prevent it in modern APIs?](#q20-what-is-cross-site-request-forgery-csrf-and-how-do-you-prevent-it-in-modern-apis)
- [Q21. What is the difference between `child_process.exec()`, `execFile()`, `spawn()`, and `fork()`?](#q21-what-is-the-difference-between-child_processexec-execfile-spawn-and-fork)
- [Q22. When and how do you use `child_process.fork()` to offload CPU-intensive tasks?](#q22-when-and-how-do-you-use-child_processfork-to-offload-cpu-intensive-tasks)
- [Q23. How do you implement robust schema validation using `Zod` or `Joi` middleware in Express?](#q23-how-do-you-implement-robust-schema-validation-using-zod-or-joi-middleware-in-express)
- [Q24. How do you write unit tests for Express route handlers and middleware using `jest`?](#q24-how-do-you-write-unit-tests-for-express-route-handlers-and-middleware-using-jest)
- [Q25. How do you write End-to-End (E2E) API tests using `supertest`?](#q25-how-do-you-write-end-to-end-e2e-api-tests-using-supertest)
- [Q26. How do you mock database queries and external HTTP calls during unit testing?](#q26-how-do-you-mock-database-queries-and-external-http-calls-during-unit-testing)
- [Q27. What is Server-Sent Events (SSE) and how do you implement an SSE streaming endpoint in Express?](#q27-what-is-server-sent-events-sse-and-how-do-you-implement-an-sse-streaming-endpoint-in-express)
- [Q28. How do you implement real-time WebSockets in Node.js using `ws` or `socket.io`?](#q28-how-do-you-implement-real-time-websockets-in-nodejs-using-ws-or-socketio)
- [Q29. What is the difference between Offset-based and Cursor-based pagination in Express REST APIs?](#q29-what-is-the-difference-between-offset-based-and-cursor-based-pagination-in-express-rest-apis)
- [Q30. How do you compress HTTP responses using Gzip/Brotli via the `compression` middleware?](#q30-how-do-you-compress-http-responses-using-gzipbrotli-via-the-compression-middleware)
- [Q31. What is Graceful Shutdown and how do you handle `SIGTERM` and `SIGINT` signals?](#q31-what-is-graceful-shutdown-and-how-do-you-handle-sigterm-and-sigint-signals)
- [Q32. What is the Node.js `cluster` module and how does it leverage multi-core CPU architectures?](#q32-what-is-the-nodejs-cluster-module-and-how-does-it-leverage-multi-core-cpu-architectures)
- [Q33. How do you implement Cache-Aside in-memory caching using Redis for frequent database reads?](#q33-how-do-you-implement-cache-aside-in-memory-caching-using-redis-for-frequent-database-reads)
- [Q34. How do you schedule periodic background Cron jobs in Node.js using `node-cron`?](#q34-how-do-you-schedule-periodic-background-cron-jobs-in-nodejs-using-node-cron)

---

### Q01. What are the exact phases of the libuv Event Loop and what executes in each phase?

#### Answer:
The libuv Event Loop coordinates asynchronous I/O callbacks across six distinct phases executed in a continuous circle:

```
   ┌───────────────────────────┐
┌─>│          timers           │  setTimeout(), setInterval() callbacks
│  └─────────────┬─────────────┘
│  ┌─────────────┴─────────────┐
│  │     pending callbacks     │  System operations (TCP errors like ECONNREFUSED)
│  └─────────────┬─────────────┘
│  ┌─────────────┴─────────────┐
│  │       idle, prepare       │  Internal libuv operations only
│  └─────────────┬─────────────┘
│  ┌─────────────┴─────────────┐
│  │           poll            │  Retrieves new I/O events; executes I/O callbacks
│  └─────────────┬─────────────┘
│  ┌─────────────┴─────────────┐
│  │           check           │  setImmediate() callbacks
│  └─────────────┬─────────────┘
│  ┌─────────────┴─────────────┐
│  │      close callbacks      │  socket.on('close', ...), cleanup
└──┴───────────────────────────┘
```

1. **Timers**: Executes callbacks scheduled by `setTimeout()` and `setInterval()` whose thresholds have passed.
2. **Pending Callbacks**: Executes I/O callbacks deferred to the next loop iteration (e.g. socket errors).
3. **Idle, Prepare**: Used internally by libuv.
4. **Poll**: Retrieves new incoming I/O events (incoming TCP connections, file reading). Calculates how long it should block and wait for I/O.
5. **Check**: Executes `setImmediate()` callbacks.
6. **Close Callbacks**: Handles socket closures (e.g. `socket.on('close')`).

---

### Q02. What is the Microtask Queue and how does execution priority differ between `process.nextTick()` and Promises?

#### Answer:
Microtasks are not part of libuv; they belong to the V8 engine layer. The microtask queue is checked and drained **immediately after every synchronous JavaScript operation finishes and between each phase of the Event Loop**.
- **`process.nextTick()`**: Managed in the Next-Tick Queue. Has **higher priority** than Promise microtasks.
- **Promise callbacks (`.then()`, `await`)**: Execute immediately after the nextTick queue is exhausted, before the Event Loop enters its next phase.

#### Example:
```javascript
console.log('1. Script start');

setTimeout(() => console.log('2. Timers phase (setTimeout)'), 0);
setImmediate(() => console.log('3. Check phase (setImmediate)'));

Promise.resolve().then(() => console.log('4. Microtask: Promise.then'));
process.nextTick(() => console.log('5. Microtask: process.nextTick'));

console.log('6. Script end');

// Execution Order:
// 1. Script start
// 6. Script end
// 5. Microtask: process.nextTick   <-- Drained first
// 4. Microtask: Promise.then       <-- Drained second
// 2. Timers phase (setTimeout)
// 3. Check phase (setImmediate)
```

---

### Q03. What is a `Buffer` in Node.js and how does it represent raw binary memory outside the V8 heap?

#### Answer:
A `Buffer` is a global class in Node.js used to handle raw binary data directly. 
- Unlike standard JavaScript strings or objects that live inside the V8 garbage-collected heap, `Buffer` memory is allocated **outside the V8 heap in raw C++ memory** via libuv.
- Used extensively when working with TCP streams, file systems, encryption, and image processing.

#### Example:
```javascript
// Allocate buffer of 10 zero-filled bytes
const buf = Buffer.alloc(10);

// Create buffer from UTF-8 string
const stringBuf = Buffer.from('Node.js', 'utf8');
console.log(stringBuf);             // <Buffer 4e 6f 64 65 2e 6a 73>
console.log(stringBuf.toString('hex')); // 4e6f64652e6a73
console.log(stringBuf.toString('utf8'));// Node.js
```

---

### Q04. What are Streams in Node.js and what are the four stream types (`Readable`, `Writable`, `Duplex`, `Transform`)?

#### Answer:
Streams are data-handling abstractions that process continuous chunks of data piece-by-piece without loading the entire dataset into memory at once.

**The Four Core Stream Types**:
1. **Readable**: Source of data you read from (e.g. `fs.createReadStream`, incoming `req` in Express).
2. **Writable**: Destination where data is written to (e.g. `fs.createWriteStream`, outgoing `res` in Express).
3. **Duplex**: Both Readable and Writable simultaneously (e.g. a `net.Socket` TCP connection).
4. **Transform**: A Duplex stream that modifies or transforms data as it is written and read (e.g. `zlib.createGzip()` compression or crypto cipher).

---

### Q05. What is Stream "Backpressure" and how does `stream.pipeline()` manage it safely?

#### Answer:
- **Backpressure**: Occurs when a Readable stream produces data faster than a Writable stream can consume it. If unmanaged, incoming chunks buffer endlessly in memory, causing heap exhaustion and server crashes.
- `.pipe()` handles backpressure by pausing the reader when the writer's buffer (`highWaterMark`) fills up (`write() === false`), but `.pipe()` does not properly clean up streams if an error occurs mid-stream.
- **`stream.pipeline()`**: The modern, safe standard. Automatically manages backpressure, listens for `drain` events, and guarantees proper resource cleanup and stream closure if any error occurs.

#### Example:
```javascript
const fs = require('fs');
const zlib = require('zlib');
const { pipeline } = require('stream/promises');

async function compressFile(source, destination) {
  try {
    await pipeline(
      fs.createReadStream(source),
      zlib.createGzip(),
      fs.createWriteStream(destination)
    );
    console.log('Compression pipeline succeeded with zero memory bloating');
  } catch (err) {
    console.error('Pipeline failed:', err.message);
  }
}
```

---

### Q06. How do you securely hash passwords using `bcrypt` or `argon2`?

#### Answer:
Never store plaintext passwords or use fast cryptographic hashes (MD5, SHA-256) because attackers can break them using GPUs and rainbow tables.
- Use adaptive slow hashing algorithms like **bcrypt** or **argon2id** with a salt round factor of 10–12.

#### Example:
```javascript
const bcrypt = require('bcrypt');
const SALT_ROUNDS = 12;

// 1. Hash during user registration
async function hashPassword(plainPassword) {
  return await bcrypt.hash(plainPassword, SALT_ROUNDS);
}

// 2. Compare during login
async function verifyPassword(plainPassword, hashedPassword) {
  return await bcrypt.compare(plainPassword, hashedPassword);
}
```

---

### Q07. How do you implement JWT authentication in Express with Access and Refresh tokens?

#### Answer:
- **Access Token**: Short-lived (15 mins), signed with a private secret, sent in `Authorization: Bearer <token>` header to access protected APIs.
- **Refresh Token**: Long-lived (7–30 days), stored in an `HttpOnly`, secure cookie or database session store, used exclusively to request new access tokens.

#### Example:
```javascript
const jwt = require('jsonwebtoken');

const ACCESS_SECRET = process.env.JWT_ACCESS_SECRET;
const REFRESH_SECRET = process.env.JWT_REFRESH_SECRET;

function generateTokens(user) {
  const accessToken = jwt.sign(
    { userId: user.id, role: user.role },
    ACCESS_SECRET,
    { expiresIn: '15m' }
  );

  const refreshToken = jwt.sign(
    { userId: user.id },
    REFRESH_SECRET,
    { expiresIn: '7d' }
  );

  return { accessToken, refreshToken };
}
```

---

### Q08. How do you build an Authentication & Role-Based Authorization Middleware in Express?

#### Answer:
Create middleware functions that verify the JWT from the `Authorization` header, attach `req.user`, and check required role permissions.

#### Example:
```javascript
const jwt = require('jsonwebtoken');

// 1. Authentication Middleware
const authenticate = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Authentication token required' });
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
    req.user = decoded; // Attach { userId, role }
    next();
  } catch (err) {
    return res.status(403).json({ error: 'Invalid or expired token' });
  }
};

// 2. Authorization Middleware (RBAC)
const authorize = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ error: 'Access denied: insufficient permissions' });
    }
    next();
  };
};

// Route usage:
app.get('/api/admin/users', authenticate, authorize('admin', 'superadmin'), (req, res) => {
  res.json({ message: 'Admin data accessed' });
});
```

---

### Q09. How does session-based authentication work with `express-session` and Redis?

#### Answer:
The server creates a session record stored in Redis and sends a cryptographically signed cookie (`connect.sid`) containing the session ID to the client. On subsequent requests, Express extracts the session ID and retrieves user state from Redis.

#### Example:
```javascript
const session = require('express-session');
const RedisStore = require('connect-redis').default;
const { createClient } = require('redis');

const redisClient = createClient({ url: 'redis://localhost:6379' });
redisClient.connect().catch(console.error);

app.use(
  session({
    store: new RedisStore({ client: redisClient }),
    secret: 'session_secret_key',
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === 'production',
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24, // 24 hours
      sameSite: 'lax',
    },
  })
);
```

---

### Q10. How do you handle multipart file uploads safely using `multer` with MIME type and size filters?

#### Answer:
Configure `multer` disk or memory storage with strict `fileFilter` validation and `limits`.

#### Example:
```javascript
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
  destination: 'uploads/',
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, `${uniqueSuffix}${path.extname(file.originalname)}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB max
  fileFilter: (req, file, cb) => {
    const allowedMime = ['image/jpeg', 'image/png', 'application/pdf'];
    if (allowedMime.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only JPEG, PNG, and PDF are allowed'));
    }
  },
});

app.post('/api/upload', upload.single('document'), (req, res) => {
  res.json({ filename: req.file.filename, size: req.file.size });
});
```

---

### Q11. How do you configure a PostgreSQL connection pool using `pg.Pool` for high-throughput queries?

#### Answer:
Creating a new TCP connection for every database query is slow (~50–100ms handshake). A connection pool maintains open reusable database sockets.

#### Example:
```javascript
const { Pool } = require('pg');

const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: 5432,
  database: 'myapp',
  user: 'postgres',
  password: 'password',
  max: 20,                  // Max 20 concurrent connections in pool
  idleTimeoutMillis: 30000, // Close idle connections after 30s
  connectionTimeoutMillis: 2000, // Error if connection cannot be acquired in 2s
});

module.exports = {
  query: (text, params) => pool.query(text, params),
  pool,
};
```

---

### Q12. How do you prevent SQL Injection in Node.js database queries using parameterized inputs?

#### Answer:
Never concatenate user inputs directly into SQL queries (`'WHERE email = ' + email`).
Use **parameterized placeholders** (`$1`, `$2`), where the database engine separates the query structure from user parameters, preventing code injection.

#### Example:
```javascript
// VULNERABLE:
// const sql = `SELECT * FROM users WHERE email = '${req.body.email}'`;

// SECURE (Parameterized):
const findUserByEmail = async (email) => {
  const query = 'SELECT id, email, password_hash FROM users WHERE email = $1';
  const { rows } = await pool.query(query, [email]);
  return rows[0];
};
```

---

### Q13. How do you execute atomic database transactions in Node.js using `BEGIN`, `COMMIT`, and `ROLLBACK`?

#### Answer:
Transactions guarantee ACID properties. You must checkout a dedicated client from the pool, execute `BEGIN`, perform queries, and call `COMMIT` or `ROLLBACK` in a `finally` block to release the client.

#### Example:
```javascript
async function transferMoney(fromAccount, toAccount, amount) {
  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    await client.query(
      'UPDATE accounts SET balance = balance - $1 WHERE id = $2',
      [amount, fromAccount]
    );

    await client.query(
      'UPDATE accounts SET balance = balance + $1 WHERE id = $2',
      [amount, toAccount]
    );

    await client.query('COMMIT');
    return { success: true };
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release(); // Always return client to pool
  }
}
```

---

### Q14. How do you handle asynchronous errors in Express route handlers without crashing the server?

#### Answer:
In Express 4, unhandled promise rejections inside async route handlers do not automatically reach error middleware unless caught and passed to `next(err)`.
- Use an **Async Wrapper** utility function.
- (Note: Express 5 natively handles rejected promises).

#### Example:
```javascript
// Utility: async-handler.js
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

// Route usage:
app.get('/api/users/:id', asyncHandler(async (req, res) => {
  const user = await database.findUser(req.params.id);
  if (!user) {
    const error = new Error('User not found');
    error.status = 404;
    throw error; // Caught cleanly by asyncHandler and passed to next()
  }
  res.json(user);
}));
```

---

### Q15. What is the distinction between Operational Errors and Programmer Errors in Node.js?

#### Answer:
- **Operational Errors**: Predictable, runtime errors that occur during normal application operation (e.g., database connection timeout, invalid user input, file not found, network failure). The application should catch these, log them, and return a graceful error response.
- **Programmer Errors**: Bugs in the code (e.g., `TypeError: Cannot read property of undefined`, syntax error, passing wrong argument types). These indicate code defects; the process state may be corrupted, and the process should restart gracefully.

---

### Q16. How do you handle `uncaughtException` and `unhandledRejection` events on the `process` object?

#### Answer:
- `unhandledRejection`: Emitted when a Promise is rejected without a `.catch()` handler.
- `uncaughtException`: Emitted when an exception bubbles all the way back to the event loop.
- **Rule**: Log the error, perform cleanup, and exit the process (`process.exit(1)`). Let a process manager (PM2/Kubernetes) spin up a fresh instance.

#### Example:
```javascript
process.on('unhandledRejection', (reason, promise) => {
  console.error('[Unhandled Rejection]', reason);
});

process.on('uncaughtException', (err) => {
  console.error('[FATAL Uncaught Exception]', err);
  // Perform emergency cleanup
  server.close(() => {
    process.exit(1);
  });
});
```

---

### Q17. How do you configure structured JSON logging using `winston` and HTTP request logging using `morgan`?

#### Answer:
Structured JSON logs allow centralized log aggregation tools (Datadog, ELK, CloudWatch) to index and query application logs.

#### Example:
```javascript
const winston = require('winston');
const morgan = require('morgan');

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: 'logs/combined.log' }),
  ],
});

// Stream morgan logs into winston
app.use(
  morgan('combined', {
    stream: { write: (message) => logger.info(message.trim()) },
  })
);
```

---

### Q18. How do you implement API rate limiting in Express using `express-rate-limit` backed by Redis?

#### Answer:
Protects against brute force and DDoS attacks by tracking client IP request frequencies.

#### Example:
```javascript
const rateLimit = require('express-rate-limit');
const RedisStore = require('rate-limit-redis').default;
const { createClient } = require('redis');

const redisClient = createClient({ url: 'redis://localhost:6379' });
redisClient.connect();

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per window
  standardHeaders: true, // Return rate limit info in `RateLimit-*` headers
  legacyHeaders: false,
  store: new RedisStore({
    sendCommand: (...args) => redisClient.sendCommand(args),
  }),
});

app.use('/api/', apiLimiter);
```

---

### Q19. How do you harden HTTP response headers using `helmet`?

#### Answer:
`helmet` is a collection of 15 smaller middleware functions that set secure HTTP headers (e.g. `Content-Security-Policy`, `Strict-Transport-Security`, `X-Frame-Options`, `X-Content-Type-Options`).

#### Example:
```javascript
const helmet = require('helmet');
const express = require('express');
const app = express();

app.use(helmet()); // Enables secure headers by default
```

---

### Q20. What is Cross-Site Request Forgery (CSRF) and how do you prevent it in modern APIs?

#### Answer:
CSRF tricks an authenticated user's browser into submitting unauthorized requests to a web application where the user is currently authenticated (because the browser automatically includes authentication cookies).
- **Mitigation in Modern APIs**:
  1. Use `SameSite=Strict` or `SameSite=Lax` on session cookies.
  2. Implement Anti-CSRF double-submit cookies or custom request headers (`X-Requested-With`) that cannot be set across origins.
  3. Store authentication tokens in `Authorization: Bearer` headers (which browsers never attach automatically).

---

### Q21. What is the difference between `child_process.exec()`, `execFile()`, `spawn()`, and `fork()`?

#### Answer:
| Method | Spawns Shell? | Returns | Best For |
| :--- | :--- | :--- | :--- |
| `exec()` | Yes (`/bin/sh`) | Buffers entire stdout/stderr | Small shell scripts (vulnerable to shell injection!) |
| `execFile()` | No | Buffers output | Executing specific binaries directly |
| `spawn()` | Optional | Streams stdout/stderr | Large data outputs, long-running processes |
| `fork()` | No | Dedicated IPC channel | Running another Node.js script with message passing |

---

### Q22. When and how do you use `child_process.fork()` to offload CPU-intensive tasks?

#### Answer:
`child_process.fork()` spawns a new Node.js V8 process with a built-in IPC (Inter-Process Communication) channel, preventing heavy calculations (e.g. Fibonacci, image resizing) from blocking the main Event Loop.

#### Example:
```javascript
// parent.js
const { fork } = require('child_process');

app.get('/compute', (req, res) => {
  const child = fork('./heavy-task.js');
  child.send({ number: 45 });

  child.on('message', (result) => {
    res.json({ result });
    child.kill(); // Terminate worker after completion
  });
});

// heavy-task.js
process.on('message', ({ number }) => {
  const computeFibonacci = (n) => (n <= 1 ? n : computeFibonacci(n - 1) + computeFibonacci(n - 2));
  const result = computeFibonacci(number);
  process.send(result);
});
```

---

### Q23. How do you implement robust schema validation using `Zod` or `Joi` middleware in Express?

#### Answer:
Validate incoming request data against declarative schemas before entering the controller.

#### Example (using Zod):
```javascript
const { z } = require('zod');

const createUserSchema = z.object({
  body: z.object({
    username: z.string().min(3),
    email: z.string().email(),
    age: z.number().int().positive().optional(),
  }),
});

const validate = (schema) => (req, res, next) => {
  try {
    schema.parse({ body: req.body, query: req.query, params: req.params });
    next();
  } catch (err) {
    return res.status(400).json({ errors: err.errors });
  }
};

app.post('/api/users', validate(createUserSchema), (req, res) => {
  res.status(201).json({ success: true });
});
```

---

### Q24. How do you write unit tests for Express route handlers and middleware using `jest`?

#### Answer:
Mock the `req`, `res`, and `next` objects to verify behavior in isolation without making real network calls.

#### Example:
```javascript
const myMiddleware = (req, res, next) => {
  if (!req.headers['x-api-key']) {
    return res.status(401).json({ error: 'API key required' });
  }
  next();
};

describe('API Key Middleware', () => {
  it('should return 401 if header missing', () => {
    const req = { headers: {} };
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    const next = jest.fn();

    myMiddleware(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(next).not.toHaveBeenCalled();
  });
});
```

---

### Q25. How do you write End-to-End (E2E) API tests using `supertest`?

#### Answer:
`supertest` binds to the Express `app` instance without binding to a physical network port, allowing fast and reliable HTTP testing.

#### Example:
```javascript
const request = require('supertest');
const app = require('../src/app');

describe('GET /api/health', () => {
  it('should return 200 and healthy status', async () => {
    const res = await request(app).get('/api/health');
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('status', 'healthy');
  });
});
```

---

### Q26. How do you mock database queries and external HTTP calls during unit testing?

#### Answer:
Use `jest.spyOn()` or `jest.mock()` to replace real database drivers or network clients (like `axios` or `pg`) with mock implementations.

#### Example:
```javascript
const db = require('../src/db');
const userService = require('../src/user.service');

jest.mock('../src/db');

it('should fetch user from database', async () => {
  db.query.mockResolvedValue({ rows: [{ id: 1, name: 'Alice' }] });

  const user = await userService.getUser(1);
  expect(user.name).toBe('Alice');
  expect(db.query).toHaveBeenCalledTimes(1);
});
```

---

### Q27. What is Server-Sent Events (SSE) and how do you implement an SSE streaming endpoint in Express?

#### Answer:
SSE is a lightweight standard for unidirectional server-to-client streaming over a single long-lived HTTP connection using `Content-Type: text/event-stream`.

#### Example:
```javascript
app.get('/api/events', (req, res) => {
  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    'Connection': 'keep-alive',
  });

  const intervalId = setInterval(() => {
    res.write(`data: ${JSON.stringify({ time: new Date().toISOString() })}\n\n`);
  }, 1000);

  req.on('close', () => {
    clearInterval(intervalId);
    res.end();
  });
});
```

---

### Q28. How do you implement real-time WebSockets in Node.js using `ws` or `socket.io`?

#### Answer:
Attach a WebSocket server instance to the existing Node.js HTTP server to handle full-duplex communication over a single TCP connection.

#### Example:
```javascript
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: '*' } });

io.on('connection', (socket) => {
  console.log(`User connected: ${socket.id}`);

  socket.on('chatMessage', (msg) => {
    io.emit('message', { id: socket.id, text: msg });
  });

  socket.on('disconnect', () => {
    console.log(`User disconnected: ${socket.id}`);
  });
});

server.listen(3000);
```

---

### Q29. What is the difference between Offset-based and Cursor-based pagination in Express REST APIs?

#### Answer:
- **Offset-based (`OFFSET 100 LIMIT 20`)**:
  - Simple to implement (`page=5&limit=20`).
  - **Downside**: As offset grows, the database must scan and discard thousands of rows. Prone to duplicate or missing items if records are inserted while paginating.
- **Cursor-based (`WHERE id > $last_seen_id ORDER BY id ASC LIMIT 20`)**:
  - Scalable and consistent ($O(1)$ lookup via index).
  - Best for infinite scroll (feeds, timelines).

---

### Q30. How do you compress HTTP responses using Gzip/Brotli via the `compression` middleware?

#### Answer:
Install `compression` and register it early in the middleware stack to compress response payloads over a specified size threshold.

#### Example:
```javascript
const compression = require('compression');
const express = require('express');
const app = express();

app.use(
  compression({
    level: 6, // Balance between compression ratio and CPU usage
    threshold: 1024, // Only compress responses > 1KB
  })
);
```

---

### Q31. What is Graceful Shutdown and how do you handle `SIGTERM` and `SIGINT` signals?

#### Answer:
When container orchestrators (Kubernetes/Docker) scale down or deploy updates, they send `SIGTERM`. Graceful shutdown stops accepting new requests, allows in-flight requests to complete, flushes logs, closes DB connection pools, and exits cleanly.

#### Example:
```javascript
const server = app.listen(3000);

const shutdown = (signal) => {
  console.log(`Received ${signal}. Shutting down gracefully...`);
  server.close(async () => {
    console.log('HTTP server closed.');
    await pool.end(); // Close DB pool
    console.log('Database connections closed. Exiting process.');
    process.exit(0);
  });

  // Force exit if cleanup takes too long
  setTimeout(() => {
    console.error('Forced shutdown due to timeout.');
    process.exit(1);
  }, 10000);
};

process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));
```

---

### Q32. What is the Node.js `cluster` module and how does it leverage multi-core CPU architectures?

#### Answer:
Because Node.js runs on a single main thread, it only utilizes one CPU core by default.
The `cluster` module allows master processes to fork child worker processes (one per CPU core) that all share the same server port.

#### Example:
```javascript
const cluster = require('cluster');
const os = require('os');

if (cluster.isPrimary) {
  const numCPUs = os.cpus().length;
  console.log(`Primary master ${process.pid} is running. Forking ${numCPUs} workers...`);

  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }

  cluster.on('exit', (worker) => {
    console.log(`Worker ${worker.process.pid} died. Forking replacement...`);
    cluster.fork();
  });
} else {
  // Workers share the TCP connection
  require('./server.js');
}
```

---

### Q33. How do you implement Cache-Aside in-memory caching using Redis for frequent database reads?

#### Answer:
Check Redis first. If found (Cache Hit), return cached data. If not found (Cache Miss), query the database, populate Redis with a TTL, and return the data.

#### Example:
```javascript
async function getProduct(productId) {
  const cacheKey = `product:${productId}`;
  const cached = await redisClient.get(cacheKey);

  if (cached) {
    return JSON.parse(cached); // Cache Hit
  }

  // Cache Miss
  const product = await db.query('SELECT * FROM products WHERE id = $1', [productId]);
  if (product.rows[0]) {
    await redisClient.set(cacheKey, JSON.stringify(product.rows[0]), { EX: 3600 }); // 1h TTL
  }
  return product.rows[0];
}
```

---

### Q34. How do you schedule periodic background Cron jobs in Node.js using `node-cron`?

#### Answer:
Use `node-cron` to define cron schedules using standard 5-part cron syntax.

#### Example:
```javascript
const cron = require('node-cron');

// Runs every day at midnight (00:00)
cron.schedule('0 0 * * *', async () => {
  console.log('Running nightly database cleanup job...');
  await db.query("DELETE FROM sessions WHERE expires_at < NOW()");
});
```

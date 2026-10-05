# 🟢 Node.js & Express Interview Preparation — Basic Level (0–1 Year Experience)

> Comprehensive interview guide covering Node.js runtime fundamentals, CommonJS vs ES Modules, core built-in modules (`fs`, `path`, `os`, `http`, `events`), Asynchronous JavaScript (Callbacks, Promises, Async/Await), Express.js basics, routing, middleware, status codes, query/param/body parsing, and environment configuration.

---

## 📑 Table of Contents

- [Q01. What is Node.js and how does it differ from JavaScript running in a web browser?](#q01-what-is-nodejs-and-how-does-it-differ-from-javascript-running-in-a-web-browser)
- [Q02. What is the V8 engine and what is its role in Node.js?](#q02-what-is-the-v8-engine-and-what-is-its-role-in-nodejs)
- [Q03. What is meant by the "Single-Threaded, Non-Blocking, Event-Driven" architecture of Node.js?](#q03-what-is-meant-by-the-single-threaded-non-blocking-event-driven-architecture-of-nodejs)
- [Q04. What is the difference between CommonJS (`require` / `module.exports`) and ES Modules (`import` / `export`)?](#q04-what-is-the-difference-between-commonjs-require--moduleexports-and-es-modules-import--export)
- [Q05. What is `package.json` and what is the difference between `dependencies` and `devDependencies`?](#q05-what-is-packagejson-and-what-is-the-difference-between-dependencies-and-devdependencies)
- [Q06. What is the difference between `package.json` and `package-lock.json`?](#q06-what-is-the-difference-between-packagejson-and-package-lockjson)
- [Q07. What are NPM scripts and how do you define and run custom scripts (`npm run <script>`)?](#q07-what-are-npm-scripts-and-how-do-you-define-and-run-custom-scripts-npm-run-script)
- [Q08. What is the `path` module and why should you use `path.join()` or `path.resolve()` instead of string concatenation?](#q08-what-is-the-path-module-and-why-should-you-use-pathjoin-or-pathresolve-instead-of-string-concatenation)
- [Q09. What is the difference between `__dirname`, `__filename`, and `process.cwd()`?](#q09-what-is-the-difference-between-__dirname-__filename-and-processcwd)
- [Q10. How do you read and write files using the `fs` module (Synchronous vs Callback vs Promise-based)?](#q10-how-do-you-read-and-write-files-using-the-fs-module-synchronous-vs-callback-vs-promise-based)
- [Q11. What is the `os` module and what useful system metrics does it provide?](#q11-what-is-the-os-module-and-what-useful-system-metrics-does-it-provide)
- [Q12. How do you build a minimal HTTP server in native Node.js without any framework using the `http` module?](#q12-how-do-you-build-a-minimal-http-server-in-native-nodejs-without-any-framework-using-the-http-module)
- [Q13. How does the `events` module and `EventEmitter` work in Node.js?](#q13-how-does-the-events-module-and-eventemitter-work-in-nodejs)
- [Q14. How do you handle asynchronous operations using Callback functions and what is "Callback Hell"?](#q14-how-do-you-handle-asynchronous-operations-using-callback-functions-and-what-is-callback-hell)
- [Q15. How do Promises solve Callback Hell and how do `Promise.all()`, `Promise.race()`, and `Promise.allSettled()` work?](#q15-how-do-promises-solve-callback-hell-and-how-do-promiseall-promiserace-and-promiseallsettled-work)
- [Q16. How does `async/await` syntax simplify Promise handling, and how do you handle errors with `try/catch`?](#q16-how-does-asyncawait-syntax-simplify-promise-handling-and-how-do-you-handle-errors-with-trycatch)
- [Q17. What is `process.env` and how do you manage environment variables using the `dotenv` package?](#q17-what-is-processenv-and-how-do-you-manage-environment-variables-using-the-dotenv-package)
- [Q18. What is `process.exit()` and what do exit codes (0 vs non-zero) signify?](#q18-what-is-processexit-and-what-do-exit-codes-0-vs-non-zero-signify)
- [Q19. What is Express.js and why is it preferred over raw Node.js `http` for building REST APIs?](#q19-what-is-expressjs-and-why-is-it-preferred-over-raw-nodejs-http-for-building-rest-apis)
- [Q20. How do you set up a basic Express application with route handlers (`app.get`, `app.post`)?](#q20-how-do-you-set-up-a-basic-express-application-with-route-handlers-appget-apppost)
- [Q21. What is Express Middleware and what do `req`, `res`, and `next()` represent?](#q21-what-is-express-middleware-and-what-do-req-res-and-next-represent)
- [Q22. How do you parse incoming JSON and URL-encoded request bodies using `express.json()` and `express.urlencoded()`?](#q22-how-do-you-parse-incoming-json-and-url-encoded-request-bodies-using-expressjson-and-expressurlencoded)
- [Q23. What is the difference between `req.params`, `req.query`, and `req.body` in Express?](#q23-what-is-the-difference-between-reqparams-reqquery-and-reqbody-in-express)
- [Q24. How do you send different types of responses in Express (`res.send`, `res.json`, `res.status`, `res.download`, `res.redirect`)?](#q24-how-do-you-send-different-types-of-responses-in-express-ressend-resjson-resstatus-resdownload-resredirect)
- [Q25. How do HTTP status codes categorize responses (2xx, 3xx, 4xx, 5xx) in REST APIs?](#q25-how-do-http-status-codes-categorize-responses-2xx-3xx-4xx-5xx-in-rest-apis)
- [Q26. How do you organize routes using `express.Router()` for modular application structure?](#q26-how-do-you-organize-routes-using-expressrouter-for-modular-application-structure)
- [Q27. How do you serve static assets (images, CSS, HTML) in Express using `express.static()`?](#q27-how-do-you-serve-static-assets-images-css-html-in-express-using-expressstatic)
- [Q28. How does error-handling middleware work in Express and why does it require four arguments `(err, req, res, next)`?](#q28-how-does-error-handling-middleware-work-in-express-and-why-does-it-require-four-arguments-err-req-res-next)
- [Q29. How do you handle 404 (Not Found) routes in Express?](#q29-how-do-you-handle-404-not-found-routes-in-express)
- [Q30. What is CORS and how do you configure the `cors` package in Express?](#q30-what-is-cors-and-how-do-you-configure-the-cors-package-in-express)
- [Q31. How do you inspect and manipulate HTTP request and response headers in Express (`req.get`, `res.set`)?](#q31-how-do-you-inspect-and-manipulate-http-request-and-response-headers-in-express-reqget-resset)
- [Q32. What is `nodemon` and how is it used during local development?](#q32-what-is-nodemon-and-how-is-it-used-during-local-development)
- [Q33. What is the difference between `process.nextTick()` and `setImmediate()` at a basic level?](#q33-what-is-the-difference-between-processnexttick-and-setimmediate-at-a-basic-level)
- [Q34. How do you perform basic input validation on incoming requests in Express?](#q34-how-do-you-perform-basic-input-validation-on-incoming-requests-in-express)

---

### Q01. What is Node.js and how does it differ from JavaScript running in a web browser?

#### Answer:
**Node.js** is an open-source, cross-platform JavaScript runtime environment that executes JavaScript code outside a web browser. Built on Google Chrome's **V8 JavaScript engine**, Node.js provides server-side APIs that allow JavaScript to interact with the underlying operating system (file system, network sockets, child processes).

**Key Differences**:
| Feature | Browser Environment | Node.js Environment |
| :--- | :--- | :--- |
| **Global Object** | `window`, `document` | `global`, `globalThis`, `process` |
| **DOM / UI APIs** | Supported (`document.getElementById`) | None (Headless runtime) |
| **File System Access** | Strictly prohibited for security | Full access via `fs` module |
| **Network Sockets** | Only WebSockets, WebRTC, Fetch | Raw TCP/UDP sockets via `net` and `dgram` |
| **Module Systems** | ES Modules (`import`/`export`) | CommonJS (`require`) & ES Modules |

---

### Q02. What is the V8 engine and what is its role in Node.js?

#### Answer:
The **V8 engine** is Google's high-performance, open-source JavaScript and WebAssembly engine written in C++.
- It parses JavaScript source code into an Abstract Syntax Tree (AST).
- It compiles JavaScript directly into native machine code using its **Ignition** bytecode interpreter and **TurboFan** optimizing compiler.
- It manages call stack execution and **Garbage Collection (GC)** via the V8 heap.
- In Node.js, V8 provides the execution engine for JavaScript, while **libuv** provides the event loop, thread pool, and operating system I/O capabilities.

---

### Q03. What is meant by the "Single-Threaded, Non-Blocking, Event-Driven" architecture of Node.js?

#### Answer:
- **Single-Threaded**: JavaScript executes on a single main thread (one call stack at a time). There is no concurrent execution of multiple JavaScript statements.
- **Non-Blocking I/O**: When an I/O operation occurs (reading a file, database query, HTTP request), Node.js offloads the task to the operating system kernel or the internal `libuv` thread pool and continues executing subsequent code immediately.
- **Event-Driven**: When the asynchronous operation finishes, an event is emitted and its associated callback is queued into the Event Loop to run when the call stack becomes free.

#### Example:
```javascript
console.log('1. Starting task');

// Non-blocking asynchronous I/O
setTimeout(() => {
  console.log('2. Timeout callback completed');
}, 0);

console.log('3. Script finished');

// Output:
// 1. Starting task
// 3. Script finished
// 2. Timeout callback completed
```

---

### Q04. What is the difference between CommonJS (`require` / `module.exports`) and ES Modules (`import` / `export`)?

#### Answer:
- **CommonJS (CJS)**:
  - The traditional default module system in Node.js.
  - Synchronous loading (`require('module')`).
  - Dynamic: `require()` can be called inside `if` statements or functions.
  - Exports via `module.exports = { ... }` or `exports.foo = ...`.
- **ES Modules (ESM)**:
  - The official ECMAScript standard (`import { foo } from './foo.js'`).
  - Asynchronous loading with static analysis at compile time (enables tree-shaking).
  - Top-level `await` is supported natively.
  - Enabled by setting `"type": "module"` in `package.json` or using `.mjs` file extension.

#### Example:
```javascript
// --- CommonJS (math.js) ---
const add = (a, b) => a + b;
module.exports = { add };

// CommonJS consumer:
const { add } = require('./math');
console.log(add(2, 3));

// --- ES Modules (math.mjs) ---
export const multiply = (a, b) => a * b;

// ESM consumer:
import { multiply } from './math.mjs';
console.log(multiply(2, 3));
```

---

### Q05. What is `package.json` and what is the difference between `dependencies` and `devDependencies`?

#### Answer:
`package.json` is the manifest file for a Node.js project containing project metadata (name, version, scripts) and package dependencies.
- **`dependencies`**: Packages required for the application to run in **production** (e.g. `express`, `pg`, `dotenv`, `cors`). Installed via `npm install <package>`.
- **`devDependencies`**: Packages only needed for local **development and testing** (e.g. `nodemon`, `jest`, `eslint`, `@types/node`). Installed via `npm install -D <package>`. They are skipped during production builds when running `npm install --omit=dev`.

---

### Q06. What is the difference between `package.json` and `package-lock.json`?

#### Answer:
- **`package.json`**: Records the broad version ranges requested by the developer using semantic versioning prefixes (e.g., `"express": "^4.18.2"`, where `^` allows minor/patch updates).
- **`package-lock.json`**: Automatically generated by NPM to pin down the **exact, deterministic version** of every installed package and its transitive child dependencies, along with integrity hashes (SHA-512). This guarantees that every machine running `npm install` installs the exact same dependency tree.

---

### Q07. What are NPM scripts and how do you define and run custom scripts (`npm run <script>`)?

#### Answer:
NPM scripts are terminal commands defined in the `"scripts"` field of `package.json`. They automatically include local project binaries (`./node_modules/.bin`) in the execution path.

#### Example:
```json
{
  "name": "my-api",
  "scripts": {
    "start": "node src/index.js",
    "dev": "nodemon src/index.js",
    "test": "jest --coverage",
    "lint": "eslint src/"
  }
}
```
- To run built-in scripts: `npm start` or `npm test`.
- To run custom scripts: `npm run dev` or `npm run lint`.

---

### Q08. What is the `path` module and why should you use `path.join()` or `path.resolve()` instead of string concatenation?

#### Answer:
Different operating systems use different file path separators (Windows uses `\`, Linux/macOS uses `/`).
- String concatenation (`'dir/' + filename`) fails across platforms.
- `path.join([...paths])`: Normalizes separators and joins path segments according to the host OS.
- `path.resolve([...paths])`: Resolves a sequence of paths into an **absolute path**, prepending the current working directory if relative.

#### Example:
```javascript
const path = require('path');

// Safe cross-platform path joining
const configPath = path.join(__dirname, 'config', 'default.json');
console.log(configPath); // Windows: C:\app\config\default.json | Linux: /app/config/default.json

// Resolving absolute path
const uploadDir = path.resolve('public', 'uploads');
console.log(uploadDir);
```

---

### Q09. What is the difference between `__dirname`, `__filename`, and `process.cwd()`?

#### Answer:
- `__filename`: The absolute path to the currently executing code file.
- `__dirname`: The absolute path to the directory containing the currently executing code file.
- `process.cwd()`: The directory from which the Node.js process was **invoked** (current working directory of the terminal).

#### Example:
If you run `node src/app.js` from `E:\code\my-project`:
```javascript
console.log(__filename);    // E:\code\my-project\src\app.js
console.log(__dirname);     // E:\code\my-project\src
console.log(process.cwd()); // E:\code\my-project
```

---

### Q10. How do you read and write files using the `fs` module (Synchronous vs Callback vs Promise-based)?

#### Answer:
The built-in `fs` (File System) module provides three execution models:
1. **Synchronous** (`fs.readFileSync`): Blocks the entire Node.js main thread until the file is read. (Never use in production HTTP requests!).
2. **Callback-based** (`fs.readFile`): Non-blocking, executes a callback upon completion.
3. **Promise-based** (`fs/promises`): Non-blocking, allows `async/await` syntax (modern standard).

#### Example:
```javascript
const fs = require('fs/promises');
const path = require('path');

async function handleFile() {
  const filePath = path.join(__dirname, 'data.txt');

  try {
    // 1. Write file
    await fs.writeFile(filePath, 'Hello from Node.js!', 'utf8');

    // 2. Read file
    const content = await fs.readFile(filePath, 'utf8');
    console.log('File Content:', content);
  } catch (error) {
    console.error('File operation failed:', error.message);
  }
}

handleFile();
```

---

### Q11. What is the `os` module and what useful system metrics does it provide?

#### Answer:
The `os` module provides operating system utilities and hardware inspection methods:
- `os.cpus()`: Returns array of logical CPU cores and speeds (useful for configuring clustering).
- `os.totalmem()` & `os.freemem()`: Total and available RAM in bytes.
- `os.uptime()`: System uptime in seconds.
- `os.platform()` & `os.arch()`: Operating system platform and architecture (e.g. `win32`, `x64`).

#### Example:
```javascript
const os = require('os');

console.log('OS Platform:', os.platform());
console.log('CPU Cores:', os.cpus().length);
console.log('Free RAM (MB):', Math.round(os.freemem() / (1024 * 1024)));
```

---

### Q12. How do you build a minimal HTTP server in native Node.js without any framework using the `http` module?

#### Answer:
Use `http.createServer((req, res) => { ... })` and call `server.listen(port)`.

#### Example:
```javascript
const http = require('http');

const server = http.createServer((req, res) => {
  const { method, url } = req;

  if (method === 'GET' && url === '/api/health') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    return res.end(JSON.stringify({ status: 'healthy', timestamp: new Date() }));
  }

  res.writeHead(404, { 'Content-Type': 'text/plain' });
  res.end('Route Not Found');
});

const PORT = 3000;
server.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});
```

---

### Q13. How does the `events` module and `EventEmitter` work in Node.js?

#### Answer:
`EventEmitter` is the foundational Observer pattern implementation in Node.js. Many core modules (`http.Server`, `fs.ReadStream`) inherit from it.
- `.on(eventName, listener)`: Registers an event listener function.
- `.emit(eventName, ...args)`: Triggers the event synchronously, passing arguments to all listeners.
- `.once(eventName, listener)`: Registers a listener that executes only once and is then removed.

#### Example:
```javascript
const EventEmitter = require('events');

class OrderService extends EventEmitter {
  placeOrder(orderId, total) {
    console.log(`Order ${orderId} created for $${total}`);
    // Emit domain event
    this.emit('orderPlaced', { orderId, total });
  }
}

const orderService = new OrderService();

// Listener 1: Email Notification
orderService.on('orderPlaced', (data) => {
  console.log(`[Email Service] Sending receipt for order ${data.orderId}`);
});

// Listener 2: Inventory
orderService.on('orderPlaced', (data) => {
  console.log(`[Inventory Service] Reserving stock for order ${data.orderId}`);
});

orderService.placeOrder('ORD-101', 99.99);
```

---

### Q14. How do you handle asynchronous operations using Callback functions and what is "Callback Hell"?

#### Answer:
A callback is a function passed as an argument to an asynchronous method, invoked once the background task finishes.
- **Node.js Error-First Callback Convention**: The first parameter is reserved for an error object (`null` if successful), and the second holds the result: `(err, data) => { ... }`.
- **Callback Hell (Pyramid of Doom)**: Occurs when multiple dependent asynchronous operations are nested deeply within each other, making the code unreadable, brittle, and difficult to handle errors properly.

#### Example (Callback Hell):
```javascript
fs.readFile('user.json', (err, user) => {
  if (err) return handleError(err);
  getOrders(user.id, (err, orders) => {
    if (err) return handleError(err);
    getPayment(orders[0].id, (err, payment) => {
      if (err) return handleError(err);
      console.log('Payment processed', payment);
    });
  });
});
```

---

### Q15. How do Promises solve Callback Hell and how do `Promise.all()`, `Promise.race()`, and `Promise.allSettled()` work?

#### Answer:
A **Promise** represents the eventual completion or failure of an asynchronous operation, providing `.then()`, `.catch()`, and `.finally()` chaining.

**Key Static Promise Combinators**:
- `Promise.all([p1, p2])`: Runs promises concurrently. Fails immediately ("fast-fail") if **any** promise rejects. Resolves with an array of results if all succeed.
- `Promise.allSettled([p1, p2])`: Waits for all promises to finish (either resolved or rejected) and returns an array of status objects `{ status: 'fulfilled' | 'rejected', value, reason }`.
- `Promise.race([p1, p2])`: Settles as soon as the **first** promise either fulfills or rejects.

#### Example:
```javascript
const fetchUsers = () => Promise.resolve(['Alice', 'Bob']);
const fetchConfig = () => Promise.resolve({ timeout: 5000 });

Promise.all([fetchUsers(), fetchConfig()])
  .then(([users, config]) => {
    console.log('Both completed:', { users, config });
  })
  .catch((err) => console.error('One failed:', err));
```

---

### Q16. How does `async/await` syntax simplify Promise handling, and how do you handle errors with `try/catch`?

#### Answer:
`async/await` is syntactic sugar built on top of Promises:
- An `async` function always returns a Promise.
- The `await` keyword pauses execution inside the function until the Promise settles, returning the resolved value synchronously in appearance.
- Errors and Promise rejections are caught cleanly using standard `try/catch` blocks.

#### Example:
```javascript
const fetchUserData = async (userId) => {
  try {
    const user = await database.findUser(userId);
    if (!user) throw new Error('User not found');
    const permissions = await database.getPermissions(user.role);
    return { user, permissions };
  } catch (error) {
    console.error('Failed to load user data:', error.message);
    throw error; // Re-throw or return fallback
  }
};
```

---

### Q17. What is `process.env` and how do you manage environment variables using the `dotenv` package?

#### Answer:
`process.env` is a global object containing the user environment variables passed to the Node.js process.
- The `dotenv` package reads key-value pairs from a `.env` file at the root of the project and loads them into `process.env`.
- **Best Practice**: Never commit `.env` containing production secrets to git; commit `.env.example` instead.

#### Example:
```javascript
// .env file:
// PORT=4000
// DB_HOST=localhost

require('dotenv').config();

const port = process.env.PORT || 3000;
const dbHost = process.env.DB_HOST;

console.log(`Server starting on port ${port}, connecting to ${dbHost}`);
```

---

### Q18. What is `process.exit()` and what do exit codes (0 vs non-zero) signify?

#### Answer:
`process.exit([code])` forcefully terminates the running Node.js process immediately.
- `0`: Success (clean exit without errors).
- `1` (or any non-zero integer): Failure / Uncaught exception, signaling to the OS or process orchestrator (Docker, Kubernetes, PM2) that the application encountered a fatal error.

---

### Q19. What is Express.js and why is it preferred over raw Node.js `http` for building REST APIs?

#### Answer:
Express.js is a minimalist, flexible web framework for Node.js.
- **Routing Engine**: Intuitive syntax for path parameters, wildcards, and HTTP verbs (`app.get`, `app.post`).
- **Middleware Pipeline**: Seamless plug-and-play architecture for logging, CORS, body parsing, and authentication.
- **Convenient Helpers**: Built-in helpers like `res.json()`, `res.status()`, `req.params`, and `res.sendFile()`.
- **Ecosystem**: Thousands of ready-to-use npm middleware modules (`morgan`, `helmet`, `cors`, `multer`).

---

### Q20. How do you set up a basic Express application with route handlers (`app.get`, `app.post`)?

#### Answer:
Install Express (`npm install express`), instantiate `const app = express()`, define route handlers, and call `app.listen()`.

#### Example:
```javascript
const express = require('express');
const app = express();

app.use(express.json()); // Enable JSON body parsing

// GET route
app.get('/api/users', (req, res) => {
  res.json([{ id: 1, name: 'Alice' }]);
});

// POST route
app.post('/api/users', (req, res) => {
  const newUser = req.body;
  res.status(201).json({ message: 'User created', data: newUser });
});

app.listen(3000, () => console.log('Server running on port 3000'));
```

---

### Q21. What is Express Middleware and what do `req`, `res`, and `next()` represent?

#### Answer:
Middleware functions are functions that have access to the request object (`req`), response object (`res`), and the `next` function in the application’s request-response cycle.
- `req`: The incoming HTTP request.
- `res`: The outgoing HTTP response.
- `next()`: Passes control to the next middleware function in the pipeline. If `next()` is not called, the request hangs indefinitely.

#### Example:
```javascript
const requestLogger = (req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next(); // Pass to next middleware or route handler
};

app.use(requestLogger);
```

---

### Q22. How do you parse incoming JSON and URL-encoded request bodies using `express.json()` and `express.urlencoded()`?

#### Answer:
In Express 4.16+, body-parsing middleware is built-in:
- `express.json()`: Parses incoming HTTP requests with `Content-Type: application/json` and populates `req.body`.
- `express.urlencoded({ extended: true })`: Parses incoming form submissions (`application/x-www-form-urlencoded`). `extended: true` allows parsing nested objects via the `qs` library.

#### Example:
```javascript
const express = require('express');
const app = express();

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
```

---

### Q23. What is the difference between `req.params`, `req.query`, and `req.body` in Express?

#### Answer:
- `req.params`: Captures **named route parameters** defined in the route pattern (e.g., `/users/:id` $\rightarrow$ `req.params.id`).
- `req.query`: Captures **query string parameters** following the `?` in the URL (e.g., `/search?query=node&limit=10` $\rightarrow$ `req.query.query`, `req.query.limit`).
- `req.body`: Captures the parsed payload sent in the **HTTP request body** (for `POST`, `PUT`, `PATCH`).

---

### Q24. How do you send different types of responses in Express (`res.send`, `res.json`, `res.status`, `res.download`, `res.redirect`)?

#### Answer:
- `res.send(data)`: Sends arbitrary data (HTML string, Buffer, or object).
- `res.json(obj)`: Sets `Content-Type: application/json` and serializes the object.
- `res.status(code)`: Sets the HTTP status code (chainable: `res.status(404).json(...)`).
- `res.download(filePath)`: Prompts the client browser to download a file with appropriate `Content-Disposition`.
- `res.redirect(url)`: Redirects the client to another URL with a `302 Found` (or specified status code).

---

### Q25. How do HTTP status codes categorize responses (2xx, 3xx, 4xx, 5xx) in REST APIs?

#### Answer:
- **`2xx` (Success)**:
  - `200 OK`: Successful read or standard update.
  - `201 Created`: Resource successfully created (standard for `POST`).
  - `204 No Content`: Successful request returning no body (common for `DELETE`).
- **`3xx` (Redirection)**:
  - `301 Moved Permanently`: Permanent URL change.
  - `304 Not Modified`: Cached copy is valid (ETag / conditional GET).
- **`4xx` (Client Errors)**:
  - `400 Bad Request`: Validation failure or malformed payload.
  - `401 Unauthorized`: Missing or invalid authentication token.
  - `403 Forbidden`: Authenticated, but lacks required permissions.
  - `404 Not Found`: Target resource does not exist.
  - `409 Conflict`: Conflict with current state (e.g., duplicate email).
- **`5xx` (Server Errors)**:
  - `500 Internal Server Error`: Unhandled server exception.
  - `502 Bad Gateway` / `503 Service Unavailable`: Upstream service failure or server overload.

---

### Q26. How do you organize routes using `express.Router()` for modular application structure?

#### Answer:
`express.Router()` creates isolated mini-applications containing their own middleware and routes, mounted under specific path prefixes in the main app.

#### Example:
```javascript
// routes/users.router.js
const express = require('express');
const router = express.Router();

router.get('/', (req, res) => res.json({ users: [] }));
router.get('/:id', (req, res) => res.json({ id: req.params.id }));

module.exports = router;

// app.js
const express = require('express');
const usersRouter = require('./routes/users.router');
const app = express();

// Mounted under /api/v1/users prefix
app.use('/api/v1/users', usersRouter);
```

---

### Q27. How do you serve static assets (images, CSS, HTML) in Express using `express.static()`?

#### Answer:
Use `app.use(express.static('publicPath'))`.

#### Example:
```javascript
const path = require('path');
const express = require('express');
const app = express();

// Serves all files from the 'public' folder at root URL
app.use(express.static(path.join(__dirname, 'public')));

// Mounted under a virtual path prefix:
app.use('/static', express.static(path.join(__dirname, 'public')));
```

---

### Q28. How does error-handling middleware work in Express and why does it require four arguments `(err, req, res, next)`?

#### Answer:
Express identifies error-handling middleware specifically by checking the function’s `length` (number of declared arguments).
- **Must declare exactly 4 arguments**: `(err, req, res, next)`.
- If an error is passed to `next(err)` anywhere in previous route handlers, Express skips all subsequent regular route middleware and jumps straight to this error handler.

#### Example:
```javascript
app.get('/error-test', (req, res, next) => {
  const err = new Error('Database connection failed');
  err.status = 500;
  next(err); // Jumps to error middleware
});

// Centralized error handling middleware
app.use((err, req, res, next) => {
  console.error('[Error Caught]', err.message);
  const status = err.status || 500;
  res.status(status).json({
    success: false,
    message: err.message || 'Internal Server Error',
  });
});
```

---

### Q29. How do you handle 404 (Not Found) routes in Express?

#### Answer:
Place a catch-all middleware at the **very bottom** of all route definitions, just before the error-handling middleware.

#### Example:
```javascript
// 1. Regular routes above
app.get('/api/users', (req, res) => res.json([]));

// 2. 404 Catch-all handler
app.use((req, res, next) => {
  res.status(404).json({
    status: 404,
    error: 'Not Found',
    message: `Cannot ${req.method} ${req.originalUrl}`,
  });
});

// 3. Centralized 500 error handler below
app.use((err, req, res, next) => {
  res.status(500).json({ error: err.message });
});
```

---

### Q30. What is CORS and how do you configure the `cors` package in Express?

#### Answer:
**CORS (Cross-Origin Resource Sharing)** is a browser security mechanism that blocks web pages from making AJAX requests to a different domain/port than the one that served the page.
- In Express, the `cors` middleware automatically sets appropriate HTTP response headers (`Access-Control-Allow-Origin`, `Access-Control-Allow-Methods`).

#### Example:
```javascript
const cors = require('cors');

// Allow specific origins with credentials
app.use(
  cors({
    origin: ['http://localhost:3000', 'https://myapp.com'],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
  })
);
```

---

### Q31. How do you inspect and manipulate HTTP request and response headers in Express (`req.get`, `res.set`)?

#### Answer:
- `req.get('Header-Name')`: Reads an incoming request header (case-insensitive).
- `res.set('Header-Name', 'value')`: Sets an outgoing HTTP response header.

#### Example:
```javascript
app.get('/api/data', (req, res) => {
  const userAgent = req.get('user-agent');
  const authHeader = req.get('authorization');

  res.set('X-Custom-Header', 'MyApp-1.0');
  res.set('Cache-Control', 'no-store');

  res.json({ userAgent, hasAuth: Boolean(authHeader) });
});
```

---

### Q32. What is `nodemon` and how is it used during local development?

#### Answer:
`nodemon` is a developer tool that monitors changes in project files (`.js`, `.json`, `.ts`) and automatically restarts the Node.js server.
- Installed as a dev dependency: `npm install -D nodemon`.
- Run via npm script: `"dev": "nodemon src/index.js"`.
- Eliminates manual server stop and restart during coding.

---

### Q33. What is the difference between `process.nextTick()` and `setImmediate()` at a basic level?

#### Answer:
- `process.nextTick()`: Executes **immediately after the current synchronous operation finishes**, before the Event Loop moves to any other phase or handles I/O. It belongs to the microtask queue.
- `setImmediate()`: Schedules a callback to execute in the **Check phase** of the Event Loop, *after* I/O events have been processed.

---

### Q34. How do you perform basic input validation on incoming requests in Express?

#### Answer:
Validate incoming `req.body` or `req.query` attributes manually or using lightweight validation schemas before executing business logic, returning `400 Bad Request` if invalid.

#### Example:
```javascript
app.post('/api/register', (req, res) => {
  const { email, password } = req.body;

  if (!email || !email.includes('@')) {
    return res.status(400).json({ error: 'Valid email is required' });
  }

  if (!password || password.length < 8) {
    return res.status(400).json({ error: 'Password must be at least 8 characters long' });
  }

  res.status(201).json({ message: 'User registered successfully' });
});
```

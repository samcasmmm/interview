# 🔴 Next.js Interview Preparation — Master Level (4–6+ Years Experience)

> Senior & Principal Architect interview guide covering React Server Components Reconciler internals, Custom Distributed Cache Handlers (`IncrementalCache`), React Taint APIs, Multi-Region Active-Active Deployments, Asset Version Skew & Zero-Downtime Rollouts, Data Access Layer (DAL) security, Micro-Frontend Federation, OpenTelemetry Tracing, and Kernel Tuning for high-scale self-hosted Next.js clusters.

---

## 📑 Table of Contents

- [Q01. What is the internal architecture of the React Server Components (RSC) Reconciler and how does it stream without blocking?](#q01-what-is-the-internal-architecture-of-the-react-server-components-rsc-reconciler-and-how-does-it-stream-without-blocking)
- [Q02. How does the Next.js compiler split Server and Client module graphs at build time?](#q02-how-does-the-nextjs-compiler-split-server-and-client-module-graphs-at-build-time)
- [Q03. How do you design and implement a custom `IncrementalCache` provider for distributed enterprise clusters (Redis / Memcached)?](#q03-how-do-you-design-and-implement-a-custom-incrementalcache-provider-for-distributed-enterprise-clusters-redis--memcached)
- [Q04. What are React Taint APIs (`taintObjectReference`, `taintUniqueValue`) and how do they prevent sensitive data leaks?](#q04-what-are-react-taint-apis-taintobjectreference-taintuniquevalue-and-how-do-they-prevent-sensitive-data-leaks)
- [Q05. How do you architect a Multi-Region Active-Active deployment for Next.js applications with regional database replicas?](#q05-how-do-you-architect-a-multi-region-active-active-deployment-for-nextjs-applications-with-regional-database-replicas)
- [Q06. How do you eliminate Serverless Cold-Start latency in AWS Lambda / Vercel for high-traffic enterprise applications?](#q06-how-do-you-eliminate-serverless-cold-start-latency-in-aws-lambda--vercel-for-high-traffic-enterprise-applications)
- [Q07. What are the mechanics of HTTP/2 and HTTP/3 multiplexed streaming for RSC payloads and how do you tune CDN proxy buffers?](#q07-what-are-the-mechanics-of-http2-and-http3-multiplexed-streaming-for-rsc-payloads-and-how-do-you-tune-cdn-proxy-buffers)
- [Q08. How do you architect an enterprise Design System package supporting both Server Components and Client Components?](#q08-how-do-you-architect-an-enterprise-design-system-package-supporting-both-server-components-and-client-components)
- [Q09. How do you implement Dynamic Nonce Injection for strict Content Security Policy (CSP) with Streaming SSR?](#q09-how-do-you-implement-dynamic-nonce-injection-for-strict-content-security-policy-csp-with-streaming-ssr)
- [Q10. How do you architect a Micro-Frontend system with Next.js using Module Federation and Multi-Zone rewrites?](#q10-how-do-you-architect-a-micro-frontend-system-with-nextjs-using-module-federation-and-multi-zone-rewrites)
- [Q11. How do you resolve Asset Version Skew during rolling Kubernetes deployments without crashing client navigations?](#q11-how-do-you-resolve-asset-version-skew-during-rolling-kubernetes-deployments-without-crashing-client-navigations)
- [Q12. How do you optimize V8 heap allocation and tune GC flags for high-throughput self-hosted Next.js standalone containers?](#q12-how-do-you-optimize-v8-heap-allocation-and-tune-gc-flags-for-high-throughput-self-hosted-nextjs-standalone-containers)
- [Q13. How do you architect a 10M+ SKU E-Commerce platform using Partial Prerendering (PPR) and On-Demand Tag Revalidation?](#q13-how-do-you-architect-a-10m-sku-e-commerce-platform-using-partial-prerendering-ppr-and-on-demand-tag-revalidation)
- [Q14. How do you monitor and trace Next.js microservices using `instrumentation.ts` and OpenTelemetry distributed spans?](#q14-how-do-you-monitor-and-trace-nextjs-microservices-using-instrumentationts-and-opentelemetry-distributed-spans)
- [Q15. How do you design an offline-first Progressive Web App (PWA) with App Router and Service Workers?](#q15-how-do-you-design-an-offline-first-progressive-web-app-pwa-with-app-router-and-service-workers)
- [Q16. How does Next.js handle backpressure when streaming large responses from upstream microservices through Server Components?](#q16-how-does-nextjs-handle-backpressure-when-streaming-large-responses-from-upstream-microservices-through-server-components)
- [Q17. What are the architectural differences between Next.js on Vercel vs Next.js self-hosted on Kubernetes (OpenNext / Standalone)?](#q17-what-are-the-architectural-differences-between-nextjs-on-vercel-vs-nextjs-self-hosted-on-kubernetes-opennext--standalone)
- [Q18. How do you implement Zero-Trust Authorization using a Data Access Layer (DAL) and DTO projection in Server Components?](#q18-how-do-you-implement-zero-trust-authorization-using-a-data-access-layer-dal-and-dto-projection-in-server-components)
- [Q19. How do you build automated Codemods / AST transformers to migrate legacy Pages Router apps to App Router at scale?](#q19-how-do-you-build-automated-codemods--ast-transformers-to-migrate-legacy-pages-router-apps-to-app-router-at-scale)
- [Q20. How do you scale Image Optimization throughput in self-hosted Next.js clusters using Sharp and external S3 caching?](#q20-how-do-you-scale-image-optimization-throughput-in-self-hosted-nextjs-clusters-using-sharp-and-external-s3-caching)
- [Q21. How do you design a Real-Time Collaborative Canvas using Next.js Server Components, Yjs / CRDTs, and WebSockets?](#q21-how-do-you-design-a-real-time-collaborative-canvas-using-nextjs-server-components-yjs--crdts-and-websockets)
- [Q22. How do you prevent Prototype Pollution, ReDoS, and mass-assignment vulnerabilities in Next.js Server Actions?](#q22-how-do-you-prevent-prototype-pollution-redos-and-mass-assignment-vulnerabilities-in-nextjs-server-actions)
- [Q23. How do you architect a Multi-Tenant SaaS platform with custom domains, tenant-specific themes, and isolated cache partitions?](#q23-how-do-you-architect-a-multi-tenant-saas-platform-with-custom-domains-tenant-specific-themes-and-isolated-cache-partitions)
- [Q24. How do you implement end-to-end type safety between backend microservices and Next.js using tRPC or OpenAPI generators?](#q24-how-do-you-implement-end-to-end-type-safety-between-backend-microservices-and-nextjs-using-trpc-or-openapi-generators)
- [Q25. How do you design an enterprise A/B testing engine with zero layout shift and edge-computed variant assignments?](#q25-how-do-you-design-an-enterprise-ab-testing-engine-with-zero-layout-shift-and-edge-computed-variant-assignments)
- [Q26. How do you manage database connection starvation in serverless Next.js functions using connection proxies and edge drivers?](#q26-how-do-you-manage-database-connection-starvation-in-serverless-nextjs-functions-using-connection-proxies-and-edge-drivers)
- [Q27. How do you build an automated CI/CD preview deployment pipeline with Playwright E2E testing on ephemeral environments?](#q27-how-do-you-build-an-automated-cicd-preview-deployment-pipeline-with-playwright-e2e-testing-on-ephemeral-environments)
- [Q28. How do you tune Linux container kernel parameters and Node.js flags for high-concurrency self-hosted Next.js pods?](#q28-how-do-you-tune-linux-container-kernel-parameters-and-nodejs-flags-for-high-concurrency-self-hosted-nextjs-pods)
- [Q29. How do you implement immutable audit logging for Server Actions and mutations across distributed microservices?](#q29-how-do-you-implement-immutable-audit-logging-for-server-actions-and-mutations-across-distributed-microservices)
- [Q30. How do you architect a sub-50ms Global Search engine with Next.js App Router, Meilisearch / Algolia, and Optimistic UI?](#q30-how-do-you-architect-a-sub-50ms-global-search-engine-with-nextjs-app-router-meilisearch--algolia-and-optimistic-ui)
- [Q31. How do you profile CPU flamegraphs and memory retainers in Next.js Server Components using Node.js inspector?](#q31-how-do-you-profile-cpu-flamegraphs-and-memory-retainers-in-nextjs-server-components-using-nodejs-inspector)
- [Q32. What are the security risks of SSR injection and HTML escaping vulnerabilities in Next.js, and how does React prevent XSS?](#q32-what-are-the-security-risks-of-ssr-injection-and-html-escaping-vulnerabilities-in-nextjs-and-how-does-react-prevent-xss)
- [Q33. How do you build a custom asset CDN pipeline with Cloudflare Workers in front of self-hosted Next.js clusters?](#q33-how-do-you-build-a-custom-asset-cdn-pipeline-with-cloudflare-workers-in-front-of-self-hosted-nextjs-clusters)
- [Q34. What is the future architecture of React 19 and Next.js (Server Functions, Asset Loading, Document Metadata, Actions)?](#q34-what-is-the-future-architecture-of-react-19-and-nextjs-server-functions-asset-loading-document-metadata-actions)

---

### Q01. What is the internal architecture of the React Server Components (RSC) Reconciler and how does it stream without blocking?

#### Answer:
The RSC Reconciler operates as a separate React rendering tree executed exclusively on the server:
1. **Serialization Pass**: As components render, React converts HTML tags and primitive values into a serialized JSON-like stream (Flight protocol).
2. **Chunk Emission**: When an asynchronous Server Component awaits a Promise or database call, the reconciler immediately emits a placeholder slot ID (`$L1`) and flushes preceding HTML and RSC chunks over the HTTP connection using chunked transfer encoding.
3. **Stream Resolution**: When the Promise resolves, the reconciler emits the resolved subtree alongside its slot ID. The client-side React reconciler matches the slot ID and patches the DOM in place without tearing or re-mounting the outer layout.

---

### Q02. How does the Next.js compiler split Server and Client module graphs at build time?

#### Answer:
During compilation (via SWC/Turbopack), Next.js builds two distinct dependency graphs:
1. **Server Graph**: Contains all Server Components, Route Handlers, and backend utilities.
2. **Client Graph**: Rooted at every component marked with `'use client'`.
- Whenever a Server Component imports a Client Component, the compiler replaces the component code with a lightweight **Client Reference Proxy** (an object containing `{ $$typeof: Symbol(react.client.reference), id: "chunk_hash.js", name: "ExportName" }`).
- The actual Client Component JavaScript is bundled into an isolated client chunk loaded asynchronously by the browser.

---

### Q03. How do you design and implement a custom `IncrementalCache` provider for distributed enterprise clusters (Redis / Memcached)?

#### Answer:
Next.js allows replacing the local filesystem Data Cache with a distributed key-value store across containerized pods.
- Implement an object conforming to `IncrementalCache`:
  - `get(key)`: Reads cached entry from Redis.
  - `set(key, data, ctx)`: Writes serialized HTML/RSC/Data payload to Redis with TTL and associated tags.
  - `revalidateTag(tag)`: Invalidates all keys associated with the tag in a Redis set.

#### Example:
```javascript
// cache-handler.js
const { createClient } = require('redis');

class RedisCacheHandler {
  constructor(options) {
    this.redis = createClient({ url: process.env.REDIS_URL });
    this.redis.connect();
  }

  async get(key) {
    const data = await this.redis.get(`next_cache:${key}`);
    return data ? JSON.parse(data) : null;
  }

  async set(key, data, ctx) {
    await this.redis.set(`next_cache:${key}`, JSON.stringify(data), {
      EX: ctx.revalidate || 86400,
    });
  }

  async revalidateTag(tag) {
    // Invalidate tagged keys via Redis Set
    const keys = await this.redis.sMembers(`tag:${tag}`);
    if (keys.length > 0) {
      await this.redis.del(keys);
    }
  }
}

module.exports = RedisCacheHandler;
```

---

### Q04. What are React Taint APIs (`taintObjectReference`, `taintUniqueValue`) and how do they prevent sensitive data leaks?

#### Answer:
React Taint APIs prevent sensitive server-side objects (e.g. database user records containing password hashes or payment API keys) from accidentally being passed across Server Component boundaries into Client Components.
- `experimental_taintObjectReference(message, object)`: Throws a compile-time/runtime error if the object is passed to a Client Component.
- `experimental_taintUniqueValue(message, lifetime, value)`: Taints specific strings (like tokens or secrets).

#### Example:
```typescript
import { experimental_taintObjectReference } from 'react';

export async function getUserAccount(userId: string) {
  const user = await db.user.findUnique({ where: { id: userId } });
  // Taint user object: throws error if passed to client component!
  experimental_taintObjectReference('Never pass raw user database record to client components', user);
  return user;
}
```

---

### Q05. How do you architect a Multi-Region Active-Active deployment for Next.js applications with regional database replicas?

#### Answer:
1. **Edge Routing**: Anycast DNS (Cloudflare / AWS Route 53) routes users to the nearest regional Next.js container cluster (e.g., US-East, EU-West, AP-East).
2. **Read Traffic**: Server Components query regional read-replicas (e.g. AWS Aurora Global Database or Neon read replicas) with $<5\text{ms}$ query latency.
3. **Write Traffic (Server Actions)**: Routed to primary master database region or executed via distributed multi-primary stores (CockroachDB / Spanner) to prevent replication conflicts.
4. **Cache Sync**: Use a distributed Redis cluster (Upstash / AWS ElastiCache Global Datastore) for cross-region Data Cache invalidation.

---

### Q06. How do you eliminate Serverless Cold-Start latency in AWS Lambda / Vercel for high-traffic enterprise applications?

#### Answer:
1. **Use Edge Runtime** for latency-critical lightweight endpoints ($<5\text{ms}$ startup).
2. **Standalone Output**: Shrinks deployment packages to $<80\text{MB}$, drastically cutting decompression time.
3. **Provisioned Concurrency**: Pre-warm Lambda execution environments in AWS.
4. **Static Shells with PPR**: Serve static shells immediately from CDN cache, absorbing the first milliseconds of serverless function initialization in parallel.

---

### Q07. What are the mechanics of HTTP/2 and HTTP/3 multiplexed streaming for RSC payloads and how do you tune CDN proxy buffers?

#### Answer:
By default, some CDN edge proxies (e.g. NGINX, Cloudflare) buffer backend HTTP responses until the entire payload is generated, completely defeating streaming SSR!
- **Fix**: Send `X-Accel-Buffering: no` or `Transfer-Encoding: chunked` headers to force reverse proxies to flush chunks to the client immediately as they are emitted by the Next.js server.

---

### Q08. How do you architect an enterprise Design System package supporting both Server Components and Client Components?

#### Answer:
1. Components with no client hooks (Buttons, Badges, Typography, Grids) must **NOT** have `'use client'`; let them execute as Server Components.
2. Interactive components (Modals, Dropdowns, Carousels) include `'use client'` at the file header.
3. In `package.json`, export clean entry points using `"exports"` map:
   ```json
   "exports": {
     ".": "./dist/index.js",
     "./client": "./dist/client.js"
   }
   ```

---

### Q09. How do you implement Dynamic Nonce Injection for strict Content Security Policy (CSP) with Streaming SSR?

#### Answer:
Because streaming SSR streams HTML before the complete document is finished, static hashes cannot be computed.
1. `middleware.ts` generates a cryptographically random base64 nonce per request (`crypto.randomUUID()`).
2. Attaches `x-nonce` header to request.
3. In `app/layout.tsx`, reads `(await headers()).get('x-nonce')` and injects it into `<script nonce={nonce}>`.

---

### Q10. How do you architect a Micro-Frontend system with Next.js using Module Federation and Multi-Zone rewrites?

#### Answer:
- **Multi-Zones**: Cleanest approach for Next.js. Different teams own separate repositories deployed to independent domains. The main routing layer uses Next.js `rewrites()` to stitch them into a unified URL structure.
- **Module Federation (@module-federation/nextjs-mf)**: Enables dynamic sharing of React Client Component chunks across micro-frontends at runtime without iframe sandboxing.

---

### Q11. How do you resolve Asset Version Skew during rolling Kubernetes deployments without crashing client navigations?

#### Answer:
**The Problem**: Pods on Version 2 deploy while users are navigating Version 1. When a Version 1 user clicks a link, they request `_next/static/chunks/v1-hash.js` which no longer exists on Version 2 pods, triggering runtime 404 script errors.
- **Enterprise Solutions**:
  1. Upload all `_next/static` assets to an external durable CDN bucket (S3 / Cloudflare R2) with permanent immutable retention before triggering rolling updates.
  2. Maintain older assets on the CDN for at least 7 days post-deployment.

---

### Q12. How do you optimize V8 heap allocation and tune GC flags for high-throughput self-hosted Next.js standalone containers?

#### Answer:
In Docker container commands:
- Set `--max-old-space-size=1536` to constrain V8 heap to ~75% of container RAM limits to avoid sudden Kubernetes OOMKills.
- Tune `--optimize-for-size` in memory-constrained environments.
- Use Sharp with `sharp.cache(false)` to prevent native C++ image memory buffers from ballooning outside the V8 heap.

---

### Q13. How do you architect a 10M+ SKU E-Commerce platform using Partial Prerendering (PPR) and On-Demand Tag Revalidation?

#### Answer:
1. Pre-render 0 static pages at build time (`generateStaticParams` returns empty array or top 1000 items) to keep build times under 2 minutes.
2. Configure dynamic routes with `export const experimental_ppr = true`.
3. First visitor generates the static shell and streams dynamic pricing.
4. When product inventory updates in the ERP, publish an event to Kafka; a webhook listener executes `revalidateTag('product-${sku}')` in Next.js, immediately invalidating the CDN cache globally in $<300\text{ms}$.

---

### Q14. How do you monitor and trace Next.js microservices using `instrumentation.ts` and OpenTelemetry distributed spans?

#### Answer:
Export `register()` in `instrumentation.ts`:
```typescript
export async function register() {
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    const { NodeSDK } = await import('@opentelemetry/sdk-node');
    const { OTLPTraceExporter } = await import('@opentelemetry/exporter-trace-otlp-grpc');

    const sdk = new NodeSDK({
      traceExporter: new OTLPTraceExporter({ url: 'grpc://otel-collector:4317' }),
    });
    sdk.start();
  }
}
```

---

### Q15. How do you design an offline-first Progressive Web App (PWA) with App Router and Service Workers?

#### Answer:
Use `@ducanh2912/next-pwa`:
- Cache static shells and precached assets (`_next/static`) in the browser CacheStorage.
- Intercept navigation requests in the Service Worker: return cached static HTML shells when offline, and queue pending Server Action mutations in IndexedDB to synchronize via Background Sync API once connectivity is restored.

---

### Q16. How does Next.js handle backpressure when streaming large responses from upstream microservices through Server Components?

#### Answer:
Server Components utilize Node.js Web Streams (`ReadableStream`). When an upstream API yields data chunks, React consumes them via async generators. If the client network connection slows down, TCP backpressure automatically throttles the server stream and pauses reading from the upstream microservice socket.

---

### Q17. What are the architectural differences between Next.js on Vercel vs Next.js self-hosted on Kubernetes (OpenNext / Standalone)?

#### Answer:
- **Vercel**: Serverless architecture, Edge Middleware, distributed Edge Config, automatic image optimization via global CDN, zero-config ISR via KV cache.
- **Self-Hosted (Kubernetes Standalone)**: Long-running Node.js process, persistent TCP connections, requires custom distributed Cache Handlers (Redis), requires dedicated image optimization servers (Sharp) or Cloudflare CDN, full control over network topologies and VPC security.

---

### Q18. How do you implement Zero-Trust Authorization using a Data Access Layer (DAL) and DTO projection in Server Components?

#### Answer:
Never query the database directly inside page components without a validation layer:
- Build a dedicated **Data Access Layer (DAL)** that verifies the authenticated session, checks user permissions, and projects raw database entities into sanitized DTOs before returning them to Server Components.

#### Example:
```typescript
// lib/dal.ts
import 'server-only';
import { auth } from '@/auth';
import db from '@/lib/db';

export async function getDocument(docId: string) {
  const session = await auth();
  if (!session?.user) throw new Error('Unauthenticated');

  const doc = await db.document.findUnique({ where: { id: docId } });
  if (!doc || doc.organizationId !== session.user.orgId) {
    throw new Error('Forbidden'); // Tenant isolation enforcement
  }

  // DTO Projection: Strip sensitive internal fields
  return { id: doc.id, title: doc.title, content: doc.content };
}
```

---

### Q19. How do you build automated Codemods / AST transformers to migrate legacy Pages Router apps to App Router at scale?

#### Answer:
Use **jscodeshift**:
- Parse files into an AST.
- Transform `export async function getServerSideProps` into async Server Component data fetches.
- Replace `next/router` with `next/navigation`.
- Rename route files to `page.tsx` inside directory structures.

---

### Q20. How do you scale Image Optimization throughput in self-hosted Next.js clusters using Sharp and external S3 caching?

#### Answer:
In high-traffic self-hosted environments, dynamic image optimization can exhaust CPU.
- Offload image resizing to a dedicated Cloudflare Images or Imgix CDN.
- In `next.config.js`, configure `images: { loader: 'custom', path: 'https://cdn.img.com' }` to bypass the Next.js Node.js server entirely.

---

### Q21. How do you design a Real-Time Collaborative Canvas using Next.js Server Components, Yjs / CRDTs, and WebSockets?

#### Answer:
- Next.js Server Component loads the initial document snapshot from PostgreSQL for instant FCP.
- Client Component connects to a dedicated WebSocket server running **Yjs (CRDT)** to merge concurrent edits peer-to-peer with zero merge conflicts.

---

### Q22. How do you prevent Prototype Pollution, ReDoS, and mass-assignment vulnerabilities in Next.js Server Actions?

#### Answer:
1. Enforce strict schema validation using **Zod with `.strict()`** to strip unknown properties and prevent prototype tampering.
2. Avoid nested regex quantifiers.
3. Reject payloads containing `__proto__` or `constructor` keys.

---

### Q23. How do you architect a Multi-Tenant SaaS platform with custom domains, tenant-specific themes, and isolated cache partitions?

#### Answer:
1. `middleware.ts` maps incoming custom domain (`customer.com`) to `tenant_id`.
2. Rewrites path to `/tenants/[tenant_id]/...`.
3. Injects tenant-specific CSS variables dynamically in the Root Layout.
4. Partitions all `unstable_cache()` and `revalidateTag()` calls with tenant prefix: `tag: `${tenantId}-products``.

---

### Q24. How do you implement end-to-end type safety between backend microservices and Next.js using tRPC or OpenAPI generators?

#### Answer:
- Export the backend router type (`AppRouter`) as a shared npm package or monorepo workspace package (`@repo/api`).
- Next.js client and Server Components invoke the tRPC client with full autocomplete and compile-time type validation without writing any manual DTO interfaces.

---

### Q25. How do you design an enterprise A/B testing engine with zero layout shift and edge-computed variant assignments?

#### Answer:
1. Edge Middleware computes variant hash using visitor cookie or IP.
2. Rewrites request directly to the variant route before rendering starts.
3. Because the rewrite happens before HTML generation, the page renders with the exact variant markup with **zero layout shift (CLS = 0)**.

---

### Q26. How do you manage database connection starvation in serverless Next.js functions using connection proxies and edge drivers?

#### Answer:
Traditional TCP database connections cannot be pooled effectively across ephemeral Lambda instances.
- Use HTTP/WebSocket-based database drivers (e.g. `@neondatabase/serverless` or Prisma Accelerate) that multiplex queries over HTTP connections rather than opening persistent TCP sockets.

---

### Q27. How do you build an automated CI/CD preview deployment pipeline with Playwright E2E testing on ephemeral environments?

#### Answer:
1. GitHub Actions triggers on Pull Request.
2. Deploys an ephemeral preview environment on Vercel or Kubernetes namespace.
3. Runs headless Playwright E2E tests against the preview URL.
4. Comments test results and Lighthouse performance scores directly on the PR.

---

### Q28. How do you tune Linux container kernel parameters and Node.js flags for high-concurrency self-hosted Next.js pods?

#### Answer:
In Kubernetes deployment manifest:
- Set `NODE_ENV=production`.
- Tune container `sysctl`: `net.core.somaxconn=32768`.
- Enable Node.js cluster mode or run multiple pods behind an NGINX ingress controller with HTTP/2 keep-alive.

---

### Q29. How do you implement immutable audit logging for Server Actions and mutations across distributed microservices?

#### Answer:
Wrap Server Actions in a higher-order action creator (`createSafeAction`) that automatically captures authenticated user ID, client IP, action name, payload diff, and timestamp, emitting an audit event to a Kafka topic or Elasticsearch audit log.

---

### Q30. How do you architect a sub-50ms Global Search engine with Next.js App Router, Meilisearch / Algolia, and Optimistic UI?

#### Answer:
- Pre-render search layout in a Server Component.
- Search input executes client-side queries directly against the edge search index (Algolia / Meilisearch) via CDN.
- Pre-fetches matched product routes using `router.prefetch()` so clicking a search result renders instantaneously.

---

### Q31. How do you profile CPU flamegraphs and memory retainers in Next.js Server Components using Node.js inspector?

#### Answer:
Start the Next.js production server with `NODE_OPTIONS="--inspect" next start`:
- Attach Chrome DevTools.
- Record CPU profile during load testing to detect bottlenecks in RSC serialization or Markdown parsing.

---

### Q32. What are the security risks of SSR injection and HTML escaping vulnerabilities in Next.js, and how does React prevent XSS?

#### Answer:
React automatically escapes all string values rendered in JSX before inserting them into the DOM, preventing Cross-Site Scripting (XSS).
- **Vulnerabilities arise only when**:
  1. Using `dangerouslySetInnerHTML={{ __html: userContent }}` without sanitization (always sanitize with `DOMPurify` / `sanitize-html`).
  2. Unsafely embedding user input into inline `<script>` tags without JSON escaping.

---

### Q33. How do you build a custom asset CDN pipeline with Cloudflare Workers in front of self-hosted Next.js clusters?

#### Answer:
Deploy a Cloudflare Worker in front of the Next.js origin:
- Cache all `/_next/static/*` requests permanently at Cloudflare edge data centers.
- Implement tiered cache and stale-while-revalidate to shield origin pods from spike traffic.

---

### Q34. What is the future architecture of React 19 and Next.js (Server Functions, Asset Loading, Document Metadata, Actions)?

#### Answer:
- **Server Functions**: Standardized cross-framework specification for Server Actions.
- **Native Document Metadata**: Built-in `<title>`, `<meta>`, and `<link>` hoisting natively in React without external packages.
- **Resource Preloading**: React 19 APIs (`preload`, `preinit`) for fine-grained browser asset priority control directly in component rendering.
- **`use()` API**: Read promises and context conditionally inside render.

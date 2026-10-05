# 🟠 Next.js Interview Preparation — Advanced Level (2–4 Years Experience)

> Advanced interview guide covering React Server Component (RSC) Wire Protocol, Partial Prerendering (PPR), Selective Hydration, Edge vs Node.js runtime, Custom Distributed Cache Handlers (Redis), Server Action Security Hardening, `unstable_cache`, Docker standalone containerization, Multi-Zones, and Core Web Vitals optimization.

---

## 📑 Table of Contents

- [Q01. What is the React Server Component (RSC) Wire Format / Flight Payload and how does it stream to the browser?](#q01-what-is-the-react-server-component-rsc-wire-format--flight-payload-and-how-does-it-stream-to-the-browser)
- [Q02. How does Selective Hydration work with React 18/19 Suspense boundaries in Next.js?](#q02-how-does-selective-hydration-work-with-react-1819-suspense-boundaries-in-nextjs)
- [Q03. What is Partial Prerendering (PPR) in Next.js and how does it combine static shells with dynamic streams?](#q03-what-is-partial-prerendering-ppr-in-nextjs-and-how-does-it-combine-static-shells-with-dynamic-streams)
- [Q04. What are the key architectural differences between the Node.js Runtime and the Edge Runtime?](#q04-what-are-the-key-architectural-differences-between-the-nodejs-runtime-and-the-edge-runtime)
- [Q05. What are the strict limitations of the Edge Runtime in Next.js?](#q05-what-are-the-strict-limitations-of-the-edge-runtime-in-nextjs)
- [Q06. How does the Client Router Cache work in App Router and how do you invalidate it using `router.refresh()`?](#q06-how-does-the-client-router-cache-work-in-app-router-and-how-do-you-invalidate-it-using-routerrefresh)
- [Q07. What is `unstable_cache()` and how do you cache arbitrary ORM/Database queries with tags?](#q07-what-is-unstable_cache-and-how-do-you-cache-arbitrary-ormdatabase-queries-with-tags)
- [Q08. How do you configure a custom distributed cache handler (e.g. Redis Cache Handler) across multi-instance clusters?](#q08-how-do-you-configure-a-custom-distributed-cache-handler-eg-redis-cache-handler-across-multi-instance-clusters)
- [Q09. How do you optimize Core Web Vitals (LCP, INP, CLS) in a Next.js production application?](#q09-how-do-you-optimize-core-web-vitals-lcp-inp-cls-in-a-nextjs-production-application)
- [Q10. How do you self-host Next.js using Docker with `output: 'standalone'` in `next.config.js`?](#q10-how-do-you-self-host-nextjs-using-docker-with-output-standalone-in-nextconfigjs)
- [Q11. How does Next.js handle asset optimization and immutable caching headers for `_next/static`?](#q11-how-does-nextjs-handle-asset-optimization-and-immutable-caching-headers-for-_nextstatic)
- [Q12. What are Multi-Zones in Next.js and how do you merge multiple independent Next.js apps into a single domain?](#q12-what-are-multi-zones-in-nextjs-and-how-do-you-merge-multiple-independent-nextjs-apps-into-a-single-domain)
- [Q13. How do you implement zero-latency A/B testing and feature flags at the edge using Middleware and Edge Config?](#q13-how-do-you-implement-zero-latency-ab-testing-and-feature-flags-at-the-edge-using-middleware-and-edge-config)
- [Q14. What are the critical security risks of Server Actions and how do you harden them?](#q14-what-are-the-critical-security-risks-of-server-actions-and-how-do-you-harden-them)
- [Q15. How do you use the `server-only` package to prevent sensitive backend modules from leaking into client bundles?](#q15-how-do-you-use-the-server-only-package-to-prevent-sensitive-backend-modules-from-leaking-into-client-bundles)
- [Q16. How do you integrate WebSockets in a Next.js application without breaking serverless architecture?](#q16-how-do-you-integrate-websockets-in-a-nextjs-application-without-breaking-serverless-architecture)
- [Q17. How do you diagnose and eliminate memory leaks during Server-Side Rendering (SSR) under heavy load?](#q17-how-do-you-diagnose-and-eliminate-memory-leaks-during-server-side-rendering-ssr-under-heavy-load)
- [Q18. How do you manage database connection pooling (Prisma / Drizzle) in serverless Next.js deployments?](#q18-how-do-you-manage-database-connection-pooling-prisma--drizzle-in-serverless-nextjs-deployments)
- [Q19. What is `generateSitemaps()` and how do you scale sitemap generation for hundreds of thousands of dynamic pages?](#q19-what-is-generatesitemaps-and-how-do-you-scale-sitemap-generation-for-hundreds-of-thousands-of-dynamic-pages)
- [Q20. How do you configure dynamic `robots.ts` and Web App Manifest in Next.js App Router?](#q20-how-do-you-configure-dynamic-robotsts-and-web-app-manifest-in-nextjs-app-router)
- [Q21. How do you test Next.js Server Components and Server Actions using Playwright and Vitest?](#q21-how-do-you-test-nextjs-server-components-and-server-actions-using-playwright-and-vitest)
- [Q22. How do you implement Subdomain Multi-Tenancy (e.g., `tenant.platform.com`) using Next.js Middleware rewrites?](#q22-how-do-you-implement-subdomain-multi-tenancy-eg-tenantplatformcom-using-nextjs-middleware-rewrites)
- [Q23. How do you preserve independent scroll positions across deep nested layouts in App Router?](#q23-how-do-you-preserve-independent-scroll-positions-across-deep-nested-layouts-in-app-router)
- [Q24. How do you implement rate limiting for Server Actions and Route Handlers using `@upstash/ratelimit`?](#q24-how-do-you-implement-rate-limiting-for-server-actions-and-route-handlers-using-upstashratelimit)
- [Q25. How do you configure custom Turbopack and Webpack loaders in `next.config.js`?](#q25-how-do-you-configure-custom-turbopack-and-webpack-loaders-in-nextconfigjs)
- [Q26. What is Turbopack and how does its architecture differ from Webpack in Next.js?](#q26-what-is-turbopack-and-how-does-its-architecture-differ-from-webpack-in-nextjs)
- [Q27. How do you integrate GraphQL queries with automatic deduplication and caching in Server Components?](#q27-how-do-you-integrate-graphql-queries-with-automatic-deduplication-and-caching-in-server-components)
- [Q28. How do you synchronize authentication sessions between Server Components and Client Components?](#q28-how-do-you-synchronize-authentication-sessions-between-server-components-and-client-components)
- [Q29. How do you stream AI-generated responses (LLM tokens) using the Vercel AI SDK in Next.js?](#q29-how-do-you-stream-ai-generated-responses-llm-tokens-using-the-vercel-ai-sdk-in-nextjs)
- [Q30. How do you integrate Sentry error tracking with App Router Server Components and Edge Middleware?](#q30-how-do-you-integrate-sentry-error-tracking-with-app-router-server-components-and-edge-middleware)
- [Q31. How do you optimize Interaction to Next Paint (INP) when executing heavy client-side JavaScript?](#q31-how-do-you-optimize-interaction-to-next-paint-inp-when-executing-heavy-client-side-javascript)
- [Q32. How do you monitor Next.js servers and capture telemetry using `instrumentation.ts` and OpenTelemetry?](#q32-how-do-you-monitor-nextjs-servers-and-capture-telemetry-using-instrumentationts-and-opentelemetry)
- [Q33. How do you load dynamic localized dictionaries asynchronously without client bundle penalties?](#q33-how-do-you-load-dynamic-localized-dictionaries-asynchronously-without-client-bundle-penalties)
- [Q34. How does Next.js handle asset optimization for SVGs, fonts, and inline styles at build time?](#q34-how-does-nextjs-handle-asset-optimization-for-svgs-fonts-and-inline-styles-at-build-time)

---

### Q01. What is the React Server Component (RSC) Wire Format / Flight Payload and how does it stream to the browser?

#### Answer:
When a browser navigates between routes in Next.js App Router, the server does **not** return raw HTML or JSON. Instead, it streams a special compact binary/text format known as the **RSC Flight Payload**:
- Contains serialized React virtual elements, component props, and placeholder slot markers.
- References Client Component boundaries as bundle references (`$L1`, `$L2`) rather than embedding their code.
- Streams row-by-row over HTTP chunked transfer encoding, allowing React on the client to re-render and insert components into the active DOM tree before the entire response has finished generating.

```
0:["$","div",null,{"className":"feed","children":["$","$L1",null,{"userId":"42"}]}]
1:I{"id":"./components/UserCard.tsx","chunks":["client-chunk-1"],"name":""}
```

---

### Q02. How does Selective Hydration work with React 18/19 Suspense boundaries in Next.js?

#### Answer:
In legacy SSR, the browser had to download the entire JavaScript bundle and hydrate the **entire page** at once before any button was clickable (All-or-Nothing Hydration).
- **Selective Hydration**:
  - Components wrapped in `<Suspense fallback={<Skeleton />}>` do not block HTML streaming.
  - React streams the fallback first, streams the component HTML when data resolves, and hydrates individual Suspense subtrees **independently**.
  - **User Interaction Prioritization**: If a user clicks on an unhydrated component inside Suspense, React immediately pauses other background hydration tasks and prioritizes hydrating the clicked component first.

---

### Q03. What is Partial Prerendering (PPR) in Next.js and how does it combine static shells with dynamic streams?

#### Answer:
**Partial Prerendering (PPR)** combines the speed of Static Site Generation with the freshness of Server-Side Rendering into a **single HTTP response**:
1. At build time, Next.js generates a **Static Shell** (header, footer, sidebar, layout, and loading skeletons).
2. When a user requests the page, the static shell is served instantly from the CDN edge cache.
3. Within the exact same HTTP connection, dynamic holes wrapped in React `<Suspense>` are resolved on the server and **streamed in parallel** into the static shell.

#### Example:
```tsx
// next.config.js: experimental: { ppr: 'incremental' }
// app/product/[id]/page.tsx
import { Suspense } from 'react';
import StaticProductInfo from '@/components/StaticProductInfo';
import DynamicUserReviews from '@/components/DynamicUserReviews';

export const experimental_ppr = true;

export default function ProductPage({ params }: { params: { id: string } }) {
  return (
    <div>
      {/* 1. Static Shell (Served instantly from Edge CDN) */}
      <StaticProductInfo id={params.id} />

      {/* 2. Dynamic Hole (Streamed over the same connection) */}
      <Suspense fallback={<p>Loading reviews...</p>}>
        <DynamicUserReviews productId={params.id} />
      </Suspense>
    </div>
  );
}
```

---

### Q04. What are the key architectural differences between the Node.js Runtime and the Edge Runtime?

#### Answer:
| Feature | Node.js Runtime | Edge Runtime |
| :--- | :--- | :--- |
| **Engine** | Full Node.js runtime environment | Lightweight V8 isolate (Cloudflare Workers / Vercel Edge) |
| **Cold Start** | ~200–800ms | Sub-5ms instantaneous startup |
| **Memory Limit** | Up to several GBs | Constrained (typically 128MB) |
| **API Support** | Full POSIX (`fs`, `child_process`, `net`, native C++ addons) | Web Standards only (`Fetch`, `Request`, `Response`, `Crypto`, `Streams`) |
| **Execution Cost** | Higher resource consumption | Extremely cheap, geo-distributed near the user |

---

### Q05. What are the strict limitations of the Edge Runtime in Next.js?

#### Answer:
Because the Edge Runtime runs on lightweight V8 isolates rather than standard Node.js:
1. No filesystem access (`fs.readFile` will throw runtime errors).
2. No native C++ binary bindings (e.g. `bcrypt`, `sharp`, `sqlite3` fail unless compiled to WebAssembly).
3. No Node.js process APIs (`child_process.fork`, `process.chdir`).
4. Limited maximum execution duration (typically 30 seconds max).

---

### Q06. How does the Client Router Cache work in App Router and how do you invalidate it using `router.refresh()`?

#### Answer:
The **Router Cache** stores RSC payloads in browser memory per session:
- Re-visiting previously loaded routes or prefetched links loads from browser memory without sending requests to the server.
- **Cache Duration**: 30 seconds for dynamic routes, 5 minutes for static routes.
- **Invalidation**: Calling `router.refresh()` forces Next.js to purge the Client Router Cache, request fresh RSC payloads from the server, and reconcile current component state without losing client React state.

---

### Q07. What is `unstable_cache()` and how do you cache arbitrary ORM/Database queries with tags?

#### Answer:
`unstable_cache()` extends Next.js Data Cache to non-fetch operations (Prisma, Drizzle, raw PostgreSQL, Redis queries).

#### Example:
```typescript
import { unstable_cache } from 'next/cache';
import db from '@/lib/db';

export const getCachedUser = unstable_cache(
  async (userId: string) => {
    return await db.user.findUnique({ where: { id: userId } });
  },
  ['user-cache-key'], // Cache key parts
  {
    revalidate: 3600, // Cache for 1 hour
    tags: ['users', (userId) => `user-${userId}`], // Invalidation tags
  }
);

// Invalidate on demand via:
// revalidateTag('user-42');
```

---

### Q08. How do you configure a custom distributed cache handler (e.g. Redis Cache Handler) across multi-instance clusters?

#### Answer:
When hosting Next.js across multiple Docker containers or Kubernetes pods, in-memory or filesystem Data Cache causes cache inconsistency across pods.
- Configure `cacheHandler: require.resolve('./cache-handler.js')` in `next.config.js`.
- Implement a class conforming to the `IncrementalCache` interface using Redis (`get`, `set`, `revalidateTag`).

---

### Q09. How do you optimize Core Web Vitals (LCP, INP, CLS) in a Next.js production application?

#### Answer:
1. **LCP (Largest Contentful Paint)**:
   - Mark hero banner images with `priority={true}` in `next/image` to generate `<link rel="preload">`.
   - Avoid client-side fetch waterfalls; fetch critical data in Server Components.
2. **INP (Interaction to Next Paint)**:
   - Offload heavy tasks off the main thread or break long tasks using `startTransition` or `useDeferredValue`.
   - Minimize total client-side JavaScript bundle size.
3. **CLS (Cumulative Layout Shift)**:
   - Use `next/font` with zero-shift fallback font sizing.
   - Always supply explicit `width`/`height` or aspect-ratio on `<Image>` and video containers.

---

### Q10. How do you self-host Next.js using Docker with `output: 'standalone'` in `next.config.js`?

#### Answer:
Setting `output: 'standalone'` automatically traces dependencies and generates a stripped-down `server.js` containing only the necessary `node_modules`, shrinking Docker image sizes from ~1.2GB down to ~80MB.

#### Example:
```dockerfile
# Dockerfile
FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production

COPY .next/standalone ./
COPY .next/static ./.next/static
COPY public ./public

EXPOSE 3000
CMD ["node", "server.js"]
```

---

### Q11. How does Next.js handle asset optimization and immutable caching headers for `_next/static`?

#### Answer:
Next.js injects content hashes into all static asset filenames (`_next/static/chunks/main-a8f9c1.js`).
- Because filenames change whenever code changes, Next.js serves static assets with:
  ```http
  Cache-Control: public, max-age=31536000, immutable
  ```
- Browsers and CDNs cache these files permanently for 1 full year without ever re-validating with the origin server.

---

### Q12. What are Multi-Zones in Next.js and how do you merge multiple independent Next.js apps into a single domain?

#### Answer:
**Multi-Zones** allows large enterprises to split a massive Next.js application into multiple independently developed and deployed applications served under a single public domain:
- Main App: `example.com` (Repo A)
- Blog App: `example.com/blog` (Repo B)
- Shop App: `example.com/shop` (Repo C)
- The main app configures `rewrites()` in `next.config.js` pointing subpaths to upstream apps.

---

### Q13. How do you implement zero-latency A/B testing and feature flags at the edge using Middleware and Edge Config?

#### Answer:
In `middleware.ts`, fetch the experiment variant from an Edge KV store (like Vercel Edge Config) in $<1\text{ms}$, attach a cookie with the assigned bucket, and rewrite the request to the variant route segment.

#### Example:
```typescript
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/request';

export function middleware(req: NextRequest) {
  let bucket = req.cookies.get('ab-test-bucket')?.value;
  if (!bucket) {
    bucket = Math.random() < 0.5 ? 'variant-a' : 'variant-b';
  }

  const response = NextResponse.rewrite(new URL(`/experiments/${bucket}`, req.url));
  response.cookies.set('ab-test-bucket', bucket);
  return response;
}
```

---

### Q14. What are the critical security risks of Server Actions and how do you harden them?

#### Answer:
1. **Public POST Exposure**: Every Server Action compiles into a publicly reachable endpoint callable by anyone with a curl command.
   - **Fix**: Always verify authentication (`const session = await auth()`) inside the action itself.
2. **Missing Input Validation**: Attackers can send arbitrary JSON payloads.
   - **Fix**: Validate all parameters using `Zod` or `Valibot`.
3. **ID Predictability & Authorization**: Attackers change `userId` in parameters.
   - **Fix**: Never trust client-provided user IDs; extract the caller ID strictly from the authenticated session.

---

### Q15. How do you use the `server-only` package to prevent sensitive backend modules from leaking into client bundles?

#### Answer:
Install `server-only`: `npm install server-only`.
Add `import 'server-only'` at the top of backend database or secret utilities.
- If any developer accidentally imports this file into a Client Component, Next.js throws a **build-time error**, preventing secret API keys from being bundled into client code.

#### Example:
```typescript
// lib/secrets.ts
import 'server-only';

export const ADMIN_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
```

---

### Q16. How do you integrate WebSockets in a Next.js application without breaking serverless architecture?

#### Answer:
In serverless environments (Vercel/AWS Lambda), persistent WebSocket TCP connections cannot be maintained because functions freeze and terminate after requests.
- **Architectural Solution**: Host an external dedicated WebSocket gateway (Node.js/Socket.IO, AWS API Gateway WebSocket, or Pusher/Ably).
- Next.js Server Components publish events to Redis/Pusher via REST, which broadcasts to connected browser clients over persistent sockets.

---

### Q17. How do you diagnose and eliminate memory leaks during Server-Side Rendering (SSR) under heavy load?

#### Answer:
1. **Culprits**: Global caches without eviction (`global.cache = {}`), event listeners attached to singletons during rendering, unclosed database client instances.
2. **Diagnosis**: Run `node --inspect node_modules/.bin/next start`, simulate traffic with `autocannon`, and capture heap snapshots in Chrome DevTools.
3. **Remedy**: Scope all data caches to `unstable_cache()` or Redis; avoid module-level mutable variables.

---

### Q18. How do you manage database connection pooling (Prisma / Drizzle) in serverless Next.js deployments?

#### Answer:
Every serverless lambda invocation spins up an isolated Node.js instance. Under high traffic, hundreds of lambdas open hundreds of database connections, exhausting PostgreSQL connection limits (`too many connections`).
- **Remedy**: Use an external connection pooler like **PgBouncer**, AWS RDS Proxy, or serverless HTTP database drivers (Neon Serverless, Prisma Accelerate).

---

### Q19. What is `generateSitemaps()` and how do you scale sitemap generation for hundreds of thousands of dynamic pages?

#### Answer:
Next.js supports `generateSitemaps()` to split sitemaps into multiple indexed XML files (e.g. `/sitemap/0.xml`, `/sitemap/1.xml`), preventing 50,000 URL limits from breaking search engine crawlers.

#### Example:
```typescript
// app/sitemap.ts
export async function generateSitemaps() {
  // Fetch total count and return ID partitions
  return [{ id: 0 }, { id: 1 }, { id: 2 }];
}

export default async function sitemap({ id }: { id: number }) {
  const products = await getProductsPage(id, 20000);
  return products.map((p) => ({
    url: `https://example.com/product/${p.slug}`,
    lastModified: p.updatedAt,
  }));
}
```

---

### Q20. How do you configure dynamic `robots.ts` and Web App Manifest in Next.js App Router?

#### Answer:
Create `app/robots.ts` and `app/manifest.ts` returning structured objects that Next.js automatically transforms into valid `robots.txt` and `manifest.webmanifest`.

---

### Q21. How do you test Next.js Server Components and Server Actions using Playwright and Vitest?

#### Answer:
- **Server Components**: Unit tested via **Vitest** or Jest using custom mocks for `headers()` and `cookies()`.
- **E2E & Server Actions**: Tested via **Playwright** simulating real user clicks, verifying optimistic UI changes, and asserting database state changes.

---

### Q22. How do you implement Subdomain Multi-Tenancy (e.g., `tenant.platform.com`) using Next.js Middleware rewrites?

#### Answer:
Extract the hostname in `middleware.ts`, isolate the subdomain prefix, and rewrite the request internally to an `app/[tenant]/...` dynamic route folder.

#### Example:
```typescript
export function middleware(req: NextRequest) {
  const hostname = req.headers.get('host') || '';
  const currentHost = hostname.replace(`.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}`, '');

  if (currentHost && currentHost !== 'www') {
    return NextResponse.rewrite(new URL(`/${currentHost}${req.nextUrl.pathname}`, req.url));
  }
}
```

---

### Q23. How do you preserve independent scroll positions across deep nested layouts in App Router?

#### Answer:
Pass `scroll={false}` to `<Link>` components when navigating tabbed subviews within nested layouts to prevent the window from resetting scroll position to top:
```tsx
<Link href="/dashboard/settings/billing" scroll={false}>Billing</Link>
```

---

### Q24. How do you implement rate limiting for Server Actions and Route Handlers using `@upstash/ratelimit`?

#### Answer:
Use Redis Sliding Window algorithm via `@upstash/ratelimit` at the start of the Server Action using client IP or user ID.

#### Example:
```typescript
import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';
import { headers } from 'next/headers';

const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(5, '10 s'), // 5 requests per 10s
});

export async function submitAction() {
  const ip = (await headers()).get('x-forwarded-for') ?? '127.0.0.1';
  const { success } = await ratelimit.limit(ip);
  if (!success) throw new Error('Too many requests. Please wait.');
}
```

---

### Q25. How do you configure custom Turbopack and Webpack loaders in `next.config.js`?

#### Answer:
Use the `webpack` function or `experimental.turbo.rules` in `next.config.js`.

---

### Q26. What is Turbopack and how does its architecture differ from Webpack in Next.js?

#### Answer:
**Turbopack** is an incremental bundler written in Rust:
- Never computes the same work twice (Function-level caching).
- Uses SWC for blazing-fast native compilation.
- Handles HMR up to 10x faster than Webpack in massive enterprise codebases.

---

### Q27. How do you integrate GraphQL queries with automatic deduplication and caching in Server Components?

#### Answer:
Use native `fetch()` pointing to the GraphQL endpoint inside Server Components with query deduplication and cache tags:
```typescript
const res = await fetch('https://api.com/graphql', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ query: GET_PRODUCT_QUERY }),
  next: { tags: ['products'] },
});
```

---

### Q28. How do you synchronize authentication sessions between Server Components and Client Components?

#### Answer:
Fetch the session once on the server in Root Layout using `await auth()`, pass it into `<SessionProvider session={session}>`, allowing Client Components to access `useSession()` synchronously without client-side network roundtrips.

---

### Q29. How do you stream AI-generated responses (LLM tokens) using the Vercel AI SDK in Next.js?

#### Answer:
Use `StreamingTextResponse` or `createStreamableUI()` from the `ai` package, piping tokens from OpenAI/Anthropic directly to a client hook (`useCompletion` / `useChat`).

---

### Q30. How do you integrate Sentry error tracking with App Router Server Components and Edge Middleware?

#### Answer:
Use `@sentry/nextjs` with `sentry.client.config.ts`, `sentry.server.config.ts`, and `sentry.edge.config.ts` to capture full stack traces across server components, edge middleware, and client error boundaries.

---

### Q31. How do you optimize Interaction to Next Paint (INP) when executing heavy client-side JavaScript?

#### Answer:
Use React 18 `useTransition` or `scheduler.yield()` to yield control back to the browser main thread between CPU-heavy operations, keeping the UI responsive to user input.

---

### Q32. How do you monitor Next.js servers and capture telemetry using `instrumentation.ts` and OpenTelemetry?

#### Answer:
Export a `register()` function from `instrumentation.ts` at the root of the project to initialize OpenTelemetry SDK tracers before server execution starts.

---

### Q33. How do you load dynamic localized dictionaries asynchronously without client bundle penalties?

#### Answer:
Define dynamic import dictionaries mapped by locale (`const dictionaries = { en: () => import('./en.json') }`). Load the dictionary in the Server Component; only the translated text is sent in the RSC payload.

---

### Q34. How does Next.js handle asset optimization for SVGs, fonts, and inline styles at build time?

#### Answer:
- Inlines critical CSS directly into `<head>` to prevent render blocking.
- Defer non-critical stylesheets.
- Optimizes fonts via zero-layout-shift CSS variables.

# 🟡 Next.js Interview Preparation — Intermediate Level (1–2 Years Experience)

> Comprehensive interview guide covering Server Actions (`'use server'`), Form Mutations (`useActionState`, `useFormStatus`, `useOptimistic`), Next.js 4-tier Caching Architecture, Incremental Static Regeneration (ISR), `generateStaticParams`, Edge Middleware, Parallel Routes, Intercepting Routes, Auth.js (NextAuth), and Streaming.

---

## 📑 Table of Contents

- [Q01. What are Server Actions (`'use server'`) and how do they replace traditional REST API endpoints for mutations?](#q01-what-are-server-actions-use-server-and-how-do-they-replace-traditional-rest-api-endpoints-for-mutations)
- [Q02. How do you invoke Server Actions from Client Components with transitions (`useTransition`)?](#q02-how-do-you-invoke-server-actions-from-client-components-with-transitions-usetransition)
- [Q03. How do you manage form state, validation errors, and pending states using `useActionState` and `useFormStatus`?](#q03-how-do-you-manage-form-state-validation-errors-and-pending-states-using-useactionstate-and-useformstatus)
- [Q04. How do you implement instant Optimistic UI updates with Server Actions using `useOptimistic`?](#q04-how-do-you-implement-instant-optimistic-ui-updates-with-server-actions-using-useoptimistic)
- [Q05. What are the four distinct caching mechanisms in Next.js App Router?](#q05-what-are-the-four-distinct-caching-mechanisms-in-nextjs-app-router)
- [Q06. How does React Request Memoization work for duplicate `fetch()` calls in the same render pass?](#q06-how-does-react-request-memoization-work-for-duplicate-fetch-calls-in-the-same-render-pass)
- [Q07. What is the Next.js Data Cache and how do you configure cache behavior in `fetch()`?](#q07-what-is-the-nextjs-data-cache-and-how-do-you-configure-cache-behavior-in-fetch)
- [Q08. What is Incremental Static Regeneration (ISR) and how do you configure time-based revalidation?](#q08-what-is-incremental-static-regeneration-isr-and-how-do-you-configure-time-based-revalidation)
- [Q09. How does On-Demand Revalidation work using `revalidatePath()` and `revalidateTag()`?](#q09-how-does-on-demand-revalidation-work-using-revalidatepath-and-revalidatetag)
- [Q10. What is `generateStaticParams()` and how does it pre-render dynamic routes at build time?](#q10-what-is-generatestaticparams-and-how-does-it-pre-render-dynamic-routes-at-build-time)
- [Q11. What is the difference between Static Rendering and Dynamic Rendering in App Router, and what triggers Dynamic Rendering?](#q11-what-is-the-difference-between-static-rendering-and-dynamic-rendering-in-app-router-and-what-triggers-dynamic-rendering)
- [Q12. What are "Dynamic Functions" (`cookies()`, `headers()`, `searchParams`) and how do they opt routes into Dynamic Rendering?](#q12-what-are-dynamic-functions-cookies-headers-searchparams-and-how-do-they-opt-routes-into-dynamic-rendering)
- [Q13. How does Next.js `middleware.ts` work and where does it execute?](#q13-how-does-nextjs-middlewarets-work-and-where-does-it-execute)
- [Q14. How do you implement protected routes and auth redirects in `middleware.ts`?](#q14-how-do-you-implement-protected-routes-and-auth-redirects-in-middlewarets)
- [Q15. What is the difference between URL Rewrites and URL Redirects in `middleware.ts`?](#q15-what-is-the-difference-between-url-rewrites-and-url-redirects-in-middlewarets)
- [Q16. What are Parallel Routes (`@slot`) and how do you use them to build complex dashboard views?](#q16-what-are-parallel-routes-slot-and-how-do-you-use-them-to-build-complex-dashboard-views)
- [Q17. What is `default.tsx` and why is it mandatory when using Parallel Routes?](#q17-what-is-defaulttsx-and-why-is-it-mandatory-when-using-parallel-routes)
- [Q18. What are Intercepting Routes (`(.)`, `(..)`, `(...)`) and how do you build modal routes (like Instagram photo feed)?](#q18-what-are-intercepting-routes----and-how-do-you-build-modal-routes-like-instagram-photo-feed)
- [Q19. How do you set, read, and delete HTTP cookies and headers in Route Handlers (`next/headers`)?](#q19-how-do-you-set-read-and-delete-http-cookies-and-headers-in-route-handlers-nextheaders)
- [Q20. How do you stream responses from Route Handlers (e.g. OpenAI / LLM text streams)?](#q20-how-do-you-stream-responses-from-route-handlers-eg-openai--llm-text-streams)
- [Q21. How do you integrate NextAuth.js (Auth.js) in Next.js App Router with OAuth and JWT sessions?](#q21-how-do-you-integrate-nextauthjs-authjs-in-nextjs-app-router-with-oauth-and-jwt-sessions)
- [Q22. How do you secure Server Actions against unauthorized execution and injection attacks?](#q22-how-do-you-secure-server-actions-against-unauthorized-execution-and-injection-attacks)
- [Q23. What is `next/script` and what are the loading strategies (`beforeInteractive`, `afterInteractive`, `lazyOnload`)?](#q23-what-is-nextscript-and-what-are-the-loading-strategies-beforeinteractive-afterinteractive-lazyonload)
- [Q24. How do you analyze and eliminate bloated dependencies using `@next/bundle-analyzer`?](#q24-how-do-you-analyze-and-eliminate-bloated-dependencies-using-nextbundle-analyzer)
- [Q25. How do you implement Internationalization (i18n) in App Router using localized subpaths (`/[lang]/`) and Middleware?](#q25-how-do-you-implement-internationalization-i18n-in-app-router-using-localized-subpaths-lang-and-middleware)
- [Q26. How do you dynamically import heavy Client Components using `next/dynamic` with SSR disabled?](#q26-how-do-you-dynamically-import-heavy-client-components-using-nextdynamic-with-ssr-disabled)
- [Q27. How do you generate dynamic Open Graph (OG) social share images using `@vercel/og` (`ImageResponse`)?](#q27-how-do-you-generate-dynamic-open-graph-og-social-share-images-using-vercelog-imageresponse)
- [Q28. What is `global-error.tsx` and how does it catch errors thrown inside the Root Layout?](#q28-what-is-global-errortsx-and-how-does-it-catch-errors-thrown-inside-the-root-layout)
- [Q29. How do you handle multipart file uploads in Next.js using Server Actions?](#q29-how-do-you-handle-multipart-file-uploads-in-nextjs-using-server-actions)
- [Q30. How do you handle Cross-Origin Resource Sharing (CORS) in Route Handlers (`app/api/`)?](#q30-how-do-you-handle-cross-origin-resource-sharing-cors-in-route-handlers-appapi)
- [Q31. How does Server-Side Rendering in Pages Router (`getServerSideProps`) compare to App Router Server Components?](#q31-how-does-server-side-rendering-in-pages-router-getserversideprops-compare-to-app-router-server-components)
- [Q32. How do `getStaticProps` and `getStaticPaths` from Pages Router map to App Router concepts?](#q32-how-do-getstaticprops-and-getstaticpaths-from-pages-router-map-to-app-router-concepts)
- [Q33. How do you build an infinite scrolling list combining Server Components and Client Components?](#q33-how-do-you-build-an-infinite-scrolling-list-combining-server-components-and-client-components)
- [Q34. How do you configure Content Security Policy (CSP) with nonces in Next.js `middleware.ts`?](#q34-how-do-you-configure-content-security-policy-csp-with-nonces-in-nextjs-middlewarets)

---

### Q01. What are Server Actions (`'use server'`) and how do they replace traditional REST API endpoints for mutations?

#### Answer:
**Server Actions** are asynchronous functions that execute strictly on the server. They can be defined inside Server Components or in separate files marked with the `'use server'` directive.
- **Why replace traditional REST API endpoints?**
  - Eliminates the need to create boilerplate `app/api/route.ts` endpoints, write custom `fetch('/api/...')` calls, and manually keep types in sync between frontend and backend.
  - Server Actions integrate seamlessly with HTML `<form action={myAction}>`, working even if JavaScript is disabled or still downloading on slow networks (Progressive Enhancement).
  - Automatically revalidates the active route cache via `revalidatePath()` or `revalidateTag()`.

#### Example:
```tsx
// app/actions/todos.ts
'use server';

import db from '@/lib/db';
import { revalidatePath } from 'next/cache';

export async function createTodo(formData: FormData) {
  const title = formData.get('title') as string;
  if (!title) throw new Error('Title is required');

  await db.todo.create({ data: { title } });
  revalidatePath('/todos'); // Re-renders the page with fresh data
}
```

---

### Q02. How do you invoke Server Actions from Client Components with transitions (`useTransition`)?

#### Answer:
In Client Components, Server Actions can be invoked inside `startTransition`. This provides an `isPending` boolean flag to show loading spinners or disable buttons without freezing the UI.

#### Example:
```tsx
'use client';

import { useTransition } from 'react';
import { deleteTodo } from '@/app/actions/todos';

export default function DeleteButton({ id }: { id: string }) {
  const [isPending, startTransition] = useTransition();

  return (
    <button
      disabled={isPending}
      onClick={() => {
        startTransition(async () => {
          await deleteTodo(id);
        });
      }}
    >
      {isPending ? 'Deleting...' : 'Delete'}
    </button>
  );
}
```

---

### Q03. How do you manage form state, validation errors, and pending states using `useActionState` and `useFormStatus`?

#### Answer:
- **`useActionState`** (React 19 / Next.js 15, formerly `useFormState`): Tracks the state returned by a Server Action (e.g. validation errors or success messages).
- **`useFormStatus`**: Hook used inside form child components to read the parent `<form>` submission status (`pending`, `data`, `method`).

#### Example:
```tsx
// 1. Submit Button with useFormStatus:
'use client';
import { useFormStatus } from 'react-dom';

function SubmitButton() {
  const { pending } = useFormStatus();
  return <button disabled={pending}>{pending ? 'Saving...' : 'Save User'}</button>;
}

// 2. Form with useActionState:
import { useActionState } from 'react';
import { registerUser } from '@/app/actions/auth';

export default function RegisterForm() {
  const [state, formAction] = useActionState(registerUser, { error: null });

  return (
    <form action={formAction}>
      <input name="email" type="email" required />
      {state.error && <p className="error">{state.error}</p>}
      <SubmitButton />
    </form>
  );
}
```

---

### Q04. How do you implement instant Optimistic UI updates with Server Actions using `useOptimistic`?

#### Answer:
`useOptimistic` displays the intended mutation state immediately before the network request completes. If the server action succeeds, the real data takes over; if it fails, React automatically rolls back to the previous state.

#### Example:
```tsx
'use client';

import { useOptimistic, useRef } from 'react';
import { addComment } from '@/app/actions/comments';

interface Comment { id: string; text: string; }

export default function CommentsList({ initialComments }: { initialComments: Comment[] }) {
  const formRef = useRef<HTMLFormElement>(null);
  const [optimisticComments, setOptimisticComments] = useOptimistic(
    initialComments,
    (state, newText: string) => [...state, { id: 'temp-' + Date.now(), text: newText }]
  );

  async function action(formData: FormData) {
    const text = formData.get('comment') as string;
    formRef.current?.reset();
    setOptimisticComments(text); // Instant UI update!
    await addComment(text);      // Network request
  }

  return (
    <div>
      <ul>
        {optimisticComments.map((c) => (
          <li key={c.id}>{c.text}</li>
        ))}
      </ul>
      <form ref={formRef} action={action}>
        <input name="comment" required />
        <button type="submit">Post</button>
      </form>
    </div>
  );
}
```

---

### Q05. What are the four distinct caching mechanisms in Next.js App Router?

#### Answer:
Next.js App Router implements a multi-layer caching system:

| Cache Mechanism | What it Caches | Where it Lives | Lifetime |
| :--- | :--- | :--- | :--- |
| **Request Memoization** | Return values of identical `fetch(url)` calls | Server Memory (during render) | Single render pass |
| **Data Cache** | Data fetched via `fetch()` across user requests | Server Disk / Distributed Store | Persistent until revalidated |
| **Full Route Cache** | Rendered HTML and RSC Payload of static routes | Server Memory / Disk | Persistent until revalidated |
| **Router Cache** | RSC payloads of visited / prefetched routes | Client Browser Memory | Session (30s dynamic, 5m static) |

---

### Q06. How does React Request Memoization work for duplicate `fetch()` calls in the same render pass?

#### Answer:
React automatically patches the native `fetch()` function so that if three different components in the same component tree execute `fetch('https://api.com/user')` with the exact same URL and options, only **one single network request** is executed. The response is memoized in memory and shared across all three components during that server render.

```
       Server Render Pass
               │
        ┌──────┴──────┐
        ▼             ▼
   Header.tsx     Profile.tsx
        │             │
  fetch('/user') fetch('/user')
        │             │
        └──────┬──────┘
               ▼
   [Request Memoization Cache]
               │ (Only 1 network call made!)
               ▼
        Database / API
```

---

### Q07. What is the Next.js Data Cache and how do you configure cache behavior in `fetch()`?

#### Answer:
The Data Cache stores data fetch results persistently across server requests and deployments:
- `fetch(url, { cache: 'force-cache' })`: Default behavior in Next.js 14. Data is cached indefinitely until revalidated.
- `fetch(url, { cache: 'no-store' })`: Always fetches fresh data on every request (opts out of Data Cache).
- In Next.js 15: `fetch` defaults to `no-store` unless explicitly cached or static.

---

### Q08. What is Incremental Static Regeneration (ISR) and how do you configure time-based revalidation?

#### Answer:
**ISR** allows you to update static pages in the background without rebuilding your entire website.
- Pass `{ next: { revalidate: 60 } }` to `fetch()`, or export `export const revalidate = 60` from `page.tsx`.
- The first user after 60 seconds sees the cached stale page while Next.js triggers a background rebuild. Once regenerated, subsequent requests receive the newly updated page.

#### Example:
```tsx
// app/products/page.tsx
export const revalidate = 60; // Revalidate every 60 seconds

export default async function Products() {
  const res = await fetch('https://api.com/products');
  const products = await res.json();

  return (
    <div>
      <h1>Products (Updated every 60s)</h1>
      <p>Rendered at: {new Date().toISOString()}</p>
    </div>
  );
}
```

---

### Q09. How does On-Demand Revalidation work using `revalidatePath()` and `revalidateTag()`?

#### Answer:
Instead of waiting for a timer to expire, On-Demand Revalidation immediately purges the cache when a mutation occurs.
- `revalidatePath('/products')`: Invalidates all cached data and rendered HTML for that specific URL route.
- `revalidateTag('products-list')`: Invalidates any `fetch` call that included that cache tag, regardless of which page called it.

#### Example:
```tsx
// In component:
await fetch('https://api.com/products', { next: { tags: ['products-list'] } });

// In Server Action (after mutation):
'use server';
import { revalidateTag } from 'next/cache';

export async function addProduct(data: any) {
  await db.product.create({ data });
  revalidateTag('products-list'); // Instantly purges cache
}
```

---

### Q10. What is `generateStaticParams()` and how does it pre-render dynamic routes at build time?

#### Answer:
`generateStaticParams()` replaces `getStaticPaths` from Pages Router. It returns an array of route parameters that Next.js uses to pre-render dynamic routes (`[slug]`) into static HTML at build time.

#### Example:
```tsx
// app/blog/[slug]/page.tsx
export async function generateStaticParams() {
  const posts = await getPublishedPosts();

  return posts.map((post) => ({
    slug: post.slug,
  }));
}

export default async function BlogPost({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return <h1>Post: {slug}</h1>;
}
```

---

### Q11. What is the difference between Static Rendering and Dynamic Rendering in App Router, and what triggers Dynamic Rendering?

#### Answer:
- **Static Rendering**: Routes are rendered at build time (or in the background via ISR). Fast CDN delivery.
- **Dynamic Rendering**: Routes are rendered on the server for each specific user request.
- **What triggers Dynamic Rendering?**
  1. Using **Dynamic Functions**: `cookies()`, `headers()`, or `searchParams`.
  2. Uncached `fetch(url, { cache: 'no-store' })`.
  3. Setting `export const dynamic = 'force-dynamic'`.

---

### Q12. What are "Dynamic Functions" (`cookies()`, `headers()`, `searchParams`) and how do they opt routes into Dynamic Rendering?

#### Answer:
Because `cookies()`, `headers()`, and query parameters depend on incoming client HTTP headers that cannot be known at build time, using them inside a Server Component automatically flips the entire route segment from **Static Rendering** to **Dynamic Rendering**.

---

### Q13. How does Next.js `middleware.ts` work and where does it execute?

#### Answer:
`middleware.ts` is placed at the root of the project (or inside `src/`). It intercepts incoming HTTP requests **before** Next.js routes, caches, or renders the page.
- Executes on the **Edge Runtime** (lightweight V8 isolate, minimal cold-start latency).
- Can inspect cookies, rewrite URLs, redirect users, modify headers, or return responses directly.

---

### Q14. How do you implement protected routes and auth redirects in `middleware.ts`?

#### Answer:
Inspect the session cookie or JWT in the request. If missing or invalid on protected routes, redirect to the login page.

#### Example:
```typescript
// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/request';

export function middleware(request: NextRequest) {
  const sessionToken = request.cookies.get('session_token')?.value;
  const isDashboard = request.nextUrl.pathname.startsWith('/dashboard');

  if (isDashboard && !sessionToken) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('redirect', request.nextUrl.pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*', '/settings/:path*'],
};
```

---

### Q15. What is the difference between URL Rewrites and URL Redirects in `middleware.ts`?

#### Answer:
- **Redirect (`NextResponse.redirect(url)`)**: Sends an HTTP `307`/`308` response to the client browser. The browser URL updates to the new location.
- **Rewrite (`NextResponse.rewrite(url)`)**: Modifies the internal request path without changing the URL shown in the client's browser bar (acts as a reverse proxy).
  - Used for white-label multi-tenancy (`tenant1.com` $\rightarrow$ `/tenants/tenant1`) and A/B testing.

---

### Q16. What are Parallel Routes (`@slot`) and how do you use them to build complex dashboard views?

#### Answer:
Parallel Routes allow simultaneously rendering one or more independent pages in the same layout using named slots defined with `@folder` syntax (e.g. `@analytics`, `@team`).
- Each slot is passed as a prop to the parent `layout.tsx`.
- Each slot can have its own independent `loading.tsx` and `error.tsx` states.

#### Example:
```tsx
// app/dashboard/layout.tsx
export default function DashboardLayout({
  children,
  analytics,
  team,
}: {
  children: React.ReactNode;
  analytics: React.ReactNode;
  team: React.ReactNode;
}) {
  return (
    <div>
      {children}
      <div className="grid grid-cols-2 gap-4">
        <div>{analytics}</div>
        <div>{team}</div>
      </div>
    </div>
  );
}
```

---

### Q17. What is `default.tsx` and why is it mandatory when using Parallel Routes?

#### Answer:
During hard page reloads (full browser refresh), Next.js cannot determine what to display in parallel slots that don't match the current URL.
- **`default.tsx`** provides a fallback view to render for unmatched slots during initial page loads or hard refreshes.
- Without `default.tsx`, hard refreshing on an unmatched parallel route returns a 404.

---

### Q18. What are Intercepting Routes (`(.)`, `(..)`, `(...)`) and how do you build modal routes (like Instagram photo feed)?

#### Answer:
Intercepting Routes allow you to intercept a route navigation and display a modal overlay while preserving the current page context, while still allowing direct URL visits (or reloads) to render the full standalone page.

**Conventions**:
- `(.)`: Intercepts routes on the **same level**.
- `(..)`: Intercepts routes **one level above**.
- `(...)`: Intercepts routes from the **root** `app` directory.

#### Example:
```
app/
├── feed/
│   ├── page.tsx          # Feed with photo thumbnails
│   ├── layout.tsx
│   └── @modal/
│       └── (.)photo/[id]/ # Intercepts clicking a photo
│           └── page.tsx  # Renders photo inside a modal!
└── photo/[id]/
    └── page.tsx          # Standalone full page on refresh
```

---

### Q19. How do you set, read, and delete HTTP cookies and headers in Route Handlers (`next/headers`)?

#### Answer:
Use `cookies()` and `headers()` from `next/headers`.

#### Example:
```typescript
// app/api/auth/session/route.ts
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function POST() {
  const cookieStore = await cookies();

  // Set cookie
  cookieStore.set('session_id', 'sess_991823', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7, // 7 days
    path: '/',
  });

  return NextResponse.json({ success: true });
}

export async function DELETE() {
  const cookieStore = await cookies();
  cookieStore.delete('session_id'); // Delete cookie
  return NextResponse.json({ loggedOut: true });
}
```

---

### Q20. How do you stream responses from Route Handlers (e.g. OpenAI / LLM text streams)?

#### Answer:
Return a `Response` initialized with a `ReadableStream` and appropriate headers (`text/event-stream` or `text/plain`).

#### Example:
```typescript
// app/api/stream/route.ts
export async function GET() {
  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    async start(controller) {
      for (const word of ['Generating', 'AI', 'Response', 'Stream...']) {
        controller.enqueue(encoder.encode(word + ' '));
        await new Promise((res) => setTimeout(res, 300));
      }
      controller.close();
    },
  });

  return new Response(stream, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
}
```

---

### Q21. How do you integrate NextAuth.js (Auth.js) in Next.js App Router with OAuth and JWT sessions?

#### Answer:
1. Create `auth.ts` declaring providers (GitHub, Google, Credentials).
2. Export `{ handlers: { GET, POST }, auth, signIn, signOut } = NextAuth(config)`.
3. In `app/api/auth/[...nextauth]/route.ts`: export `const { GET, POST } = handlers`.
4. In Server Components, call `const session = await auth()`.

---

### Q22. How do you secure Server Actions against unauthorized execution and injection attacks?

#### Answer:
Server Actions compile into public POST endpoints accessible via HTTP requests. They must be treated like public REST controllers:
1. **Authenticate**: Verify session inside the action.
2. **Authorize**: Verify user roles/permissions.
3. **Validate Inputs**: Use `Zod` to parse `formData` or arguments.

#### Example:
```typescript
'use server';

import { auth } from '@/auth';
import { z } from 'zod';

const updateSchema = z.object({ email: z.string().email() });

export async function updateUserEmail(input: unknown) {
  const session = await auth();
  if (!session?.user) throw new Error('Unauthorized');

  const { email } = updateSchema.parse(input);
  await db.user.update({ where: { id: session.user.id }, data: { email } });
}
```

---

### Q23. What is `next/script` and what are the loading strategies (`beforeInteractive`, `afterInteractive`, `lazyOnload`)?

#### Answer:
`next/script` manages loading third-party scripts (Google Analytics, Stripe, Ads):
- `beforeInteractive`: Injected before page hydration. Best for critical bots or polyfills.
- `afterInteractive` (Default): Loads immediately after page becomes interactive. Best for analytics.
- `lazyOnload`: Loads during idle browser time. Best for chat widgets or social embeds.
- `worker`: (Experimental) Offloads script to a web worker via Partytown.

---

### Q24. How do you analyze and eliminate bloated dependencies using `@next/bundle-analyzer`?

#### Answer:
Install `@next/bundle-analyzer` and wrap your config in `next.config.js`:
```javascript
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});
module.exports = withBundleAnalyzer({ /* nextConfig */ });
```
Run `ANALYZE=true npm run build` to generate visual treemaps of client bundles, highlighting bloated packages (e.g., replacing `moment.js` with `date-fns`).

---

### Q25. How do you implement Internationalization (i18n) in App Router using localized subpaths (`/[lang]/`) and Middleware?

#### Answer:
1. In `middleware.ts`, detect user locale from `Accept-Language` header or cookies and rewrite or redirect to `/[lang]/...` (e.g. `/en/about`, `/es/about`).
2. Nest routes under `app/[lang]/page.tsx`.
3. Load dynamic translation dictionaries asynchronously in Server Components based on `params.lang`.

---

### Q26. How do you dynamically import heavy Client Components using `next/dynamic` with SSR disabled?

#### Answer:
`next/dynamic` enables lazy loading of Client Components, downloading the component JS only when rendered. `ssr: false` prevents server-side rendering for components requiring browser APIs (e.g. Canvas charts or rich text editors).

#### Example:
```tsx
import dynamic from 'next/dynamic';

const HeavyChart = dynamic(() => import('@/components/HeavyChart'), {
  ssr: false,
  loading: () => <p>Loading interactive chart...</p>,
});

export default function AnalyticsPage() {
  return <HeavyChart />;
}
```

---

### Q27. How do you generate dynamic Open Graph (OG) social share images using `@vercel/og` (`ImageResponse`)?

#### Answer:
Create an `opengraph-image.tsx` file inside any route. It exports a function returning an `ImageResponse` that converts JSX markup and CSS into an optimized PNG image at the edge.

#### Example:
```tsx
// app/blog/[slug]/opengraph-image.tsx
import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const size = { width: 1200, height: 630 };

export default async function Image({ params }: { params: { slug: string } }) {
  return new ImageResponse(
    (
      <div style={{ display: 'flex', background: '#111', color: '#fff', width: '100%', height: '100%', alignItems: 'center', justifyContent: 'center' }}>
        <h1 style={{ fontSize: 60 }}>{params.slug}</h1>
      </div>
    ),
    { ...size }
  );
}
```

---

### Q28. What is `global-error.tsx` and how does it catch errors thrown inside the Root Layout?

#### Answer:
`app/error.tsx` catches errors in child page components, but cannot catch errors that occur inside the Root Layout (`app/layout.tsx`).
- **`app/global-error.tsx`** catches errors in the Root Layout.
- It must be a Client Component and must define its own `<html>` and `<body>` tags because it replaces the entire root document on crash.

---

### Q29. How do you handle multipart file uploads in Next.js using Server Actions?

#### Answer:
Server Actions natively support receiving `FormData` objects containing files. You can convert the file to a buffer and stream it to S3 or disk.

#### Example:
```tsx
'use server';

export async function uploadAvatar(formData: FormData) {
  const file = formData.get('avatar') as File;
  if (!file) throw new Error('No file provided');

  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  // Upload buffer to S3 / Cloudinary...
  return { success: true, name: file.name, size: file.size };
}
```

---

### Q30. How do you handle Cross-Origin Resource Sharing (CORS) in Route Handlers (`app/api/`)?

#### Answer:
Define an `OPTIONS` handler and attach CORS headers to the response.

#### Example:
```typescript
import { NextResponse } from 'next/server';

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': 'https://mytrustedfrontend.com',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}
```

---

### Q31. How does Server-Side Rendering in Pages Router (`getServerSideProps`) compare to App Router Server Components?

#### Answer:
- **`getServerSideProps`**:
  - Runs at the page level only.
  - Blocks the entire page render until all data fetches complete.
  - Serializes all returned props into `__NEXT_DATA__` JSON script tag in the HTML, inflating page weight.
- **App Router Server Components**:
  - Executed at the individual component level.
  - Non-blocking: Streams HTML and data via React Suspense.
  - Zero props JSON inflation: Only the minimal RSC wire payload is sent.

---

### Q32. How do `getStaticProps` and `getStaticPaths` from Pages Router map to App Router concepts?

#### Answer:
- `getStaticProps` $\rightarrow$ Standard `fetch()` calls in Server Components (defaults to static caching) or `async function Page()`.
- `getStaticPaths` $\rightarrow$ `generateStaticParams()`.
- `revalidate: 60` in `getStaticProps` $\rightarrow$ `export const revalidate = 60` or `fetch(url, { next: { revalidate: 60 } })`.

---

### Q33. How do you build an infinite scrolling list combining Server Components and Client Components?

#### Answer:
Render the initial batch of items in a Server Component for instant SEO and fast FCP. Pass the initial data to a Client Component that uses an `IntersectionObserver` to trigger a Server Action or Route Handler to append subsequent pages.

---

### Q34. How do you configure Content Security Policy (CSP) with nonces in Next.js `middleware.ts`?

#### Answer:
Generate a cryptographic random nonce per request in `middleware.ts`, attach it to the `Content-Security-Policy` header, forward it to the page via request headers, and attach it to inline `<Script nonce={nonce}>`.

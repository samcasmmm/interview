# 🟢 Next.js Interview Preparation — Basic Level (0–1 Year Experience)

> Comprehensive interview guide covering Next.js fundamentals, App Router vs Pages Router, file-system conventions (`page.tsx`, `layout.tsx`, `loading.tsx`, `error.tsx`, `not-found.tsx`), React Server Components (RSC) vs Client Components (`'use client'`), data fetching, dynamic routing, `<Image>`, `<Link>`, `next/font`, and metadata.

---

## 📑 Table of Contents

- [Q01. What is Next.js and why would you choose it over a traditional React Single Page Application (Vite/CRA)?](#q01-what-is-nextjs-and-why-would-you-choose-it-over-a-traditional-react-single-page-application-vitecra)
- [Q02. What are the fundamental differences between the App Router (`app/`) and the Pages Router (`pages/`)?](#q02-what-are-the-fundamental-differences-between-the-app-router-app-and-the-pages-router-pages)
- [Q03. What is the role of `page.tsx` and `layout.tsx` in the Next.js App Router?](#q03-what-is-the-role-of-pagetsx-and-layouttsx-in-the-nextjs-app-router)
- [Q04. What is the Root Layout (`app/layout.tsx`) and why is it mandatory?](#q04-what-is-the-root-layout-applayouttsx-and-why-is-it-mandatory)
- [Q05. What are React Server Components (RSC) and why are App Router components Server Components by default?](#q05-what-are-react-server-components-rsc-and-why-are-app-router-components-server-components-by-default)
- [Q06. When and why must you add the `'use client'` directive to a component?](#q06-when-and-why-must-you-add-the-use-client-directive-to-a-component)
- [Q07. What are the strict limitations of React Server Components?](#q07-what-are-the-strict-limitations-of-react-server-components)
- [Q08. How do you compose Server Components and Client Components together without breaking server-rendering?](#q08-how-do-you-compose-server-components-and-client-components-together-without-breaking-server-rendering)
- [Q09. How does client-side navigation work using `<Link>` and why should you avoid standard `<a>` tags?](#q09-how-does-client-side-navigation-work-using-link-and-why-should-you-avoid-standard-a-tags)
- [Q10. How do you perform programmatic navigation using `useRouter()` in App Router?](#q10-how-do-you-perform-programmatic-navigation-using-userouter-in-app-router)
- [Q11. How do Dynamic Routes work in Next.js (`[slug]`) and how do you access route parameters?](#q11-how-do-dynamic-routes-work-in-nextjs-slug-and-how-do-you-access-route-parameters)
- [Q12. What is the difference between Catch-All Routes (`[...slug]`) and Optional Catch-All Routes (`[[...slug]]`)?](#q12-what-is-the-difference-between-catch-all-routes-slug-and-optional-catch-all-routes-slug)
- [Q13. How do you handle loading UI using `loading.tsx` and React Suspense?](#q13-how-do-you-handle-loading-ui-using-loadingtsx-and-react-suspense)
- [Q14. How do you build 404 pages using `not-found.tsx` and trigger them programmatically via `notFound()`?](#q14-how-do-you-build-404-pages-using-not-foundtsx-and-trigger-them-programmatically-via-notfound)
- [Q15. How does error handling work using `error.tsx` and why must it always be a Client Component?](#q15-how-does-error-handling-work-using-errortsx-and-why-must-it-always-be-a-client-component)
- [Q16. How do you fetch data directly in Server Components using async/await without `useEffect`?](#q16-how-do-you-fetch-data-directly-in-server-components-using-asyncawait-without-useeffect)
- [Q17. What is Static Site Generation (SSG) vs Server-Side Rendering (SSR) in Next.js?](#q17-what-is-static-site-generation-ssg-vs-server-side-rendering-ssr-in-nextjs)
- [Q18. How does the `next/image` component optimize images and prevent Cumulative Layout Shift (CLS)?](#q18-how-does-the-nextimage-component-optimize-images-and-prevent-cumulative-layout-shift-cls)
- [Q19. How do you configure Google Fonts with zero layout shift using `next/font`?](#q19-how-do-you-configure-google-fonts-with-zero-layout-shift-using-nextfont)
- [Q20. How do you define Static and Dynamic SEO Metadata using `metadata` and `generateMetadata`?](#q20-how-do-you-define-static-and-dynamic-seo-metadata-using-metadata-and-generatemetadata)
- [Q21. What are Route Handlers (`app/api/route.ts`) and how do you handle GET and POST HTTP requests?](#q21-what-are-route-handlers-appapiroutets-and-how-do-you-handle-get-and-post-http-requests)
- [Q22. What is the difference between `useSearchParams()` in Client Components and the `searchParams` prop in Page components?](#q22-what-is-the-difference-between-usesearchparams-in-client-components-and-the-searchparams-prop-in-page-components)
- [Q23. What is the difference between private environment variables and `NEXT_PUBLIC_` variables?](#q23-what-is-the-difference-between-private-environment-variables-and-next_public_-variables)
- [Q24. What is `template.tsx` and how does it differ from `layout.tsx` regarding component re-mounting?](#q24-what-is-templatetsx-and-how-does-it-differ-from-layouttsx-regarding-component-re-mounting)
- [Q25. How do Nested Layouts work and why do layouts preserve component state during navigation?](#q25-how-do-nested-layouts-work-and-why-do-layouts-preserve-component-state-during-navigation)
- [Q26. How do you redirect users programmatically using `redirect()` and `permanentRedirect()`?](#q26-how-do-you-redirect-users-programmatically-using-redirect-and-permanentredirect)
- [Q27. How do you configure Tailwind CSS or CSS Modules in Next.js App Router?](#q27-how-do-you-configure-tailwind-css-or-css-modules-in-nextjs-app-router)
- [Q28. What is the purpose of `next.config.js` and what are common configuration options?](#q28-what-is-the-purpose-of-nextconfigjs-and-what-are-common-configuration-options)
- [Q29. How do you serve static assets from the `public/` directory?](#q29-how-do-you-serve-static-assets-from-the-public-directory)
- [Q30. What is the exact difference between `next dev`, `next build`, and `next start`?](#q30-what-is-the-exact-difference-between-next-dev-next-build-and-next-start)
- [Q31. How do you use the `usePathname()` hook to highlight the active link in a navigation bar?](#q31-how-do-you-use-the-usepathname-hook-to-highlight-the-active-link-in-a-navigation-bar)
- [Q32. What is client-side link prefetching in `<Link>` and how does it make page transitions instantaneous?](#q32-what-is-client-side-link-prefetching-in-link-and-how-does-it-make-page-transitions-instantaneous)
- [Q33. How do you add static Favicons, Open Graph images, and Sitemaps in App Router?](#q33-how-do-you-add-static-favicons-open-graph-images-and-sitemaps-in-app-router)
- [Q34. How do you organize routes without changing the URL path using Route Groups `(folder)`?](#q34-how-do-you-organize-routes-without-changing-the-url-path-using-route-groups-folder)

---

### Q01. What is Next.js and why would you choose it over a traditional React Single Page Application (Vite/CRA)?

#### Answer:
**Next.js** is a full-stack React framework created by Vercel that combines server-side rendering, static site generation, client-side React rendering, and backend API routing into a single cohesive ecosystem.

**Why Choose Next.js over Pure React SPA (Vite/CRA)**:
1. **Search Engine Optimization (SEO)**: Pure SPAs render an empty `<div id="root"></div>` over the wire, relying on client-side JS to download, parse, and render content. Next.js pre-renders HTML on the server so search engine crawlers immediately see complete content and metadata.
2. **First Contentful Paint (FCP)**: Users receive fully populated HTML immediately without waiting for massive client JavaScript bundles to download and execute.
3. **Zero-Bundle-Size Server Components**: Heavy dependencies (Markdown parsers, database drivers, date libraries) run exclusively on the server and are never sent to the browser.
4. **Built-in File-System Routing**: Eliminates manual configuration of React Router.
5. **Native Optimization Suite**: Automatic image optimization (`next/image`), font self-hosting (`next/font`), and script management (`next/script`).

---

### Q02. What are the fundamental differences between the App Router (`app/`) and the Pages Router (`pages/`)?

#### Answer:
Next.js 13 introduced the **App Router** (`app/` directory), built on top of modern React Server Components (RSC) and React 18/19 streaming architectures, replacing the legacy **Pages Router** (`pages/` directory).

| Feature | Pages Router (`pages/`) | App Router (`app/`) |
| :--- | :--- | :--- |
| **Component Model** | All components are Client Components by default | Components are **Server Components** by default |
| **Routing Mechanism** | File name defines the route (`pages/about.tsx`) | Folder defines route, file must be `page.tsx` (`app/about/page.tsx`) |
| **Data Fetching** | Special functions (`getServerSideProps`, `getStaticProps`) | Standard `async/await` directly in components |
| **Layouts** | Requires manual custom wrapper or `_app.tsx` | Native nested layouts (`layout.tsx`) preserving state |
| **Streaming & Loading** | Full page blocking until data resolves | Granular streaming via `loading.tsx` and `<Suspense>` |
| **Directory** | `pages/` | `app/` |

---

### Q03. What is the role of `page.tsx` and `layout.tsx` in the Next.js App Router?

#### Answer:
- **`page.tsx`**: Defines the unique UI for a specific URL route. A route is not publicly accessible until a `page.tsx` file is added inside its directory.
- **`layout.tsx`**: Defines UI that is **shared across multiple routes** (e.g. navigation headers, sidebars, footers).
  - Layouts wrap child pages and child layouts via the `children` prop.
  - Layouts **do not re-render** when navigating between sibling routes, preserving client component state (e.g. video playback, scroll position, search input value).

#### Example:
```tsx
// app/dashboard/layout.tsx
export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="dashboard-container">
      <aside className="sidebar">Sidebar Navigation</aside>
      <main className="content">{children}</main>
    </div>
  );
}

// app/dashboard/page.tsx
export default function DashboardPage() {
  return <h1>Dashboard Overview</h1>;
}
```

---

### Q04. What is the Root Layout (`app/layout.tsx`) and why is it mandatory?

#### Answer:
The **Root Layout** is located at the top-level of the `app/` directory (`app/layout.tsx`). It is mandatory for every Next.js App Router application.
- It must define the top-level `<html>` and `<body>` HTML tags.
- It applies to all routes in the application.
- It is the ideal place to inject global CSS, global providers (Theme, Auth, QueryClient), and application fonts.

#### Example:
```tsx
// app/layout.tsx
import './globals.css';
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'My Next.js Application',
  description: 'Built with Next.js App Router',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <header>Global Site Header</header>
        {children}
      </body>
    </html>
  );
}
```

---

### Q05. What are React Server Components (RSC) and why are App Router components Server Components by default?

#### Answer:
**React Server Components (RSC)** are components that execute exclusively on the server (either at build time or request time) and **never ship their JavaScript code to the client**.

**Key Benefits**:
1. **Zero Client Bundle Impact**: Libraries like `date-fns`, `lodash`, or Markdown parsers used inside Server Components add zero kilobytes to the client JavaScript bundle.
2. **Direct Backend Resource Access**: Can directly query databases (PostgreSQL, MongoDB, Prisma), read local filesystems (`fs`), and access private API tokens without exposing backend credentials.
3. **Automatic Code Splitting**: Client components imported by Server Components are automatically dynamically split.

---

### Q06. When and why must you add the `'use client'` directive to a component?

#### Answer:
The `'use client'` directive marks the boundary between Server Components and Client Components. It tells Next.js to package the component and its imported dependencies into the client JavaScript bundle.

**You MUST use `'use client'` when the component**:
1. Uses React state hooks (`useState`, `useReducer`).
2. Uses React lifecycle hooks (`useEffect`, `useLayoutEffect`).
3. Uses event listeners (`onClick`, `onChange`, `onSubmit`).
4. Uses browser-only APIs (`window`, `localStorage`, `navigator`, `document`).
5. Uses custom hooks that depend on client hooks or context (`useTheme`, `useForm`).

#### Example:
```tsx
'use client';

import { useState } from 'react';

export default function Counter() {
  const [count, setCount] = useState(0);

  return (
    <button onClick={() => setCount(count + 1)}>
      Clicked: {count} times
    </button>
  );
}
```

---

### Q07. What are the strict limitations of React Server Components?

#### Answer:
Because Server Components run only on the server, they **CANNOT**:
1. Use React State or Lifecycle hooks (`useState`, `useEffect`, `useReducer`, `useCallback`).
2. Attach DOM event handlers (`onClick`, `onMouseEnter`, `onSubmit`).
3. Access browser-specific APIs (`window`, `document`, `localStorage`, `sessionStorage`, `navigator`).
4. Use React Context Providers directly (`createContext`, `useContext`).

---

### Q08. How do you compose Server Components and Client Components together without breaking server-rendering?

#### Answer:
You cannot import a Server Component directly into a Client Component (because the client cannot execute server-only code).
- **The Pattern**: Pass the Server Component as a `children` prop (or another slot prop) to the Client Component. The Server Component is rendered on the server first, and its rendered result (RSC payload) is passed as JSX children to the Client Component.

#### Example:
```tsx
// 1. Client Component: components/Modal.tsx
'use client';
import { useState } from 'react';

export default function Modal({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div>
      <button onClick={() => setIsOpen(!isOpen)}>Toggle Modal</button>
      {isOpen && <div className="modal-content">{children}</div>}
    </div>
  );
}

// 2. Server Component: app/page.tsx
import Modal from '@/components/Modal';
import db from '@/lib/db'; // Server-only DB access!

export default async function Page() {
  const secretData = await db.query('SELECT * FROM stats'); // Runs on server

  return (
    <Modal>
      {/* Passed as children: retains server component execution */}
      <h2>Server Rendered Stats: {secretData.length}</h2>
    </Modal>
  );
}
```

---

### Q09. How does client-side navigation work using `<Link>` and why should you avoid standard `<a>` tags?

#### Answer:
- **`<a>` Tag**: Causes a full browser document refresh, wiping out all in-memory client state, re-executing all root scripts, and making an entire network round-trip.
- **`<Link href="...">`**: Intercepts the click, prevents full page reload, and performs a fast **Single Page Application (SPA)** client transition:
  - Fetches only the changed route segment's Server Component payload (RSC payload).
  - Preserves shared layout states.
  - Automatically **prefetches** linked routes in the background when the link enters the viewport.

#### Example:
```tsx
import Link from 'next/link';

export default function Navbar() {
  return (
    <nav>
      <Link href="/about" className="nav-item">About Us</Link>
      <Link href="/products" prefetch={true}>Products</Link>
    </nav>
  );
}
```

---

### Q10. How do you perform programmatic navigation using `useRouter()` in App Router?

#### Answer:
In App Router, import `useRouter` from **`next/navigation`** (NOT `next/router`, which is Pages Router only). The component must be a Client Component (`'use client'`).

#### Example:
```tsx
'use client';

import { useRouter } from 'next/navigation';

export default function CheckoutButton() {
  const router = useRouter();

  const handlePayment = async () => {
    // Process payment...
    router.push('/checkout/success'); // Navigate
    // router.replace('/login');      // Replace history entry
    // router.refresh();              // Refresh current route from server
  };

  return <button onClick={handlePayment}>Pay Now</button>;
}
```

---

### Q11. How do Dynamic Routes work in Next.js (`[slug]`) and how do you access route parameters?

#### Answer:
Wrap a folder name in square brackets: `app/blog/[slug]/page.tsx`.
- The dynamic parameter is automatically passed to the `page.tsx` component inside the `params` prop.
- In Next.js 15, `params` is an asynchronous Promise that must be awaited.

#### Example:
```tsx
// app/blog/[slug]/page.tsx
interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params;

  return (
    <article>
      <h1>Reading Article: {slug}</h1>
      <p>Content for {slug} fetched directly on the server...</p>
    </article>
  );
}
```

---

### Q12. What is the difference between Catch-All Routes (`[...slug]`) and Optional Catch-All Routes (`[[...slug]]`)?

#### Answer:
- **Catch-All (`app/docs/[...slug]/page.tsx`)**:
  - Matches 1 or more path segments.
  - Matches: `/docs/intro`, `/docs/intro/setup`, `/docs/intro/setup/windows`.
  - Does **NOT** match: `/docs` (returns 404).
  - `params.slug` is an array: `['intro', 'setup']`.
- **Optional Catch-All (`app/docs/[[...slug]]/page.tsx`)**:
  - Matches 0 or more path segments.
  - Matches: `/docs` (matches root with `params.slug = undefined`), `/docs/intro`, `/docs/intro/setup`.

---

### Q13. How do you handle loading UI using `loading.tsx` and React Suspense?

#### Answer:
Creating a `loading.tsx` file inside any route folder automatically wraps the `page.tsx` component (and all its children) in a **React `<Suspense>` boundary**.
- When navigating to the route, Next.js immediately streams the shared layout and the `loading.tsx` UI to the user while the server component finishes awaiting data.

#### Example:
```tsx
// app/dashboard/loading.tsx
export default function Loading() {
  return (
    <div className="skeleton-container">
      <div className="skeleton-header">Loading dashboard stats...</div>
      <div className="skeleton-card" />
    </div>
  );
}
```

---

### Q14. How do you build 404 pages using `not-found.tsx` and trigger them programmatically via `notFound()`?

#### Answer:
- **`not-found.tsx`**: Renders when a URL has no matching route, or when the `notFound()` function is called inside a Server Component.

#### Example:
```tsx
// app/products/[id]/page.tsx
import { notFound } from 'next/navigation';

export default async function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const product = await getProductById(id);

  if (!product) {
    notFound(); // Immediately halts execution and renders not-found.tsx
  }

  return <h1>{product.name}</h1>;
}

// app/not-found.tsx
export default function NotFound() {
  return (
    <div>
      <h2>404 - Resource Not Found</h2>
      <p>The requested page or item could not be located.</p>
    </div>
  );
}
```

---

### Q15. How does error handling work using `error.tsx` and why must it always be a Client Component?

#### Answer:
Creating an `error.tsx` file creates a **React Error Boundary** wrapping the route segment and its child pages.
- **Why must it be a Client Component (`'use client'`)?**
  - Error boundaries must catch runtime JavaScript errors that occur during client-side hydration and interaction.
  - It exposes a `reset()` callback allowing users to attempt recovery without reloading the entire page.

#### Example:
```tsx
'use client';

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="error-box">
      <h2>Something went wrong!</h2>
      <p>{error.message}</p>
      <button onClick={() => reset()}>Try Again</button>
    </div>
  );
}
```

---

### Q16. How do you fetch data directly in Server Components using async/await without `useEffect`?

#### Answer:
Because Server Components run only on the server, they can be declared as `async` functions. You can use standard `fetch()` or query a database directly at the component level without `useState` or `useEffect`.

#### Example:
```tsx
// app/users/page.tsx
interface User {
  id: number;
  name: string;
}

export default async function UsersPage() {
  const res = await fetch('https://jsonplaceholder.typicode.com/users');
  const users: User[] = await res.json();

  return (
    <ul>
      {users.map((user) => (
        <li key={user.id}>{user.name}</li>
      ))}
    </ul>
  );
}
```

---

### Q17. What is Static Site Generation (SSG) vs Server-Side Rendering (SSR) in Next.js?

#### Answer:
- **Static Site Generation (SSG)**:
  - HTML is rendered **once at build time** (`next build`).
  - Served instantly from a Global CDN cache.
  - Best for marketing pages, blogs, and documentation that change infrequently.
- **Server-Side Rendering (SSR) / Dynamic Rendering**:
  - HTML is generated **on each incoming user request**.
  - Always delivers the freshest data.
  - Best for personalized dashboards, real-time analytics, and shopping carts.

---

### Q18. How does the `next/image` component optimize images and prevent Cumulative Layout Shift (CLS)?

#### Answer:
The native `<Image>` component replaces standard `<img>`:
1. **Size Optimization**: Automatically serves modern formats (**WebP / AVIF**) tailored to the user's viewport width.
2. **Prevents CLS**: Requires explicit `width` and `height` (or `fill={true}`), reserving space in the DOM before image assets finish downloading.
3. **Lazy Loading**: Images are only loaded when they enter the browser viewport.
4. **Resizing at the Edge**: Re-encodes images on-demand.

#### Example:
```tsx
import Image from 'next/image';

export default function Hero() {
  return (
    <Image
      src="/hero-banner.png"
      alt="Promotional Banner"
      width={1200}
      height={600}
      priority={true} // Preloads critical above-the-fold image
    />
  );
}
```

---

### Q19. How do you configure Google Fonts with zero layout shift using `next/font`?

#### Answer:
`next/font` automatically downloads font files at build time and self-hosts them alongside static assets, eliminating external network requests to Google Fonts and calculating the exact fallback font size to eliminate **Layout Shift**.

#### Example:
```tsx
// app/layout.tsx
import { Roboto, Poppins } from 'next/font/google';

const roboto = Roboto({
  weight: ['400', '700'],
  subsets: ['latin'],
  variable: '--font-roboto',
});

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={roboto.variable}>
      <body>{children}</body>
    </html>
  );
}
```

---

### Q20. How do you define Static and Dynamic SEO Metadata using `metadata` and `generateMetadata`?

#### Answer:
- **Static Metadata**: Export a `metadata` object from a `page.tsx` or `layout.tsx`.
- **Dynamic Metadata**: Export an `async function generateMetadata()` to compute metadata dynamically based on route parameters or database queries.

#### Example:
```tsx
// app/products/[id]/page.tsx
import { Metadata } from 'next';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const product = await fetchProduct(id);

  return {
    title: `${product.title} | E-Store`,
    description: product.summary,
    openGraph: {
      images: [product.thumbnailUrl],
    },
  };
}
```

---

### Q21. What are Route Handlers (`app/api/route.ts`) and how do you handle GET and POST HTTP requests?

#### Answer:
Route Handlers replace API routes from Pages Router. Defined inside `route.ts`, they export functions named after HTTP verbs (`GET`, `POST`, `PUT`, `PATCH`, `DELETE`).

#### Example:
```tsx
// app/api/feedback/route.ts
import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({ status: 'ok', data: [] });
}

export async function POST(request: Request) {
  const body = await request.json();
  if (!body.comment) {
    return NextResponse.json({ error: 'Comment required' }, { status: 400 });
  }

  return NextResponse.json({ success: true, saved: body }, { status: 201 });
}
```

---

### Q22. What is the difference between `useSearchParams()` in Client Components and the `searchParams` prop in Page components?

#### Answer:
- **In Server Page (`page.tsx`)**: The component receives `searchParams` as a prop:
  ```tsx
  export default async function Page({ searchParams }: { searchParams: Promise<{ query?: string }> }) {
    const { query } = await searchParams;
    return <div>Search: {query}</div>;
  }
  ```
- **In Client Component**: Use the `useSearchParams()` hook from `next/navigation`. (Note: Reading search params on the client requires wrapping the component in `<Suspense>` to avoid de-opting the entire page into client rendering).

---

### Q23. What is the difference between private environment variables and `NEXT_PUBLIC_` variables?

#### Answer:
- **Private Environment Variables (`API_SECRET_KEY`)**: Only accessible on the Node.js server (Server Components, Route Handlers, Server Actions). Never exposed to the browser.
- **Public Environment Variables (`NEXT_PUBLIC_ANALYTICS_ID`)**: Variables prefixed with `NEXT_PUBLIC_` are inlined into client JavaScript bundles during compilation, making them visible to users inspecting client code.

---

### Q24. What is `template.tsx` and how does it differ from `layout.tsx` regarding component re-mounting?

#### Answer:
- **`layout.tsx`**: Preserves state across route transitions. When navigating from `/dashboard/analytics` to `/dashboard/settings`, the layout does not re-render.
- **`template.tsx`**: Creates a **new instance for each child page navigation**. State is not preserved, DOM elements are re-created, and `useEffect` hooks re-run.
- **Use Cases for `template.tsx`**: Page enter/exit animations (Framer Motion), reset search inputs on route change, page view telemetry logging.

---

### Q25. How do Nested Layouts work and why do layouts preserve component state during navigation?

#### Answer:
Layouts form a hierarchy matching the folder structure:
- Root Layout (`app/layout.tsx`) $\rightarrow$ Dashboard Layout (`app/dashboard/layout.tsx`) $\rightarrow$ Page (`app/dashboard/analytics/page.tsx`).
- React's reconciliation engine recognizes that the layout component instance is identical between sibling page navigations, keeping the existing DOM subtree mounted and preserving state (e.g. form inputs, scroll positions).

---

### Q26. How do you redirect users programmatically using `redirect()` and `permanentRedirect()`?

#### Answer:
Import `redirect()` or `permanentRedirect()` from `next/navigation`.
- `redirect(url)`: Returns a `307 Temporary Redirect` (or 303 for Server Actions).
- `permanentRedirect(url)`: Returns a `308 Permanent Redirect` (cached by search engines).
- Internally, `redirect()` throws a special `NEXT_REDIRECT` error that Next.js catches to handle the redirection.

#### Example:
```tsx
import { redirect } from 'next/navigation';

export default async function ProfilePage() {
  const session = await getSession();
  if (!session) {
    redirect('/login?from=/profile');
  }
  return <h1>Welcome back, {session.name}</h1>;
}
```

---

### Q27. How do you configure Tailwind CSS or CSS Modules in Next.js App Router?

#### Answer:
- **Tailwind CSS**: Installed with `postcss` and `autoprefixer`. Configured in `tailwind.config.js` and imported once in `app/globals.css`.
- **CSS Modules**: Any file named `[name].module.css` is automatically scoped locally, preventing class name collisions across pages.

#### Example:
```tsx
// components/Button.module.css
// .primaryButton { background: blue; }

import styles from './Button.module.css';

export default function Button() {
  return <button className={styles.primaryButton}>Submit</button>;
}
```

---

### Q28. What is the purpose of `next.config.js` and what are common configuration options?

#### Answer:
`next.config.js` is the configuration file for tuning Next.js build and runtime behavior:
- `images.remotePatterns`: Whitelist external image domains for `<Image>`.
- `redirects()` & `rewrites()`: URL redirects and reverse proxies.
- `output: 'standalone'`: Produces a minimal production deployment bundle for Docker containers.

#### Example:
```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'images.unsplash.com' },
    ],
  },
};

module.exports = nextConfig;
```

---

### Q29. How do you serve static assets from the `public/` directory?

#### Answer:
Files placed in the `public/` folder are served at the root URL path (`/`):
- A file at `public/logo.png` is accessed via `<img src="/logo.png" />`.
- A file at `public/robots.txt` is accessed at `https://example.com/robots.txt`.

---

### Q30. What is the exact difference between `next dev`, `next build`, and `next start`?

#### Answer:
- `next dev`: Starts the local development server with Hot Module Replacement (HMR) and fast refresh.
- `next build`: Compiles the application, pre-renders static pages, optimizes images and fonts, and creates the production bundle inside `.next/`.
- `next start`: Starts the optimized **production HTTP server** using the build output from `next build`.

---

### Q31. How do you use the `usePathname()` hook to highlight the active link in a navigation bar?

#### Answer:
`usePathname()` returns the current URL's pathname. Use it inside a Client Component to dynamically compare the link target with the active path.

#### Example:
```tsx
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function NavLinks() {
  const pathname = usePathname();

  const links = [
    { href: '/', label: 'Home' },
    { href: '/dashboard', label: 'Dashboard' },
  ];

  return (
    <nav>
      {links.map((link) => {
        const isActive = pathname === link.href;
        return (
          <Link
            key={link.href}
            href={link.href}
            className={isActive ? 'text-blue-600 font-bold' : 'text-gray-600'}
          >
            {link.label}
          </Link>
        );
      })}
    </nav>
  );
}
```

---

### Q32. What is client-side link prefetching in `<Link>` and how does it make page transitions instantaneous?

#### Answer:
When a `<Link>` component appears in the browser's viewport, Next.js automatically prefetches the route's Server Component payload (RSC data) in the background.
- When the user clicks the link, the data and layout are **already downloaded in memory**, rendering the next page instantly without waiting for network requests.

---

### Q33. How do you add static Favicons, Open Graph images, and Sitemaps in App Router?

#### Answer:
Next.js supports file-based conventions inside the `app/` folder:
- `favicon.ico`: Application favicon.
- `opengraph-image.(png|jpg)`: Social media share preview card.
- `sitemap.xml` or `sitemap.ts`: Dynamic or static XML sitemap for SEO.
- `robots.txt` or `robots.ts`: Search engine crawler directives.

---

### Q34. How do you organize routes without changing the URL path using Route Groups `(folder)`?

#### Answer:
Wrapping a folder name in parentheses (e.g. `(marketing)` or `(shop)`) marks it as a **Route Group**.
- It organizes project files logically without adding a path segment to the public URL.
- Example: `app/(marketing)/about/page.tsx` is accessible at `/about` (NOT `/marketing/about`).
- Useful for assigning completely different Root Layouts to different sections of the app (e.g. `(auth)/layout.tsx` with no navbar, `(dashboard)/layout.tsx` with full sidebar).

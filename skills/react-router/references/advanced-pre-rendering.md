---
name: advanced-pre-rendering
description: Pre-rendering static pages at build time for faster page loads
---

# Pre-Rendering

Pre-rendering generates static HTML files at build time instead of runtime, speeding up page loads for static content.

## Basic Configuration

Enable pre-rendering in `react-router.config.ts`:

```ts filename=react-router.config.ts
import type { Config } from "@react-router/dev/config";

export default {
  prerender: true, // Pre-render all static paths
} satisfies Config;
```

Boolean `true` only pre-renders static paths (excludes dynamic routes like `/blog/:slug`).

## Specific Paths

Specify exact paths to pre-render:

```ts filename=react-router.config.ts
import type { Config } from "@react-router/dev/config";

let slugs = getPostSlugs();

export default {
  prerender: [
    "/",
    "/blog",
    ...slugs.map((s) => `/blog/${s}`),
  ],
} satisfies Config;
```

## Async Function

Use a function for complex logic:

```ts filename=react-router.config.ts
import type { Config } from "@react-router/dev/config";

export default {
  async prerender({ getStaticPaths }) {
    let slugs = await getPostSlugsFromCMS();
    return [
      ...getStaticPaths(), // "/" and "/blog"
      ...slugs.map((s) => `/blog/${s}`),
    ];
  },
} satisfies Config;
```

## Concurrency (Experimental)

Pre-render multiple paths in parallel:

```ts filename=react-router.config.ts
import type { Config } from "@react-router/dev/config";

export default {
  prerender: {
    paths: [
      "/",
      "/blog",
      ...slugs.map((s) => `/blog/${s}`),
    ],
    unstable_concurrency: 4, // Parallel pre-rendering
  },
} satisfies Config;
```

## With Runtime Server (ssr: true)

Pre-render some paths while keeping runtime SSR for others:

```ts filename=react-router.config.ts
import type { Config } from "@react-router/dev/config";

export default {
  ssr: true, // Default
  prerender: ["/", "/blog", "/blog/popular-post"],
} satisfies Config;
```

### Data Loading

Pre-rendered routes use the same `loader` functions:

```tsx
export async function loader({ request, params }) {
  let post = await getPost(params.slug);
  return post;
}

export function Post({ loaderData }) {
  return <div>{loaderData.title}</div>;
}
```

Build creates a `new Request()` and runs it through your app. Non-pre-rendered paths are server-rendered as usual.

### Output Files

Build generates two files per path:

- `[url].html` - HTML for initial document requests
- `[url].data` - Data file for client-side navigation

## Without Runtime Server (ssr: false)

Deploy to static file server:

```ts filename=react-router.config.ts
import type { Config } from "@react-router/dev/config";

export default {
  ssr: false, // Disable runtime SSR
  prerender: true, // Pre-render all static routes
} satisfies Config;
```

**Restrictions:**
- No `action` or `headers` functions (no runtime server)
- `loader` only on pre-rendered routes
- Pre-rendered routes can have loaders

## SPA Fallback

Pre-render some paths, serve SPA for others:

```ts filename=react-router.config.ts
import type { Config } from "@react-router/dev/config";

export default {
  ssr: false,
  prerender: ["/about-us"], // Only pre-render this
  // SPA fallback at build/client/index.html
} satisfies Config;
```

Or if `/` is pre-rendered:

```ts
export default {
  ssr: false,
  prerender: ["/", "/about-us"],
  // SPA fallback at build/client/__spa-fallback.html
} satisfies Config;
```

Configure your host to serve the fallback file for 404s:

```
/*    /index.html   200
// or
/*    /__spa-fallback.html   200
```

## Key Points

- Pre-rendering generates static HTML at build time
- Use `prerender: true` for all static paths
- Specify exact paths with `prerender: [...]`
- Use async function for dynamic path generation
- With `ssr: true`, non-pre-rendered paths still SSR
- With `ssr: false`, no runtime server - static only
- Pre-rendered routes can use `loader` functions
- Output includes `.html` and `.data` files per path

<!--
Source references:
- https://reactrouter.com/how-to/pre-rendering
-->

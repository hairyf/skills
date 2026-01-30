---
name: essentials-history-mode
description: HTML5 history mode, hash mode, memory mode, and server configuration for SPA routing
---

# History Modes

Choose how Vue Router maps routes to browser URLs.

## HTML5 Mode (Recommended)

Uses `createWebHistory()` for clean URLs:

```js
import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(),
  routes: [...],
})
```

URLs look normal: `https://example.com/user/id`

**Server Configuration Required**: All routes must serve `index.html`:

### nginx
```nginx
location / {
  try_files $uri $uri/ /index.html;
}
```

### Apache
```apache
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /
  RewriteRule ^index\.html$ - [L]
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteRule . /index.html [L]
</IfModule>
```

### Netlify
Create `_redirects` file:
```
/* /index.html 200
```

### Vercel
Create `vercel.json`:
```json
{
  "rewrites": [{ "source": "/:path*", "destination": "/index.html" }]
}
```

## Hash Mode

Uses `createWebHashHistory()` with hash character:

```js
import { createRouter, createWebHashHistory } from 'vue-router'

const router = createRouter({
  history: createWebHashHistory(),
  routes: [...],
})
```

URLs look like: `https://example.com/#/user/id`

**No server configuration needed** - hash section never sent to server. **Bad for SEO**.

## Memory Mode

Uses `createMemoryHistory()` - no browser URL interaction:

```js
import { createRouter, createMemoryHistory } from 'vue-router'

const router = createRouter({
  history: createMemoryHistory(),
  routes: [...],
})
```

Perfect for Node/SSR environments. **Requires manual initial navigation**:

```js
app.use(router)
await router.push('/initial-route')
app.mount('#app')
```

## 404 Handling

With HTML5 mode, server serves `index.html` for all routes. Implement catch-all route:

```js
const routes = [
  { path: '/:pathMatch(.*)*', component: NotFoundComponent },
]
```

## Key Points

- HTML5 mode (`createWebHistory`) - clean URLs, requires server config
- Hash mode (`createWebHashHistory`) - no server config, bad SEO
- Memory mode (`createMemoryHistory`) - no URL, good for SSR
- Always implement 404 catch-all route for HTML5 mode

<!--
Source references:
- https://router.vuejs.org/guide/essentials/history-mode.html
-->

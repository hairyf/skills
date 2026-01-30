---
name: essentials-route-matching-syntax
description: Advanced route matching patterns including custom regex, repeatable params, optional params, strict and sensitive options
---

# Route Matching Syntax

Advanced patterns for matching routes beyond basic dynamic segments.

## Custom Regex in Params

Specify custom regex for params to differentiate routes:

```js
const routes = [
  { path: '/:orderId(\\d+)', component: Order },      // Only numbers
  { path: '/:productName', component: Product },       // Anything else
]
```

Going to `/25` matches `/:orderId`, anything else matches `/:productName`.

**Important**: Escape backslashes (`\\d` not `\d`) and closing parentheses in regex.

## Repeatable Params

Match multiple path segments with `*` (0+) or `+` (1+):

```js
const routes = [
  { path: '/:chapters+', component: Chapters },  // /one, /one/two, /one/two/three
  { path: '/:chapters*', component: Chapters }, // /, /one, /one/two, etc.
]
```

Params become arrays:

```js
// Given { path: '/:chapters*', name: 'chapters' }
router.resolve({ name: 'chapters', params: { chapters: ['a', 'b'] } }).href
// Produces /a/b
```

Combine with custom regex:

```js
{ path: '/:chapters(\\d+)+', component: Chapters }  // Only numbers, 1+
{ path: '/:chapters(\\d+)*', component: Chapters }  // Only numbers, 0+
```

## Optional Parameters

Mark params as optional with `?` (0 or 1):

```js
const routes = [
  { path: '/users/:userId?', component: Users },        // /users or /users/42
  { path: '/users/:userId(\\d+)?', component: Users }, // /users or /users/42
]
```

**Note**: `?` params cannot be repeated (unlike `*`).

## Strict and Sensitive Options

Control case sensitivity and trailing slash matching:

```js
const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/users/:id', sensitive: true },  // Case sensitive
  ],
  strict: true, // Trailing slash must match exactly
})
```

- `sensitive: true` - case sensitive matching
- `strict: true` - trailing slash must match exactly

## Avoiding Slow Regex

Avoid greedy `.*` with repeatable modifiers:

```js
// ❌ Slow - greedy .* with * modifier
{ path: '/:pathMatch(.*)*/something-at-the-end' }

// ✅ Fast - .* at the end
{ path: '/:pathMatch(.*)/something-at-the-end' }

// ✅ Fast - not repeatable
{ path: '/:pathMatch(.*)/something-at-the-end' }
```

## Key Points

- Custom regex: `/:param(regex)` to constrain param values
- Repeatable: `+` (1+) or `*` (0+) makes params arrays
- Optional: `?` (0 or 1) for optional params
- Escape backslashes and closing parens in regex
- Avoid greedy `.*` with repeatable modifiers for performance

<!--
Source references:
- https://router.vuejs.org/guide/essentials/route-matching-syntax.html
-->

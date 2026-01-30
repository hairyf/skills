---
name: Fragment
description: React component for grouping elements without wrapper nodes
---

# Fragment

`<Fragment>` (or `<>...</>`) lets you group multiple elements without adding an extra DOM node. Useful when you need to return multiple elements from a component.

## Usage

```js
import { Fragment } from 'react';

function Post() {
  return (
    <Fragment>
      <PostTitle />
      <PostBody />
    </Fragment>
  );
}

// Or use shorthand syntax
function Post() {
  return (
    <>
      <PostTitle />
      <PostBody />
    </>
  );
}
```

### Basic structure

```js
<Fragment key={key}>
  {children}
</Fragment>

// Shorthand
<>
  {children}
</>
```

## Key Points

- **No DOM node**: Fragments don't create wrapper elements
- **Key prop**: Use `<Fragment>` syntax when you need keys
- **Grouping**: Useful for returning multiple elements
- **Refs**: Can accept refs (React 19+)

## Common Patterns

### Returning multiple elements

```js
function Component() {
  return (
    <>
      <Header />
      <Main />
      <Footer />
    </>
  );
}
```

### Fragments with keys

```js
function List({ items }) {
  return items.map(item => (
    <Fragment key={item.id}>
      <ItemTitle item={item} />
      <ItemDescription item={item} />
    </Fragment>
  ));
}
```

### Conditional rendering

```js
function Component({ show }) {
  return (
    <>
      {show && <Modal />}
      <Content />
    </>
  );
}
```

### Avoiding wrapper divs

```js
// ❌ Bad: Adds unnecessary div
function Component() {
  return (
    <div>
      <Child1 />
      <Child2 />
    </div>
  );
}

// ✅ Good: No wrapper element
function Component() {
  return (
    <>
      <Child1 />
      <Child2 />
    </>
  );
}
```

## When to use Fragment

Use Fragment when:
- Returning multiple elements from a component
- Grouping elements in lists without wrappers
- Avoiding unnecessary DOM nodes

Don't use Fragment when:
- You need a wrapper element for styling
- You need to attach event handlers to a container
- A single element is sufficient

## FragmentInstance (React 19+)

When using refs with fragments, React provides a `FragmentInstance` with methods for:
- Event handling: `addEventListener`, `removeEventListener`, `dispatchEvent`
- Layout: `getClientRects`, `getRootNode`, `compareDocumentPosition`
- Focus: `focus`, `focusLast`, `blur`
- Observers: `observeUsing`, `unobserveUsing`

<!--
Source references:
- https://react.dev/reference/react/Fragment
-->

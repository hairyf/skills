---
name: Rules of Hooks
description: Fundamental rules for using React Hooks correctly
---

# Rules of Hooks

Hooks must follow specific rules to work correctly. Breaking these rules leads to bugs and unpredictable behavior.

## Rule 1: Only call Hooks at the top level

**Don't call Hooks inside loops, conditions, nested functions, or try/catch blocks.**

### ✅ Correct usage

```js
function Component() {
  // ✅ Good: top-level in function component
  const [count, setCount] = useState(0);
  const theme = useContext(ThemeContext);
  
  // ✅ Good: conditional logic after hooks
  if (count > 10) {
    return <div>Too many</div>;
  }
  
  return <div>{count}</div>;
}

function useCustomHook() {
  // ✅ Good: top-level in custom hook
  const [value, setValue] = useState(null);
  return value;
}
```

### ❌ Incorrect usage

```js
// ❌ Bad: inside condition
function Bad({ cond }) {
  if (cond) {
    const [count, setCount] = useState(0);
  }
}

// ❌ Bad: inside loop
function Bad() {
  for (let i = 0; i < 10; i++) {
    const [count, setCount] = useState(0);
  }
}

// ❌ Bad: after conditional return
function Bad({ cond }) {
  if (cond) {
    return null;
  }
  const [count, setCount] = useState(0);
}

// ❌ Bad: inside event handler
function Bad() {
  function handleClick() {
    const [count, setCount] = useState(0);
  }
}

// ❌ Bad: inside try/catch
function Bad() {
  try {
    const [count, setCount] = useState(0);
  } catch {
    const [count, setCount] = useState(1);
  }
}
```

## Rule 2: Only call Hooks from React functions

**Only call Hooks from React function components or custom Hooks.**

### ✅ Correct usage

```js
// ✅ Good: React function component
function Component() {
  const value = useCustomHook();
}

// ✅ Good: custom Hook
function useCustomHook() {
  const [value, setValue] = useState(0);
  return value;
}
```

### ❌ Incorrect usage

```js
// ❌ Bad: regular JavaScript function
function regularFunction() {
  const [value, setValue] = useState(0);
}

// ❌ Bad: class component
class Bad extends React.Component {
  render() {
    const [value, setValue] = useState(0); // ❌
  }
}
```

## Why these rules exist

React relies on the **order** of Hook calls to track state between renders. If Hooks are called conditionally or in loops, the order changes between renders, causing bugs.

## ESLint plugin

Use `eslint-plugin-react-hooks` to catch violations:

```json
{
  "plugins": ["react-hooks"],
  "rules": {
    "react-hooks/rules-of-hooks": "error",
    "react-hooks/exhaustive-deps": "warn"
  }
}
```

## Common mistakes and fixes

### Conditional hook call

```js
// ❌ Bad
function Component({ show }) {
  if (show) {
    const [value, setValue] = useState(0);
  }
}

// ✅ Good: call hook unconditionally
function Component({ show }) {
  const [value, setValue] = useState(0);
  if (!show) return null;
  // use value...
}
```

### Hook in callback

```js
// ❌ Bad
function Component() {
  const handleClick = () => {
    const [value, setValue] = useState(0);
  };
}

// ✅ Good: move hook to top level
function Component() {
  const [value, setValue] = useState(0);
  const handleClick = () => {
    setValue(v => v + 1);
  };
}
```

<!--
Source references:
- https://react.dev/reference/rules/rules-of-hooks
-->

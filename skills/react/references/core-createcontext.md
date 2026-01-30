---
name: createContext
description: React API for creating context objects
---

# createContext

`createContext` lets you create a context that components can provide or read. It's used with `useContext` to avoid prop drilling.

## Usage

```js
import { createContext, useContext } from 'react';

const ThemeContext = createContext('light');

function Button() {
  const theme = useContext(ThemeContext);
  return <button className={theme}>Click</button>;
}

function App() {
  return (
    <ThemeContext value="dark">
      <Button />
    </ThemeContext>
  );
}
```

### Basic structure

```js
const SomeContext = createContext(defaultValue);
```

- `defaultValue`: Value used when no Provider exists above component
- Returns: Context object with `Provider` and `Consumer` properties

## Key Points

- **Default value**: Used when no Provider exists (static, never changes)
- **Context object**: Doesn't hold information, represents which context to read
- **React 19**: Can use `<SomeContext>` directly as Provider
- **Legacy**: Use `<SomeContext.Provider>` in older React versions

## Common Patterns

### Creating context

```js
const ThemeContext = createContext(null);
const UserContext = createContext(null);
const LocaleContext = createContext('en');
```

### Providing context (React 19+)

```js
function App() {
  const [theme, setTheme] = useState('dark');
  
  return (
    <ThemeContext value={theme}>
      <Page />
    </ThemeContext>
  );
}
```

### Providing context (Legacy)

```js
function App() {
  const [theme, setTheme] = useState('dark');
  
  return (
    <ThemeContext.Provider value={theme}>
      <Page />
    </ThemeContext.Provider>
  );
}
```

### Custom Provider component

```js
const ThemeContext = createContext(null);

function ThemeProvider({ children }) {
  const [theme, setTheme] = useState('light');
  
  return (
    <ThemeContext value={{ theme, setTheme }}>
      {children}
    </ThemeContext>
  );
}

function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
}
```

### Multiple contexts

```js
function App() {
  return (
    <ThemeContext value="dark">
      <UserContext value={user}>
        <LocaleContext value="en">
          <Page />
        </LocaleContext>
      </UserContext>
    </ThemeContext>
  );
}
```

## Best Practices

- **Split contexts**: Separate contexts for unrelated values to avoid unnecessary re-renders
- **Default value**: Use `null` if no meaningful default exists
- **Custom hooks**: Create custom hooks for context access with error handling
- **TypeScript**: Use TypeScript for type-safe context values

<!--
Source references:
- https://react.dev/reference/react/createContext
-->

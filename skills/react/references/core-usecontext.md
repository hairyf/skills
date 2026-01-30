---
name: useContext
description: React Hook for reading and subscribing to context
---

# useContext

`useContext` is a React Hook that lets you read and subscribe to context from your component. It's used with `createContext` to avoid prop drilling.

## Usage

```js
import { useContext, createContext } from 'react';

const ThemeContext = createContext('light');

function Button() {
  const theme = useContext(ThemeContext);
  return <button className={theme}>Click me</button>;
}

function App() {
  return (
    <ThemeContext.Provider value="dark">
      <Button />
    </ThemeContext.Provider>
  );
}
```

### Creating context

```js
import { createContext } from 'react';

const ThemeContext = createContext('light'); // default value
```

### Providing context

Wrap components with the Provider:

```js
<ThemeContext.Provider value="dark">
  <ChildComponent />
</ThemeContext.Provider>
```

### Reading context

```js
function Component() {
  const theme = useContext(ThemeContext);
  // theme is 'dark' if Provider exists, otherwise 'light'
}
```

## Key Points

- `useContext` looks for the **closest Provider above** the component
- If no Provider exists, returns the `defaultValue` from `createContext`
- Context value is **always up-to-date** - React re-renders consumers when context changes
- `useContext` call is **not affected** by Providers returned from the same component
- Context comparison uses `Object.is` - changing object reference triggers re-render

## Common Patterns

### Theme context

```js
const ThemeContext = createContext(null);

function ThemeProvider({ children }) {
  const [theme, setTheme] = useState('light');
  
  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
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

### User context

```js
const UserContext = createContext(null);

function UserProvider({ children }) {
  const [user, setUser] = useState(null);
  
  useEffect(() => {
    fetchUser().then(setUser);
  }, []);
  
  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
}
```

### Multiple contexts

```js
function Component() {
  const theme = useContext(ThemeContext);
  const user = useContext(UserContext);
  const locale = useContext(LocaleContext);
  // ...
}
```

### Custom hook wrapper

```js
function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
```

## Performance Considerations

- Context changes trigger re-renders of **all consumers**
- Use `memo` to prevent unnecessary re-renders, but context still updates
- Split contexts to avoid unnecessary re-renders:

```js
// ❌ Bad: theme change re-renders user consumers
const AppContext = createContext({ theme, user });

// ✅ Good: separate contexts
const ThemeContext = createContext(null);
const UserContext = createContext(null);
```

<!--
Source references:
- https://react.dev/reference/react/useContext
- https://react.dev/reference/react/createContext
-->

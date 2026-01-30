---
name: useActionState
description: React Hook for managing form action state
---

# useActionState

`useActionState` is a Hook that allows you to update state based on the result of a form action. Useful for form handling with server actions.

## Usage

```js
import { useActionState } from 'react';

async function increment(previousState, formData) {
  return previousState + 1;
}

function StatefulForm() {
  const [state, formAction, isPending] = useActionState(increment, 0);
  
  return (
    <form>
      <p>Count: {state}</p>
      <button formAction={formAction}>Increment</button>
      {isPending && <span>Submitting...</span>}
    </form>
  );
}
```

### Basic structure

```js
const [state, formAction, isPending] = useActionState(action, initialState, permalink?);
```

- `action`: Function called when form is submitted
- `initialState`: Initial state value
- `permalink`: Optional URL for progressive enhancement
- Returns: `[state, formAction, isPending]`

## Key Points

- **Form actions**: Designed for form submission handling
- **Server functions**: Works with React Server Components
- **Progressive enhancement**: Supports forms before JavaScript loads
- **Pending state**: Provides `isPending` flag for loading states

## Common Patterns

### Basic form action

```js
async function submitForm(previousState, formData) {
  const name = formData.get('name');
  // Process form...
  return { success: true, message: 'Form submitted' };
}

function MyForm() {
  const [state, formAction] = useActionState(submitForm, null);
  
  return (
    <form action={formAction}>
      <input name="name" />
      <button type="submit">Submit</button>
      {state?.message && <p>{state.message}</p>}
    </form>
  );
}
```

### With error handling

```js
async function createUser(prevState, formData) {
  try {
    const user = await createUserAPI(formData);
    return { success: true, user };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

function SignupForm() {
  const [state, formAction, isPending] = useActionState(createUser, null);
  
  return (
    <form action={formAction}>
      <input name="email" />
      <button disabled={isPending}>
        {isPending ? 'Creating...' : 'Sign Up'}
      </button>
      {state?.error && <p className="error">{state.error}</p>}
    </form>
  );
}
```

### With permalink

```js
function FeedForm() {
  const [state, formAction] = useActionState(
    addPost,
    null,
    '/feed' // Permalink for progressive enhancement
  );
  
  return <form action={formAction}>{/* ... */}</form>;
}
```

## Differences from useState

- **Action-based**: Updates based on form action results
- **Server integration**: Works seamlessly with Server Components
- **Progressive enhancement**: Forms work without JavaScript
- **Pending state**: Built-in `isPending` flag

## Best Practices

- **Error handling**: Always handle errors in action functions
- **Serializable state**: State must be serializable for SSR
- **Loading states**: Use `isPending` for better UX
- **Type safety**: Use TypeScript for action signatures

<!--
Source references:
- https://react.dev/reference/react/useActionState
-->

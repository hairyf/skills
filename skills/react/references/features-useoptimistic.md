---
name: useOptimistic
description: React Hook for optimistic UI updates
---

# useOptimistic

`useOptimistic` is a React Hook that lets you optimistically update the UI. Show temporary state while an action is in progress, then update with the actual result.

## Usage

```js
import { useOptimistic, useTransition } from 'react';

function LikeButton({ post }) {
  const [isPending, startTransition] = useTransition();
  const [optimisticLike, setOptimisticLike] = useOptimistic(post.liked);
  
  function handleClick() {
    startTransition(async () => {
      setOptimisticLike(!optimisticLike);
      await toggleLike(post.id);
    });
  }
  
  return (
    <button onClick={handleClick} disabled={isPending}>
      {optimisticLike ? '❤️' : '🤍'}
    </button>
  );
}
```

### Basic structure

```js
const [optimisticState, setOptimistic] = useOptimistic(value, reducer?);
```

- `value`: Actual value when no action is pending
- `reducer`: Optional reducer function for complex updates
- Returns: `[optimisticState, setOptimistic]`

## Key Points

- **Optimistic updates**: Show expected result immediately
- **Must be in Action**: Setter must be called inside `startTransition`
- **Automatic revert**: Reverts to actual value when action completes
- **Better UX**: Provides instant feedback to users

## Common Patterns

### Simple optimistic update

```js
function LikeButton({ post }) {
  const [isPending, startTransition] = useTransition();
  const [optimisticLiked, setOptimisticLiked] = useOptimistic(post.liked);
  
  function handleClick() {
    startTransition(async () => {
      setOptimisticLiked(!optimisticLiked);
      await toggleLike(post.id);
    });
  }
  
  return <button onClick={handleClick}>{optimisticLiked ? '❤️' : '🤍'}</button>;
}
```

### With reducer

```js
function todoReducer(state, action) {
  switch (action.type) {
    case 'add':
      return [...state, action.todo];
    case 'delete':
      return state.filter(t => t.id !== action.id);
    default:
      return state;
  }
}

function TodoList({ todos }) {
  const [isPending, startTransition] = useTransition();
  const [optimisticTodos, setOptimisticTodos] = useOptimistic(todos, todoReducer);
  
  function handleAdd(text) {
    startTransition(async () => {
      const newTodo = { id: Date.now(), text };
      setOptimisticTodos({ type: 'add', todo: newTodo });
      await addTodoAPI(newTodo);
    });
  }
  
  return (
    <div>
      {optimisticTodos.map(todo => (
        <Todo key={todo.id} todo={todo} />
      ))}
    </div>
  );
}
```

### Updating counter

```js
function LikeCounter({ likes }) {
  const [isPending, startTransition] = useTransition();
  const [optimisticLikes, setOptimisticLikes] = useOptimistic(likes);
  
  function handleLike() {
    startTransition(async () => {
      setOptimisticLikes(likes => likes + 1);
      await incrementLikes();
    });
  }
  
  return (
    <button onClick={handleLike}>
      {optimisticLikes} likes
    </button>
  );
}
```

## When to use useOptimistic

Use `useOptimistic` when:
- Actions have predictable outcomes
- You want instant UI feedback
- Network latency affects UX
- Actions are likely to succeed

Don't use `useOptimistic` when:
- Actions frequently fail
- Reverting changes is confusing
- State updates are complex

## Best Practices

- **Use with startTransition**: Always wrap in `startTransition`
- **Handle errors**: Update actual state even if action fails
- **Clear feedback**: Make optimistic state visually distinct if needed
- **Test failures**: Ensure UI handles action failures gracefully

<!--
Source references:
- https://react.dev/reference/react/useOptimistic
-->

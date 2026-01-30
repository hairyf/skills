---
name: features-keys
description: Flutter keys - ValueKey, ObjectKey, GlobalKey, UniqueKey, and when to use keys
---

# Keys

Keys help Flutter identify which widgets correspond to which state objects.

## When to Use Keys

Use keys when widgets are moved around in the tree or when you need to preserve state.

```dart
// Without key - state is lost when list order changes
ListView(
  children: items.map((item) => StatefulWidget()).toList(),
)

// With key - state is preserved
ListView(
  children: items.map((item) => 
    StatefulWidget(key: ValueKey(item.id))
  ).toList(),
)
```

## ValueKey

Use when widget identity is based on a value.

```dart
ListView(
  children: items.map((item) => 
    ListTile(
      key: ValueKey(item.id),
      title: Text(item.name),
    )
  ).toList(),
)
```

## ObjectKey

Use when widget identity is based on object identity.

```dart
ListView(
  children: items.map((item) => 
    ListTile(
      key: ObjectKey(item),
      title: Text(item.name),
    )
  ).toList(),
)
```

## UniqueKey

Generate a unique key each time (use sparingly).

```dart
// Creates new key on every build - not recommended
Widget build(BuildContext context) {
  return Widget(key: UniqueKey());
}

// Better - create once in initState
@override
void initState() {
  super.initState();
  _key = UniqueKey();
}
```

## GlobalKey

Uniquely identify widgets across the entire app.

```dart
final _formKey = GlobalKey<FormState>();

Form(
  key: _formKey,
  child: TextFormField(),
)

// Access form state from anywhere
_formKey.currentState?.validate();
```

## GlobalKey for State Access

```dart
final _counterKey = GlobalKey<_CounterWidgetState>();

CounterWidget(key: _counterKey)

// Access state
_counterKey.currentState?.increment();
```

## Key in AnimatedSwitcher

Use keys to force widget recreation.

```dart
AnimatedSwitcher(
  duration: Duration(milliseconds: 300),
  child: Text(
    '$_counter',
    key: ValueKey(_counter), // Force recreation on change
  ),
)
```

## Key Best Practices

```dart
// ✅ Good - use ValueKey for list items
ListView.builder(
  itemBuilder: (context, index) => ListTile(
    key: ValueKey(items[index].id),
    title: Text(items[index].name),
  ),
)

// ✅ Good - use GlobalKey for form access
final _formKey = GlobalKey<FormState>();

// ❌ Bad - creating UniqueKey on every build
Widget build(BuildContext context) {
  return Widget(key: UniqueKey());
}

// ✅ Good - create key once
final _key = UniqueKey();
```

## Key Points

- Use `ValueKey` for list items with stable IDs
- Use `ObjectKey` when identity is based on object reference
- Use `UniqueKey` sparingly, create once in initState
- Use `GlobalKey` to access state from outside
- Keys help preserve state when widgets move
- Keys help Flutter identify widgets efficiently
- Don't create keys unnecessarily
- Use keys in lists, AnimatedSwitcher, and when accessing state

<!--
Source references:
- https://github.com/flutter/flutter/tree/main/packages/flutter/lib/src/widgets/framework.dart
- https://docs.flutter.dev/development/ui/widgets-intro#keys
-->

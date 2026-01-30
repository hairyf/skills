---
name: core-widgets
description: Flutter widget system fundamentals - StatelessWidget, StatefulWidget, widget lifecycle, and keys
---

# Widget System

Flutter uses a widget-based architecture where everything is a widget. Widgets are immutable descriptions of part of a user interface. The framework builds a tree of widgets and efficiently updates the UI when widgets change.

## Widget Types

### StatelessWidget

A widget that does not require mutable state. Use when the widget's configuration is fully determined by its parent.

```dart
class MyWidget extends StatelessWidget {
  const MyWidget({super.key, required this.title});

  final String title;

  @override
  Widget build(BuildContext context) {
    return Text(title);
  }
}
```

### StatefulWidget

A widget that has mutable state. Use when the widget needs to change over time based on user interaction or other factors.

```dart
class CounterWidget extends StatefulWidget {
  const CounterWidget({super.key});

  @override
  State<CounterWidget> createState() => _CounterWidgetState();
}

class _CounterWidgetState extends State<CounterWidget> {
  int _counter = 0;

  void _incrementCounter() {
    setState(() {
      _counter++;
    });
  }

  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        Text('Count: $_counter'),
        ElevatedButton(
          onPressed: _incrementCounter,
          child: const Text('Increment'),
        ),
      ],
    );
  }
}
```

## Widget Lifecycle

### StatelessWidget Lifecycle

1. Constructor - Widget is created
2. `build()` - Widget builds its subtree

### StatefulWidget Lifecycle

1. Constructor - Widget is created
2. `createState()` - State object is created
3. `initState()` - State is initialized (called once)
4. `didChangeDependencies()` - Called when dependencies change
5. `build()` - Widget builds its subtree
6. `setState()` - Triggers rebuild when state changes
7. `didUpdateWidget()` - Called when widget configuration changes
8. `deactivate()` - Called when widget is removed from tree
9. `dispose()` - Called when widget is permanently removed

```dart
class _MyWidgetState extends State<MyWidget> {
  @override
  void initState() {
    super.initState();
    // Initialize state, subscribe to streams, etc.
  }

  @override
  void didChangeDependencies() {
    super.didChangeDependencies();
    // Called when InheritedWidgets change
  }

  @override
  void didUpdateWidget(MyWidget oldWidget) {
    super.didUpdateWidget(oldWidget);
    // Called when widget configuration changes
  }

  @override
  void dispose() {
    // Clean up resources, cancel subscriptions
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Container();
  }
}
```

## Keys

Keys help Flutter identify which widgets in the tree correspond to which state objects. Use keys when widgets are moved around in the tree or when you need to preserve state.

### Key Types

- **ValueKey** - Uses a value to identify the widget
- **ObjectKey** - Uses an object's identity
- **UniqueKey** - Generates a unique key each time
- **GlobalKey** - Uniquely identifies widgets across the entire app

```dart
// ValueKey - use when widget identity is based on a value
ListView(
  children: items.map((item) => 
    ListTile(
      key: ValueKey(item.id),
      title: Text(item.name),
    )
  ).toList(),
)

// GlobalKey - use when you need to access state from outside
final _formKey = GlobalKey<FormState>();

Form(
  key: _formKey,
  child: TextFormField(),
)

// Access form state
_formKey.currentState?.validate();
```

## Key Points

- Widgets are immutable - they describe what the UI should look like
- State objects hold mutable state for StatefulWidgets
- `setState()` triggers a rebuild of the widget subtree
- Use `const` constructors when possible for performance
- Keys help Flutter preserve state when widgets move in the tree
- Always call `super.initState()`, `super.dispose()`, etc. in lifecycle methods

<!--
Source references:
- https://github.com/flutter/flutter/tree/main/packages/flutter/lib/src/widgets/framework.dart
- https://docs.flutter.dev/development/ui/widgets-intro
-->

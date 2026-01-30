---
name: best-practices-state
description: Flutter state management best practices - when to use setState, state lifting, and state management patterns
---

# State Management Best Practices

Guidelines for managing state effectively in Flutter applications.

## When to Use setState

Use `setState()` for local widget state.

```dart
// ✅ Good - local UI state
class CounterWidget extends StatefulWidget {
  @override
  State<CounterWidget> createState() => _CounterWidgetState();
}

class _CounterWidgetState extends State<CounterWidget> {
  int _counter = 0;

  void _increment() {
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
          onPressed: _increment,
          child: const Text('Increment'),
        ),
      ],
    );
  }
}
```

## State Lifting

Lift state to nearest common ancestor.

```dart
// ✅ Good - state lifted to parent
class ParentWidget extends StatefulWidget {
  @override
  State<ParentWidget> createState() => _ParentWidgetState();
}

class _ParentWidgetState extends State<ParentWidget> {
  int _counter = 0;

  void _increment() {
    setState(() {
      _counter++;
    });
  }

  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        DisplayWidget(counter: _counter),
        ControlWidget(onIncrement: _increment),
      ],
    );
  }
}
```

## ValueNotifier for Simple State

Use `ValueNotifier` for simple observable values.

```dart
// ✅ Good - simple observable state
class CounterModel {
  final ValueNotifier<int> count = ValueNotifier<int>(0);

  void increment() {
    count.value++;
  }

  void dispose() {
    count.dispose();
  }
}
```

## ChangeNotifier for Complex State

Use `ChangeNotifier` for complex state with multiple properties.

```dart
// ✅ Good - complex state
class UserModel extends ChangeNotifier {
  String _name = '';
  String _email = '';

  String get name => _name;
  String get email => _email;

  void updateName(String name) {
    _name = name;
    notifyListeners();
  }

  void updateEmail(String email) {
    _email = email;
    notifyListeners();
  }
}
```

## Avoid Unnecessary Rebuilds

Split widgets to minimize rebuilds.

```dart
// ❌ Bad - entire widget rebuilds
class BadWidget extends StatefulWidget {
  @override
  State<BadWidget> createState() => _BadWidgetState();
}

class _BadWidgetState extends State<BadWidget> {
  int _counter = 0;

  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        ExpensiveWidget(), // Rebuilds unnecessarily
        Text('Count: $_counter'),
        ElevatedButton(
          onPressed: () => setState(() => _counter++),
          child: const Text('Increment'),
        ),
      ],
    );
  }
}

// ✅ Good - split widgets
class GoodWidget extends StatefulWidget {
  @override
  State<GoodWidget> createState() => _GoodWidgetState();
}

class _GoodWidgetState extends State<GoodWidget> {
  int _counter = 0;

  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        const ExpensiveWidget(), // const prevents rebuild
        CounterDisplay(counter: _counter),
        ElevatedButton(
          onPressed: () => setState(() => _counter++),
          child: const Text('Increment'),
        ),
      ],
    );
  }
}
```

## State Management Patterns

### Provider Pattern

```dart
// Use Provider package for app-wide state
ChangeNotifierProvider(
  create: (_) => CounterModel(),
  child: MyApp(),
)
```

### BLoC Pattern

```dart
// Use BLoC pattern for complex state logic
class CounterBloc {
  final _counterController = StreamController<int>.broadcast();
  Stream<int> get counter => _counterController.stream;
  
  int _count = 0;
  
  void increment() {
    _count++;
    _counterController.add(_count);
  }
  
  void dispose() {
    _counterController.close();
  }
}
```

## Key Points

- Use `setState()` for local widget state only
- Lift state to nearest common ancestor
- Use `ValueNotifier` for simple observable values
- Use `ChangeNotifier` for complex state
- Split widgets to minimize rebuilds
- Use `const` constructors when possible
- Consider state management packages for app-wide state
- Always dispose state management objects
- Avoid storing state in global variables
- Use appropriate pattern based on complexity

<!--
Source references:
- https://docs.flutter.dev/development/data-and-backend/state-mgmt
- https://docs.flutter.dev/development/data-and-backend/state-mgmt/simple
-->

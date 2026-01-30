---
name: core-state-management
description: Flutter state management patterns - setState, StatefulWidget, ValueNotifier, ChangeNotifier, and state lifting
---

# State Management

Flutter provides several mechanisms for managing state in applications. Choose the appropriate pattern based on your needs.

## setState (Local State)

Use `setState()` for local state within a StatefulWidget. This is the simplest form of state management.

```dart
class CounterWidget extends StatefulWidget {
  const CounterWidget({super.key});

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

## ValueNotifier

Use `ValueNotifier` for simple value changes that need to be observed by multiple widgets.

```dart
class CounterModel {
  final ValueNotifier<int> count = ValueNotifier<int>(0);

  void increment() {
    count.value++;
  }

  void dispose() {
    count.dispose();
  }
}

// Usage
class CounterWidget extends StatelessWidget {
  final CounterModel model;

  const CounterWidget({super.key, required this.model});

  @override
  Widget build(BuildContext context) {
    return ValueListenableBuilder<int>(
      valueListenable: model.count,
      builder: (context, count, child) {
        return Text('Count: $count');
      },
    );
  }
}
```

## ChangeNotifier

Use `ChangeNotifier` for more complex state that needs to notify multiple listeners.

```dart
class CounterModel extends ChangeNotifier {
  int _count = 0;
  int get count => _count;

  void increment() {
    _count++;
    notifyListeners();
  }
}

// Usage with AnimatedBuilder or ListenableBuilder
class CounterWidget extends StatelessWidget {
  final CounterModel model;

  const CounterWidget({super.key, required this.model});

  @override
  Widget build(BuildContext context) {
    return ListenableBuilder(
      listenable: model,
      builder: (context, child) {
        return Text('Count: ${model.count}');
      },
    );
  }
}
```

## State Lifting

Lift state up to the nearest common ancestor when multiple widgets need to share state.

```dart
class ParentWidget extends StatefulWidget {
  const ParentWidget({super.key});

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

class DisplayWidget extends StatelessWidget {
  final int counter;

  const DisplayWidget({super.key, required this.counter});

  @override
  Widget build(BuildContext context) {
    return Text('Count: $counter');
  }
}

class ControlWidget extends StatelessWidget {
  final VoidCallback onIncrement;

  const ControlWidget({super.key, required this.onIncrement});

  @override
  Widget build(BuildContext context) {
    return ElevatedButton(
      onPressed: onIncrement,
      child: const Text('Increment'),
    );
  }
}
```

## InheritedWidget

Use `InheritedWidget` to provide state to descendant widgets without passing it explicitly.

```dart
class CounterInherited extends InheritedWidget {
  final int count;
  final VoidCallback increment;

  const CounterInherited({
    super.key,
    required this.count,
    required this.increment,
    required super.child,
  });

  static CounterInherited? of(BuildContext context) {
    return context.dependOnInheritedWidgetOfExactType<CounterInherited>();
  }

  @override
  bool updateShouldNotify(CounterInherited oldWidget) {
    return count != oldWidget.count;
  }
}

// Usage
class CounterDisplay extends StatelessWidget {
  const CounterDisplay({super.key});

  @override
  Widget build(BuildContext context) {
    final counter = CounterInherited.of(context);
    return Text('Count: ${counter?.count ?? 0}');
  }
}
```

## Key Points

- Use `setState()` for local state within a single widget
- Use `ValueNotifier` for simple observable values
- Use `ChangeNotifier` for complex state with multiple properties
- Lift state up to share it between widgets
- Use `InheritedWidget` to provide state to widget subtrees
- Always dispose `ValueNotifier` and `ChangeNotifier` to prevent memory leaks
- Consider using state management packages (Provider, Riverpod, Bloc) for larger apps

<!--
Source references:
- https://github.com/flutter/flutter/tree/main/packages/flutter/lib/src/widgets/framework.dart
- https://docs.flutter.dev/development/ui/interactive
-->

---
name: widgets-value-listenable
description: Flutter ValueListenableBuilder - building widgets based on ValueListenable changes
---

# ValueListenableBuilder

`ValueListenableBuilder` rebuilds widgets when a `ValueListenable` value changes.

## Basic Usage

```dart
final counter = ValueNotifier<int>(0);

ValueListenableBuilder<int>(
  valueListenable: counter,
  builder: (context, value, child) {
    return Text('Count: $value');
  },
)

// Update value
counter.value++;
```

## With ValueNotifier

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
final model = CounterModel();

ValueListenableBuilder<int>(
  valueListenable: model.count,
  builder: (context, count, child) {
    return Column(
      children: [
        Text('Count: $count'),
        ElevatedButton(
          onPressed: model.increment,
          child: const Text('Increment'),
        ),
      ],
    );
  },
)
```

## Performance Optimization

Use `child` parameter to avoid rebuilding static widgets.

```dart
ValueListenableBuilder<int>(
  valueListenable: counter,
  builder: (context, value, child) {
    return Row(
      children: [
        Text('Count: $value'), // Rebuilds
        child!, // Doesn't rebuild
      ],
    );
  },
  child: const ExpensiveWidget(), // Built once
)
```

## Multiple ValueListenables

Combine multiple ValueListenables.

```dart
ValueListenableBuilder<int>(
  valueListenable: counter1,
  builder: (context, value1, child) {
    return ValueListenableBuilder<int>(
      valueListenable: counter2,
      builder: (context, value2, child) {
        return Text('Total: ${value1 + value2}');
      },
    );
  },
)
```

## Key Points

- Use `ValueListenableBuilder` for simple reactive updates
- More efficient than `setState` for single values
- Use `child` parameter for performance optimization
- Always dispose `ValueNotifier` to prevent leaks
- Works with `ValueNotifier`, `Animation`, and other `ValueListenable` implementations
- Rebuilds only when value changes
- Simpler than `StreamBuilder` for single values

<!--
Source references:
- https://github.com/flutter/flutter/tree/main/packages/flutter/lib/src/widgets/value_listenable_builder.dart
- https://api.flutter.dev/flutter/widgets/ValueListenableBuilder-class.html
-->

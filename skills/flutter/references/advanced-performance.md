---
name: advanced-performance
description: Flutter performance optimization - const constructors, keys, widget rebuilds, and performance best practices
---

# Performance Optimization

Optimize Flutter app performance by following best practices.

## Const Constructors

Use `const` constructors to avoid unnecessary rebuilds.

```dart
// ✅ Good - const constructor
const Text('Hello')

// ❌ Bad - new instance on every build
Text('Hello')

// Use const widgets when values don't change
class MyWidget extends StatelessWidget {
  const MyWidget({super.key});

  @override
  Widget build(BuildContext context) {
    return const Column(
      children: [
        Text('Static text'),
        Icon(Icons.star),
      ],
    );
  }
}
```

## Keys

Use keys to preserve state when widgets move in the tree.

```dart
// Use ValueKey for list items
ListView.builder(
  itemBuilder: (context, index) => ListTile(
    key: ValueKey(items[index].id),
    title: Text(items[index].name),
  ),
)

// Use GlobalKey to access state from outside
final _formKey = GlobalKey<FormState>();
Form(key: _formKey, ...)
```

## Widget Rebuilds

Minimize widget rebuilds by splitting widgets.

```dart
// ❌ Bad - entire widget rebuilds on counter change
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
        Text('Counter: $_counter'),
        ElevatedButton(
          onPressed: () => setState(() => _counter++),
          child: const Text('Increment'),
        ),
      ],
    );
  }
}

// ✅ Good - split widgets to minimize rebuilds
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

## ListView Optimization

Use `ListView.builder` for efficient list rendering.

```dart
// ✅ Good - builds items on demand
ListView.builder(
  itemCount: items.length,
  itemBuilder: (context, index) => ListTile(
    title: Text(items[index].name),
  ),
)

// ❌ Bad - builds all items at once
ListView(
  children: items.map((item) => ListTile(
    title: Text(item.name),
  )).toList(),
)
```

## Image Optimization

Optimize image loading and caching.

```dart
// Use cached_network_image package
CachedNetworkImage(
  imageUrl: 'https://example.com/image.jpg',
  placeholder: (context, url) => CircularProgressIndicator(),
  errorWidget: (context, url, error) => Icon(Icons.error),
)

// Precache images
precacheImage(AssetImage('assets/image.png'), context);
```

## Build Methods

Keep build methods lightweight.

```dart
// ❌ Bad - heavy computation in build
@override
Widget build(BuildContext context) {
  final expensiveData = computeExpensiveData(); // Don't do this
  return Text(expensiveData);
}

// ✅ Good - compute in initState or use FutureBuilder
@override
Widget build(BuildContext context) {
  return FutureBuilder(
    future: computeExpensiveData(),
    builder: (context, snapshot) {
      if (!snapshot.hasData) return CircularProgressIndicator();
      return Text(snapshot.data);
    },
  );
}
```

## RepaintBoundary

Isolate repaints to specific widgets.

```dart
RepaintBoundary(
  child: AnimatedContainer(
    duration: Duration(seconds: 1),
    width: _width,
    height: _height,
    color: Colors.blue,
  ),
)
```

## Key Points

- Use `const` constructors whenever possible
- Use keys to preserve state in lists
- Split widgets to minimize rebuilds
- Use `ListView.builder` for long lists
- Optimize image loading and caching
- Keep build methods lightweight
- Use `RepaintBoundary` to isolate repaints
- Profile with Flutter DevTools to identify bottlenecks

<!--
Source references:
- https://docs.flutter.dev/perf/best-practices
- https://docs.flutter.dev/perf/rendering
-->

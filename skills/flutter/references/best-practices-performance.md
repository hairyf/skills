---
name: best-practices-performance
description: Flutter performance best practices - optimization techniques, const usage, and performance patterns
---

# Performance Best Practices

Guidelines for optimizing Flutter app performance.

## Use Const Constructors

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

## Minimize Widget Rebuilds

Split widgets to minimize rebuilds.

```dart
// ✅ Good - split widgets
class ParentWidget extends StatefulWidget {
  @override
  State<ParentWidget> createState() => _ParentWidgetState();
}

class _ParentWidgetState extends State<ParentWidget> {
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

## Use ListView.builder

Use `ListView.builder` for efficient list rendering.

```dart
// ✅ Good - builds items on demand
ListView.builder(
  itemCount: items.length,
  itemBuilder: (context, index) {
    return ListTile(title: Text(items[index].name));
  },
)

// ❌ Bad - builds all items at once
ListView(
  children: items.map((item) => ListTile(
    title: Text(item.name),
  )).toList(),
)
```

## Optimize Images

Optimize image loading and caching.

```dart
// Use cached_network_image package
CachedNetworkImage(
  imageUrl: 'https://example.com/image.jpg',
  placeholder: (context, url) => CircularProgressIndicator(),
  errorWidget: (context, url, error) => Icon(Icons.error),
)

// Precache images
precacheImage(
  AssetImage('assets/image.png'),
  context,
);
```

## Avoid Heavy Work in Build

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

## Use Keys Appropriately

Use keys to preserve state.

```dart
// Use ValueKey for list items
ListView.builder(
  itemBuilder: (context, index) => ListTile(
    key: ValueKey(items[index].id),
    title: Text(items[index].name),
  ),
)
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

## Profile Performance

Use Flutter DevTools to profile performance.

```dart
// Enable performance overlay
MaterialApp(
  showPerformanceOverlay: true, // Debug only
  // ...
)
```

## Key Points

- Use `const` constructors whenever possible
- Split widgets to minimize rebuilds
- Use `ListView.builder` for long lists
- Optimize image loading and caching
- Keep build methods lightweight
- Use keys appropriately to preserve state
- Use `RepaintBoundary` to isolate repaints
- Profile with Flutter DevTools
- Avoid unnecessary setState calls
- Use `const` widgets for static content

<!--
Source references:
- https://docs.flutter.dev/perf/best-practices
- https://docs.flutter.dev/perf/rendering
-->

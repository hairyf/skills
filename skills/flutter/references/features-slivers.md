---
name: features-slivers
description: Flutter Sliver widgets - CustomScrollView, SliverList, SliverGrid, and advanced scrolling effects
---

# Sliver Widgets

Sliver widgets provide advanced scrolling effects and custom scroll behaviors.

## CustomScrollView

Create custom scroll effects with slivers.

```dart
CustomScrollView(
  slivers: [
    SliverAppBar(
      expandedHeight: 200,
      floating: false,
      pinned: true,
      flexibleSpace: FlexibleSpaceBar(
        title: Text('Title'),
        background: Image.network('url'),
      ),
    ),
    SliverList(
      delegate: SliverChildBuilderDelegate(
        (context, index) {
          return ListTile(title: Text('Item $index'));
        },
        childCount: 100,
      ),
    ),
  ],
)
```

## SliverAppBar

App bar that responds to scrolling.

```dart
SliverAppBar(
  expandedHeight: 200,
  floating: true, // Appears when scrolling up
  pinned: true, // Stays at top when scrolling
  snap: true, // Snaps when floating
  flexibleSpace: FlexibleSpaceBar(
    title: Text('Title'),
    background: Image.network('url'),
  ),
)
```

## SliverList

List of widgets in a sliver.

```dart
SliverList(
  delegate: SliverChildBuilderDelegate(
    (context, index) {
      return ListTile(title: Text('Item $index'));
    },
    childCount: 100,
  ),
)

// With separator
SliverList(
  delegate: SliverChildBuilderDelegate(
    (context, index) {
      return ListTile(title: Text('Item $index'));
    },
    childCount: 100,
  ),
)
```

## SliverGrid

Grid of widgets in a sliver.

```dart
SliverGrid(
  gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
    crossAxisCount: 2,
    crossAxisSpacing: 10,
    mainAxisSpacing: 10,
  ),
  delegate: SliverChildBuilderDelegate(
    (context, index) {
      return Container(color: Colors.blue);
    },
    childCount: 20,
  ),
)
```

## SliverPadding

Add padding to slivers.

```dart
SliverPadding(
  padding: const EdgeInsets.all(16),
  sliver: SliverList(...),
)
```

## SliverToBoxAdapter

Convert regular widget to sliver.

```dart
SliverToBoxAdapter(
  child: Container(
    height: 100,
    color: Colors.blue,
    child: Center(child: Text('Header')),
  ),
)
```

## SliverPersistentHeader

Persistent header that changes size.

```dart
SliverPersistentHeader(
  pinned: true,
  delegate: _SliverHeaderDelegate(
    minHeight: 60,
    maxHeight: 200,
  ),
)
```

## Complete Example

```dart
CustomScrollView(
  slivers: [
    SliverAppBar(
      expandedHeight: 200,
      pinned: true,
      flexibleSpace: FlexibleSpaceBar(
        title: Text('Title'),
        background: Image.network('url'),
      ),
    ),
    SliverToBoxAdapter(
      child: Container(
        padding: EdgeInsets.all(16),
        child: Text('Header content'),
      ),
    ),
    SliverList(
      delegate: SliverChildBuilderDelegate(
        (context, index) {
          return ListTile(title: Text('Item $index'));
        },
        childCount: 100,
      ),
    ),
  ],
)
```

## Key Points

- Use `CustomScrollView` for custom scroll effects
- Use `SliverAppBar` for app bars that respond to scrolling
- Use `SliverList` for lists in slivers
- Use `SliverGrid` for grids in slivers
- Use `SliverPadding` to add padding
- Use `SliverToBoxAdapter` to convert widgets to slivers
- Slivers provide advanced scrolling effects
- Combine multiple slivers for complex layouts

<!--
Source references:
- https://github.com/flutter/flutter/tree/main/packages/flutter/lib/src/widgets/sliver.dart
- https://docs.flutter.dev/development/ui/advanced/slivers
-->

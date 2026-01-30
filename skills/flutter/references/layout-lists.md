---
name: layout-lists
description: Flutter list widgets - ListView, ListTile, GridView, and Sliver widgets for scrollable content
---

# List Widgets

Flutter provides powerful widgets for displaying scrollable lists and grids.

## ListView

Display a scrollable list of widgets.

### Basic ListView

```dart
ListView(
  children: [
    ListTile(title: Text('Item 1')),
    ListTile(title: Text('Item 2')),
    ListTile(title: Text('Item 3')),
  ],
)
```

### ListView.builder

Efficiently build list items on demand.

```dart
ListView.builder(
  itemCount: items.length,
  itemBuilder: (context, index) {
    return ListTile(
      title: Text(items[index].name),
      subtitle: Text(items[index].description),
      onTap: () {
        // Handle tap
      },
    );
  },
)
```

### ListView.separated

List with separators between items.

```dart
ListView.separated(
  itemCount: items.length,
  separatorBuilder: (context, index) => const Divider(),
  itemBuilder: (context, index) {
    return ListTile(
      title: Text(items[index].name),
    );
  },
)
```

### ListView Properties

```dart
ListView(
  scrollDirection: Axis.vertical, // vertical, horizontal
  reverse: false, // Reverse scroll direction
  controller: scrollController, // ScrollController
  physics: const AlwaysScrollableScrollPhysics(), // ClampingScrollPhysics, BouncingScrollPhysics, etc.
  padding: const EdgeInsets.all(16),
  shrinkWrap: true, // Take only needed space
  primary: true, // Use primary scroll controller
  children: [...],
)
```

## ListTile

Standard list item widget.

```dart
ListTile(
  leading: Icon(Icons.star), // Widget before title
  title: Text('Title'),
  subtitle: Text('Subtitle'),
  trailing: Icon(Icons.arrow_forward), // Widget after title
  isThreeLine: false, // Use three lines for subtitle
  dense: false, // Use less vertical padding
  enabled: true,
  selected: false,
  selectedTileColor: Colors.blue,
  onTap: () {
    // Handle tap
  },
  onLongPress: () {
    // Handle long press
  },
)
```

## GridView

Display items in a grid layout.

### GridView.count

Grid with fixed number of columns.

```dart
GridView.count(
  crossAxisCount: 2, // Number of columns
  crossAxisSpacing: 10,
  mainAxisSpacing: 10,
  padding: const EdgeInsets.all(16),
  children: [
    Container(color: Colors.red),
    Container(color: Colors.green),
    Container(color: Colors.blue),
  ],
)
```

### GridView.builder

Efficiently build grid items on demand.

```dart
GridView.builder(
  gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
    crossAxisCount: 2,
    crossAxisSpacing: 10,
    mainAxisSpacing: 10,
    childAspectRatio: 1.0, // Width/height ratio
  ),
  itemCount: items.length,
  itemBuilder: (context, index) {
    return Container(
      color: Colors.blue,
      child: Center(child: Text('Item $index')),
    );
  },
)
```

### GridView.extent

Grid with maximum cross-axis extent.

```dart
GridView.extent(
  maxCrossAxisExtent: 200, // Maximum width per item
  crossAxisSpacing: 10,
  mainAxisSpacing: 10,
  children: [
    Container(color: Colors.red),
    Container(color: Colors.green),
  ],
)
```

## Sliver Widgets

Use Sliver widgets for custom scroll effects in CustomScrollView.

### CustomScrollView

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

### Common Sliver Widgets

```dart
// Fixed header
SliverToBoxAdapter(
  child: Container(height: 100, color: Colors.blue),
)

// Grid
SliverGrid(
  gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
    crossAxisCount: 2,
  ),
  delegate: SliverChildBuilderDelegate(
    (context, index) => Container(color: Colors.red),
    childCount: 10,
  ),
)

// Padding
SliverPadding(
  padding: const EdgeInsets.all(16),
  sliver: SliverList(...),
)
```

## ScrollController

Control scroll position programmatically.

```dart
final scrollController = ScrollController();

@override
void initState() {
  super.initState();
  scrollController.addListener(() {
    print('Scroll position: ${scrollController.offset}');
  });
}

@override
void dispose() {
  scrollController.dispose();
  super.dispose();
}

// Usage
ListView(
  controller: scrollController,
  children: [...],
)

// Scroll to position
scrollController.animateTo(
  500,
  duration: const Duration(milliseconds: 300),
  curve: Curves.easeInOut,
)

// Jump to position
scrollController.jumpTo(500);
```

## Key Points

- Use `ListView` for vertical/horizontal scrolling lists
- Use `ListView.builder` for efficient list rendering
- Use `ListView.separated` for lists with separators
- Use `ListTile` for standard list items
- Use `GridView` for grid layouts
- Use `CustomScrollView` with Sliver widgets for advanced scroll effects
- Use `ScrollController` to control scroll position
- Set `shrinkWrap: true` for lists inside other scrollable widgets
- Use `physics` property to control scroll behavior

<!--
Source references:
- https://github.com/flutter/flutter/tree/main/packages/flutter/lib/src/widgets/scroll_view.dart
- https://docs.flutter.dev/development/ui/widgets/lists
-->

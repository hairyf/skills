---
name: widgets-refresh-indicator
description: Flutter RefreshIndicator - pull-to-refresh functionality for scrollable content
---

# RefreshIndicator

`RefreshIndicator` provides pull-to-refresh functionality for scrollable widgets.

## Basic Usage

```dart
RefreshIndicator(
  onRefresh: () async {
    // Fetch new data
    await fetchData();
  },
  child: ListView(
    children: [
      ListTile(title: Text('Item 1')),
      ListTile(title: Text('Item 2')),
      ListTile(title: Text('Item 3')),
    ],
  ),
)
```

## With Future

```dart
RefreshIndicator(
  onRefresh: () async {
    final data = await fetchData();
    setState(() {
      _items = data;
    });
  },
  child: ListView.builder(
    itemCount: _items.length,
    itemBuilder: (context, index) {
      return ListTile(title: Text(_items[index]));
    },
  ),
)
```

## Customization

```dart
RefreshIndicator(
  onRefresh: () async {
    await fetchData();
  },
  color: Colors.blue, // Indicator color
  backgroundColor: Colors.white, // Background color
  strokeWidth: 3.0, // Indicator stroke width
  displacement: 40.0, // Displacement from top
  edgeOffset: 0.0, // Edge offset
  triggerMode: RefreshIndicatorTriggerMode.onEdge, // onEdge, anywhere
  child: ListView(...),
)
```

## Complete Example

```dart
class RefreshableList extends StatefulWidget {
  const RefreshableList({super.key});

  @override
  State<RefreshableList> createState() => _RefreshableListState();
}

class _RefreshableListState extends State<RefreshableList> {
  List<String> _items = ['Item 1', 'Item 2', 'Item 3'];

  Future<void> _refresh() async {
    // Simulate network delay
    await Future.delayed(Duration(seconds: 2));
    
    setState(() {
      _items = ['New Item 1', 'New Item 2', 'New Item 3'];
    });
  }

  @override
  Widget build(BuildContext context) {
    return RefreshIndicator(
      onRefresh: _refresh,
      child: ListView.builder(
        itemCount: _items.length,
        itemBuilder: (context, index) {
          return ListTile(title: Text(_items[index]));
        },
      ),
    );
  }
}
```

## Key Points

- Use `RefreshIndicator` for pull-to-refresh
- Wrap scrollable widgets (ListView, GridView, etc.)
- `onRefresh` must return a Future
- Customize appearance with properties
- Works with any scrollable widget
- Provides standard Material Design refresh indicator
- Use `triggerMode` to control when refresh triggers

<!--
Source references:
- https://github.com/flutter/flutter/tree/main/packages/flutter/lib/src/material/refresh_indicator.dart
- https://docs.flutter.dev/cookbook/design/pull-to-refresh
-->

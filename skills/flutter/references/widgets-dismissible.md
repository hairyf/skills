---
name: widgets-dismissible
description: Flutter Dismissible - swipe-to-dismiss widgets with callbacks
---

# Dismissible

`Dismissible` allows widgets to be dismissed by swiping.

## Basic Usage

```dart
Dismissible(
  key: Key(item.id),
  onDismissed: (direction) {
    // Handle dismissal
    setState(() {
      items.remove(item);
    });
  },
  child: ListTile(title: Text(item.name)),
)
```

## Dismiss Directions

```dart
Dismissible(
  key: Key(item.id),
  direction: DismissDirection.horizontal, // horizontal, vertical, endToStart, startToEnd, up, down, all
  onDismissed: (direction) {
    if (direction == DismissDirection.endToStart) {
      // Swiped left
    } else {
      // Swiped right
    }
  },
  child: ListTile(title: Text(item.name)),
)
```

## Background

Show background when dismissing.

```dart
Dismissible(
  key: Key(item.id),
  background: Container(
    color: Colors.red,
    alignment: Alignment.centerLeft,
    padding: EdgeInsets.only(left: 20),
    child: Icon(Icons.delete, color: Colors.white),
  ),
  secondaryBackground: Container(
    color: Colors.green,
    alignment: Alignment.centerRight,
    padding: EdgeInsets.only(right: 20),
    child: Icon(Icons.archive, color: Colors.white),
  ),
  onDismissed: (direction) {
    if (direction == DismissDirection.endToStart) {
      // Delete
    } else {
      // Archive
    }
  },
  child: ListTile(title: Text(item.name)),
)
```

## Confirm Dismissal

```dart
Dismissible(
  key: Key(item.id),
  confirmDismiss: (direction) async {
    // Show confirmation dialog
    return await showDialog<bool>(
      context: context,
      builder: (context) => AlertDialog(
        title: Text('Confirm'),
        content: Text('Delete this item?'),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context, false),
            child: Text('Cancel'),
          ),
          ElevatedButton(
            onPressed: () => Navigator.pop(context, true),
            child: Text('Delete'),
          ),
        ],
      ),
    ) ?? false;
  },
  onDismissed: (direction) {
    // Handle dismissal
  },
  child: ListTile(title: Text(item.name)),
)
```

## Complete Example

```dart
ListView.builder(
  itemCount: items.length,
  itemBuilder: (context, index) {
    final item = items[index];
    return Dismissible(
      key: Key(item.id),
      direction: DismissDirection.endToStart,
      background: Container(
        color: Colors.red,
        alignment: Alignment.centerRight,
        padding: EdgeInsets.only(right: 20),
        child: Icon(Icons.delete, color: Colors.white),
      ),
      confirmDismiss: (direction) async {
        return await showDialog<bool>(
          context: context,
          builder: (context) => AlertDialog(
            title: Text('Delete?'),
            content: Text('Are you sure?'),
            actions: [
              TextButton(
                onPressed: () => Navigator.pop(context, false),
                child: Text('Cancel'),
              ),
              ElevatedButton(
                onPressed: () => Navigator.pop(context, true),
                child: Text('Delete'),
              ),
            ],
          ),
        ) ?? false;
      },
      onDismissed: (direction) {
        setState(() {
          items.removeAt(index);
        });
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('Item deleted')),
        );
      },
      child: ListTile(title: Text(item.name)),
    );
  },
)
```

## Key Points

- Use `Dismissible` for swipe-to-dismiss
- Provide unique `key` for each item
- Use `background` and `secondaryBackground` for visual feedback
- Use `confirmDismiss` to confirm before dismissing
- Handle `onDismissed` to update state
- Set `direction` to control swipe directions
- Works well in ListView.builder
- Update list after dismissal

<!--
Source references:
- https://github.com/flutter/flutter/tree/main/packages/flutter/lib/src/widgets/dismissible.dart
- https://docs.flutter.dev/cookbook/gestures/dismissible
-->

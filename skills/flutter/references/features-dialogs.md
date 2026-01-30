---
name: features-dialogs
description: Flutter dialogs and modals - AlertDialog, showDialog, showModalBottomSheet, and dialog patterns
---

# Dialogs and Modals

Flutter provides various dialog and modal widgets for user interactions.

## AlertDialog

Standard alert dialog.

```dart
showDialog(
  context: context,
  builder: (context) => AlertDialog(
    title: const Text('Title'),
    content: const Text('Content'),
    actions: [
      TextButton(
        onPressed: () => Navigator.pop(context),
        child: const Text('Cancel'),
      ),
      ElevatedButton(
        onPressed: () {
          Navigator.pop(context);
          // Handle action
        },
        child: const Text('OK'),
      ),
    ],
  ),
)
```

## SimpleDialog

Dialog with list of options.

```dart
showDialog(
  context: context,
  builder: (context) => SimpleDialog(
    title: const Text('Choose option'),
    children: [
      SimpleDialogOption(
        onPressed: () {
          Navigator.pop(context, 'option1');
        },
        child: const Text('Option 1'),
      ),
      SimpleDialogOption(
        onPressed: () {
          Navigator.pop(context, 'option2');
        },
        child: const Text('Option 2'),
      ),
    ],
  ),
).then((value) {
  if (value != null) {
    print('Selected: $value');
  }
});
```

## Dialog Properties

```dart
AlertDialog(
  title: const Text('Title'),
  titleTextStyle: const TextStyle(fontSize: 20),
  content: const Text('Content'),
  contentTextStyle: const TextStyle(fontSize: 16),
  actions: [...],
  backgroundColor: Colors.white,
  elevation: 8,
  shape: RoundedRectangleBorder(
    borderRadius: BorderRadius.circular(16),
  ),
  icon: const Icon(Icons.info),
  iconColor: Colors.blue,
)
```

## showModalBottomSheet

Show bottom sheet modal.

```dart
showModalBottomSheet(
  context: context,
  builder: (context) => Container(
    padding: const EdgeInsets.all(16),
    child: Column(
      mainAxisSize: MainAxisSize.min,
      children: [
        ListTile(
          leading: const Icon(Icons.share),
          title: const Text('Share'),
          onTap: () {
            Navigator.pop(context);
          },
        ),
        ListTile(
          leading: const Icon(Icons.delete),
          title: const Text('Delete'),
          onTap: () {
            Navigator.pop(context);
          },
        ),
      ],
    ),
  ),
)
```

## DraggableScrollableSheet

Draggable bottom sheet.

```dart
showModalBottomSheet(
  context: context,
  isScrollControlled: true,
  builder: (context) => DraggableScrollableSheet(
    initialChildSize: 0.5,
    minChildSize: 0.25,
    maxChildSize: 0.9,
    builder: (context, scrollController) {
      return ListView(
        controller: scrollController,
        children: [
          // Content
        ],
      );
    },
  ),
)
```

## Confirmation Dialog

```dart
Future<bool> showConfirmationDialog(BuildContext context) async {
  return await showDialog<bool>(
    context: context,
    builder: (context) => AlertDialog(
      title: const Text('Confirm'),
      content: const Text('Are you sure?'),
      actions: [
        TextButton(
          onPressed: () => Navigator.pop(context, false),
          child: const Text('Cancel'),
        ),
        ElevatedButton(
          onPressed: () => Navigator.pop(context, true),
          child: const Text('Confirm'),
        ),
      ],
    ),
  ) ?? false;
}

// Usage
final confirmed = await showConfirmationDialog(context);
if (confirmed) {
  // Proceed
}
```

## Custom Dialog

```dart
showDialog(
  context: context,
  builder: (context) => Dialog(
    child: Container(
      padding: const EdgeInsets.all(16),
      child: Column(
        mainAxisSize: MainAxisSize.min,
        children: [
          const Text('Custom Dialog'),
          const SizedBox(height: 16),
          ElevatedButton(
            onPressed: () => Navigator.pop(context),
            child: const Text('Close'),
          ),
        ],
      ),
    ),
  ),
)
```

## Key Points

- Use `showDialog()` to display dialogs
- Use `AlertDialog` for standard alerts
- Use `SimpleDialog` for option selection
- Use `showModalBottomSheet()` for bottom sheets
- Use `DraggableScrollableSheet` for draggable sheets
- Dialogs return values via `Navigator.pop(result)`
- Use `barrierDismissible` to control dismissal
- Customize dialog appearance with properties
- Handle dialog results with `.then()` or `await`

<!--
Source references:
- https://github.com/flutter/flutter/tree/main/packages/flutter/lib/src/material/dialog.dart
- https://docs.flutter.dev/development/ui/widgets/material#Dialogs
-->

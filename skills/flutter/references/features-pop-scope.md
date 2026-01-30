---
name: features-pop-scope
description: Flutter PopScope - handle back button and navigation pop events
---

# PopScope

`PopScope` (formerly `WillPopScope`) handles back button and navigation pop events.

## Basic Usage

```dart
PopScope(
  canPop: false, // Prevent popping
  onPopInvoked: (didPop) {
    if (!didPop) {
      // Handle back button press
      showDialog(...);
    }
  },
  child: Scaffold(...),
)
```

## Prevent Pop

```dart
PopScope(
  canPop: false,
  onPopInvoked: (didPop) {
    if (!didPop) {
      // Show confirmation dialog
      showDialog(
        context: context,
        builder: (context) => AlertDialog(
          title: Text('Exit?'),
          content: Text('Are you sure?'),
          actions: [
            TextButton(
              onPressed: () => Navigator.pop(context),
              child: Text('Cancel'),
            ),
            ElevatedButton(
              onPressed: () {
                Navigator.pop(context);
                Navigator.pop(context); // Pop this route
              },
              child: Text('Exit'),
            ),
          ],
        ),
      );
    }
  },
  child: Scaffold(...),
)
```

## Conditional Pop

```dart
PopScope(
  canPop: _isFormDirty ? false : true,
  onPopInvoked: (didPop) {
    if (!didPop && _isFormDirty) {
      // Show unsaved changes dialog
      showDialog(...);
    }
  },
  child: Form(...),
)
```

## Save on Pop

```dart
PopScope(
  canPop: false,
  onPopInvoked: (didPop) async {
    if (!didPop) {
      // Save data before popping
      await saveData();
      if (mounted) {
        Navigator.pop(context);
      }
    }
  },
  child: Scaffold(...),
)
```

## Key Points

- Use `PopScope` to handle back button
- Set `canPop: false` to prevent automatic pop
- Use `onPopInvoked` to handle pop events
- Check `didPop` to see if pop occurred
- Use for unsaved changes warnings
- Use for confirmation dialogs
- Save data before popping if needed
- Replaced `WillPopScope` in newer Flutter versions

<!--
Source references:
- https://github.com/flutter/flutter/tree/main/packages/flutter/lib/src/widgets/pop_scope.dart
- https://api.flutter.dev/flutter/widgets/PopScope-class.html
-->

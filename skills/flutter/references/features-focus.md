---
name: features-focus
description: Flutter focus management - FocusNode, FocusScope, focus traversal, and keyboard navigation
---

# Focus Management

Flutter provides comprehensive focus management for keyboard navigation and accessibility.

## FocusNode

Manage focus for widgets.

```dart
class FocusExample extends StatefulWidget {
  const FocusExample({super.key});

  @override
  State<FocusExample> createState() => _FocusExampleState();
}

class _FocusExampleState extends State<FocusExample> {
  final _focusNode = FocusNode();

  @override
  void dispose() {
    _focusNode.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return TextField(
      focusNode: _focusNode,
      decoration: const InputDecoration(labelText: 'Input'),
    );
  }
}
```

## Request Focus

Programmatically request focus.

```dart
final _focusNode = FocusNode();

@override
Widget build(BuildContext context) {
  return Column(
    children: [
      TextField(focusNode: _focusNode),
      ElevatedButton(
        onPressed: () {
          _focusNode.requestFocus();
        },
        child: const Text('Focus Input'),
      ),
    ],
  );
}
```

## Unfocus

Remove focus from current widget.

```dart
// Unfocus current focus
FocusScope.of(context).unfocus();

// Or using FocusNode
_focusNode.unfocus();
```

## FocusScope

Group focusable widgets.

```dart
FocusScope(
  child: Column(
    children: [
      TextField(),
      TextField(),
      ElevatedButton(
        onPressed: () {
          FocusScope.of(context).unfocus();
        },
        child: const Text('Unfocus All'),
      ),
    ],
  ),
)
```

## Focus Traversal

Navigate between focusable widgets.

```dart
FocusTraversalGroup(
  child: Column(
    children: [
      TextField(),
      TextField(),
      TextField(),
      ElevatedButton(
        onPressed: () {
          FocusTraversalGroup.of(context).nextFocus();
        },
        child: const Text('Next'),
      ),
    ],
  ),
)
```

## Focus Traversal Order

Control focus order.

```dart
FocusTraversalOrder(
  order: NumericFocusOrder(1.0),
  child: TextField(),
)

FocusTraversalOrder(
  order: NumericFocusOrder(2.0),
  child: TextField(),
)
```

## Focus Listener

Listen to focus changes.

```dart
final _focusNode = FocusNode();

@override
void initState() {
  super.initState();
  _focusNode.addListener(() {
    if (_focusNode.hasFocus) {
      print('Focused');
    } else {
      print('Unfocused');
    }
  });
}

@override
void dispose() {
  _focusNode.dispose();
  super.dispose();
}
```

## Keyboard Actions

Handle keyboard actions.

```dart
TextField(
  textInputAction: TextInputAction.next,
  onSubmitted: (value) {
    // Move to next field
    FocusScope.of(context).nextFocus();
  },
)
```

## Key Points

- Use `FocusNode` to manage focus for widgets
- Call `requestFocus()` to focus a widget
- Call `unfocus()` to remove focus
- Use `FocusScope` to group focusable widgets
- Use `FocusTraversalGroup` for keyboard navigation
- Use `FocusTraversalOrder` to control focus order
- Always dispose `FocusNode` to prevent leaks
- Listen to focus changes with `addListener()`
- Use `FocusScope.of(context).unfocus()` to dismiss keyboard

<!--
Source references:
- https://github.com/flutter/flutter/tree/main/packages/flutter/lib/src/widgets/focus_manager.dart
- https://docs.flutter.dev/development/ui/interactive
-->

---
name: advanced-gestures
description: Flutter gestures - GestureDetector, GestureRecognizer, drag and drop, and gesture handling
---

# Gestures

Flutter provides comprehensive gesture detection and handling capabilities.

## GestureDetector

Detect various gestures on widgets.

```dart
GestureDetector(
  onTap: () {
    // Handle tap
  },
  onDoubleTap: () {
    // Handle double tap
  },
  onLongPress: () {
    // Handle long press
  },
  onPanUpdate: (details) {
    // Handle pan (drag)
    print('Delta: ${details.delta}');
  },
  onScaleUpdate: (details) {
    // Handle scale (pinch)
    print('Scale: ${details.scale}');
  },
  child: Container(
    width: 100,
    height: 100,
    color: Colors.blue,
  ),
)
```

## Tap Gestures

```dart
GestureDetector(
  onTap: () {
    print('Tapped');
  },
  onTapDown: (details) {
    print('Tap down at ${details.localPosition}');
  },
  onTapUp: (details) {
    print('Tap up at ${details.localPosition}');
  },
  onTapCancel: () {
    print('Tap cancelled');
  },
  child: Container(...),
)
```

## Long Press

```dart
GestureDetector(
  onLongPress: () {
    print('Long pressed');
  },
  onLongPressStart: (details) {
    print('Long press started');
  },
  onLongPressEnd: (details) {
    print('Long press ended');
  },
  onLongPressMoveUpdate: (details) {
    print('Long press moved: ${details.localPosition}');
  },
  child: Container(...),
)
```

## Pan Gestures (Drag)

```dart
class DraggableWidget extends StatefulWidget {
  const DraggableWidget({super.key});

  @override
  State<DraggableWidget> createState() => _DraggableWidgetState();
}

class _DraggableWidgetState extends State<DraggableWidget> {
  Offset _position = Offset.zero;

  @override
  Widget build(BuildContext context) {
    return Positioned(
      left: _position.dx,
      top: _position.dy,
      child: GestureDetector(
        onPanUpdate: (details) {
          setState(() {
            _position += details.delta;
          });
        },
        child: Container(
          width: 100,
          height: 100,
          color: Colors.blue,
        ),
      ),
    );
  }
}
```

## Scale Gestures (Pinch)

```dart
class ScalableWidget extends StatefulWidget {
  const ScalableWidget({super.key});

  @override
  State<ScalableWidget> createState() => _ScalableWidgetState();
}

class _ScalableWidgetState extends State<ScalableWidget> {
  double _scale = 1.0;

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onScaleUpdate: (details) {
        setState(() {
          _scale = details.scale;
        });
      },
      child: Transform.scale(
        scale: _scale,
        child: Container(
          width: 100,
          height: 100,
          color: Colors.blue,
        ),
      ),
    );
  }
}
```

## GestureRecognizer

Create custom gesture recognizers.

```dart
final _tapRecognizer = TapGestureRecognizer()
  ..onTap = () {
    print('Custom tap');
  };

RichText(
  text: TextSpan(
    text: 'Tap ',
    children: [
      TextSpan(
        text: 'here',
        style: TextStyle(color: Colors.blue),
        recognizer: _tapRecognizer,
      ),
    ],
  ),
)

@override
void dispose() {
  _tapRecognizer.dispose();
  super.dispose();
}
```

## Drag and Drop

Use Draggable and DragTarget for drag and drop.

```dart
// Draggable widget
Draggable<String>(
  data: 'data',
  feedback: Container(
    width: 100,
    height: 100,
    color: Colors.blue.withOpacity(0.5),
  ),
  childWhenDragging: Container(
    width: 100,
    height: 100,
    color: Colors.grey,
  ),
  child: Container(
    width: 100,
    height: 100,
    color: Colors.blue,
    child: const Center(child: Text('Drag me')),
  ),
)

// Drop target
DragTarget<String>(
  onAccept: (data) {
    print('Accepted: $data');
  },
  builder: (context, candidateData, rejectedData) {
    return Container(
      width: 200,
      height: 200,
      color: candidateData.isNotEmpty ? Colors.green : Colors.grey,
      child: const Center(child: Text('Drop here')),
    );
  },
)
```

## Gesture Behavior

Control gesture behavior.

```dart
GestureDetector(
  behavior: HitTestBehavior.opaque, // opaque, translucent, deferToChild
  onTap: () {},
  child: Container(...),
)
```

## Gesture Conflicts

Handle multiple gesture recognizers.

```dart
GestureDetector(
  onTap: () {
    print('Tap');
  },
  child: GestureDetector(
    onLongPress: () {
      print('Long press');
    },
    child: Container(...),
  ),
)
```

## Key Points

- Use `GestureDetector` for basic gesture detection
- Handle tap, double tap, long press gestures
- Use `onPanUpdate` for drag gestures
- Use `onScaleUpdate` for pinch/zoom gestures
- Use `Draggable` and `DragTarget` for drag and drop
- Use `GestureRecognizer` for custom gesture handling
- Set `behavior` to control hit testing
- Dispose gesture recognizers to prevent leaks
- GestureDetector can detect multiple gesture types simultaneously

<!--
Source references:
- https://github.com/flutter/flutter/tree/main/packages/flutter/lib/src/widgets/gesture_detector.dart
- https://docs.flutter.dev/development/ui/advanced/gestures
-->

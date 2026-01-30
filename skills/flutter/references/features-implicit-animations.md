---
name: features-implicit-animations
description: Flutter implicit animations - AnimatedContainer, AnimatedOpacity, AnimatedSize, and other implicit animation widgets
---

# Implicit Animations

Implicit animations automatically animate property changes. They're simpler to use than explicit animations but less flexible.

## AnimatedContainer

Automatically animates changes to Container properties.

```dart
class AnimatedContainerExample extends StatefulWidget {
  const AnimatedContainerExample({super.key});

  @override
  State<AnimatedContainerExample> createState() => _AnimatedContainerExampleState();
}

class _AnimatedContainerExampleState extends State<AnimatedContainerExample> {
  bool _expanded = false;

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: () {
        setState(() {
          _expanded = !_expanded;
        });
      },
      child: AnimatedContainer(
        duration: const Duration(milliseconds: 300),
        curve: Curves.easeInOut,
        width: _expanded ? 200 : 100,
        height: _expanded ? 200 : 100,
        decoration: BoxDecoration(
          color: _expanded ? Colors.blue : Colors.red,
          borderRadius: BorderRadius.circular(_expanded ? 20 : 10),
        ),
        child: Center(
          child: Text(_expanded ? 'Expanded' : 'Collapsed'),
        ),
      ),
    );
  }
}
```

## AnimatedOpacity

Animates opacity changes.

```dart
class AnimatedOpacityExample extends StatefulWidget {
  const AnimatedOpacityExample({super.key});

  @override
  State<AnimatedOpacityExample> createState() => _AnimatedOpacityExampleState();
}

class _AnimatedOpacityExampleState extends State<AnimatedOpacityExample> {
  bool _visible = true;

  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        AnimatedOpacity(
          opacity: _visible ? 1.0 : 0.0,
          duration: const Duration(milliseconds: 300),
          child: const FlutterLogo(size: 100),
        ),
        ElevatedButton(
          onPressed: () {
            setState(() {
              _visible = !_visible;
            });
          },
          child: Text(_visible ? 'Hide' : 'Show'),
        ),
      ],
    );
  }
}
```

## AnimatedSize

Animates size changes.

```dart
class AnimatedSizeExample extends StatefulWidget {
  const AnimatedSizeExample({super.key});

  @override
  State<AnimatedSizeExample> createState() => _AnimatedSizeExampleState();
}

class _AnimatedSizeExampleState extends State<AnimatedSizeExample> {
  bool _expanded = false;

  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        AnimatedSize(
          duration: const Duration(milliseconds: 300),
          curve: Curves.easeInOut,
          child: Container(
            width: _expanded ? 200 : 100,
            height: _expanded ? 200 : 100,
            color: Colors.blue,
            child: _expanded
                ? const Center(child: Text('Expanded'))
                : const Center(child: Text('Small')),
          ),
        ),
        ElevatedButton(
          onPressed: () {
            setState(() {
              _expanded = !_expanded;
            });
          },
          child: Text(_expanded ? 'Collapse' : 'Expand'),
        ),
      ],
    );
  }
}
```

## AnimatedCrossFade

Cross-fades between two children.

```dart
class AnimatedCrossFadeExample extends StatefulWidget {
  const AnimatedCrossFadeExample({super.key});

  @override
  State<AnimatedCrossFadeExample> createState() => _AnimatedCrossFadeExampleState();
}

class _AnimatedCrossFadeExampleState extends State<AnimatedCrossFadeExample> {
  bool _showFirst = true;

  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        AnimatedCrossFade(
          duration: const Duration(milliseconds: 300),
          firstChild: Container(
            width: 200,
            height: 200,
            color: Colors.red,
            child: const Center(child: Text('First')),
          ),
          secondChild: Container(
            width: 200,
            height: 200,
            color: Colors.blue,
            child: const Center(child: Text('Second')),
          ),
          crossFadeState: _showFirst
              ? CrossFadeState.showFirst
              : CrossFadeState.showSecond,
        ),
        ElevatedButton(
          onPressed: () {
            setState(() {
              _showFirst = !_showFirst;
            });
          },
          child: const Text('Toggle'),
        ),
      ],
    );
  }
}
```

## AnimatedSwitcher

Switches between children with a transition.

```dart
class AnimatedSwitcherExample extends StatefulWidget {
  const AnimatedSwitcherExample({super.key});

  @override
  State<AnimatedSwitcherExample> createState() => _AnimatedSwitcherExampleState();
}

class _AnimatedSwitcherExampleState extends State<AnimatedSwitcherExample> {
  int _counter = 0;

  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        AnimatedSwitcher(
          duration: const Duration(milliseconds: 300),
          transitionBuilder: (child, animation) {
            return ScaleTransition(
              scale: animation,
              child: child,
            );
          },
          child: Text(
            '$_counter',
            key: ValueKey(_counter),
            style: const TextStyle(fontSize: 48),
          ),
        ),
        ElevatedButton(
          onPressed: () {
            setState(() {
              _counter++;
            });
          },
          child: const Text('Increment'),
        ),
      ],
    );
  }
}
```

## AnimatedPositioned

Animates position changes within a Stack.

```dart
class AnimatedPositionedExample extends StatefulWidget {
  const AnimatedPositionedExample({super.key});

  @override
  State<AnimatedPositionedExample> createState() => _AnimatedPositionedExampleState();
}

class _AnimatedPositionedExampleState extends State<AnimatedPositionedExample> {
  bool _moved = false;

  @override
  Widget build(BuildContext context) {
    return Stack(
      children: [
        AnimatedPositioned(
          duration: const Duration(milliseconds: 300),
          left: _moved ? 200 : 0,
          top: _moved ? 200 : 0,
          child: Container(
            width: 100,
            height: 100,
            color: Colors.blue,
          ),
        ),
        Positioned(
          bottom: 20,
          left: 20,
          child: ElevatedButton(
            onPressed: () {
              setState(() {
                _moved = !_moved;
              });
            },
            child: const Text('Move'),
          ),
        ),
      ],
    );
  }
}
```

## Animation Curves

Use curves to control animation timing.

```dart
AnimatedContainer(
  duration: const Duration(milliseconds: 300),
  curve: Curves.easeInOut, // Common curves: linear, easeIn, easeOut, easeInOut, bounce, elastic
  // ... properties
)
```

## Key Points

- Implicit animations automatically animate property changes
- Use `AnimatedContainer` for animating container properties
- Use `AnimatedOpacity` for fade in/out effects
- Use `AnimatedSize` for size changes
- Use `AnimatedCrossFade` to transition between two widgets
- Use `AnimatedSwitcher` to switch between children
- Use `AnimatedPositioned` for position animations in Stack
- Specify `duration` and `curve` for timing control
- Implicit animations are simpler but less flexible than explicit animations

<!--
Source references:
- https://github.com/flutter/flutter/tree/main/packages/flutter/lib/src/widgets/implicit_animations.dart
- https://docs.flutter.dev/development/ui/animations/implicit-animations
-->

---
name: advanced-custom-paint
description: Flutter custom painting - CustomPainter, Canvas, custom graphics, and drawing operations
---

# Custom Paint

Create custom graphics and drawings using `CustomPainter` and `Canvas`.

## CustomPainter

Implement custom painting logic.

```dart
class MyPainter extends CustomPainter {
  @override
  void paint(Canvas canvas, Size size) {
    final paint = Paint()
      ..color = Colors.blue
      ..style = PaintingStyle.fill;

    canvas.drawCircle(
      Offset(size.width / 2, size.height / 2),
      size.width / 2,
      paint,
    );
  }

  @override
  bool shouldRepaint(covariant CustomPainter oldDelegate) => false;
}

// Usage
CustomPaint(
  painter: MyPainter(),
  size: Size(200, 200),
)
```

## Canvas Drawing Operations

### Draw Shapes

```dart
@override
void paint(Canvas canvas, Size size) {
  final paint = Paint()
    ..color = Colors.blue
    ..style = PaintingStyle.fill;

  // Draw circle
  canvas.drawCircle(
    Offset(size.width / 2, size.height / 2),
    50,
    paint,
  );

  // Draw rectangle
  canvas.drawRect(
    Rect.fromLTWH(10, 10, 100, 100),
    paint,
  );

  // Draw rounded rectangle
  canvas.drawRRect(
    RRect.fromRectAndRadius(
      Rect.fromLTWH(10, 10, 100, 100),
      Radius.circular(10),
    ),
    paint,
  );

  // Draw line
  canvas.drawLine(
    Offset(0, 0),
    Offset(100, 100),
    paint,
  );

  // Draw path
  final path = Path()
    ..moveTo(0, 0)
    ..lineTo(100, 50)
    ..lineTo(50, 100)
    ..close();
  canvas.drawPath(path, paint);
}
```

## Paint Properties

```dart
final paint = Paint()
  ..color = Colors.blue // Paint color
  ..style = PaintingStyle.fill // fill, stroke
  ..strokeWidth = 2.0 // For stroke style
  ..strokeCap = StrokeCap.round // butt, round, square
  ..strokeJoin = StrokeJoin.round // miter, round, bevel
  ..blendMode = BlendMode.srcOver // Blend mode
  ..shader = Gradient.linear(...) // Gradient shader
  ..maskFilter = MaskFilter.blur(BlurStyle.normal, 5) // Blur effect
  ..isAntiAlias = true; // Anti-aliasing
```

## CustomPainter Example

```dart
class ProgressPainter extends CustomPainter {
  final double progress;

  ProgressPainter(this.progress);

  @override
  void paint(Canvas canvas, Size size) {
    final backgroundPaint = Paint()
      ..color = Colors.grey[300]!
      ..style = PaintingStyle.fill;

    final progressPaint = Paint()
      ..color = Colors.blue
      ..style = PaintingStyle.fill;

    // Draw background
    canvas.drawRRect(
      RRect.fromRectAndRadius(
        Rect.fromLTWH(0, 0, size.width, size.height),
        Radius.circular(size.height / 2),
      ),
      backgroundPaint,
    );

    // Draw progress
    canvas.drawRRect(
      RRect.fromRectAndRadius(
        Rect.fromLTWH(0, 0, size.width * progress, size.height),
        Radius.circular(size.height / 2),
      ),
      progressPaint,
    );
  }

  @override
  bool shouldRepaint(ProgressPainter oldDelegate) {
    return progress != oldDelegate.progress;
  }
}

// Usage
CustomPaint(
  painter: ProgressPainter(0.7),
  size: Size(200, 20),
)
```

## Transformations

Apply transformations to canvas.

```dart
@override
void paint(Canvas canvas, Size size) {
  // Save canvas state
  canvas.save();

  // Translate
  canvas.translate(50, 50);

  // Rotate
  canvas.rotate(0.5); // Radians

  // Scale
  canvas.scale(1.5, 1.5);

  // Draw
  canvas.drawCircle(Offset.zero, 20, Paint()..color = Colors.blue);

  // Restore canvas state
  canvas.restore();
}
```

## Gradients

Use gradients in painting.

```dart
final gradient = LinearGradient(
  begin: Alignment.topLeft,
  end: Alignment.bottomRight,
  colors: [Colors.blue, Colors.purple],
);

final paint = Paint()
  ..shader = gradient.createShader(
    Rect.fromLTWH(0, 0, size.width, size.height),
  );

canvas.drawRect(
  Rect.fromLTWH(0, 0, size.width, size.height),
  paint,
);
```

## Key Points

- Extend `CustomPainter` to create custom drawings
- Implement `paint()` method for drawing logic
- Implement `shouldRepaint()` for performance optimization
- Use `Canvas` for drawing operations
- Use `Paint` to configure drawing style
- Use `Path` for complex shapes
- Apply transformations with `save()` and `restore()`
- Use gradients via `Paint.shader`
- Return `true` in `shouldRepaint()` when repaint is needed

<!--
Source references:
- https://github.com/flutter/flutter/tree/main/packages/flutter/lib/src/rendering/custom_paint.dart
- https://docs.flutter.dev/development/ui/advanced/custom-paint
-->

---
name: widgets-text
description: Flutter Text widget, TextStyle, RichText, TextSpan, and text styling
---

# Text Widgets

Flutter provides powerful text widgets for displaying and styling text in your app.

## Text Widget

Basic text display widget.

```dart
Text(
  'Hello, Flutter!',
  style: TextStyle(
    fontSize: 24,
    fontWeight: FontWeight.bold,
    color: Colors.blue,
  ),
)
```

## TextStyle

Configure text appearance with `TextStyle`.

```dart
TextStyle(
  fontSize: 16,
  fontWeight: FontWeight.w500, // w100-w900, normal, bold
  fontStyle: FontStyle.italic, // normal, italic
  color: Colors.black87,
  letterSpacing: 1.2,
  wordSpacing: 2.0,
  height: 1.5, // Line height multiplier
  decoration: TextDecoration.underline, // none, underline, overline, lineThrough
  decorationColor: Colors.red,
  decorationStyle: TextDecorationStyle.solid, // solid, double, dotted, dashed, wavy
  backgroundColor: Colors.yellow,
  shadows: [
    Shadow(
      color: Colors.black26,
      offset: const Offset(2, 2),
      blurRadius: 4,
    ),
  ],
)
```

## RichText

Display text with multiple styles using `TextSpan`.

```dart
RichText(
  text: TextSpan(
    style: DefaultTextStyle.of(context).style,
    children: <TextSpan>[
      const TextSpan(
        text: 'Hello ',
        style: TextStyle(color: Colors.black),
      ),
      TextSpan(
        text: 'Flutter',
        style: TextStyle(
          color: Colors.blue,
          fontWeight: FontWeight.bold,
        ),
        recognizer: TapGestureRecognizer()
          ..onTap = () {
            // Handle tap
          },
      ),
      const TextSpan(
        text: '!',
        style: TextStyle(color: Colors.black),
      ),
    ],
  ),
)
```

## Text Properties

```dart
Text(
  'Hello, Flutter!',
  textAlign: TextAlign.center, // left, right, center, justify, start, end
  textDirection: TextDirection.ltr, // ltr, rtl
  overflow: TextOverflow.ellipsis, // clip, fade, ellipsis, visible
  maxLines: 2,
  textScaleFactor: 1.2, // Scale text size
  softWrap: true, // Whether to break text at soft line breaks
  textWidthBasis: TextWidthBasis.parent, // parent, longestLine
  selectionColor: Colors.blue, // Color for selected text
)
```

## TextTheme

Use theme text styles for consistent typography.

```dart
Text(
  'Headline',
  style: Theme.of(context).textTheme.headlineLarge,
)

// Available text styles:
// displayLarge, displayMedium, displaySmall
// headlineLarge, headlineMedium, headlineSmall
// titleLarge, titleMedium, titleSmall
// bodyLarge, bodyMedium, bodySmall
// labelLarge, labelMedium, labelSmall
```

## SelectableText

Make text selectable.

```dart
SelectableText(
  'This text can be selected',
  style: const TextStyle(fontSize: 16),
  onTap: () {
    // Handle tap
  },
)
```

## TextField

Single-line text input.

```dart
TextField(
  decoration: const InputDecoration(
    labelText: 'Enter text',
    hintText: 'Hint text',
    border: OutlineInputBorder(),
  ),
  onChanged: (value) {
    // Handle text change
  },
)
```

## TextFormField

Text input with validation.

```dart
TextFormField(
  decoration: const InputDecoration(
    labelText: 'Email',
    border: OutlineInputBorder(),
  ),
  validator: (value) {
    if (value == null || value.isEmpty) {
      return 'Please enter email';
    }
    if (!value.contains('@')) {
      return 'Please enter valid email';
    }
    return null;
  },
)
```

## Key Points

- Use `Text` for simple text display
- Use `TextStyle` to customize text appearance
- Use `RichText` with `TextSpan` for multi-style text
- Use `TextTheme` for consistent typography
- Use `SelectableText` for selectable text
- Use `TextField` for single-line input
- Use `TextFormField` for validated input
- Configure `overflow` and `maxLines` for text that might not fit

<!--
Source references:
- https://github.com/flutter/flutter/tree/main/packages/flutter/lib/src/widgets/text.dart
- https://docs.flutter.dev/development/ui/widgets/text
-->

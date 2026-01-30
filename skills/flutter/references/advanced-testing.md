---
name: advanced-testing
description: Flutter testing - widget testing, integration testing, test utilities, and testing best practices
---

# Testing

Flutter provides comprehensive testing tools for unit, widget, and integration tests.

## Widget Testing

Test individual widgets in isolation.

```dart
import 'package:flutter_test/flutter_test.dart';

void main() {
  testWidgets('Counter increments when button is pressed', (WidgetTester tester) async {
    // Build widget
    await tester.pumpWidget(const MyApp());

    // Find widget
    expect(find.text('0'), findsOneWidget);
    expect(find.text('1'), findsNothing);

    // Tap button
    await tester.tap(find.byType(ElevatedButton));
    await tester.pump();

    // Verify result
    expect(find.text('0'), findsNothing);
    expect(find.text('1'), findsOneWidget);
  });
}
```

## Finding Widgets

```dart
// Find by text
find.text('Hello')
find.textContaining('Hello')

// Find by type
find.byType(ElevatedButton)
find.byType(Text)

// Find by key
find.byKey(Key('my-key'))

// Find by icon
find.byIcon(Icons.star)

// Find by widget
find.byWidget(myWidget)

// Find ancestors/descendants
find.ancestor(of: find.text('Hello'), matching: find.byType(Container))
find.descendant(of: find.byType(Column), matching: find.text('Hello'))
```

## Widget Tester Methods

```dart
// Pump widget
await tester.pumpWidget(MyWidget());

// Pump frames
await tester.pump(); // One frame
await tester.pump(Duration(seconds: 1)); // Multiple frames

// Tap
await tester.tap(find.byType(ElevatedButton));
await tester.tapAt(Offset(100, 100));

// Drag
await tester.drag(find.byType(ListView), Offset(0, -100));

// Enter text
await tester.enterText(find.byType(TextField), 'Hello');

// Long press
await tester.longPress(find.byType(ElevatedButton));

// Fling
await tester.fling(find.byType(ListView), Offset(0, -100), 1000);
```

## Expectations

```dart
// Find widgets
expect(find.text('Hello'), findsOneWidget);
expect(find.text('Hello'), findsNothing);
expect(find.text('Hello'), findsWidgets);
expect(find.text('Hello'), findsNWidgets(2));

// Widget properties
final widget = tester.widget<Text>(find.text('Hello'));
expect(widget.style?.fontSize, 16);

// Widget exists
expect(find.byType(ElevatedButton), findsOneWidget);
```

## Integration Testing

Test complete app flows.

```dart
import 'package:flutter_test/flutter_test.dart';
import 'package:integration_test/integration_test.dart';

void main() {
  IntegrationTestWidgetsFlutterBinding.ensureInitialized();

  testWidgets('Complete user flow', (WidgetTester tester) async {
    // Start app
    await tester.pumpWidget(const MyApp());
    await tester.pumpAndSettle();

    // Navigate
    await tester.tap(find.text('Login'));
    await tester.pumpAndSettle();

    // Enter credentials
    await tester.enterText(find.byKey(Key('email')), 'user@example.com');
    await tester.enterText(find.byKey(Key('password')), 'password');
    await tester.tap(find.text('Submit'));
    await tester.pumpAndSettle();

    // Verify navigation
    expect(find.text('Dashboard'), findsOneWidget);
  });
}
```

## Mocking

Mock dependencies for testing.

```dart
// Mock HTTP client
class MockHttpClient extends Mock implements http.Client {}

void main() {
  testWidgets('Loads data from API', (WidgetTester tester) async {
    final mockClient = MockHttpClient();
    
    when(mockClient.get(any)).thenAnswer(
      (_) async => http.Response('{"data": "test"}', 200),
    );

    await tester.pumpWidget(
      MyApp(httpClient: mockClient),
    );
    
    await tester.pumpAndSettle();
    
    expect(find.text('test'), findsOneWidget);
  });
}
```

## Golden Tests

Test widget appearance.

```dart
testWidgets('Widget appearance', (WidgetTester tester) async {
  await tester.pumpWidget(const MyWidget());
  
  await expectLater(
    find.byType(MyWidget),
    matchesGoldenFile('golden/my_widget.png'),
  );
});
```

## Key Points

- Use `testWidgets()` for widget tests
- Use `find` to locate widgets
- Use `tester.pumpWidget()` to build widgets
- Use `tester.pump()` to advance frames
- Use `expect()` with `findsOneWidget`, `findsNothing`, etc.
- Use `IntegrationTestWidgetsFlutterBinding` for integration tests
- Mock dependencies for isolated testing
- Use golden tests for visual regression testing
- Use `pumpAndSettle()` to wait for animations to complete

<!--
Source references:
- https://github.com/flutter/flutter/tree/main/packages/flutter_test
- https://docs.flutter.dev/testing
-->

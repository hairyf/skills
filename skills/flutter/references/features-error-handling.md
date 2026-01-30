---
name: features-error-handling
description: Flutter error handling - try-catch, error widgets, error boundaries, and error management patterns
---

# Error Handling

Proper error handling improves app stability and user experience.

## Try-Catch

Handle errors in async operations.

```dart
Future<void> loadData() async {
  try {
    final data = await fetchData();
    setState(() {
      _data = data;
    });
  } on TimeoutException {
    // Handle timeout
    showError('Request timeout');
  } on SocketException {
    // Handle network error
    showError('No internet connection');
  } catch (e) {
    // Handle other errors
    showError('Error: $e');
  }
}
```

## Error Widgets

Display errors in UI.

```dart
FutureBuilder<String>(
  future: fetchData(),
  builder: (context, snapshot) {
    if (snapshot.hasError) {
      return ErrorWidget(snapshot.error!);
    }
    
    if (snapshot.hasData) {
      return Text(snapshot.data!);
    }
    
    return CircularProgressIndicator();
  },
)
```

## Custom Error Widget

```dart
class CustomErrorWidget extends StatelessWidget {
  final String message;
  final VoidCallback? onRetry;

  const CustomErrorWidget({
    super.key,
    required this.message,
    this.onRetry,
  });

  @override
  Widget build(BuildContext context) {
    return Center(
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          const Icon(Icons.error, size: 48, color: Colors.red),
          const SizedBox(height: 16),
          Text(message),
          if (onRetry != null) ...[
            const SizedBox(height: 16),
            ElevatedButton(
              onPressed: onRetry,
              child: const Text('Retry'),
            ),
          ],
        ],
      ),
    );
  }
}
```

## Error Boundaries

Catch errors in widget tree.

```dart
class ErrorBoundary extends StatefulWidget {
  final Widget child;
  final Widget Function(BuildContext, Object)? errorBuilder;

  const ErrorBoundary({
    super.key,
    required this.child,
    this.errorBuilder,
  });

  @override
  State<ErrorBoundary> createState() => _ErrorBoundaryState();
}

class _ErrorBoundaryState extends State<ErrorBoundary> {
  Object? _error;

  @override
  void didCatchError(Object error, StackTrace stackTrace) {
    setState(() {
      _error = error;
    });
  }

  @override
  Widget build(BuildContext context) {
    if (_error != null) {
      return widget.errorBuilder?.call(context, _error!) ??
          ErrorWidget(_error!);
    }
    return widget.child;
  }
}
```

## Global Error Handler

Handle errors globally.

```dart
void main() {
  FlutterError.onError = (FlutterErrorDetails details) {
    FlutterError.presentError(details);
    // Log to crash reporting service
    logError(details.exception, details.stack);
  };

  runApp(MyApp());
}

void logError(Object error, StackTrace? stack) {
  // Send to crash reporting service
  print('Error: $error');
  print('Stack: $stack');
}
```

## Async Error Handling

```dart
Future<void> safeAsyncOperation() async {
  try {
    await riskyOperation();
  } catch (e, stackTrace) {
    // Handle error
    print('Error: $e');
    print('Stack: $stackTrace');
    
    // Show user-friendly message
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(content: Text('An error occurred')),
    );
  }
}
```

## Error Types

```dart
try {
  // Operation
} on FormatException {
  // Handle format error
} on RangeError {
  // Handle range error
} on TypeError {
  // Handle type error
} on Exception catch (e) {
  // Handle general exception
} catch (e, stackTrace) {
  // Handle any error
}
```

## Key Points

- Use `try-catch` for error handling
- Handle specific error types with `on`
- Use `ErrorWidget` to display errors
- Create custom error widgets for better UX
- Implement error boundaries for widget trees
- Set up global error handlers
- Log errors for debugging
- Show user-friendly error messages
- Provide retry mechanisms when appropriate

<!--
Source references:
- https://docs.flutter.dev/testing/errors
- https://docs.flutter.dev/development/tools/hot-reload#error-handling
-->

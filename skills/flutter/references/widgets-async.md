---
name: widgets-async
description: Flutter async widgets - FutureBuilder, StreamBuilder, and handling asynchronous operations
---

# Async Widgets

Flutter provides widgets for building UIs based on asynchronous data.

## FutureBuilder

Build widgets based on Future completion.

```dart
FutureBuilder<String>(
  future: fetchData(),
  builder: (context, snapshot) {
    if (snapshot.connectionState == ConnectionState.waiting) {
      return const CircularProgressIndicator();
    }
    
    if (snapshot.hasError) {
      return Text('Error: ${snapshot.error}');
    }
    
    if (snapshot.hasData) {
      return Text('Data: ${snapshot.data}');
    }
    
    return const Text('No data');
  },
)
```

## FutureBuilder States

```dart
FutureBuilder<String>(
  future: fetchData(),
  builder: (context, snapshot) {
    switch (snapshot.connectionState) {
      case ConnectionState.none:
        return const Text('Not started');
      
      case ConnectionState.waiting:
        return const CircularProgressIndicator();
      
      case ConnectionState.active:
        return const Text('Loading...');
      
      case ConnectionState.done:
        if (snapshot.hasError) {
          return Text('Error: ${snapshot.error}');
        }
        return Text('Data: ${snapshot.data}');
    }
  },
)
```

## StreamBuilder

Build widgets based on Stream events.

```dart
StreamBuilder<int>(
  stream: counterStream(),
  initialData: 0,
  builder: (context, snapshot) {
    if (snapshot.hasError) {
      return Text('Error: ${snapshot.error}');
    }
    
    return Text('Count: ${snapshot.data}');
  },
)
```

## StreamBuilder with ConnectionState

```dart
StreamBuilder<String>(
  stream: dataStream(),
  builder: (context, snapshot) {
    if (snapshot.connectionState == ConnectionState.waiting) {
      return const CircularProgressIndicator();
    }
    
    if (snapshot.hasError) {
      return Text('Error: ${snapshot.error}');
    }
    
    if (!snapshot.hasData) {
      return const Text('No data');
    }
    
    return Text('Data: ${snapshot.data}');
  },
)
```

## Complete Example

```dart
class DataWidget extends StatelessWidget {
  const DataWidget({super.key});

  Future<String> fetchData() async {
    await Future.delayed(const Duration(seconds: 2));
    return 'Data loaded';
  }

  @override
  Widget build(BuildContext context) {
    return FutureBuilder<String>(
      future: fetchData(),
      builder: (context, snapshot) {
        if (snapshot.connectionState == ConnectionState.waiting) {
          return const Scaffold(
            body: Center(child: CircularProgressIndicator()),
          );
        }
        
        if (snapshot.hasError) {
          return Scaffold(
            appBar: AppBar(title: const Text('Error')),
            body: Center(
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  const Icon(Icons.error, size: 48, color: Colors.red),
                  const SizedBox(height: 16),
                  Text('Error: ${snapshot.error}'),
                  ElevatedButton(
                    onPressed: () {
                      // Retry
                    },
                    child: const Text('Retry'),
                  ),
                ],
              ),
            ),
          );
        }
        
        return Scaffold(
          appBar: AppBar(title: const Text('Data')),
          body: Center(
            child: Text('Data: ${snapshot.data}'),
          ),
        );
      },
    );
  }
}
```

## StreamBuilder with List

```dart
StreamBuilder<List<String>>(
  stream: itemsStream(),
  builder: (context, snapshot) {
    if (!snapshot.hasData) {
      return const CircularProgressIndicator();
    }
    
    final items = snapshot.data!;
    
    return ListView.builder(
      itemCount: items.length,
      itemBuilder: (context, index) {
        return ListTile(title: Text(items[index]));
      },
    );
  },
)
```

## Key Points

- Use `FutureBuilder` for one-time async operations
- Use `StreamBuilder` for continuous data streams
- Check `connectionState` to handle loading states
- Use `hasError` to check for errors
- Use `hasData` to check if data is available
- Provide `initialData` for StreamBuilder when needed
- Handle all connection states for better UX
- Use `snapshot.data` to access the result
- Use `snapshot.error` to access errors

<!--
Source references:
- https://github.com/flutter/flutter/tree/main/packages/flutter/lib/src/widgets/async.dart
- https://docs.flutter.dev/development/ui/interactive#handling-gestures
-->

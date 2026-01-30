---
name: features-http
description: Flutter HTTP and networking - http package, API calls, JSON parsing, and network requests
---

# HTTP and Networking

Flutter provides ways to make HTTP requests and handle network data.

## HTTP Package

Add http package to `pubspec.yaml`.

```yaml
dependencies:
  http: ^1.1.0
```

## GET Request

```dart
import 'package:http/http.dart' as http;
import 'dart:convert';

Future<Map<String, dynamic>> fetchData() async {
  final response = await http.get(
    Uri.parse('https://api.example.com/data'),
  );
  
  if (response.statusCode == 200) {
    return jsonDecode(response.body) as Map<String, dynamic>;
  } else {
    throw Exception('Failed to load data');
  }
}
```

## POST Request

```dart
Future<Map<String, dynamic>> postData(Map<String, dynamic> data) async {
  final response = await http.post(
    Uri.parse('https://api.example.com/data'),
    headers: {'Content-Type': 'application/json'},
    body: jsonEncode(data),
  );
  
  if (response.statusCode == 200 || response.statusCode == 201) {
    return jsonDecode(response.body) as Map<String, dynamic>;
  } else {
    throw Exception('Failed to post data');
  }
}
```

## Request with Headers

```dart
Future<Map<String, dynamic>> fetchWithAuth() async {
  final response = await http.get(
    Uri.parse('https://api.example.com/data'),
    headers: {
      'Authorization': 'Bearer $token',
      'Content-Type': 'application/json',
    },
  );
  
  return jsonDecode(response.body) as Map<String, dynamic>;
}
```

## Error Handling

```dart
Future<Map<String, dynamic>?> fetchDataSafely() async {
  try {
    final response = await http.get(
      Uri.parse('https://api.example.com/data'),
    ).timeout(const Duration(seconds: 5));
    
    if (response.statusCode == 200) {
      return jsonDecode(response.body) as Map<String, dynamic>;
    } else {
      print('Error: ${response.statusCode}');
      return null;
    }
  } on TimeoutException {
    print('Request timeout');
    return null;
  } on SocketException {
    print('No internet connection');
    return null;
  } catch (e) {
    print('Error: $e');
    return null;
  }
}
```

## Using with FutureBuilder

```dart
FutureBuilder<Map<String, dynamic>>(
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

## HTTP Client

Create reusable HTTP client.

```dart
import 'package:http/http.dart' as http;

class ApiClient {
  final String baseUrl;
  final Map<String, String> defaultHeaders;

  ApiClient({
    required this.baseUrl,
    this.defaultHeaders = const {},
  });

  Future<Map<String, dynamic>> get(String endpoint) async {
    final response = await http.get(
      Uri.parse('$baseUrl$endpoint'),
      headers: defaultHeaders,
    );
    
    return jsonDecode(response.body) as Map<String, dynamic>;
  }

  Future<Map<String, dynamic>> post(String endpoint, Map<String, dynamic> data) async {
    final response = await http.post(
      Uri.parse('$baseUrl$endpoint'),
      headers: {
        ...defaultHeaders,
        'Content-Type': 'application/json',
      },
      body: jsonEncode(data),
    );
    
    return jsonDecode(response.body) as Map<String, dynamic>;
  }
}
```

## Key Points

- Use `http` package for HTTP requests
- Use `Uri.parse()` to create URIs
- Handle status codes appropriately
- Use `jsonEncode()` and `jsonDecode()` for JSON
- Add headers for authentication
- Handle errors and timeouts
- Use `FutureBuilder` to display async data
- Create reusable HTTP client classes

<!--
Source references:
- https://pub.dev/packages/http
- https://docs.flutter.dev/development/data-and-backend/networking
-->

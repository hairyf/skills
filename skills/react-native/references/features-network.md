---
name: react-native-network
description: Network requests with Fetch API. Use when making HTTP requests, fetching data from APIs, or handling network responses.
---

# Networking

React Native provides the Fetch API for making network requests. It's similar to the web Fetch API with some platform-specific considerations.

## Basic Fetch

```tsx
const fetchData = async () => {
  try {
    const response = await fetch('https://api.example.com/data');
    const json = await response.json();
    return json;
  } catch (error) {
    console.error('Network error:', error);
  }
};
```

## GET Request

```tsx
const getData = async () => {
  const response = await fetch('https://api.example.com/users');
  const data = await response.json();
  return data;
};
```

## POST Request

```tsx
const postData = async (userData) => {
  const response = await fetch('https://api.example.com/users', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer token',
    },
    body: JSON.stringify(userData),
  });
  
  const result = await response.json();
  return result;
};
```

## Request Options

```tsx
fetch(url, {
  method: 'GET',                    // 'GET' | 'POST' | 'PUT' | 'DELETE' | etc.
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer token',
    'Accept': 'application/json',
  },
  body: JSON.stringify(data),      // Request body
  cache: 'default',                 // 'default' | 'no-store' | 'reload' | etc.
  credentials: 'omit',              // 'omit' | 'include' | 'same-origin'
  redirect: 'follow',               // 'follow' | 'error' | 'manual'
  signal: abortController.signal,  // AbortSignal for cancellation
});
```

## Response Handling

```tsx
const handleResponse = async () => {
  const response = await fetch(url);
  
  // Check status
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  
  // Get response data
  const text = await response.text();
  const json = await response.json();
  const blob = await response.blob();
  
  // Response properties
  console.log(response.status);      // Status code
  console.log(response.statusText);   // Status text
  console.log(response.headers);     // Headers object
  console.log(response.ok);          // Boolean (200-299)
  console.log(response.type);        // Response type
  console.log(response.url);          // Final URL
};
```

## Error Handling

```tsx
const fetchWithErrorHandling = async () => {
  try {
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    if (error.name === 'TypeError') {
      // Network error (no internet, DNS failure, etc.)
      console.error('Network error:', error.message);
    } else {
      // HTTP error or other
      console.error('Request failed:', error.message);
    }
    throw error;
  }
};
```

## Request Cancellation

```tsx
import { useEffect, useRef } from 'react';

const useFetch = (url) => {
  const abortControllerRef = useRef(new AbortController());

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(url, {
          signal: abortControllerRef.current.signal,
        });
        const data = await response.json();
        return data;
      } catch (error) {
        if (error.name === 'AbortError') {
          console.log('Request cancelled');
        } else {
          throw error;
        }
      }
    };

    fetchData();

    // Cleanup: cancel request on unmount
    return () => {
      abortControllerRef.current.abort();
    };
  }, [url]);
};
```

## Common Patterns

### Fetch Hook

```tsx
import { useState, useEffect } from 'react';

const useFetch = (url) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await fetch(url);
        if (!response.ok) throw new Error('Network response was not ok');
        const json = await response.json();
        setData(json);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [url]);

  return { data, loading, error };
};
```

### POST with Form Data

```tsx
const uploadFile = async (file, formData) => {
  const data = new FormData();
  data.append('file', {
    uri: file.uri,
    type: file.type,
    name: file.name,
  });
  data.append('userId', formData.userId);

  const response = await fetch('https://api.example.com/upload', {
    method: 'POST',
    headers: {
      'Content-Type': 'multipart/form-data',
    },
    body: data,
  });

  return response.json();
};
```

### Retry Logic

```tsx
const fetchWithRetry = async (url, options = {}, retries = 3) => {
  for (let i = 0; i < retries; i++) {
    try {
      const response = await fetch(url, options);
      if (response.ok) return response;
      throw new Error(`HTTP ${response.status}`);
    } catch (error) {
      if (i === retries - 1) throw error;
      await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1)));
    }
  }
};
```

### Timeout

```tsx
const fetchWithTimeout = async (url, options = {}, timeout = 10000) => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
    });
    clearTimeout(timeoutId);
    return response;
  } catch (error) {
    clearTimeout(timeoutId);
    if (error.name === 'AbortError') {
      throw new Error('Request timeout');
    }
    throw error;
  }
};
```

## Best Practices

1. **Always handle errors** - Network requests can fail
2. **Check response.ok** - Not all HTTP errors throw exceptions
3. **Use AbortController** - Cancel requests on unmount or navigation
4. **Handle timeouts** - Set reasonable timeout values
5. **Parse JSON safely** - Handle invalid JSON responses
6. **Use proper headers** - Set Content-Type and Authorization
7. **Handle loading states** - Show loading indicators during requests
8. **Test offline scenarios** - Handle network unavailability
9. **Use HTTPS** - Always use secure connections in production

## Platform Considerations

- **Android**: May require network security config for HTTP (not HTTPS)
- **iOS**: Requires App Transport Security configuration for HTTP
- **Both**: Use HTTPS in production, handle network state changes

## Common Patterns

### API Client

```tsx
class ApiClient {
  private baseURL: string;
  private token: string | null = null;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
  }

  setToken(token: string) {
    this.token = token;
  }

  async request(endpoint: string, options: RequestInit = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const headers = {
      'Content-Type': 'application/json',
      ...(this.token && { Authorization: `Bearer ${this.token}` }),
      ...options.headers,
    };

    const response = await fetch(url, { ...options, headers });
    
    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`);
    }

    return response.json();
  }

  get(endpoint: string) {
    return this.request(endpoint, { method: 'GET' });
  }

  post(endpoint: string, data: any) {
    return this.request(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }
}
```

<!--
Source references:
- https://reactnative.dev/docs/network
- https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API
-->

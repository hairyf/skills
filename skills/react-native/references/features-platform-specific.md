---
name: react-native-platform-specific
description: Platform-specific components and APIs - Android (PermissionsAndroid, ToastAndroid, DrawerLayoutAndroid) and iOS (ActionSheetIOS). Use when implementing platform-specific features or native UI patterns.
---

# Platform-Specific Components and APIs

React Native provides platform-specific components and APIs for Android and iOS native features.

## Android APIs

### PermissionsAndroid

Request Android runtime permissions (API 23+).

```tsx
import { PermissionsAndroid, Platform, Alert } from 'react-native';

const requestCameraPermission = async () => {
  if (Platform.OS !== 'android') {
    return true;
  }

  try {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.CAMERA,
      {
        title: 'Camera Permission',
        message: 'App needs access to your camera',
        buttonNeutral: 'Ask Me Later',
        buttonNegative: 'Cancel',
        buttonPositive: 'OK',
      }
    );

    if (granted === PermissionsAndroid.RESULTS.GRANTED) {
      console.log('Permission granted');
      return true;
    } else {
      console.log('Permission denied');
      return false;
    }
  } catch (err) {
    console.warn(err);
    return false;
  }
};
```

### Check Permission

```tsx
const checkPermission = async (permission) => {
  if (Platform.OS !== 'android') {
    return true;
  }

  const result = await PermissionsAndroid.check(permission);
  return result;
};
```

### Request Multiple Permissions

```tsx
const requestMultiplePermissions = async () => {
  const permissions = [
    PermissionsAndroid.PERMISSIONS.CAMERA,
    PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
  ];

  const results = await PermissionsAndroid.requestMultiple(permissions);

  if (results[PermissionsAndroid.PERMISSIONS.CAMERA] === 
      PermissionsAndroid.RESULTS.GRANTED) {
    // Camera permission granted
  }
};
```

### Available Permissions

```tsx
PermissionsAndroid.PERMISSIONS.CAMERA
PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE
PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE
PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION
PermissionsAndroid.PERMISSIONS.RECORD_AUDIO
PermissionsAndroid.PERMISSIONS.READ_CONTACTS
PermissionsAndroid.PERMISSIONS.WRITE_CONTACTS
// ... and more
```

### Permission Results

```tsx
PermissionsAndroid.RESULTS.GRANTED    // Permission granted
PermissionsAndroid.RESULTS.DENIED     // Permission denied
PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN // User selected "Don't ask again"
```

### ToastAndroid

Display Android Toast messages.

```tsx
import { ToastAndroid, Platform } from 'react-native';

if (Platform.OS === 'android') {
  // Simple toast
  ToastAndroid.show('Message', ToastAndroid.SHORT);
  ToastAndroid.show('Message', ToastAndroid.LONG);

  // Toast with gravity
  ToastAndroid.showWithGravity(
    'Message',
    ToastAndroid.SHORT,
    ToastAndroid.CENTER
  );

  // Toast with gravity and offset
  ToastAndroid.showWithGravityAndOffset(
    'Message',
    ToastAndroid.SHORT,
    ToastAndroid.BOTTOM,
    25,  // xOffset
    50   // yOffset
  );
}
```

### ToastAndroid Constants

```tsx
ToastAndroid.SHORT  // ~2 seconds
ToastAndroid.LONG    // ~3.5 seconds

ToastAndroid.TOP
ToastAndroid.BOTTOM
ToastAndroid.CENTER
```

### DrawerLayoutAndroid

Android drawer navigation component.

```tsx
import { useRef } from 'react';
import { DrawerLayoutAndroid, View, Text } from 'react-native';

const App = () => {
  const drawerRef = useRef<DrawerLayoutAndroid>(null);

  const navigationView = () => (
    <View>
      <Text>Navigation Content</Text>
    </View>
  );

  return (
    <DrawerLayoutAndroid
      ref={drawerRef}
      drawerWidth={300}
      drawerPosition="left"
      renderNavigationView={navigationView}
    >
      <View>
        <Text>Main Content</Text>
      </View>
    </DrawerLayoutAndroid>
  );
};
```

### DrawerLayoutAndroid Methods

```tsx
// Open drawer
drawerRef.current?.openDrawer();

// Close drawer
drawerRef.current?.closeDrawer();

// Check if drawer is open
const isOpen = drawerRef.current?.isDrawerOpen();
```

### DrawerLayoutAndroid Props

```tsx
<DrawerLayoutAndroid
  drawerWidth={300}
  drawerPosition="left"  // 'left' | 'right'
  renderNavigationView={() => <NavigationView />}
  onDrawerOpen={() => {}}
  onDrawerClose={() => {}}
  drawerBackgroundColor="#fff"
  drawerLockMode="unlocked"  // 'unlocked' | 'locked-closed' | 'locked-open'
  keyboardDismissMode="on-drag"  // 'none' | 'on-drag'
  statusBarBackgroundColor="#000"
/>
```

## iOS APIs

### ActionSheetIOS

Display iOS action sheet.

```tsx
import { ActionSheetIOS, Platform } from 'react-native';

if (Platform.OS === 'ios') {
  ActionSheetIOS.showActionSheetWithOptions(
    {
      options: ['Cancel', 'Option 1', 'Option 2', 'Delete'],
      destructiveButtonIndex: 3,
      cancelButtonIndex: 0,
      title: 'Choose an option',
      message: 'Select an action',
      userInterfaceStyle: 'light', // 'light' | 'dark' | 'automatic'
    },
    (buttonIndex) => {
      if (buttonIndex === 0) {
        // Cancel
      } else if (buttonIndex === 1) {
        // Option 1
      } else if (buttonIndex === 2) {
        // Option 2
      } else if (buttonIndex === 3) {
        // Delete (destructive)
      }
    }
  );
}
```

### ActionSheetIOS Options

```tsx
{
  options: string[],              // Button titles (required)
  cancelButtonIndex?: number,     // Index of cancel button
  destructiveButtonIndex?: number | number[], // Indices of destructive buttons
  title?: string,                 // Title above action sheet
  message?: string,               // Message below title
  anchor?: number,                // iPad anchor point
  tintColor?: string,             // Button text color
  cancelButtonTintColor?: string, // Cancel button color
  userInterfaceStyle?: 'light' | 'dark' | 'automatic',
  disabledButtonIndices?: number[], // Disabled button indices
}
```

### Share Sheet (iOS)

```tsx
ActionSheetIOS.showShareActionSheetWithOptions(
  {
    message: 'Share this',
    url: 'https://example.com',
    subject: 'Subject',
  },
  (error) => {
    // Error callback
  },
  (success, method) => {
    // Success callback
  }
);
```

## Common Patterns

### Platform-Specific Permission Request

```tsx
const requestPermission = async () => {
  if (Platform.OS === 'android') {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.CAMERA
    );
    return granted === PermissionsAndroid.RESULTS.GRANTED;
  } else {
    // iOS permissions handled differently
    return true;
  }
};
```

### Cross-Platform Toast/Alert

```tsx
import { Platform, Alert, ToastAndroid } from 'react-native';

const showMessage = (message: string) => {
  if (Platform.OS === 'android') {
    ToastAndroid.show(message, ToastAndroid.SHORT);
  } else {
    Alert.alert('', message);
  }
};
```

### Permission Hook

```tsx
const usePermission = (permission: string) => {
  const [granted, setGranted] = useState(false);

  const request = async () => {
    if (Platform.OS !== 'android') {
      setGranted(true);
      return;
    }

    const result = await PermissionsAndroid.request(permission);
    setGranted(result === PermissionsAndroid.RESULTS.GRANTED);
  };

  useEffect(() => {
    if (Platform.OS === 'android') {
      PermissionsAndroid.check(permission).then(setGranted);
    } else {
      setGranted(true);
    }
  }, [permission]);

  return { granted, request };
};
```

## Best Practices

1. **Check platform** - Always check `Platform.OS` before using platform-specific APIs
2. **Handle permissions** - Request permissions before accessing device features
3. **Provide rationale** - Explain why permissions are needed
4. **Handle denial** - Gracefully handle permission denial
5. **Use cross-platform alternatives** - Prefer cross-platform solutions when possible
6. **Test on both platforms** - Platform-specific code needs platform-specific testing

## Common Patterns

### Permission Request with Rationale

```tsx
const requestWithRationale = async (permission: string) => {
  const hasPermission = await PermissionsAndroid.check(permission);
  
  if (hasPermission) {
    return true;
  }

  const shouldShowRationale = await PermissionsAndroid.shouldShowRequestPermissionRationale(
    permission
  );

  if (shouldShowRationale) {
    Alert.alert(
      'Permission Needed',
      'This app needs this permission to function properly.',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'OK', onPress: () => requestPermission(permission) },
      ]
    );
  } else {
    return requestPermission(permission);
  }
};
```

### Action Sheet with Confirmation

```tsx
const showDeleteConfirmation = () => {
  if (Platform.OS === 'ios') {
    ActionSheetIOS.showActionSheetWithOptions(
      {
        options: ['Cancel', 'Delete'],
        destructiveButtonIndex: 1,
        cancelButtonIndex: 0,
      },
      (buttonIndex) => {
        if (buttonIndex === 1) {
          handleDelete();
        }
      }
    );
  } else {
    Alert.alert('Delete', 'Are you sure?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: handleDelete },
    ]);
  }
};
```

<!--
Source references:
- https://reactnative.dev/docs/permissionsandroid
- https://reactnative.dev/docs/toastandroid
- https://reactnative.dev/docs/drawerlayoutandroid
- https://reactnative.dev/docs/actionsheetios
-->

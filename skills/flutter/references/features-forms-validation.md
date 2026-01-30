---
name: features-forms-validation
description: Flutter form validation - Form, FormField, validators, and form handling patterns
---

# Form Validation

Flutter provides comprehensive form validation capabilities.

## Basic Form

```dart
final _formKey = GlobalKey<FormState>();

Form(
  key: _formKey,
  child: Column(
    children: [
      TextFormField(
        decoration: const InputDecoration(labelText: 'Email'),
        validator: (value) {
          if (value == null || value.isEmpty) {
            return 'Please enter email';
          }
          return null;
        },
      ),
      ElevatedButton(
        onPressed: () {
          if (_formKey.currentState!.validate()) {
            // Form is valid
          }
        },
        child: const Text('Submit'),
      ),
    ],
  ),
)
```

## Email Validation

```dart
TextFormField(
  decoration: const InputDecoration(labelText: 'Email'),
  keyboardType: TextInputType.emailAddress,
  validator: (value) {
    if (value == null || value.isEmpty) {
      return 'Please enter email';
    }
    if (!RegExp(r'^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$').hasMatch(value)) {
      return 'Please enter valid email';
    }
    return null;
  },
)
```

## Password Validation

```dart
TextFormField(
  decoration: const InputDecoration(labelText: 'Password'),
  obscureText: true,
  validator: (value) {
    if (value == null || value.isEmpty) {
      return 'Please enter password';
    }
    if (value.length < 8) {
      return 'Password must be at least 8 characters';
    }
    if (!RegExp(r'[A-Z]').hasMatch(value)) {
      return 'Password must contain uppercase letter';
    }
    if (!RegExp(r'[0-9]').hasMatch(value)) {
      return 'Password must contain number';
    }
    return null;
  },
)
```

## Custom Validator

```dart
String? validatePhone(String? value) {
  if (value == null || value.isEmpty) {
    return 'Please enter phone number';
  }
  if (!RegExp(r'^\+?[1-9]\d{1,14}$').hasMatch(value)) {
    return 'Please enter valid phone number';
  }
  return null;
}

// Usage
TextFormField(
  decoration: const InputDecoration(labelText: 'Phone'),
  validator: validatePhone,
)
```

## FormField

Custom form field with validation.

```dart
FormField<String>(
  validator: (value) {
    if (value == null || value.isEmpty) {
      return 'Please enter value';
    }
    return null;
  },
  builder: (field) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        TextField(
          onChanged: field.didChange,
          decoration: InputDecoration(
            labelText: 'Custom Field',
            errorText: field.errorText,
          ),
        ),
      ],
    );
  },
)
```

## Autovalidate Mode

```dart
Form(
  autovalidateMode: AutovalidateMode.onUserInteraction,
  child: TextFormField(
    validator: (value) {
      if (value == null || value.isEmpty) {
        return 'Required';
      }
      return null;
    },
  ),
)
```

## Form State

```dart
final _formKey = GlobalKey<FormState>();

// Validate form
if (_formKey.currentState!.validate()) {
  // Form is valid
}

// Save form
_formKey.currentState!.save();

// Reset form
_formKey.currentState!.reset();
```

## Multiple Fields

```dart
final _formKey = GlobalKey<FormState>();
final _emailController = TextEditingController();
final _passwordController = TextEditingController();

Form(
  key: _formKey,
  child: Column(
    children: [
      TextFormField(
        controller: _emailController,
        decoration: const InputDecoration(labelText: 'Email'),
        validator: (value) {
          if (value == null || value.isEmpty) {
            return 'Required';
          }
          return null;
        },
      ),
      TextFormField(
        controller: _passwordController,
        decoration: const InputDecoration(labelText: 'Password'),
        obscureText: true,
        validator: (value) {
          if (value == null || value.isEmpty) {
            return 'Required';
          }
          return null;
        },
      ),
      ElevatedButton(
        onPressed: () {
          if (_formKey.currentState!.validate()) {
            final email = _emailController.text;
            final password = _passwordController.text;
            // Process form
          }
        },
        child: const Text('Submit'),
      ),
    ],
  ),
)
```

## Key Points

- Use `Form` widget to wrap form fields
- Use `GlobalKey<FormState>` to access form state
- Use `validator` function for field validation
- Return `null` for valid values, error string for invalid
- Use `validate()` to check form validity
- Use `save()` to save form values
- Use `reset()` to reset form
- Set `autovalidateMode` for real-time validation
- Use regex patterns for complex validation

<!--
Source references:
- https://github.com/flutter/flutter/tree/main/packages/flutter/lib/src/widgets/form.dart
- https://docs.flutter.dev/development/ui/widgets/material#Input%20and%20selections
-->

---
name: widgets-input
description: Flutter input widgets - TextField, TextFormField, Form, FormField, and input validation
---

# Input Widgets

Flutter provides text input widgets with validation and form handling.

## TextField

Single-line text input.

```dart
TextField(
  decoration: const InputDecoration(
    labelText: 'Label',
    hintText: 'Hint text',
    border: OutlineInputBorder(),
    prefixIcon: Icon(Icons.person),
    suffixIcon: Icon(Icons.clear),
  ),
  keyboardType: TextInputType.emailAddress,
  textInputAction: TextInputAction.next,
  onChanged: (value) {
    // Handle text change
  },
  onSubmitted: (value) {
    // Handle submit
  },
)
```

## TextFormField

Text input with validation.

```dart
final _formKey = GlobalKey<FormState>();
final _emailController = TextEditingController();

Form(
  key: _formKey,
  child: TextFormField(
    controller: _emailController,
    decoration: const InputDecoration(
      labelText: 'Email',
      border: OutlineInputBorder(),
    ),
    keyboardType: TextInputType.emailAddress,
    validator: (value) {
      if (value == null || value.isEmpty) {
        return 'Please enter email';
      }
      if (!value.contains('@')) {
        return 'Please enter valid email';
      }
      return null;
    },
    onSaved: (value) {
      // Save value
    },
  ),
)

// Validate form
if (_formKey.currentState!.validate()) {
  _formKey.currentState!.save();
  // Process form
}
```

## Form

Container for form fields with validation.

```dart
final _formKey = GlobalKey<FormState>();

Form(
  key: _formKey,
  autovalidateMode: AutovalidateMode.onUserInteraction,
  onChanged: () {
    // Handle form change
  },
  child: Column(
    children: [
      TextFormField(...),
      TextFormField(...),
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

## InputDecoration

Customize input appearance.

```dart
InputDecoration(
  labelText: 'Label',
  labelStyle: const TextStyle(color: Colors.blue),
  hintText: 'Hint',
  helperText: 'Helper text',
  errorText: 'Error text',
  prefixIcon: const Icon(Icons.person),
  suffixIcon: IconButton(
    icon: const Icon(Icons.clear),
    onPressed: () {},
  ),
  border: OutlineInputBorder(
    borderRadius: BorderRadius.circular(8),
  ),
  enabledBorder: OutlineInputBorder(
    borderSide: const BorderSide(color: Colors.grey),
    borderRadius: BorderRadius.circular(8),
  ),
  focusedBorder: OutlineInputBorder(
    borderSide: const BorderSide(color: Colors.blue, width: 2),
    borderRadius: BorderRadius.circular(8),
  ),
  errorBorder: OutlineInputBorder(
    borderSide: const BorderSide(color: Colors.red),
    borderRadius: BorderRadius.circular(8),
  ),
  filled: true,
  fillColor: Colors.grey[100],
)
```

## TextEditingController

Control text field value programmatically.

```dart
final controller = TextEditingController(text: 'Initial value');

TextField(
  controller: controller,
)

// Update value
controller.text = 'New value';

// Listen to changes
controller.addListener(() {
  print('Text: ${controller.text}');
});

// Dispose controller
@override
void dispose() {
  controller.dispose();
  super.dispose();
}
```

## Input Types

```dart
// Email
keyboardType: TextInputType.emailAddress

// Number
keyboardType: TextInputType.number

// Phone
keyboardType: TextInputType.phone

// URL
keyboardType: TextInputType.url

// Multiline
maxLines: null,
keyboardType: TextInputType.multiline
```

## Key Points

- Use `TextField` for simple text input
- Use `TextFormField` for validated input
- Wrap fields in `Form` for form validation
- Use `TextEditingController` to control text value
- Customize appearance with `InputDecoration`
- Set `keyboardType` for appropriate keyboard
- Use `validator` for input validation
- Call `dispose()` on controllers to prevent memory leaks

<!--
Source references:
- https://github.com/flutter/flutter/tree/main/packages/flutter/lib/src/widgets/form.dart
- https://docs.flutter.dev/development/ui/widgets/material#Input%20and%20selections
-->

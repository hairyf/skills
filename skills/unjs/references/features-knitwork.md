---
name: knitwork
description: Utilities to generate JavaScript code
---

# Knitwork

Knitwork provides utilities for generating JavaScript code programmatically, useful for code generation tools and build-time transformations.

## Usage

### Generate Code

```typescript
import { generateCode } from 'knitwork'

const code = generateCode({
  type: 'export',
  name: 'config',
  value: {
    port: 3000,
    host: 'localhost',
  },
})
```

### Generate Functions

```typescript
import { generateFunction } from 'knitwork'

const fn = generateFunction('add', ['a', 'b'], 'return a + b')
// function add(a, b) { return a + b }
```

### Generate Imports

```typescript
import { generateImport } from 'knitwork'

const importCode = generateImport('vue', ['ref', 'computed'])
// import { ref, computed } from 'vue'
```

## Key Points

- Code generation: Programmatically generate JavaScript
- Type-safe: Full TypeScript support
- Flexible: Supports various code structures
- Formatting: Generates formatted code
- AST-based: Uses AST for code generation

<!--
Source references:
- https://github.com/unjs/knitwork
-->

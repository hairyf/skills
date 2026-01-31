---
name: knitwork-x
description: Utilities to generate safe JavaScript code
---

# Knitwork-X

Knitwork-X provides utilities for generating safe JavaScript code programmatically, useful for code generation tools and build-time transformations. This is an actively maintained fork of the original knitwork package.

## Usage

### ESM Exports

```typescript
import { genDefaultExport, genExport, genExportStar } from 'knitwork'

// Default export
genDefaultExport("foo")
// ~> `export default foo;`

// Named exports
genExport("pkg", ["a", "b"])
// ~> `export { a, b } from "pkg";`

// Re-export all
genExportStar("pkg")
// ~> `export * from "pkg";`
```

### ESM Imports

```typescript
import { genImport, genTypeImport } from 'knitwork'

// Default import
genImport("pkg", "foo")
// ~> `import foo from "pkg";`

// Named imports
genImport("pkg", ["a", "b"])
// ~> `import { a, b } from "pkg";`

// Type imports
genTypeImport("@nuxt/utils", ["test"])
// ~> `import type { test } from "@nuxt/utils";`
```

### Dynamic Imports

```typescript
import { genDynamicImport } from 'knitwork'

genDynamicImport("pkg")
// ~> `() => import("pkg")`

genDynamicImport("pkg", { wrapper: false })
// ~> `import("pkg")`

genDynamicImport("pkg", { interopDefault: true })
// ~> `() => import("pkg").then(m => m.default || m)`
```

### TypeScript Code Generation

```typescript
import { genFunction, genInterface, genTypeAlias, genVariable } from 'knitwork'

// Function declaration
genFunction({ name: "foo", parameters: [{ name: "x", type: "string" }] })
// ~> `function foo(x: string) {}`

// Interface
genInterface("FooInterface", { name: "string", count: "number" })
// ~> `interface FooInterface { name: string, count: number }`

// Type alias
genTypeAlias("Foo", "string")
// ~> `type Foo = string`

// Variable
genVariable("a", "2")
// ~> `const a = 2`
```

### String Utilities

```typescript
import { genString, genSafeVariableName, escapeString } from 'knitwork'

genString("foo")
// ~> `"foo"`

genSafeVariableName("for")
// ~> `_for`

escapeString("foo'bar")
// ~> `foo\'bar`
```

## Key Points

- Code generation: Programmatically generate JavaScript and TypeScript
- Type-safe: Full TypeScript support with type generation utilities
- Safe: Generates safe, properly escaped code
- Comprehensive: Supports ESM, TypeScript, strings, serialization, and more
- Actively maintained: Fork maintained at https://github.com/hairyf/knitwork-x

<!--
Source references:
- https://github.com/hairyf/knitwork-x
-->

---
name: module-reference
description: Accessing providers dynamically with ModuleRef
---

# Module Reference

`ModuleRef` provides methods to navigate the DI container and obtain references to providers dynamically.

## Basic Usage

Inject `ModuleRef` to access providers:

```typescript
import { Injectable, OnModuleInit } from '@nestjs/common';
import { ModuleRef } from '@nestjs/core';

@Injectable()
export class CatsService implements OnModuleInit {
  private service: Service;

  constructor(private moduleRef: ModuleRef) {}

  onModuleInit() {
    this.service = this.moduleRef.get(Service);
  }
}
```

## Retrieving Instances

### Static Instances (`get()`)

```typescript
// From current module
const service = this.moduleRef.get(Service);

// From global context (different module)
const service = this.moduleRef.get(Service, { strict: false });
```

### Scoped Providers (`resolve()`)

For transient or request-scoped providers:

```typescript
const transientService = await this.moduleRef.resolve(TransientService);
```

Each `resolve()` call returns a unique instance. To get the same instance, pass a context identifier:

```typescript
import { ContextIdFactory } from '@nestjs/core';

const contextId = ContextIdFactory.create();
const service1 = await this.moduleRef.resolve(TransientService, contextId);
const service2 = await this.moduleRef.resolve(TransientService, contextId);
// service1 === service2
```

## Request Context

Get the context ID from an existing request:

```typescript
@Injectable()
export class CatsService {
  constructor(
    @Inject(REQUEST) private request: Record<string, unknown>,
    private moduleRef: ModuleRef,
  ) {}

  async getRepository() {
    const contextId = ContextIdFactory.getByRequest(this.request);
    return this.moduleRef.resolve(CatsRepository, contextId);
  }
}
```

## Dynamic Instantiation

Create instances of classes not registered as providers:

```typescript
const factory = await this.moduleRef.create(CatsFactory);
```

## Register REQUEST Provider

For manually created DI sub-trees:

```typescript
const contextId = ContextIdFactory.create();
this.moduleRef.registerRequestByContextId(myRequestObject, contextId);
```

## Key Points

- `get()` only retrieves static (singleton) instances
- `resolve()` is async and for scoped providers
- Use `{ strict: false }` to access providers from other modules
- `ModuleRef` is imported from `@nestjs/core`

<!--
Source references:
- https://docs.nestjs.com/fundamentals/module-ref
-->

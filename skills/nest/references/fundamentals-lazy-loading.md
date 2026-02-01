---
name: lazy-loading
description: Lazy loading modules for serverless and performance optimization
---

# Lazy Loading Modules

Lazy loading helps decrease bootstrap time by loading modules only when needed, particularly useful for serverless environments where cold start latency matters.

## Basic Usage

Inject `LazyModuleLoader` to load modules on-demand:

```typescript
import { Injectable } from '@nestjs/common';
import { LazyModuleLoader } from '@nestjs/core';

@Injectable()
export class CatsService {
  constructor(private lazyModuleLoader: LazyModuleLoader) {}

  async loadFeature() {
    const { LazyModule } = await import('./lazy.module');
    const moduleRef = await this.lazyModuleLoader.load(() => LazyModule);

    const { LazyService } = await import('./lazy.service');
    const lazyService = moduleRef.get(LazyService);
    return lazyService.doSomething();
  }
}
```

## Module Definition

Lazy loaded modules are standard Nest modules:

```typescript
@Module({
  providers: [LazyService],
  exports: [LazyService],
})
export class LazyModule {}
```

## Caching Behavior

Lazy loaded modules are cached after the first load:

```
Load "LazyModule" attempt: 1 - time: 2.379ms
Load "LazyModule" attempt: 2 - time: 0.294ms  // Cached
```

## Limitations

**Cannot lazy load:**
- Controllers (routes must be registered at startup)
- Resolvers (GraphQL schema generated at startup)
- Gateways (WebSocket routes registered at startup)

**Other restrictions:**
- Cannot register as global modules
- Global enhancers (guards/interceptors) won't work
- Lifecycle hooks are not invoked in lazy loaded modules

## Webpack Configuration

For Webpack, update `tsconfig.json`:

```json
{
  "compilerOptions": {
    "module": "esnext",
    "moduleResolution": "node"
  }
}
```

## Use Cases

Best suited for:
- Serverless functions (Lambda, Cloud Functions)
- Worker/cron jobs with conditional logic
- Feature modules loaded based on runtime conditions

<!--
Source references:
- https://docs.nestjs.com/fundamentals/lazy-loading-modules
-->

---
name: lifecycle-events
description: Application and provider lifecycle hooks in NestJS
---

# Lifecycle Events

NestJS provides lifecycle hooks that give visibility into key application events and allow running code when they occur.

## Lifecycle Sequence

The lifecycle consists of three phases: **initializing**, **running**, and **terminating**.

## Lifecycle Hooks

| Hook | When Triggered |
|------|----------------|
| `onModuleInit()` | Called once the host module's dependencies have been resolved |
| `onApplicationBootstrap()` | Called once all modules have been initialized, but before listening |
| `onModuleDestroy()` | Called after a termination signal (e.g., SIGTERM) has been received |
| `beforeApplicationShutdown()` | Called after all `onModuleDestroy()` handlers have completed |
| `onApplicationShutdown()` | Called after connections close (`app.close()` resolves) |

## Usage

Implement the appropriate interface to register a lifecycle hook:

```typescript
import { Injectable, OnModuleInit, OnApplicationBootstrap } from '@nestjs/common';

@Injectable()
export class UsersService implements OnModuleInit, OnApplicationBootstrap {
  onModuleInit() {
    console.log('Module initialized');
  }

  onApplicationBootstrap() {
    console.log('Application bootstrapped');
  }
}
```

## Asynchronous Initialization

Hooks can be async - Nest will wait for the promise to resolve:

```typescript
async onModuleInit(): Promise<void> {
  await this.fetchConfiguration();
}
```

## Enabling Shutdown Hooks

Shutdown hooks are disabled by default. Enable them in `main.ts`:

```typescript
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableShutdownHooks();
  await app.listen(3000);
}
```

Handle shutdown signals:

```typescript
@Injectable()
class DatabaseService implements OnApplicationShutdown {
  onApplicationShutdown(signal: string) {
    console.log(`Received ${signal}, closing connections...`);
    // Cleanup logic
  }
}
```

## Key Points

- Lifecycle hooks are not triggered for **request-scoped** providers
- Execution order depends on module import order
- Windows has limited shutdown hook support (SIGINT works, SIGTERM doesn't)
- `enableShutdownHooks` consumes memory by starting listeners

<!--
Source references:
- https://docs.nestjs.com/fundamentals/lifecycle-events
-->

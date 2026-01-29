---
name: core-middleware
description: NestJS middleware for request/response processing
---

# Middleware

Middleware functions are called before route handlers. They have access to request and response objects and can modify them or end the request-response cycle.

## Class-based Middleware

```typescript
import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    console.log('Request...');
    next();
  }
}
```

## Functional Middleware

For simple middleware without dependencies:

```typescript
import { Request, Response, NextFunction } from 'express';

export function logger(req: Request, res: Response, next: NextFunction) {
  console.log('Request...');
  next();
}
```

## Applying Middleware

Use `configure()` method in module:

```typescript
import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { LoggerMiddleware } from './common/middleware/logger.middleware';
import { CatsModule } from './cats/cats.module';

@Module({
  imports: [CatsModule],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(LoggerMiddleware)
      .forRoutes('cats');
  }
}
```

## Route-specific Middleware

Apply to specific routes:

```typescript
consumer
  .apply(LoggerMiddleware)
  .forRoutes({ path: 'cats', method: RequestMethod.GET });
```

## Controller-based Middleware

Apply to entire controller:

```typescript
consumer
  .apply(LoggerMiddleware)
  .forRoutes(CatsController);
```

## Excluding Routes

Exclude specific routes:

```typescript
consumer
  .apply(LoggerMiddleware)
  .exclude(
    { path: 'cats', method: RequestMethod.GET },
    { path: 'cats', method: RequestMethod.POST },
    'cats/{*splat}',
  )
  .forRoutes(CatsController);
```

## Multiple Middleware

Apply multiple middleware sequentially:

```typescript
consumer
  .apply(cors(), helmet(), logger)
  .forRoutes(CatsController);
```

## Global Middleware

Apply to all routes:

```typescript
const app = await NestFactory.create(AppModule);
app.use(logger);
await app.listen(3000);
```

## Route Wildcards

Use wildcards in routes:

```typescript
consumer
  .apply(LoggerMiddleware)
  .forRoutes({
    path: 'abcd/*splat',
    method: RequestMethod.ALL,
  });
```

## Key Points

- Middleware runs before route handlers
- Use functional middleware when no dependencies needed
- Class middleware supports dependency injection
- Middleware can be route-specific or global
- Use `exclude()` to skip certain routes
- Global middleware cannot access DI container

<!--
Source references:
- https://docs.nestjs.com/middleware
-->

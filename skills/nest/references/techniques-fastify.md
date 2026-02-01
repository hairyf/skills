---
name: fastify
description: Using Fastify as the HTTP adapter for better performance
---

# Fastify (Performance)

Fastify is a high-performance alternative to Express, achieving nearly 2x better benchmark results.

## Installation

```bash
npm install @nestjs/platform-fastify
```

## Setup

```typescript
import { NestFactory } from '@nestjs/core';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
  );
  
  // Fastify listens only on localhost by default
  await app.listen(3000, '0.0.0.0');
}
bootstrap();
```

## Fastify Options

```typescript
new FastifyAdapter({
  logger: true,
  trustProxy: true,
});
```

## Middleware Differences

Fastify middleware receives raw `req` and `res` objects:

```typescript
import { Injectable, NestMiddleware } from '@nestjs/common';
import { FastifyRequest, FastifyReply } from 'fastify';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  use(req: FastifyRequest['raw'], res: FastifyReply['raw'], next: () => void) {
    console.log('Request...');
    next();
  }
}
```

## Redirect Response

```typescript
@Get()
redirect(@Res() res: FastifyReply) {
  res.status(302).redirect('/login');
}
```

## Route Config

```typescript
import { RouteConfig } from '@nestjs/platform-fastify';

@RouteConfig({ output: 'hello world' })
@Get()
index(@Req() req: FastifyRequest) {
  return req.routeConfig.output;
}
```

## Route Constraints

```typescript
import { RouteConstraints } from '@nestjs/platform-fastify';

@RouteConstraints({ version: '1.2.x' })
@Get()
newFeature() {
  return 'Works only for version >= 1.2.x';
}
```

## Registering Plugins

```typescript
import compression from '@fastify/compress';
import helmet from '@fastify/helmet';
import fastifyCookie from '@fastify/cookie';

const app = await NestFactory.create<NestFastifyApplication>(
  AppModule,
  new FastifyAdapter(),
);

await app.register(compression);
await app.register(helmet);
await app.register(fastifyCookie, { secret: 'my-secret' });
```

## Platform-Specific Packages

When using Fastify, replace Express packages with Fastify equivalents:

| Express | Fastify |
|---------|---------|
| `express-session` | `@fastify/secure-session` |
| `cookie-parser` | `@fastify/cookie` |
| `compression` | `@fastify/compress` |
| `helmet` | `@fastify/helmet` |
| `multer` | Not compatible |

## Key Points

- Provides significant performance improvements
- Not all Express middleware is compatible
- Use `NestFastifyApplication` type for proper typings
- Default listener is `localhost` only (specify `0.0.0.0` for external access)
- File upload (multer) is not compatible with Fastify

<!--
Source references:
- https://docs.nestjs.com/techniques/performance
-->

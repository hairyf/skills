---
name: cors-helmet-rate-limiting
description: CORS, security headers, and rate limiting protection
---

# Security Middleware

Essential security measures for NestJS applications.

## CORS (Cross-Origin Resource Sharing)

Enable CORS to allow cross-origin requests:

```typescript
// Simple enable
const app = await NestFactory.create(AppModule, { cors: true });

// Or with configuration
const app = await NestFactory.create(AppModule);
app.enableCors({
  origin: ['https://example.com', 'https://app.example.com'],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true,
});
```

Dynamic origin:

```typescript
app.enableCors({
  origin: (origin, callback) => {
    const whitelist = ['https://example.com'];
    if (!origin || whitelist.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
});
```

## Helmet (Security Headers)

```bash
npm install helmet
```

```typescript
import helmet from 'helmet';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(helmet());
  await app.listen(3000);
}
```

## Rate Limiting

Protect against brute-force attacks:

```bash
npm install @nestjs/throttler
```

### Basic Setup

```typescript
import { Module } from '@nestjs/common';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';

@Module({
  imports: [
    ThrottlerModule.forRoot({
      throttlers: [
        { ttl: 60000, limit: 10 }, // 10 requests per minute
      ],
    }),
  ],
  providers: [
    { provide: APP_GUARD, useClass: ThrottlerGuard },
  ],
})
export class AppModule {}
```

### Multiple Limits

```typescript
ThrottlerModule.forRoot({
  throttlers: [
    { name: 'short', ttl: 1000, limit: 3 },    // 3 per second
    { name: 'medium', ttl: 10000, limit: 20 }, // 20 per 10 seconds
    { name: 'long', ttl: 60000, limit: 100 },  // 100 per minute
  ],
});
```

### Skip Routes

```typescript
import { SkipThrottle } from '@nestjs/throttler';

@SkipThrottle()
@Controller('health')
export class HealthController {}

// Or skip specific throttlers
@SkipThrottle({ short: true })
@Get()
findAll() {}
```

### Override Limits

```typescript
import { Throttle } from '@nestjs/throttler';

@Throttle({ default: { limit: 3, ttl: 60000 } })
@Get()
findAll() {}
```

### Behind Proxy

```typescript
// main.ts
const app = await NestFactory.create<NestExpressApplication>(AppModule);
app.set('trust proxy', 'loopback');

// Custom tracker for proxy
@Injectable()
export class ThrottlerBehindProxyGuard extends ThrottlerGuard {
  protected async getTracker(req: Record<string, any>): Promise<string> {
    return req.ips.length ? req.ips[0] : req.ip;
  }
}
```

### Redis Storage

For distributed systems:

```bash
npm install @nest-lab/throttler-storage-redis
```

```typescript
import { ThrottlerStorageRedisService } from '@nest-lab/throttler-storage-redis';

ThrottlerModule.forRoot({
  throttlers: [{ ttl: 60000, limit: 10 }],
  storage: new ThrottlerStorageRedisService('redis://localhost:6379'),
});
```

### WebSocket Rate Limiting

```typescript
@Injectable()
export class WsThrottlerGuard extends ThrottlerGuard {
  async handleRequest(requestProps: ThrottlerRequest): Promise<boolean> {
    const { context, limit, ttl } = requestProps;
    const client = context.switchToWs().getClient();
    const tracker = client._socket.remoteAddress;
    // Custom logic
    return true;
  }
}
```

### GraphQL Rate Limiting

```typescript
@Injectable()
export class GqlThrottlerGuard extends ThrottlerGuard {
  getRequestResponse(context: ExecutionContext) {
    const gqlCtx = GqlExecutionContext.create(context);
    const ctx = gqlCtx.getContext();
    return { req: ctx.req, res: ctx.res };
  }
}
```

## Time Helpers

```typescript
import { seconds, minutes, hours } from '@nestjs/throttler';

ThrottlerModule.forRoot({
  throttlers: [
    { ttl: seconds(30), limit: 10 },
    { ttl: minutes(5), limit: 100 },
  ],
});
```

<!--
Source references:
- https://docs.nestjs.com/security/cors
- https://docs.nestjs.com/security/helmet
- https://docs.nestjs.com/security/rate-limiting
-->

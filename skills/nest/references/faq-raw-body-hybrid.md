---
name: raw-body-hybrid
description: Raw request body for webhooks and hybrid HTTP+microservice applications
---

# Raw Body and Hybrid Applications

## Raw Body (Webhook Signature Verification)

Required for Stripe, GitHub webhooks, etc. where you need the unparsed body to compute HMAC.

### Express

```typescript
const app = await NestFactory.create<NestExpressApplication>(AppModule, {
  rawBody: true,
});
```

```typescript
import { Controller, Post, RawBodyRequest, Req } from '@nestjs/common';
import { Request } from 'express';

@Controller('webhooks')
class WebhooksController {
  @Post('stripe')
  stripe(@Req() req: RawBodyRequest<Request>) {
    const raw = req.rawBody; // Buffer
    const signature = req.headers['stripe-signature'];
    // Verify signature with raw body
  }
}
```

### Fastify

```typescript
const app = await NestFactory.create<NestFastifyApplication>(
  AppModule,
  new FastifyAdapter(),
  { rawBody: true },
);
```

### Additional Parsers

```typescript
app.useBodyParser('text');
app.useBodyParser('json', { limit: '10mb' });
```

## Hybrid Applications

Combine HTTP server with one or more microservice listeners.

```typescript
const app = await NestFactory.create(AppModule);

// Connect microservices
app.connectMicroservice<MicroserviceOptions>({
  transport: Transport.TCP,
  options: { port: 3001 },
});

app.connectMicroservice<MicroserviceOptions>({
  transport: Transport.REDIS,
  options: { host: 'localhost', port: 6379 },
});

await app.startAllMicroservices();
await app.listen(3001);
```

### Non-HTTP Applications

Use `app.init()` instead of `app.listen()` when not handling HTTP:

```typescript
await app.startAllMicroservices();
await app.init();
```

### Binding Patterns to Transport

When multiple transports exist, bind `@MessagePattern()` to specific transport:

```typescript
@MessagePattern('time.us.*', Transport.NATS)
getDate(@Payload() data: number[], @Ctx() context: NatsContext) {
  return new Date().toLocaleTimeString();
}

@MessagePattern({ cmd: 'time.us' }, Transport.TCP)
getTCPDate(@Payload() data: number[]) {
  return new Date().toLocaleTimeString();
}
```

### Inherit App Config

By default, microservices don't inherit global pipes/guards/interceptors. To inherit:

```typescript
app.connectMicroservice<MicroserviceOptions>(
  { transport: Transport.TCP },
  { inheritAppConfig: true },
);
```

## Key Points

- `rawBody: true` must be set at app creation
- Don't use `bodyParser: false` with raw body
- `RawBodyRequest` interface adds `rawBody` to request
- Each `connectMicroservice()` adds one transport
- Call `startAllMicroservices()` before `listen()`

<!--
Source references:
- https://docs.nestjs.com/faq/raw-body
- https://docs.nestjs.com/faq/hybrid-application
-->

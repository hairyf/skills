---
name: websockets-advanced
description: WebSocket guards, interceptors, pipes, exception filters, and adapters
---

# WebSocket Advanced Features

## Guards

Use `WsException` instead of `HttpException` in WebSocket context:

```typescript
import { WsException } from '@nestjs/websockets';

@UseGuards(AuthGuard)
@SubscribeMessage('events')
handleEvent(client: Socket, data: unknown) {
  if (!data) {
    throw new WsException('Invalid data');
  }
  return { event: 'events', data };
}
```

## Exception Filters

```typescript
import { Catch, ArgumentsHost } from '@nestjs/common';
import { BaseWsExceptionFilter, WsException } from '@nestjs/websockets';

@Catch(WsException)
export class AllExceptionsFilter extends BaseWsExceptionFilter {
  catch(exception: WsException, host: ArgumentsHost) {
    const client = host.switchToWs().getClient<Socket>();
    const error = exception.getError();
    const details = error instanceof Object ? { ...error } : { message: error };
    client.emit('exception', details);
  }
}
```

Apply globally:

```typescript
app.useGlobalFilters(new AllExceptionsFilter());
```

## Interceptors

Same pattern as HTTP—use `@UseInterceptors()` on gateway or handlers.

## Pipes

Validation pipes work in WebSocket handlers. Use `@Payload()` with validation:

```typescript
@SubscribeMessage('events')
handleEvent(
  @Payload(new ValidationPipe({ whitelist: true })) data: CreateEventDto,
) {
  return { event: 'events', data };
}
```

## Custom Adapter

Use custom WebSocket adapter (e.g., for Redis pub/sub scaling):

```typescript
import { IoAdapter } from '@nestjs/platform-socket.io';

export class RedisIoAdapter extends IoAdapter {
  // Override to use Redis adapter
}
```

```typescript
const app = await NestFactory.create(AppModule);
app.useWebSocketAdapter(new RedisIoAdapter(app));
```

## Key Points

- `WsException` from `@nestjs/websockets`
- `BaseWsExceptionFilter` for WebSocket exception handling
- Guards, interceptors, pipes work same as HTTP
- Use `@Payload()` for typed message body with validation

<!--
Source references:
- https://docs.nestjs.com/websockets/guards
- https://docs.nestjs.com/websockets/exception-filters
- https://docs.nestjs.com/websockets/interceptors
- https://docs.nestjs.com/websockets/pipes
- https://docs.nestjs.com/websockets/adapter
-->

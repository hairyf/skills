---
name: compression-streaming-sse
description: Response compression, file streaming, and Server-Sent Events
---

# Compression, Streaming & SSE

## Compression

For high-traffic production sites, offload compression to a reverse proxy (Nginx).

### Express

```bash
npm install compression
npm install -D @types/compression
```

```typescript
import * as compression from 'compression';

app.use(compression());
```

### Fastify

```bash
npm install @fastify/compress
```

```typescript
import compression from '@fastify/compress';

const app = await NestFactory.create<NestFastifyApplication>(
  AppModule,
  new FastifyAdapter(),
);
await app.register(compression);
```

Configure compression quality:

```typescript
import { constants } from 'node:zlib';

await app.register(compression, {
  brotliOptions: {
    params: { [constants.BROTLI_PARAM_QUALITY]: 4 },
  },
});

// Or prefer faster encodings
await app.register(compression, {
  encodings: ['gzip', 'deflate'],
});
```

## File Streaming

Use `StreamableFile` to return file streams while keeping interceptor support:

```typescript
import { Controller, Get, StreamableFile } from '@nestjs/common';
import { createReadStream } from 'node:fs';
import { join } from 'node:path';

@Controller('files')
export class FilesController {
  @Get()
  getFile(): StreamableFile {
    const file = createReadStream(join(process.cwd(), 'package.json'));
    return new StreamableFile(file);
  }
}
```

With custom headers:

```typescript
@Get()
getFile(): StreamableFile {
  const file = createReadStream(join(process.cwd(), 'report.pdf'));
  return new StreamableFile(file, {
    type: 'application/pdf',
    disposition: 'attachment; filename="report.pdf"',
  });
}
```

Or using response object:

```typescript
@Get()
getFile(@Res({ passthrough: true }) res: Response): StreamableFile {
  const file = createReadStream(join(process.cwd(), 'image.png'));
  res.set({
    'Content-Type': 'image/png',
    'Content-Disposition': 'inline; filename="image.png"',
  });
  return new StreamableFile(file);
}
```

Using `@Header()` decorator:

```typescript
@Get()
@Header('Content-Type', 'application/pdf')
@Header('Content-Disposition', 'attachment; filename="report.pdf"')
getFile(): StreamableFile {
  const file = createReadStream(join(process.cwd(), 'report.pdf'));
  return new StreamableFile(file);
}
```

## Server-Sent Events (SSE)

SSE enables server-to-client push over HTTP.

```typescript
import { Controller, Sse, MessageEvent } from '@nestjs/common';
import { Observable, interval, map } from 'rxjs';

@Controller()
export class EventsController {
  @Sse('sse')
  sse(): Observable<MessageEvent> {
    return interval(1000).pipe(
      map(() => ({
        data: { timestamp: new Date().toISOString() },
      })),
    );
  }
}
```

MessageEvent interface:

```typescript
interface MessageEvent {
  data: string | object;  // Event data
  id?: string;            // Event ID for reconnection
  type?: string;          // Event type
  retry?: number;         // Reconnection interval (ms)
}
```

Client-side usage:

```javascript
const eventSource = new EventSource('/sse');

eventSource.onmessage = ({ data }) => {
  console.log('New message:', JSON.parse(data));
};

// Named events
eventSource.addEventListener('update', (event) => {
  console.log('Update:', JSON.parse(event.data));
});

// Close connection
eventSource.close();
```

SSE with typed events:

```typescript
@Sse('notifications')
notifications(): Observable<MessageEvent> {
  return this.notificationsService.getStream().pipe(
    map((notification) => ({
      data: notification,
      type: 'notification',
      id: notification.id,
    })),
  );
}
```

## Key Points

- SSE routes must return an `Observable` stream
- `StreamableFile` works with both Express and Fastify
- Default content type for StreamableFile is `application/octet-stream`
- SSE maintains persistent HTTP connection
- Compression should be disabled for SSE endpoints

<!--
Source references:
- https://docs.nestjs.com/techniques/compression
- https://docs.nestjs.com/techniques/streaming-files
- https://docs.nestjs.com/techniques/server-sent-events
-->

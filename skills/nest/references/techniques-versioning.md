---
name: versioning
description: API versioning strategies in NestJS
---

# API Versioning

NestJS supports four versioning strategies for HTTP applications.

## Versioning Types

| Type | Description |
|------|-------------|
| URI | Version in URL path (`/v1/cats`) |
| Header | Custom header specifies version |
| Media Type | `Accept` header with version |
| Custom | Custom extractor function |

## Enable Versioning

### URI Versioning (Default)

```typescript
// main.ts
import { VersioningType } from '@nestjs/common';

const app = await NestFactory.create(AppModule);
app.enableVersioning({
  type: VersioningType.URI,
  prefix: 'v',  // Optional, default is 'v'
});
```

### Header Versioning

```typescript
app.enableVersioning({
  type: VersioningType.HEADER,
  header: 'X-API-Version',
});
```

### Media Type Versioning

```typescript
app.enableVersioning({
  type: VersioningType.MEDIA_TYPE,
  key: 'v=',  // Accept: application/json;v=1
});
```

## Controller Versioning

```typescript
@Controller({ path: 'cats', version: '1' })
export class CatsControllerV1 {
  @Get()
  findAll() {
    return 'Version 1';
  }
}

@Controller({ path: 'cats', version: '2' })
export class CatsControllerV2 {
  @Get()
  findAll() {
    return 'Version 2';
  }
}
```

## Route Versioning

```typescript
@Controller('cats')
export class CatsController {
  @Version('1')
  @Get()
  findAllV1() {
    return 'Version 1';
  }

  @Version('2')
  @Get()
  findAllV2() {
    return 'Version 2';
  }
}
```

## Multiple Versions

```typescript
@Controller({ path: 'cats', version: ['1', '2'] })
export class CatsController {
  @Get()
  findAll() {
    return 'Handles both v1 and v2';
  }
}
```

## Version Neutral

Routes that work regardless of version:

```typescript
import { VERSION_NEUTRAL } from '@nestjs/common';

@Controller({ path: 'health', version: VERSION_NEUTRAL })
export class HealthController {
  @Get()
  check() {
    return { status: 'ok' };
  }
}
```

## Default Version

```typescript
app.enableVersioning({
  type: VersioningType.URI,
  defaultVersion: '1',
  // Or multiple: defaultVersion: ['1', '2']
  // Or neutral: defaultVersion: VERSION_NEUTRAL
});
```

## Middleware Versioning

```typescript
@Module({})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(LoggerMiddleware)
      .forRoutes({ path: 'cats', method: RequestMethod.GET, version: '2' });
  }
}
```

## Key Points

- Unversioned routes return 404 when versioning is enabled
- URI version appears after global prefix
- Use `VERSION_NEUTRAL` for version-agnostic endpoints
- Route-level versions override controller-level versions

<!--
Source references:
- https://docs.nestjs.com/techniques/versioning
-->

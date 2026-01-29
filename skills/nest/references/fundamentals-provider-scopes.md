---
name: fundamentals-provider-scopes
description: Provider scopes in NestJS (singleton, request, transient)
---

# Provider Scopes

Providers can have different lifetimes (scopes) that determine how instances are created and shared.

## Scope Types

- `DEFAULT` - Singleton, shared across entire application
- `REQUEST` - New instance per request
- `TRANSIENT` - New instance per consumer

## Default Scope (Singleton)

```typescript
@Injectable()
export class CatsService {}
```

Singleton is the default and recommended scope.

## Request Scope

```typescript
import { Injectable, Scope } from '@nestjs/common';

@Injectable({ scope: Scope.REQUEST })
export class CatsService {}
```

## Transient Scope

```typescript
@Injectable({ scope: Scope.TRANSIENT })
export class LoggerService {}
```

## Custom Provider Scopes

```typescript
{
  provide: 'CACHE_MANAGER',
  useClass: CacheManager,
  scope: Scope.TRANSIENT,
}
```

## Controller Scope

```typescript
@Controller({
  path: 'cats',
  scope: Scope.REQUEST,
})
export class CatsController {}
```

## Accessing Request Object

Inject `REQUEST` to access request in request-scoped providers:

```typescript
import { Injectable, Scope, Inject } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { Request } from 'express';

@Injectable({ scope: Scope.REQUEST })
export class CatsService {
  constructor(@Inject(REQUEST) private request: Request) {}
}
```

## Scope Hierarchy

Request scope bubbles up the injection chain. If a controller depends on a request-scoped provider, the controller becomes request-scoped.

## Key Points

- Singleton scope is default and recommended
- Request scope creates new instance per request
- Transient scope creates new instance per consumer
- Request scope propagates up dependency chain
- Use `REQUEST` token to access request object
- WebSocket gateways should not use request-scoped providers

<!--
Source references:
- https://docs.nestjs.com/fundamentals/injection-scopes
-->

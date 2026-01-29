---
name: fundamentals-execution-context
description: Accessing execution context in NestJS guards, filters, and interceptors
---

# Execution Context

`ExecutionContext` provides information about the current execution context, useful for building generic guards, filters, and interceptors.

## ArgumentsHost

`ArgumentsHost` provides methods to retrieve handler arguments:

```typescript
const ctx = host.switchToHttp();
const request = ctx.getRequest<Request>();
const response = ctx.getResponse<Response>();
```

## Application Context Types

Determine application type:

```typescript
if (host.getType() === 'http') {
  // HTTP context
} else if (host.getType() === 'rpc') {
  // Microservice context
} else if (host.getType<GqlContextType>() === 'graphql') {
  // GraphQL context
}
```

## Switching Contexts

### HTTP Context

```typescript
const ctx = host.switchToHttp();
const request = ctx.getRequest<Request>();
const response = ctx.getResponse<Response>();
```

### WebSocket Context

```typescript
const ctx = host.switchToWs();
const client = ctx.getClient<Socket>();
const data = ctx.getData();
```

### RPC Context

```typescript
const ctx = host.switchToRpc();
const data = ctx.getData();
const context = ctx.getContext();
```

## ExecutionContext

`ExecutionContext` extends `ArgumentsHost` with additional methods:

```typescript
export interface ExecutionContext extends ArgumentsHost {
  getClass<T = any>(): Type<T>;
  getHandler(): Function;
}
```

## Using in Guards

```typescript
@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const roles = this.reflector.get(Roles, context.getHandler());
    const request = context.switchToHttp().getRequest();
    return matchRoles(roles, request.user.roles);
  }
}
```

## Reflection and Metadata

Access route metadata:

```typescript
const roles = this.reflector.get(Roles, context.getHandler());
const roles = this.reflector.get(Roles, context.getClass());
```

## Key Points

- `ArgumentsHost` provides access to handler arguments
- `ExecutionContext` adds class and handler information
- Use `switchToHttp()`, `switchToWs()`, `switchToRpc()` for context-specific access
- Use `getType()` to determine application context
- `Reflector` provides access to route metadata
- Execution context is available in guards, filters, and interceptors

<!--
Source references:
- https://docs.nestjs.com/fundamentals/execution-context
-->

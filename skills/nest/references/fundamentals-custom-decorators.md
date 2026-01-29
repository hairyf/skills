---
name: fundamentals-custom-decorators
description: Creating custom parameter decorators in NestJS
---

# Custom Decorators

Create custom parameter decorators to extract data from requests in a reusable way.

## Basic Custom Decorator

```typescript
import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const User = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return request.user;
  },
);
```

Usage:

```typescript
@Get()
async findOne(@User() user: UserEntity) {
  console.log(user);
}
```

## Decorator with Data

Pass data to decorator:

```typescript
export const User = createParamDecorator(
  (data: string, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const user = request.user;

    return data ? user?.[data] : user;
  },
);
```

Usage:

```typescript
@Get()
async findOne(@User('firstName') firstName: string) {
  console.log(`Hello ${firstName}`);
}
```

## Working with Pipes

Apply pipes to custom decorators:

```typescript
@Get()
async findOne(
  @User(new ValidationPipe({ validateCustomDecorators: true }))
  user: UserEntity,
) {
  console.log(user);
}
```

## Decorator Composition

Combine multiple decorators:

```typescript
import { applyDecorators } from '@nestjs/common';

export function Auth(...roles: Role[]) {
  return applyDecorators(
    SetMetadata('roles', roles),
    UseGuards(AuthGuard, RolesGuard),
    ApiBearerAuth(),
    ApiUnauthorizedResponse({ description: 'Unauthorized' }),
  );
}
```

Usage:

```typescript
@Get('users')
@Auth('admin')
findAllUsers() {}
```

## Key Points

- Use `createParamDecorator()` to create custom decorators
- Decorators receive `ExecutionContext` for accessing request/response
- Pass data as second parameter to decorator factory
- Custom decorators work with pipes
- Use `applyDecorators()` to compose multiple decorators
- TypeScript generics can enforce type safety

<!--
Source references:
- https://docs.nestjs.com/custom-decorators
-->

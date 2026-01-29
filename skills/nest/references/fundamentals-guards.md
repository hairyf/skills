---
name: fundamentals-guards
description: NestJS guards for authorization and access control
---

# Guards

Guards determine whether a request should be handled by a route handler. They have access to `ExecutionContext` and know what will be executed next.

## Basic Guard

```typescript
import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';

@Injectable()
export class AuthGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    return validateRequest(request);
  }
}
```

## Role-based Guard

```typescript
import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Roles } from './roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const roles = this.reflector.get(Roles, context.getHandler());
    if (!roles) {
      return true;
    }
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    return matchRoles(roles, user.roles);
  }
}
```

## Custom Decorator

```typescript
import { Reflector } from '@nestjs/core';

export const Roles = Reflector.createDecorator<string[]>();
```

Usage:

```typescript
@Post()
@Roles(['admin'])
async create(@Body() createCatDto: CreateCatDto) {
  this.catsService.create(createCatDto);
}
```

## Binding Guards

### Controller-scoped

```typescript
@Controller('cats')
@UseGuards(RolesGuard)
export class CatsController {}
```

### Method-scoped

```typescript
@Post()
@UseGuards(RolesGuard)
async create(@Body() createCatDto: CreateCatDto) {
  this.catsService.create(createCatDto);
}
```

### Global Guards

```typescript
const app = await NestFactory.create(AppModule);
app.useGlobalGuards(new RolesGuard());
```

Or via module:

```typescript
import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';

@Module({
  providers: [
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
  ],
})
export class AppModule {}
```

## Multiple Guards

```typescript
@UseGuards(AuthGuard, RolesGuard)
export class CatsController {}
```

## Execution Order

Guards are executed:
- After middleware
- Before interceptors and pipes

## Key Points

- Guards return `true` to allow, `false` to deny
- Guards can be async (return `Promise<boolean>`)
- Use `Reflector` to access route metadata
- Guards throw exceptions to deny access
- Use `@SetMetadata()` or `Reflector.createDecorator()` for custom metadata
- Guards have access to `ExecutionContext`

<!--
Source references:
- https://docs.nestjs.com/guards
-->

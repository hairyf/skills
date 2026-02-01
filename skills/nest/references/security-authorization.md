---
name: authorization
description: Role-based access control (RBAC) and CASL integration
---

# Authorization

Authorization determines what authenticated users can do. NestJS supports RBAC, claims-based, and policy-based authorization.

## Basic RBAC Implementation

### 1. Define Roles

```typescript
// role.enum.ts
export enum Role {
  User = 'user',
  Admin = 'admin',
}
```

### 2. Create Roles Decorator

```typescript
// roles.decorator.ts
import { SetMetadata } from '@nestjs/common';
import { Role } from './role.enum';

export const ROLES_KEY = 'roles';
export const Roles = (...roles: Role[]) => SetMetadata(ROLES_KEY, roles);
```

### 3. Create Roles Guard

```typescript
// roles.guard.ts
import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Role } from './role.enum';
import { ROLES_KEY } from './roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    
    if (!requiredRoles) return true;

    const { user } = context.switchToHttp().getRequest();
    return requiredRoles.some((role) => user.roles?.includes(role));
  }
}
```

### 4. Apply to Routes

```typescript
@Post()
@Roles(Role.Admin)
@UseGuards(AuthGuard, RolesGuard)
create(@Body() dto: CreateDto) {
  return this.service.create(dto);
}
```

### 5. Register Globally

```typescript
@Module({
  providers: [
    { provide: APP_GUARD, useClass: RolesGuard },
  ],
})
export class AppModule {}
```

## Claims-Based Authorization

Check specific permissions instead of roles:

```typescript
// permissions.decorator.ts
export const PERMISSIONS_KEY = 'permissions';
export const RequirePermissions = (...permissions: Permission[]) =>
  SetMetadata(PERMISSIONS_KEY, permissions);

// Usage
@Post()
@RequirePermissions(Permission.CREATE_POST)
create() {}
```

## CASL Integration

For complex authorization rules:

```bash
npm install @casl/ability
```

### Define Abilities

```typescript
// casl-ability.factory.ts
import { AbilityBuilder, createMongoAbility, MongoAbility } from '@casl/ability';

export type AppAbility = MongoAbility<[Action, Subjects]>;

@Injectable()
export class CaslAbilityFactory {
  createForUser(user: User) {
    const { can, cannot, build } = new AbilityBuilder(createMongoAbility);

    if (user.isAdmin) {
      can(Action.Manage, 'all');
    } else {
      can(Action.Read, 'all');
      can(Action.Update, Article, { authorId: user.id });
      cannot(Action.Delete, Article, { isPublished: true });
    }

    return build();
  }
}
```

### Use in Services

```typescript
@Injectable()
export class ArticlesService {
  constructor(private caslAbilityFactory: CaslAbilityFactory) {}

  async update(user: User, articleId: string, dto: UpdateDto) {
    const article = await this.findOne(articleId);
    const ability = this.caslAbilityFactory.createForUser(user);

    if (!ability.can(Action.Update, article)) {
      throw new ForbiddenException('Cannot update this article');
    }

    return this.articlesRepository.update(articleId, dto);
  }
}
```

### Policies Guard

```typescript
@Injectable()
export class PoliciesGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private caslAbilityFactory: CaslAbilityFactory,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const policyHandlers = this.reflector.get<PolicyHandler[]>(
      CHECK_POLICIES_KEY,
      context.getHandler(),
    ) || [];

    const { user } = context.switchToHttp().getRequest();
    const ability = this.caslAbilityFactory.createForUser(user);

    return policyHandlers.every((handler) =>
      typeof handler === 'function'
        ? handler(ability)
        : handler.handle(ability),
    );
  }
}

// Usage
@Get()
@UseGuards(PoliciesGuard)
@CheckPolicies((ability: AppAbility) => ability.can(Action.Read, Article))
findAll() {}
```

## Key Points

- Authorization is independent from authentication
- Use `Reflector` to access route metadata
- CASL provides fine-grained, attribute-based control
- `user.roles` should be attached by authentication guard

<!--
Source references:
- https://docs.nestjs.com/security/authorization
-->

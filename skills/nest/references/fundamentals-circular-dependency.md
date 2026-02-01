---
name: circular-dependency
description: Resolving circular dependencies between providers and modules
---

# Circular Dependency

Circular dependencies occur when two classes depend on each other. While they should be avoided, NestJS provides techniques to resolve them when necessary.

## Forward Reference for Providers

Use `forwardRef()` when two providers depend on each other:

```typescript
// cats.service.ts
import { Injectable, Inject, forwardRef } from '@nestjs/common';
import { CommonService } from './common.service';

@Injectable()
export class CatsService {
  constructor(
    @Inject(forwardRef(() => CommonService))
    private commonService: CommonService,
  ) {}
}
```

```typescript
// common.service.ts
@Injectable()
export class CommonService {
  constructor(
    @Inject(forwardRef(() => CatsService))
    private catsService: CatsService,
  ) {}
}
```

## Forward Reference for Modules

Apply `forwardRef()` on both sides of module imports:

```typescript
// common.module.ts
@Module({
  imports: [forwardRef(() => CatsModule)],
})
export class CommonModule {}

// cats.module.ts
@Module({
  imports: [forwardRef(() => CommonModule)],
})
export class CatsModule {}
```

## Using ModuleRef Alternative

Refactor to use `ModuleRef` to retrieve providers dynamically:

```typescript
@Injectable()
export class CatsService implements OnModuleInit {
  private commonService: CommonService;

  constructor(private moduleRef: ModuleRef) {}

  onModuleInit() {
    this.commonService = this.moduleRef.get(CommonService);
  }
}
```

## Common Causes

- Barrel files (index.ts) grouping imports - avoid when importing within same directory
- Over-coupled service design

## Key Points

- `forwardRef()` is imported from `@nestjs/common`
- Instantiation order is indeterminate with forward references
- Avoid circular dependencies with `Scope.REQUEST` providers (can cause undefined dependencies)
- Consider refactoring to eliminate circular dependencies when possible

<!--
Source references:
- https://docs.nestjs.com/fundamentals/circular-dependency
-->

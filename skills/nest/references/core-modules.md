---
name: core-modules
description: NestJS modules for organizing application structure
---

# Modules

Modules are classes annotated with `@Module()` decorator that organize application components. Every Nest application has at least one root module.

## Basic Module

```typescript
import { Module } from '@nestjs/common';
import { CatsController } from './cats.controller';
import { CatsService } from './cats.service';

@Module({
  controllers: [CatsController],
  providers: [CatsService],
})
export class CatsModule {}
```

## Module Properties

- `providers` - Services that can be injected
- `controllers` - Controllers in this module
- `imports` - Other modules to import
- `exports` - Providers to make available to other modules

## Feature Modules

Group related functionality:

```typescript
@Module({
  controllers: [CatsController],
  providers: [CatsService],
})
export class CatsModule {}
```

## Shared Modules

Export providers to share across modules:

```typescript
@Module({
  providers: [CatsService],
  exports: [CatsService],
})
export class CatsModule {}
```

## Global Modules

Make providers available everywhere:

```typescript
import { Module, Global } from '@nestjs/common';

@Global()
@Module({
  providers: [CatsService],
  exports: [CatsService],
})
export class CatsModule {}
```

## Dynamic Modules

Create configurable modules:

```typescript
@Module({
  providers: [Connection],
  exports: [Connection],
})
export class DatabaseModule {
  static forRoot(entities = [], options?): DynamicModule {
    const providers = createDatabaseProviders(options, entities);
    return {
      module: DatabaseModule,
      providers: providers,
      exports: providers,
    };
  }
}
```

Usage:

```typescript
@Module({
  imports: [DatabaseModule.forRoot([User])],
})
export class AppModule {}
```

## Module Re-exporting

Re-export imported modules:

```typescript
@Module({
  imports: [CommonModule],
  exports: [CommonModule],
})
export class CoreModule {}
```

## Module Dependency Injection

Modules can inject providers:

```typescript
@Module({
  providers: [CatsService],
})
export class CatsModule {
  constructor(private catsService: CatsService) {}
}
```

## Key Points

- Modules encapsulate providers by default
- Export providers to make them available to other modules
- Use `@Global()` sparingly - prefer explicit imports
- Dynamic modules allow runtime configuration
- Modules are singletons by default
- Module classes cannot be injected as providers

<!--
Source references:
- https://docs.nestjs.com/modules
- https://docs.nestjs.com/fundamentals/dynamic-modules
-->

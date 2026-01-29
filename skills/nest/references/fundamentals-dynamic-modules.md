---
name: fundamentals-dynamic-modules
description: Creating configurable dynamic modules in NestJS
---

# Dynamic Modules

Dynamic modules allow you to create modules that can be configured at runtime, providing flexible and customizable module APIs.

## Static vs Dynamic Modules

Static modules have fixed configuration:

```typescript
@Module({
  imports: [ConfigModule],
})
export class AppModule {}
```

Dynamic modules accept configuration:

```typescript
@Module({
  imports: [ConfigModule.forRoot({ envFilePath: '.env' })],
})
export class AppModule {}
```

## Creating Dynamic Modules

```typescript
import { Module, DynamicModule } from '@nestjs/common';

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

## Using Dynamic Modules

```typescript
@Module({
  imports: [DatabaseModule.forRoot([User])],
})
export class AppModule {}
```

## Global Dynamic Modules

```typescript
{
  global: true,
  module: DatabaseModule,
  providers: providers,
  exports: providers,
}
```

## Re-exporting Dynamic Modules

```typescript
@Module({
  imports: [DatabaseModule.forRoot([User])],
  exports: [DatabaseModule],
})
export class AppModule {}
```

## Async Dynamic Modules

```typescript
static forRootAsync(options: ConfigModuleAsyncOptions): DynamicModule {
  return {
    module: ConfigModule,
    imports: options.imports || [],
    providers: [
      {
        provide: CONFIG_OPTIONS,
        useFactory: options.useFactory,
        inject: options.inject || [],
      },
    ],
    exports: [ConfigService],
  };
}
```

## ConfigurableModuleBuilder

Use `ConfigurableModuleBuilder` for advanced scenarios:

```typescript
import { ConfigurableModuleBuilder } from '@nestjs/common';

export const { ConfigurableModuleClass, MODULE_OPTIONS_TOKEN } =
  new ConfigurableModuleBuilder<ConfigModuleOptions>()
    .setClassMethodName('forRoot')
    .build();
```

## Key Points

- Dynamic modules provide runtime configuration
- Use static `forRoot()` or `forRootAsync()` methods
- Return `DynamicModule` from factory methods
- Dynamic module properties extend base module metadata
- Use `ConfigurableModuleBuilder` for complex scenarios
- Dynamic modules can be global or scoped

<!--
Source references:
- https://docs.nestjs.com/fundamentals/dynamic-modules
-->

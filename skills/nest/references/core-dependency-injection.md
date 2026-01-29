---
name: core-dependency-injection
description: NestJS dependency injection system and custom providers
---

# Dependency Injection

NestJS uses dependency injection (DI) to manage dependencies between components. The DI container automatically resolves and injects dependencies.

## How DI Works

1. Provider is marked with `@Injectable()`
2. Consumer declares dependency in constructor
3. Provider is registered in module's `providers` array

```typescript
// 1. Define provider
@Injectable()
export class CatsService {
  findAll() {
    return [];
  }
}

// 2. Inject in consumer
@Controller('cats')
export class CatsController {
  constructor(private catsService: CatsService) {}
}

// 3. Register in module
@Module({
  providers: [CatsService],
  controllers: [CatsController],
})
export class CatsModule {}
```

## Standard Providers

Short-hand syntax:

```typescript
providers: [CatsService]
```

Is equivalent to:

```typescript
providers: [
  {
    provide: CatsService,
    useClass: CatsService,
  },
]
```

## Custom Provider Types

### Value Providers

Inject constant values or mocks:

```typescript
const mockCatsService = {
  findAll: () => ['test'],
};

@Module({
  providers: [
    {
      provide: CatsService,
      useValue: mockCatsService,
    },
  ],
})
export class AppModule {}
```

### Class Providers

Dynamically select implementation:

```typescript
const configServiceProvider = {
  provide: ConfigService,
  useClass: process.env.NODE_ENV === 'development'
    ? DevelopmentConfigService
    : ProductionConfigService,
};
```

### Factory Providers

Create providers dynamically:

```typescript
const connectionProvider = {
  provide: 'CONNECTION',
  useFactory: (optionsProvider: OptionsProvider, optional?: string) => {
    const options = optionsProvider.get();
    return new DatabaseConnection(options);
  },
  inject: [OptionsProvider, { token: 'SomeOptionalProvider', optional: true }],
};
```

### Alias Providers

Create aliases for existing providers:

```typescript
const loggerAliasProvider = {
  provide: 'AliasedLoggerService',
  useExisting: LoggerService,
};
```

## Non-class Tokens

Use strings, symbols, or enums as tokens:

```typescript
@Module({
  providers: [
    {
      provide: 'CONNECTION',
      useValue: connection,
    },
  ],
})
export class AppModule {}
```

Inject with `@Inject()`:

```typescript
@Injectable()
export class CatsRepository {
  constructor(@Inject('CONNECTION') connection: Connection) {}
}
```

## Exporting Custom Providers

Export by token:

```typescript
@Module({
  providers: [connectionFactory],
  exports: ['CONNECTION'],
})
export class AppModule {}
```

Or export the full provider object:

```typescript
@Module({
  providers: [connectionFactory],
  exports: [connectionFactory],
})
export class AppModule {}
```

## Key Points

- DI container resolves dependencies automatically
- Dependencies are resolved transitively
- Use `@Inject()` for non-class tokens
- Factory providers can inject other providers
- Providers are cached as singletons by default
- Use `NEST_DEBUG` environment variable for DI debugging

<!--
Source references:
- https://docs.nestjs.com/fundamentals/custom-providers
- https://docs.nestjs.com/providers#dependency-injection
-->

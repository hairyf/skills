---
name: core-providers
description: NestJS providers and services for dependency injection
---

# Providers

Providers are classes that can be injected as dependencies. Services, repositories, factories, and helpers are all providers.

## Basic Service

```typescript
import { Injectable } from '@nestjs/common';

@Injectable()
export class CatsService {
  private readonly cats: Cat[] = [];

  create(cat: Cat) {
    this.cats.push(cat);
  }

  findAll(): Cat[] {
    return this.cats;
  }
}
```

## Dependency Injection

Inject services in controllers:

```typescript
@Controller('cats')
export class CatsController {
  constructor(private catsService: CatsService) {}

  @Get()
  async findAll(): Promise<Cat[]> {
    return this.catsService.findAll();
  }
}
```

## Provider Registration

Register providers in modules:

```typescript
@Module({
  controllers: [CatsController],
  providers: [CatsService],
})
export class CatsModule {}
```

## Optional Providers

Mark dependencies as optional:

```typescript
import { Injectable, Optional, Inject } from '@nestjs/common';

@Injectable()
export class HttpService<T> {
  constructor(@Optional() @Inject('HTTP_OPTIONS') private httpClient: T) {}
}
```

## Property-based Injection

Inject at property level:

```typescript
@Injectable()
export class HttpService<T> {
  @Inject('HTTP_OPTIONS')
  private readonly httpClient: T;
}
```

## Custom Providers

### Value Providers

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

```typescript
const configServiceProvider = {
  provide: ConfigService,
  useClass: process.env.NODE_ENV === 'development'
    ? DevelopmentConfigService
    : ProductionConfigService,
};

@Module({
  providers: [configServiceProvider],
})
export class AppModule {}
```

### Factory Providers

```typescript
const connectionProvider = {
  provide: 'CONNECTION',
  useFactory: (optionsProvider: OptionsProvider) => {
    const options = optionsProvider.get();
    return new DatabaseConnection(options);
  },
  inject: [OptionsProvider],
};

@Module({
  providers: [connectionProvider, OptionsProvider],
})
export class AppModule {}
```

### Alias Providers

```typescript
const loggerAliasProvider = {
  provide: 'AliasedLoggerService',
  useExisting: LoggerService,
};

@Module({
  providers: [LoggerService, loggerAliasProvider],
})
export class AppModule {}
```

## Non-class-based Tokens

Use strings or symbols as tokens:

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

Inject using `@Inject()`:

```typescript
@Injectable()
export class CatsRepository {
  constructor(@Inject('CONNECTION') connection: Connection) {}
}
```

## Key Points

- Use `@Injectable()` decorator to mark classes as providers
- Prefer constructor-based injection over property-based
- Providers are singletons by default
- Use custom providers for mocks, factories, and aliases
- Export providers to make them available to other modules
- Use string tokens for non-class providers

<!--
Source references:
- https://docs.nestjs.com/providers
- https://docs.nestjs.com/fundamentals/custom-providers
-->

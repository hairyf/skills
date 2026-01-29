---
name: techniques-configuration
description: Configuration management with ConfigModule in NestJS
---

# Configuration

NestJS provides `@nestjs/config` package for managing application configuration across different environments.

## Installation

```bash
npm i --save @nestjs/config
```

## Basic Setup

```typescript
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule.forRoot()],
})
export class AppModule {}
```

## Custom .env Path

```typescript
ConfigModule.forRoot({
  envFilePath: '.development.env',
});
```

## Multiple .env Files

```typescript
ConfigModule.forRoot({
  envFilePath: ['.env.development.local', '.env.development'],
});
```

## Global ConfigModule

```typescript
ConfigModule.forRoot({
  isGlobal: true,
});
```

## Using ConfigService

```typescript
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AppService {
  constructor(private configService: ConfigService) {}

  getDatabaseUrl() {
    return this.configService.get<string>('DATABASE_URL');
  }

  getPort() {
    return this.configService.get<number>('PORT', 3000);
  }
}
```

## Custom Configuration Files

```typescript
export default () => ({
  port: parseInt(process.env.PORT, 10) || 3000,
  database: {
    host: process.env.DATABASE_HOST,
    port: parseInt(process.env.DATABASE_PORT, 10) || 5432,
  },
});
```

Register:

```typescript
ConfigModule.forRoot({
  load: [configuration],
});
```

## Schema Validation

```typescript
import * as Joi from 'joi';

ConfigModule.forRoot({
  validationSchema: Joi.object({
    NODE_ENV: Joi.string()
      .valid('development', 'production', 'test')
      .default('development'),
    PORT: Joi.number().default(3000),
  }),
});
```

## Async Configuration

```typescript
ConfigModule.forRootAsync({
  imports: [HttpModule],
  useFactory: async (httpService: HttpService) => {
    const response = await httpService.get('/config').toPromise();
    return response.data;
  },
  inject: [HttpService],
});
```

## Key Points

- Use `ConfigModule.forRoot()` for basic setup
- `ConfigService` provides typed access to configuration
- Use custom configuration files for complex setups
- Validate configuration with Joi schemas
- Make ConfigModule global to avoid repeated imports
- Environment variables take precedence over .env files

<!--
Source references:
- https://docs.nestjs.com/techniques/configuration
-->

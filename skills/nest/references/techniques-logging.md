---
name: logging
description: Built-in logger, custom loggers, and JSON logging
---

# Logging

NestJS provides a built-in `Logger` class with customizable behavior.

## Basic Usage

```typescript
import { Logger, Injectable } from '@nestjs/common';

@Injectable()
export class CatsService {
  private readonly logger = new Logger(CatsService.name);

  findAll() {
    this.logger.log('Finding all cats');
    this.logger.warn('Warning message');
    this.logger.error('Error message', error.stack);
    this.logger.debug('Debug info');
    this.logger.verbose('Verbose output');
  }
}
```

## Configuration Options

```typescript
const app = await NestFactory.create(AppModule, {
  logger: new ConsoleLogger({
    logLevels: ['error', 'warn', 'log'],  // Filter log levels
    timestamp: true,                       // Show timestamps
    json: true,                           // JSON format output
    colors: false,                        // Disable colors
    prefix: 'MyApp',                      // Custom prefix
  }),
});
```

Disable logging:

```typescript
const app = await NestFactory.create(AppModule, { logger: false });
```

Specific log levels only:

```typescript
const app = await NestFactory.create(AppModule, {
  logger: ['error', 'warn'],
});
```

## JSON Logging

Enable structured JSON logging for production:

```typescript
const app = await NestFactory.create(AppModule, {
  logger: new ConsoleLogger({ json: true }),
});
```

Output:

```json
{
  "level": "log",
  "pid": 19096,
  "timestamp": 1607370779834,
  "message": "Starting Nest application...",
  "context": "NestFactory"
}
```

## Custom Logger

Implement `LoggerService` interface:

```typescript
import { LoggerService, Injectable } from '@nestjs/common';

@Injectable()
export class MyLogger implements LoggerService {
  log(message: any, ...optionalParams: any[]) {}
  error(message: any, ...optionalParams: any[]) {}
  warn(message: any, ...optionalParams: any[]) {}
  debug?(message: any, ...optionalParams: any[]) {}
  verbose?(message: any, ...optionalParams: any[]) {}
}
```

## Extend Built-in Logger

```typescript
import { ConsoleLogger } from '@nestjs/common';

export class MyLogger extends ConsoleLogger {
  error(message: any, stack?: string, context?: string) {
    // Custom logic (e.g., send to external service)
    super.error(message, stack, context);
  }
}
```

## Dependency Injection

Use DI for custom logger with configuration:

```typescript
// Create LoggerModule
@Module({
  providers: [MyLogger],
  exports: [MyLogger],
})
export class LoggerModule {}

// Use in main.ts
const app = await NestFactory.create(AppModule, { bufferLogs: true });
app.useLogger(app.get(MyLogger));
```

## Transient Logger

For unique logger instances per service:

```typescript
@Injectable({ scope: Scope.TRANSIENT })
export class MyLogger extends ConsoleLogger {}

// Usage
@Injectable()
export class CatsService {
  constructor(private myLogger: MyLogger) {
    this.myLogger.setContext('CatsService');
  }
}
```

<!--
Source references:
- https://docs.nestjs.com/techniques/logger
-->

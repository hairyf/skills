---
name: fundamentals-pipes
description: NestJS pipes for data transformation and validation
---

# Pipes

Pipes transform input data to the desired form or validate input data. They operate on arguments before route handlers are invoked.

## Built-in Pipes

- `ValidationPipe` - Validates DTOs
- `ParseIntPipe` - Parses strings to integers
- `ParseFloatPipe` - Parses strings to floats
- `ParseBoolPipe` - Parses strings to booleans
- `ParseArrayPipe` - Parses strings to arrays
- `ParseUUIDPipe` - Validates UUIDs
- `ParseEnumPipe` - Validates enum values
- `DefaultValuePipe` - Provides default values
- `ParseFilePipe` - Validates file uploads
- `ParseDatePipe` - Parses date strings

## Binding Pipes

### Parameter-level Binding

```typescript
@Get(':id')
async findOne(@Param('id', ParseIntPipe) id: number) {
  return this.catsService.findOne(id);
}
```

### With Options

```typescript
@Get(':id')
async findOne(
  @Param('id', new ParseIntPipe({ errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE }))
  id: number,
) {
  return this.catsService.findOne(id);
}
```

### Query Parameters

```typescript
@Get()
async findOne(@Query('id', ParseIntPipe) id: number) {
  return this.catsService.findOne(id);
}
```

## Custom Pipes

### Basic Pipe

```typescript
import { PipeTransform, Injectable, ArgumentMetadata } from '@nestjs/common';

@Injectable()
export class ValidationPipe implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata) {
    return value;
  }
}
```

### Validation Pipe with Zod

```typescript
import { PipeTransform, ArgumentMetadata, BadRequestException } from '@nestjs/common';
import { ZodSchema } from 'zod';

export class ZodValidationPipe implements PipeTransform {
  constructor(private schema: ZodSchema) {}

  transform(value: unknown, metadata: ArgumentMetadata) {
    try {
      const parsedValue = this.schema.parse(value);
      return parsedValue;
    } catch (error) {
      throw new BadRequestException('Validation failed');
    }
  }
}
```

Usage:

```typescript
@Post()
@UsePipes(new ZodValidationPipe(createCatSchema))
async create(@Body() createCatDto: CreateCatDto) {
  this.catsService.create(createCatDto);
}
```

### Validation Pipe with class-validator

```typescript
import { PipeTransform, Injectable, ArgumentMetadata, BadRequestException } from '@nestjs/common';
import { validate } from 'class-validator';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class ValidationPipe implements PipeTransform<any> {
  async transform(value: any, { metatype }: ArgumentMetadata) {
    if (!metatype || !this.toValidate(metatype)) {
      return value;
    }
    const object = plainToInstance(metatype, value);
    const errors = await validate(object);
    if (errors.length > 0) {
      throw new BadRequestException('Validation failed');
    }
    return value;
  }

  private toValidate(metatype: Function): boolean {
    const types: Function[] = [String, Boolean, Number, Array, Object];
    return !types.includes(metatype);
  }
}
```

### Transformation Pipe

```typescript
import { PipeTransform, Injectable, ArgumentMetadata, BadRequestException } from '@nestjs/common';

@Injectable()
export class ParseIntPipe implements PipeTransform<string, number> {
  transform(value: string, metadata: ArgumentMetadata): number {
    const val = parseInt(value, 10);
    if (isNaN(val)) {
      throw new BadRequestException('Validation failed');
    }
    return val;
  }
}
```

## Global Pipes

```typescript
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());
  await app.listen(3000);
}
```

Or via module:

```typescript
import { Module } from '@nestjs/common';
import { APP_PIPE } from '@nestjs/core';

@Module({
  providers: [
    {
      provide: APP_PIPE,
      useClass: ValidationPipe,
    },
  ],
})
export class AppModule {}
```

## Default Values

```typescript
@Get()
async findAll(
  @Query('activeOnly', new DefaultValuePipe(false), ParseBoolPipe) activeOnly: boolean,
  @Query('page', new DefaultValuePipe(0), ParseIntPipe) page: number,
) {
  return this.catsService.findAll({ activeOnly, page });
}
```

## Key Points

- Pipes run before route handlers
- Pipes can transform or validate data
- Use built-in `ValidationPipe` for DTO validation
- Pipes can be parameter, method, controller, or global scoped
- Pipes throw exceptions to stop execution
- Use `DefaultValuePipe` before `Parse*` pipes for optional parameters

<!--
Source references:
- https://docs.nestjs.com/pipes
- https://docs.nestjs.com/techniques/validation
-->

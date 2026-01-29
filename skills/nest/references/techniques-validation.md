---
name: techniques-validation
description: Data validation using ValidationPipe and class-validator in NestJS
---

# Validation

NestJS provides `ValidationPipe` for automatic validation of incoming requests using `class-validator` decorators.

## Installation

```bash
npm i --save class-validator class-transformer
```

## Global ValidationPipe

```typescript
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());
  await app.listen(3000);
}
```

## DTO with Validation

```typescript
import { IsString, IsInt, Min, Max } from 'class-validator';

export class CreateCatDto {
  @IsString()
  name: string;

  @IsInt()
  @Min(0)
  @Max(20)
  age: number;

  @IsString()
  breed: string;
}
```

## ValidationPipe Options

```typescript
app.useGlobalPipes(
  new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
    transformOptions: {
      enableImplicitConversion: true,
    },
  }),
);
```

## Common Options

- `whitelist` - Strip non-whitelisted properties
- `forbidNonWhitelisted` - Throw error on non-whitelisted properties
- `transform` - Automatically transform payloads to DTO instances
- `disableErrorMessages` - Disable error messages
- `validationError.target` - Expose target in ValidationError
- `stopAtFirstError` - Stop validation on first error

## Custom Validators

```typescript
import { registerDecorator, ValidationOptions } from 'class-validator';

export function IsLongerThan(property: string, validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'isLongerThan',
      target: object.constructor,
      propertyName: propertyName,
      constraints: [property],
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          const [relatedPropertyName] = args.constraints;
          const relatedValue = (args.object as any)[relatedPropertyName];
          return typeof value === 'string' && typeof relatedValue === 'string' && value.length > relatedValue.length;
        },
      },
    });
  };
}
```

## Validation Groups

```typescript
export class CreateUserDto {
  @IsString({ groups: ['registration'] })
  email: string;

  @IsString({ groups: ['update'] })
  password: string;
}
```

## Conditional Validation

```typescript
@ValidateIf((o) => o.type === 'email')
@IsEmail()
email: string;
```

## Key Points

- Use `ValidationPipe` globally for automatic validation
- Decorate DTO properties with `class-validator` decorators
- Enable `transform` to auto-transform payloads
- Use `whitelist` to strip unknown properties
- Create custom validators for complex validation
- Use validation groups for different scenarios

<!--
Source references:
- https://docs.nestjs.com/techniques/validation
-->

---
name: serialization
description: Response serialization with class-transformer
---

# Serialization

Serialization transforms objects before sending responses, using `class-transformer` decorators.

## Basic Usage

Use `ClassSerializerInterceptor` to automatically transform responses:

```typescript
import { Controller, Get, UseInterceptors } from '@nestjs/common';
import { ClassSerializerInterceptor } from '@nestjs/common';

@Controller('users')
@UseInterceptors(ClassSerializerInterceptor)
export class UsersController {
  @Get(':id')
  findOne() {
    return new UserEntity({
      id: 1,
      firstName: 'John',
      lastName: 'Doe',
      password: 'secret123',
    });
  }
}
```

## Exclude Properties

```typescript
import { Exclude } from 'class-transformer';

export class UserEntity {
  id: number;
  firstName: string;
  lastName: string;

  @Exclude()
  password: string;

  constructor(partial: Partial<UserEntity>) {
    Object.assign(this, partial);
  }
}
```

Response excludes `password`:

```json
{ "id": 1, "firstName": "John", "lastName": "Doe" }
```

## Expose Computed Properties

```typescript
import { Expose } from 'class-transformer';

export class UserEntity {
  firstName: string;
  lastName: string;

  @Expose()
  get fullName(): string {
    return `${this.firstName} ${this.lastName}`;
  }
}
```

## Transform Properties

```typescript
import { Transform } from 'class-transformer';

export class UserEntity {
  @Transform(({ value }) => value.name)
  role: RoleEntity;  // Outputs role.name instead of full object
}
```

## Serialization Options

Per-route options:

```typescript
import { SerializeOptions } from '@nestjs/common';

@Get()
@SerializeOptions({ excludePrefixes: ['_'] })
findAll() {
  return this.usersService.findAll();
}
```

## Transform Plain Objects

Force transformation of plain objects:

```typescript
@Get()
@UseInterceptors(ClassSerializerInterceptor)
@SerializeOptions({ type: UserEntity })
findOne() {
  return {
    id: 1,
    firstName: 'John',
    password: 'secret',  // Will be excluded
  };
}
```

## Global Interceptor

Apply globally:

```typescript
@Module({
  providers: [
    { provide: APP_INTERCEPTOR, useClass: ClassSerializerInterceptor },
  ],
})
export class AppModule {}
```

## Groups

Expose different fields based on groups:

```typescript
export class UserEntity {
  @Expose({ groups: ['admin'] })
  email: string;

  @Expose({ groups: ['admin', 'user'] })
  firstName: string;
}

// Controller
@SerializeOptions({ groups: ['admin'] })
@Get('admin')
findForAdmin() {}
```

## Key Points

- Must return class instances, not plain objects
- Works with WebSockets and Microservices
- `@Exclude()` and `@Expose()` from `class-transformer`
- Use `excludeExtraneousValues: true` to only include `@Expose()` fields

<!--
Source references:
- https://docs.nestjs.com/techniques/serialization
-->

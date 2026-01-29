---
name: core-controllers
description: NestJS controllers for handling HTTP requests and responses
---

# Controllers

Controllers are responsible for handling incoming HTTP requests and sending responses back to the client. They use decorators to define routes and handle different HTTP methods.

## Basic Controller

```typescript
import { Controller, Get } from '@nestjs/common';

@Controller('cats')
export class CatsController {
  @Get()
  findAll(): string {
    return 'This action returns all cats';
  }
}
```

## HTTP Method Decorators

Nest provides decorators for all standard HTTP methods:

```typescript
@Controller('cats')
export class CatsController {
  @Get()
  findAll() {
    return 'All cats';
  }

  @Post()
  create() {
    return 'Create cat';
  }

  @Put(':id')
  update(@Param('id') id: string) {
    return `Update cat ${id}`;
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return `Remove cat ${id}`;
  }

  @Patch(':id')
  patch(@Param('id') id: string) {
    return `Patch cat ${id}`;
  }
}
```

## Request Parameters

Use decorators to extract request data:

```typescript
@Controller('cats')
export class CatsController {
  @Get(':id')
  findOne(@Param('id') id: string) {
    return `Cat ${id}`;
  }

  @Post()
  create(@Body() createCatDto: CreateCatDto) {
    return this.catsService.create(createCatDto);
  }

  @Get()
  findAll(@Query('breed') breed?: string) {
    return this.catsService.findAll(breed);
  }

  @Get()
  findWithHeaders(@Headers('authorization') auth: string) {
    return this.catsService.find(auth);
  }
}
```

## Available Parameter Decorators

- `@Request()`, `@Req()` - Request object
- `@Response()`, `@Res()` - Response object (use with caution)
- `@Param(key?: string)` - Route parameters
- `@Body(key?: string)` - Request body
- `@Query(key?: string)` - Query parameters
- `@Headers(name?: string)` - Request headers
- `@Ip()` - Client IP address
- `@HostParam()` - Host parameters
- `@Session()` - Session object

## Status Codes and Headers

```typescript
@Post()
@HttpCode(204)
@Header('Cache-Control', 'no-store')
create() {
  return 'Created';
}

@Get()
@Redirect('https://nestjs.com', 301)
redirect() {
  return;
}
```

## Route Wildcards

```typescript
@Get('abcd/*')
findAll() {
  return 'Wildcard route';
}
```

## Sub-domain Routing

```typescript
@Controller({ host: 'admin.example.com' })
export class AdminController {
  @Get()
  index(): string {
    return 'Admin page';
  }
}
```

## Async Handlers

Controllers can return Promises or Observables:

```typescript
@Get()
async findAll(): Promise<Cat[]> {
  return this.catsService.findAll();
}

@Get()
findAll(): Observable<Cat[]> {
  return of([]);
}
```

## Key Points

- Controllers must be registered in a module's `controllers` array
- Use DTOs (Data Transfer Objects) for request body validation
- Prefer returning values over using `@Res()` for better compatibility
- Route parameters should be declared after static paths
- Use `@HttpCode()` to set custom status codes
- Use `@Header()` to set custom response headers

<!--
Source references:
- https://docs.nestjs.com/controllers
-->

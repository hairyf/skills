---
name: request-lifecycle
description: Understanding the request processing flow in NestJS
---

# Request Lifecycle

Understanding execution order helps debug and optimize NestJS applications.

## Lifecycle Flow

```
1. Incoming Request
    ↓
2. Middleware
    ├── 2.1 Global middleware
    └── 2.2 Module middleware
    ↓
3. Guards
    ├── 3.1 Global guards
    ├── 3.2 Controller guards
    └── 3.3 Route guards
    ↓
4. Interceptors (pre-controller)
    ├── 4.1 Global interceptors
    ├── 4.2 Controller interceptors
    └── 4.3 Route interceptors
    ↓
5. Pipes
    ├── 5.1 Global pipes
    ├── 5.2 Controller pipes
    ├── 5.3 Route pipes
    └── 5.4 Route parameter pipes
    ↓
6. Controller (method handler)
    ↓
7. Service
    ↓
8. Interceptors (post-request)
    ├── 8.1 Route interceptors
    ├── 8.2 Controller interceptors
    └── 8.3 Global interceptors
    ↓
9. Exception Filters (on error)
    ├── 9.1 Route filters
    ├── 9.2 Controller filters
    └── 9.3 Global filters
    ↓
10. Server Response
```

## Middleware

- **Global first**: `app.use()` runs before module-bound middleware
- **Sequential**: Runs in order of binding
- **Module order**: Follows module import order in `AppModule`

## Guards

- Execute in order: Global → Controller → Route
- Within same level: Order of decorator parameters

```typescript
@UseGuards(Guard1, Guard2)
@Controller('cats')
export class CatsController {
  @UseGuards(Guard3)
  @Get()
  findAll() {}
}
// Execution: Guard1 → Guard2 → Guard3
```

## Interceptors

- **Pre-controller**: Global → Controller → Route
- **Post-request**: Route → Controller → Global (reverse order)
- Uses RxJS Observables (first in, last out)

## Pipes

- Execute: Global → Controller → Route → Parameters
- **Parameters**: Last parameter first

```typescript
@UsePipes(GeneralPipe)
@Controller()
export class CatsController {
  @UsePipes(RoutePipe)
  @Patch(':id')
  update(
    @Body() body,      // Processed third
    @Param() params,   // Processed second
    @Query() query,    // Processed first
  ) {}
}
// GeneralPipe runs on query → params → body
// Then RoutePipe on query → params → body
```

## Exception Filters

- **Unique behavior**: Lowest level first (opposite of others)
- Route → Controller → Global
- Only one filter handles the exception (no chaining)

```typescript
@UseFilters(GlobalFilter)
@Controller()
@UseFilters(ControllerFilter)
export class CatsController {
  @UseFilters(RouteFilter)
  @Get()
  findAll() {}
}
// If exception: RouteFilter catches first
// If no route filter: ControllerFilter catches
// If no controller filter: GlobalFilter catches
```

## Best Practices

### Middleware
- Use for logging, authentication setup
- Modify request/response objects
- Call `next()` to continue

### Guards
- Authorization and authentication checks
- Return `true`/`false` or throw exception
- Access `ExecutionContext`

### Interceptors
- Transform response data
- Add extra logic before/after handler
- Handle timeouts, caching

### Pipes
- Validate and transform input data
- Use `ValidationPipe` for DTOs
- Throw `BadRequestException` on failure

### Exception Filters
- Catch and handle errors
- Format error responses
- Log errors

## Debugging Tips

1. Add logging at each layer to trace flow
2. Check guard order if authorization fails
3. Verify pipe order for validation issues
4. Use `try/catch` carefully (bypasses filters)

<!--
Source references:
- https://docs.nestjs.com/faq/request-lifecycle
-->

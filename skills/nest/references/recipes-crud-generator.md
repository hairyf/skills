---
name: recipes-crud-generator
description: Using Nest CLI to generate CRUD resources
---

# CRUD Generator

Nest CLI provides a resource generator that automatically creates all boilerplate code for CRUD operations.

## Generate Resource

```bash
nest g resource
```

The generator will prompt for:
- Resource name
- Transport layer (REST API, GraphQL, Microservice, WebSocket)
- Whether to generate CRUD entry points

## Generated Files

For REST API, generates:
- Module file (`users.module.ts`)
- Controller file (`users.controller.ts`)
- Service file (`users.service.ts`)
- DTO files (`create-user.dto.ts`, `update-user.dto.ts`)
- Entity file (`user.entity.ts`)
- Test files (`.spec.ts`)

## Generated Controller

```typescript
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(+id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(+id);
  }
}
```

## GraphQL Support

For GraphQL applications, generates resolvers instead of controllers:

```bash
nest g resource users
# Select: GraphQL (code first)
# Select: Yes for CRUD entry points
```

## Key Points

- Generates all CRUD boilerplate automatically
- Supports REST, GraphQL, Microservices, and WebSockets
- Service methods contain placeholders for implementation
- Not tied to any specific ORM
- Includes test files
- Saves significant development time

<!--
Source references:
- https://docs.nestjs.com/recipes/crud-generator
-->

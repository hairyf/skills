---
name: recipes-documentation
description: OpenAPI/Swagger documentation setup in NestJS
---

# API Documentation

NestJS provides integration with Swagger/OpenAPI for automatic API documentation generation.

## Installation

```bash
npm install --save @nestjs/swagger
```

## Basic Setup

```typescript
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
    .setTitle('Cats example')
    .setDescription('The cats API description')
    .setVersion('1.0')
    .addTag('cats')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(3000);
}
bootstrap();
```

## DTO Decorators

```typescript
import { ApiProperty } from '@nestjs/swagger';

export class CreateCatDto {
  @ApiProperty()
  name: string;

  @ApiProperty()
  age: number;

  @ApiProperty()
  breed: string;
}
```

## Controller Decorators

```typescript
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('cats')
@Controller('cats')
export class CatsController {
  @Post()
  @ApiOperation({ summary: 'Create a new cat' })
  @ApiResponse({ status: 201, description: 'The cat has been successfully created.' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  create(@Body() createCatDto: CreateCatDto) {
    return this.catsService.create(createCatDto);
  }
}
```

## Security

```typescript
const config = new DocumentBuilder()
  .addBearerAuth()
  .build();
```

## Key Points

- Use `@nestjs/swagger` for OpenAPI integration
- Decorate DTOs with `@ApiProperty()`
- Use `@ApiTags()` to group endpoints
- Add `@ApiOperation()` and `@ApiResponse()` for documentation
- Configure security schemes for authentication
- Access docs at `/api` endpoint

<!--
Source references:
- https://docs.nestjs.com/openapi/introduction
-->

---
name: openapi-swagger
description: OpenAPI/Swagger documentation generation
---

# OpenAPI (Swagger)

Generate interactive API documentation using the OpenAPI specification.

## Installation

```bash
npm install @nestjs/swagger
```

## Basic Setup

```typescript
import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
    .setTitle('Cats API')
    .setDescription('The cats API description')
    .setVersion('1.0')
    .addTag('cats')
    .addBearerAuth()
    .build();
    
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, documentFactory);

  await app.listen(3000);
}
bootstrap();
```

Access Swagger UI at `http://localhost:3000/api`

## DTO Documentation

Use `@ApiProperty()` to document DTO properties:

```typescript
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateCatDto {
  @ApiProperty({ description: 'The name of the cat' })
  name: string;

  @ApiProperty({ minimum: 0, maximum: 30, default: 1 })
  age: number;

  @ApiPropertyOptional({ example: 'Persian' })
  breed?: string;

  @ApiProperty({ enum: ['male', 'female'] })
  gender: string;

  @ApiProperty({ type: [String] })
  tags: string[];
}
```

## Common Decorators

| Decorator | Level | Purpose |
|-----------|-------|---------|
| `@ApiTags()` | Controller/Method | Group endpoints |
| `@ApiOperation()` | Method | Describe operation |
| `@ApiResponse()` | Method/Controller | Document responses |
| `@ApiParam()` | Method | Document URL params |
| `@ApiQuery()` | Method | Document query params |
| `@ApiBody()` | Method | Document request body |
| `@ApiBearerAuth()` | Method/Controller | Mark as authenticated |
| `@ApiProperty()` | Model | Document property |
| `@ApiHideProperty()` | Model | Hide property |
| `@ApiExcludeEndpoint()` | Method | Exclude from docs |

## Controller Documentation

```typescript
import { 
  ApiTags, 
  ApiOperation, 
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';

@ApiTags('cats')
@ApiBearerAuth()
@Controller('cats')
export class CatsController {
  @Post()
  @ApiOperation({ summary: 'Create a cat' })
  @ApiResponse({ status: 201, description: 'Cat created successfully' })
  @ApiResponse({ status: 400, description: 'Invalid input' })
  create(@Body() dto: CreateCatDto) {
    return this.catsService.create(dto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a cat by ID' })
  @ApiParam({ name: 'id', description: 'Cat ID' })
  @ApiResponse({ status: 200, type: Cat })
  @ApiResponse({ status: 404, description: 'Cat not found' })
  findOne(@Param('id') id: string) {
    return this.catsService.findOne(id);
  }
}
```

## Enums

```typescript
export enum CatStatus {
  Available = 'available',
  Pending = 'pending',
  Sold = 'sold',
}

@ApiProperty({ 
  enum: CatStatus, 
  enumName: 'CatStatus' 
})
status: CatStatus;
```

## Authentication

```typescript
const config = new DocumentBuilder()
  .addBearerAuth()
  .addApiKey({ type: 'apiKey', name: 'X-API-Key', in: 'header' }, 'api-key')
  .addOAuth2()
  .build();

// Apply to endpoints
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@Get('profile')
getProfile() {}
```

## CLI Plugin

Auto-document DTOs by adding to `nest-cli.json`:

```json
{
  "compilerOptions": {
    "plugins": ["@nestjs/swagger"]
  }
}
```

With options:

```json
{
  "plugins": [
    {
      "name": "@nestjs/swagger",
      "options": {
        "classValidatorShim": true,
        "introspectComments": true
      }
    }
  ]
}
```

## Document Options

```typescript
const documentFactory = () => SwaggerModule.createDocument(app, config, {
  include: [CatsModule],        // Only include specific modules
  extraModels: [ExtraModel],    // Add extra models
  ignoreGlobalPrefix: false,    // Include global prefix
  deepScanRoutes: true,         // Scan imported modules
});
```

## Setup Options

```typescript
SwaggerModule.setup('api', app, documentFactory, {
  jsonDocumentUrl: '/api-json',
  yamlDocumentUrl: '/api-yaml',
  customSiteTitle: 'My API Docs',
  customCss: '.swagger-ui .topbar { display: none }',
  swaggerOptions: {
    persistAuthorization: true,
  },
});
```

<!--
Source references:
- https://docs.nestjs.com/openapi/introduction
- https://docs.nestjs.com/openapi/types-and-parameters
- https://docs.nestjs.com/openapi/decorators
-->

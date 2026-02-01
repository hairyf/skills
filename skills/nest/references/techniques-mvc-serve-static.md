---
name: mvc-serve-static
description: MVC template rendering and serving static files/SPA
---

# MVC and Serve Static

## MVC (Template Rendering)

### Express Setup

```bash
npm install hbs
```

```typescript
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'node:path';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.useStaticAssets(join(__dirname, '..', 'public'));
  app.setBaseViewsDir(join(__dirname, '..', 'views'));
  app.setViewEngine('hbs');
  await app.listen(3000);
}
bootstrap();
```

### Controller with @Render

```typescript
import { Get, Controller, Render } from '@nestjs/common';

@Controller()
export class AppController {
  @Get()
  @Render('index')
  root() {
    return { message: 'Hello world!' };
  }
}
```

### Dynamic Template Selection

```typescript
import { Get, Controller, Res } from '@nestjs/common';
import { Response } from 'express';

@Controller()
export class AppController {
  @Get()
  root(@Res() res: Response) {
    return res.render('dynamic-view', { message: 'Hello!' });
  }
}
```

### Fastify

```bash
npm install @fastify/static @fastify/view handlebars
```

```typescript
const app = await NestFactory.create<NestFastifyApplication>(
  AppModule,
  new FastifyAdapter(),
);
app.useStaticAssets({
  root: join(__dirname, '..', 'public'),
  prefix: '/public/',
});
app.setViewEngine({
  engine: { handlebars: require('handlebars') },
  templates: join(__dirname, '..', 'views'),
});
```

With Fastify, include file extension in `@Render()`: `@Render('index.hbs')`

## Serve Static (SPA)

Serve static content like Single Page Applications.

```bash
npm install @nestjs/serve-static
```

```typescript
import { Module } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'client'),
    }),
  ],
})
export class AppModule {}
```

### SPA Client-Side Routing

Default `renderPath` is `*` (all paths). The module sends `index.html` for non-matching routes, enabling client-side routing. Controller paths take precedence.

### Configuration Options

| Option | Description |
|--------|-------------|
| `rootPath` | Path to static files |
| `serveRoot` | URL path prefix |
| `renderPath` | Paths to serve index.html |
| `exclude` | Excluded paths |

## Key Points

- Use `NestExpressApplication` or `NestFastifyApplication` for MVC
- `@Render()` passes return object to template as variables
- ServeStatic fallback enables SPA routing
- Fastify: set `serveStaticOptions.fallthrough: true` for SPA fallback

<!--
Source references:
- https://docs.nestjs.com/techniques/mvc
- https://docs.nestjs.com/recipes/serve-static
-->

---
name: sessions-cookies
description: HTTP sessions and cookies for stateful applications
---

# Sessions and Cookies

## Sessions

### Express (Default)

```bash
npm install express-session
npm install -D @types/express-session
```

```typescript
import * as session from 'express-session';

// main.ts
app.use(
  session({
    secret: 'my-secret',
    resave: false,
    saveUninitialized: false,
  }),
);
```

Usage in controllers:

```typescript
@Get()
findAll(@Req() request: Request) {
  request.session.visits = (request.session.visits ?? 0) + 1;
}

// Or using @Session decorator
@Get()
findAll(@Session() session: Record<string, any>) {
  session.visits = (session.visits ?? 0) + 1;
}
```

### Fastify

```bash
npm install @fastify/secure-session
```

```typescript
import secureSession from '@fastify/secure-session';

const app = await NestFactory.create<NestFastifyApplication>(
  AppModule,
  new FastifyAdapter(),
);

await app.register(secureSession, {
  secret: 'averylogphrasebiggerthanthirtytwochars',
  salt: 'mq9hDxBVDbspDR6n',
});
```

```typescript
@Get()
findAll(@Req() request: FastifyRequest) {
  const visits = request.session.get('visits') ?? 0;
  request.session.set('visits', visits + 1);
}
```

## Cookies

### Express (Default)

```bash
npm install cookie-parser
npm install -D @types/cookie-parser
```

```typescript
import * as cookieParser from 'cookie-parser';

app.use(cookieParser());
```

Reading and setting cookies:

```typescript
@Get()
getCookies(@Req() request: Request) {
  console.log(request.cookies);
  console.log(request.signedCookies);
}

@Get()
setCookie(@Res({ passthrough: true }) response: Response) {
  response.cookie('key', 'value', {
    httpOnly: true,
    secure: true,
    maxAge: 1000 * 60 * 60 * 24, // 1 day
  });
}
```

### Fastify

```bash
npm install @fastify/cookie
```

```typescript
import fastifyCookie from '@fastify/cookie';

await app.register(fastifyCookie, {
  secret: 'my-secret',
});
```

```typescript
@Get()
setCookie(@Res({ passthrough: true }) response: FastifyReply) {
  response.setCookie('key', 'value');
}
```

## Custom Cookie Decorator

```typescript
import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const Cookies = createParamDecorator(
  (data: string, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return data ? request.cookies?.[data] : request.cookies;
  },
);

// Usage
@Get()
findAll(@Cookies('name') name: string) {}
```

## Session Configuration Options

| Option | Description |
|--------|-------------|
| `secret` | Used to sign session ID cookie |
| `resave` | Force save even if unmodified (set to `false`) |
| `saveUninitialized` | Save uninitialized sessions (set to `false` for login flows) |
| `cookie.secure` | Require HTTPS (recommended for production) |
| `cookie.httpOnly` | Prevent client-side access |

## Key Points

- Default session storage is not for production (leaks memory)
- Use Redis or database-backed session store in production
- Set `secure: true` for production cookies
- Use `passthrough: true` with `@Res()` to keep NestJS response handling
- Session decorator is `@Session()` from `@nestjs/common`

<!--
Source references:
- https://docs.nestjs.com/techniques/session
- https://docs.nestjs.com/techniques/cookies
-->

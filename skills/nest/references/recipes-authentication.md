---
name: recipes-authentication
description: Authentication with Passport in NestJS
---

# Authentication

NestJS integrates with Passport for authentication strategies.

## Installation

```bash
npm install --save @nestjs/passport passport passport-local
npm install --save-dev @types/passport-local
```

## Local Strategy

```typescript
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { AuthService } from './auth.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super();
  }

  async validate(username: string, password: string): Promise<any> {
    const user = await this.authService.validateUser(username, password);
    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
  }
}
```

## JWT Strategy

```bash
npm install --save @nestjs/jwt passport-jwt
npm install --save-dev @types/passport-jwt
```

```typescript
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: 'secret',
    });
  }

  async validate(payload: any) {
    return { userId: payload.sub, username: payload.username };
  }
}
```

## Using Guards

```typescript
@UseGuards(AuthGuard('local'))
@Post('auth/login')
async login(@Request() req) {
  return req.user;
}

@UseGuards(AuthGuard('jwt'))
@Get('profile')
getProfile(@Request() req) {
  return req.user;
}
```

## Key Points

- Use `@nestjs/passport` for Passport integration
- Create strategies extending `PassportStrategy`
- Use `AuthGuard` with strategy name
- JWT tokens for stateless authentication
- Local strategy for username/password
- User object available in `request.user`

<!--
Source references:
- https://docs.nestjs.com/security/authentication
-->

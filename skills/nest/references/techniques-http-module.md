---
name: http-module
description: Making HTTP requests with @nestjs/axios
---

# HTTP Module

NestJS wraps Axios for making HTTP requests to external services.

## Installation

```bash
npm install @nestjs/axios axios
```

## Setup

```typescript
import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [HttpModule],
  providers: [CatsService],
})
export class CatsModule {}
```

## Basic Usage

```typescript
import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { AxiosResponse } from 'axios';

@Injectable()
export class CatsService {
  constructor(private readonly httpService: HttpService) {}

  // Using Observable
  findAll(): Observable<AxiosResponse<Cat[]>> {
    return this.httpService.get('https://api.example.com/cats');
  }

  // Using Promise
  async findAllAsync(): Promise<Cat[]> {
    const { data } = await firstValueFrom(
      this.httpService.get<Cat[]>('https://api.example.com/cats'),
    );
    return data;
  }
}
```

## HTTP Methods

```typescript
// GET
this.httpService.get('/users');

// POST
this.httpService.post('/users', { name: 'John' });

// PUT
this.httpService.put('/users/1', { name: 'Jane' });

// PATCH
this.httpService.patch('/users/1', { name: 'Jane' });

// DELETE
this.httpService.delete('/users/1');
```

## Configuration

```typescript
HttpModule.register({
  timeout: 5000,
  maxRedirects: 5,
  baseURL: 'https://api.example.com',
  headers: {
    'Authorization': 'Bearer token',
  },
});
```

## Async Configuration

```typescript
HttpModule.registerAsync({
  imports: [ConfigModule],
  useFactory: async (configService: ConfigService) => ({
    timeout: configService.get('HTTP_TIMEOUT'),
    maxRedirects: configService.get('HTTP_MAX_REDIRECTS'),
    baseURL: configService.get('API_URL'),
  }),
  inject: [ConfigService],
});
```

## Error Handling

```typescript
import { catchError, firstValueFrom } from 'rxjs';
import { AxiosError } from 'axios';

async findAll(): Promise<Cat[]> {
  const { data } = await firstValueFrom(
    this.httpService.get<Cat[]>('/cats').pipe(
      catchError((error: AxiosError) => {
        this.logger.error(error.response?.data);
        throw new HttpException(
          'External API error',
          HttpStatus.BAD_GATEWAY,
        );
      }),
    ),
  );
  return data;
}
```

## Direct Axios Access

Access the underlying Axios instance:

```typescript
@Injectable()
export class CatsService {
  constructor(private readonly httpService: HttpService) {}

  async findAll(): Promise<Cat[]> {
    const { data } = await this.httpService.axiosRef.get('/cats');
    return data;
  }
}
```

## Interceptors

Add Axios interceptors:

```typescript
@Injectable()
export class CatsService implements OnModuleInit {
  constructor(private readonly httpService: HttpService) {}

  onModuleInit() {
    this.httpService.axiosRef.interceptors.request.use((config) => {
      config.headers['X-Request-Id'] = uuid();
      return config;
    });

    this.httpService.axiosRef.interceptors.response.use(
      (response) => response,
      (error) => {
        // Log error
        return Promise.reject(error);
      },
    );
  }
}
```

## Key Points

- Returns RxJS Observables by default
- Use `firstValueFrom` or `lastValueFrom` for Promises
- `AxiosResponse` is from `axios` package
- Configuration passed directly to Axios constructor

<!--
Source references:
- https://docs.nestjs.com/techniques/http-module
-->

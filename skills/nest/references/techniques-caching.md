---
name: caching
description: Caching with @nestjs/cache-manager and Redis integration
---

# Caching

Caching improves performance by storing frequently accessed data for quick retrieval.

## Installation

```bash
npm install @nestjs/cache-manager cache-manager
```

## Basic Setup

```typescript
import { Module } from '@nestjs/common';
import { CacheModule } from '@nestjs/cache-manager';

@Module({
  imports: [CacheModule.register()],
})
export class AppModule {}
```

## Interacting with Cache

Inject the cache manager:

```typescript
import { Injectable, Inject } from '@nestjs/common';
import { CACHE_MANAGER, Cache } from '@nestjs/cache-manager';

@Injectable()
export class CatsService {
  constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {}

  async getCats() {
    // Get from cache
    const cached = await this.cacheManager.get('cats');
    if (cached) return cached;

    const cats = await this.fetchCats();
    
    // Set with TTL (milliseconds)
    await this.cacheManager.set('cats', cats, 60000);
    return cats;
  }

  async clearCache() {
    await this.cacheManager.del('cats');
    // Or clear all
    await this.cacheManager.clear();
  }
}
```

## Auto-caching Responses

Use `CacheInterceptor` for automatic GET endpoint caching:

```typescript
import { Controller, Get, UseInterceptors } from '@nestjs/common';
import { CacheInterceptor, CacheKey, CacheTTL } from '@nestjs/cache-manager';

@Controller('cats')
@UseInterceptors(CacheInterceptor)
export class CatsController {
  @Get()
  @CacheKey('all-cats')
  @CacheTTL(30000)
  findAll() {
    return this.catsService.findAll();
  }
}
```

Global cache interceptor:

```typescript
@Module({
  providers: [
    { provide: APP_INTERCEPTOR, useClass: CacheInterceptor },
  ],
})
export class AppModule {}
```

## Configuration

```typescript
CacheModule.register({
  ttl: 5000,        // Default TTL in milliseconds
  isGlobal: true,   // Available everywhere without importing
});
```

## Redis Integration

Install Redis adapter:

```bash
npm install @keyv/redis
```

Configure multiple stores:

```typescript
import { CacheModule } from '@nestjs/cache-manager';
import KeyvRedis from '@keyv/redis';
import { Keyv } from 'keyv';
import { CacheableMemory } from 'cacheable';

@Module({
  imports: [
    CacheModule.registerAsync({
      useFactory: async () => ({
        stores: [
          new Keyv({ store: new CacheableMemory({ ttl: 60000 }) }),
          new KeyvRedis('redis://localhost:6379'),
        ],
      }),
    }),
  ],
})
export class AppModule {}
```

## Key Points

- Only GET endpoints are auto-cached
- `CacheInterceptor` doesn't work with GraphQL field resolvers
- Use `@CacheKey()` for custom cache keys
- Set `ttl: 0` for no expiration
- Works with WebSockets and Microservices

<!--
Source references:
- https://docs.nestjs.com/techniques/caching
-->

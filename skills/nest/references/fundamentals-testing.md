---
name: testing
description: Unit testing and e2e testing in NestJS with @nestjs/testing
---

# Testing

NestJS provides utilities for unit and end-to-end testing, with built-in Jest and Supertest integration.

## Installation

```bash
npm i --save-dev @nestjs/testing
```

## Unit Testing

### Basic Test Setup

```typescript
import { Test } from '@nestjs/testing';
import { CatsController } from './cats.controller';
import { CatsService } from './cats.service';

describe('CatsController', () => {
  let controller: CatsController;
  let service: CatsService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [CatsController],
      providers: [CatsService],
    }).compile();

    service = moduleRef.get(CatsService);
    controller = moduleRef.get(CatsController);
  });

  it('should return cats', async () => {
    const result = ['cat'];
    jest.spyOn(service, 'findAll').mockImplementation(() => result);
    expect(await controller.findAll()).toBe(result);
  });
});
```

### Auto Mocking

Use `useMocker()` to automatically mock dependencies:

```typescript
const moduleRef = await Test.createTestingModule({
  controllers: [CatsController],
})
  .useMocker((token) => {
    if (token === CatsService) {
      return { findAll: jest.fn().mockResolvedValue(['cat']) };
    }
  })
  .compile();
```

### Overriding Providers

```typescript
const moduleRef = await Test.createTestingModule({
  imports: [CatsModule],
})
  .overrideProvider(CatsService)
  .useValue(mockCatsService)
  .compile();
```

## End-to-End Testing

```typescript
import * as request from 'supertest';
import { Test } from '@nestjs/testing';
import { CatsModule } from '../src/cats/cats.module';
import { INestApplication } from '@nestjs/common';

describe('Cats', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [CatsModule],
    })
      .overrideProvider(CatsService)
      .useValue({ findAll: () => ['test'] })
      .compile();

    app = moduleRef.createNestApplication();
    await app.init();
  });

  it('/GET cats', () => {
    return request(app.getHttpServer())
      .get('/cats')
      .expect(200)
      .expect({ data: ['test'] });
  });

  afterAll(async () => {
    await app.close();
  });
});
```

## Testing Scoped Providers

```typescript
const contextId = ContextIdFactory.create();
jest.spyOn(ContextIdFactory, 'getByRequest').mockImplementation(() => contextId);

const service = await moduleRef.resolve(CatsService, contextId);
```

## Override Methods

| Method | Purpose |
|--------|---------|
| `overrideProvider()` | Override a provider |
| `overrideModule()` | Override a module |
| `overrideGuard()` | Override a guard |
| `overrideInterceptor()` | Override an interceptor |
| `overrideFilter()` | Override an exception filter |
| `overridePipe()` | Override a pipe |

Each returns an object with `useClass`, `useValue`, or `useFactory`.

## Key Points

- Keep test files near source files with `.spec.ts` or `.test.ts` suffix
- E2E tests go in `test/` directory with `.e2e-spec.ts` suffix
- `compile()` is async and must be awaited
- Use `resolve()` for scoped providers instead of `get()`

<!--
Source references:
- https://docs.nestjs.com/fundamentals/testing
-->

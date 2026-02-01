---
name: terminus
description: Health checks and readiness/liveness probes with @nestjs/terminus
---

# Health Checks (Terminus)

Readiness/liveness probes for Kubernetes and orchestration.

## Installation

```bash
npm install @nestjs/terminus
```

## Basic Setup

```typescript
@Module({
  imports: [TerminusModule],
})
export class HealthModule {}

@Controller('health')
export class HealthController {
  constructor(
    private health: HealthCheckService,
    private http: HttpHealthIndicator,
  ) {}

  @Get()
  @HealthCheck()
  check() {
    return this.health.check([
      () => this.http.pingCheck('nestjs-docs', 'https://docs.nestjs.com'),
    ]);
  }
}
```

## Health Indicators

| Indicator | Purpose |
|-----------|---------|
| `HttpHealthIndicator` | HTTP ping |
| `TypeOrmHealthIndicator` | Database (SELECT 1) |
| `MongooseHealthIndicator` | MongoDB |
| `PrismaHealthIndicator` | Prisma |
| `MemoryHealthIndicator` | Heap/RSS limits |
| `DiskHealthIndicator` | Disk space |
| `MicroserviceHealthIndicator` | Microservice |
| `GRPCHealthIndicator` | gRPC |

## TypeORM

```typescript
constructor(
  private health: HealthCheckService,
  private db: TypeOrmHealthIndicator,
) {}

@Get()
@HealthCheck()
check() {
  return this.health.check([
    () => this.db.pingCheck('database'),
  ]);
}
```

Multiple databases: inject connections and pass to `pingCheck('name', { connection })`.

## Memory

```typescript
return this.health.check([
  () => this.memory.checkHeap('memory_heap', 150 * 1024 * 1024),  // 150MB
  () => this.memory.checkRSS('memory_rss', 150 * 1024 * 1024),
]);
```

## Disk

```typescript
return this.health.check([
  () => this.disk.checkStorage('storage', { path: '/', thresholdPercent: 0.5 }),
  () => this.disk.checkStorage('storage', { path: '/', threshold: 250 * 1024 * 1024 * 1024 }),
]);
```

## HTTP Response Check

```typescript
() => this.http.responseCheck(
  'my-service',
  'https://my-service.com',
  (res) => res.status === 204,
),
```

## Custom Indicator

```typescript
@Injectable()
export class DogHealthIndicator {
  constructor(private health: HealthIndicatorService) {}

  async isHealthy(key: string) {
    const indicator = this.health.check(key);
    const isHealthy = /* custom logic */;
    if (!isHealthy) return indicator.down({ reason: '...' });
    return indicator.up();
  }
}
```

## Response Format

```json
{
  "status": "ok",
  "info": { "database": { "status": "up" } },
  "error": {},
  "details": { "database": { "status": "up" } }
}
```

Status: `'ok' | 'error' | 'shutting_down'`

## Graceful Shutdown

```typescript
TerminusModule.forRoot({
  gracefulShutdownTimeoutMs: 1000,
}),
```

## Key Points

- Enable shutdown hooks for Terminus lifecycle
- Use `@HealthCheck()` decorator on endpoints
- `HttpHealthIndicator` requires `@nestjs/axios`
- Custom indicators extend `HealthIndicatorService`

<!--
Source references:
- https://docs.nestjs.com/recipes/terminus
-->

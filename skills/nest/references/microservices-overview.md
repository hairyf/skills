---
name: microservices
description: Building microservices with various transport layers
---

# Microservices

NestJS supports microservice architecture with multiple transport protocols.

## Installation

```bash
npm install @nestjs/microservices
```

## Available Transporters

| Transport | Package |
|-----------|---------|
| TCP | Built-in |
| Redis | `redis` |
| MQTT | `mqtt` |
| NATS | `nats` |
| RabbitMQ | `amqplib` |
| Kafka | `kafkajs` |
| gRPC | `@grpc/grpc-js` |

## Creating a Microservice

```typescript
// main.ts
import { NestFactory } from '@nestjs/core';
import { Transport, MicroserviceOptions } from '@nestjs/microservices';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.TCP,
      options: { host: 'localhost', port: 3001 },
    },
  );
  await app.listen();
}
bootstrap();
```

## Hybrid Application

Combine HTTP and microservice:

```typescript
const app = await NestFactory.create(AppModule);
app.connectMicroservice<MicroserviceOptions>({
  transport: Transport.TCP,
  options: { port: 3001 },
});
await app.startAllMicroservices();
await app.listen(3000);
```

## Request-Response Pattern

### Handler (Microservice)

```typescript
import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';

@Controller()
export class MathController {
  @MessagePattern({ cmd: 'sum' })
  sum(@Payload() data: number[]): number {
    return data.reduce((a, b) => a + b, 0);
  }
}
```

### Client (Producer)

```typescript
import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'MATH_SERVICE',
        transport: Transport.TCP,
        options: { host: 'localhost', port: 3001 },
      },
    ]),
  ],
})
export class AppModule {}
```

```typescript
import { Injectable, Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class AppService {
  constructor(@Inject('MATH_SERVICE') private client: ClientProxy) {}

  async calculate(): Promise<number> {
    const pattern = { cmd: 'sum' };
    const payload = [1, 2, 3, 4, 5];
    return firstValueFrom(this.client.send<number>(pattern, payload));
  }
}
```

## Event-Based Pattern

### Handler

```typescript
@EventPattern('user_created')
async handleUserCreated(@Payload() data: CreateUserEvent) {
  await this.usersService.processNewUser(data);
}
```

### Emitter

```typescript
async createUser(dto: CreateUserDto) {
  const user = await this.usersRepository.create(dto);
  this.client.emit('user_created', new CreateUserEvent(user));
  return user;
}
```

## Accessing Context

```typescript
import { Ctx, Payload, NatsContext } from '@nestjs/microservices';

@MessagePattern('time.us.*')
getDate(@Payload() data: any, @Ctx() context: NatsContext) {
  console.log(`Subject: ${context.getSubject()}`);
  return new Date().toISOString();
}
```

## Async Configuration

```typescript
ClientsModule.registerAsync([
  {
    name: 'MATH_SERVICE',
    imports: [ConfigModule],
    useFactory: async (configService: ConfigService) => ({
      transport: Transport.TCP,
      options: {
        host: configService.get('MATH_HOST'),
        port: configService.get('MATH_PORT'),
      },
    }),
    inject: [ConfigService],
  },
]);
```

## Timeout Handling

```typescript
import { timeout } from 'rxjs/operators';

this.client
  .send<number>({ cmd: 'sum' }, [1, 2, 3])
  .pipe(timeout(5000));
```

## TLS Support

```typescript
// Server
const app = await NestFactory.createMicroservice<MicroserviceOptions>(
  AppModule,
  {
    transport: Transport.TCP,
    options: {
      tlsOptions: {
        key: fs.readFileSync('key.pem'),
        cert: fs.readFileSync('cert.pem'),
      },
    },
  },
);

// Client
ClientsModule.register([
  {
    name: 'SERVICE',
    transport: Transport.TCP,
    options: {
      tlsOptions: {
        ca: [fs.readFileSync('ca.pem')],
      },
    },
  },
]);
```

## Key Points

- `@MessagePattern()` for request-response (requires reply)
- `@EventPattern()` for fire-and-forget events
- Client connection is lazy (connects on first call)
- Use `firstValueFrom` to convert Observable to Promise
- TCP is the default transport

<!--
Source references:
- https://docs.nestjs.com/microservices/basics
-->

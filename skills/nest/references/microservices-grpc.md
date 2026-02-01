---
name: microservices-grpc
description: gRPC microservices with Protocol Buffers
---

# gRPC Microservices

High-performance RPC framework using Protocol Buffers.

## Installation

```bash
npm i @grpc/grpc-js @grpc/proto-loader
```

## Server Setup

```typescript
const app = await NestFactory.createMicroservice<MicroserviceOptions>(AppModule, {
  transport: Transport.GRPC,
  options: {
    package: 'hero',
    protoPath: join(__dirname, 'hero/hero.proto'),
    url: '0.0.0.0:50051',
  },
});
```

## Proto Definition

```protobuf
// hero.proto
syntax = "proto3";

package hero;

service HeroesService {
  rpc FindOne (HeroById) returns (Hero) {}
}

message HeroById {
  int32 id = 1;
}

message Hero {
  int32 id = 1;
  string name = 2;
}
```

## nest-cli.json (Copy Proto Files)

```json
{
  "compilerOptions": {
    "assets": ["**/*.proto"],
    "watchAssets": true
  }
}
```

## Controller

```typescript
@Controller()
export class HeroesController {
  @GrpcMethod('HeroesService', 'FindOne')
  findOne(data: HeroById, metadata: Metadata, call: ServerUnaryCall<any, any>): Hero {
    return this.items.find(({ id }) => id === data.id);
  }
}
```

Omit decorator args for auto-binding: `@GrpcMethod()` uses class/method name.

## Client

```typescript
ClientsModule.register([
  {
    name: 'HERO_PACKAGE',
    transport: Transport.GRPC,
    options: {
      package: 'hero',
      protoPath: join(__dirname, 'hero/hero.proto'),
    },
  },
]),
```

```typescript
@Injectable()
export class AppService implements OnModuleInit {
  private heroesService: HeroesService;

  constructor(@Inject('HERO_PACKAGE') private client: ClientGrpc) {}

  onModuleInit() {
    this.heroesService = this.client.getService<HeroesService>('HeroesService');
  }

  getHero() {
    return this.heroesService.findOne({ id: 1 });
  }
}
```

## gRPC Metadata

```typescript
// Send
const metadata = new Metadata();
metadata.add('Set-Cookie', 'yummy_cookie=choco');
return this.heroesService.findOne({ id: 1 }, metadata);

// Receive and respond
findOne(data, metadata: Metadata, call: ServerUnaryCall<any, any>) {
  const serverMetadata = new Metadata();
  serverMetadata.add('Set-Cookie', 'choco');
  call.sendMetadata(serverMetadata);
  return hero;
}
```

## Streaming

Use `@GrpcStreamMethod()` for duplex streams:

```typescript
@GrpcStreamMethod()
bidiHello(messages: Observable<any>, metadata, call): Observable<any> {
  return messages.pipe(
    map((msg) => ({ reply: `Hello, ${msg.greeting}!` })),
  );
}
```

Or `@GrpcStreamCall()` for raw stream access:

```typescript
@GrpcStreamCall()
bidiHello(requestStream: any) {
  requestStream.on('data', (msg) => {
    requestStream.write({ reply: 'Hello!' });
  });
}
```

## gRPC Reflection

```bash
npm i @grpc/reflection
```

```typescript
import { ReflectionService } from '@grpc/reflection';

options: {
  onLoadPackageDefinition: (pkg, server) => {
    new ReflectionService(pkg).addToServer(server);
  },
},
```

## Key Points

- Use `ClientGrpc.getService()` not `ClientProxy`
- Methods are lowerCamelCase in TypeScript
- Set `loader.keepCase: true` for underscore field names
- Streaming handlers must return `Observable` for full-duplex

<!--
Source references:
- https://docs.nestjs.com/microservices/grpc
-->

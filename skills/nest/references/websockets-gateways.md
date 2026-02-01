---
name: websockets
description: Real-time communication with WebSocket gateways
---

# WebSockets

NestJS provides WebSocket support through gateways, with built-in adapters for Socket.IO and ws.

## Installation

```bash
npm install @nestjs/websockets @nestjs/platform-socket.io
```

## Basic Gateway

```typescript
import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway()
export class EventsGateway {
  @WebSocketServer()
  server: Server;

  @SubscribeMessage('events')
  handleEvent(@MessageBody() data: string): string {
    return data; // Sends acknowledgment
  }
}
```

## Gateway Configuration

```typescript
@WebSocketGateway(81, {
  namespace: 'events',
  cors: { origin: '*' },
  transports: ['websocket'],
})
export class EventsGateway {}
```

## Message Handlers

```typescript
@SubscribeMessage('message')
handleMessage(
  @MessageBody() data: { text: string },
  @ConnectedSocket() client: Socket,
): WsResponse<string> {
  // Return emits event back to client
  return { event: 'response', data: data.text };
}

// Extract specific property
@SubscribeMessage('message')
handleMessage(@MessageBody('id') id: number): number {
  return id;
}
```

## Async Responses

```typescript
@SubscribeMessage('events')
async handleEvent(@MessageBody() data: any): Promise<WsResponse<any>> {
  const result = await this.service.process(data);
  return { event: 'processed', data: result };
}

// Observable (emits multiple responses)
@SubscribeMessage('events')
handleEvent(): Observable<WsResponse<number>> {
  return from([1, 2, 3]).pipe(
    map((item) => ({ event: 'events', data: item })),
  );
}
```

## Acknowledgment Callback

```typescript
@SubscribeMessage('events')
handleEvent(
  @MessageBody() data: string,
  @Ack() ack: (response: any) => void,
) {
  ack({ status: 'received', data });
}
```

## Lifecycle Hooks

```typescript
import {
  OnGatewayInit,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';

@WebSocketGateway()
export class EventsGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;

  afterInit(server: Server) {
    console.log('Gateway initialized');
  }

  handleConnection(client: Socket) {
    console.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
  }
}
```

## Broadcasting

```typescript
@SubscribeMessage('broadcast')
handleBroadcast(@MessageBody() data: any) {
  // Emit to all connected clients
  this.server.emit('broadcast', data);
}

// Emit to specific room
emitToRoom(room: string, event: string, data: any) {
  this.server.to(room).emit(event, data);
}

// Join/leave rooms
@SubscribeMessage('joinRoom')
handleJoinRoom(
  @ConnectedSocket() client: Socket,
  @MessageBody() room: string,
) {
  client.join(room);
  return { event: 'joinedRoom', data: room };
}
```

## Namespace Access

```typescript
@WebSocketGateway({ namespace: 'chat' })
export class ChatGateway {
  @WebSocketServer()
  namespace: Namespace;

  getConnectedClients() {
    return this.namespace.sockets.size;
  }
}
```

## Using Guards and Pipes

```typescript
@UseGuards(WsAuthGuard)
@UsePipes(new ValidationPipe())
@SubscribeMessage('message')
handleMessage(@MessageBody() dto: CreateMessageDto) {
  return this.messagesService.create(dto);
}
```

## Register in Module

```typescript
@Module({
  providers: [EventsGateway],
})
export class EventsModule {}
```

## Client Example

```typescript
// Client-side
const socket = io('http://localhost:3000');

socket.emit('events', { name: 'Nest' }, (response) => {
  console.log('Acknowledgment:', response);
});

socket.on('events', (data) => {
  console.log('Received:', data);
});
```

## Key Points

- Gateways are registered as providers
- Default port is same as HTTP server
- Guards, pipes, and interceptors work with gateways
- Use `@ConnectedSocket()` to access the socket instance
- Return value from handler sends acknowledgment

<!--
Source references:
- https://docs.nestjs.com/websockets/gateways
-->

---
name: events
description: Event-driven architecture with @nestjs/event-emitter
---

# Events

The `@nestjs/event-emitter` package provides event-driven architecture for decoupled application design.

## Installation

```bash
npm install @nestjs/event-emitter
```

## Setup

```typescript
import { Module } from '@nestjs/common';
import { EventEmitterModule } from '@nestjs/event-emitter';

@Module({
  imports: [EventEmitterModule.forRoot()],
})
export class AppModule {}
```

## Dispatching Events

```typescript
import { Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';

@Injectable()
export class OrdersService {
  constructor(private eventEmitter: EventEmitter2) {}

  createOrder(data: CreateOrderDto) {
    const order = this.ordersRepository.create(data);
    
    this.eventEmitter.emit('order.created', new OrderCreatedEvent({
      orderId: order.id,
      userId: data.userId,
    }));

    return order;
  }
}
```

## Listening to Events

```typescript
import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';

@Injectable()
export class NotificationsListener {
  @OnEvent('order.created')
  handleOrderCreated(event: OrderCreatedEvent) {
    // Send notification to user
    console.log(`Order ${event.orderId} created`);
  }

  @OnEvent('order.created', { async: true })
  async sendEmailNotification(event: OrderCreatedEvent) {
    await this.emailService.send(event);
  }
}
```

## Wildcard Listeners

Enable wildcards in configuration:

```typescript
EventEmitterModule.forRoot({
  wildcard: true,
  delimiter: '.',
})
```

Use wildcards:

```typescript
@OnEvent('order.*')
handleAllOrderEvents(event: any) {
  // Handles order.created, order.updated, order.shipped, etc.
}

@OnEvent('**')
handleAllEvents(event: any) {
  // Handles all events
}
```

## Configuration Options

```typescript
EventEmitterModule.forRoot({
  wildcard: false,              // Enable wildcard patterns
  delimiter: '.',               // Namespace delimiter
  newListener: false,           // Emit newListener event
  removeListener: false,        // Emit removeListener event
  maxListeners: 10,            // Max listeners per event
  verboseMemoryLeak: false,    // Show event name in leak warning
  ignoreErrors: false,         // Don't throw on unhandled errors
});
```

## Listener Options

```typescript
@OnEvent('order.created', {
  async: true,          // Handle asynchronously
  prependListener: true, // Add to beginning of listener array
  suppressErrors: true,  // Don't throw errors
})
handleOrderCreated(event: OrderCreatedEvent) {}
```

## Event Class Pattern

```typescript
export class OrderCreatedEvent {
  constructor(
    public readonly orderId: string,
    public readonly userId: string,
    public readonly createdAt: Date = new Date(),
  ) {}
}
```

## Preventing Event Loss

Events emitted before `onApplicationBootstrap` may be missed:

```typescript
@Injectable()
export class MyService implements OnApplicationBootstrap {
  constructor(
    private eventEmitter: EventEmitter2,
    private eventEmitterReadinessWatcher: EventEmitterReadinessWatcher,
  ) {}

  async onApplicationBootstrap() {
    await this.eventEmitterReadinessWatcher.waitUntilReady();
    this.eventEmitter.emit('app.ready', {});
  }
}
```

## Key Points

- Event subscribers cannot be request-scoped
- Multiple listeners can subscribe to the same event
- Events are great for decoupling modules
- Use async: true for non-blocking event handling

<!--
Source references:
- https://docs.nestjs.com/techniques/events
-->

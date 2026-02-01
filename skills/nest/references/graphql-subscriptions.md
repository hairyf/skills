---
name: graphql-subscriptions
description: Real-time GraphQL subscriptions with PubSub
---

# GraphQL Subscriptions

Subscriptions enable real-time server-to-client communication.

## Enable Subscriptions (Apollo)

```typescript
GraphQLModule.forRoot<ApolloDriverConfig>({
  driver: ApolloDriver,
  subscriptions: {
    'graphql-ws': true,
  },
}),
```

## Basic Subscription

```typescript
import { Resolver, Mutation, Subscription } from '@nestjs/graphql';
import { PubSub } from 'graphql-subscriptions';

const pubSub = new PubSub();

@Resolver(() => Comment)
export class CommentsResolver {
  @Subscription(() => Comment)
  commentAdded() {
    return pubSub.asyncIterableIterator('commentAdded');
  }

  @Mutation(() => Comment)
  async addComment(@Args('input') input: CreateCommentInput) {
    const comment = await this.commentsService.create(input);
    
    // Publish event
    pubSub.publish('commentAdded', { commentAdded: comment });
    
    return comment;
  }
}
```

## Filtering Events

```typescript
@Subscription(() => Comment, {
  filter: (payload, variables) =>
    payload.commentAdded.postId === variables.postId,
})
commentAdded(@Args('postId') postId: string) {
  return pubSub.asyncIterableIterator('commentAdded');
}
```

## Transforming Payload

```typescript
@Subscription(() => Comment, {
  resolve: (payload) => payload.commentAdded,
})
commentAdded() {
  return pubSub.asyncIterableIterator('commentAdded');
}
```

## Named Subscription

```typescript
@Subscription(() => Comment, {
  name: 'commentAdded',
})
subscribeToCommentAdded() {
  return pubSub.asyncIterableIterator('commentAdded');
}
```

## PubSub as Provider

Inject PubSub instead of global instance:

```typescript
// pubsub.module.ts
@Module({
  providers: [
    {
      provide: 'PUB_SUB',
      useValue: new PubSub(),
    },
  ],
  exports: ['PUB_SUB'],
})
export class PubSubModule {}

// resolver
@Resolver()
export class CommentsResolver {
  constructor(@Inject('PUB_SUB') private pubSub: PubSub) {}

  @Subscription(() => Comment)
  commentAdded() {
    return this.pubSub.asyncIterableIterator('commentAdded');
  }
}
```

## Production PubSub

The default `PubSub` is not for production. Use Redis-backed implementation:

```bash
npm install graphql-redis-subscriptions ioredis
```

```typescript
import { RedisPubSub } from 'graphql-redis-subscriptions';
import Redis from 'ioredis';

const options = {
  host: 'localhost',
  port: 6379,
};

{
  provide: 'PUB_SUB',
  useFactory: () => new RedisPubSub({
    publisher: new Redis(options),
    subscriber: new Redis(options),
  }),
}
```

## WebSocket Authentication

```typescript
GraphQLModule.forRoot<ApolloDriverConfig>({
  driver: ApolloDriver,
  subscriptions: {
    'graphql-ws': {
      onConnect: (context) => {
        const { connectionParams, extra } = context;
        const token = connectionParams.authToken;
        
        if (!isValidToken(token)) {
          throw new Error('Invalid token');
        }
        
        extra.user = decodeToken(token);
      },
    },
  },
  context: ({ extra }) => ({
    user: extra?.user,
  }),
}),
```

## Mercurius Subscriptions

```typescript
GraphQLModule.forRoot<MercuriusDriverConfig>({
  driver: MercuriusDriver,
  subscription: true,
}),
```

```typescript
@Subscription(() => Comment)
commentAdded(@Context('pubsub') pubSub: PubSub) {
  return pubSub.subscribe('commentAdded');
}

@Mutation(() => Comment)
async addComment(
  @Args('input') input: CreateCommentInput,
  @Context('pubsub') pubSub: PubSub,
) {
  const comment = await this.commentsService.create(input);
  
  await pubSub.publish({
    topic: 'commentAdded',
    payload: { commentAdded: comment },
  });
  
  return comment;
}
```

## Client-Side

```javascript
import { createClient } from 'graphql-ws';

const client = createClient({
  url: 'ws://localhost:3000/graphql',
  connectionParams: {
    authToken: 'Bearer xxx',
  },
});

client.subscribe(
  {
    query: `subscription { commentAdded { id content } }`,
  },
  {
    next: (data) => console.log(data),
    error: (error) => console.error(error),
    complete: () => console.log('done'),
  },
);
```

## Key Points

- Use `graphql-ws` instead of deprecated `subscriptions-transport-ws`
- Payload shape must match subscription return type
- Use Redis-backed PubSub for production (multi-instance support)
- `filter` function determines which clients receive events
- `resolve` function transforms the payload before sending

<!--
Source references:
- https://docs.nestjs.com/graphql/subscriptions
-->

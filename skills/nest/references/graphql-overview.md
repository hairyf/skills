---
name: graphql
description: Building GraphQL APIs with code-first and schema-first approaches
---

# GraphQL

NestJS provides GraphQL integration through Apollo Server or Mercurius.

## Installation

```bash
# Apollo (default)
npm install @nestjs/graphql @nestjs/apollo @apollo/server @as-integrations/express5 graphql

# Mercurius (Fastify)
npm install @nestjs/graphql @nestjs/mercurius graphql mercurius
```

## Setup

```typescript
import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { join } from 'path';

@Module({
  imports: [
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
      // Or in-memory: autoSchemaFile: true
    }),
  ],
})
export class AppModule {}
```

## Code-First Approach

### Object Type

```typescript
import { ObjectType, Field, ID, Int } from '@nestjs/graphql';

@ObjectType()
export class Author {
  @Field(() => ID)
  id: string;

  @Field()
  name: string;

  @Field(() => Int, { nullable: true })
  age?: number;

  @Field(() => [Post])
  posts: Post[];
}
```

### Resolver

```typescript
import { Resolver, Query, Mutation, Args, ID } from '@nestjs/graphql';

@Resolver(() => Author)
export class AuthorsResolver {
  constructor(private authorsService: AuthorsService) {}

  @Query(() => [Author], { name: 'authors' })
  findAll() {
    return this.authorsService.findAll();
  }

  @Query(() => Author, { name: 'author' })
  findOne(@Args('id', { type: () => ID }) id: string) {
    return this.authorsService.findOne(id);
  }

  @Mutation(() => Author)
  createAuthor(@Args('input') input: CreateAuthorInput) {
    return this.authorsService.create(input);
  }
}
```

### Input Type

```typescript
import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class CreateAuthorInput {
  @Field()
  name: string;

  @Field({ nullable: true })
  bio?: string;
}
```

## Schema-First Approach

### GraphQL Schema

```graphql
# authors.graphql
type Author {
  id: ID!
  name: String!
  posts: [Post!]!
}

type Query {
  authors: [Author!]!
  author(id: ID!): Author
}
```

### Configuration

```typescript
GraphQLModule.forRoot<ApolloDriverConfig>({
  driver: ApolloDriver,
  typePaths: ['./**/*.graphql'],
  definitions: {
    path: join(process.cwd(), 'src/graphql.ts'),
    outputAs: 'class',
  },
}),
```

### Resolver

```typescript
@Resolver('Author')
export class AuthorsResolver {
  @Query('authors')
  findAll() {
    return this.authorsService.findAll();
  }

  @Query('author')
  findOne(@Args('id') id: string) {
    return this.authorsService.findOne(id);
  }
}
```

## Subscriptions

```typescript
import { Subscription, Resolver } from '@nestjs/graphql';
import { PubSub } from 'graphql-subscriptions';

const pubSub = new PubSub();

@Resolver()
export class AuthorsResolver {
  @Mutation(() => Author)
  async createAuthor(@Args('input') input: CreateAuthorInput) {
    const author = await this.authorsService.create(input);
    pubSub.publish('authorCreated', { authorCreated: author });
    return author;
  }

  @Subscription(() => Author)
  authorCreated() {
    return pubSub.asyncIterableIterator('authorCreated');
  }
}
```

## Field Resolvers

```typescript
@Resolver(() => Author)
export class AuthorsResolver {
  @ResolveField(() => [Post])
  posts(@Parent() author: Author) {
    return this.postsService.findByAuthorId(author.id);
  }
}
```

## Guards and Interceptors

```typescript
@Query(() => Author)
@UseGuards(GqlAuthGuard)
whoAmI(@CurrentUser() user: User) {
  return user;
}
```

## Context

```typescript
GraphQLModule.forRoot<ApolloDriverConfig>({
  driver: ApolloDriver,
  autoSchemaFile: true,
  context: ({ req, res }) => ({ req, res }),
}),
```

## Async Configuration

```typescript
GraphQLModule.forRootAsync<ApolloDriverConfig>({
  driver: ApolloDriver,
  imports: [ConfigModule],
  useFactory: async (configService: ConfigService) => ({
    autoSchemaFile: true,
    playground: configService.get('NODE_ENV') !== 'production',
  }),
  inject: [ConfigService],
}),
```

## Key Points

- **Code-first**: TypeScript classes generate GraphQL schema
- **Schema-first**: SDL files generate TypeScript types
- Use `autoSchemaFile` for code-first
- Use `typePaths` for schema-first
- Resolvers must be registered as providers

<!--
Source references:
- https://docs.nestjs.com/graphql/quick-start
-->

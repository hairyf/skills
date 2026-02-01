---
name: graphql-resolvers-mutations
description: GraphQL resolvers, mutations, and field resolvers
---

# GraphQL Resolvers & Mutations

## Object Types (Code First)

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

## Resolver

```typescript
import { Resolver, Query, Mutation, Args, ResolveField, Parent, ID } from '@nestjs/graphql';

@Resolver(() => Author)
export class AuthorsResolver {
  constructor(
    private authorsService: AuthorsService,
    private postsService: PostsService,
  ) {}

  @Query(() => [Author], { name: 'authors' })
  findAll() {
    return this.authorsService.findAll();
  }

  @Query(() => Author, { nullable: true })
  findOne(@Args('id', { type: () => ID }) id: string) {
    return this.authorsService.findOne(id);
  }

  @ResolveField(() => [Post])
  posts(@Parent() author: Author) {
    return this.postsService.findByAuthorId(author.id);
  }
}
```

## Mutations

```typescript
import { InputType, Field, ArgsType } from '@nestjs/graphql';

@InputType()
export class CreateAuthorInput {
  @Field()
  name: string;

  @Field({ nullable: true })
  bio?: string;
}

@Resolver(() => Author)
export class AuthorsResolver {
  @Mutation(() => Author)
  createAuthor(@Args('input') input: CreateAuthorInput) {
    return this.authorsService.create(input);
  }

  @Mutation(() => Author)
  updateAuthor(
    @Args('id', { type: () => ID }) id: string,
    @Args('input') input: UpdateAuthorInput,
  ) {
    return this.authorsService.update(id, input);
  }

  @Mutation(() => Boolean)
  deleteAuthor(@Args('id', { type: () => ID }) id: string) {
    return this.authorsService.delete(id);
  }
}
```

## Args Class

```typescript
@ArgsType()
class GetAuthorsArgs {
  @Field(() => Int, { defaultValue: 0 })
  offset: number;

  @Field(() => Int, { defaultValue: 10 })
  limit: number;

  @Field({ nullable: true })
  search?: string;
}

@Query(() => [Author])
authors(@Args() args: GetAuthorsArgs) {
  return this.authorsService.findAll(args);
}
```

## Field Options

```typescript
@Field(() => String, {
  description: 'The author name',
  deprecationReason: 'Use fullName instead',
  nullable: true,
})
name?: string;
```

## Nullable Arrays

```typescript
// Array itself is nullable
@Field(() => [Post], { nullable: true })
posts?: Post[];

// Array items are nullable
@Field(() => [Post], { nullable: 'items' })
posts: (Post | null)[];

// Both nullable
@Field(() => [Post], { nullable: 'itemsAndList' })
posts?: (Post | null)[];
```

## GraphQL Decorators

| Decorator | Purpose |
|-----------|---------|
| `@ObjectType()` | Define GraphQL type |
| `@Field()` | Define field |
| `@InputType()` | Define input type |
| `@ArgsType()` | Define args class |
| `@Resolver()` | Define resolver |
| `@Query()` | Define query |
| `@Mutation()` | Define mutation |
| `@ResolveField()` | Define field resolver |
| `@Parent()` | Access parent object |
| `@Args()` | Access arguments |
| `@Context()` | Access context |

## Query Options

```typescript
@Query(() => Author, {
  name: 'author',           // GraphQL query name
  description: 'Get author by ID',
  nullable: true,           // Can return null
  deprecationReason: 'Use findAuthor instead',
})
async getAuthor(@Args('id', { type: () => ID }) id: string) {}
```

## Context Access

```typescript
@Query(() => Author)
whoAmI(@Context() context: any) {
  return context.req.user;
}

// Or extract specific property
@Query(() => Author)
whoAmI(@Context('req') req: Request) {
  return req.user;
}
```

## Using Guards

```typescript
@Query(() => Author)
@UseGuards(GqlAuthGuard)
whoAmI(@Context() context: any) {
  return context.req.user;
}
```

<!--
Source references:
- https://docs.nestjs.com/graphql/resolvers-map
- https://docs.nestjs.com/graphql/mutations
-->

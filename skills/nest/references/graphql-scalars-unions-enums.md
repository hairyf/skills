---
name: graphql-scalars-unions-enums
description: GraphQL custom scalars, interfaces, union types, and enums
---

# GraphQL Scalars, Interfaces, Unions & Enums

## Interfaces

```typescript
import { Field, ID, InterfaceType } from '@nestjs/graphql';

@InterfaceType()
export abstract class Character {
  @Field(() => ID)
  id: string;

  @Field()
  name: string;
}
```

Implement interface:

```typescript
@ObjectType({ implements: () => [Character] })
export class Human implements Character {
  id: string;
  name: string;
}
```

Custom `resolveType`:

```typescript
@InterfaceType({
  resolveType(book) {
    if (book.colors) return ColoringBook;
    return TextBook;
  },
})
export abstract class Book { ... }
```

Interface resolver (shared field resolvers):

```typescript
@Resolver(() => Character)
export class CharacterInterfaceResolver {
  @ResolveField(() => [Character])
  friends(@Parent() character) {
    return this.getFriends(character);
  }
}
```

## Scalars, Unions & Enums

## Built-in Scalars

- `ID`, `Int`, `Float`, `String`, `Boolean`
- `GraphQLISODateTime` (default for Date)
- `GraphQLTimestamp` (Date as epoch ms)

```typescript
GraphQLModule.forRoot({
  buildSchemaOptions: {
    dateScalarMode: 'timestamp',  // Use GraphQLTimestamp for Date
    numberScalarMode: 'integer',  // Use Int for number
  },
}),
```

## Custom Scalar

```typescript
import { Scalar, CustomScalar } from '@nestjs/graphql';
import { Kind, ValueNode } from 'graphql';

@Scalar('Date', () => Date)
export class DateScalar implements CustomScalar<number, Date> {
  description = 'Date custom scalar';

  parseValue(value: number): Date {
    return new Date(value);
  }

  serialize(value: Date): number {
    return value.getTime();
  }

  parseLiteral(ast: ValueNode): Date {
    if (ast.kind === Kind.INT) return new Date(ast.value);
    return null;
  }
}
```

Register as provider. Use: `@Field(() => Date) creationDate: Date;`

## Import Scalar (e.g., JSON)

```bash
npm i graphql-type-json
```

```typescript
import GraphQLJSON from 'graphql-type-json';

GraphQLModule.forRoot({
  resolvers: { JSON: GraphQLJSON },
}),
```

## Union Types

```typescript
import { createUnionType } from '@nestjs/graphql';

export const ResultUnion = createUnionType({
  name: 'ResultUnion',
  types: () => [Author, Book] as const,
  resolveType(value) {
    if (value.name) return Author;
    if (value.title) return Book;
    return null;
  },
});

@Query(() => [ResultUnion])
search(): Array<typeof ResultUnion> {
  return [new Author(), new Book()];
}
```

Return class instances for default `resolveType`. Schema first: add `__resolveType` resolver.

## Enums

```typescript
import { registerEnumType } from '@nestjs/graphql';

export enum AllowedColor {
  RED,
  GREEN,
  BLUE,
}

registerEnumType(AllowedColor, {
  name: 'AllowedColor',
  description: 'Supported colors',
  valuesMap: {
    RED: { description: 'Default color' },
    BLUE: { deprecationReason: 'Too blue' },
  },
});
```

```typescript
@Field(() => AllowedColor)
favoriteColor: AllowedColor;
```

Schema first: define in SDL; use `resolvers` for internal value mapping.

## Key Points

- Use abstract class with `@InterfaceType()` (not TypeScript interface)
- `implements: () => [Character]` for ObjectType implementing interface
- Use `as const` for union types array
- Custom scalars need `parseValue`, `serialize`, `parseLiteral`
- `graphql-scalars` package for common scalars (UUID, Email, etc.)
- Enum internal values: use resolver object in schema-first

<!--
Source references:
- https://docs.nestjs.com/graphql/interfaces
- https://docs.nestjs.com/graphql/scalars
- https://docs.nestjs.com/graphql/unions-and-enums
-->

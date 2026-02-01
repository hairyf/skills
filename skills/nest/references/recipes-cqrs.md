---
name: cqrs
description: Command Query Responsibility Segregation pattern for complex applications
---

# CQRS

Separate read and write operations for scalability and flexibility.

## Installation

```bash
npm install @nestjs/cqrs
```

```typescript
@Module({
  imports: [CqrsModule.forRoot()],
})
export class AppModule {}
```

## Commands

Commands change application state. Use `CommandBus` to dispatch.

```typescript
// kill-dragon.command.ts
export class KillDragonCommand extends Command<{ actionId: string }> {
  constructor(
    public readonly heroId: string,
    public readonly dragonId: string,
  ) {
    super();
  }
}

// kill-dragon.handler.ts
@CommandHandler(KillDragonCommand)
export class KillDragonHandler implements ICommandHandler<KillDragonCommand> {
  constructor(private repository: HeroesRepository) {}

  async execute(command: KillDragonCommand) {
    const { heroId, dragonId } = command;
    const hero = await this.repository.findOneById(+heroId);
    hero.killEnemy(dragonId);
    await this.repository.persist(hero);
    return { actionId: crypto.randomUUID() };
  }
}
```

```typescript
// Usage
await this.commandBus.execute(
  new KillDragonCommand(heroId, killDragonDto.dragonId)
);
```

## Queries

```typescript
export class GetHeroQuery extends Query<Hero> {
  constructor(public readonly heroId: string) {
    super();
  }
}

@QueryHandler(GetHeroQuery)
export class GetHeroHandler implements IQueryHandler<GetHeroQuery> {
  constructor(private repository: HeroesRepository) {}

  async execute(query: GetHeroQuery) {
    return this.repository.findOneById(query.heroId);
  }
}
```

```typescript
const hero = await this.queryBus.execute(new GetHeroQuery(heroId));
```

## Events

```typescript
export class HeroKilledDragonEvent {
  constructor(
    public readonly heroId: string,
    public readonly dragonId: string,
  ) {}
}

@EventsHandler(HeroKilledDragonEvent)
export class HeroKilledDragonHandler implements IEventHandler<HeroKilledDragonEvent> {
  handle(event: HeroKilledDragonEvent) {
    // Update read model, send notifications, etc.
  }
}
```

Publish from model with `AggregateRoot`:

```typescript
export class Hero extends AggregateRoot {
  killEnemy(enemyId: string) {
    this.apply(new HeroKilledDragonEvent(this.id, enemyId));
  }
}
```

Requires `EventPublisher.mergeObjectContext()` and `hero.commit()`.

Or publish manually:

```typescript
this.eventBus.publish(new HeroKilledDragonEvent(heroId, dragonId));
```

## Sagas

Long-running processes that listen to events and dispatch commands.

```typescript
@Injectable()
export class HeroesGameSagas {
  @Saga()
  dragonKilled = (events$: Observable<any>): Observable<ICommand> => {
    return events$.pipe(
      ofType(HeroKilledDragonEvent),
      map((event) => new DropAncientItemCommand(event.heroId, fakeItemID)),
    );
  };
}
```

Register saga as provider. `ofType` filters events; return command to dispatch.

## Request-Scoped Handlers

```typescript
@CommandHandler(KillDragonCommand, { scope: Scope.REQUEST })
export class KillDragonHandler {
  constructor(@Inject(REQUEST) private request: MyRequest) {}
}
```

Pass `AsyncContext` when executing:

```typescript
const myRequest = new MyRequest(user);
await this.commandBus.execute(command, myRequest);
```

## Unhandled Exceptions

Event handler errors don't reach Exception filters. Subscribe to `UnhandledExceptionBus`:

```typescript
this.unhandledExceptionsBus
  .pipe(takeUntil(this.destroy$))
  .subscribe((exceptionInfo) => {
    // Handle exception
  });
```

## Key Points

- Commands: task-based, change state; Queries: data-centric, read state
- Register all handlers/sagas as providers
- Event handlers run asynchronously—no HTTP response
- Use Redis-backed event store for production sagas

<!--
Source references:
- https://docs.nestjs.com/recipes/cqrs
-->

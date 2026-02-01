---
name: mongoose
description: MongoDB integration with Mongoose ODM
---

# Mongoose (MongoDB)

Mongoose is the most popular MongoDB object modeling tool for Node.js.

## Installation

```bash
npm i @nestjs/mongoose mongoose
```

## Setup

```typescript
@Module({
  imports: [
    MongooseModule.forRoot('mongodb://localhost/nest'),
    // Or with options
    MongooseModule.forRoot('mongodb://localhost/nest', {
      connectionName: 'cats',
    }),
  ],
})
export class AppModule {}
```

## Schema Definition

```typescript
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type CatDocument = HydratedDocument<Cat>;

@Schema()
export class Cat {
  @Prop()
  name: string;

  @Prop({ required: true })
  age: number;

  @Prop([String])
  tags: string[];

  @Prop({ default: Date.now })
  createdAt: Date;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Owner' })
  owner: Owner;
}

export const CatSchema = SchemaFactory.createForClass(Cat);
```

## Register Model

```typescript
@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Cat.name, schema: CatSchema },
    ]),
  ],
})
export class CatsModule {}
```

## Inject and Use

```typescript
@Injectable()
export class CatsService {
  constructor(
    @InjectModel(Cat.name) private catModel: Model<CatDocument>,
  ) {}

  async create(createCatDto: CreateCatDto) {
    const created = new this.catModel(createCatDto);
    return created.save();
  }

  async findAll(): Promise<Cat[]> {
    return this.catModel.find().exec();
  }

  async findOne(id: string) {
    return this.catModel.findById(id).populate('owner').exec();
  }
}
```

## @Prop Options

| Option | Description |
|--------|-------------|
| `required` | Required field |
| `default` | Default value |
| `unique` | Unique index |
| `index` | Create index |
| `type` | Explicit type (e.g., `mongoose.Schema.Types.ObjectId`) |
| `ref` | Reference to another model |

## Relations (Population)

```typescript
@Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Owner' })
owner: Owner;

// Multiple
@Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Owner' }] })
owners: Owner[];
```

```typescript
return this.catModel.find().populate('owner').exec();
return this.catModel.find().populate({ path: 'owner', select: 'name' }).exec();
```

## Plugins

```typescript
CatSchema.plugin(require('mongoose-autopopulate'));
```

## Async Configuration

```typescript
MongooseModule.forRootAsync({
  imports: [ConfigModule],
  useFactory: (config: ConfigService) => ({
    uri: config.get('MONGODB_URI'),
  }),
  inject: [ConfigService],
}),
```

## Key Points

- Use `@Schema()` and `@Prop()` decorators
- `SchemaFactory.createForClass()` generates schema
- `@InjectModel()` injects Model
- Use `populate()` for relations
- `HydratedDocument<Cat>` for typed documents

<!--
Source references:
- https://docs.nestjs.com/techniques/mongodb
-->

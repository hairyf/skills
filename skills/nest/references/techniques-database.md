---
name: techniques-database
description: Database integration with TypeORM, Prisma, and MongoDB in NestJS
---

# Database Integration

NestJS supports multiple database solutions including TypeORM, Prisma, Sequelize, and MongoDB.

## TypeORM

### Installation

```bash
npm install --save @nestjs/typeorm typeorm mysql2
```

### Basic Setup

```typescript
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: 'root',
      database: 'test',
      entities: [User],
      synchronize: true,
    }),
  ],
})
export class AppModule {}
```

### Feature Module

```typescript
@Module({
  imports: [TypeOrmModule.forFeature([User])],
  providers: [UsersService],
  controllers: [UsersController],
})
export class UsersModule {}
```

### Using Repository

```typescript
@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async findAll(): Promise<User[]> {
    return this.usersRepository.find();
  }
}
```

## Prisma

### Installation

```bash
npm install --save @prisma/client
npm install --save-dev prisma
```

### Setup

```typescript
import { PrismaService } from './prisma.service';

@Module({
  providers: [PrismaService],
  exports: [PrismaService],
})
export class PrismaModule {}
```

### Using Prisma Service

```typescript
@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.user.findMany();
  }
}
```

## MongoDB

### Installation

```bash
npm install --save @nestjs/mongoose mongoose
```

### Setup

```typescript
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://localhost/nest'),
  ],
})
export class AppModule {}
```

### Schema Definition

```typescript
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema()
export class Cat {
  @Prop()
  name: string;

  @Prop()
  age: number;
}

export const CatSchema = SchemaFactory.createForClass(Cat);
```

## Key Points

- TypeORM provides repository pattern
- Prisma offers type-safe database access
- Mongoose for MongoDB integration
- Use feature modules to organize database code
- Configure connection in root module
- Use repositories/services for data access

<!--
Source references:
- https://docs.nestjs.com/techniques/database
- https://docs.nestjs.com/recipes/prisma
- https://docs.nestjs.com/techniques/mongodb
-->

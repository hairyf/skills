---
name: recipes-prisma
description: Prisma ORM integration in NestJS
---

# Prisma Integration

Prisma is a next-generation ORM that provides type-safe database access.

## Installation

```bash
npm install --save @prisma/client
npm install --save-dev prisma
npx prisma init
```

## Prisma Service

```typescript
import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  async onModuleInit() {
    await this.$connect();
  }
}
```

## Module Setup

```typescript
import { Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';

@Module({
  providers: [PrismaService],
  exports: [PrismaService],
})
export class PrismaModule {}
```

## Using Prisma Service

```typescript
import { Injectable } from '@nestjs/common';
import { PrismaService } from './prisma.service';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.user.findMany();
  }

  async findOne(id: number) {
    return this.prisma.user.findUnique({
      where: { id },
    });
  }

  async create(data: CreateUserDto) {
    return this.prisma.user.create({
      data,
    });
  }

  async update(id: number, data: UpdateUserDto) {
    return this.prisma.user.update({
      where: { id },
      data,
    });
  }

  async remove(id: number) {
    return this.prisma.user.delete({
      where: { id },
    });
  }
}
```

## Key Points

- Prisma provides type-safe database access
- Extend `PrismaClient` for service
- Use `$connect()` in `onModuleInit()`
- Prisma generates types from schema
- Use Prisma Studio for database management
- Supports migrations and seeding

<!--
Source references:
- https://docs.nestjs.com/recipes/prisma
-->

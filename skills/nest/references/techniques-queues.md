---
name: queues
description: Background job processing with BullMQ and Bull
---

# Queues

Queues help with task scheduling, load balancing, and background processing using Redis-backed job queues.

## Installation (BullMQ - Recommended)

```bash
npm install @nestjs/bullmq bullmq
```

## Setup

```typescript
import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';

@Module({
  imports: [
    BullModule.forRoot({
      connection: {
        host: 'localhost',
        port: 6379,
      },
    }),
    BullModule.registerQueue({ name: 'audio' }),
  ],
})
export class AppModule {}
```

## Producer (Adding Jobs)

```typescript
import { Injectable } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';

@Injectable()
export class AudioService {
  constructor(@InjectQueue('audio') private audioQueue: Queue) {}

  async addTranscodeJob(file: string) {
    await this.audioQueue.add('transcode', { file });
  }

  // With options
  async addDelayedJob(data: any) {
    await this.audioQueue.add('process', data, {
      delay: 5000,           // 5 second delay
      attempts: 3,           // Retry 3 times
      removeOnComplete: true,
      priority: 1,           // Higher priority
    });
  }
}
```

## Consumer (Processing Jobs)

```typescript
import { Processor, WorkerHost, OnWorkerEvent } from '@nestjs/bullmq';
import { Job } from 'bullmq';

@Processor('audio')
export class AudioConsumer extends WorkerHost {
  async process(job: Job<any, any, string>): Promise<any> {
    switch (job.name) {
      case 'transcode':
        return this.transcode(job.data);
      case 'compress':
        return this.compress(job.data);
    }
  }

  private async transcode(data: any) {
    // Processing logic
    await job.updateProgress(50);
    return { processed: true };
  }

  @OnWorkerEvent('completed')
  onCompleted(job: Job) {
    console.log(`Job ${job.id} completed`);
  }

  @OnWorkerEvent('failed')
  onFailed(job: Job, error: Error) {
    console.error(`Job ${job.id} failed:`, error.message);
  }
}
```

Register consumer as provider:

```typescript
@Module({
  providers: [AudioConsumer],
})
export class AudioModule {}
```

## Queue Events Listener

```typescript
import { QueueEventsHost, QueueEventsListener, OnQueueEvent } from '@nestjs/bullmq';

@QueueEventsListener('audio')
export class AudioEventsListener extends QueueEventsHost {
  @OnQueueEvent('active')
  onActive(job: { jobId: string }) {
    console.log(`Processing job ${job.jobId}...`);
  }
}
```

## Job Options

| Option | Description |
|--------|-------------|
| `delay` | Milliseconds to wait before processing |
| `attempts` | Number of retry attempts |
| `backoff` | Retry delay strategy |
| `priority` | Job priority (1 = highest) |
| `lifo` | Process as LIFO instead of FIFO |
| `removeOnComplete` | Remove job data after completion |
| `removeOnFail` | Remove job data after failure |
| `repeat` | Cron-like repeat configuration |

## Queue Management

```typescript
await this.audioQueue.pause();
await this.audioQueue.resume();
await this.audioQueue.clean(1000); // Remove completed jobs older than 1s
```

## Request-Scoped Consumers

```typescript
@Processor({ name: 'audio', scope: Scope.REQUEST })
export class AudioConsumer extends WorkerHost {
  constructor(@Inject(JOB_REF) private jobRef: Job) {}
}
```

## Key Points

- Consumers must be registered as providers
- BullMQ is recommended over Bull (actively developed)
- Use `switch` statement in `process()` for different job names
- Requires Redis for job persistence
- Jobs persist across restarts

<!--
Source references:
- https://docs.nestjs.com/techniques/queues
-->

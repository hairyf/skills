---
name: task-scheduling
description: Cron jobs, intervals, and timeouts with @nestjs/schedule
---

# Task Scheduling

Schedule tasks to run at fixed times, recurring intervals, or after delays.

## Installation

```bash
npm install @nestjs/schedule
```

## Setup

```typescript
import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [ScheduleModule.forRoot()],
})
export class AppModule {}
```

## Cron Jobs

```typescript
import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';

@Injectable()
export class TasksService {
  private readonly logger = new Logger(TasksService.name);

  // Using cron pattern
  @Cron('45 * * * * *')
  handleCron() {
    this.logger.log('Called at second 45 of every minute');
  }

  // Using CronExpression enum
  @Cron(CronExpression.EVERY_30_SECONDS)
  handleEvery30Seconds() {
    this.logger.log('Called every 30 seconds');
  }

  // With options
  @Cron('0 0 8 * * *', {
    name: 'dailyReport',
    timeZone: 'America/New_York',
  })
  generateDailyReport() {
    this.logger.log('Generating daily report');
  }
}
```

### Cron Pattern

```
* * * * * *
| | | | | |
| | | | | day of week (0-7)
| | | | month (1-12)
| | | day of month (1-31)
| | hours (0-23)
| minutes (0-59)
seconds (0-59, optional)
```

## Intervals

```typescript
@Interval(10000)
handleInterval() {
  this.logger.log('Called every 10 seconds');
}

// Named interval
@Interval('notifications', 2500)
handleNotifications() {}
```

## Timeouts

```typescript
@Timeout(5000)
handleTimeout() {
  this.logger.log('Called once after 5 seconds');
}

// Named timeout
@Timeout('welcome', 3000)
sendWelcome() {}
```

## Dynamic API

Manage scheduled tasks programmatically:

```typescript
import { Injectable } from '@nestjs/common';
import { SchedulerRegistry } from '@nestjs/schedule';
import { CronJob } from 'cron';

@Injectable()
export class TaskService {
  constructor(private schedulerRegistry: SchedulerRegistry) {}

  // Access existing cron job
  stopCronJob() {
    const job = this.schedulerRegistry.getCronJob('dailyReport');
    job.stop();
  }

  // Create dynamic cron job
  addCronJob(name: string, cronTime: string) {
    const job = new CronJob(cronTime, () => {
      console.log(`Dynamic job ${name} running`);
    });
    this.schedulerRegistry.addCronJob(name, job);
    job.start();
  }

  // Delete cron job
  deleteCronJob(name: string) {
    this.schedulerRegistry.deleteCronJob(name);
  }

  // List all cron jobs
  getCronJobs() {
    const jobs = this.schedulerRegistry.getCronJobs();
    jobs.forEach((job, key) => {
      console.log(`Job: ${key}, Next: ${job.nextDate().toJSDate()}`);
    });
  }
}
```

## CronJob Methods

| Method | Description |
|--------|-------------|
| `stop()` | Stop the job |
| `start()` | Restart a stopped job |
| `setTime(time)` | Set new time and restart |
| `lastDate()` | Last execution date |
| `nextDate()` | Next scheduled execution |

## Cron Options

| Option | Description |
|--------|-------------|
| `name` | Name for dynamic access |
| `timeZone` | Timezone for execution |
| `utcOffset` | UTC offset alternative |
| `disabled` | Disable job execution |
| `waitForCompletion` | Wait for current run before next |

<!--
Source references:
- https://docs.nestjs.com/techniques/task-scheduling
-->

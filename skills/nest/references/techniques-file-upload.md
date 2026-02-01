---
name: file-upload
description: File upload handling with multer integration
---

# File Upload

NestJS uses [multer](https://github.com/expressjs/multer) middleware for handling `multipart/form-data` file uploads.

## Installation

```bash
npm i -D @types/multer
```

## Single File Upload

```typescript
import { Controller, Post, UseInterceptors, UploadedFile } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Express } from 'express';

@Controller('upload')
export class UploadController {
  @Post()
  @UseInterceptors(FileInterceptor('file'))
  uploadFile(@UploadedFile() file: Express.Multer.File) {
    console.log(file);
    return { filename: file.originalname };
  }
}
```

## File Validation

Use `ParseFilePipe` with built-in validators:

```typescript
@Post()
uploadFile(
  @UploadedFile(
    new ParseFilePipe({
      validators: [
        new MaxFileSizeValidator({ maxSize: 1000000 }), // 1MB
        new FileTypeValidator({ fileType: 'image/jpeg' }),
      ],
    }),
  )
  file: Express.Multer.File,
) {
  return { filename: file.originalname };
}
```

Using builder pattern:

```typescript
@UploadedFile(
  new ParseFilePipeBuilder()
    .addFileTypeValidator({ fileType: 'jpeg' })
    .addMaxSizeValidator({ maxSize: 1000000 })
    .build({ errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY }),
)
file: Express.Multer.File,
```

## Multiple Files (Same Field)

```typescript
@Post('uploads')
@UseInterceptors(FilesInterceptor('files', 10)) // max 10 files
uploadFiles(@UploadedFiles() files: Array<Express.Multer.File>) {
  return files.map(f => f.originalname);
}
```

## Multiple Files (Different Fields)

```typescript
@Post('uploads')
@UseInterceptors(FileFieldsInterceptor([
  { name: 'avatar', maxCount: 1 },
  { name: 'background', maxCount: 1 },
]))
uploadFiles(
  @UploadedFiles() files: {
    avatar?: Express.Multer.File[],
    background?: Express.Multer.File[]
  },
) {
  return { avatar: files.avatar?.[0], background: files.background?.[0] };
}
```

## Any Files

```typescript
@Post('any')
@UseInterceptors(AnyFilesInterceptor())
uploadAny(@UploadedFiles() files: Array<Express.Multer.File>) {
  return files;
}
```

## Configure Destination

```typescript
import { MulterModule } from '@nestjs/platform-express';

@Module({
  imports: [
    MulterModule.register({ dest: './uploads' }),
  ],
})
export class UploadModule {}
```

Async configuration:

```typescript
MulterModule.registerAsync({
  imports: [ConfigModule],
  useFactory: async (configService: ConfigService) => ({
    dest: configService.get('UPLOAD_DEST'),
  }),
  inject: [ConfigService],
});
```

## Key Points

- `FileInterceptor` field name must match form field name
- Not compatible with Fastify adapter
- Use `fileIsRequired: false` for optional files
- Multer only processes `multipart/form-data`

<!--
Source references:
- https://docs.nestjs.com/techniques/file-upload
-->

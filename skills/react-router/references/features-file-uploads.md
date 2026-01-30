---
name: features-file-uploads
description: Handling file uploads with multipart form data and file storage
---

# File Uploads

Handle file uploads in React Router using `multipart/form-data` encoding and file storage APIs.

## Basic File Upload

### 1. Setup Routes

```ts filename=routes.ts
import {
  type RouteConfig,
  route,
} from "@react-router/dev/routes";

export default [
  route("user/:id", "pages/user-profile.tsx", [
    route("avatar", "api/avatar.tsx"),
  ]),
] satisfies RouteConfig;
```

### 2. Install Form Data Parser

```sh
npm i @remix-run/form-data-parser
```

`form-data-parser` provides streaming support for file uploads.

### 3. Create Upload Action

Set form `encType` to `multipart/form-data`:

```tsx filename=pages/user-profile.tsx
import {
  type FileUpload,
  parseFormData,
} from "@remix-run/form-data-parser";
import type { Route } from "./+types/user-profile";

export async function action({
  request,
}: Route.ActionArgs) {
  const uploadHandler = async (fileUpload: FileUpload) => {
    if (fileUpload.fieldName === "avatar") {
      // Process the upload and return a File
      return fileUpload;
    }
  };

  const formData = await parseFormData(
    request,
    uploadHandler,
  );
  // 'avatar' has already been processed
  const file = formData.get("avatar");
}

export default function Component() {
  return (
    <form method="post" encType="multipart/form-data">
      <input type="file" name="avatar" />
      <button>Submit</button>
    </form>
  );
}
```

## File Storage

### 1. Install File Storage

```sh
npm i @remix-run/file-storage
```

### 2. Create Storage Configuration

```ts filename=avatar-storage.server.ts
import { LocalFileStorage } from "@remix-run/file-storage/local";

export const fileStorage = new LocalFileStorage(
  "./uploads/avatars",
);

export function getStorageKey(userId: string) {
  return `user-${userId}-avatar`;
}
```

### 3. Implement Upload Handler

Store files in `fileStorage`:

```tsx filename=pages/user-profile.tsx
import {
  type FileUpload,
  parseFormData,
} from "@remix-run/form-data-parser";
import {
  fileStorage,
  getStorageKey,
} from "~/avatar-storage.server";

export async function action({
  request,
  params,
}: Route.ActionArgs) {
  async function uploadHandler(fileUpload: FileUpload) {
    if (
      fileUpload.fieldName === "avatar" &&
      fileUpload.type.startsWith("image/")
    ) {
      let storageKey = getStorageKey(params.id);
      
      // Store immediately - FileUpload objects are streaming data
      await fileStorage.set(storageKey, fileUpload);
      
      // Return a LazyFile that knows how to access content
      return fileStorage.get(storageKey);
    }
  }

  const formData = await parseFormData(
    request,
    uploadHandler,
  );
}
```

### 4. Serve Uploaded Files

Create a resource route to stream files:

```tsx filename=api/avatar.tsx
import {
  fileStorage,
  getStorageKey,
} from "~/avatar-storage.server";
import type { Route } from "./+types/avatar";

export async function loader({ params }: Route.LoaderArgs) {
  const storageKey = getStorageKey(params.id);
  const file = await fileStorage.get(storageKey);

  if (!file) {
    throw new Response("User avatar not found", {
      status: 404,
    });
  }

  return new Response(file.stream(), {
    headers: {
      "Content-Type": file.type,
      "Content-Disposition": `attachment; filename=${file.name}`,
    },
  });
}
```

## Key Points

- Set `encType="multipart/form-data"` on forms for file uploads
- Use `@remix-run/form-data-parser` for streaming file handling
- Use `parseFormData()` with an `uploadHandler` function
- Store files immediately - FileUpload objects are temporary streaming data
- Use `@remix-run/file-storage` for persistent file storage
- Create resource routes to serve uploaded files
- Return `Response` with file stream and appropriate headers

<!--
Source references:
- https://reactrouter.com/how-to/file-uploads
-->

---
name: electron-forge-publishers-overview
description: Electron Forge publishers — config, platforms; GitHub, S3, Nucleus, etc.; auto-update.
---

# Publishers overview

Publishers take artifacts from the Make step and upload them to a service (e.g. GitHub Releases, S3) for distribution or [auto-update](references/advanced-auto-update.md). Configure them in the `publishers` array in Forge config.

## Config shape

Each publisher: `name`, optional `platforms`, and `config` (publisher-specific). Default is to publish all platforms; set `platforms` only when you want to restrict.

```javascript
publishers: [
  {
    name: '@electron-forge/publisher-github',
    platforms: ['darwin', 'linux'],
    config: { repository: { owner: 'me', name: 'repo' }, draft: true }
  },
  { name: '@electron-forge/publisher-s3', config: { bucket: 'my-bucket', folder: 'releases' } }
]
```

## Built-in publishers

- **GitHub** (`@electron-forge/publisher-github`): Upload to GitHub Releases; use with `update-electron-app` for public repos. Auth via `GITHUB_TOKEN`.
- **S3**: Upload to Amazon S3; supports auto-update from S3.
- **GCS**: Google Cloud Storage.
- **Snapcraft**: Publish to Snap Store.
- **Nucleus**: Publish to Nucleus update server.
- **Electron Release Server**: Self-hosted release server.
- **Bitbucket**: Bitbucket repositories.

Install the publisher package as devDependency and add to `publishers`. To implement a custom publisher, extend `@electron-forge/publisher-base` and implement `publish()`. See [advanced-extending-publishers](references/advanced-extending-publishers.md).

<!--
Source references:
- https://github.com/electron-forge/electron-forge-docs/blob/main/config/publishers/README.md
- https://github.com/electron-forge/electron-forge-docs/blob/main/config/publishers/github.md
-->

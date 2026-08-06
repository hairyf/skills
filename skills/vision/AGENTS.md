# Vision Capability

The underlying model has no native image recognition. When you encounter an image, **do not use the Read tool** — use vision.js instead:

```
node vision.js "<image path>" "Describe this image in Chinese"
```

## Trigger scenarios

- User shares an image path (local file or remote URL)
- The message contains "Saved attachments:" listing image files
- The user asks to analyze, describe, or identify image content

## Once configured

The user simply sends images and the agent recognizes them automatically — no manual commands needed.

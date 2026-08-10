# Vision Capability

The underlying model has no native image recognition. When you encounter an image, **do not use the Read tool** — use vision.js instead:

```
node vision.js "<image path>" "Describe this image"
```

Base64 / data URLs (e.g. screenshots from Computer Use):

```
node vision.js --base64 "<data URL>" "Describe this image"
node vision.js --base64 - < shot.b64 "Describe this image" --coords center
```

Keep vision replies concise (no filler). For UI/debug inspection — locating elements, click targets, layout — pass `--coords` to get precise pixel element coordinates.

## Trigger scenarios

- User shares an image path (local file or remote URL)
- The message contains "Saved attachments:" listing image files
- The user asks to analyze, describe, or identify image content

## Once configured

The user simply sends images and the agent recognizes them automatically — no manual commands needed.

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

Multi-turn conversations (e.g. "compare with the previous image"): pass the
same `--session <name>` to each call so earlier images and replies are replayed:

```
node vision.js "shot1.png" "Describe this screenshot" --session ui
node vision.js "shot2.png" "Compare with the previous screenshot" --session ui
```

When the conversation is finished, clean up the cache:
`node vision.js --clear ui`.

Keep vision replies concise (no filler). For UI/debug inspection — locating elements, click targets, layout — pass `--coords` to get precise pixel element coordinates.

## Trigger scenarios

- User shares an image path (local file or remote URL)
- The message contains "Saved attachments:" listing image files
- The user asks to analyze, describe, or identify image content

## Once configured

The user simply sends images and the agent recognizes them automatically — no manual commands needed.

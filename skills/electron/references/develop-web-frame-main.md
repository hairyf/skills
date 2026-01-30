---
name: develop-web-frame-main
description: Main process frame control; webFrameMain.fromId/fromFrameToken, executeJavaScript, send, postMessage, frame tree.
---

# webFrameMain (Main Process)

The **webFrameMain** module (main process) lets you control **frames** (main document and iframes) of a WebContents from the main process. Use it to run script in a specific frame, send IPC to a frame, or walk the frame tree. Get frames from navigation events or from `webContents.mainFrame`.

## Resolving Frames

- **webFrameMain.fromId(processId, routingId)** — Returns `WebFrameMain | undefined`. Use `routingId` from events like `did-frame-navigate` (deprecated: prefer `fromFrameToken`).
- **webFrameMain.fromFrameToken(processId, frameToken)** — Returns `WebFrameMain | null`. `frameToken` from renderer `webFrame.frameToken` or from frame events.
- **webContents.mainFrame** — The main frame of the WebContents. **mainFrame.frames** — Array of child frames (recursive). **mainFrame.url**, **mainFrame.origin** (readonly).

## Frame Methods

- **executeJavaScript(code[, userGesture])** — Returns `Promise<unknown>`. Run code in that frame; `userGesture: true` for fullscreen-like APIs.
- **reload()** — Returns boolean; reload the frame.
- **send(channel, ...args)** — Async message to renderer; renderer uses `ipcRenderer.on(channel, ...)`.
- **postMessage(channel, message[, transfer])** — Like `send` but can transfer `MessagePortMain[]`; renderer receives ports in the event’s `ports` property.
- **isDestroyed()** — Returns boolean.
- **collectJavaScriptCallStack()** _(Experimental)_ — Returns `Promise<string | undefined>`; useful when the frame is unresponsive.

## Frame IPC

- **frame.ipc** — Scoped `IpcMain` for this frame. IPC from renderer is routed: `contents.on('ipc-message')` → `contents.mainFrame.on(channel)` → `contents.ipc.on(channel)` → `ipcMain.on(channel)`. Same order for `invoke`: `mainFrame.handle` → `contents.handle` → `ipcMain.handle`. Use **frame.ipc** or **contents.mainFrame** when you need frame-specific handlers.

## Frame Properties

- **url**, **origin** (readonly), **frameTreeNodeId**, **name**, **processId**, **routingId**, **frameToken** (readonly). **parent**, **frames** (children). **dom-ready** event.

## Key Points

- Prefer **frameToken** over **routingId** for new code.
- Only the main frame (and, if enabled, subframes with `nodeIntegrationInSubFrames`) can send IPC by default; use **webContents.ipc** or frame-specific handlers when targeting subframes.

<!--
Source references:
- https://www.electronjs.org/docs/latest/api/web-frame-main
-->

---
name: develop-linux-desktop-actions
description: Linux .desktop file Actions; custom launcher shortcuts; Actions, Desktop Action, Exec, process.argv.
---

# Linux Desktop Launcher Actions

On many Linux environments (e.g. Unity), you can add **custom entries** to the system launcher by editing the app’s **`.desktop`** file. Each entry runs a command (e.g. your app with a flag); the app reads the action from **`process.argv`**.

## .desktop File Format

Define an **`Actions`** line with semicolon-separated action names, then a **`[Desktop Action Name]`** section per action with **`Name`** and **`Exec`** (and optionally **`OnlyShowIn`**).

```ini
Actions=PlayPause;Next;Previous

[Desktop Action PlayPause]
Name=Play-Pause
Exec=/path/to/your-app -t
OnlyShowIn=Unity;

[Desktop Action Next]
Name=Next
Exec=/path/to/your-app -f

[Desktop Action Previous]
Name=Previous
Exec=/path/to/your-app -r
```

The launcher runs `Exec` when the user clicks the shortcut; your app receives arguments in **`process.argv`** (e.g. `-t`, `-f`, `-r`).

## Usage in the App

In the main process, parse `process.argv` after app ready (or at startup) and branch on the desired flags to perform the action (e.g. play-pause, next, previous). Use a single instance lock so that launching with an action focuses the existing instance and performs the action instead of opening a second window.

## Key Points

- Packagers (e.g. Electron Forge) often generate or allow custom `.desktop` files; set `Exec` to your binary and add `Actions` / `[Desktop Action ...]` as above.
- References: [freedesktop.org Desktop Entry Spec](https://specifications.freedesktop.org/desktop-entry-spec/desktop-entry-spec-latest.html), [Unity Launchers](https://help.ubuntu.com/community/UnityLaunchersAndDesktopFiles#Adding_shortcuts_to_a_launcher).

<!--
Source references:
- https://www.electronjs.org/docs/latest/tutorial/linux-desktop-actions
-->

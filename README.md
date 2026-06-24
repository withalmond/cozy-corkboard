# Cozy Corkboard

A cozy pixel-art corkboard task manager — pin tasks, earn leaves, decorate your board, focus with a timer, and listen to lofi radio.

![Windows desktop app](https://img.shields.io/badge/platform-Windows-blue)

---

## Download & install (Windows)

1. **Download** the latest release zip (`cozy-corkboard-vX.X.X-win-x64.zip`) from [Releases](../../releases) or the link your friend shared.
2. **Unzip** the folder anywhere you like (Desktop, Documents, etc.).
3. **Open** the folder and double-click **`cozy corkboard.exe`**.

> **Windows SmartScreen warning?**  
> This app is not code-signed yet. If you see *“Windows protected your PC”*, click **More info** → **Run anyway**. The app is safe — Windows just doesn’t recognize unsigned indie software.

### What you get

- A small floating desktop window (always-on-top by default)
- **📌 Pin** — keep the window above other apps
- **− Minimize** / **✕ Close** — top-right controls
- Drag the title bar to move the window

Your progress saves automatically on your computer.

---

## Features

| Tab | What it does |
|-----|----------------|
| **board** | Pin quick tasks and poster checklists on your corkboard |
| **focus** | Pomodoro-style timer — earn bonus leaves when you finish |
| **radio** | Cozy background music (YouTube streams — needs internet) |
| **shop** | Spend leaves on board frames, note colors, pins, patterns, and decorations |

Click **Cozy Corkboard** (top left) for stats and a user guide.

---

## Tips

- **+ pin a task** — add a new task to the board
- **+ decorate your board** — drag purchased decorations onto the cork (scroll down to see all items, tap **done** when finished)
- **✦ tidy** — remove decorations you’ve placed (appears when you have decor on the board)
- **Radio** — pick a station and press **▶ play** (music only plays while the radio tab is open)

---

## Requirements

- **Windows 10/11** (64-bit)
- **Internet** — only needed for the radio tab

---

## For developers

### Run locally

```powershell
cd task-board
npm install
npm run electron:dev
```

### Build a release zip

```powershell
npm run release
```

Output: `release/cozy-corkboard-v1.0.0-win-x64.zip`

See [AGENTS.md](./AGENTS.md) for the full prep-and-push workflow.

---

## Privacy

All task data, shop purchases, and decorations are stored **locally** on your device (`localStorage` in the desktop app). Nothing is sent to a server except YouTube when you use the radio.

---

Made with ♡ by cosyh

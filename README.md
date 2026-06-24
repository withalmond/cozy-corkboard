# Cozy Corkboard

A cozy pixel-art corkboard task manager — pin tasks, earn leaves, decorate your board, focus with a timer, and listen to lofi radio.

![Windows](https://img.shields.io/badge/Windows-10%2F11-blue) ![Mac](https://img.shields.io/badge/Mac-Ventura%2B-lightgrey)

---

## Download & install

Pick the zip for your computer from [Releases](../../releases) (or the link your friend shared).  
Both zips unzip to a **Cozy Corkboard** folder with **click to run** and **START HERE.txt**.

### Windows

1. Download `cozy-corkboard-vX.X.X-win-x64.zip`
2. Unzip anywhere (Desktop, Documents, etc.)
3. Double-click **click to run**

> **Windows SmartScreen?** Click **More info** → **Run anyway**.

### Mac (Ventura and newer)

1. Download `cozy-corkboard-vX.X.X-mac-universal.zip`
2. Unzip anywhere
3. Double-click **click to run**

> **Mac says it can't verify the developer?** Right-click **click to run** → **Open** → **Open** (one time only).

Works on Intel and Apple Silicon Macs.

### What you get

- A small floating desktop window (always-on-top by default)
- **Pin** — keep the window above other apps
- **Minimize** / **Close** — top-right controls
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
- **tidy** — remove decorations you've placed (appears when you have decor on the board)
- **Radio** — pick a station and press play (music only plays while the radio tab is open)

---

## Requirements

- **Windows 10/11** (64-bit) or **macOS Ventura (13)** and newer
- **Internet** — only needed for the radio tab

---

## For developers

### Run locally

```powershell
npm install
npm run electron:dev
```

### Build release zips

**Windows (on your PC):**

```powershell
npm run release:win
```

**Mac (on a Mac, or via GitHub Actions):**

```bash
npm run release:mac
```

**Both platforms in parallel (GitHub Actions):**

1. Push a tag: `git tag v1.0.2 && git push origin v1.0.2`
2. Or: GitHub → **Actions** → **Build Release** → **Run workflow**

Output:

```
release/cozy-corkboard-v{version}-win-x64.zip
release/cozy-corkboard-v{version}-mac-universal.zip
```

See [AGENTS.md](./AGENTS.md) for the full prep-and-push workflow.

---

## Privacy

All task data, shop purchases, and decorations are stored **locally** on your device. Nothing is sent to a server except YouTube when you use the radio.

---

Made with love by cosyh

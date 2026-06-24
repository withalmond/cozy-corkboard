# Agent guide — Cozy Corkboard

Instructions for Cursor agents preparing, building, and publishing releases.

---

## Project summary

| Item | Value |
|------|-------|
| App name | cozy corkboard |
| Stack | React 18 + Vite + Electron |
| Main code | `src/App.jsx` |
| Electron | `electron/main.js`, `electron/preload.js` |
| Build tool | **electron-packager** (not electron-builder) |
| Data | `localStorage` key `cozy-corkboard` |
| Platforms | Windows x64 + Mac universal (Ventura+) |

---

## Release workflow

### Option A — Both platforms via GitHub Actions (recommended)

1. Bump `package.json` version
2. Commit and push to `main`
3. Tag and push: `git tag v{version} && git push origin v{version}`
4. GitHub Actions **Build Release** runs Windows + Mac in parallel and uploads both zips to Releases

Or trigger manually: **Actions → Build Release → Run workflow**

### Option B — Windows only from dev PC

```powershell
cd C:\Users\cosyh\Projects\task-board
npm install
npm run release:win
npm run publish
```

Mac zip must come from GitHub Actions (cannot build Mac app on Windows).

---

## Pre-flight checks

Ensure committed:

- `src/App.jsx`, `electron/`, `public/`
- `scripts/` (release.ps1, release-mac.sh, START-HERE-*.txt)
- `.github/workflows/release.yml`
- `package.json`, `README.md`, `AGENTS.md`

Do **not** commit `node_modules/`, `dist/`, or `release/`.

---

## Build outputs

| Platform | Zip | Inside |
|----------|-----|--------|
| Windows | `cozy-corkboard-v{version}-win-x64.zip` | `Cozy Corkboard/click to run.exe` + `START HERE.txt` |
| Mac | `cozy-corkboard-v{version}-mac-universal.zip` | `Cozy Corkboard/click to run.app` + `START HERE.txt` |

---

## Scripts reference

| Command | Purpose |
|---------|---------|
| `npm run electron:dev` | Dev mode (Vite + Electron) |
| `npm run electron:build:win` | Windows packager folder |
| `npm run electron:build:mac` | Mac universal `.app` (Mac or CI only) |
| `npm run release:win` | Windows build + friendly zip |
| `npm run release:mac` | Mac build + friendly zip |
| `npm run publish` | Push + GitHub release (Windows zip local; Mac via CI) |

---

## Publishing gotchas

- **Mac builds require macOS** — use GitHub Actions `macos-13` runner (Ventura)
- **Universal binary** — one Mac zip for Intel + Apple Silicon
- **Unsigned apps** — SmartScreen (Windows) and Gatekeeper (Mac); documented in START HERE files
- **Parallel CI** — `.github/workflows/release.yml` builds both platforms simultaneously
- Only commit or push when the user explicitly asks

---

## File map

```
task-board/
├── src/App.jsx
├── electron/main.js
├── electron/preload.js
├── public/
├── scripts/
│   ├── release.ps1          # Windows zip
│   ├── release-mac.sh       # Mac zip
│   ├── publish-github.ps1
│   ├── START-HERE-windows.txt
│   └── START-HERE-mac.txt
├── .github/workflows/release.yml
├── README.md
└── AGENTS.md
```

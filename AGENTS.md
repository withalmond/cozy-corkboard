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
| Build tool | **electron-packager** (not electron-builder — fails on Windows symlinks) |
| Data | `localStorage` key `cozy-corkboard` |

---

## Release workflow (run in order)

When the user asks to **prep, publish, or push a release**, follow these steps exactly.

### 1. Pre-flight checks

```powershell
cd C:\Users\cosyh\Projects\task-board
git status
```

Ensure these are committed (or include in the release commit):

- `src/App.jsx`
- `electron/`
- `public/` (icons: `radio-icon.png`, `music-note-icon.png`, `focus-clock-icon.png`)
- `package.json`, `package-lock.json`
- `README.md`, `AGENTS.md`, `scripts/release.ps1`

Do **not** commit `node_modules/`, `dist/`, or `release/`.

### 2. Bump version (if releasing a new version)

Edit `package.json` → `"version"` (semver, e.g. `1.0.0` → `1.0.1`).

### 3. Build release zip

```powershell
npm install
npm run release
```

This runs `electron:build` and creates:

```
release/cozy-corkboard-v{version}-win-x64.zip
```

Verify the zip contains `cozy corkboard.exe` and launches correctly:

```powershell
Start-Process "release\cozy corkboard-win32-x64\cozy corkboard.exe"
```

Smoke-test: board, shop, focus, radio, decorate mode.

### 4. Commit release prep (only when user asks to commit)

```powershell
git add README.md AGENTS.md scripts/ public/ src/ electron/ package.json package-lock.json vite.config.js index.html .gitignore
git commit -m "Prepare v{version} release"
```

Never commit secrets. Never force-push `main`.

### 5. Push to GitHub (when remote exists)

```powershell
git remote -v
git push -u origin main
```

If no remote:

```powershell
gh repo create cozy-corkboard --private --source=. --push
# or: git remote add origin https://github.com/USER/cozy-corkboard.git
```

### 6. Create GitHub Release

```powershell
$v = (Get-Content package.json | ConvertFrom-Json).version
gh release create "v$v" "release/cozy-corkboard-v$v-win-x64.zip" `
  --title "Cozy Corkboard v$v" `
  --notes "## Install (Windows)`n`n1. Download the zip below`n2. Unzip anywhere`n3. Run cozy corkboard.exe`n`nIf Windows SmartScreen appears: More info → Run anyway."
```

### 7. Tell the user

Share the GitHub Releases URL or upload the zip to itch.io / Google Drive.

---

## Scripts reference

| Command | Purpose |
|---------|---------|
| `npm run electron:dev` | Dev mode (Vite + Electron) |
| `npm run electron:build` | Production build + packager folder |
| `npm run release` | Build + zip for distribution |
| `npm run build` | Web-only Vite build (`dist/`) |

---

## Publishing gotchas

- **electron-builder** is in devDependencies but **do not use** for Windows builds — use `electron-packager` via `npm run electron:build`.
- **SmartScreen**: unsigned `.exe` — document in README; code signing is optional future work.
- **Port conflicts**: kill stale processes on 5173 before `electron:dev`.
- **Radio**: requires internet + YouTube iframe API.
- Only create git commits or push when the **user explicitly asks**.

---

## Web deploy (optional)

For a browser version without the floating window:

```powershell
npm run build
```

Upload `dist/` to Netlify Drop, Vercel, or GitHub Pages. Note: no custom title bar, data is per-browser.

---

## File map

```
task-board/
├── src/App.jsx          # entire app UI + logic
├── electron/main.js     # window config (762×680, frameless, always-on-top)
├── electron/preload.js  # minimize / close / pin / drag API
├── public/              # static assets copied to dist
├── scripts/release.ps1  # build + zip automation
├── README.md            # user install guide
└── AGENTS.md            # this file
```

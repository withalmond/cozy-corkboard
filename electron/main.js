const { app, BrowserWindow, ipcMain, shell } = require("electron");
const path = require("path");

const isDev = process.env.NODE_ENV === "development";

function createWindow() {
  const win = new BrowserWindow({
    width: 762,
    height: 680,
    minWidth: 420,
    minHeight: 500,
    // Floating window behaviour
    alwaysOnTop: true,
    frame: false,          // no OS title bar — we'll draw our own
    transparent: true,     // lets the rounded corners show through
    resizable: true,
    hasShadow: true,
    // Start centred
    center: true,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  if (isDev) {
    win.loadURL("http://localhost:5173");
    win.webContents.openDevTools({ mode: "detach" });
  } else {
    win.loadFile(path.join(__dirname, "../dist/index.html"));
  }

  // Allow dragging the window from the custom title bar
  ipcMain.on("window-drag", (_e, { dx, dy }) => {
    const [x, y] = win.getPosition();
    win.setPosition(x + dx, y + dy);
  });

  ipcMain.on("window-minimize", () => win.minimize());
  ipcMain.on("window-close",    () => win.close());
  ipcMain.on("window-pin",      () => {
    const next = !win.isAlwaysOnTop();
    win.setAlwaysOnTop(next);
    win.webContents.send("pin-changed", next);
  });
}

app.whenReady().then(createWindow);

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});

app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) createWindow();
});

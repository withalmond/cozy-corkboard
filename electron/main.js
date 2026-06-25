const { app, BrowserWindow, ipcMain, session } = require("electron");
const path = require("path");
const http = require("http");
const fs = require("fs");

const isDev = process.env.NODE_ENV === "development";

// YouTube audio in a hidden iframe needs autoplay without a fresh gesture after async init.
app.commandLine.appendSwitch("autoplay-policy", "no-user-gesture-required");

const MIME = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".gif": "image/gif",
  ".svg": "image/svg+xml",
  ".ico": "image/x-icon",
  ".json": "application/json",
  ".woff": "font/woff",
  ".woff2": "font/woff2",
};

let staticServer = null;

function startStaticServer() {
  const distDir = path.normalize(path.join(__dirname, "../dist"));
  return new Promise((resolve, reject) => {
    staticServer = http.createServer((req, res) => {
      try {
        let rel = decodeURIComponent((req.url || "/").split("?")[0]);
        if (rel === "/") rel = "/index.html";
        while (rel.startsWith("/")) rel = rel.slice(1);
        const filePath = path.normalize(path.join(distDir, rel));
        if (!filePath.startsWith(distDir)) {
          res.writeHead(403);
          res.end();
          return;
        }
        fs.readFile(filePath, (err, data) => {
          if (err) {
            res.writeHead(404);
            res.end();
            return;
          }
          res.writeHead(200, { "Content-Type": MIME[path.extname(filePath).toLowerCase()] || "application/octet-stream" });
          res.end(data);
        });
      } catch {
        res.writeHead(500);
        res.end();
      }
    });
    staticServer.on("error", reject);
    staticServer.listen(0, "127.0.0.1", () => {
      const { port } = staticServer.address();
      resolve(port);
    });
  });
}

function createWindow(loadUrl) {
  const win = new BrowserWindow({
    width: 762,
    height: 680,
    minWidth: 520,
    minHeight: 500,
    backgroundColor: "#FBF4E4",
    alwaysOnTop: true,
    frame: false,
    transparent: false,
    resizable: true,
    hasShadow: true,
    center: true,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  // YouTube embeds behave better with a normal Chrome user agent.
  const ua = win.webContents.getUserAgent().replace(/\sElectron\/[^\s]+/g, "");
  win.webContents.setUserAgent(ua);

  win.loadURL(loadUrl);

  ipcMain.on("window-drag", (_e, { dx, dy }) => {
    const [x, y] = win.getPosition();
    win.setPosition(x + dx, y + dy);
  });

  ipcMain.on("window-minimize", () => win.minimize());
  ipcMain.on("window-close", () => win.close());
  ipcMain.on("window-pin", () => {
    const next = !win.isAlwaysOnTop();
    win.setAlwaysOnTop(next);
    win.webContents.send("pin-changed", next);
  });
}

app.whenReady().then(async () => {
  session.defaultSession.setPermissionRequestHandler((_wc, permission, callback) => {
    callback(permission === "media" || permission === "fullscreen");
  });
  session.defaultSession.setPermissionCheckHandler((_wc, permission) => {
    return permission === "media" || permission === "fullscreen";
  });

  if (isDev) {
    createWindow("http://localhost:5173");
  } else {
    const port = await startStaticServer();
    createWindow(`http://127.0.0.1:${port}/index.html`);
  }
});

app.on("window-all-closed", () => {
  if (staticServer) staticServer.close();
  if (process.platform !== "darwin") app.quit();
});

app.on("activate", async () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    if (isDev) createWindow("http://localhost:5173");
    else {
      const port = staticServer?.address?.()?.port || await startStaticServer();
      createWindow(`http://127.0.0.1:${port}/index.html`);
    }
  }
});

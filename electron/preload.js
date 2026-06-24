const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("electronAPI", {
  minimize: ()       => ipcRenderer.send("window-minimize"),
  close:    ()       => ipcRenderer.send("window-close"),
  togglePin:()       => ipcRenderer.send("window-pin"),
  onPinChanged: (cb) => ipcRenderer.on("pin-changed", (_e, val) => cb(val)),
  // Called by the drag handle with delta pixels
  drag: (dx, dy)     => ipcRenderer.send("window-drag", { dx, dy }),
});

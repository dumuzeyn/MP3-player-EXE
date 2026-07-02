const { app, BrowserWindow, dialog, ipcMain } = require("electron");
const fs = require("fs/promises");
const path = require("path");

const audioFilters = [
  { name: "Audio files", extensions: ["mp3", "wav", "ogg", "m4a", "aac", "flac", "webm"] },
  { name: "All files", extensions: ["*"] }
];

function mimeTypeFor(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  const types = {
    ".aac": "audio/aac",
    ".flac": "audio/flac",
    ".m4a": "audio/mp4",
    ".mp3": "audio/mpeg",
    ".ogg": "audio/ogg",
    ".wav": "audio/wav",
    ".webm": "audio/webm"
  };
  return types[ext] || "audio/mpeg";
}

ipcMain.handle("select-audio-files", async (event) => {
  const owner = BrowserWindow.fromWebContents(event.sender);
  const result = await dialog.showOpenDialog(owner, {
    title: "Choose music",
    properties: ["openFile", "multiSelections"],
    filters: audioFilters
  });

  if (result.canceled) return [];

  return Promise.all(result.filePaths.map(async (filePath) => {
    const [stats, buffer] = await Promise.all([
      fs.stat(filePath),
      fs.readFile(filePath)
    ]);

    return {
      name: path.basename(filePath),
      size: stats.size,
      lastModified: stats.mtimeMs,
      type: mimeTypeFor(filePath),
      data: buffer.buffer.slice(buffer.byteOffset, buffer.byteOffset + buffer.byteLength)
    };
  }));
});

function createWindow() {
  const win = new BrowserWindow({
    width: 420,
    height: 820,
    minWidth: 360,
    minHeight: 640,
    backgroundColor: "#ffffff",
    title: "MP3 Player",
    autoHideMenuBar: true,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true
    }
  });

  win.loadFile(path.join(__dirname, "index.html"));
}

app.whenReady().then(() => {
  createWindow();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

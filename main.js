const { app, BrowserWindow, Menu, Tray, dialog, ipcMain, nativeImage, shell } = require("electron");
const fs = require("fs/promises");
const path = require("path");
const { pathToFileURL } = require("url");

let mainWindow = null;
let tray = null;
let isQuitting = false;

const audioFilters = [
  { name: "MP3 files", extensions: ["mp3"] }
];
const appIndexUrl = pathToFileURL(path.join(__dirname, "index.html")).href;
const allowedExternalUrls = new Set(["https://github.com/dumuzeyn/MP3-player-EXE"]);

function mimeTypeFor(filePath) {
  return /\.mp3$/i.test(filePath) ? "audio/mpeg" : "";
}

function isMp3Path(filePath) {
  return typeof filePath === "string" && path.isAbsolute(filePath) && path.extname(filePath).toLowerCase() === ".mp3";
}

function trustedSender(event) {
  const senderUrl = event.senderFrame?.url || event.sender.getURL();
  return senderUrl === appIndexUrl;
}

function safeAudioPaths(filePaths) {
  if (!Array.isArray(filePaths)) return [];
  return [...new Set(filePaths)]
    .filter(isMp3Path)
    .slice(0, 500);
}

function synchsafeToInt(bytes) {
  return (bytes[0] << 21) | (bytes[1] << 14) | (bytes[2] << 7) | bytes[3];
}

function decodeIso88591(bytes) {
  return Buffer.from(bytes).toString("latin1");
}

function decodeUtf16(bytes, littleEndian) {
  const values = [];
  for (let index = 0; index + 1 < bytes.length; index += 2) {
    const code = littleEndian ? bytes[index] | (bytes[index + 1] << 8) : (bytes[index] << 8) | bytes[index + 1];
    if (code === 0) break;
    values.push(code);
  }
  return String.fromCharCode(...values);
}

function decodeTextFrame(bytes) {
  const encoding = bytes[0];
  const body = bytes.subarray(1);
  let text = "";

  if (encoding === 0) text = decodeIso88591(body);
  else if (encoding === 1) {
    const littleEndian = body[0] === 0xff && body[1] === 0xfe;
    const start = body[0] === 0xff || body[0] === 0xfe ? 2 : 0;
    text = decodeUtf16(body.subarray(start), littleEndian);
  } else if (encoding === 2) text = decodeUtf16(body, false);
  else text = Buffer.from(body).toString("utf8");

  return text.replace(/\0/g, "").trim();
}

function findNullTerminator(bytes, start, encoding) {
  if (encoding === 1 || encoding === 2) {
    for (let index = start; index + 1 < bytes.length; index += 2) {
      if (bytes[index] === 0 && bytes[index + 1] === 0) return index + 2;
    }
    return bytes.length;
  }
  const index = bytes.indexOf(0, start);
  return index === -1 ? bytes.length : index + 1;
}

function parsePictureFrame(bytes) {
  const encoding = bytes[0];
  let cursor = 1;
  const mimeEnd = bytes.indexOf(0, cursor);
  if (mimeEnd === -1) return null;
  const mimeType = decodeIso88591(bytes.subarray(cursor, mimeEnd)) || "image/jpeg";
  cursor = mimeEnd + 2;
  cursor = findNullTerminator(bytes, cursor, encoding);
  const imageBytes = bytes.subarray(cursor);
  if (!imageBytes.length) return null;
  return `data:${mimeType};base64,${Buffer.from(imageBytes).toString("base64")}`;
}

async function readMp3Tags(filePath) {
  const handle = await fs.open(filePath, "r");
  try {
    const header = Buffer.alloc(10);
    const { bytesRead } = await handle.read(header, 0, 10, 0);
    if (bytesRead < 10 || header.subarray(0, 3).toString("latin1") !== "ID3") return {};

    const version = header[3];
    const tagSize = synchsafeToInt(header.subarray(6, 10));
    if (tagSize <= 0 || tagSize > 8 * 1024 * 1024) return {};

    const bytes = Buffer.alloc(tagSize);
    await handle.read(bytes, 0, tagSize, 10);
    const tags = {};
    let offset = 0;

    while (offset + 10 <= bytes.length) {
      const frameId = bytes.subarray(offset, offset + 4).toString("latin1");
      if (!frameId.trim() || bytes[offset] === 0) break;
      const sizeBytes = bytes.subarray(offset + 4, offset + 8);
      const frameSize = version === 4 ? synchsafeToInt(sizeBytes) : sizeBytes.readUInt32BE(0);
      if (frameSize <= 0 || offset + 10 + frameSize > bytes.length) break;

      const frame = bytes.subarray(offset + 10, offset + 10 + frameSize);
      if (frameId === "TIT2") tags.title = decodeTextFrame(frame);
      if (frameId === "TPE1") tags.artist = decodeTextFrame(frame);
      if (frameId === "TALB") tags.album = decodeTextFrame(frame);
      if (frameId === "TCON") tags.genre = decodeTextFrame(frame).replace(/^\(\d+\)/, "");
      if (frameId === "APIC" && !tags.coverDataUrl) tags.coverDataUrl = parsePictureFrame(frame);

      offset += 10 + frameSize;
    }

    return tags;
  } finally {
    await handle.close();
  }
}

async function makeAudioRecord(filePath) {
  const [stats, tags] = await Promise.all([
    fs.stat(filePath),
    readMp3Tags(filePath).catch(() => ({}))
  ]);
  if (!stats.isFile()) return null;

  return {
    filePath,
    fileUrl: pathToFileURL(filePath).href,
    name: path.basename(filePath),
    size: stats.size,
    lastModified: stats.mtimeMs,
    type: mimeTypeFor(filePath),
    title: tags.title || "",
    artist: tags.artist || "",
    album: tags.album || "",
    genre: tags.genre || "",
    coverDataUrl: tags.coverDataUrl || ""
  };
}

ipcMain.handle("select-audio-files", async (event) => {
  if (!trustedSender(event)) return [];
  const owner = BrowserWindow.fromWebContents(event.sender);
  const result = await dialog.showOpenDialog(owner, {
    title: "Choose music",
    properties: ["openFile", "multiSelections"],
    filters: audioFilters
  });

  if (result.canceled) return [];

  const records = await Promise.all(safeAudioPaths(result.filePaths).map(makeAudioRecord));
  return records.filter(Boolean);
});

ipcMain.handle("read-audio-files", async (event, filePaths) => {
  if (!trustedSender(event)) return [];
  const records = await Promise.all(safeAudioPaths(filePaths).map(makeAudioRecord));
  return records.filter(Boolean);
});

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 560,
    height: 820,
    minWidth: 460,
    minHeight: 640,
    backgroundColor: "#ffffff",
    title: "MP3 Player",
    icon: path.join(__dirname, "icon.ico"),
    autoHideMenuBar: true,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true,
      webSecurity: true,
      allowRunningInsecureContent: false
    }
  });

  mainWindow.webContents.session.setPermissionRequestHandler((_webContents, _permission, callback) => {
    callback(false);
  });

  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    if (allowedExternalUrls.has(url)) shell.openExternal(url);
    return { action: "deny" };
  });

  mainWindow.webContents.on("will-navigate", (event, url) => {
    if (url === appIndexUrl) return;
    event.preventDefault();
    if (allowedExternalUrls.has(url)) shell.openExternal(url);
  });

  mainWindow.on("close", (event) => {
    if (isQuitting) return;
    event.preventDefault();
    mainWindow.hide();
  });

  mainWindow.loadFile(path.join(__dirname, "index.html"));
}

function showWindow() {
  if (!mainWindow) return;
  mainWindow.show();
  mainWindow.focus();
}

function createTray() {
  const icon = nativeImage.createFromPath(path.join(__dirname, "icon.ico"));
  tray = new Tray(icon);
  tray.setToolTip("MP3 Player");
  tray.setContextMenu(Menu.buildFromTemplate([
    { label: "Open MP3 Player", click: showWindow },
    {
      label: "Quit",
      click: () => {
        isQuitting = true;
        app.quit();
      }
    }
  ]));
  tray.on("click", showWindow);
}

app.whenReady().then(() => {
  app.setAppUserModelId("com.dumuzeyn.mp3player.exe");
  createWindow();
  createTray();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
      return;
    }
    showWindow();
  });
});

app.on("window-all-closed", () => {
  if (isQuitting && process.platform !== "darwin") {
    app.quit();
  }
});

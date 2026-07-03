const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("mp3PlayerNative", {
  selectAudioFiles: () => ipcRenderer.invoke("select-audio-files"),
  readAudioFiles: (filePaths) => ipcRenderer.invoke(
    "read-audio-files",
    Array.isArray(filePaths) ? filePaths.filter((filePath) => typeof filePath === "string") : []
  )
});

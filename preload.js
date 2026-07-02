const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("mp3PlayerNative", {
  selectAudioFiles: () => ipcRenderer.invoke("select-audio-files")
});

// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts
const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('tidy', {
  chooseFolder: () => ipcRenderer.invoke('chooseFolder'),
  tidingFiles: (baseFolder) => ipcRenderer.invoke('tidingFiles', baseFolder),
});

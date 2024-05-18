const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('activation', {
  active: (activationKey) => ipcRenderer.invoke('active', activationKey),
  closeActivationWindow: () => ipcRenderer.invoke('closeActivationWindow'),
  isActived: () => ipcRenderer.invoke('isActived'),
});

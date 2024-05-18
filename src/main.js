const {
  app,
  BrowserWindow,
  ipcMain,
  dialog,
  nativeImage,
} = require('electron');
const path = require('node:path');
import { activate, isActivated } from './activation_window/activation';
import { tidingFiles } from './tidy';

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) {
  app.quit();
}

const createWindow = () => {
  const appIcon = nativeImage.createFromPath('assets/img/icon.png');
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    icon: appIcon,
    width: 600,
    height: 300,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
    },
  });
  mainWindow.setMenuBarVisibility(false);

  // and load the index.html of the app.
  if (MAIN_WINDOW_VITE_DEV_SERVER_URL) {
    mainWindow.loadURL(MAIN_WINDOW_VITE_DEV_SERVER_URL);
  } else {
    mainWindow.loadFile(path.join(__dirname, `../renderer/${MAIN_WINDOW_VITE_NAME}/index.html`));
  }

  // Open the DevTools.
  // mainWindow.webContents.openDevTools();

  const activationStatus = isActivated();
  if (!activationStatus) {
    // Create activation window
    const activationWindow = new BrowserWindow({
      parent: mainWindow,
      modal: true,
      width: 400,
      height: 200,
      minimizable: false,
      webPreferences: {
        preload: path.join(__dirname, 'aw-preload.js'),
      },
    });

    activationWindow.webContents.openDevTools();
    activationWindow.setMenuBarVisibility(false);

    if (MAIN_WINDOW_VITE_DEV_SERVER_URL) {
      activationWindow.loadURL(`${MAIN_WINDOW_VITE_DEV_SERVER_URL}/src/activation_window/`);
    } else {
      activationWindow.loadFile(path.join(__dirname, `../renderer/${MAIN_WINDOW_VITE_NAME}/src/activation_window/index.html`));
    }

    activationWindow.on('close', () => {
      mainWindow.close();
    });

    // Activation Service
    ipcMain.handle('active', (_, activationKey) => {
      const response = activate(activationKey)
      if (response.status === 'success') activationWindow.hide();
      return response;
    });
  }

  // Main Service
  ipcMain.handle('chooseFolder', () => {
    return dialog.showOpenDialog(mainWindow, {
      title: 'Choose folder to tiding',
      properties: ['openDirectory'],
    });
  });

  ipcMain.handle('tidingFiles', (_, baseFolder) => tidingFiles(baseFolder));
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  createWindow();

  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.

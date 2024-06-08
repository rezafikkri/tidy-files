const {
  app,
  BrowserWindow,
  ipcMain,
  dialog,
  Notification,
} = require('electron');
const path = require('node:path');
import { activate, isActivated } from '../activation_window/activation';
import { tidingFiles } from './tidy';

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) {
  app.quit();
}

const createWindow = () => {
  const appIcon = path.join(process.cwd(), "public", "icon.png");
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
  //mainWindow.webContents.openDevTools();

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
      activationWindow.loadURL(`${MAIN_WINDOW_VITE_DEV_SERVER_URL}/activation_window.html`);
    } else {
      activationWindow.loadFile(path.join(__dirname, `../renderer/${MAIN_WINDOW_VITE_NAME}/activation_window.html`));
    }

    activationWindow.on('close', () => {
      mainWindow.close();
    });
  }
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  // Main Service
  ipcMain.handle('chooseFolder', () => {
    return dialog.showOpenDialog({
      title: 'Choose folder to tiding',
      properties: ['openDirectory'],
    });
  });
  ipcMain.handle('tidingFiles', (_, baseFolder) => tidingFiles(baseFolder));

  // Activation service
  const activationStatus = isActivated();
  if (!activationStatus) {
    // Activation Service
    ipcMain.handle('active', (_, activationKey) => {
      const response = activate(activationKey)
      if (response.status === 'success') {
        BrowserWindow.getFocusedWindow().hide();
        // show notification
        new Notification({
          title: 'Activation success',
          body: response.message,
          icon: '../assets/img/icon.png',
        }).show();
      }
      return response;
    });
  }

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

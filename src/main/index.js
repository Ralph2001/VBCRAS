import { app, shell, BrowserWindow, ipcMain } from 'electron'
import { join } from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import icon from '../../resources/icon.png'
import { PythonShell } from 'python-shell';
const { dialog } = require('electron')
const os = require('os');
const username = os.userInfo().username;




var child = require('child_process').execFile;

let pythonProcess;

if (is.dev) {
  PythonShell.run(join(__dirname, '../../resources/script/main.py'), null).then(messages => {
    console.log('finished');
  });
} else {
  child(join(__dirname, '../../resources/script/dist/main/main.exe'))
}


ipcMain.handle('select-folder', async (event) => {
  const { canceled, filePaths } = await dialog.showOpenDialog({
    properties: ['openDirectory'],
    defaultPath: 'C:\\Users\\'+ username+ '\\SynologyDrive\\Joan\\SCANNED DOCUMENTS'
  });

  return { canceled, filePaths }; 
});


//Main Window
function mainWindow() {
  const mainWindow = new BrowserWindow({
    width: 900,
    height: 670,
    show: false,
    autoHideMenuBar: true,
    ...(process.platform === 'linux' ? { icon } : {}),
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false
    }
  })

  mainWindow.setMinimumSize(817, 610)

  mainWindow.on('ready-to-show', () => {
    mainWindow.show()
  })

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })


  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }
}


app.whenReady().then(() => {
  electronApp.setAppUserModelId('com.localcivilregistry.office');
  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window);
  });
  mainWindow()
  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) mainWindow()
  })
})


app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})


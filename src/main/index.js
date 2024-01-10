import { app, shell, BrowserWindow, ipcMain } from 'electron'
import { join } from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import icon from '../../resources/icon.png'
import { PythonShell } from 'python-shell';
const { dialog } = require('electron')
const os = require('os');
const username = os.userInfo().username;
var child = require('child_process').execFile;
const fs = require('fs-extra')




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
    defaultPath: 'C:\\Users\\' + username + '\\SynologyDrive\\Joan\\SCANNED DOCUMENTS'
  });

  return { canceled, filePaths };
});

ipcMain.handle('select-file', async (event) => {
  const { canceled, filePaths } = await dialog.showOpenDialog({
    properties: ['openFile '],
    filters: [
      { name: 'PDF Files', extensions: ['pdf'] },
    ]
  });

  return { canceled, filePaths };
});


ipcMain.handle('move-file', async (event, data) => {
  const original = data.value1;
  const destination = data.value2;

  try {
    await fs.move(original, destination);
    event.returnValue = 'File moved successfully!';
  } catch (err) {
    console.error(err);
    event.returnValue = 'Error moving file: ' + err.message;
  }
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


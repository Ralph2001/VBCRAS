import { app, shell, BrowserWindow, ipcMain } from 'electron'
import { join } from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import icon from '../../resources/icon.png'
import { PythonShell } from 'python-shell';
const { execFile } = require('child_process');


const { dialog } = require('electron')
const os = require('os');
const username = os.userInfo().username;


const fs = require('fs-extra')


let pythonprocess;
let dialogOpen = false;


if (is.dev) {
  PythonShell.run(join(__dirname, '../../resources/script/main.py'), null).then(messages => {
    console.log('finished');
  });

} else {
  pythonprocess = execFile(join(__dirname, '../../resources/script/dist/main/main.exe'));
}




ipcMain.handle('select-folder', async (event) => {
  if (dialogOpen) return;
  try {
    dialogOpen = true
    const { canceled, filePaths } = await dialog.showOpenDialog({
      properties: ['openDirectory'],
      defaultPath: 'C:\\Users\\' + username + '\\SynologyDrive\\Joan\\SCANNED DOCUMENTS'
    });
    return { canceled, filePaths };
  } catch (err) {
    console.error("There was an error", err)
  }
  finally {
    dialogOpen = false
  }
});

ipcMain.handle('select-file', async (event) => {
  if (dialogOpen) return;
  try {
    dialogOpen = true;
    const { canceled, filePaths } = await dialog.showOpenDialog({
      properties: ['openFile'],
      filters: [{ name: 'PDF Files', extensions: ['pdf'] }],
    });
    return { canceled, filePaths };
  } finally {
    dialogOpen = false;
  }
});


ipcMain.handle('move-file', async (event, { source, destination }) => {
  try {
    await fs.move(source, destination);
    event.returnValue = 'File moved successfully!';
  } catch (err) {
    console.error(err);
    event.returnValue = 'Error moving file: ' + err.message;
  }
});

ipcMain.handle('copy-file', async (event, { source, destination }) => {
  try {
    await fs.copy(source, destination);
    event.returnValue = true;
  } catch (err) {
    console.error(err);
    event.returnValue = 'Error moving file: ' + err.message;
  }
});


ipcMain.handle('open-file', async (event, source) => {
  try {
    const win = new BrowserWindow({
      webPreferences: {
        plugins: true,
        devTools: false
      },
      autoHideMenuBar: true,
    });
    win.loadURL('C:\\Users\\' + username + '\\' + source);
    return true;
  } catch (err) {
    return false;
  }
});


ipcMain.handle('open-file-folder', async (event, path) => {
  try {
    const filefolder = shell.showItemInFolder('C:\\Users\\' + username + '\\' + path)
    return true;
  } catch (err) {
    return false;
  }
});


ipcMain.handle('get-user', async (event) => {
  return username;
});






//Main Window
function mainWindow() {
  const mainWindow = new BrowserWindow({
    width: 1060,
    height: 670,
    show: false,

    autoHideMenuBar: true,
    ...(process.platform === 'linux' ? { icon } : {}),
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false
    },
  }
  )


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
    if (pythonprocess) {
      pythonprocess.kill('SIGTERM');
    }
    app.quit()
  }
})


import { app, shell, BrowserWindow, ipcMain, utilityProcess } from 'electron'
import { join } from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import icon from '../../resources/icon.png'
import { generate } from '../generator/clerical_error'


const { execFile } = require('child_process');
const { spawn } = require('child_process');


const { dialog } = require('electron')
const os = require('os');

const username = os.userInfo().username;

var interfaces = os.networkInterfaces();
var addresses = [];
for (var k in interfaces) {
  for (var k2 in interfaces[k]) {
    var address = interfaces[k][k2];
    if (address.family === 'IPv4' && !address.internal) {
      addresses.push(address.address);
    }
  }
}



const fs = require('fs-extra')



let dialogOpen = false;


let pythonProcess = null;
async function startServer() {
  try {

    // pythonProcess = execFile(join(__dirname, '../../resources/script/dist/main/main.exe'));

    pythonProcess = spawn('python', [join(__dirname, '../../resources/script/main.py')], {
    });


    pythonProcess.on('error', (error) => {
      console.error('Error starting Python process:', error);
      pythonProcess = null;
    });

    pythonProcess.on('exit', (code, signal) => {
      console.log(`Python process exited with code ${code} and signal ${signal}`);
      pythonProcess = null;
    });


    return true;
  } catch (error) {
    console.error('Error starting server:', error);
    return false;
  }
}

ipcMain.handle('is-server-running', async (event) => {
  try {
    if (pythonProcess) {
      return true;
    }
    else {
      return false
    }
  } catch (error) {
    console.log(error);
  }
});

ipcMain.handle('start-server', async (event) => {
  try {
    if (pythonProcess) {
      console.warn('Server is already running, cannot start again.');
      return false;
    }
    const success = await startServer();
    return { success, addresses };
  } catch (error) {
    console.error('Error handling start-server request:', error);
    return false;
  }
});

ipcMain.handle('stop-server', async (event) => {
  if (pythonProcess) {
    try {
      if (pythonProcess.connected) {
        pythonProcess.send('SIGTERM');
        await new Promise((resolve) => setTimeout(resolve, 500));
      }
      pythonProcess.kill();
      pythonProcess = null;
      return true;
    } catch (error) {
      console.error('Error stopping server:', error);
      return false;
    }
  } else {
    console.warn('Server is not running, cannot stop.');
    return false;
  }
});


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

let win;

ipcMain.handle('open-file', async (event, source) => {
  try {
    win = new BrowserWindow({
      webPreferences: {
        plugins: true,
        devTools: false,
      },
      autoHideMenuBar: true,
      show: true
    });
    const load = await win.loadURL('C:\\Users\\' + username + '\\' + source);
    return true
  } catch (error) {
    win.close()
    return false
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

  mainWindow.setMinimumSize(1050, 500)

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
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'), { hash: 'home' })
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


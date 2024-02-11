import { app, shell, BrowserWindow, ipcMain, utilityProcess } from 'electron'
import { join } from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import icon from '../../resources/icon.png'
import message from '../renderer/src/assets/presets/lara/message';
const { PythonShell } = require('python-shell');

const { execFile } = require('child_process');
const { spawn } = require('child_process');


const { dialog } = require('electron')
const os = require('os');
const username = os.userInfo().username;

const fs = require('fs-extra')



let dialogOpen = false;


// if (is.dev) {
//   PythonShell.run(join(__dirname, '../../resources/script/main.py'), null).then(messages => {
//     console.log('finished');
//   });

// } else {
//   pythonprocess = execFile(join(__dirname, '../../resources/script/dist/main/main.exe'));
// }



// Error handling to ensure correct behavior in case of failure
let pythonProcess = null;
async function startServer() {
  try {
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

ipcMain.handle('start-server', async (event) => {
  try {
    if (pythonProcess) {
      console.warn('Server is already running, cannot start again.');
      return false;
    }
    
    const success = await startServer();
    return success;
  } catch (error) {
    console.error('Error handling start-server request:', error);
    return false;
  }
});

ipcMain.handle('stop-server', async (event) => {
  if (pythonProcess) {
    try {
      if (pythonProcess.connected) {
        // Send SIGTERM to the process
        pythonProcess.send('SIGTERM');
        // Wait for a short timeout to allow for graceful shutdown
        await new Promise((resolve) => setTimeout(resolve, 500));
      }
      // If termination is unsuccessful or not supported, force kill
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


ipcMain.handle('open-file', (event, source) => {
  const win = new BrowserWindow({
    webPreferences: {
      plugins: true,
      devTools: false,
    },
    autoHideMenuBar: true,
    show: false
  });
  win.loadURL('C:\\Users\\' + username + '\\' + source);
  win.once('ready-to-show'), () => {
    win.show()
    return true
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


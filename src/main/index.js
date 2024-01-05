import { app, shell, BrowserWindow } from 'electron'
import { join } from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
<<<<<<< HEAD
import icon from '../../resources/icon.png'
import { PythonShell } from 'python-shell';
var child = require('child_process').execFile;
=======
import icon from '../../resources/icon.png?asset'
import { PythonShell } from 'python-shell';
>>>>>>> 3bcb63d86e5c6f4ca0553947930db7f042d14856

let pythonProcess;

<<<<<<< HEAD
if (is.dev) {
  PythonShell.run(join(__dirname, '../../resources/script/main.py'), null).then(messages => {
    console.log('finished');
  });
} else {
  child(join(__dirname, '../../resources/script/dist/main/main.exe'))
}
=======
PythonShell.run(join(__dirname, '../../resources/script/main.py'), null).then(messages => {
  console.log('finished');
  pythonProcess = this;
})
>>>>>>> 3bcb63d86e5c6f4ca0553947930db7f042d14856


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
<<<<<<< HEAD
=======
  const { net } = require('electron')
>>>>>>> 3bcb63d86e5c6f4ca0553947930db7f042d14856
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
<<<<<<< HEAD
=======
    if (pythonProcess) {
      pythonProcess.kill('SIGINT');  // Send SIGINT to terminate gracefully
    }
>>>>>>> 3bcb63d86e5c6f4ca0553947930db7f042d14856
    app.quit()
  }
})


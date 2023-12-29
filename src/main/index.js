import { app, shell, BrowserWindow } from 'electron'
import { join } from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import icon from '../../resources/icon.png?asset'
import mysql from 'mysql2';

let connection;


function createWindow() {

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

function retryConnection() {
  const retryWindow = new BrowserWindow({
    width: 400,
    height: 400,
    show: false,
    autoHideMenuBar: true,

  })

  retryWindow.on('ready-to-show', () => {
    retryWindow.show()
  })

  retryWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    retryWindow.loadFile(join('index.html'))
  } else {
    retryWindow.loadFile(join(__dirname, '../renderer/retry.html'))
  }
}


function checkConnection(callback) {
  const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'localcivilregistry'
  });

  connection.connect((err) => {
    if (err) {
      console.log('Error connecting to database:');
      callback(false);
    } else {
      console.log('Connected to MySQL database!');
      callback(true);
    }
  });
}


app.whenReady().then(() => {
  electronApp.setAppUserModelId('com.localcivilregistry.office');
  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window);
  });

  checkConnection((isConnected) => {
    if (isConnected) {
      createWindow();
      console.log('This is the main window');
    } else {
      retryConnection();
      console.log('This is not the main window');
    }
  });




  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})













app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})


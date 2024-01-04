import { app, shell, BrowserWindow } from 'electron'
import { join } from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import icon from '../../resources/icon.png?asset'


const { spawn } = require('child_process');
const flaskProcess = spawn('python', [join(__dirname, '../../resources/script/main.py')]);

flaskProcess.stdout.on('data', (data) => {
  console.log(`stdout: ${data}`);
});

flaskProcess.stderr.on('data', (data) => {
  console.error(`stderr: ${data}`);
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


  const { net } = require('electron')
  const request = net.request('http://127.0.0.1:5000')
  request.on('response', (response) => {
    console.log(`STATUS: ${response.statusCode}`)
    console.log(`HEADERS: ${JSON.stringify(response.headers)}`)
    response.on('data', (chunk) => {
      console.log(`BODY: ${chunk}`)
    })
    response.on('end', () => {
      console.log('No more data in response.')
    })
  })
  request.end()





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
    flaskProcess.kill();
    app.quit()

  }
})


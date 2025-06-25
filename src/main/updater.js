// main/updater.js
import { dialog, app } from 'electron'
import { autoUpdater } from 'electron-updater'


const Store = require('electron-store');
const store = new Store()

export function handleUpdates(mainWindow) {
    const isUpdating = store.get('updating', false)

    if (isUpdating) {
        mainWindow.webContents.once('did-finish-load', () => {
            mainWindow.webContents.send('update-status', 'installing')
        })
        return // Skip checking for updates if already installing
    }

    autoUpdater.autoDownload = true
    autoUpdater.autoInstallOnAppQuit = false

    autoUpdater.on('checking-for-update', () => {
        mainWindow.webContents.send('update-status', 'Checking for updates...')
    })

    autoUpdater.on('update-available', (info) => {
        mainWindow.webContents.send(
            'update-status',
            'Update available! Downloading...'
        )
    })

    autoUpdater.on('update-not-available', () => {
        mainWindow.webContents.send('update-status', 'App is up to date.')
    })

    autoUpdater.on('download-progress', (progress) => {
        mainWindow.webContents.send('update-progress', progress)
    })

    autoUpdater.on('update-downloaded', async (info) => {
        store.set('updateReady', true)

        mainWindow.webContents.send(
            'update-status',
            'Update downloaded. Prompting user...'
        )
        const { response } = await dialog.showMessageBox(mainWindow, {
            type: 'info',
            buttons: ['Restart Now', 'Later'],
            defaultId: 0,
            cancelId: 1,
            title: 'Update Ready',
            message: 'An update has been downloaded. Restart now to install it?'
        })

        if (response === 0) {
            store.set('updating', true) // Mark as updating
            autoUpdater.quitAndInstall(false, true)
        }
    })

    autoUpdater.on('error', (err) => {
        mainWindow.webContents.send(
            'update-status',
            `Update error: ${err.message}`
        )
    })

    autoUpdater.checkForUpdatesAndNotify()
}

export function clearUpdateFlags() {
    const currentVersion = app.getVersion()
    const lastVersion = store.get('lastVersion')

    if (currentVersion !== lastVersion) {
        store.set('updating', false)
        store.set('updateReady', false)
        store.set('lastVersion', currentVersion)
    }
}



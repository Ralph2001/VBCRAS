import {
    app,
    shell,
    BrowserWindow,
    ipcMain,
    globalShortcut,
    Notification
} from 'electron'
import { join } from 'path'

import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import icon from '../../resources/icon.png'

import { generate } from '../documents/clerical/clerical_error'
import { finality } from '../documents/clerical/finality'
import { generate_form } from '../documents/forms/createForm'
import { CreateAnnotated } from '../documents/clerical/annotation'
import { generate_ausf } from '../documents/ausf/create_ausf'
import { generate_by_month_year } from '../documents/clerical/generate_report'

import { autoUpdater } from 'electron-updater'
import { certificate_filing } from '../documents/clerical/certificate_filing'
import {
    generate_marriage_notice,
    generate_marriage_license,
    print_decided_license,
    save_marriage_license_and_notice
} from '../documents/marriage'
import { generateFormPDF } from '../documents/forms/GenerateDocument'
import { create_publication_letter } from '../documents/clerical/create_publication'
import { generate_legitimation } from '../documents/legitimation/generatelegma'

const log = require('electron-log')
const path = require('path')

autoUpdater.logger = log
autoUpdater.logger.transports.file.level = 'info' // Set log level

let flaskServerProcess = null
let flaskPID = null

const { execFile, exec } = require('child_process')
const { spawn } = require('child_process')
const { dialog } = require('electron')

const os = require('os')

const userBasePath = os.homedir()
const username = os.userInfo().username
const fse = require('fs-extra')
const fs = require('fs')

/**
 * Helper Functions
 */

ipcMain.handle('validate-path', async (_, filePath) => {
    try {
        if (!filePath || typeof filePath !== 'string') {
            return { status: false, error: 'Invalid path type.' }
        }

        // --- Path Resolution Improvement ---
        let resolvedPath

        // Check if the path is absolute
        if (path.isAbsolute(filePath)) {
            // If it's an absolute path (e.g., C:\, /home/user, D://)
            // We can directly resolve it.
            // Using path.normalize to clean up slashes (e.g., D:// becomes D:\)
            resolvedPath = path.normalize(filePath)
        } else {
            // If it's a relative path, join it with the user's home directory
            // This is useful if you expect relative paths to be based on homedir
            resolvedPath = path.join(os.homedir(), filePath)

            // You might want to consider if you want to restrict relative paths
            // to *only* be within homedir, or if they should be relative to
            // the application's executable directory. For security,
            // homedir is generally safer if you don't control the input fully.
            // If the frontend is using a file dialog, it will likely provide absolute paths.
        }

        // --- Security Check (Careful with '..' for absolute paths) ---
        // For absolute paths, '..' usually means navigating parent directories.
        // If you are accepting *any* absolute path, this check becomes less
        // about "traversal" and more about preventing paths that might try
        // to trick your system with invalid sequences.
        // A simple path.resolve() will handle most '..' properly, but a
        // strong check could be useful if you're paranoid about malformed paths.
        // For now, let's keep it if you want to forbid `..` even in absolute paths
        // which might indicate a weirdly constructed path.
        if (resolvedPath.includes('..') || resolvedPath.includes('~')) {
            return { status: false, error: 'Path contains invalid characters.' }
        }

        // Using path.resolve for further normalization and resolving symbolic links if they exist
        // This is good practice to get the canonical path.
        resolvedPath = path.resolve(resolvedPath)

        // Check if path exists
        if (!fs.existsSync(resolvedPath)) {
            return {
                status: false,
                error: `Path does not exist: ${resolvedPath}`
            }
        }

        // Check if path is a directory and not a file
        const stat = fs.statSync(resolvedPath)
        if (!stat.isDirectory()) {
            return { status: false, error: 'Path is not a directory.' }
        }

        // Check read access
        try {
            fs.accessSync(resolvedPath, fs.constants.R_OK)
        } catch (err) {
            return { status: false, error: 'No read access to directory.' }
        }

        return { status: true, error: null }
    } catch (error) {
        // Log the actual error for debugging
        console.error('Error validating path:', error)
        return {
            status: false,
            error: error.message || 'An unknown error occurred.'
        }
    }
})

ipcMain.handle('read-pdf-file', async (_, filePath) => {
    try {
        if (!filePath || typeof filePath !== 'string') {
            return { status: false, error: 'Invalid path type.' }
        }
        // const resolvePath = path.resolve(filePath)
        const data = fs.readFileSync(filePath)
        if (data) {
            return { status: true, fileUrl: data.toString('base64') }
        }
        return { status: false, fileUrl: null }
    } catch (error) {
        console.log(error)
        return { status: false, fileUrl: null }
    }
})

/**
 * Main Printer Opener
 */
const sumatraPath = join(
    __dirname,
    '../../resources/tools/printer/SumatraPDF.exe'
).replace('app.asar', 'app.asar.unpacked')

// Updater Flags

// autoUpdater.autoDownload = false
autoUpdater.autoInstallOnAppQuit = true

let interfaces = os.networkInterfaces()
let addresses = []
for (let k in interfaces) {
    for (let k2 in interfaces[k]) {
        let address = interfaces[k][k2]
        if (address.family === 'IPv4' && !address.internal) {
            addresses.push(address.address)
        }
    }
}

function generateRandomString(length) {
    const characters =
        'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
    let result = ''
    const charactersLength = characters.length
    for (let i = 0; i < length; i++) {
        result += characters.charAt(
            Math.floor(Math.random() * charactersLength)
        )
    }
    return result
}

/**
 * Function to print a document using SumatraPDF.
 * @param {string} base64Data - PDF document Data
 * @param {string} sumatraPath - Path to the SumatraPDF executable
 */
async function printPDF(base64Data, sumatraPath, paperSize = 'none') {
    let pdfPath // Declare here for cleanup later
    try {
        const randomFileName = `temp_${generateRandomString(20)}.pdf`
        pdfPath = join(
            __dirname,
            '../../resources/temp/',
            randomFileName
        ).replace('app.asar', 'app.asar.unpacked')

        // Write the PDF file
        await fs.promises.writeFile(pdfPath, Buffer.from(base64Data, 'base64'))

        // Add explicit page range handling
        const args = [
            '-print-dialog',
            '-exit-when-done',
            pdfPath // Explicitly specify the file to print
        ]

        const printProcess = spawn(sumatraPath, args)

        // Delay cleanup until printing completes
        printProcess.on('exit', async (code) => {
            await new Promise((resolve) => setTimeout(resolve, 5000)) // Wait 5 seconds
            try {
                await fs.promises.unlink(pdfPath)
                console.log('Temp PDF deleted successfully')
            } catch (err) {
                console.error('Error deleting temp file:', err)
            }
        })
    } catch (error) {
        // Cleanup if error occurs
        if (pdfPath) {
            await fs.promises.unlink(pdfPath).catch(console.error)
        }
        console.error('Error printing PDF:', error)
    }
}

ipcMain.handle('PrintThisPDF', async (event, base64Data) => {
    await printPDF(base64Data, sumatraPath)
})

/**
 * Form IPC
 * @FORM
 * Document
 */

ipcMain.handle('previewFormPDF', async (event, formData) => {
    try {
        const generate_form = await generateFormPDF(formData)
        return generate_form
    } catch (error) {
        console.log(error)
    }
})

// ipcMain.handle('createPdfForm', async (event, formData) => {
//     try {
//         const generate_record = await generate_form(formData)
//         if ((generate_record.success = true)) {
//             return {
//                 status: generate_record.status,
//                 filepath: true,
//                 dataurl: generate_record.pdfbase64
//             }
//         }
//     } catch (error) {
//         console.log(error)
//     }
// })

// ipcMain.handle('open-form', async (event, source) => {
//     try {
//         win = new BrowserWindow({
//             webPreferences: {
//                 plugins: true,
//                 devTools: true
//             },

//             autoHideMenuBar: true,
//             show: true
//         })

//         const load = await win.loadURL(source)
//         return true
//     } catch (error) {
//         win.close()
//         return false
//     }
// })
/////////////
/////////////
// AUSF
/////////////
/////////////

ipcMain.handle('createLegitimation', async (event, formData) => {
    try {
        const Legitimation = generate_legitimation(formData)
    } catch (error) {
        console.log(error)
    }
})

/////////////
/////////////
// AUSF
/////////////
/////////////

ipcMain.handle('createAUSF', async (event, formData) => {
    try {
        const createAUSF = await generate_ausf(formData)
        if ((createAUSF.success = true)) {
            return {
                status: createAUSF.status,
                filepath: true,
                dataurl: createAUSF.pdfbase64
            }
        }
    } catch (error) {
        console.log(error)
    }
})

/////////////
/////////////
// Clerical
/////////////
/////////////

function saveBase64AsPDF(base64Data, path, fileName) {
    // Remove the prefix if it exists (data:application/pdf;base64,)
    const base64 = base64Data.replace(/^data:application\/pdf;base64,/, '')

    // Convert base64 to a buffer
    const buffer = Buffer.from(base64, 'base64')

    // Define the path where the PDF will be saved
    const filePath = join(path, fileName)

    // Write the buffer to a file
    fs.writeFile(filePath, buffer, (err) => {
        if (err) {
            console.error('Error saving PDF:', err)
        } else {
            console.log('PDF saved successfully:', filePath)
        }
    })
}

ipcMain.handle('CreateAnnotated', async (event, formData) => {
    try {
        const user = os.homedir()
        const generate_document = await CreateAnnotated(user, formData)
        return {
            status: generate_document.status,
            pdfbase64: generate_document.pdfbase64
        }
    } catch (error) {
        console.log(error)
    }
})

ipcMain.handle('saveAnnotated', async (event, fileUri) => {
    try {
        const data = JSON.parse(fileUri)
        saveBase64AsPDF(data.file, data.path, 'Annotation.pdf')
    } catch (error) {
        console.log(error)
    }
})

ipcMain.handle('createPetitionDocument', async (event, formData) => {
    try {
        const data = JSON.parse(formData)
        const generate_document = await generate(formData)

        if (generate_document.status) {
            if (data.is_to_validate) {
                const filePath = join(
                    generate_document.filepath,
                    'petition.docx'
                )

                try {
                    const open_file = await shell.openExternal(filePath)
                    if (!open_file) {
                        await shell.openPath(filePath)
                    }
                } catch (openError) {
                    console.error('Error opening file:', openError)
                }
            }
            return {
                status: generate_document.status,
                filepath: generate_document.filepath
            }
        }
        return {
            status: generate_document.status,
            filepath: generate_document.filepath
        }
    } catch (error) {
        console.log(error)
        return { status: false, filepath: null }
    }
    // Not Needed
})

function executeCommand(executable, originalDirectory, outputDirectory, args) {
    return new Promise((resolve, reject) => {
        const convertProcess = spawn(executable, [
            originalDirectory,
            outputDirectory,
            args
        ])
        let output = ''
        let error = ''

        convertProcess.stdout.on('data', (data) => {
            output += data.toString()
        })

        convertProcess.stderr.on('data', (data) => {
            error += data.toString()
        })

        convertProcess.on('close', (code) => {
            if (code === 0) {
                resolve(output) // Conversion succeeded
            } else {
                reject(new Error(`Process failed with code ${code}: ${error}`)) // Capture non-zero exit codes
            }
        })

        convertProcess.on('error', (err) => {
            reject(new Error(`Failed to start process: ${err.message}`)) // Capture spawn errors
        })
    })
}

/**
 *  Dito pag nakapag decide kana
 *  para i convert na ito
 */

ipcMain.handle('proceedCreatePetition', async (event, formData) => {
    try {
        const data = JSON.parse(formData)

        const executable = join(
            __dirname,
            '../../resources/tools/converter/app/dist/convert.exe'
        ).replace('app.asar', 'app.asar.unpacked')

        const petition_number = data.petition_number
        const originalDirectory = data.orignal_path
        const petitionType = data.petition_type + ' ' + data.event_type
        const prepared_by = data.prepared_by
        const republicAct = data.republic_act_number
        const documentOwner =
            data.document_owner === 'N/A'
                ? data.petitioner_name
                : data.document_owner
        const date_filed = data.date_filed
        const year = new Date(date_filed).getFullYear().toString()

        const outputDirectory = join(
            data.path_where_to_save,
            'VBCRAS',
            'Corrections of Clerical Error',
            prepared_by,
            republicAct,
            petitionType,
            year,
            `${petition_number} - ${documentOwner}`
        )

        if (!fs.existsSync(outputDirectory)) {
            fs.mkdirSync(outputDirectory, { recursive: true })
        }

        const deleteOriginal = 'true'

        const conversionResult = await executeCommand(
            executable,
            originalDirectory,
            outputDirectory,
            deleteOriginal
        )

        return { status: true, filepath: outputDirectory, message: 'Success' }
    } catch (error) {
        console.error('Error during file conversion:', error)

        if (error.message.includes('Failed to start process')) {
            return {
                status: false,
                filepath: null,
                message:
                    'Failed to start the conversion process. Please check the executable and try again.'
            }
        } else if (error.message.includes('Process failed with code')) {
            return {
                status: false,
                filepath: null,
                message: 'Conversion failed. You can retry the conversion.'
            }
        } else {
            return {
                status: false,
                filepath: null,
                message:
                    'An unexpected error occurred during the conversion process. Please try again later.'
            }
        }
    }
})

ipcMain.handle('createFinality', async (event, formData) => {
    try {
        const data = JSON.parse(formData)
        const generate_document = await finality(data)

        if (generate_document.success) {
            const deleteOriginal = 'true'

            const excutable = join(
                __dirname,
                '../../resources/tools/converter/app/dist/convert.exe'
            ).replace('app.asar', 'app.asar.unpacked')
            const outputDirectory = data.file_path

            const conversionResult = await executeCommand(
                excutable,
                generate_document.filepath,
                outputDirectory,
                deleteOriginal
            )

            if (conversionResult) {
                return { status: true, filepath: outputDirectory }
            } else {
                return { status: false, filepath: null }
            }
        }

        return { status: false, filepath: null }
    } catch (error) {
        console.log(error)
        return { status: false, filepath: null }
    }
})

ipcMain.handle('create_certificate_filing', async (event, data) => {
    try {
        const create_certificate_filing = await certificate_filing(data)
        const filefolder = await shell.openExternal(
            create_certificate_filing.filepath
        )

        if (!filefolder) {
            await shell.openPath(create_certificate_filing.filepath)
            return true
        }

        return true
    } catch (error) {
        return false
    }
})
ipcMain.handle('create_publication_letter', async (event, data) => {
    try {
        const publication_letter = await create_publication_letter(data)
        const filefolder = await shell.openExternal(publication_letter.filepath)

        if (!filefolder) {
            await shell.openPath(publication_letter.filepath)
            return true
        }

        return true
    } catch (error) {
        return false
    }
})

ipcMain.handle('open-clerical', async (event, source) => {
    try {
        console.log('This is Source' + source)
        const filefolder = await shell.openExternal(source)
        return true
    } catch (error) {
        console.log(error)
        return false
    }
})

ipcMain.handle('open-clerical-folder', async (event, source) => {
    try {
        console.log('This is Source ' + source)
        const filefolder = await shell.openPath(source)
        return true
    } catch (error) {
        console.log(error)
        return false
    }
})

ipcMain.handle('remove-item', async (event, path) => {
    try {
        fs.rm(path, { recursive: true, force: true }, (err) => {
            if (err) {
                console.error(`Error removing directory: ${err.message}`)
                return
            }
            console.log(`Directory ${path} removed successfully.`)
        })
        return
    } catch (error) {
        console.log(error)
        return false
    }
})

ipcMain.handle('open-clerical-files', (event, mainDirectory) => {
    try {
        // Define the required and optional files
        const requiredFiles = [
            'Petition.pdf',
            'Posting.pdf',
            'Endorsement Letter.pdf',
            'Record Sheet.pdf'
        ]
        const optionalFiles = [
            'Annotation.pdf',
            'Certificate of Finality.pdf',
            'Finality Endorsement Letter.pdf'
        ]

        const data = []

        // Check for required files
        for (const requiredFile of requiredFiles) {
            const filePath = join(mainDirectory, requiredFile)

            // Check if the required file exists before reading
            if (fs.existsSync(filePath)) {
                const fileData = fs.readFileSync(filePath, 'base64')
                const name = requiredFile.substring(
                    0,
                    requiredFile.lastIndexOf('.')
                )
                data.push({ name, link: fileData })
            }
        }

        // Check for optional files
        const optionalData = [] // Use a new array for optional files
        for (const optionalFile of optionalFiles) {
            const filePath = join(mainDirectory, optionalFile)

            // Check if the optional file exists before reading
            if (fs.existsSync(filePath)) {
                const fileData = fs.readFileSync(filePath, 'base64')
                const name = optionalFile.substring(
                    0,
                    optionalFile.lastIndexOf('.')
                )
                optionalData.push({ name, link: fileData }) // Push to optionalData
            }
        }

        // Combine required and optional data
        return [...data, ...optionalData]
    } catch (error) {
        return { error: 'Failed to open clerical files' }
    }
})
ipcMain.handle('generateReportByMonthYear', async (event, formData) => {
    try {
        const generate = await generate_by_month_year(formData)
        shell.showItemInFolder(
            generate.dir.replace('app.asar', 'app.asar.unpacked')
        )
    } catch (error) {
        console.log(error)
    }
})

function showNotification(NOTIFICATION_TITLE, NOTIFICATION_BODY) {
    new Notification({
        title: NOTIFICATION_TITLE,
        body: NOTIFICATION_BODY
    }).show()
}

/**
 * Main Window
 *
 */

// Function to handle updates
function handleUpdates(mainWindow) {
    autoUpdater.checkForUpdatesAndNotify()

    autoUpdater.on('checking-for-update', (info) => {
        mainWindow.webContents.send('checking-for-update', info)
    })

    autoUpdater.on('update-available', (info) => {
        showNotification(
            'Update Available',
            'A new update is ready for download. The process will begin shortly to ensure you have the latest features and improvements. Thank you for keeping your application up-to-date.'
        )
        mainWindow.webContents.send('update-available', info)
    })
    autoUpdater.on('update-not-available', (info) => {
        mainWindow.webContents.send('update-not-available', info)
    })

    autoUpdater.on('update-downloaded', (info) => {
        showNotification(
            'Update Downloaded',
            'The update has been downloaded. Please restart the app to apply the update.'
        )
        mainWindow.webContents.send('update-downloaded', info)
        // Do Not Quit
        // autoUpdater.quitAndInstall();
    })

    autoUpdater.on('error', (err) => {
        log.error('Error while checking for updates:', err)
        mainWindow.webContents.send('update-error', err.message)
    })
}
// // Function to check if the executable is already whitelisted
// function isWhitelisted() {
//     const whitelistFilePath = join(__dirname, '../../resources/app/whitelist.txt').replace('app.asar', 'app.asar.unpacked');
//     // Check if the file exists and contains a success marker
//     return fs.existsSync(whitelistFilePath);
// }

// function markAsWhitelisted() {
//     const whitelistFilePath = join(__dirname, '../../resources/app/whitelist.txt').replace('app.asar', 'app.asar.unpacked');
//     // Create a file to mark the executable as whitelisted
//     fs.writeFileSync(whitelistFilePath, 'whitelisted', 'utf8');
// }

// function runPermissionController() {
//     try {
//         if (isWhitelisted()) {
//             return true
//         }
//         const batFilePath = join(__dirname, '../../resources/app/permission.bat').replace('app.asar', 'app.asar.unpacked');
//         execFile(batFilePath, (error, stdout, stderr) => {
//             if (error) {
//                 console.error(`Error executing batch file: ${error.message}`);
//                 return false
//             }
//             if (stderr) {
//                 console.error(`stderr: ${stderr}`);
//                 return false
//             }

//         });
//         markAsWhitelisted();
//         return true
//     } catch (error) {
//         console.log(error)
//         return false
//     }
// }

function mainWindow() {
    const mainWindow = new BrowserWindow({
        width: 1060,
        height: 670,
        show: false,
        frame: true,

        autoHideMenuBar: true,
        ...(process.platform === 'linux' ? { icon } : {}),
        webPreferences: {
            preload: join(__dirname, '../preload/index.js'),
            sandbox: false
        }
    })

    // mainWindow.setMinimumSize(1050, 500)

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
        mainWindow.loadFile(join(__dirname, '../renderer/index.html'), {
            hash: 'home'
        })
    }

    ipcMain.handle('app-version', () => app.getVersion())
    handleUpdates(mainWindow)

    // Listen for the close event on the window
    mainWindow.on('close', (e) => {
        // Display a modal confirmation dialog
        const choice = dialog.showMessageBoxSync(mainWindow, {
            type: 'question',
            buttons: ['Exit', 'Cancel'],
            title: 'Confirm Exit',
            message: 'Are you sure you want to exit?',
            defaultId: 0,
            cancelId: 1,
            noLink: true
        })

        if (choice === 1) {
            e.preventDefault()
        }
    })
}

app.whenReady().then(() => {
    electronApp.setAppUserModelId('com.localcivilregistry.office')
    app.on('browser-window-created', (_, window) => {
        optimizer.watchWindowShortcuts(window)
    })

    // runPermissionController()
    mainWindow()

    // Registert Shortcut that can affect Suste,
    // globalShortcut.register('CommandOrControl+R', () => { });
    // globalShortcut.register('F5', () => { });
    // globalShortcut.register('F12', () => { });
    // globalShortcut.register('CommandOrControl+Shift+I', () => { });
    // globalShortcut.register('CommandOrControl+Shift+R', () => { });

    app.on('activate', function () {
        if (BrowserWindow.getAllWindows().length === 0) mainWindow()
    })
})

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        // Unregister all global shortcuts
        globalShortcut.unregisterAll()

        // Kill the Flask server if it's running
        if (flaskPID) {
            console.log(`Killing Flask server process with PID: ${flaskPID}`)
            killProcessTree(flaskPID)
        } else {
            console.log('No Flask server process to kill.')
        }

        // Quit the app
        app.quit()
    }
})

app.on('before-quit', () => {
    // Optional: Cleanup any resources before quitting
    if (flaskPID) {
        console.log(`Cleaning up Flask server process with PID: ${flaskPID}`)
        killProcessTree(flaskPID)
    }
})

/**
 * List of IPC
 **/

/**
 * Scanned Document IPC's
 */

ipcMain.handle('open-scanned-sidebar', async (event, source) => {
    /**
     *  Open Scanned Documents in Side Bar
     *  Get Relative Path, Add the destop name
     *  Convert to base64
     */
    try {
        // const fiepath = 'C:\\Users\\' + username + '\\' + source
        const filepath = path.join(userBasePath, source)
        const data = fs.readFileSync(filepath)
        if (data) {
            return { status: true, fileUrl: data.toString('base64') }
        }
        return { status: false, fileUrl: null }
    } catch (error) {
        return { status: false, fileUrl: null }
    }
})

/**
 * LocalCivil IPC
 */

let dialogOpen = false

async function startServer() {
    try {
        const executable = join(
            __dirname,
            '../../resources/server/dist/main.exe'
        ).replace('app.asar', 'app.asar.unpacked')

        // Start the Flask process
        flaskServerProcess = execFile(executable)

        flaskServerProcess.stdout.on('data', (data) => {
            console.log(`Flask stdout: ${data}`)
        })

        flaskServerProcess.stderr.on('data', (data) => {
            console.error(`Flask stderr: ${data}`)
        })

        flaskServerProcess.on('error', (error) => {
            console.error('Error starting Flask process:', error)
        })

        flaskServerProcess.on('close', (code) => {
            console.log(`Flask process exited with code ${code}`)
            flaskServerProcess = null // Reset the process variable after it exits
        })

        flaskPID = flaskServerProcess.pid

        return true
    } catch (error) {
        console.error('Error starting server:', error)
        return false
    }
}

function killProcessTree(pid) {
    exec(`taskkill /F /PID ${pid} /T`, (error) => {
        if (error) {
            console.error(`Error killing process tree: ${error}`)
        } else {
            console.log(`Process tree for PID ${pid} killed successfully.`)
        }
    })
}

// Check if server is running
ipcMain.handle('is-server-running', async (event) => {
    try {
        if (flaskServerProcess) {
            return true
        }
        return false
    } catch (error) {
        console.error('Error checking server status:', error)
        return false
    }
})

// Start the server
ipcMain.handle('start-server', async (event) => {
    try {
        console.log(flaskServerProcess)
        if (flaskServerProcess) {
            console.warn('Server is already running, cannot start again.')
            return false
        }
        const success = await startServer()
        return { success } // Removed 'addresses' as it's undefined
    } catch (error) {
        console.error('Error handling start-server request:', error)
        return false
    }
})

// Stop the server
ipcMain.handle('stop-server', async (event) => {
    if (flaskServerProcess) {
        try {
            killProcessTree(flaskPID)
            return true
        } catch (error) {
            console.error('Error stopping server:', error)
            return false
        }
    } else {
        console.warn('Server is not running, cannot stop.')
        return false
    }
})

ipcMain.handle('select-folder', async (event) => {
    if (dialogOpen) return
    try {
        dialogOpen = true
        const { canceled, filePaths } = await dialog.showOpenDialog({
            properties: ['openDirectory']
        })
        const file_path = filePaths[0].replace(
            'C:\\Users\\' + username + '\\',
            ''
        )
        return file_path
    } catch (err) {
        console.error('There was an error', err)
    } finally {
        dialogOpen = false
    }
})

ipcMain.handle('select-file', async (event) => {
    if (dialogOpen) return { canceled: true, filePaths: [] } // Always return an object
    try {
        dialogOpen = true
        const { canceled, filePaths } = await dialog.showOpenDialog({
            properties: ['openFile'],
            filters: [{ name: 'PDF Files', extensions: ['pdf'] }]
        })
        return { canceled, filePaths }
    } finally {
        dialogOpen = false
    }
})

ipcMain.handle('is_file_busy', async (event, path) => {
    try {
        console.log(path)
        // Check if the file exists
        if (!fs.existsSync(path)) {
            return false // File does not exist
        }

        // Try to open the file in read-write mode.

        const fileDescriptor = fs.openSync(path, 'r+')
        fs.closeSync(fileDescriptor)
        return false // File is not locked
    } catch (error) {
        if (
            error.code === 'EBUSY' ||
            error.code === 'EACCES' ||
            error.code === 'EPERM'
        ) {
            return true // File is locked, likely open in another program
        }
        throw error // Some other error occurred
    }
})

ipcMain.handle('open-file', async (event, source) => {
    let win
    try {
        win = new BrowserWindow({
            webPreferences: {
                plugins: true,
                devTools: true
                // preload: join(__dirname, 'custom.css'),
            },

            autoHideMenuBar: true,
            show: true
        })

        const load = await win.loadURL('C:\\Users\\' + username + '\\' + source)
        return true
    } catch (error) {
        win.close()
        return false
    }
})

ipcMain.handle('open-file-folder', async (event, path) => {
    try {
        const filefolder = shell.showItemInFolder(
            'C:\\Users\\' + username + '\\' + path
        )
        return true
    } catch (err) {
        return false
    }
})

ipcMain.handle('openSpecifiedFolder', async (event, path) => {
    try {
        const folderpath = shell.openPath(path)
    } catch (error) {
        return false
    }
})

ipcMain.handle('get-user', async (event) => {
    /**
     *  Return user name directory
     */
    return username
})

/**
 *  Marriage
 *  @MARRIAGE_LICENSE
 *  @MARRIAGE_NOTICE
 */

ipcMain.handle('saveApplicationMarriage', async (event, formData, image) => {
    try {
        const save = await save_marriage_license_and_notice(formData, image)
        return save
    } catch (error) {
        console.log(error)
    }
})

ipcMain.handle('previewMarriage', async (event, formData) => {
    try {
        const generate_application_for_marriage_license =
            await generate_marriage_license(formData)
        return generate_application_for_marriage_license
    } catch (error) {
        console.log(error)
    }
})
ipcMain.handle('printMarriage', async (event, formData, params) => {
    try {
        const print_application_for_marriage_license =
            await print_decided_license(formData, params)
        if (
            print_application_for_marriage_license &&
            print_application_for_marriage_license.pdfbase64
        ) {
            // await printPDF(
            //     print_application_for_marriage_license.pdfbase64,
            //     sumatraPath
            // )

            await printPDF(
                print_application_for_marriage_license.pdfbase64,
                sumatraPath,
                'Legal'
            )

            return { status: true }
        } else {
            console.error('Failed to generate valid PDF base64 data.')
        }
    } catch (error) {
        console.error('Error in printing marriage application:', error)
    }
})

ipcMain.handle('previewNotice', async (event, formData, image) => {
    try {
        const generate_application_notice = await generate_marriage_notice(
            formData,
            image
        )
        return generate_application_notice
    } catch (error) {
        console.log(error)
    }
})

ipcMain.handle('printNotice', async (event, dataUri) => {
    try {
        const print_notice = await printPDF(dataUri, sumatraPath)

        console.log(print_notice)
    } catch (error) {
        console.error('Error in printing marriage notice:', error)
    }
})

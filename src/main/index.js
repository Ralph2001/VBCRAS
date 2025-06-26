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
// import { extractPageRange } from '../documents/extract'
import { printPdfMethod1, printPdfMethod2, printPdfMethod3 } from './printer'
import { clearUpdateFlags, handleUpdates } from './updater'

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
const fsp = require('fs').promises

/**
 * Helper Functions
 */

/**
 * Validates whether the given file path is a readable directory.
 * @param {string} filePath - The path to validate.
 * @returns {{status: boolean, error: string|null, resolvedPath?: string}}
 */
async function validateDirectoryPath(filePath) {
    try {
        if (!filePath || typeof filePath !== 'string') {
            return { status: false, error: 'Invalid path type.' }
        }

        let resolvedPath

        // Normalize and resolve the path
        if (path.isAbsolute(filePath)) {
            resolvedPath = path.normalize(filePath)
        } else {
            resolvedPath = path.join(os.homedir(), filePath)
        }

        if (resolvedPath.includes('..') || resolvedPath.includes('~')) {
            return { status: false, error: 'Path contains invalid characters.' }
        }

        resolvedPath = path.resolve(resolvedPath)

        if (!fs.existsSync(resolvedPath)) {
            return {
                status: false,
                error: `Path does not exist: ${resolvedPath}`
            }
        }

        const stat = fs.statSync(resolvedPath)
        if (!stat.isDirectory()) {
            return { status: false, error: 'Path is not a directory.' }
        }

        fs.accessSync(resolvedPath, fs.constants.R_OK)

        return { status: true, error: null, resolvedPath }
    } catch (error) {
        console.error('Error validating path:', error)
        return {
            status: false,
            error: error.message || 'An unknown error occurred.'
        }
    }
}

function validateAndSanitizeWhitespace(input, options = {}) {
    const { requireNonEmpty = false, sanitizeForFilename = false } = options

    if (typeof input !== 'string') {
        throw new TypeError('Input must be a string')
    }

    // Trim and normalize whitespace
    let sanitized = input.trim().replace(/\s+/g, ' ')

    if (sanitizeForFilename) {
        // Allow letters, numbers, spaces, dashes, underscores
        // Remove forbidden Windows characters and also remove trailing hyphen
        sanitized = sanitized
            .replace(/[\\/:*?"<>|.]/g, '') // Remove invalid Windows characters
            .replace(/-+$/, '') // Remove trailing hyphen(s)
    }

    if (requireNonEmpty && sanitized.length === 0) {
        return {
            valid: false,
            sanitized: ''
        }
    }

    return sanitized
}

async function cleanupTempFolder() {
    try {
        const tempDir = join(__dirname, '../../resources/temp/').replace(
            'app.asar',
            'app.asar.unpacked'
        )
        console.log('[DEBUG] Temp Path:', tempDir)

        // Skip if directory does not exist
        try {
            await fsp.access(tempDir, fs.constants.R_OK | fs.constants.W_OK)
        } catch {
            console.log('[Cleanup] Temp directory not found. Skipping cleanup.')
            return
        }

        const items = await fsp.readdir(tempDir)
        for (const item of items) {
            const itemPath = path.join(tempDir, item)
            const stat = await fsp.stat(itemPath)

            if (stat.isDirectory()) {
                await fsp.rm(itemPath, { recursive: true, force: true })
                console.log(`[Cleanup] Deleted folder: ${item}`)
            } else {
                await fsp.unlink(itemPath)
                console.log(`[Cleanup] Deleted file: ${item}`)
            }
        }
    } catch (error) {
        console.error('[Cleanup] Error cleaning temp folder:', error.message)
    }
}


ipcMain.handle('validate-path', async (_, filePath) => {
    return await validateDirectoryPath(filePath)
})
ipcMain.handle('read-pdf-file', async (_, filePath) => {
    try {
        if (!filePath || typeof filePath !== 'string') {
            return { status: false, error: 'Invalid path type.' }
        }

        const resolvedPath = path.isAbsolute(filePath)
            ? filePath
            : path.join(os.homedir(), filePath);

        const data = fs.readFileSync(resolvedPath);
        if (data) {
            return { status: true, fileUrl: data.toString('base64') };
        }

        return { status: false, fileUrl: null };
    } catch (error) {
        console.log(error);
        return { status: false, fileUrl: null };
    }
});
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

ipcMain.handle('get-printers', async (event) => {
    // This needs to be called after the app is ready and a browser window is created,
    // as it relies on Chromium's printer capabilities.
    const webContents = BrowserWindow.getAllWindows()[0]?.webContents // Get the webContents of an existing window
    if (webContents) {
        return webContents.getPrintersAsync()
    }
    return [] // Return an empty array if no webContents found
})

// In main process IPC handler
ipcMain.handle(
    'print-pdf-electron-custom-size',
    async (_, base64, printerName, optionsJson) => {
        try {
            return await printPdfElectronCustomSize(
                base64,
                printerName,
                optionsJson
            )
        } catch (error) {
            // Catch any unexpected rejections from the function
            console.error(
                '[IPC Main Handle] Uncaught error from printPdfElectronCustomSize:',
                error
            )
            return {
                status: false,
                message:
                    error.message ||
                    'An unhandled error occurred during printing.'
            }
        }
    }
)

ipcMain.handle('PrintThisPDF', async (event, base64Data) => {
    await printPDF(base64Data, sumatraPath)
})

ipcMain.handle(
    'print-pdf',
    async (_, base64Data, printerName, optionsJson, method, range) => {
        if (
            !base64Data ||
            typeof base64Data !== 'string' ||
            base64Data.trim() === ''
        ) {
            return {
                status: false,
                message: 'Invalid or no PDF data provided.'
            }
        }

        const selected_method =
            method && ['method1', 'method2', 'method3'].includes(method)
                ? method
                : 'method2'

        let result
        try {
            if (selected_method === 'method1') {
                result = await printPdfMethod1(base64Data)
            } else if (selected_method === 'method2') {
                // Method 2 only needs base64Data
                console.log(
                    '[DEBUG] Using Method 2 for printing with range:',
                    range
                )
                result = await printPdfMethod2(base64Data, range)
            } else if (selected_method === 'method3') {
                // Method 3 needs base64, printerName, and optionsJson
                result = await printPdfMethod3(
                    base64Data,
                    printerName,
                    optionsJson
                )
            } else {
                // Fallback in case selected_method somehow ends up as an unhandled value
                result = {
                    status: false,
                    message: 'Unknown printing method selected.'
                }
            }
        } catch (error) {
            // Catch any unexpected errors that might escape the print functions
            console.error(
                `[IPC Main] Unhandled error during print for method ${selected_method}:`,
                error
            )
            result = {
                status: false,
                message: `An unexpected error occurred: ${error.message || 'Unknown error'}`
            }
        }

        return result // Always return the consistent { status, message } object
    }
)

// ==============================
// Form Section
// ==============================

ipcMain.handle('previewFormPDF', async (event, formData) => {
    try {
        const generate_form = await generateFormPDF(formData)
        return generate_form
    } catch (error) {
        console.log(error)
    }
})

ipcMain.handle(
    'saveFormPDF',
    async (_, { data, form_type, documentOwner, basePath }) => {
        const timestamp = Date.now()
        const sanitizedFormType = validateAndSanitizeWhitespace(form_type, {
            sanitizeForFilename: true
        })
        const sanitizedOwner = validateAndSanitizeWhitespace(documentOwner, {
            sanitizeForFilename: true
        })
        const fileName = `${sanitizedOwner}_${timestamp}.pdf`

        const year = new Date().getFullYear()
        const month = new Date().toLocaleString('default', { month: 'long' })

        // Validate the basePath
        const validation = await validateDirectoryPath(basePath)

        let finalBasePath = basePath
        let usedFallback = false

        if (!validation.status) {
            // fallback to local backup path (userData or a relative path)
            finalBasePath = path.join(__dirname, 'Backups')

            usedFallback = true
        }

        const folderPath = path.join(
            finalBasePath,
            'VBCRAS',
            'FORMS',
            year.toString(),
            month,
            `Form ${sanitizedFormType}`
        )

        const fullFilePath = path.join(folderPath, fileName)

        // SynologyDrive\VBCRAS\FORMS\2025\June\Form 1A\RALPH ADVINCULA VILLANUEVA_1750384839566.pdf
        try {
            const pdfBuffer = await generateFormPDF(data, true, fullFilePath)
            console.log(pdfBuffer)
            if (pdfBuffer.status) {
                return {
                    status: true,
                    filePath: fullFilePath,
                    usedFallback,
                    message: usedFallback
                        ? 'Base path inaccessible. PDF saved to backup location.'
                        : 'PDF saved successfully.'
                }
            }
        } catch (err) {
            console.error('Failed to save PDF:', err)
            return {
                status: false,
                error: err.message || 'Unknown error occurred while saving PDF.'
            }
        }
    }
)
// ==============================
// Ausf Section
// ==============================

ipcMain.handle('createLegitimation', async (event, formData) => {
    try {
        const Legitimation = generate_legitimation(formData)
    } catch (error) {
        console.log(error)
    }
})

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

// ==============================
// Clerical Section
// ==============================

function saveBase64AsPDF(base64Data, folderPath, fileName) {
    const base64 = base64Data.replace(/^data:application\/pdf;base64,/, '')
    const buffer = Buffer.from(base64, 'base64')

    // Ensure folderPath is absolute — if not, resolve it relative to userBasePath
    const finalFolderPath = path.isAbsolute(folderPath)
        ? folderPath
        : path.join(userBasePath, folderPath)

    // Ensure folder exists
    fs.mkdirSync(finalFolderPath, { recursive: true })

    const filePath = path.join(finalFolderPath, fileName)

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

        console.log(
            '[DEBUG] Proceed Creation of Petition receiving filepath',
            data.orignal_path
        )

        const executable = join(
            __dirname,
            '../../resources/tools/converter/app/dist/convert.exe'
        ).replace('app.asar', 'app.asar.unpacked')

        const petition_number = validateAndSanitizeWhitespace(
            data.petition_number,
            { sanitizeForFilename: true }
        )
        const originalDirectory = data.orignal_path

        const petitionType = validateAndSanitizeWhitespace(
            `${data.petition_type} ${data.event_type}`,
            { sanitizeForFilename: true }
        )
        const prepared_by = validateAndSanitizeWhitespace(data.prepared_by, {
            sanitizeForFilename: true
        })
        const republicAct = validateAndSanitizeWhitespace(
            data.republic_act_number,
            { sanitizeForFilename: true }
        )
        const documentOwner =
            data.document_owner === 'N/A'
                ? validateAndSanitizeWhitespace(data.petitioner_name, {
                    sanitizeForFilename: true
                })
                : validateAndSanitizeWhitespace(data.document_owner, {
                    sanitizeForFilename: true
                })

        const date_filed = data.date_filed
        const year = new Date(date_filed).getFullYear().toString()

        // STEP 1: Validate the custom path
        let basePath = join(userBasePath, data.path_where_to_save)
        const validation = await validateDirectoryPath(basePath)

        let usedFallback = false

        if (!validation.status) {
            basePath = path.join(__dirname, 'Backups')
            usedFallback = true

            // Ensure backup path exists
            fs.mkdirSync(basePath, { recursive: true })
        }

        const outputDirectory = join(
            basePath,
            'VBCRAS',
            'Corrections of Clerical Error',
            prepared_by,
            republicAct,
            petitionType,
            year,
            `${petition_number} - ${documentOwner}`
        )

        fs.mkdirSync(outputDirectory, { recursive: true })

        const deleteOriginal = 'true'

        // STEP 3: Call external conversion tool
        const conversionResult = await executeCommand(
            executable,
            originalDirectory,
            outputDirectory,
            deleteOriginal
        )

        // Return the relative path instead of the absolute path.
        // This allows users on different machines (e.g., connected to a Synology NAS)
        // to access the file using their own base user path.
        // For example, if the file is saved on a shared Synology folder,
        // any user with access to that folder can open the file by combining their own user base path with this relative path.

        const relativeFilePath = outputDirectory.startsWith(userBasePath)
            ? path.relative(userBasePath, outputDirectory)
            : outputDirectory

        console.log(
            '[DEBUG] Proceed Creation of Petition with returning filepath',
            relativeFilePath
        )
        return {
            status: true,
            filepath: relativeFilePath,
            usedFallback,
            message: usedFallback
                ? 'Path not accessible. Saved to fallback location.'
                : 'Success'
        }
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

// Open it with userBasePath

ipcMain.handle('create_certificate_filing', async (event, data) => {
    try {
        const create_certificate_filing = await certificate_filing(data)

        const resolvedPath = path.isAbsolute(create_certificate_filing.filepath)
            ? create_certificate_filing.filepath
            : path.resolve(userBasePath, create_certificate_filing.filepath)

        const filefolder = await shell.openExternal(resolvedPath)

        if (!filefolder) {
            await shell.openPath(resolvedPath)
            return true
        }

        return true
    } catch (error) {
        return false
    }
})

// Open it with userBasePath

ipcMain.handle('create_publication_letter', async (event, data) => {
    try {
        const publication_letter = await create_publication_letter(data)
        const resolvedPath = path.isAbsolute(publication_letter.filepath)
            ? publication_letter.filepath
            : path.resolve(userBasePath, publication_letter.filepath)

        const filefolder = await shell.openExternal(resolvedPath)
        console.log(
            '[DEBUG  Publication Letter Path]',
            publication_letter.filepath
        )
        console.log('[DEBUG Opening Publication Letter Path]', resolvedPath)
        if (!filefolder) {
            await shell.openPath(resolvedPath)
            return true
        }
    } catch (error) {
        return false
    }
})

ipcMain.handle('open-clerical', async (event, source) => {
    try {
        const resolvedPath = path.isAbsolute(source)
            ? source
            : path.resolve(userBasePath, source)

        console.log(`[open-clerical] Attempting to open source: "${source}"`)
        console.log(`[open-clerical] Absolute resolved path: "${resolvedPath}"`)
        console.log(`[open-clerical] User base path: "${userBasePath}"`)

        const filefolder = await shell.openPath(resolvedPath)

        return true
    } catch (error) {
        console.error('[open-clerical] Error:', error)
        return false
    }
})

ipcMain.handle('open-clerical-folder', async (event, source) => {
    try {
        const resolvedPath = path.isAbsolute(source)
            ? source
            : path.resolve(userBasePath, source)

        console.log(`[open-folder] Attempting to open source: "${source}"`)
        console.log(`[open-folder] Absolute resolved path: "${resolvedPath}"`)
        console.log(`[open-folder] User base path: "${userBasePath}"`)

        const filefolder = await shell.openPath(resolvedPath)

        return true
    } catch (error) {
        console.error('[open-clerical-folder] Error:', error)
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
        const resolvedMainDir = path.isAbsolute(mainDirectory)
            ? mainDirectory
            : path.resolve(userBasePath, mainDirectory)

        // Define the required and optional files
        const requiredFiles = [
            'Petition.pdf',
            'Posting.pdf',
            'Endorsement Letter.pdf',
            'Record Sheet.pdf',
            'Notice.pdf'
        ]
        const optionalFiles = [
            'Annotation.pdf',
            'Certificate of Finality.pdf',
            'Finality Endorsement Letter.pdf'
        ]

        const data = []

        // Check for required files
        for (const requiredFile of requiredFiles) {
            const filePath = path.join(resolvedMainDir, requiredFile)

            if (fs.existsSync(filePath)) {
                const fileData = fs.readFileSync(filePath, 'base64')
                const name = requiredFile.replace(/\.pdf$/, '')
                data.push({ name, link: fileData })
            }
        }

        // Optional files
        const optionalData = []
        for (const optionalFile of optionalFiles) {
            const filePath = path.join(resolvedMainDir, optionalFile)

            if (fs.existsSync(filePath)) {
                const fileData = fs.readFileSync(filePath, 'base64')
                const name = optionalFile.replace(/\.pdf$/, '')
                optionalData.push({ name, link: fileData })
            }
        }

        return [...data, ...optionalData]
    } catch (error) {
        console.error('Error opening clerical files:', error)
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

let mainWindow

function createMainWindow() {
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

    if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
        mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
    } else {
        mainWindow.loadFile(join(__dirname, '../renderer/index.html'), {
            hash: 'home'
        })
    }

    mainWindow.on('ready-to-show', () => {
        mainWindow.show()
    })

    mainWindow.on('close', (e) => {
        const choice = dialog.showMessageBoxSync(mainWindow, {
            type: 'warning',
            buttons: ['Cancel', 'Exit'],
            defaultId: 1,
            cancelId: 0,
            title: 'Confirm Exit',
            message: 'Are you sure you want to exit?',
            detail: 'Any unsaved changes will be lost. Make sure to save your data before closing the application.'
        });

        if (choice === 0) {
            e.preventDefault(); // Cancel close
        }
    });


    ipcMain.handle('app-version', () => app.getVersion())
    handleUpdates(mainWindow)
}

app.whenReady().then(() => {
    electronApp.setAppUserModelId('com.localcivilregistry.office')
    app.on('browser-window-created', (_, window) => {
        optimizer.watchWindowShortcuts(window)
    })

    // This causes slow startup, so we disable it for now
    clearUpdateFlags()
    createMainWindow()

    app.on('activate', function () {
        if (BrowserWindow.getAllWindows().length === 0) mainWindow()
    })
})

app.on('window-all-closed', async () => {
    if (process.platform !== 'darwin') {
        // Unregister all global shortcuts
        globalShortcut.unregisterAll()

        // Cleanup the temp folder
        await cleanupTempFolder()

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

app.on('before-quit', async () => {
    // Optional: Cleanup any resources before quitting
    await cleanupTempFolder()
    globalShortcut.unregisterAll()

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

ipcMain.handle('openSpecifiedFolder', async (event, inputPath) => {
    try {
        const fullPath = path.isAbsolute(inputPath)
            ? inputPath
            : path.join(os.homedir(), inputPath);

        await shell.openPath(fullPath);
        return true;
    } catch (error) {
        return false;
    }
});

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

        if (print_application_for_marriage_license.status) {
            return {
                status: true,
                pdfbase64: print_application_for_marriage_license.pdfbase64
            }
        }
    } catch (error) {
        console.error('Error in printing marriage application:', error)
        return { status: false, pdfbase64: null }
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

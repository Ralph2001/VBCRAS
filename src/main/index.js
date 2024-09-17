import { app, shell, BrowserWindow, ipcMain, globalShortcut, Notification } from 'electron'
import { join } from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import icon from '../../resources/icon.png'


import { generate } from '../documents/clerical/clerical_error'
import { finality } from '../documents/clerical/finality'
import { generate_form } from '../documents/forms/createForm'
import { CreateAnnotated } from '../documents/clerical/annotation'
import { generate_ausf } from '../documents/ausf/create_ausf'
import { generate_by_month_year } from '../documents/clerical/generate_report'

import { autoUpdater } from "electron-updater"


const log = require('electron-log');
autoUpdater.logger = log;
autoUpdater.logger.transports.file.level = 'info'; // Set log level


const { execFile } = require('child_process')
const { spawn } = require('child_process')
const { dialog } = require('electron')

const os = require('os')
const username = os.userInfo().username
const fse = require('fs-extra')
const fs = require('fs')


/**
 * Main Printer Opener
 */
const sumatraPath = join(__dirname, '../../resources/tools/SumatraPDF.exe').replace('app.asar', 'app.asar.unpacked');


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
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}


// Create Print Window without gui
ipcMain.handle('PrintThisPDF', async (event, base64Data) => {

    const randomFileName = `temp_${generateRandomString(20)}.pdf`;
    const pdfPath = join(__dirname, '../../resources/temp/', randomFileName).replace('app.asar', 'app.asar.unpacked');
    const fileDirectory = join(__dirname, '../../resources/temp/').replace('app.asar', 'app.asar.unpacked')

    fs.writeFile(pdfPath, Buffer.from(base64Data, 'base64'), (err) => {
        if (err) {
            console.error('Failed to write PDF to file', err);
            return;
        }

        const printProcess = spawn(sumatraPath, ['-print-dialog', '-exit-when-done', pdfPath]);

        printProcess.on('error', (error) => {
            console.error('Failed to start SumatraPDF process:', error);
        });

        printProcess.on('close', (code) => {
            if (code === 0) {
                console.log('Printed successfully');
            } else {
                console.error(`SumatraPDF process exited with code ${code}`);
            }

            fs.unlink(pdfPath, (err) => {
                if (err) {
                    console.error('Failed to delete temp PDF file', err);
                } else {
                    console.log('Temp PDF file deleted successfully');
                }
            });

            fse.emptyDirSync(fileDirectory);
        });
    });
});








// Form IPCMAIN

ipcMain.handle('createPdfForm', async (event, formData) => {
    try {
        const generate_record = await generate_form(formData)
        if ((generate_record.success = true)) {
            return {
                status: generate_record.status,
                filepath: true,
                dataurl: generate_record.pdfbase64,
            }
        }
    } catch (error) {
        console.log(error)
    }
})

ipcMain.handle('open-form', async (event, source) => {
    try {
        win = new BrowserWindow({
            webPreferences: {
                plugins: true,
                devTools: true,
            },

            autoHideMenuBar: true,
            show: true,
        })

        const load = await win.loadURL(source)
        return true
    } catch (error) {
        win.close()
        return false
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
                dataurl: createAUSF.pdfbase64,
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

ipcMain.handle('CreateAnnotated', async (event, formData) => {
    try {
        const user = 'C:\\Users\\' + username
        const generate_document = await CreateAnnotated(user, formData)
        return {
            status: generate_document.status,
            pdfbase64: generate_document.pdfbase64,
        }
    } catch (error) {
        console.log(error)
    }
})

ipcMain.handle('createPetitionDocument', async (event, formData) => {
    try {
        const data = JSON.parse(formData)
        const generate_document = await generate(formData);

        if (generate_document.status) {
            if (data.is_to_validate) {
                const saved_file_path = await shell.openExternal(join(generate_document.filepath, 'petition.docx'))
            }
            return { status: generate_document.status, filepath: generate_document.filepath };
        }
        return { status: generate_document.status, filepath: generate_document.filepath };
    } catch (error) {
        console.log(error);
        return { status: false, filepath: null };
    }
    // Not Needed
});

// Execute external command helper
function executeCommand(commandPath, args) {
    return new Promise((resolve, reject) => {
        const process = spawn(commandPath, args);
        let output = '';
        let error = '';

        process.stdout.on('data', (data) => {
            output += data.toString();
        });

        process.stderr.on('data', (data) => {
            error += data.toString();
        });

        process.on('close', (code) => {
            if (code === 0) {
                resolve(output);
            } else {
                reject(new Error(`Process failed with code ${code}: ${error}`));
            }
        });
    });
};

ipcMain.handle('proceedCreatePetition', async (event, formData) => {
    try {
        const data = JSON.parse(formData)

        // Define paths
        const doctoPath = join(__dirname, '../../resources/tools/Converter/docto.exe').replace('app.asar', 'app.asar.unpacked');

        const originalDirectory = data.orignal_path
        const petitionType = data.petition_type;
        const republicAct = data.republic_act_number;
        const documentOwner = data.document_owner === 'N/A' ? data.petitioner_name : data.document_owner;

        const outputDirectory = join(data.path_where_to_save, `Correction of Clerical Error and Change of First Name`, `${petitionType} ${republicAct}`, documentOwner);

        if (!fs.existsSync(outputDirectory)) {
            fs.mkdirSync(outputDirectory, { recursive: true })
        }

        // Conversion and Deletion arguments
        const convertArgs = [
            '-f', originalDirectory,
            '-O', outputDirectory,
            '-T', 'wdFormatPDF',
            '-OX', '.pdf'
        ];

        const deleteArgs = [
            '-f', originalDirectory,
            '-O', outputDirectory,
            '-T', 'wdFormatPDF',
            '-OX', '.pdf',
            '-R', 'true'
        ];

        // Convert and then delete files
        const conversionResult = await executeCommand(doctoPath, convertArgs);

        if (conversionResult) {
            await executeCommand(doctoPath, deleteArgs);
            return { status: true, filepath: outputDirectory };
        } else {
            return { status: false, filepath: null };
        }

    } catch (error) {
        console.error('Error during file conversion:', error);
        return { status: false, filepath: null };
    }
});




ipcMain.handle('createFinality', async (event, formData) => {
    try {
        const create_finality = await finality(formData)
        if ((create_finality.success = true)) {
            return { status: true, filepath: create_finality.filepath }
        }
    } catch (error) {
        console.log(error)
    }
})

ipcMain.handle('open-clerical', async (event, source) => {
    try {
        const filefolder = await shell.openExternal(source)
        return true
    } catch (error) {
        win.close()
        return false
    }
})

ipcMain.handle('remove-item', async (event, path) => {
    try {
        fs.rm(path, { recursive: true, force: true }, (err) => {
            if (err) {
                console.error(`Error removing directory: ${err.message}`);
                return;
            }
            console.log(`Directory ${path} removed successfully.`);
        });
        return
    } catch (error) {
        console.log(error)
        return false
    }
})


ipcMain.handle('open-clerical-files', (event, path) => {
    try {
        console.log(path)
        // Define the main directory
        const mainDirectory = path;

        // Get all PDF files in the directory
        const files = fs.readdirSync(mainDirectory)
            .filter(file => file.endsWith('.pdf')); // Filter for PDF files

        // Read each PDF file and encode it in base64
        const data = files.map(file => {
            const filePath = join(mainDirectory, file);
            const fileData = fs.readFileSync(filePath, 'base64');

            // Extract the name without the file extension
            const name = file.substring(0, file.lastIndexOf('.'));

            return { name, link: fileData };
        });

        return data;

    } catch (error) {
        return { error: 'Failed to open clerical files' };
    }
});

ipcMain.handle('generateReportByMonthYear', async (event, formData) => {
    try {
        const generate = await generate_by_month_year(formData)
        shell.showItemInFolder(generate.dir)
    } catch (error) {
        console.log(error)
    }
})



function showNotification(NOTIFICATION_TITLE, NOTIFICATION_BODY) {
    new Notification({ title: NOTIFICATION_TITLE, body: NOTIFICATION_BODY }).show()
}

/**
 * Main Window
 * 
 */

// Function to handle updates
function handleUpdates(mainWindow) {
    autoUpdater.checkForUpdatesAndNotify();

    autoUpdater.on('checking-for-update', (info) => {
        mainWindow.webContents.send('checking-for-update', info);
    });

    autoUpdater.on('update-available', (info) => {
        showNotification('Update Available', 'A new update is ready for download. The process will begin shortly to ensure you have the latest features and improvements. Thank you for keeping your application up-to-date.')
        mainWindow.webContents.send('update-available', info);
    });
    autoUpdater.on('update-not-available', (info) => {
        mainWindow.webContents.send('update-not-available', info);
    });

    autoUpdater.on('update-downloaded', (info) => {
        showNotification('Update Available', 'An update is starting to download. Please keep the app open to complete the download. Restart the app when done to apply the update.')
        mainWindow.webContents.send('update-downloaded', info);
        // Do Not Quit
        // autoUpdater.quitAndInstall();
    });

    autoUpdater.on('error', (err) => {
        log.error('Error while checking for updates:', err);
        mainWindow.webContents.send('update-error', err.message);
    });
}

// Function to check if the executable is already whitelisted
function isWhitelisted() {
    const whitelistFilePath = join(__dirname, '../../resources/app/whitelist.txt').replace('app.asar', 'app.asar.unpacked');
    // Check if the file exists and contains a success marker
    return fs.existsSync(whitelistFilePath);
}

function markAsWhitelisted() {
    const whitelistFilePath = join(__dirname, '../../resources/app/whitelist.txt').replace('app.asar', 'app.asar.unpacked');
    // Create a file to mark the executable as whitelisted
    fs.writeFileSync(whitelistFilePath, 'whitelisted', 'utf8');
}



function runPermissionController() {
    try {
        if (isWhitelisted()) {
            return true
        }
        const batFilePath = join(__dirname, '../../resources/app/permission.bat').replace('app.asar', 'app.asar.unpacked');
        execFile(batFilePath, (error, stdout, stderr) => {
            if (error) {
                console.error(`Error executing batch file: ${error.message}`);
                return false
            }
            if (stderr) {
                console.error(`stderr: ${stderr}`);
                return false
            }

        });
        markAsWhitelisted();
        return true
    } catch (error) {
        console.log(error)
        return false
    }
}

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
            sandbox: false,
        },
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
            hash: 'home',
        })
    }

    ipcMain.handle('app-version', () => app.getVersion());
    handleUpdates(mainWindow);

}

app.whenReady().then(() => {
    electronApp.setAppUserModelId('com.localcivilregistry.office')
    app.on('browser-window-created', (_, window) => {
        optimizer.watchWindowShortcuts(window)
    })

    runPermissionController()
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
        globalShortcut.unregisterAll();
        app.quit();
    }
});



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
        const fiepath = 'C:\\Users\\' + username + '\\' + source
        const data = fs.readFileSync(fiepath)
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
let pythonProcess = null
async function startServer() {
    try {
        // pythonProcess = execFile(
        //     join(__dirname, '../../resources/script/dist/app/app.exe')
        // )

        pythonProcess = spawn(
            'python',
            [join(__dirname, '../../resources/server/main.py')],
            {}
        )

        pythonProcess.on('error', (error) => {
            console.error('Error starting Python process:', error)
            pythonProcess = null
        })

        pythonProcess.on('exit', (code, signal) => {
            console.log(
                `Python process exited with code ${code} and signal ${signal}`
            )
            pythonProcess = null
        })

        return true
    } catch (error) {
        console.error('Error starting server:', error)
        return false
    }
}

ipcMain.handle('is-server-running', async (event) => {
    try {
        if (pythonProcess) {
            return true
        } else {
            return false
        }
    } catch (error) {
        console.log(error)
        return false
    }
})

ipcMain.handle('start-server', async (event) => {
    try {
        if (pythonProcess) {
            console.warn('Server is already running, cannot start again.')
            return false
        }
        const success = await startServer()
        return { success, addresses }
    } catch (error) {
        console.error('Error handling start-server request:', error)
        return false
    }
})

ipcMain.handle('stop-server', async (event) => {
    if (pythonProcess) {
        try {
            if (pythonProcess.connected) {
                pythonProcess.send('SIGTERM')
                await new Promise((resolve) => setTimeout(resolve, 500))
            }
            pythonProcess.kill()
            pythonProcess = null
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
            properties: ['openDirectory'],
        })
        const file_path = filePaths[0].replace('C:\\Users\\' + username + '\\', '')
        return file_path
    } catch (err) {
        console.error('There was an error', err)
    } finally {
        dialogOpen = false
    }
})

ipcMain.handle('select-file', async (event) => {
    if (dialogOpen) return
    try {
        dialogOpen = true
        const { canceled, filePaths } = await dialog.showOpenDialog({
            properties: ['openFile'],
            filters: [{ name: 'PDF Files', extensions: ['pdf'] }],
        })
        return { canceled, filePaths }
    } finally {
        dialogOpen = false
    }
})


ipcMain.handle('is_file_busy', async (event, path) => {
    try {
        // Try to open the file in read-write mode.
        const fileDescriptor = fs.openSync(path, 'r+');
        fs.closeSync(fileDescriptor);
        return false; // File is not locked
    } catch (error) {
        if (error.code === 'EBUSY' || error.code === 'EACCES' || error.code === 'EPERM') {
            return true; // File is locked, likely open in another program
        }
        throw error; // Some other error occurred
    }
})



ipcMain.handle('open-file', async (event, source) => {
    let win
    try {
        win = new BrowserWindow({
            webPreferences: {
                plugins: true,
                devTools: true,
                // preload: join(__dirname, 'custom.css'),
            },

            autoHideMenuBar: true,
            show: true,
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


ipcMain.handle('get-user', async (event) => {
    /**
     *  Return user name directory
     */
    return username
})
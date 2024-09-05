import { app, shell, BrowserWindow, ipcMain } from 'electron'
import { join } from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import icon from '../../resources/icon.png'


import { generate } from '../documents/clerical_error'
import { finality } from '../documents/finality'
import { generate_form } from '../documents/forms/createForm'
import { CreateAnnotated } from '../documents/clerical/generate_annotation'
import { generate_ausf } from '../documents/ausf/create_ausf'


const { execFile } = require('child_process')
const { spawn } = require('child_process')
const { dialog } = require('electron')

const os = require('os')
const username = os.userInfo().username
const fse = require('fs-extra')
const fs = require('fs')


const sumatraPath = join(__dirname, '../../resources/tools/SumatraPDF.exe');


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
    const pdfPath = join(__dirname, '../../resources/temp/', randomFileName);
    const fileDirectory = join(__dirname, '../../resources/temp/')

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

//  
// Convert Docx to PDF 

const doctoPath = join(__dirname, '../../resources/tools/Converter/docto.exe');
const originalDirectory = join(__dirname, '../../resources/documents/Generated/Correction of Clerical Error/');
const outputDirectory = join(__dirname, '../../resources/documents/Generated/Correction of Clerical Error/');

// Conversion arguments
const convertArgs = [
    '-f', originalDirectory,
    '-O', outputDirectory,
    '-T', 'wdFormatPDF',
    '-OX', '.pdf'
];

// Deletion arguments
const deleteArgs = [
    '-f', originalDirectory,
    '-O', outputDirectory,
    '-T', 'wdFormatPDF',
    '-OX', '.pdf',
    '-R', 'true'
];


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
}






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
        const generate_document = await generate(formData);
        if (generate_document.status) {
            const source = join(__dirname, '../../resources/documents/Generated/Correction of Clerical Error/Petition.docx')
            const open_file = await shell.openExternal(source)

            if (!open_file) {
                return { status: false, filepath: null };
            }
        }
        return { status: true, filepath: null };
    } catch (error) {
        console.log(error);
    }
    return false;  // Return false if something went wrong
});


ipcMain.handle('proceedCreatePetition', async (event, formData) => {
    try {
        const convert_files_and_delete = await executeCommand(doctoPath, convertArgs)
            .then(async (output) => {
                await executeCommand(doctoPath, deleteArgs);
                return true;
            })
            .catch((error) => {
                console.error('Error:', error);
                return false;
            });

        if (convert_files_and_delete) {
            return { status: true, filepath: null };
        }

    } catch (error) {
        console.log(error);
    }
    return false;  // Return false if something went wrong
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

ipcMain.handle('open-clerical-files', async (event, source) => {
    const petition = fs.readFileSync(join(__dirname, '../../resources/documents/Generated/Correction of Clerical Error/Petition.pdf')).toString('base64')
    const endorsement_letter = fs.readFileSync(join(__dirname, '../../resources/documents/Generated/Correction of Clerical Error/Endorsement Letter.pdf')).toString('base64')
    const record_sheet = fs.readFileSync(join(__dirname, '../../resources/documents/Generated/Correction of Clerical Error/Record Sheet.pdf')).toString('base64')
    const posting = fs.readFileSync(join(__dirname, '../../resources/documents/Generated/Correction of Clerical Error/Posting.pdf')).toString('base64')


    const data = [
        { name: 'Petition', link: petition },
        { name: 'Posting', link: posting },
        { name: 'Endorsement Letter', link: endorsement_letter },
        { name: 'Record Sheet', link: record_sheet },
    ]

    return data
})





/**
 * Main Window
 * 
 */
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
}

app.whenReady().then(() => {
    electronApp.setAppUserModelId('com.localcivilregistry.office')
    app.on('browser-window-created', (_, window) => {
        optimizer.watchWindowShortcuts(window)
    })
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
            [join(__dirname, '../../resources/script/app.py')],
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
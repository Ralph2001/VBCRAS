// In your Electron main process file (e.g., main.js or a separate print-handler.js)

import { extractPageRange } from '../documents/extract';


const { BrowserWindow } = require('electron'); // Make sure BrowserWindow is imported
const { join } = require('path'); // Use require for commonJS in main process
const { spawn } = require('child_process'); // For Method 2
const fs = require('fs').promises; // For Method 2: Use promise-based fs





const sumatraPath = join(
    __dirname,
    '../../resources/tools/printer/SumatraPDF.exe'
).replace('app.asar', 'app.asar.unpacked')


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
 * Handles printing a PDF using Method 1: Opens PDF in a new BrowserWindow for user interaction.
 * This method is less about direct printing and more about displaying the PDF
 * in a browser window where the user can then choose to print.
 *
 * @param {string} base64 - The base64 encoded PDF data.
 * @returns {Promise<{status: boolean, message: string}>} A promise that resolves with the print status.
 */
export async function printPdfMethod1(base64) {
    if (!base64 || typeof base64 !== 'string' || base64.trim() === '') {
        return { status: false, message: 'No PDF data provided for Method 1.' };
    }

    return new Promise((resolve) => {
        let printWindow = null;
        try {
            printWindow = new BrowserWindow({
                width: 900,
                height: 700,
                show: false, // Start hidden to prevent flash of unstyled content
                webPreferences: {
                    plugins: true, // Crucial for Electron to display PDFs natively
                    nodeIntegration: false, // Best practice for security
                    contextIsolation: true, // Best practice for security
                },
            });

            // Handle window close
            printWindow.on('closed', () => {
                console.log('[Print Method 1] Print window closed by user.');
                // Resolve the promise when the window is closed.
                // You might want a more sophisticated way to know if print actually happened.
                // For now, closing the window signifies the end of this method's interaction.
                if (printWindow) { // Prevent double resolution if already resolved by error/load
                    resolve({ status: true, message: 'PDF window opened and closed by user (Method 1).' });
                    printWindow = null;
                }
            });

            // Construct the data URL
            const pdfDataUrl = `data:application/pdf;base64,${base64}`;

            printWindow.webContents.on('did-fail-load', (event, errorCode, errorDescription) => {
                console.error(`[Print Method 1] PDF window failed to load content: ${errorDescription}`);
                const msg = `PDF content failed to load in new window: ${errorDescription}`;
                printWindow.destroy(); // Clean up the window
                resolve({ status: false, message: msg });
                printWindow = null;
            });

            printWindow.webContents.on('did-finish-load', () => {
                console.log('[Print Method 1] PDF content loaded successfully in new window.');
                printWindow.show(); // Show window only after content is loaded
            });

            printWindow.loadURL(pdfDataUrl)
                .catch(error => {
                    console.error('[Print Method 1] Error loading PDF URL:', error);
                    printWindow.destroy();
                    resolve({ status: false, message: `Error loading PDF into window: ${error.message}` });
                    printWindow = null;
                });

        } catch (error) {
            console.error('[Print Method 1] Error creating or managing BrowserWindow:', error);
            if (printWindow && !printWindow.isDestroyed()) {
                printWindow.destroy();
            }
            resolve({ status: false, message: `Failed to open PDF window: ${error.message}` });
        }
    });
}

/**
 * Handles printing a PDF using Method 2 (SumatraPDF with print dialog).
 *
 * @param {string} base64Data - The base64 encoded PDF data.
 * @returns {Promise<{status: boolean, message: string}>} A promise that resolves with the print status.
 */
export async function printPdfMethod2(base64, range) {

    console.log('[CONFIG] Running print with SumatraPDF Method 2 with range:', range);
    let base64Data;
    const pageRange = range ? JSON.parse(range) : null;

    if (pageRange) {
        const { from, to } = pageRange[0];
        try {
            base64Data = await extractPageRange(base64, from, to);
        } catch (error) {
            const msg = `Failed to extract page range: ${error.message}`;
            console.error(`[Print Method 2] ${msg}`);
            return { status: false, message: msg };
        }
        // base64Data = base64;

    } else {
        base64Data = base64;
    }

    let pdfPath; // Declare here for cleanup later
    return new Promise(async (resolve) => {
        try {
            const randomFileName = `temp_${generateRandomString(20)}.pdf`;
            pdfPath = join(
                __dirname,
                '../../resources/temp/',
                randomFileName
            ).replace('app.asar', 'app.asar.unpacked');

            // Ensure the temp directory exists
            await fs.mkdir(join(__dirname, '../../resources/temp/').replace('app.asar', 'app.asar.unpacked'), { recursive: true });

            // Write the PDF file
            await fs.writeFile(pdfPath, Buffer.from(base64Data, 'base64'));
            console.log(`[Print Method 2] Temp PDF created at: ${pdfPath}`);

            const args = [
                '-print-dialog',
                '-exit-when-done',
                pdfPath
            ];

            let stdout = '';
            let stderr = '';


            setTimeout(() => {
                const printProcess = spawn(sumatraPath, args);

                printProcess.stdout.on('data', (data) => {
                    stdout += data.toString();
                });

                printProcess.stderr.on('data', (data) => {
                    stderr += data.toString();
                });

                printProcess.on('error', (error) => {
                    const msg = `Failed to start SumatraPDF process: ${error.message}`;
                    console.error(`[Print Method 2] ${msg}`);
                    resolve({ status: false, message: msg });

                });

                printProcess.on('exit', async (code) => {
                    console.log(`[Print Method 2] SumatraPDF process exited with code: ${code}`);
                    if (stdout) console.log(`[Print Method 2] SumatraPDF stdout:\n${stdout}`);
                    if (stderr) console.error(`[Print Method 2] SumatraPDF stderr:\n${stderr}`);

                    // Wait a bit before cleanup to ensure the print spooler has picked it up
                    await new Promise((res) => setTimeout(res, 5000)); // Wait 5 seconds


                    if (code === 0) {
                        resolve({ status: true, message: 'Print job sent successfully via Method 2.' });
                    } else {
                        const msg = `SumatraPDF exited with non-zero code ${code}. Check stderr for details.`;
                        resolve({ status: false, message: msg });
                    }
                });

            }, 200); // Wait 0.2 seconds before starting the print process



        } catch (error) {
            const msg = `Error in printPdfMethod2: ${error.message}`;
            console.error(`[Print Method 2] ${msg}`, error);

            resolve({ status: false, message: msg });
        }
    });
}


/**
 * Handles printing a PDF with custom options using Electron's print API (Method 3).
 *
 * @param {string} base64 - The base64 encoded PDF data.
 * @param {string} printerName - The name of the printer to use.
 * @param {string} optionsJson - A JSON string of print options (e.g., pageSize, printBackground, etc.).
 * @returns {Promise<{status: boolean, message: string}>} A promise that resolves with the print status.
 */

export async function printPdfMethod3(base64, printerName, optionsJson) {
    let base64Data;

    console.log('[CONFIG] Running print with Electron Version: ', process.versions.electron);

    // Parse print options from the JSON string
    let options;
    try {
        options = JSON.parse(optionsJson);
    } catch (e) {
        const msg = `Invalid print options JSON: ${e.message}`;
        console.error(`[Print Method 3] ${msg}`);
        return { status: false, message: msg };
    }

    // Extract page range if specified
    if (options.pageRanges?.length) {
        const { from, to } = options.pageRanges[0];
        try {
            base64Data = await extractPageRange(base64, from, to);
        } catch (error) {
            const msg = `Failed to extract page range: ${error.message}`;
            console.error(`[Print Method 3] ${msg}`);
            return { status: false, message: msg };
        }
    } else {
        base64Data = base64;
    }

    // 1. Initial validation for printerName
    if (!printerName || printerName.trim() === '') {
        return { status: false, message: 'No printer selected.' };
    }

    // 2. Validate if the printerName exists using getPrintersAsync()
    try {
        const tempWin = new BrowserWindow({ show: false });
        const printers = await tempWin.webContents.getPrintersAsync();
        tempWin.destroy();

        const desiredPrinter = printers.find((p) => p.name === printerName);

        if (!desiredPrinter) {
            console.error(`[Print Method 3] Target printer "${printerName}" was not found.`);
            return {
                status: false,
                message: `Printer "${printerName}" not found.`,
            };
        }
    } catch (error) {
        console.error('[Print Method 3] Failed to retrieve printer list:', error);
        return {
            status: false,
            message: `Failed to retrieve printer list: ${error.message}`,
        };
    }

    const INCH_TO_MICRONS = 25400;

    const customPaperSizes = {
        'Long Coupon': {
            width: Math.round(8.5 * INCH_TO_MICRONS),
            height: Math.round(13 * INCH_TO_MICRONS),
        },
    };

    let paperPageSize = options.pageSize;

    const PrinterOption = {
        silent: true,
        deviceName: printerName,
        pageSize: customPaperSizes[paperPageSize]
            ? customPaperSizes[paperPageSize]
            : paperPageSize,
        printBackground: options.printBackground ?? true,
        color: options.color ?? true,
        landscape: options.landscape ?? false,
        copies: options.copies ?? 1,
        duplexMode: options.duplexMode ?? 'simplex',
        scaleFactor: options.scaleFactor ?? 100, // Use option value if provided
        pagesPerSheet: options.pagesPerSheet ?? 1,
        collate: options.collate ?? true,
        dpi: options.dpi ?? { horizontal: 300, vertical: 300 },
        // margins: options.margins
    };

    console.log('[CONFIG] Received Paper Size ', paperPageSize);
    console.log('[CONFIG] Customized Paper Size ', customPaperSizes[paperPageSize]);
    console.log('---'); // Simplified logs
    console.log('[CONFIG] Page Ranges (raw from options): ', options.pageRanges);
    console.log('---');
    console.log('[CONFIG] Printer Options: ', PrinterOption);

    return new Promise((resolve) => {
        const win = new BrowserWindow({
            show: false,
            webPreferences: {
                plugins: true,
            },
        });

        const cleanup = () => {
            if (win && !win.isDestroyed()) {
                win.destroy();
            }
        };

        const b64 = `data:application/pdf;base64,${base64Data}`;

        win.webContents.on(
            'did-fail-load',
            (event, errorCode, errorDescription) => {
                console.error(`[Print Method 3] PDF window failed to load content: ${errorDescription}`);
                cleanup();
                resolve({ status: false, message: `PDF content failed to load: ${errorDescription}` });
            }
        );

        win.webContents.on('did-finish-load', () => {
            console.log('[Print Method 3] "did-finish-load" fired. Waiting for PDF to render...');

            setTimeout(async () => {
                try {
                    console.log(`[Print Method 3] Sending print command to "${printerName}".`);

                    win.webContents.print(
                        PrinterOption,
                        (success, failureReason) => {
                            if (success) {
                                console.log('[Print Method 3] Print job sent successfully to spooler.');
                                cleanup();
                                resolve({ status: true, message: 'Print job sent successfully.' });
                            } else {
                                const errorMsg = `Print command failed: ${failureReason}`;
                                console.error(`[Print Method 3] ${errorMsg}`);
                                cleanup();
                                resolve({ status: false, message: errorMsg });
                            }
                        }
                    );
                } catch (err) {
                    console.error('[Print Method 3] An error occurred during the print process:', err);
                    cleanup();
                    // Resolve with error status for consistency, rather than reject
                    resolve({
                        status: false,
                        message: `An unexpected error occurred during printing: ${err.message}`,
                    });
                }
            }, 2000); // Give PDF viewer time to render
        });

        win.loadURL(b64);
    });
}




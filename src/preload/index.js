import { contextBridge, ipcRenderer } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'

const api = {}

if (process.contextIsolated) {
    try {
        contextBridge.exposeInMainWorld('electron', electronAPI)
        contextBridge.exposeInMainWorld('api', api)
    } catch (error) {
        console.error(error)
    }
} else {
    window.electron = electronAPI
    window.api = api
}

contextBridge.exposeInMainWorld('ClericalApi', {
    CreateAnnotated: async (formData) => {
        const result = await ipcRenderer.invoke('CreateAnnotated', formData)
        return {
            status: result.status,
            pdfbase64: result.pdfbase64,
        }
    },
    SaveAnnotated: async (fileUri) => {
        const result = await ipcRenderer.invoke('saveAnnotated', fileUri)
        return result
    },
    createPetitionDocument: async (formData) => {
        const result = await ipcRenderer.invoke('createPetitionDocument', formData)

        return { status: result.status, filepath: result.filepath }
    },
    proceedCreatePetition: async (formData) => {
        const result = await ipcRenderer.invoke('proceedCreatePetition', formData)

        return { status: result.status, filepath: result.filepath }
    },

    CreateFinality: async (formData) => {
        const result = await ipcRenderer.invoke('createFinality', formData)
        return { status: result.status, filepath: result.filepath }
    },
    OpenClerical: async (source) => {
        const result = await ipcRenderer.invoke('open-clerical', source)
        if (result) {
            return true
        }
    },
    OpenClericalFiles: async (source) => {
        const result = await ipcRenderer.invoke('open-clerical-files', source)
        return result
    },
    GenerateReportByMonthYear: async (formData) => {
        const generate = await ipcRenderer.invoke('generateReportByMonthYear', formData)

    },
    RemoveItem: async (path) => {
        const remove_item = await ipcRenderer.invoke('remove-item', path)

    },
    IsFileBusy: async (path) => {
        const is_busy = await ipcRenderer.invoke('is_file_busy', path)
        return is_busy
    },
    CreateCertificateFiling: async (data) => {
        const certificate_filing = await ipcRenderer.invoke('create_certificate_filing', data)
        return certificate_filing
    }
})

contextBridge.exposeInMainWorld('FormApi', {
    CreateForm: async (formData) => {
        const result = await ipcRenderer.invoke('createForm', formData)
        return { status: result.status, filepath: result.filepath }
    },
    createPdfForm: async (formData) => {
        const result = await ipcRenderer.invoke('createPdfForm', formData)
        return {
            status: result.status,
            filepath: result.filepath,
            dataurl: result.dataurl,
        }
    },
    openPdfForm: async (source) => {
        const result = await ipcRenderer.invoke('open-form', source)
        return true
    },
})

//  AUSF
contextBridge.exposeInMainWorld('AusfApi', {
    createAUSF: async (formData) => {
        const result = await ipcRenderer.invoke('createAUSF', formData)
        return {
            status: result.status,
            filepath: result.filepath,
            dataurl: result.dataurl,
        }
    },
})



contextBridge.exposeInMainWorld('ScannedApi', {
    OpenInSideBar: async (formData) => {
        const result = await ipcRenderer.invoke(
            'open-scanned-sidebar',
            formData
        )
        return { status: result.status, fileUrl: result.fileUrl }
    },
})

contextBridge.exposeInMainWorld('LocalCivilApi', {
    IsServerRunning: async () => {
        const result = await ipcRenderer.invoke('is-server-running')
        return result
    },
    StartServer: async () => {
        const result = await ipcRenderer.invoke('start-server')
        return result
    },
    StopServer: async () => {
        const result = await ipcRenderer.invoke('stop-server')
        return result
    },
    getUser: async () => {
        const result = await ipcRenderer.invoke('get-user')
        return result
    },
    selectFolder: async () => {
        const result = await ipcRenderer.invoke('select-folder')
        return result
    },
    selectFile: async () => {
        const { canceled, filePaths } = await ipcRenderer.invoke('select-file')
        return canceled ? null : filePaths[0]
    },
    moveFile: async (source, destination) => {
        const result = await ipcRenderer.invoke('move-file', {
            source,
            destination,
        })
        return result
    },
    copyFile: async (source, destination) => {
        const result = await ipcRenderer.invoke('copy-file', {
            source,
            destination,
        })
        return result
    },
    checkFile: async (source) => {
        const result = await ipcRenderer.invoke('open-file', source)
        if (result) {
            return true
        }
    },
    openFilePath: async (source) => {
        const result = await ipcRenderer.invoke('open-file-folder', source)
        if (result) {
            return true
        }
    },
    printPDFBase64: async (base64Data) => {
        const result = await ipcRenderer.invoke('PrintThisPDF', base64Data)
        if (result) {
            return true
        }
    },
})

contextBridge.exposeInMainWorld('UpdateApi', {
    // Listen for updates and forward them to Vue.js
    onUpdateCheck: (callback) => ipcRenderer.on('checking-for-update', callback),
    onUpdateAvailable: (callback) => ipcRenderer.on('update-available', callback),
    onUpdateNotAvailable: (callback) => ipcRenderer.on('update-not-available', callback),
    onUpdateDownloaded: (callback) => ipcRenderer.on('update-downloaded', callback),
    onUpdateError: (callback) => ipcRenderer.on('update-error', callback),
    appVersion: (callback) => ipcRenderer.invoke('app-version')
});
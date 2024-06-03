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
    PrintLiveBirth: async (formData) => {
        const result = await ipcRenderer.invoke('printLiveBirth', formData)
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

contextBridge.exposeInMainWorld('RecordsApi', {
    GenerateRecords: async (formData) => {
        const result = await ipcRenderer.invoke('GenerateRecords', formData)
        return true
    },
})

contextBridge.exposeInMainWorld('ScannedApi', {
    OpenInSideBar: async (formData) => {
        const result = await ipcRenderer.invoke(
            'open-scanned-sidebar',
            formData
        )
        console.log(result)
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
        const { canceled, filePaths } =
            await ipcRenderer.invoke('select-folder')
        return canceled ? null : filePaths[0]
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
})

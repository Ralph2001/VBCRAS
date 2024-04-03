import { contextBridge, ipcRenderer } from 'electron';
import { electronAPI } from '@electron-toolkit/preload';

const api = {};

if (process.contextIsolated) {
    try {
        contextBridge.exposeInMainWorld('electron', electronAPI);
        contextBridge.exposeInMainWorld('api', api);
    } catch (error) {
        console.error(error);
    }
} else {
    window.electron = electronAPI;
    window.api = api;
}

contextBridge.exposeInMainWorld('ClericalApi', {
    PrintLiveBirth: async (formData) => {
        const result = await ipcRenderer.invoke('printLiveBirth', formData);
        return result;
    },
});

contextBridge.exposeInMainWorld('LocalCivilApi', {
    IsServerRunning: async () => {
        const result = await ipcRenderer.invoke('is-server-running');
        return result;
    },
    StartServer: async () => {
        const result = await ipcRenderer.invoke('start-server');
        return result;
    },
    StopServer: async () => {
        const result = await ipcRenderer.invoke('stop-server');
        return result;
    },
    getUser: async () => {
        const result = await ipcRenderer.invoke('get-user');
        return result;
    },
    selectFolder: async () => {
        const { canceled, filePaths } =
            await ipcRenderer.invoke('select-folder');
        return canceled ? null : filePaths[0];
    },
    selectFile: async () => {
        const { canceled, filePaths } = await ipcRenderer.invoke('select-file');
        return canceled ? null : filePaths[0];
    },
    moveFile: async (source, destination) => {
        const result = await ipcRenderer.invoke('move-file', {
            source,
            destination,
        });
        return result;
    },
    copyFile: async (source, destination) => {
        const result = await ipcRenderer.invoke('copy-file', {
            source,
            destination,
        });
        return result;
    },
    checkFile: async (source) => {
        const result = await ipcRenderer.invoke('open-file', source);
        if (result) {
            return true;
        }
    },
    openFilePath: async (source) => {
        const result = await ipcRenderer.invoke('open-file-folder', source);
        if (result) {
            return true;
        }
    },
});

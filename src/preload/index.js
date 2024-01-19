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

contextBridge.exposeInMainWorld('LocalCivilApi', {
  selectFolder: async () => {
    const { canceled, filePaths } = await ipcRenderer.invoke('select-folder');
    return canceled ? null : filePaths[0];
  },
  selectFile: async () => {
    const { canceled, filePaths } = await ipcRenderer.invoke('select-file');
    return canceled ? null : filePaths[0];
  },
  moveFile: async (source, destination) => {
    const result = await ipcRenderer.invoke('move-file', { source, destination });
    return result
  },
  copyFile: async (source, destination) => {
    const result = await ipcRenderer.invoke('copy-file', { source, destination });
    return result
  },
  checkFile: async (source) => {
    const result = await ipcRenderer.invoke('check-file', source);
    return result;
  },
});






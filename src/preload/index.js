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
  moveFile: async (data) => {
    const result = await ipcRenderer.invoke('sendDataToMain', data);
    return result
  },
});




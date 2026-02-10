import { contextBridge, ipcRenderer, webUtils } from 'electron'
import { pathToFileURL } from 'url'
import { electronAPI } from '@electron-toolkit/preload'

const api = {
  getPathForFile: (file) => webUtils.getPathForFile(file),
  pathToFileUrl: (filePath) => {
    if (!filePath) return null
    try {
      return pathToFileURL(filePath).toString()
    } catch (err) {
      return null
    }
  },
  getImageMetadata: (filePath) => ipcRenderer.invoke('get-image-metadata', filePath),
  tagImage: (filePath, tags) => ipcRenderer.invoke('tag-image', filePath, tags),
  fileExists: (filePath) => ipcRenderer.invoke('file-exists', filePath),
  getThumbnail: (filePath, size) => ipcRenderer.invoke('get-thumbnail', filePath, size),
  getAppVersion: () => ipcRenderer.invoke('get-app-version'),
  minimize: () => ipcRenderer.send('window-minimize'),
  maximize: () => ipcRenderer.send('window-maximize'),
  close: () => ipcRenderer.send('window-close'),
  quit: () => ipcRenderer.send('app-quit')
}

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

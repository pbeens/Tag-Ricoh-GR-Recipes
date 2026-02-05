import { app, shell, BrowserWindow, ipcMain, nativeImage } from 'electron'
import { join } from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import { spawn } from 'child_process'
import path from 'path'
import fs from 'fs'

function createWindow() {
  const mainWindow = new BrowserWindow({
    width: 1000,
    height: 700,
    show: false,
    autoHideMenuBar: true,
    resizable: false,
    maximizable: false,
    fullscreenable: false,
    frame: false, // Cleaner for custom dragging on Windows
    title: 'Ricoh GR Image Tagger',
    ...(process.platform === 'linux' ? { icon: join(__dirname, '../../resources/icon.png') } : {}),
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false
    }
  })

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
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }
}

app.whenReady().then(() => {
  electronApp.setAppUserModelId('com.electron.ricoh-gr-tagger')

  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  // IPC handlers
  ipcMain.handle('get-image-tone', async (event, filePath) => {
    return await runExifTool(['-json', '-ImageTone', filePath])
  })

  ipcMain.handle('tag-image', async (event, filePath, tone) => {
    const existing = await runExifTool(['-json', '-Keywords', '-Subject', filePath])
    if (Array.isArray(existing) && existing[0]) {
      const keywords = new Set()
      const add = (value) => {
        if (Array.isArray(value)) {
          value.forEach((v) => keywords.add(String(v)))
        } else if (typeof value === 'string') {
          value.split(',').map((v) => v.trim()).filter(Boolean).forEach((v) => keywords.add(v))
        }
      }
      add(existing[0].Keywords)
      add(existing[0].Subject)

      if (keywords.has(tone)) {
        return { skipped: true, reason: 'already-tagged' }
      }
    }

    return await runExifTool([
      '-P',
      '-overwrite_original',
      `-Keywords+=${tone}`,
      `-Subject+=${tone}`,
      filePath
    ])
  })

  ipcMain.handle('file-exists', async (event, filePath) => {
    if (!filePath) return false
    try {
      return fs.existsSync(filePath)
    } catch (e) {
      return false
    }
  })

  ipcMain.handle('get-thumbnail', async (event, filePath, size = 96) => {
    if (!filePath) return null
    try {
      if (!fs.existsSync(filePath)) return null
      const image = nativeImage.createFromPath(filePath)
      if (image.isEmpty()) return null
      const resized = image.resize({ width: size, height: size, quality: 'good' })
      return resized.toDataURL()
    } catch (e) {
      return null
    }
  })

  ipcMain.on('window-minimize', () => {
    BrowserWindow.getFocusedWindow()?.minimize()
  })

  ipcMain.on('window-maximize', () => {
    const win = BrowserWindow.getFocusedWindow()
    if (win) {
      if (win.isMaximized()) win.unmaximize()
      else win.maximize()
    }
  })

  ipcMain.on('window-close', () => {
    BrowserWindow.getFocusedWindow()?.close()
  })

  ipcMain.on('app-quit', () => {
    app.quit()
  })

  createWindow()

  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

async function runExifTool(args) {
  return new Promise((resolve, reject) => {
    const devBase = app.getAppPath()
    const resourceBase = app.isPackaged ? process.resourcesPath : devBase
    const resolveResource = (packagedRel, devRel) =>
      app.isPackaged ? path.join(resourceBase, packagedRel) : path.join(devBase, devRel)
    const candidates = []

    if (process.platform === 'win32') {
      candidates.push(resolveResource('exiftool.exe', 'resources/exiftool.exe'))
      candidates.push(path.join(devBase, 'exiftool.exe'))
    } else if (process.platform === 'darwin') {
      candidates.push(resolveResource('exiftool-mac/bin/exiftool', 'resources/exiftool-mac/bin/exiftool'))
      candidates.push(path.join(devBase, 'exiftool-mac', 'bin', 'exiftool'))
      candidates.push('exiftool')
    } else {
      // Use system exiftool on macOS/Linux
      candidates.push('exiftool')
    }

    let finalPath = candidates.find((candidate) => {
      if (candidate === 'exiftool') return true
      return fs.existsSync(candidate)
    })

    if (!finalPath) {
      if (process.platform === 'win32') {
        reject(
          new Error(
            'ExifTool not found. Expected resources/exiftool.exe or exiftool.exe in the app directory.'
          )
        )
        return
      }
      finalPath = 'exiftool'
    }

    const child = spawn(finalPath, args)
    let stdout = ''
    let stderr = ''

    child.stdout.on('data', (data) => {
      stdout += data.toString()
    })

    child.stderr.on('data', (data) => {
      stderr += data.toString()
    })

    child.on('error', (err) => {
      if (err && err.code === 'ENOENT') {
        reject(
          new Error(
            'ExifTool not found. On macOS/Linux, install it and ensure `exiftool` is on your PATH.'
          )
        )
        return
      }
      reject(err)
    })

    child.on('close', (code) => {
      if (code === 0) {
        try {
          if (args.includes('-json')) {
            resolve(JSON.parse(stdout))
          } else {
            resolve(stdout)
          }
        } catch (e) {
          resolve(stdout)
        }
      } else {
        reject(new Error(stderr || `ExifTool exited with code ${code}`))
      }
    })
  })
}

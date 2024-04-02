import { is } from '@electron-toolkit/utils'
import { BrowserWindow, shell } from 'electron'
import { createFileRoute } from 'electron-router-dom'
import { createURLRoute } from 'electron-router-dom'
import { join } from 'path'

export function createWindow(id, option) {
  const mainWindow = new BrowserWindow(option)
  mainWindow.on('ready-to-show', () => {
    mainWindow.show()
  })
  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url).then()
    return { action: 'deny' }
  })
  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(createURLRoute(process.env['ELECTRON_RENDERER_URL'], id)).then()
  } else {
    mainWindow.loadFile(...createFileRoute(join(__dirname, '../renderer/index.html'), id)).then()
  }
  return mainWindow
}

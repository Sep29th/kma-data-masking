import { ipcMain, nativeTheme } from 'electron'
import * as fs from 'fs-extra'

export const SwitchThemeMode = () => {
  ipcMain.handle('main:post-switch-theme-mode', (_, mode = false) => {
    try {
      let themeMode
      if (mode) {
        fs.writeJSONSync('./theme-mode.json', { themeMode: mode })
        themeMode = mode
      } else themeMode = fs.readJSONSync('./theme-mode.json').themeMode
      switch (themeMode) {
        case 'system':
          return {
            render: nativeTheme.shouldUseDarkColors ? 'dark' : 'light',
            choosed: themeMode
          }
        case 'dark':
          return { render: 'dark', choosed: themeMode }
        case 'light':
          return { render: 'light', choosed: themeMode }
      }
    } catch (error) {
      fs.writeJSONSync('./theme-mode.json', { themeMode: 'system' })
      return { render: nativeTheme.shouldUseDarkColors ? 'dark' : 'light', choosed: 'system' }
    }
  })
}

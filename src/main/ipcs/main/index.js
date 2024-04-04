import { SwitchThemeMode } from './switch-theme-mode/switch-theme-mode.ipc'
import { GetSavedDatabaseIpc } from './database/get-saved-database.ipc'

const allIpc = [SwitchThemeMode, GetSavedDatabaseIpc]

export const main = () => {
  allIpc.forEach((ipc) => {
    ipc()
  })
}

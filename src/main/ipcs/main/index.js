import { SwitchThemeMode } from './switch-theme-mode/switch-theme-mode.ipc'
import { GetSavedDatabaseIpc, Login } from "./database/get-saved-database.ipc";

const allIpc = [SwitchThemeMode, GetSavedDatabaseIpc, Login]

export const main = () => {
  allIpc.forEach((ipc) => {
    ipc()
  })
}

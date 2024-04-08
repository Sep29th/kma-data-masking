import { SwitchThemeMode } from './switch-theme-mode/switch-theme-mode.ipc'
import {
  AddDb,
  GetSavedDatabaseIpc,
  Login,
  MaskColumn,
  RunQuery
} from './database/get-saved-database.ipc'

const allIpc = [SwitchThemeMode, GetSavedDatabaseIpc, Login, RunQuery, AddDb, MaskColumn]

export const main = () => {
  allIpc.forEach((ipc) => {
    ipc()
  })
}

import { SwitchThemeMode } from './switch-theme-mode/switch-theme-mode.ipc'
import {
  AddDb,
  CreateGroup,
  CreateUser,
  GetSavedDatabaseIpc,
  HandleManagerAuthorization,
  Login,
  MaskColumn,
  RunQuery
} from './database/get-saved-database.ipc'

const allIpc = [
  SwitchThemeMode,
  GetSavedDatabaseIpc,
  Login,
  RunQuery,
  AddDb,
  MaskColumn,
  CreateUser,
  CreateGroup,
  HandleManagerAuthorization
]

export const main = () => {
  allIpc.forEach((ipc) => {
    ipc()
  })
}

import { SwitchThemeMode } from './switch-theme-mode/switch-theme-mode.ipc'

const allIpc = [SwitchThemeMode]

export const main = () => {
  allIpc.forEach((ipc) => {
    ipc()
  })
}

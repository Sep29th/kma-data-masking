const ipcRenderer = window.electron.ipcRenderer

export const SwitchThemeMode = async (mode = false) => {
  return await ipcRenderer.invoke('main:post-switch-theme-mode', mode)
}

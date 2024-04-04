const ipcRenderer = window.electron.ipcRenderer

export const GetSavedDatabase = async () => {
  return await ipcRenderer.invoke("main:get-saved-database")
}
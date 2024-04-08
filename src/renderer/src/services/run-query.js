const ipcRenderer = window.electron.ipcRenderer

export const RunQuery = async (query, currentUser) => {
  return await ipcRenderer.invoke('main:post-run-query', query, currentUser)
}

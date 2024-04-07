const ipcRenderer = window.electron.ipcRenderer;

export const LoginToDB = async (info) => {
  return await ipcRenderer.invoke("main:post-login", info);
};
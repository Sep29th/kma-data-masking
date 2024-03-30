import { app, BrowserWindow, ipcMain } from "electron";
import { join } from "path";
import { electronApp, optimizer } from "@electron-toolkit/utils";
import icon from "../../resources/icon.png?asset";
import { main } from "../ipcs/main";
import { createWindow } from "../windows/main.window";

app.whenReady().then(() => {
  electronApp.setAppUserModelId("com.electron");
  app.on("browser-window-created", (_, window) => {
    optimizer.watchWindowShortcuts(window);
  });
  main();
  let mainWindow = createWindow("main", {
    width: 900,
    height: 670,
    show: false,
    autoHideMenuBar: true,
    ...(process.platform === "linux" ? { icon } : {}),
    titleBarStyle: "hidden",
    webPreferences: {
      devTools: true,
      preload: join(__dirname, "../preload/index.js"),
      sandbox: false
    }
  });
  app.on("activate", function() {
    if (BrowserWindow.getAllWindows().length === 0)
      mainWindow = createWindow("main", {
        width: 900,
        height: 670,
        show: false,
        autoHideMenuBar: true,
        ...(process.platform === "linux" ? { icon } : {}),
        titleBarStyle: "hidden",
        webPreferences: {
          devTools: true,
          preload: join(__dirname, "../preload/index.js"),
          sandbox: false
        }
      });
  });
  mainWindow.on("maximize", () => {
    mainWindow.webContents.send("window-maximize")
  });
  mainWindow.on("unmaximize", () => {
    mainWindow.webContents.send("window-restore")
  })
  ipcMain.handle("window-state", () => {
    return mainWindow.isMinimized();
  });
  ipcMain.on("close-btn", () => {
    mainWindow.close();
    setTimeout(app.quit, 100);
  });
  ipcMain.on("minimize-btn", () => {
    mainWindow.minimize();
  });
  ipcMain.on("maximize-btn", () => {
    mainWindow.maximize();
  });
  ipcMain.on("restore-down-btn", () => {
    mainWindow.restore();
  });
});
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

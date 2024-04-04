import { ipcMain } from "electron";
import * as fs from "fs-extra";

export const GetSavedDatabaseIpc = () => {
  ipcMain.handle("main:get-saved-database", () => {
    try {
      const data = fs.readJSONSync("./database.json");
      return data.databases;
    } catch (error) {
      fs.writeJSONSync("./database.json", []);
      return [];
    }
  });
};
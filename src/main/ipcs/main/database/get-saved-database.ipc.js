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

export const Login = () => {
  ipcMain.handle("main:post-login", (_, { db, auth }) => {
    const data = fs.readJSONSync("./database.json");
    const user = data.users.filter(i => i._databases === db._id);
    let targetUser;
    for (let i = 0; i < user.length; i++) {
      if (user[i].username === auth.username) {
        targetUser = user[i]
        break
      }
    }
    if (targetUser === undefined) return "Login failed"
  });
};

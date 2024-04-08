import { ipcMain } from 'electron'
import * as fs from 'fs-extra'
import { handleDB, maskTypeGateway } from './handleDB'
import { createConnection } from 'mysql2/promise'
import DESImplementation from './DESImplementation'

export const GetSavedDatabaseIpc = () => {
  ipcMain.handle('main:get-saved-database', () => {
    try {
      return fs.readJSONSync('./database.json')
    } catch (error) {
      fs.writeJSONSync('./database.json', [])
      return []
    }
  })
}

export const AddDb = () => {
  ipcMain.handle('main:post-add-database', (_, info) => {
    const savedDB = fs.readJSONSync('./database.json')
    const savedUser = fs.readJSONSync('./users.json')
    savedDB.push({
      _id: savedDB.length + 1 + '',
      type: 'mysql',
      host: info.host,
      port: info.port,
      username: info.username,
      password: info.password,
      database: info.database,
      key: info.key,
      _users: [savedUser.length + '']
    })
    fs.writeJSONSync('./database.json', savedDB)
    savedUser.push({
      _id: savedUser.length + 1 + '',
      role: 'admin',
      username: info.admin,
      password: info.adminPass,
      _databases: savedDB.length - 1 + '',
      personal_permission: 'all'
    })
    fs.writeJSONSync('./users.json', savedUser)
  })
}

export const Login = () => {
  ipcMain.handle('main:post-login', async (_, { db, auth }) => {
    const user = fs.readJSONSync('./users.json').filter((i) => i._databases === db._id)
    let targetUser
    for (let i = 0; i < user.length; i++) {
      if (user[i].username === auth.username && user[i].password === auth.password) {
        targetUser = user[i]
        break
      }
    }
    if (targetUser === undefined) return 'Login failed'
    try {
      handleDB.config = {
        host: db.host,
        port: db.port,
        database: db.database,
        user: db.username,
        password: db.password
      }
      handleDB.connect = await createConnection(handleDB.config)
      const array = (
        await handleDB.connect.query(
          `SELECT TABLE_NAME, COLUMN_NAME
           FROM INFORMATION_SCHEMA.COLUMNS
           WHERE TABLE_SCHEMA = '${db.database}'`
        )
      )[0]
      let schema = array.reduce((acc, { TABLE_NAME, COLUMN_NAME }) => {
        if (!acc[TABLE_NAME]) {
          acc[TABLE_NAME] = []
        }
        acc[TABLE_NAME].push(COLUMN_NAME)
        return acc
      }, {})
      handleDB.connect.end()
      return {
        user: targetUser,
        database: {
          name: db.database,
          schema: schema
        }
      }
    } catch (error) {
      return '' + error.message
    }
  })
}

export const MaskColumn = () => {
  ipcMain.on('main:mask-column', async (_, name, display, dbId) => {
    // JSON handle
    let dbs = fs.readJSONSync('./database.json')
    let databaseInfo
    dbs.forEach((db) => {
      if (db._id === dbId) {
        databaseInfo = db
        let check = true
        db.schema = db.schema.map((col) => {
          if (col.name === name) {
            check = false
            return {
              ...col,
              display: display
            }
          }
          return col
        })
        if (check) db.schema.push({ name: name, display: display })
      }
    })
    fs.writeJSONSync('./database.json', dbs)

    // DB handle
    handleDB.connect = await createConnection(handleDB.config)
    const tableName = (
      await handleDB.connect.query(`SELECT TABLE_NAME
                                                     FROM INFORMATION_SCHEMA.COLUMNS
                                                     WHERE TABLE_SCHEMA = '${databaseInfo.database}'
                                                       AND COLUMN_NAME = '${name}'`)
    )[0][0].TABLE_NAME
    const rows = (
      await handleDB.connect.execute(`SELECT ${name}
                                                  FROM ${tableName}`)
    )[0]
    for (const row of rows) {
      await handleDB.connect.execute(`UPDATE ${tableName}
                                      SET ${name} = '${DESImplementation.des_encrypt(row[name], databaseInfo.key)}'
                                      WHERE ${name} = '${row[name]}'`)
    }
    handleDB.connect.end()
  })
}

export const RunQuery = () => {
  ipcMain.handle('main:post-run-query', async (_, query, user) => {
    try {
      handleDB.connect = await createConnection(handleDB.config)
      let result = await handleDB.connect.query(query)
      if (Array.isArray(result[0])) result[0] = JSON.parse(JSON.stringify(result[0]))
      if (result[1]) result[1] = result[1].map((i) => i.name)
      handleDB.connect.end()
      const db = fs.readJSONSync('./database.json').filter((k) => k._id === user._databases)[0]
      let group = { permission: [] }
      if (user._groups)
        group = fs.readJSONSync('./groups.json').filter((k) => k._id === user._groups)[0]
      let permission
      if (user.personal_permission === 'all' || group.permission === 'all') permission = 'all'
      else permission = new Set(user.personal_permission.concat(group.permission))
      if (isSubstringExist('select', query)) {
        db.schema.map((k) => {
          result[0] = result[0].map((i) => {
            if (i[k.name]) {
              return {
                ...i,
                [k.name]: DESImplementation.des_decrypt(i[k.name], db.key)
              }
            } else return i
          })
        })
        if (permission !== 'all' && !permission.has('read')) {
          db.schema.map((k) => {
            result[0] = result[0].map((i) => {
              return {
                ...i,
                [k.name]: maskTypeGateway(k.display, i[k.name])
              }
            })
          })
        }
      }
      return result
    } catch (error) {
      return [{ Error: '' + error.message }]
    }
  })
}

function isSubstringExist(substring, string) {
  return string.toLowerCase().includes(substring.toLowerCase())
}

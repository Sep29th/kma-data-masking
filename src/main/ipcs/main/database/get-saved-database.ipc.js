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
      fs.writeJSONSync('./users.json', [])
      fs.writeJSONSync('./groups.json', [])
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
      schema: [],
      _users: [savedUser.length + 1 + '']
    })
    fs.writeJSONSync('./database.json', savedDB)
    savedUser.push({
      _id: savedUser.length + 1 + '',
      role: 'admin',
      username: info.admin,
      password: info.adminPass,
      _databases: savedDB.length + '',
      personal_permission: 'all'
    })
    fs.writeJSONSync('./users.json', savedUser)
  })
}

export const CreateUser = () => {
  ipcMain.handle('main:create-user', async (_, user) => {
    const users = fs.readJSONSync('./users.json')
    user._id = users.length + 1 + ''
    users.push(user)
    fs.writeJSONSync('./users.json', users)
    let dbs = fs.readJSONSync('./database.json')
    dbs = dbs.map((db) => {
      if (db._id === user._databases) db._users.push(user._id)
      return db
    })
    fs.writeJSONSync('./database.json', dbs)
  })
}

export const CreateGroup = () => {
  ipcMain.handle('main:create-group', async (_, group) => {
    const groups = fs.readJSONSync('./groups.json')
    group._id = groups.length + 1 + ''
    groups.push(group)
    fs.writeJSONSync('./groups.json', groups)
    let dbs = fs.readJSONSync('./database.json')
    dbs = dbs.map((db) => {
      if (db._id === group._databases) {
        if (db._groups) {
          db._groups.push(group._id)
        } else {
          db._groups = []
          db._groups.push(group._id)
        }
      }
      return db
    })
    fs.writeJSONSync('./database.json', dbs)
  })
}

export const HandleManagerAuthorization = () => {
  ipcMain.handle('main:handle-manager-authorization', async (_, dbID) => {
    const groups = fs.readJSONSync('./groups.json').filter((gr) => gr._databases === dbID)
    const users = fs.readJSONSync('./users.json').filter((us) => us._databases === dbID)
    let tmp = {}
    tmp['Basic User'] = users
      .filter((us) => {
        if (us._groups || us.role === 'admin') return false
        return true
      })
      .map((us) => us.username)
    for (const group of groups) {
      tmp[group.name] = group._users.map(
        (userID) => users.filter((us) => us._id === userID)[0].username
      )
    }
    return tmp
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
    if (display !== 'unmask') {
      // JSON handle
      let dbs = fs.readJSONSync('./database.json')
      let databaseInfo
      let checkTmp = false
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
          if (check) {
            db.schema.push({ name: name, display: display })
            checkTmp = true
          }
        }
      })
      fs.writeJSONSync('./database.json', dbs)

      // DB handle
      if (checkTmp) {
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
      }
    } else {
      // JSON handle
      let dbs = fs.readJSONSync('./database.json')
      let databaseInfo
      let checkTmp = false
      dbs.forEach((db) => {
        if (db._id === dbId) {
          databaseInfo = db
          db.schema = db.schema.filter((col) => {
            if (col.name === name) checkTmp = true
            return col.name !== name
          })
        }
      })
      fs.writeJSONSync('./database.json', dbs)

      // DB handle
      if (checkTmp) {
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
                                          SET ${name} = '${DESImplementation.des_decrypt(row[name], databaseInfo.key).trimEnd()}'
                                          WHERE ${name} = '${row[name]}'`)
        }
        handleDB.connect.end()
      }
    }
  })
}

export const RunQuery = () => {
  ipcMain.handle('main:post-run-query', async (_, query, user) => {
    try {
      query = removeExtraSpaces(query).toLowerCase()
      handleDB.connect = await createConnection(handleDB.config)
      const db = fs.readJSONSync('./database.json').filter((k) => k._id === user._databases)[0]
      let group = { permission: [] }
      if (user._groups)
        group = fs.readJSONSync('./groups.json').filter((k) => k._id === user._groups)[0]
      let permission
      if (user.personal_permission === 'all' || group.permission === 'all') permission = 'all'
      else permission = new Set(user.personal_permission.concat(group.permission))
      let result
      if (isSubstringExist('select', query)) {
        result = await handleDB.connect.query(query)
        if (Array.isArray(result[0])) result[0] = JSON.parse(JSON.stringify(result[0]))
        if (result[1]) result[1] = result[1].map((i) => i.name)
        db.schema.map((k) => {
          result[0] = result[0].map((i) => {
            if (i[k.name]) {
              return {
                ...i,
                [k.name]: DESImplementation.des_decrypt(i[k.name], db.key).trimEnd()
              }
            } else return i
          })
        })
        if (permission !== 'all' && !permission.has('read')) {
          db.schema.map((k) => {
            result[0] = result[0].map((i) => {
              console.log(k.display, i[k.name])
              if (i[k.name]) {
                return {
                  ...i,
                  [k.name]: maskTypeGateway(k.display, i[k.name])
                }
              } else return i
            })
          })
        }
      } else if (
        isSubstringExist('create', query) ||
        isSubstringExist('insert', query) ||
        isSubstringExist('add', query)
      ) {
        if (permission !== 'all' && !permission.has('create')) {
          return [{ Authorization: 'Permission denied !' }]
        } else {
          if (isSubstringExist('insert', query)) {
            let element = query.split(' ')
            let tableName = addDelimiterIfNeeded(element[element.indexOf('into') + 1], `\``)
            let allColName = (
              await handleDB.connect.execute(`select *
                                                              from ${tableName} limit 1`)
            )[1].map((i) => i.name)
            let set1 = new Set(allColName)
            let setResult = new Set(allColName)
            for (const a of db.schema.map((i) => i.name)) {
              set1.delete(a)
            }
            for (const b of set1) {
              setResult.delete(b)
            }
            for (const name of setResult) {
              const rows = (
                await handleDB.connect.execute(`SELECT ${name}
                                                FROM ${tableName}`)
              )[0]
              for (const row of rows) {
                await handleDB.connect.execute(`UPDATE ${tableName}
                                                SET ${name} = '${DESImplementation.des_decrypt(row[name], db.key).trimEnd()}'
                                                WHERE ${name} = '${row[name]}'`)
              }
            }
            try {
              const tmp = await handleDB.connect.execute(query)
              for (const name of setResult) {
                const rows = (
                  await handleDB.connect.execute(`SELECT ${name}
                                                  FROM ${tableName}`)
                )[0]
                for (const row of rows) {
                  await handleDB.connect.execute(`UPDATE ${tableName}
                                                  SET ${name} = '${DESImplementation.des_encrypt(row[name], db.key)}'
                                                  WHERE ${name} = '${row[name]}'`)
                }
              }
              handleDB.connect.end()
              return tmp
            } catch (error) {
              for (const name of setResult) {
                const rows = (
                  await handleDB.connect.execute(`SELECT ${name}
                                                  FROM ${tableName}`)
                )[0]
                for (const row of rows) {
                  await handleDB.connect.execute(`UPDATE ${tableName}
                                                  SET ${name} = '${DESImplementation.des_encrypt(row[name], db.key)}'
                                                  WHERE ${name} = '${row[name]}'`)
                }
              }
              handleDB.connect.end()
              return [{ Error: '' + error.message }]
            }
          } else {
            throw new Error('Syntax error')
          }
        }
      } else if (
        isSubstringExist('update', query) ||
        isSubstringExist('modify', query) ||
        isSubstringExist('alter', query) ||
        isSubstringExist('grant', query) ||
        isSubstringExist('revoke', query) ||
        isSubstringExist('replace', query)
      ) {
        if (permission !== 'all' && !permission.has('update')) {
          return [{ Authorization: 'Permission denied !' }]
        } else {
        }
      } else if (
        isSubstringExist('drop', query) ||
        isSubstringExist('truncate', query) ||
        isSubstringExist('delete', query)
      ) {
        if (permission !== 'all' && !permission.has('delete')) {
          return [{ Authorization: 'Permission denied !' }]
        } else {
          return await handleDB.connect.execute(query)
        }
      }
      handleDB.connect.end()
      return result
    } catch (error) {
      handleDB.connect.end()
      return [{ Error: '' + error.message }]
    }
  })
}

function isSubstringExist(substring, string) {
  return string.includes(substring.toLowerCase())
}

function addDelimiterIfNeeded(str, delimiter) {
  if (!str.startsWith(delimiter)) {
    str = delimiter + str
  }
  if (!str.endsWith(delimiter)) {
    str = str + delimiter
  }
  return str
}

function removeExtraSpaces(str) {
  return str.replace(/\s+/g, ' ').trim()
}

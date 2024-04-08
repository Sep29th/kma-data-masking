import { combineReducers } from 'redux'
import { handleSwitchThemeMode } from './switch-theme-mode'
import { handleUpdateCurrentDatabase } from './update-current-database'
import { handleUpdateCurrentUser } from './update-current-user'
import { handleApplyResultQuery } from './result-query'

export const allReducer = combineReducers({
  switchThemeMode: handleSwitchThemeMode,
  updateCurrentDatabase: handleUpdateCurrentDatabase,
  updateCurrentUser: handleUpdateCurrentUser,
  queryResult: handleApplyResultQuery
})

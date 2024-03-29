import { combineReducers } from 'redux'
import { handleSwitchThemeMode } from './switch-theme-mode'

export const allReducer = combineReducers({
  switchThemeMode: handleSwitchThemeMode
})

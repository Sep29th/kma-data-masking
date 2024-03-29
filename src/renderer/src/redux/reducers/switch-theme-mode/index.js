export const handleSwitchThemeMode = (state = false, actions) => {
  switch (actions.type) {
    case 'SWITCH_THEME_MODE':
      return actions.mode
    default:
      return state
  }
}

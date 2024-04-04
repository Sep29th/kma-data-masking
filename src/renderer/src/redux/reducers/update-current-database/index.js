export const handleUpdateCurrentDatabase = (state = null, actions) => {
  switch (actions.type) {
    case 'UPDATE_CURRENT_DATABASE':
      return actions.database
    default:
      return state
  }
}

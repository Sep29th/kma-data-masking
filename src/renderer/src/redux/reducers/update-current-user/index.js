export const handleUpdateCurrentUser = (state = null, actions) => {
  switch (actions.type) {
    case 'UPDATE_CURRENT_USER':
      return actions.user
    default:
      return state
  }
}

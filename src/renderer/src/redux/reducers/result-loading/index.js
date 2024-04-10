export const handleResultLoading = (state = false, actions) => {
  switch (actions.type) {
    case 'RESULT_LOADING':
      return actions.value
    default:
      return state
  }
}

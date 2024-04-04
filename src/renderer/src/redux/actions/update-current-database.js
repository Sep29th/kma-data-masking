export const updateCurrentDatabase = (database) => {
  return {
    type: 'UPDATE_CURRENT_DATABASE',
    database: database
  }
}

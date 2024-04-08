export const applyResult = (result) => {
  return {
    type: 'APPLY_RESULT_QUERY',
    result: {
      tab: Array.isArray(result[0]) ? '2' : '1',
      result: result
    }
  }
}

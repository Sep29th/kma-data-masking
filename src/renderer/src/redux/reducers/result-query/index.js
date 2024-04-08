export const handleApplyResultQuery = (
  state = { activeTab: '1', tabOneContent: [], tabTwoContent: {} },
  actions
) => {
  switch (actions.type) {
    case 'APPLY_RESULT_QUERY':
      if (actions.result.tab === '1') {
        let keys = Object.keys(actions.result.result[0])
        let values = Object.values(actions.result.result[0])
        state.tabOneContent.push(keys.map((key, ind) => `${key}: ${values[ind]}`).join('; '))
        return {
          ...state,
          activeTab: actions.result.tab
        }
      } else {
        return {
          ...state,
          activeTab: actions.result.tab,
          tabTwoContent: {
            columns: actions.result.result[1].map((i) => {
              return {
                title: i,
                key: i,
                dataIndex: i
              }
            }),
            dataSource: actions.result.result[0].map((i) => {
              return {
                key: i.id,
                ...i
              }
            })
          }
        }
      }
    default:
      return state
  }
}


const filterReducer = (state='ALL', action) => {
  console.log('ACTION (filter): ', action)
  switch (action.type) {
    case 'SET_FILTER':
      return action.payload
    default:
      return state
  }
}

export const filterChange = filter => ({
  type: 'SET_FILTER', 
  payload: filter
})

export default filterReducer
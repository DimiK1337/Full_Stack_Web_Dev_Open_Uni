import { createSlice } from '@reduxjs/toolkit'

const initialState = { message: null, type: null }
const notificationSlice = createSlice({
  name: 'notification',
  initialState,
  reducers: {
    createNotification(state, action) {
      return action.payload
    },
    removeNotification(state, action) {
      return initialState
    },
  },
})

export const { createNotification, removeNotification } = notificationSlice.actions
export default notificationSlice.reducer

export const showAndHideNotification = (message, type='success', time = 5) => {
  return (dispatch) => {
    dispatch(createNotification({ message, type }))
    setTimeout(() => {
      dispatch(removeNotification())
    }, time * 1000)
  }
}

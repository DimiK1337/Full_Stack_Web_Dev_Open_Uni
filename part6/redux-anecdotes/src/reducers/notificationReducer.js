import { createSlice } from "@reduxjs/toolkit";

const initialState = ''
const notificationSlice = createSlice({
  name: 'notification',
  initialState,
  reducers: {
    createNotification(state, action) {
      return action.payload
    },
    removeNotification(state, action) {
      return ''
    }
  }
})

export const { createNotification, removeNotification } = notificationSlice.actions
export default notificationSlice.reducer

export const showAndHideNotification = (message, time=5) => {
    return (dispatch) => {
      dispatch(createNotification(message))
      setTimeout(() => {
        dispatch(removeNotification())
      }, time*1000)
    }
}
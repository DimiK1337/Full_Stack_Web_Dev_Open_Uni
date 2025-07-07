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

export const showAndHideNotification = (message) => {
    return (dispatch) => {
      let timeoutID = null

      if (timeoutID) clearTimeout(timeoutID)

      dispatch(createNotification(message))

      timeoutID = setTimeout(() => {
        dispatch(removeNotification())
      }, 5000)
    }
}

export const { createNotification, removeNotification } = notificationSlice.actions
export default notificationSlice.reducer
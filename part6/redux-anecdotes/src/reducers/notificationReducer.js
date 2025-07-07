import { createSlice } from "@reduxjs/toolkit";

const initialState = 'render here notification...'
const notificationSlice = createSlice({
  name: 'notification',
  initialState,

  reducers: {
    createNotification(state, action) {
      console.log('action in create notif', action)
      return action.payload
    }
  }

})

export const { createNotification } = notificationSlice.actions
export default notificationSlice.reducer
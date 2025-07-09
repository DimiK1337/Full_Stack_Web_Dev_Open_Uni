import { createContext, useReducer, useContext } from 'react'

const notificationReducer = (state, action) => {
  console.log('in notif red, action=', action, 'state=', state)

  switch (action.type) {
    case 'SET_NOTIFICATION': return action.payload
    case 'REMOVE_NOTIFICATION': return ''
    default: return ''
  }
}

const NotificationContext = createContext()

export const NotificationContextProvider = (props) => {
  const [notification, notificationDispatch] = useReducer(notificationReducer, '')

  return (
    <NotificationContext.Provider value={[notification, notificationDispatch]}>
      {props.children}
    </NotificationContext.Provider>
  )
}

export const useNotificationValue = () => {
  const [notification, ] = useContext(NotificationContext)
  return notification
}

export const useNotificationDispatch = () => {
  const [, notificationDispatch] = useContext(NotificationContext)
  return notificationDispatch
}

export default NotificationContext
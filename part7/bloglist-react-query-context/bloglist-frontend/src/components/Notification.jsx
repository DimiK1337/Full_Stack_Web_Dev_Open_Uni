import { useNotificationValue } from '../NotificationContext'

const Notification = () => {
  const { message, type } = useNotificationValue()
  if (!message || !type) return null
  return <div className={type !== 'error' ? 'success' : 'error'}>{message}</div>
}

export default Notification

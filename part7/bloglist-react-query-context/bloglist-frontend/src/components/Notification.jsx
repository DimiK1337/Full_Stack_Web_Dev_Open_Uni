import { Alert } from 'react-bootstrap'
import { useNotificationValue } from '../NotificationContext'

const Notification = () => {
  const { message, type } = useNotificationValue()
  if (!message || !type) return null
  const variant = type !== 'error' ? 'success' : 'error'
  return (
    <Alert className={variant} variant={variant}>
      {message}
    </Alert>
  )
}

export default Notification

import { useSelector } from 'react-redux'
import { Alert } from 'react-bootstrap'

const Notification = () => {
  const { message, type } = useSelector(state => state.notification)
  if (!message || !type) return null

  const variant = type !== 'error' ? 'success' : 'error'
  return (
    <Alert className={variant} variant={variant}>
      {message}
    </Alert>
  )
}

export default Notification

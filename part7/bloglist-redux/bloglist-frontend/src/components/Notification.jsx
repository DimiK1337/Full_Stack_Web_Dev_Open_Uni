import { useSelector } from 'react-redux'

const Notification = () => {
  const { message, type } = useSelector(state => state.notification)
  if (!message || !type) return null
  return <div className={type !== 'error' ? 'success' : 'error'}>{message}</div>
}

export default Notification

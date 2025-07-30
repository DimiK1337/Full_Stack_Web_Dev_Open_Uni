interface NotificationProps {
  message: string
};

const Notification = ({ message }: NotificationProps) => {
  return <p style={{ color: 'red' }}>{message}</p>
};

export default Notification;
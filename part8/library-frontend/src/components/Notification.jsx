const Notification = ({ errorMessage }) => {
  if (!errorMessage) return null

  const style = { color: 'red' }
  return (
    <div style={style}>
      {errorMessage}
    </div>
  )
}

export default Notification
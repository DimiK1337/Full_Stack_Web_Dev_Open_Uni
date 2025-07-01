const Notification = ({ messageObj }) => {
    if (messageObj === null) {
        return null
    }
    
    const { message, type } = messageObj
    return (
        <div className={type !== 'error' ? 'success' : 'error'}>
            {message}
        </div>
    )
}

export default Notification
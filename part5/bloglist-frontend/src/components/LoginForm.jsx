
const LoginForm = ({ username, password, setUsername, setPassword, handleLogin }) => {
  return (
    <form onSubmit={handleLogin}>
      <div>
        Username:
        <input
          type="text"
          name="Username"
          value={username}
          onChange={({ target }) => setUsername(target.value)} />
      </div>
      <div>
        Password:
        <input
          type="text"
          name="Password"
          value={password}
          onChange={({ target }) => setPassword(target.value)} />
      </div>
      <button type="submit">login</button>
    </form>
  )
}

export default LoginForm
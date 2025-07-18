import { useState, useEffect } from 'react'
import { useMutation } from '@apollo/client'
import { LOGIN } from '../queries'

const LoginForm = ({ show, setPage, setToken, setErrorMessage }) => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const [login, result] = useMutation(LOGIN, {
    onError: (error) => {
      setErrorMessage(error.graphQLErrors[0].message)
    }
  })

  
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    if (!result.data) return
    const token = result.data.login.value
    setToken(token)
    localStorage.setItem('library-user-token', token)
  }, [result.data])

  if (!show) return null

  const submit = async (event) => {
    event.preventDefault()

    login({ variables: { username, password } })
    setPage('authors')
  }

  return (
    <div>
      <form onSubmit={submit}>
        <div>
          username <input
            value={username}
            onChange={({ target }) => setUsername(target.value)}
          />
        </div>
        <div>
          password <input
            type='password'
            value={password}
            onChange={({ target }) => setPassword(target.value)}
          />
        </div>
        <button type='submit'>login</button>
      </form>
    </div>
  )
}

export default LoginForm
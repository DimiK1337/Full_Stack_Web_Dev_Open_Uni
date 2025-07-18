import { useState } from 'react'
import { useQuery, useApolloClient } from '@apollo/client'

import { ALL_PERSONS } from './queries'

// Components
import Notification from './components/Notification'
import LoginForm from './components/LoginForm'
import Persons from './components/Persons'
import PersonForm from './components/PersonForm'
import PhoneForm from './components/PhoneForm'


const App = () => {
  const [token, setToken] = useState(null)
  const [errorMessage, setErrorMessage] = useState(null)
  const result = useQuery(ALL_PERSONS)
  const client = useApolloClient()

  if (result.loading) return <div>Loading ...</div>

  const logout = () => {
    setToken(null)
    localStorage.removeItem('phonenumbers-user-token')
    client.resetStore()
  }

  const notification = (message) => {
    setErrorMessage(message)
    setTimeout(() => {
      setErrorMessage(null)
    }, 10000)
  }

  if (!token) {
    return (
      <>
        <Notification errorMessage={errorMessage}/>
        <h2>Login</h2>
        <LoginForm
          setToken={setToken}
          setErrorMessage={notification}
        />
      </>
    )
  }

  return (
    <div>
      <Notification errorMessage={errorMessage} />
      <button onClick={logout}>logout</button>
      <Persons persons={result.data.allPersons} />
      <PersonForm setError={notification} />
      <PhoneForm setError={notification} />
    </div>
  )
}

export default App
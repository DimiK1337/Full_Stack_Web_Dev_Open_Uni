import { useState } from 'react'
import { useQuery, useApolloClient, useSubscription } from '@apollo/client'

import {
  ALL_PERSONS,
  PERSON_ADDED
} from './queries'

// Components
import Notification from './components/Notification'
import LoginForm from './components/LoginForm'
import Persons from './components/Persons'
import PersonForm from './components/PersonForm'
import PhoneForm from './components/PhoneForm'


export const updateCache = (cache, query, addedPerson) => {
  // Helper that removes duplicate entries from person list
  const uniqByName = (allPersons) => {
    const seen = new Set()
    return allPersons.filter(p => seen.has(p.name) ? false : seen.add(p.name))
  }

  cache.updateQuery(query, ({ allPersons }) => {
    return {
      allPersons: uniqByName(allPersons.concat(addedPerson))
    }
  })
}

const App = () => {
  const [token, setToken] = useState(null)
  const [errorMessage, setErrorMessage] = useState(null)
  const result = useQuery(ALL_PERSONS)
  const client = useApolloClient()

  useSubscription(PERSON_ADDED, {
    onData: ({ data, client }) => {
      const addedPerson = data.data.personAdded
      notification(`${addedPerson.name} was added`)
      updateCache(client.cache, { query: ALL_PERSONS }, addedPerson)
    }
  })

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
        <Notification errorMessage={errorMessage} />
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
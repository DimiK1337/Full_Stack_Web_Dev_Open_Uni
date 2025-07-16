import { useState } from 'react'
import { useQuery } from '@apollo/client'

import { ALL_PERSONS } from './queries'

// Components
import Persons from './components/Persons'
import PersonForm from './components/PersonForm'
import PhoneForm from './components/PhoneForm'



const Notification = ({ errorMessage }) => {
  if (!errorMessage) return null

  const style = { color: 'red' }
  return (
    <div style={style}>
      {errorMessage}
    </div>
  )
}

const App = () => {
  const [errorMessage, setErrorMessage] = useState(null)
  const result = useQuery(ALL_PERSONS)

  if (result.loading) return <div>Loading ...</div>

  const notification = (message) => {
    setErrorMessage(message)
    setTimeout(() => {
      setErrorMessage(null)
    }, 10000)
  }

  return (
    <div>
      <Notification errorMessage={errorMessage} />
      <Persons persons={result.data.allPersons} />
      <PersonForm setError={notification} />
      <PhoneForm setError={notification} />
    </div>
  )
}

export default App
import { useState } from 'react'
import { useMutation } from '@apollo/client'

import { 
  CREATE_PERSON, 
  ALL_PERSONS 
} from '../queries'

import { updateCache } from '../App'

const PersonForm = ({ setError }) => {
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [street, setStreet] = useState('')
  const [city, setCity] = useState('')

  const [createPerson] = useMutation(CREATE_PERSON, {
    // Not good for performance, sends too many requests
    //refetchQueries: [{ query: ALL_PERSONS }],
    onError: (error) => {
      const messages = error.graphQLErrors.map(e => e.message).join('\n')
      setError(messages)
    },
    update: (cache, response) => {

      // 1st param — Update the cached result of the ALL_PERSONS query
      // 2nd param — Contains the current cache of the specified query in the 1st param (The previous result of calling the ALL_PERSONS query)
      /* cache.updateQuery({ query: ALL_PERSONS}, ({ allPersons }) => {
        return {
          allPersons: allPersons.concat(response.data.addPerson)
        }
      }) */
      updateCache(cache, { query: ALL_PERSONS }, response.data.addPerson)
    },
  })

  const submit = (event) => {
    event.preventDefault()

    createPerson({ variables: { 
      name, street, city,
      phone: phone.length > 0 ? phone : undefined
    } })
    setName('')
    setPhone('')
    setCity('')
    setStreet('')
  }

  return (
    <div>
      <h2>create new</h2>
      <form onSubmit={submit}>
        <div>
          name <input value={name}
            onChange={({ target }) => setName(target.value)}
          />
        </div>
        <div>
          phone <input value={phone}
            onChange={({ target }) => setPhone(target.value)}
          />
        </div>
        <div>
          street <input value={street}
            onChange={({ target }) => setStreet(target.value)}
          />
        </div>
        <div>
          city <input value={city}
            onChange={({ target }) => setCity(target.value)}
          />
        </div>
        <button type='submit'>add!</button>
      </form>
    </div>
  )
}

export default PersonForm


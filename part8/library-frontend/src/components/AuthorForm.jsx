import { useState, useContext } from 'react'
import Select from 'react-select'
import { useMutation } from '@apollo/client'

import { ALL_AUTHORS, EDIT_AUTHOR } from '../queries'

import ErrorContext from '../ErrorContext'

const AuthorForm = ({ authors }) => {
  const [selectedAuthorOption, setSelectedAuthorOption] = useState(null)
  const [born, setBorn] = useState('')

  const [, setErrorMessage] = useContext(ErrorContext)
  const [changeBorn] = useMutation(EDIT_AUTHOR, {
    refetchQueries: [{ query: ALL_AUTHORS }],
    onError: (error) => {
      setErrorMessage(error.message)
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
    }
  })

  const submit = (event) => {
    event.preventDefault()

    changeBorn({ variables: { name: selectedAuthorOption.value, setBornTo: Number(born) } })
    setSelectedAuthorOption(null)
    setBorn('')
  }

  const authorOptions = authors.map(a => ({ value: a.name, label: a.name }))
  return (
    <div>
      <h2>set birthyear</h2>
      <form onSubmit={submit}>
        <Select
          defaultValue={selectedAuthorOption}
          onChange={setSelectedAuthorOption}
          options={authorOptions}
        />
        <div>
          born:
          <input
            type='text'
            value={born}
            onChange={({ target }) => setBorn(target.value)}
          />
        </div>
        <button type="submit">
          update author
        </button>
      </form>
    </div>
  )

}

export default AuthorForm
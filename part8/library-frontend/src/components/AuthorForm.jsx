import { useState } from 'react'
import Select from 'react-select'
import { useMutation } from '@apollo/client'

import { ALL_AUTHORS, EDIT_AUTHOR } from '../queries'

const AuthorForm = ({ authors }) => {
  const [selectedAuthorOption, setSelectedAuthorOption] = useState(null)
  const [born, setBorn] = useState('')

  const [changeBorn] = useMutation(EDIT_AUTHOR, {
    refetchQueries: [{ query: ALL_AUTHORS }]
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
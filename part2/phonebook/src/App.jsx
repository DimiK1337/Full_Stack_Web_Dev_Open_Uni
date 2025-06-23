import { useState, useEffect } from 'react'

import axios from 'axios'

import Filter from './components/Filter'
import PersonForm from './components/PersonForm'
import Persons from './components/Persons'


const App = () => {
  const [persons, setPersons] = useState([])
  const [filterQuery, setFilterQuery] = useState('')
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')

  const hook = () => {
    axios
      .get("http://localhost:3001/persons")
      .then((res) => {
        console.log("res successful")
        setPersons(res.data)
      })
  }
  useEffect(hook, [])

  const addName = (event) => {
    event.preventDefault()
    for (const person of persons) {
      if (person.name === newName) {
        alert(`${newName} is already added to phonebook`)
        return
      }
    }
    setPersons(persons.concat({ name: newName, number: newNumber }))
    setNewName('')
    setNewNumber('')
  }

  const handleFilterQueryChange = (event) => setFilterQuery(event.target.value)
  const handleNameChange = (event) => setNewName(event.target.value)
  const handleNumberChange = (event) => setNewNumber(event.target.value)



  const personFormProps = {
    addName,
    newName,
    handleNameChange,
    newNumber,
    handleNumberChange
  }

  return (
    <div>
      <h2>Phonebook</h2>
      <Filter value={filterQuery} onChange={handleFilterQueryChange} />

      <h2>Add a new</h2>
      <PersonForm {...personFormProps} />

      <h2>Numbers</h2>
      <Persons persons={persons} filterQuery={filterQuery} />
    </div>
  )
}

export default App
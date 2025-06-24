import { useState, useEffect } from 'react'

import personService from "./services/persons"

import Filter from './components/Filter'
import PersonForm from './components/PersonForm'
import Persons from './components/Persons'


const App = () => {
  const [persons, setPersons] = useState([])
  const [filterQuery, setFilterQuery] = useState('')
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')

  const hook = () => {
    personService
      .getAll()
      .then(initialPersons => setPersons(initialPersons))
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

    const newPerson = { name: newName, number: newNumber }

    personService
      .create(newPerson)
      .then(returnedPerson => {
        setPersons(persons.concat(returnedPerson))
        setNewName('')
        setNewNumber('')
      })
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
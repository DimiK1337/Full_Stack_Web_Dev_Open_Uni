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
      .getAllPersons()
      .then(initialPersons => setPersons(initialPersons))
  }
  useEffect(hook, [])

  const addName = (event) => {
    event.preventDefault()

    const newPerson = { name: newName, number: newNumber }

    // Update the phone number if the person is already in the phonebook
    const existingPerson = persons.find(person => person.name === newName)
    if (existingPerson) {
      const shouldUpdateNumber = window.confirm(`${newName} is already added to phonebook, replace the old number with a new one?`)
      if (!shouldUpdateNumber) return

      personService
        .updatePerson(existingPerson.id, newPerson)
        .then(
          returnedPerson => setPersons(
            persons.map(person => person.id === returnedPerson.id ? returnedPerson : person)
          )
        )
      return
    }

    personService
      .createPerson(newPerson)
      .then(returnedPerson => {
        setPersons(persons.concat(returnedPerson))
        setNewName('')
        setNewNumber('')
      })
  }

  const deleteName = (event) => {
    const personToDelete = persons.find(person => person.id === event.target.value)
    const shouldDeletePerson = window.confirm(`Delete '${personToDelete.name}'?`)

    if (!shouldDeletePerson) return

    personService
      .deletePerson(personToDelete.id)

    personService
      .getAllPersons()
      .then(
        returnedPersons => setPersons(
          returnedPersons.filter(person => person.id !== personToDelete.id)
        )
      )
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
      <Persons persons={persons} filterQuery={filterQuery} onDelete={deleteName} />
    </div>
  )
}

export default App
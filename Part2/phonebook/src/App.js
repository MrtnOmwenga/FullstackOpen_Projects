import React from 'react'
import { useState, useEffect } from 'react'
import phonebook from './services/phonebook'
import './index.css'

const PersonForm = ({onSubmit, nameValue, nameChange, numberValue, numberChange }) => {
  return (
    <div>
        <h2>Add new number</h2>
        <form onSubmit={onSubmit}>
          <div>
            Name: <input value={nameValue} onChange={nameChange}/>
          </div>
          <div>
            Number: <input value={numberValue} onChange={numberChange}/>
          </div>
          <div>
            <button type="submit">Add</button>
          </div>
        </form>
      </div>
  )
}

const Filter = ({value, onChange}) => {
  return (
    <div>
      <p>Filter shown with: </p>
      <input value={value} onChange={onChange}/>
    </div>
  )
}

const Persons = ({personsToDisplay, onClick}) => {
  return (
    <div key="Persons">
      {personsToDisplay.map((person) => {
        return (
            <p key={person.id}>{person.name} {person.number} &ensp;
            <button onClick={() => onClick(person.id)}>Delete</button></p>
        )
      })}
    </div>
  )
}

const ErrorNotification = ({ message }) => {
  if (message === null) {
    return null
  }

  return (
    <div className='error'>
      {message}
    </div>
  )
}

const SuccessNotification = ({ message }) => {
  if (message === null) {
    return null
  }

  return (
    <div className='success'>
      {message}
    </div>
  )
}

const App = () => {
  // States
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newPhoneNumber, setNewPhoneNumber] = useState('36-44-1231234')
  const [searchFilter, setSearchFilter] =useState('')
  const [errorMessage, setErrorMessage] = useState(null)
  const [successMessage, setSuccessMessage] = useState(null)

  // Populate persons
  useEffect(() => {
    phonebook.getAll().then(response => setPersons(response))
  }, [])

  // Handle Submitting form
  const handleSubmit = (event) => {
    event.preventDefault()
    const exists = persons.find((person) => person.name === newName)
    if (exists !== undefined)
    {
      if (exists.number === newPhoneNumber) {
        alert(newName + " is already added to phonebook")
      } else {
        if (window.confirm(`${newName} is already added to phonebook; replace old number with new one?`)) {
          phonebook.updatePhonebook(exists.id, {...exists, number: newPhoneNumber}).then(response => {
            setPersons(persons.map(person => person.id !== exists.id ? person : response))
          }).catch(error => {
            setErrorMessage(`Information of ${exists.name} has alredy been removed from server`)
            setTimeout(() => {
              setErrorMessage(null)
            }, 5000)
          })
        }
      }
    } else {
      const newObject = {
        name: newName,
        number: newPhoneNumber,
        id: persons.length + 1
      }
  
      phonebook.addPerson(newObject).then(response => {
        setPersons(persons.concat(response))
        setSuccessMessage(`Added ${response.name}`)
        setTimeout(() => {
          setSuccessMessage(null)
        }, 5000)
        setNewName('')
      })
    }

  }

  // Handle name input
  const handleName = (event) => {
    setNewName(event.target.value)
  }

  // Handle phone number input
  const handlePhoneNumber = (event) => {
    setNewPhoneNumber(event.target.value)
  }

  // Handle search filter
  const handleSearchFilter =(event) => {
    setSearchFilter(event.target.value)
  }

  //Delete person from phonebook
  const deletePerson = (id) => {
    const person = persons.filter(person => person.id === id)
    person.map(person => {
      if (window.confirm(`Delete ${person.name} ?`)) {
        phonebook.deletePerson(id)
        const newObject = persons.filter(person => person.id !== id)
        setPersons(newObject)
      }
    })
  }

  const filteredData = persons.filter((person) => person.name.toLowerCase() === searchFilter.toLowerCase())
  const personsToDisplay = filteredData.length === 0 ? persons : filteredData

  return (
    <div>
      <h2>Phonebook</h2>
      <ErrorNotification message={errorMessage}/>
      <SuccessNotification message={successMessage}/>
      <Filter value={searchFilter} onChange={handleSearchFilter}/>
      <PersonForm onSubmit={handleSubmit} nameValue={newName} nameChange={handleName} numberValue={newPhoneNumber} numberChange={handlePhoneNumber}/>
      <h2>Numbers</h2>
      <Persons personsToDisplay={personsToDisplay} onClick={deletePerson}/>
    </div>
  )
}

export default App
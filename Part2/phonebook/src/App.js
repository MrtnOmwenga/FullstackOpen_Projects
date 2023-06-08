import { useState } from 'react'

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
            <button type="submit">add</button>
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

const Persons = ({personsToDisplay}) => personsToDisplay.map((person) => <p key={person.id}>{person.name} {person.number}</p>)

const App = () => {
  // States
  const [persons, setPersons] = useState([
    { name: 'Arto Hellas', number: '57-99-1231234', id: 1},
    { name: 'Ada Lovelace', number: '39-44-5323523', id: 2 },
    { name: 'Dan Abramov', number: '12-43-234345', id: 3 },
    { name: 'Mary Poppendieck', number: '39-23-6423122', id: 4 }
  ])
  const [newName, setNewName] = useState('')
  const [newPhoneNumber, setNewPhoneNumber] = useState('36-44-1231234')
  const [searchFilter, setSearchFilter] =useState('')

  // Handle Submitting form
  const handleSubmit = (event) => {
    event.preventDefault()
    const exists = persons.find((person) => person.name === newName)
    if (exists !== undefined)
    {
      alert(newName + " is already added to phonebook")
    } else {
      const newObject = {
        name: newName,
        number: newPhoneNumber,
        id: persons.length + 1
      }
  
      setPersons(persons.concat(newObject))
      setNewName('')
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
    setSearchFilter(event.target.value.toLowerCase())
  }

  const filteredData = persons.filter((person) => person.name.toLowerCase() === searchFilter)
  const personsToDisplay = filteredData.length === 0 ? persons : filteredData

  return (
    <div>
      <h2>Phonebook</h2>
      <Filter value={searchFilter} onChange={handleSearchFilter}/>
      <PersonForm onSubmit={handleSubmit} nameValue={newName} nameChange={handleName} numberValue={newPhoneNumber} numberChange={handlePhoneNumber}/>
      <h2>Numbers</h2>
      <Persons personsToDisplay={personsToDisplay}/>
    </div>
  )
}

export default App
import axios from 'axios'
const baseUrl = 'http://localhost:3001/persons'

const getAll = () => {
    const response = axios.get(baseUrl)
    return response.then(response => response.data)
}

const addPerson = (newObject) => {
    const response = axios.post(baseUrl, newObject)
    return response.then(response => response.data)
}

const deletePerson = (id) => {
    axios.delete(`${baseUrl}/${id}`)
}

export default {getAll, addPerson, deletePerson}
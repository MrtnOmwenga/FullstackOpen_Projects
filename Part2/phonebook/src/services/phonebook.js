import axios from 'axios'
const baseUrl = '/api/persons'

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

const updatePhonebook = (id, newObject) => {
    const response = axios.put(`${baseUrl}/${id}`, newObject)
    return response.then(response => response.data)
}

export default {getAll, addPerson, deletePerson, updatePhonebook}
import axios from 'axios'
const baseUrl = '/api/blogs'

let token = null

const SetToken = newToken => {
  token = `Bearer ${newToken}`
}

const GetAll = () => {
  const request = axios.get(baseUrl)
  return request.then(response => response.data)
}

const CreateBlog = (NewBlog) => {
  const config = {
    headers: { Authorization: token },
  }

  const request = axios.post(baseUrl, NewBlog, config)
  return request.then(response => response.data)
}

// eslint-disable-next-line import/no-anonymous-default-export
export default { GetAll, CreateBlog, SetToken }
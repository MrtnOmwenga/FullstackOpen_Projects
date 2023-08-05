import axios from 'axios';
const baseUrl = '/api/blogs';

let token = null;

const SetToken = newToken => {
  token = `Bearer ${newToken}`;
};

const GetAll = () => {
  const request = axios.get(baseUrl);
  return request.then(response => response.data);
};

const CreateBlog = (NewBlog) => {
  const config = {
    headers: { Authorization: token },
  };

  const request = axios.post(baseUrl, NewBlog, config);
  return request.then(response => response.data);
};

const UpdateBlog = (id, NewObject) => {
  const request = axios.put(`${baseUrl}/${id}`, NewObject);
  return request.then(response => response.data);
};

const DeleteBlog = (id) => {
  const config = {
    headers: { Authorization: token },
  };

  const request = axios.delete(`${baseUrl}/${id}`, config);
  return request.then(response => response.data);
};

export default { GetAll, CreateBlog, SetToken, UpdateBlog, DeleteBlog };
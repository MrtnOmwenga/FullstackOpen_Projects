import React, { useState } from 'react';

const BlogForm = ({addBlog}) => {
  const [newTitle, setNewTitle] = useState('');
  const [newURL, setNewURL] = useState('');
  const [newAuthor, setNewAuthor] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();

    addBlog({
      title: newTitle,
      author: newAuthor,
      url: newURL
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <table>
        <thead> Create New Blog </thead>
        <tbody>
          <tr>
            <th> Title </th>
            <th><input
              value={newTitle}
              onChange={({ target }) => setNewTitle(target.value)}
            />
            </th>
          </tr>
          <tr>
            <th> Author </th>
            <th><input
              value={newAuthor}
              onChange={({ target }) => setNewAuthor(target.value)}
            />
            </th>
          </tr>
          <tr>
            <th> URL </th>
            <th><input
              value={newURL}
              onChange={({ target }) => setNewURL(target.value)}
            />
            </th>
          </tr>
        </tbody>
      </table>
      <button type="submit">Create</button>
    </form> 
  );};

export default BlogForm;

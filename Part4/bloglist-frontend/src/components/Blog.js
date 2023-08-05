import React from 'react';
import Togglable from './Toggable';

const Blog = ({blog, UpdateBlog, DeleteBlog}) => {

  const Like = () => {
    UpdateBlog(blog.id, {...blog, likes: blog.likes + 1});
  };

  const Delete = () => {
    DeleteBlog(blog);
  };

  return (
    <div>
      {blog.title}
      <Togglable buttonLabel="View">
        <div>
          <p> {blog.url} <br/>
        likes: {blog.likes} <button onClick={Like}> Like </button><br/>
            {blog.author} <br/>
            <button onClick={Delete}> Delete Blog </button></p>
        </div>
      </Togglable>
    </div>  
  );};

export default Blog;
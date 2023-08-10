import React from 'react';
import Togglable from './Toggable';
import PropTypes from 'prop-types';

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
  );
};

Blog.propTypes = {
  blog: PropTypes.object.isRequired,
  UpdateBlog: PropTypes.func.isRequired,
  DeleteBlog: PropTypes.func.isRequired,
};

export default Blog;
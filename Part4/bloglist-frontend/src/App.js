import React, { useState, useEffect } from 'react';
import Blog from './components/Blog';
import BlogService from './services/blogs';
import LoginForm from './components/LoginForm';
import BlogForm from './components/BlogsForm';
import Togglable from './components/Toggable';
import LoginService from './services/login';

const App = () => {
  const [blogs, setBlogs] = useState([]);
  const [user, setUser] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  

  useEffect(() => {
    BlogService.GetAll().then(blogs =>
      setBlogs( blogs )
    );  
  }, []);

  useEffect(() => {
    const AuthUser = window.localStorage.getItem('User');
    if (AuthUser) {
      const user = JSON.parse(AuthUser);
      setUser(user);
      BlogService.SetToken(user.token);
    }
  }, []);

  const handleLogin = (LoginObject) => {

    try {
      LoginService.login(LoginObject).then((user) => {
        setUser(user);
        window.localStorage.setItem('User', JSON.stringify(user));
        BlogService.SetToken(user.token);
      });

      setSuccessMessage('Successfully logged in');
      setTimeout(() => {
        setSuccessMessage(null);
      }, 5000);
    } catch (exception) {
      setErrorMessage('Wrong username or password');
      setTimeout(() => {
        setErrorMessage(null);
      }, 5000);
    }
  };

  const addBlog = (BlogObject) => {

    console.log(`Adding blog ${BlogObject.title}`);
    try {
      BlogService.CreateBlog(BlogObject).then((response) => {
        setBlogs(blogs.concat(response));
      });
      setSuccessMessage(`Successfully added blog ${BlogObject.title} by ${BlogObject.author}`);
    } catch (error) {
      console.log(error);
      setErrorMessage('Wrong credentials');
      setTimeout(() => {
        setErrorMessage(null);
      }, 5000);
    }
  };

  const UpdateBlog = (id, NewObject) => {
    try {
      BlogService.UpdateBlog(id, NewObject)
        .then((response) => {
          const DupList = blogs;
          const index = DupList.findIndex(blog => blog.id === id);
          DupList[index] = response;

          setSuccessMessage(`Liked ${NewObject.title}`);
          setBlogs(DupList);
        });

      setTimeout(() => {
        setSuccessMessage(null);
      }, 5000);
    } catch (error) {
      console.log(error);
      setErrorMessage('Something went wrong');
      setTimeout(() => {
        setErrorMessage(null);
      }, 5000);
    }
  };

  const DeleteBlog = ({id, title, author}) => {
    if (window.confirm(`Delete ${title} by ${author}?`)) {
      try {
        BlogService.DeleteBlog(id).then((response) => {
          console.log(response);
          // console.log(blogs.filter((blog) => blog.id !== id));
          setBlogs(blogs.filter((blog) => blog.id !== id));
        });
      } catch (error) {
        console.log(error);
        setErrorMessage('Something went wrong');
        setTimeout(() => {
          setErrorMessage(null);
        }, 5000);
      }
    }
  };

  const logout = () => {
    window.localStorage.removeItem('User');
    window.location.reload();
  };

  const Logout = () => (
    <div>
      {user.username} logged in
      <button onClick={logout}> Logout </button>
    </div>
  );

  blogs.sort((a, b) => b.likes - a.likes);

  return (
    <div>
      {user === null && <LoginForm handleLogin={handleLogin}/>}
      <h2>Blogs</h2>
      { user !== null && Logout() }
      <p> </p>
      { user !== null && <Togglable buttonLabel="Add new blog">
        <BlogForm addBlog={addBlog}/>
      </Togglable>
      }
      <p> {successMessage} </p>
      <p> {errorMessage} </p>
      {blogs.map(blog =>
        <Blog key={blog.id} blog={blog} UpdateBlog={UpdateBlog} DeleteBlog={DeleteBlog}/>
      )}
    </div>
  );
};

export default App;
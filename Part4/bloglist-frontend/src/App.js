import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import BlogService from './services/blogs'
import LoginForm from './components/LoginForm'
import BlogForm from './components/BlogsForm'
import LoginService from './services/login'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('') 
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const [newTitle, setNewTitle] = useState('');
  const [newURL, setNewURL] = useState('');
  const [newAuthor, setNewAuthor] = useState('');
  const [errorMessage, setErrorMessage] = useState(null)
  const [successMessage, setSuccessMessage] = useState()
  

  useEffect(() => {
    BlogService.GetAll().then(blogs =>
      setBlogs( blogs )
    )  
  }, [])

  useEffect(() => {
    const AuthUser = window.localStorage.getItem('User')
    if (AuthUser) {
      const user = JSON.parse(AuthUser)
      setUser(user)
      BlogService.SetToken(user.token)
    }
  }, [])

  const handleLogin = async (event) => {
    event.preventDefault()
    console.log('logging in with', username, password)

    try {
      const user = await LoginService.login({
        username, password,
      })
      setUser(user)
      window.localStorage.setItem('User', JSON.stringify(user))
      BlogService.SetToken(user.token)
      setUsername('')
      setPassword('')

      setSuccessMessage('Successfully logged in');
    } catch (exception) {
      setErrorMessage('Wrong username or password')
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
    }
  }

  const addBlog = async (event) => {
    event.preventDefault()

    console.log(`Adding blog ${newTitle}`);
    try {
      const createdBlog = {
        title: newTitle,
        author: newAuthor,
        url: newURL,
        likes: 0
      }
      await BlogService.CreateBlog(createdBlog)
      setBlogs(blogs.concat(createdBlog))
      setSuccessMessage(`Successfully added blog ${newTitle} by ${newAuthor}`)

      setNewTitle('')
      setNewAuthor('')
      setNewURL('')
    } catch (error) {
      console.log(error)
      setErrorMessage('Wrong credentials')
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
    }
  }

  const logout = () => {
    window.localStorage.removeItem('User')
    window.location.reload()
  }

  const Logout = () => {
    return (
      <div>
        `{user.username} logged in`
        <button onClick={logout}> Logout </button>
      </div>
    )
  }

  return (
    <div>
      { user === null && LoginForm(handleLogin, username, password, setUsername, setPassword) }
      { user !== null && BlogForm(addBlog, newTitle, setNewTitle, newAuthor, setNewAuthor, newURL, setNewURL) }
      <p> {successMessage} </p>
      <h2>blogs</h2>
      <p> {errorMessage} </p>
      { user !== null && Logout() }
      {blogs.map(blog =>
        <Blog key={blog.id} blog={blog} />
      )}
    </div>
  )
}

export default App
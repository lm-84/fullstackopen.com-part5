import { useState, useEffect , useRef} from 'react'
import Blog from './components/Blog'
import BlogForm from './components/BlogForm'
import Notification from './components/Notification'
import blogService from './services/blogs'
import loginService from './services/login'
import './index.css'
import Togglable from './components/Togglable'

const App = () => {
  const [blogs, setBlogs] = useState([])
  // const [newBlog, setNewBlog] = useState('')
  // const [showAll, setShowAll] = useState(true)
  const [errorMessage, setErrorMessage] = useState("")
  const [confirmMessage, setConfirmMessage] = useState("");
  const [username, setUsername] = useState('') 
  const [password, setPassword] = useState('') 
  const [user, setUser] = useState(null)

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs( blogs )
    )  
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogAppUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const handleLogin = async (event) => {
  event.preventDefault()
  try {
    const user = await loginService.login({
      username, password,
    })
    window.localStorage.setItem(
        'loggedBlogAppUser', JSON.stringify(user)
      ) 
    blogService.setToken(user.token)
    setUser(user)
    setUsername('')
    setPassword('')
    setConfirmMessage("user logged in");
          setTimeout(() => setConfirmMessage(""), 5000);
  } catch (exception) {
    setErrorMessage('Wrong credentials')
    setTimeout(() => {
      setErrorMessage("")
    }, 5000)
  }
}

  const handleLogout = async (event) => {
    event.preventDefault()
    window.localStorage.removeItem('loggedBlogAppUser')
    setUser(null)
  }

  const handleCreateNewBlog = async (blogObject) => {
    blogFormRef.current.toggleVisibility()
    const returnedBlog = await blogService.create(blogObject)
    setBlogs(blogs.concat(returnedBlog))
    setConfirmMessage("a new blog " + blogObject.title + " by " + blogObject.author + " added");
          setTimeout(() => setConfirmMessage(""), 5000);
  }

  const blogFormRef = useRef()

  if (user === null) {
    return (
      <div>
        <h2>Log in to application</h2>
        <Notification message={confirmMessage} classText={"message"} />
        <Notification message={errorMessage} classText={"error"} />

      <form onSubmit={handleLogin}>
        <div>
          username
            <input
            type="text"
            value={username}
            name="Username"
            onChange={({ target }) => setUsername(target.value)}
          />
        </div>
        <div>
          password
            <input
            type="password"
            value={password}
            name="Password"
            onChange={({ target }) => setPassword(target.value)}
          />
        </div>
        <button type="submit">login</button>
      </form>
      </div>
    )
  } else {

  return (
    <div>
      <h2>blogs</h2>
      <Notification message={confirmMessage} classText={"message"} />
      <Notification message={errorMessage} classText={"error"} />
      <p>{user.name} logged in <button onClick={handleLogout}>logout</button></p> 
      <Togglable buttonLabel="new blog" ref={blogFormRef}>
        <BlogForm handleCreateNewBlog={handleCreateNewBlog} />
      </Togglable>
      {blogs.map(blog =>
        <Blog key={blog.id} blog={blog} />
      )}
    </div>
  )
  }
}

export default App
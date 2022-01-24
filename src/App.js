import './App.css';
import Home from './routes/Home';
import Post from './routes/Post';
import Login from './routes/Login';
import Registration from './routes/Registration';
import CreatePost from './routes/CreatePost';
import ChangePassword from './routes/ChangePassword';
import PageNotFound from './routes/PageNotFound';
import Profile from './routes/Profile';
import { AuthContext } from './helpers/AuthContext';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  BrowserRouter, 
  Routes, 
  Route,
  Link
} from "react-router-dom";

function App() {
  const [authState, setAuthState] = useState({ username: "", id: 0, status: false })

  useEffect(() => {
    axios.get("https://react-full-stack-api-jvo978.herokuapp.com/auth/check", { headers: {
      accessToken: localStorage.getItem("accessToken")
    }})
      .then((response) => {
      if (response.data.error) {
        setAuthState({ ...authState, status: false })
      } else {
        setAuthState({
          username: response.data.username,
          id: response.data.id,
          status: true
        })
      }
    })
  },[])

  const logout = () => {
    localStorage.removeItem("accessToken")
    setAuthState({ username: "", id: 0, status: false });
  }

  return (
    <div className="App">
      <AuthContext.Provider value={{ authState, setAuthState }}>
      <BrowserRouter>
      <nav className='navBar'>
        <div className='links'>
          {!authState.status ? (
          <>
            <Link to="/registration">Registration</Link>
            <Link to="/login">Login</Link>
          </>
        ) : (
          <>
            <Link to="/">Home</Link> {" "}
            <Link to="/createpost">Create A Post</Link>
          </>
        )}
        </div>
        <div className='loggedInContainer'>
          <h1>{authState.username}</h1>
          {authState.status && 
          <div className='userButtons'>
                <Link to="/changepassword">
                  <button type="button">
                    Change Password
                  </button>
                </Link>
                <button onClick={logout}>Logout</button>
          </div>
            }
        </div>        
      </nav>
    <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/createpost" element={<CreatePost />} />
        <Route path="/post/:id" element={<Post />} />
        <Route path="/registration" element={<Registration />} />
        <Route path="/login" element={<Login />} />
        <Route path="*" element={<PageNotFound />} />
        <Route path="/profile/:id" element={<Profile />} />
        <Route path="/changepassword" element={<ChangePassword />} />
    </Routes>
  </BrowserRouter>
  </AuthContext.Provider>
      </div>
  )
}

export default App;

import axios from 'axios';
import { useState, useContext, useEffect } from 'react'
import '../css/Login.css';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../helpers/AuthContext'

function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const { authState, setAuthState } = useContext(AuthContext)

    let navigate = useNavigate();

    useEffect(() => {
        if (!localStorage.getItem('accessToken')) {
            navigate('/login')
        } else {
            navigate('/')
        }
    }, [authState.status])


    const signIn = () => {
        axios.post('https://react-full-stack-api-jvo978.herokuapp.com/auth/login', { username: username, password: password }).then((response) => {
            if (response.data.error) {
                alert(response.data.error);
                setUsername('')
                setPassword('')
            } else {
                localStorage.setItem('accessToken', response.data.token);
                setAuthState({ username: response.data.username, id: response.data.id, status: true })
                navigate('/');
            }
        })
    }

    return (
        <div className='login__container'>
            <div className='login__form'>
            <label>Username:</label>
            <input value={username} type="text" placeholder="Username" onChange={(event) => {
                setUsername(event.target.value)
            }} />
            <label>Password:</label>
            <input value={password} type="password" placeholder="Password" autoComplete='off' onChange={(event) => {
                setPassword(event.target.value)
            }} />
            <button onClick={signIn}>Sign In</button>
            </div>
        </div>
    )
}

export default Login

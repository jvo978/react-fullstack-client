import '../css/ChangePassword.css'
import { useState, useEffect, useContext } from 'react'
import { AuthContext } from '../helpers/AuthContext'
import { useNavigate } from 'react-router-dom';
import axios from 'axios'

function ChangePassword() {

    const [oldPassword, setOldPassword] = useState('')
    const [newPassword, setNewPassword] = useState('')
    const { authState } = useContext(AuthContext)

    let navigate = useNavigate();

    useEffect(() => {
        if (!localStorage.getItem('accessToken')) {
            navigate('/login')
        }
    }, [authState.status])

    const clearInputfields = () => {
        setOldPassword('')
        setNewPassword('')
    }

    const changePassword = () => {
        axios.put('https://react-full-stack-api-jvo978.herokuapp.com/auth/changepassword', { oldPassword: oldPassword, newPassword: newPassword }, { headers: {
            accessToken: localStorage.getItem('accessToken')
        }}).then((response) => {
            if (response.data.error) {
                alert(response.data.error)
                clearInputfields()
            } else {
                alert('Password successfully changed.')
                clearInputfields()
            }
        })
    }

    return (
        <div className='password__container'>
            <div className='password__form'>
                <label>Old Password:</label>
                <input value={oldPassword} type="password" placeholder='Old Password...' onChange={(e) => { setOldPassword(e.target.value) }} />
                <label>New Password:</label>
                <input value={newPassword} type="password" placeholder='New Password...' onChange={(e) => { setNewPassword(e.target.value)}} />
                <button onClick={changePassword}>Save Changes</button>
            </div>
        </div>
    )
}

export default ChangePassword

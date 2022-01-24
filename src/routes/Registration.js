import '../css/Registration.css';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import { useContext, useEffect } from 'react'
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../helpers/AuthContext'

function Registration() {
    let navigate = useNavigate()
    const { authState } = useContext(AuthContext)

    useEffect(() => {
        if (!localStorage.getItem('accessToken')) {
            navigate('/registration')
        } else {
            navigate('/')
        }
    }, [authState.status])


    const initialValues = {
        username: "",
        password: "",
    };

    const validationSchema = Yup.object().shape({
        username: Yup.string().min(3).max(15).required(),
        password: Yup.string().min(4).max(20).required()
    })

    const onSubmit = (data) => {
        axios.post('http://localhost:3001/auth', data).then(response => {
            navigate('/login')
        })
    }

    return (
        <div className="registration__container">
            <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={onSubmit}>
                <Form className="registration__form">
                    <label>Username: </label>
                        <ErrorMessage name="username" component="span" />
                        <Field className="inputRegistration" name="username" placeholder="Username" autoComplete="off" />
                    <label>Password: </label>
                        <ErrorMessage name="password" component="span" />
                        <Field className="inputRegistration" type="password" name="password" placeholder="Password" autoComplete="off" />
                        <button type="submit">Sign Up</button>
                </Form>
            </Formik>
        </div>
    )
}

export default Registration

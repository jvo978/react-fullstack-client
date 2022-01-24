import '../css/CreatePost.css';
import { useContext, useEffect } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../helpers/AuthContext'

function CreatePost() {
    const { authState } = useContext(AuthContext)
    let navigate = useNavigate();

    useEffect(() => {
        if (!localStorage.getItem('accessToken')) {
            navigate('/login')
        }
    }, [authState.status])

    const initialValues = {
        title: "",
        postText: ""
    }

    const validationSchema = Yup.object().shape({
        title: Yup.string().required(),
        postText: Yup.string().required()
    })

    const onSubmit = (data) => {
        axios.post("https://react-full-stack-api-jvo978.herokuapp.com/posts", data, { headers: {
            accessToken: localStorage.getItem('accessToken')
        }}).then(() => {
              navigate('/');
            })
    }

    return (
        <div className="createPost__container">
            <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={onSubmit}>
                <Form className="createPost__form">
                    <label>Title: </label>
                        <ErrorMessage name="title" component="span" />
                        <Field id="inputCreatePost" name="title" placeholder="Title" />
                    <label>Post: </label>
                        <ErrorMessage name="postText" component="span" />
                        <Field id="inputCreatePost" name="postText" placeholder="Post" />
                    <button type="submit">Create Post</button>
                </Form>
            </Formik>
        </div>
    )
}

export default CreatePost

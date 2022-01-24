import '../css/Post.css';
import { useEffect, useState, useContext } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import axios from 'axios';
import EditIcon from '@mui/icons-material/Edit';
const { AuthContext } = require("../helpers/AuthContext")

function Post() {
    let { id } = useParams();
    const [postObject, setPostObject] = useState({});
    const [editTitleStatus, setEditTitleStatus] = useState(false)
    const [editBodyStatus, setEditBodyStatus] = useState(false)
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState('');
    const [updatedTitle,  setUpdatedTitle] = useState('')
    const [updatedBody,  setUpdatedBody] = useState('')
    const { authState } = useContext(AuthContext)

    let navigate = useNavigate()

    useEffect(() => {
        if (!localStorage.getItem('accessToken')) {
            navigate('/login')
        } else {
            axios.get(`https://react-full-stack-api-jvo978.herokuapp.com/posts/${id}`).then((response) => {
                setPostObject(response.data)
            })
            axios.get(`https://react-full-stack-api-jvo978.herokuapp.com/comments/${id}`).then((response) => {
                setComments(response.data)
            })
        }
    }, [id, authState.status]);

    const addNewComment = () => {
        axios.post('https://react-full-stack-api-jvo978.herokuapp.com/comments', {
            commentBody: newComment,
            PostId: id
        }, {
            headers: {
                accessToken: localStorage.getItem("accessToken")
            } 
        })
        .then((response) => {
            if (response.data.error) {
                console.log(response.data.error)
            } else {
                setComments([...comments, { id: response.data.id, commentBody: response.data.commentBody, username: response.data.username }]);
                setNewComment('');
            }
        })
    }

    const deleteComment = (id) => {
        axios.delete(`https://react-full-stack-api-jvo978.herokuapp.com/comments/${id}`, { 
            headers: {
                accessToken: localStorage.getItem("accessToken")
            }
        }).then(() => {
            setComments(comments.filter(val => {
                return val.id !== id;
            }))
        })
    }

    const deletePost = (id) => {
        axios.delete(`https://react-full-stack-api-jvo978.herokuapp.com/posts/${id}`, { 
            headers: {
                accessToken: localStorage.getItem("accessToken")
            }
        }).then((response) => {
            navigate('/')
        })
    }

    const editButtonClicked = (options) => {
        if (options === 'title') {
            setEditTitleStatus(true)
        } else {
            setEditBodyStatus(true)
        }
    }

    const cancel = (options) => {
        if (options === 'title') {
            setEditTitleStatus(false)
        } else {
            setEditBodyStatus(false)
        }
    }

    const updatePost = (postId, options) => {
        if (options === 'title') {
            axios.put(`https://react-full-stack-api-jvo978.herokuapp.com/posts/title`, { newTitle: updatedTitle,  id: postId }, { headers: {
                accessToken: localStorage.getItem('accessToken')
            }}).then(() => {
                setEditTitleStatus(false)
                setPostObject({ ...postObject, title: updatedTitle })
            })
        } else {
            axios.put(`https://react-full-stack-api-jvo978.herokuapp.com/posts/postText`, { newPostText: updatedBody, id: postId }, { headers: {
                accessToken: localStorage.getItem('accessToken')
            }}).then(() => {
                setEditBodyStatus(false)
                setPostObject({ ...postObject, postText: updatedBody })
            })
        }
    }

    return (
        <div className="individualPost__container">
            <div className="individualPost__left">
                <div className="title__container">{!editTitleStatus ?  (
                    <div className='individualPost__title'>
                        <div className='title__text'>
                            {postObject.title}
                        </div>{authState.username === postObject.username && 
                        <div className='editTitleButton'>
                            <EditIcon onClick={() => {
                                editButtonClicked("title")
                            }}> </EditIcon>
                    </div>
                        }
                    </div>
                )
                : (
                <div className='updateContainer__edit'>
                    <input 
                        type='text'
                        placeholder='Edit Title'
                        onChange={(event) => {
                            setUpdatedTitle(event.target.value) 
                        }} 
                    />
                    <button style={{ width: '60px', height: '30px', borderRadius: '0' }} 
                            onClick={() => { 
                                updatePost(postObject.id, 'title') 
                    }}>Update</button>
                    <button className='cancel' onClick={() => {
                        cancel('title')
                    }} >Cancel</button>
                </div>
                )}
                </div>
                <div className="individualPost__body">
                    {!editBodyStatus ? (
                        <div className='body__text'>
                            {postObject.postText}
                            {authState.username === postObject.username && 
                                <div className='editBodyButton'>
                                    <EditIcon onClick={() => {
                                        editButtonClicked('body')
                                    }}></EditIcon>
                                </div>
                            }
                        </div>
                    ) : (
                        <div className='updateContainer__edit'>
                        <input type='text' 
                               placeholder='Edit Post' 
                               onChange={(event) => {
                                setUpdatedBody(event.target.value)
                        }} />
                        <button style={{ width: '60px', height: '30px', borderRadius: '0' }} 
                                onClick={() => { 
                                    updatePost(postObject.id, 'body') 
                        }}>Update</button>
                        <button className='cancel' onClick={() => {
                            cancel('body')
                        }} >Cancel</button>
                    </div>
                    )}
                </div>


                <div className="individualPost__footer">
                    <div className='username'>
                        {postObject.username}
                    </div>
                    <div className="button">{authState.username === postObject.username && (
                            <button style={{ width: '90px', height: '35px' }} onClick={() => {
                            deletePost(postObject.id)
                        }}>Delete Post</button>
                    )}
                    </div>
                </div>
            </div>
            <div className="comment__right">
                <div className='addComment__container'>
                    <input value={newComment} type="text" placeholder="Comment..." autoComplete='off' onChange={(event) => { setNewComment(event.target.value) }} />
                    <button onClick={addNewComment}>Add Comment</button>
                </div>
                <div className='listOfComments'>
                    {comments.map((comment, key) => { 
                        return (
                            <div className='commentBody__container'>
                                    <h2>{comment.username}:</h2>
                            <div className='commentBody'>
                                {comment.commentBody} 
                            </div>
                            
                            <div className='commentBody__delete'>
                            {authState.username === comment.username && (
                                <button onClick={() =>{ deleteComment(comment.id) }}>Delete</button>
                            )}
                            </div>
                        </div>
                        )
                    })}
                </div>
            </div>
        </div>
    )
}

export default Post

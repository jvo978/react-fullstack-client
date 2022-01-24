import { useEffect, useState, useContext } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import '../css/Profile.css';
import axios from 'axios';
import { AuthContext } from "../helpers/AuthContext"



function Profile() {
    const [username, setUsername] = useState("")
    const [listOfPosts, setListOfPosts] = useState([])
    const { authState } = useContext(AuthContext)


    let { id } = useParams()
    let navigate = useNavigate()

    useEffect(() => {
        if (!localStorage.getItem('accessToken')) {
            navigate('/login')
          } else {
            axios.get(`https://react-full-stack-api-jvo978.herokuapp.com//auth/basicInfo/${id}`).then((response) => {
            setUsername(response.data.username)
       })
            axios.get(`https://react-full-stack-api-jvo978.herokuapp.com//posts/byUserId/${id}`).then((response) => {
            setListOfPosts(response.data)
   })
          }
   }, [authState.status]);

    return (
        <div className='profile__container'>
            <div className='basicInfo'>
                <h1>{username}'s posts</h1>
            </div>
            <div className='listOfPosts'>
                <div className="post__profile">{listOfPosts.map((post, key) => {
                    return ( 
                        <div className="post_description">
                            <div className="post__title">{post.title}</div>
                            <div className="post__body" onClick={() => {
                                navigate(`/post/${post.id}`)}}>
                                    {post.postText}
                            </div>
                        <div className="post__footer">
                            <div className='username'>
                                {post.username}
                        </div>
                            <div className='buttons'>
                                <label>{post.Likes.length}</label>
                            </div>
                        </div>
                    </div>
                    )
                    })}
                </div>
            </div>
        </div>
    )
}

export default Profile
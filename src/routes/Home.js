import '../css/Home.css';
import axios from 'axios';
import { useState, useEffect, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import { AuthContext } from "../helpers/AuthContext"

function Home() {
    const [listOfPosts, setListOfPosts] = useState([]);
    const [likedPosts, setLikedPosts] = useState([])
    const { authState } = useContext(AuthContext)
    let navigate = useNavigate();

        useEffect(() => {
          if (!localStorage.getItem('accessToken')) {
            navigate('/login')
          } else {
            axios.get("https://react-full-stack-api-jvo978.herokuapp.com/posts", { 
              headers: { accessToken: localStorage.getItem("accessToken")}
            }).then((response) => {
              setListOfPosts(response.data.listOfPosts)
              setLikedPosts(response.data.likedPosts.map((like) => {
                return like.PostId
              }))
            })
          }
        }, [authState.status]);

    const likeAPost = (postId) => {
      axios.post("https://react-full-stack-api-jvo978.herokuapp.com/likes", { PostId: postId }, { headers: {
        accessToken: localStorage.getItem("accessToken")
      }}).then((response) => {
        setListOfPosts(listOfPosts.map((post) => {
          if (post.id === postId) {
            if (response.data.liked) {
              return { ...post, Likes: [...post.Likes, 0]}
            } else {
              const likesArray = post.Likes
              likesArray.pop()
              return { ...post, Likes: likesArray }
            }
          } else {
            return post;
          }
        }))
        if (likedPosts.includes(postId)) {
          setLikedPosts(likedPosts.filter((id) => {
            return id !== postId
          }))
        } else {
          setLikedPosts([...likedPosts, postId])
        }
      })
    }
        
    return (
        <div className="post">{listOfPosts.map((post, key) => {
            return ( 
              <div className="post_description">
                <div className="post__title">{post.title}</div>
                <div className="post__body" onClick={() => {
                  navigate(`/post/${post.id}`)}}>
                  {post.postText}
                </div>
                <div className="post__footer">
                  <div className='username'>
                    <Link to={`/profile/${post.UserId}`}>{post.username}</Link>
                  </div>
                  <div className='buttons'>
                    <ThumbUpIcon onClick={() => {
                      likeAPost(post.id) }} 
                      className={ likedPosts.includes(post.id) ? "unlikeBttn" : "likeBttn" }
                  />
                  <label>{post.Likes.length}</label>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
    )
}

export default Home

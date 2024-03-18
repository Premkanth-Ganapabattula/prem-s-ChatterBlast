import { Component } from "react";
import Cookies from 'js-cookie'
import { BsThreeDotsVertical } from "react-icons/bs";
import { FaHandHoldingHeart } from "react-icons/fa";
import { IoMdHeartDislike } from "react-icons/io";
import { AiFillLike } from "react-icons/ai";
import { FaCommentAlt } from "react-icons/fa";
import { IoIosShareAlt } from "react-icons/io";
import { IoCloseSharp } from "react-icons/io5";
import CommentDetails from "../commentDetails";
import ReactLoaderSpinner from "../reactSpinner";
import Modal from 'react-modal'
import './index.css'
import moment from 'moment'


class PostDetails extends Component {
    state = {
        countLikes : 0,
        isLiked: false,
        commentModalCard: false,
        commentsCount: 0,
        commentContent:'',
        postComments: [], 
        userDetails: '',
        loadingLike : false,
        loadingComments: false,
        loadingAddComment: false
    }

    componentDidMount() {
        this.gettingLikesCount()
        this.gettingCommentsCount()
        this.gettingUserDetails()
    }

    gettingUserDetails = async () => {
        const jwtToken = Cookies.get('jwt_token')
        const userId = Cookies.get('user_id')
        const url = `https://chatterblast-server.onrender.com/profile/details/${userId}`
        const options = {
            method: 'GET',
            header: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${jwtToken}` 
            }
        }
        const response = await fetch(url, options)
        const data = await response.json()
        this.setState({userDetails: data.userDetails})
    }


    gettingCommentsCount = async() => {
        const jwtToken = Cookies.get('jwt_token')
        const postId = this.props.postDetails.post_id
        const url = `https://chatterblast-server.onrender.com/get/comments/count/${postId}`
        const options = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${jwtToken}`
            }
        }
        const response = await fetch(url, options)
        const data = await response.json()
        this.setState({commentsCount: data.postCommentsCount})
    }

    gettingComments = async () => {
        const jwtToken = Cookies.get('jwt_token')
        const postId = this.props.postDetails.post_id
        this.setState({loadingComments: true})
        const url = `https://chatterblast-server.onrender.com/get/comments/${postId}`
        const options = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${jwtToken}`
            }
        }
        const response = await fetch(url, options)
        const data = await response.json()
        this.setState({postComments: data.postComments, loadingComments: false})
    }

    gettingLikesCount = async() => {
        const jwtToken = Cookies.get('jwt_token')
        const userId = Cookies.get('user_id')
        const postId = this.props.postDetails.post_id
        const url = `https://chatterblast-server.onrender.com/get/likes/count/${postId}/${userId}`
        const options = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${jwtToken}`
            }
        }

        const response = await fetch(url, options)
        const data = await response.json()
        console.log(data.isPostLiked)
        this.setState({countLikes: data.postLikesCount, isLiked: data.isPostLiked})
    }

    onClickUnlike = async () => {
        const jwtToken = Cookies.get('jwt_token')
        const userId = Cookies.get('user_id')
        const postId = this.props.postDetails.post_id
        this.setState({loadingLike: true})
        const url = `https://chatterblast-server.onrender.com/delete/like/${postId}/${userId}`
        const options = {
            method: 'DELETE',
            headers: {
                Authorization: `Bearer ${jwtToken}`  
            }
        }
        const response = await fetch(url, options)
        if (response.status === 200) {
            this.setState(prevState => ({
                isLiked: false,
                countLikes: prevState.countLikes - 1,
                loadingLike: false
              }));
        }
    }

    onClickLike = async () => {
        const jwtToken = Cookies.get('jwt_token')
        const userId = Cookies.get('user_id')
        this.setState({loadingLike: true})
        const {post_id, user_id} = this.props.postDetails
        const time = new Date()
        const utcString = moment(time).utc().format();

        const requestBody = {
            userId: userId,
            postId: post_id,
            likedTime: utcString
        }

        const url = 'https://chatterblast-server.onrender.com/post/likes/'
        const options = {
            method: 'POST',
            headers: {
                Accept: 'application.json',
                'Content-Type': 'application/json',
                Authorization: `Bearer ${jwtToken}` 
              },
            body: JSON.stringify(requestBody)
        }

        const response = await fetch(url, options)
        const data =  await response.json()
        this.setState(prevState => ({
            isLiked: true,
            countLikes: prevState.countLikes + 1,
            loadingLike: false
          }));
        if (response.status === 200) {
            const notificationUrl = `https://chatterblast-server.onrender.com/add/notification`
            const notificationBody = {
                notificationBy: userId,
                notificationToo: user_id,
                postId:  post_id,
                notificationType: 'like',
                notificationText: 'Liked your post',
                notificationTime: utcString
            }
            const notificationOptions = {
                method: 'POST',
                headers: {
                    Accept: 'application.json',
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${jwtToken}` 
                  },
                body: JSON.stringify(notificationBody)
            }
            const notificationResponse = await fetch(notificationUrl, notificationOptions)
            const data = await notificationResponse.json()
        }
    }

    onClickAddComment = async () => {
        const jwtToken = Cookies.get('jwt_token')
        const userId = Cookies.get('user_id')
        this.setState({loadingAddComment: true})
        const {commentContent, userDetails} = this.state
        const {post_id, user_id} = this.props.postDetails
        const time = new Date()
        const utcString = moment(time).utc().format();

        const requestBody = {
            userId: userId,
            postId: post_id,
            commentContent: commentContent,
            commentedTime: utcString
        }

        const newcommentDetails = {
            comment_content : commentContent,
            time_of_comment : utcString
        }

        const newComment = {...userDetails, ...newcommentDetails}

        this.setState(prevState => ({
            postComments : [...prevState.postComments, newComment]
        }))

        const url = 'https://chatterblast-server.onrender.com/add/comment/'
        const options = {
            method: 'POST',
            headers: {
                Accept: 'application.json',
                'Content-Type': 'application/json',
                Authorization: `Bearer ${jwtToken}` 
              },
            body: JSON.stringify(requestBody)
        }

        const response = await fetch(url, options)
        const data =  await response.json()
        this.setState({commentContent: '', loadingAddComment: false})
        if (response.status === 200) {
            const notificationUrl = `https://chatterblast-server.onrender.com/add/notification`
            const notificationBody = {
                notificationBy: userId,
                notificationToo: user_id,
                postId:  post_id,
                notificationType: 'comment',
                notificationText: 'Commented on your post',
                notificationTime: utcString
            }
            const notificationOptions = {
                method: 'POST',
                headers: {
                    Accept: 'application.json',
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${jwtToken}` 
                  },
                body: JSON.stringify(notificationBody)
            }
            const notificationResponse = await fetch(notificationUrl, notificationOptions)
            const data = await notificationResponse.json()
        }
    }

    onClickComment = () => {
        this.gettingComments()
        this.setState({commentModalCard: true})
    }

    onClickCloseButton = () => {
        this.setState({commentModalCard: false})
    }

    onChangeCommentContent = event => {
        this.setState({commentContent: event.target.value})
    }

    formatPostTime = (postTime) => {
        if (!(postTime instanceof Date) || isNaN(postTime.getTime())) {
            console.error('Invalid postTime:', postTime);
            return 'Invalid Date';
        }
        const currentTime = new Date()
        const timeDiff = Math.floor((currentTime.getTime() - postTime.getTime()) / 1000); // Time difference in seconds
        if (timeDiff < 60) {
          return 'just now';
        } else if (timeDiff < 3600) {
          const minutes = Math.floor(timeDiff / 60);
          return `${minutes} minute${minutes !== 1 ? 's' : ''} ago`;
        } else if (timeDiff < 86400) {
          const hours = Math.floor(timeDiff / 3600);
          return `${hours} hour${hours !== 1 ? 's' : ''} ago`;
        } else if (timeDiff < 2592000) { // 30 days
          const days = Math.floor(timeDiff / 86400);
          return `${days} day${days !== 1 ? 's' : ''} ago`;
        } else if (timeDiff < 31536000) { // 365 days
          const postDate = new Date(postTime); // Convert timestamp to Date object
          const date = postDate.getDate();
          const month = postDate.toLocaleString('default', { month: 'short' });
          return `${date} ${month}`;
        } else {
          const postDate = new Date(postTime); // Convert timestamp to Date object
          const year = postDate.getFullYear();
          const date = postDate.getDate();
          const month = postDate.toLocaleString('default', { month: 'short' });
          return `${date} ${month} ${year}`;
        }
      }
      
    
    render() {
        const {
            countLikes,
            commentsCount,
            isLiked,
            commentModalCard,
            postComments,
            commentContent,
            loadingLike,
            loadingAddComment,
            loadingComments
        } = this.state
        const postDetails = this.props
        const {post_path, caption, hashTags, username, profile_photo, time_data_of_post} = postDetails.postDetails
        const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
        const date = new Date(time_data_of_post)
        const timeOfPosted= date.toLocaleString(undefined, { timeZone: timezone });
        const formattedTime = this.formatPostTime(new Date(time_data_of_post))
        const extension = post_path.split('.').pop().toLowerCase();
        return (
            <>
            <div className="post-details-main-container">
                <div className="user-details-three-dots">
                    <div className="profile-username-post">
                        <div className="profile-card-posts">
                            <img src={`https://chatterblast-server.onrender.com/profile/photo/stream/${profile_photo}`} alt={username} className='profile-photo-posts' />
                        </div>
                        <div className="username-time">
                            <p className="username-posts">{username}</p>
                            <p className="time-posted">{formattedTime}</p>
                        </div>
                    </div>
                    <div className="three-dots-card">
                        <BsThreeDotsVertical className="three-dots-card"/>
                    </div>
                </div>
                <div className="post-content">
                    <p className="post-content-text">{caption}</p>
                </div>
                <div className="post-container">
                    {['jpg', 'jpeg', 'png', 'gif', 'bmp'].includes(extension) ? ( // Assuming there's a property 'type' in the post object indicating whether it's an image or video
                        <img src={`https://chatterblast-server.onrender.com/posts/stream/${post_path}`} alt="Img" className="post-image"/>
                    ) : (
                        <video controls className="post-image">
                        <source
                            src={`https://chatterblast-server.onrender.com/posts/stream/${post_path}`}
                            type="video/mp4"
                        />
                        Your browser does not support the video tag.
                        </video>
                    )}
                </div>
                <div className="like-comment-share">
                    <div className="like-card">
                        <p className="count-posts">{countLikes}</p>   
                        {isLiked? <button type="button" className="buttons-posts" onClick={this.onClickUnlike}>
                            {loadingLike? <ReactLoaderSpinner /> : <FaHandHoldingHeart className="drop-like"/>}
                        </button> : 
                            <button type="button" className="buttons-posts" onClick={this.onClickLike}>
                                {loadingLike? <ReactLoaderSpinner /> :<FaHandHoldingHeart className="logos-for-post"/>}
                            </button>
                        }                        
                    </div>
                    <div className="comment-card">
                        <p className="count-posts">{commentsCount}</p>                     
                        <button type="button" className="buttons-posts" onClick={this.onClickComment}><FaCommentAlt className="logos-for-post"/></button>
                    </div>
                    <Modal className='comments-modal-card' isOpen={commentModalCard}>
                        {loadingComments? <ReactLoaderSpinner /> :<>
                            <div className="close-button">
                                <IoCloseSharp onClick={this.onClickCloseButton}/>
                            </div>
                            <div className="post-comments-card">
                                <div className="post-container-in-comments-card">
                                    {['jpg', 'jpeg', 'png', 'gif', 'bmp'].includes(extension) ? ( // Assuming there's a property 'type' in the post object indicating whether it's an image or video
                                        <img src={`https://chatterblast-server.onrender.com/posts/stream/${post_path}`} alt="Img" className="post-image"/>
                                    ) : (
                                        <video controls className="post-image">
                                        <source
                                            src={`https://chatterblast-server.onrender.com/posts/stream/${post_path}`}
                                            type="video/mp4"
                                        />
                                        Your browser does not support the video tag.
                                        </video>
                                    )}
                                </div>
                                <div className="comments-display-container">
                                    <div className="comments-lists">
                                        {postComments && postComments.length > 0 ? (
                                            postComments.map((each, index) => (
                                            <CommentDetails key={index} userDetails={each} />
                                            ))
                                            ) : (
                                            <p>No posts found</p>
                                        )}
                                    </div>
                                    <div className="input-element-add-comment-button">
                                        <input type="text" className="input-element-comment" value={commentContent} onChange={this.onChangeCommentContent} placeholder="Add Comment" />
                                        <button type="button" className="add-comment-button" onClick={this.onClickAddComment}>
                                            {loadingAddComment? <ReactLoaderSpinner /> : 'Add comment'}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </>}                  
                    </Modal>
                    <div className="share-card">
                        <p className="count-posts">0</p>         
                        <button type="button" className="buttons-posts"><IoIosShareAlt className="logos-for-post" /></button>
                    </div>
                </div>
            </div>
            </>
        )
    }
}

export default PostDetails;

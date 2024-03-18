import { Component } from "react";
import Cookies from "js-cookie";
import { FaHandHoldingHeart } from "react-icons/fa";

import './index.css'

class CommentDetails extends Component {
    state = {isLiked: false,}

    formatPostTime = (commentTime) => {
        if (!(commentTime instanceof Date) || isNaN(commentTime.getTime())) {
            console.error('Invalid postTime:', commentTime);
            return 'Invalid Date';
        }
        const currentTime = new Date()
        const timeDiff = Math.floor((currentTime.getTime() - commentTime.getTime()) / 1000); // Time difference in seconds
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
          const postDate = new Date(commentTime); // Convert timestamp to Date object
          const date = postDate.getDate();
          const month = postDate.toLocaleString('default', { month: 'short' });
          return `${date} ${month}`;
        } else {
          const postDate = new Date(commentTime); // Convert timestamp to Date object
          const year = postDate.getFullYear();
          const date = postDate.getDate();
          const month = postDate.toLocaleString('default', { month: 'short' });
          return `${date} ${month} ${year}`;
        }
      }
      

    render() {
        const {isLiked} =  this.setState
        const {userDetails} = this.props
        const {profile_photo, username, comment_content, time_of_comment} = userDetails
        const formattedTime = this.formatPostTime(new Date(time_of_comment))
        return(
            <div className="comment-details-main-container">
                <div className="profle-card">
                    <img src={`https://chatterblast-server.onrender.com/profile/photo/stream/${profile_photo}`} alt={username} className="profilePhoto" />
                </div>
                <div className="bottom-card">
                    <div className="profile-like-button">
                        <div className="profile-comment-content">
                            <div className="username-comment">
                                <p><span className="username-in-comments">{username}</span>: {comment_content}</p>
                            </div>
                        </div>
                        <div className="like-card">        
                            {isLiked? <button type="button" className="buttons-posts" onClick={this.onClickUnlike}>
                                <FaHandHoldingHeart className="drop-like"/>
                            </button> : 
                                <button type="button" className="buttons-posts" onClick={this.onClickLike}>
                                    <FaHandHoldingHeart className="logos-for-post"/>
                                </button>
                            }                        
                        </div>               
                    </div>
                    <div className="time-likes-reply">
                        <div className="time_of_comment">
                            <p className="comment-time">{formattedTime}</p>
                        </div>
                        <div className="like-button">
                            <button type="button" className="buttons-in-comments">Likes</button>
                        </div>
                        <div className="reply-button-card">
                            <button type="button" className="buttons-in-comments">Replay</button>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default CommentDetails;
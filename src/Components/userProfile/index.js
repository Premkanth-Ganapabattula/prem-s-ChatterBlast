import { Component } from "react";
import PostDetails from '../postDetails';
import Cookies from "js-cookie";
import { VscFeedback } from "react-icons/vsc";
import { BsCameraReels } from "react-icons/bs";
import ReactLoaderSpinner from "../reactSpinner";

import './index.css'

class UserProfile extends Component {
    state = {
        selectedId: "", 
        selectedUserDetails: {}, 
        postDetails: [],
        loadingPosts: false,
        loadingSelectedUser: false
    }
    

    componentDidMount() {
        this.fetchData(this.props.selectedId);
    }

    componentDidUpdate(prevProps) {
        // Check if selectedId has changed
        if (prevProps.selectedId !== this.props.selectedId) {
            this.fetchData(this.props.selectedId);
        }
    }

    fetchData = async (selectedId) => {
        await this.gettingSelectedUserDetails(selectedId);
        this.gettingPostDetails(selectedId);
    }

    gettingPostDetails = async(selectedId) => {
        const jwtToken = Cookies.get('jwt_token')
        this.setState({loadingPosts: true})
        const url = `https://chatterblast-server.onrender.com/get/user/posts/${selectedId}`
        const options = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${jwtToken}`
            }
        }
        const response = await fetch(url, options)
        const data = await response.json()
        this.setState({postDetails: data.postDetails, loadingPosts: false})
    }

    gettingSelectedUserDetails = async(selectedId) => {
        const jwtToken = Cookies.get('jwt_token')
        const userId = selectedId
        this.setState({loadingSelectedUser: true})
        const url = `https://chatterblast-server.onrender.com/profile/details/${userId}`
        const options = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${jwtToken}`
            }
        }
        const response = await fetch(url, options)
        const data = await response.json()
        this.setState({selectedUserDetails: data.userDetails, loadingSelectedUser: false})
    }

    renderingButtons = () => {
        const {isFollowing, isSuggested} = this.props

        if (isSuggested !== undefined) {
            return <button type='button' className='buttons-followers'>Follow</button>
        } else {
            if(isFollowing){
                return <button type='button' className='buttons-followers'>Unfollow</button>
            } else {
                return <button type='button' className='buttons-followers'>Follow Back</button>
            }
        }
    }


    render() {
        const {selectedUserDetails, postDetails, loadingPosts, loadingSelectedUser} = this.state
        const {followingsList, selectedId, isFollowing} = this.props
        const {username, user_id, profile_photo, followingsCount, followersCount, postsCount, bio, first_name, last_name} = selectedUserDetails
        const backgroundImageUrl1 = 'url("https://marketplace.canva.com/EAE89qUYCic/1/0/1600w/canva-blue-ocean-tide-beach-motivational-quote-facebook-cover-UlayDxq20Mo.jpg")'
        const backgroundImageUrl2 = 'url("https://png.pngtree.com/background/20210715/original/pngtree-line-white-background-business-picture-image_1326839.jpg")'
        return (
            <>
            {loadingSelectedUser? <ReactLoaderSpinner /> :<div className="user-profile-main-container">
                <div className='profile-card-profile-container' style={{ 
                            backgroundImage: backgroundImageUrl1, backgroundImageUrl2
                        }}>
                            <div className='profile-following-message'>
                                <div className='follow-status-card'>
                                    {this.renderingButtons()}
                                </div>
                                <div className='profile-content-username-fullname'>
                                    <div className='profile-image-in-profile-container'>
                                        {profile_photo && <img src={`https://chatterblast-server.onrender.com/profile/photo/stream/${profile_photo}`} alt="profilePhoto" className='profile-image-in-detailed-view' />}
                                    </div>
                                    <div className='username-full-name'>
                                        <p className='username-profile-detailed-view'>{username}</p>
                                        <p className='full-name-profile-detailed-view'>{first_name + " " + last_name}</p>
                                        <p className='bio-profile-card'>{bio}</p>
                                    </div>
                                </div>
                                <div className='message-button-card-detailed-view'>
                                    <button type='button' className='message-button-profile-container'>Message</button>
                                </div>
                            </div>
                            <div className='posts-followings-followers-count'>
                                <div className='posts-count-profile-container'>
                                    <p className='post-count-text'>{postsCount} <br /> <span className='count-text'>Posts</span></p>
                                </div>
                                <div className='followers-count-profile-container'>
                                    <p className='followers-count-text'>{followersCount} <br /> <span className='count-text'>Followers</span></p>
                                </div>
                                <div className='followings-count-profile-container'>
                                    <p className='followings-count-text'>{followingsCount} <br /> <span className='count-text'>Following</span></p>
                                </div>
                            </div>
                            <div className='show-more-button-card'>
                                <button className='show-more-button'>Show More</button>
                            </div>
                        </div>
                        <div className='feed-reels-icons-card'>
                            <VscFeedback className='icon-in-detailed-view'/>
                            <BsCameraReels className='icon-in-detailed-view'/>
                        </div>
                        {loadingPosts? <ReactLoaderSpinner /> : <div className='posts-display-main-container'>
                            {postDetails && postDetails.length > 0 ? (
                                postDetails.map((each, index) => (
                                    <PostDetails key={index} postDetails={each} />
                                ))
                                ) : (
                                <p>No posts found</p>
                            )}
                        </div>}
            </div>}
            </>
        )
    }
}

export default UserProfile

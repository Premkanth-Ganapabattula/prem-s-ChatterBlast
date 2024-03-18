import { Component } from "react";
import Header from "../Header"
import Cookies from "js-cookie";
import PostDetails from '../postDetails';
import FollowingDetailsCard from '../followerDetailsCard';
import { VscFeedback } from "react-icons/vsc";
import { BsCameraReels } from "react-icons/bs";
import ReactLoaderSpinner from "../reactSpinner";

import './index.css'

class MyProfile extends Component {
    state = {
        selectedUserDetails: [], 
        postDetails:[], 
        followersList:[], 
        followeringList:[], 
        loadingFollowerList: false,
        loadingFollowingList: false,
        loadingProfile: false,
        loadingPosts: false
    }

    componentDidMount() {
        const selectedId = Cookies.get('user_id')
        this.gettingSelectedUserDetails(selectedId)
        this.gettingPostDetails(selectedId)
        this.gettingFollowingDetails()
        this.gettingFollowersDetails()
    }

    gettingFollowingDetails = async() => {
        const jwtToken = Cookies.get('jwt_token')
        const userId = Cookies.get('user_id')
        this.setState({loadingFollowerList: true})
        const url = `https://chatterblast-server.onrender.com/user/following/details/${userId}`
        const options = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${jwtToken}`
            }
        }
        const response = await fetch(url, options)
        const data = await response.json()
        this.setState({followingList: data.following, loadingFollowingList: false})
    }

    gettingFollowersDetails = async() => {
        const jwtToken = Cookies.get('jwt_token')
        const userId = Cookies.get('user_id')
        this.setState({loadingFollowerList: true})
        const url = `https://chatterblast-server.onrender.com/user/followers/details/${userId}`
        const options = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${jwtToken}`
            }
        }
        const response = await fetch(url, options)
        const data = await response.json()
        let followingList = []
        data.followings.map(each => {
            followingList.push(each.followings)
        })
        this.setState({followersList: data.followers, followingsList: followingList, loadingFollowerList: false})
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
        this.setState({loadingProfile: true})
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
        this.setState({selectedUserDetails: data.userDetails, loadingProfile: false})
    }

    render() {
        const {
            selectedUserDetails,
            followingList,
            followingsList,
            followersList, 
            postDetails,
            loadingFollowerList,
            loadingFollowingList,
            loadingPosts,
            loadingProfile
        } = this.state
        const {username, user_id, profile_photo, followingsCount, followersCount, postsCount, bio, first_name, last_name} = selectedUserDetails
        const backgroundImageUrl1 = 'url("https://marketplace.canva.com/EAE89qUYCic/1/0/1600w/canva-blue-ocean-tide-beach-motivational-quote-facebook-cover-UlayDxq20Mo.jpg")'
        const backgroundImageUrl2 = 'url("https://png.pngtree.com/background/20210715/original/pngtree-line-white-background-business-picture-image_1326839.jpg")'     
        return (
            <>
            <Header />
            {loadingProfile? <ReactLoaderSpinner /> : <div className="my-profile-main-container">
                {loadingFollowingList? <ReactLoaderSpinner /> :<div className="left-screen-my-profile">
                    <h1 className='following-heading'>Following</h1>
                        {followingList && followingList.length > 0 ? (
                            followingList.map((each, index) => (
                                <FollowingDetailsCard key={index} userDetails={each} isFollowing='true' isSuggested={undefined} userProfileDetails={this.isUserSelected}/>
                            ))
                        ) : (
                            <p>No users found</p>
                        )}
                </div>}
                <div className="middle-screen-my-profile">
                <div className='profile-card-my-profile' style={{ 
                    backgroundImage: backgroundImageUrl1, backgroundImageUrl2
                    }}>
                    <div className='profile-following-message'>
                        <div className='profile-content-username-fullname-my-profile'>
                            <div className='profile-image-in-profile-container'>
                                {profile_photo && <img src={`https://chatterblast-server.onrender.com/profile/photo/stream/${profile_photo}`} alt="profilePhoto" className='profile-image-in-detailed-view' />}
                            </div>
                            <div className='username-full-name'>
                                <p className='username-profile-detailed-view'>{username}</p>
                                <p className='full-name-profile-detailed-view'>{first_name + " " + last_name}</p>
                                <p className='bio-profile-card'>{bio}</p>
                            </div>
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
                {loadingPosts? <ReactLoaderSpinner /> : <div className='posts-display-my-profile'>
                    {postDetails && postDetails.length > 0 ? (
                        postDetails.map((each, index) => (
                            <PostDetails key={index} postDetails={each} />
                        ))
                        ) : (
                        <p>No posts found</p>
                    )}
                </div>}
                </div>
                {loadingFollowerList? <ReactLoaderSpinner /> :<div className="right-screen-my-profile">
                    <h1 className='followers-heading'>Followers</h1>
                    {followersList && followersList.length > 0 ? (
                        followersList.map((each, index) => (
                            <FollowingDetailsCard key={index} userDetails={each} isFollowing={followingsList.includes(each.user_id)} isSuggested={undefined} userProfileDetails={this.isUserSelected} />
                        ))
                    ) : (
                        <p>No users found</p>
                    )}
                </div>}
            </div>}
            </>
        )
    }
}

export default MyProfile;

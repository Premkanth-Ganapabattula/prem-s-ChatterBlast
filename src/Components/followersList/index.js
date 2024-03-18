import { Component } from 'react';
import Cookies from 'js-cookie';
import FollowingDetailsCard from '../followerDetailsCard';
import Header from '../Header';
import ReactLoaderSpinner from '../reactSpinner';
import PostDetails from '../postDetails';
import UserProfile from '../userProfile';
import { VscFeedback } from "react-icons/vsc";
import { BsCameraReels } from "react-icons/bs";
import './index.css'

class FollowersList extends Component {
    state = {
        FollowersList: '',
        followingsList: [],
        selectedId: '', 
        selectedUserDetails: {},
        postDetails: [],
        loadingFollowerList: false
    }

    componentDidMount() {
        this.gettingFollowersDetails()
    }

    isUserSelected = (selectedId) => {
        this.setState({selectedId: selectedId})
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
    
    render() {
        const {followersList, followingsList, selectedUserDetails, selectedId, postDetails, loadingFollowerList} = this.state
        const profileUtility = selectedId === ''? 'noneDisplay' : ''
        const followingUtility = selectedId !== ''? 'noneDisplay' : '' 
        return (
            <>
                <Header />
                {loadingFollowerList? <ReactLoaderSpinner /> :<div className='main-container-followers-list'>
                    <div className={`followers-list-card ${followingUtility}`}>
                        <h1 className='followers-heading'>Followers</h1>
                        {followersList && followersList.length > 0 ? (
                            followersList.map((each, index) => (
                                <FollowingDetailsCard key={index} userDetails={each} isFollowing={followingsList.includes(each.user_id)} isSuggested={undefined} userProfileDetails={this.isUserSelected} />
                            ))
                        ) : (
                            <p>No users found</p>
                        )}
                    </div>
                    <div className={`profile-card-user ${profileUtility}`}>
                        {selectedId !== "" ?<UserProfile selectedId={selectedId} followingsList={followingsList} isFollowing={followingsList.includes(selectedId)} isSuggested={undefined} /> : <p>Select Follower to View Profile</p> }
                    </div>
                </div>}
            </>
        )
    }
}

export default FollowersList
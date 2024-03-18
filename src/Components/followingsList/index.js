import { Component } from 'react';
import Cookies from 'js-cookie';
import FollowingDetailsCard from '../followerDetailsCard';
import Header from '../Header';
import UserProfile from '../userProfile';
import ReactLoaderSpinner from '../reactSpinner';
import './index.css'

class FollowingList extends Component {
    state = {FollowingList: '', selectedId:"", loadingFollowingList: false}

    componentDidMount() {
        this.gettingFollowingDetails()
    }

    isUserSelected = (selectedId) => {
        this.setState({selectedId: selectedId})
    }

    gettingFollowingDetails = async() => {
        const jwtToken = Cookies.get('jwt_token')
        const userId = Cookies.get('user_id')
        this.setState({loadingFollowingList: true})
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
    
    render() {
        const {followingList, selectedId, loadingFollowingList} = this.state
        const profileUtility = selectedId === ''? 'noneDisplay' : ''
        const followingUtility = selectedId !== ''? 'noneDisplay' : '' 
        return (
            <>
                <Header />
                {loadingFollowingList? <ReactLoaderSpinner /> :<div className='main-container-following-list'>
                    <div className={`following-list-card ${followingUtility}`}>
                        <h1 className='following-heading'>Following</h1>
                        {followingList && followingList.length > 0 ? (
                            followingList.map((each, index) => (
                                <FollowingDetailsCard key={index} userDetails={each} isFollowing='true' isSuggested={undefined} userProfileDetails={this.isUserSelected}/>
                            ))
                        ) : (
                            <p>No users found</p>
                        )}
                    </div>
                    <div className={`profile-card-user ${profileUtility}`}>
                        {selectedId !== "" ?<UserProfile selectedId={selectedId} followingsList={""} isFollowing='true' isSuggested={undefined} /> : "Select User to View Profile"}
                    </div>
                </div>}
            </>
        )
    }
}

export default FollowingList
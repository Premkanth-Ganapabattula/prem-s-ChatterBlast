import { Component } from "react";
import FollowingDetailsCard from '../followerDetailsCard';
import Header from '../Header';
import Cookies from "js-cookie";
import UserProfile from '../userProfile';
import ReactLoaderSpinner from "../reactSpinner";
import './index.css'

class SuggestedUserList extends Component {
    state = {suggestedUsers: [], selectedId: '', loadingSuggestions:false}

    componentDidMount() {
        try {
            const { location } = this.props;
            const { state } = location;
            const { user_id } = state;
            this.setState({selectedId: user_id})
            this.gettingSuggestedusers()            
        } catch (error) {
            this.gettingSuggestedusers()
        }
    }

    isUserSelected = (selectedId) => {
        this.setState({selectedId: selectedId})
    }
    
    gettingSuggestedusers = async () => {
        const jwtToken = Cookies.get('jwt_token')
        const userId = Cookies.get('user_id')
        this.setState({loadingSuggestions: true})
        const url = `https://chatterblast-server.onrender.com/user/details/${userId}`
        const options = {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${jwtToken}` 
          }
        }
        const response = await fetch(url, options)
        const data = await response.json()
        this.setState({suggestedUsers: data.userDetails, loadingSuggestions: false})
      }

    render() {
        const {suggestedUsers, selectedId, loadingSuggestions} = this.state
        const profileUtility = selectedId === ''? 'noneDisplay' : ''
        const followingUtility = selectedId !== ''? 'noneDisplay' : '' 
        return(
            <>
                <Header />
                <div className='main-container-suggestions-list'>
                    {loadingSuggestions? <ReactLoaderSpinner /> :<div className={`suggestions-list-card ${followingUtility}`}>
                        <h1 className='following-heading'>Suggestions</h1>
                        {suggestedUsers && suggestedUsers.length > 0 ? (
                            suggestedUsers.map((each, index) => (
                                <FollowingDetailsCard key={index} userDetails={each} isSuggested={'True'} userProfileDetails={this.isUserSelected} />
                            ))
                        ) : (
                            <p>No users found</p>
                        )}
                    </div>}
                    <div className={`profile-card-user ${profileUtility}`}>
                        {selectedId !== "" ?<UserProfile selectedId={selectedId} followingsList={""} isFollowing='true' isSuggested={'True'} /> : "Select User to View Profile"}
                    </div>
                </div>
            </>
        )
    }
}

export default SuggestedUserList

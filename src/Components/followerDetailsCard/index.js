import { Component } from 'react'
import {Link} from 'react-router-dom'

import './index.css'

class FollowerDetailsCard extends Component {
    state = {isFriendRequestSent: false}

    onClickOpenContainer = () => {
        const {userProfileDetails} = this.props
        const {user_id} = this.props.userDetails
        userProfileDetails(user_id)
    }

    renderingButtons = () => {
        const {userDetails, isFollowing, isSuggested} = this.props

        if (isSuggested !== undefined) {
            return <button type='button' className='buttons-followers'>Follow</button>
        } else {
            if(isFollowing){
                return <button type='button' className='buttons-followers'>Following</button>
            } else {
                return <button type='button' className='buttons-followers'>Follow Back</button>
            }
        }
    }
    
    render() {
        const {userDetails, isFollowing, isSuggested} = this.props
        const {profilePhotoBlob, username, first_name, last_name} = userDetails
        return (
            <>
            <div className='user-card'>
                <div className='image-content'  onClick={this.onClickOpenContainer}>
                    <div className='profile-card-h'>
                        <img src={`data:image/jpeg;base64,${profilePhotoBlob}`} alt={username} className='profile-photo-h' />
                    </div>
                    <div className='username-name'>             
                        <p className='username'>{username}</p>
                        <p className='name_of_user'>{first_name + " " + last_name}</p>
                    </div>
                </div>
                <div className='button-card'>
                    {this.renderingButtons()}
                </div>      
            </div>
            <div className='card-small-devices'>
            <Link to="/suggestions/user" className='card-small-devices'>
                <div className='image-content'  onClick={this.onClickOpenContainer}>
                    <div className='profile-card-h'>
                        <img src={`data:image/jpeg;base64,${profilePhotoBlob}`} alt={username} className='profile-photo-h' />
                    </div>
                    <div className='username-name'>             
                        <p className='username'>{username}</p>
                        <p className='name_of_user'>{first_name + " " + last_name}</p>
                    </div>
                </div>      
            </Link>
            <div className='button-card'>
                {this.renderingButtons()}
            </div>
            </div>
            </>
        )
    }
}

export default FollowerDetailsCard
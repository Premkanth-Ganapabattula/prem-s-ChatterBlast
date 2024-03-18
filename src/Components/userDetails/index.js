import { Component } from 'react'
import Cookies from 'js-cookie'
import moment from 'moment'
import {Link} from 'react-router-dom'

import './index.css'
import { PiNotificationBold } from 'react-icons/pi'

class UserDetails extends Component {
    state = {isFriendRequestSent: false}

    onClickCancelButton = async () => {
        const {user_id} = this.props.userDetails
        const jwtToken = Cookies.get('jwt_token')
        const requestedUserId = Cookies.get('user_id')
        const friendRequestBody = {
            requestSentBy : requestedUserId,
            requestSentTo : user_id
        }
        const url = 'https://chatterblast-server.onrender.com/delete/friend/request/'
        const options = {
            method: 'POST',
            headers: {
                Accept: 'application.json',
                'Content-Type': 'application/json',
                Authorization: `Bearer ${jwtToken}` 
              },
            body: JSON.stringify(friendRequestBody)
        }

        const response = await fetch(url, options)
        const data = await response.json()
        console.log(data)
        if (data.message === 'Deleted Success') {
            this.setState({isFriendRequestSent: false})
        }

    }

    onClickAddButton = async () => {
        const {user_id} = this.props.userDetails
        const jwtToken = Cookies.get('jwt_token')
        const requestedUserId = Cookies.get('user_id')
        const time = new Date()
        const utcString = moment(time).utc().format();

        const friendRequestBody = {
            requestSentBy : requestedUserId,
            requestSentTo : user_id,
            utcTime : utcString
        }
        const url = 'https://chatterblast-server.onrender.com/friend/request/'
        const options = {
            method: 'POST',
            headers: {
                Accept: 'application.json',
                'Content-Type': 'application/json',
                Authorization: `Bearer ${jwtToken}` 
              },
            body: JSON.stringify(friendRequestBody)
        }

        const response = await fetch(url, options)
        const data = await response.json()
        if (data.message === 'Upload Success') {
            this.setState({isFriendRequestSent: true})
            const notificationUrl = `https://chatterblast-server.onrender.com/add/notification`
            const notificationBody = {
                notificationBy: requestedUserId,
                notificationToo: user_id,
                notificationType: 'request',
                notificationText: 'sent you a Follow Request',
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

    renderingSuggestedUsers = () => {
        const {userDetails, isAccepted} = this.props
        const {profilePhotoBlob, username, first_name, last_name} = userDetails
        const {isFriendRequestSent} = this.state
        return (
            <div className='image-content'>
                <div className='profile-card-h'>
                    <img src={`data:image/jpeg;base64,${profilePhotoBlob}`} alt={username} className='profile-photo-h' />
                </div>
                <div className='username-name'>                
                    <p className='username'>{username}</p>
                    <p className='name_of_user'>{first_name + " " + last_name}</p>
                </div>
            </div>
        )
    }

    render() {
        const {userDetails, isAccepted} = this.props
        const {profilePhotoBlob, username, first_name, last_name, user_id} = userDetails
        const {isFriendRequestSent} = this.state
        return (
            <div className='user-card-s'>
                <Link to={{
                            pathname:'/suggested/user',
                            state: { user_id: user_id}
                        }} className="link-for-large-devices">
                    {this.renderingSuggestedUsers()}
                </Link>
                <Link to={{
                    pathname:'/',
                    state: {user_id: user_id}
                }} className="link-for-small-devices">
                    {this.renderingSuggestedUsers()}
                </Link>
                <div className='button-card'>
                    {isAccepted? <button type='button' className='buttons'>Following</button> :
                       isFriendRequestSent? <button className='buttons' onClick={this.onClickCancelButton}>Requested</button>
                    : <button className='buttons' onClick={this.onClickAddButton}>Follow</button>
                    }
                </div>      
            </div>
        )
    }
}

export default UserDetails
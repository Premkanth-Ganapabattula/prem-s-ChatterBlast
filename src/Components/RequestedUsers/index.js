import { Component } from 'react'
import Cookies from 'js-cookie'
import moment from 'moment'

import './index.css'

class RequestedUsers extends Component {
    state = {isFriendRequestSent: false}

    onClickRemoveButton = async () => {
        const {user_id} = this.props.userDetails
        const jwtToken = Cookies.get('jwt_token')
        const requestedUserId = Cookies.get('user_id')
        const friendRequestBody = {
            requestSentBy : user_id,
            requestSentTo : requestedUserId
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

    onClickAcceptButton = async () => {
        const {user_id} = this.props.userDetails
        const jwtToken = Cookies.get('jwt_token')
        const requestedUserId = Cookies.get('user_id')
        const time = new Date()
        const utcString = moment(time).utc().format();

        const addFollower = {
            following : requestedUserId,
            follower : user_id
        }
        const url = 'https://chatterblast-server.onrender.com/following/followers/user/'
        const options = {
            method: 'POST',
            headers: {
                Accept: 'application.json',
                'Content-Type': 'application/json',
                Authorization: `Bearer ${jwtToken}` 
              },
            body: JSON.stringify(addFollower)
        }

        const response = await fetch(url, options)
        const data = await response.json()
        if (data.message === 'Upload Success') {
            const addMessage = {
                messageSentBy : requestedUserId,
                messageSentToo : user_id,
                messageContent: 'Say Hi',
                messageType: 'systemText',
                messagedTime: utcString
            }
            
            const messageUrl = 'https://chatterblast-server.onrender.com/post/messages/'
            const options = {
                method: 'POST',
                headers: {
                    Accept: 'application.json',
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${jwtToken}` 
                  },
                body: JSON.stringify(addMessage)
            }
            const response = await fetch(messageUrl, options)
            const data = await response.json()
            console.log(data.message)

            const notificationUrl = `https://chatterblast-server.onrender.com/add/notification`
            const notificationBody = {
                notificationBy: requestedUserId,
                notificationToo: user_id,
                notificationType: 'accept',
                notificationText: 'accepted Follow Request',
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
            const notificationData = await notificationResponse.json()
        }


    }
    render() {
        const {userDetails} = this.props
        const {profilePhotoBlob, username, first_name, last_name} = userDetails
        return (
            <div className='requested-user-card'>
                <div className='image-content'>
                    <div className='profile-card-requeted'>
                        <img src={`data:image/jpeg;base64,${profilePhotoBlob}`} alt={username} className='profile-photo-h' />
                    </div>
                    <div className='username-name'>                
                        <p className='username'>{username}</p>
                        <p className='name_of_user'>{first_name + " " + last_name}</p>
                    </div>
                </div>
                <div className='button-card-requested'>
                    <button className='buttons' onClick={this.onClickAcceptButton}>Accept</button>
                    <button className='buttons' onClick={this.onClickRemoveButton}>Remove</button>
                </div>      
            </div>
        )
    }
}

export default RequestedUsers

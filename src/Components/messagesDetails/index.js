import { Component } from "react";
import { PiDotsThree } from "react-icons/pi";
import {Link} from 'react-router-dom';
import './index.css'


class MessagesDetails extends Component {
    state ={}

    onClickMessageCard = () => {
        const {userDetails, gettingChatDetails} = this.props;
        gettingChatDetails(userDetails.user_id)
    }

    render() {
        const {userDetails} = this.props
        const {last_message, username, profile_photo, last_message_time, user_id} = userDetails
        const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
        const date = new Date(last_message_time)
        const lastMessageTime= date.toLocaleString(undefined, { timeZone: timezone });
        return (
            <>
                <div className="messages-main-container-large" onClick={this.onClickMessageCard}>
                    <div className="profile-photo-three-dots">
                        <div className="profile-message-content">
                            <div className="profile_photo_in_messages_card">
                                {profile_photo && <img src={`https://chatterblast-server.onrender.com/profile/photo/stream/${profile_photo}`} alt="profile" className="profile-message"/>}
                            </div>
                            <div className="username-last-message">
                                <p className="username-message">{username}</p>
                                <p className="last-message">{last_message}</p>
                            </div>
                        </div>
                        <div className="messages-three-dots">
                            <PiDotsThree />
                            <p className="message-sent-time">{lastMessageTime}</p>
                        </div>
                    </div>
                </div>
                <div className="message-main-container-small">
                    <Link 
                        to={{
                            pathname:'/converstion',
                            state: { user_id: user_id }
                        }}
                        className="message-user-small"
                    >
                        <div className="profile-photo-three-dots">
                            <div className="profile-message-content">
                                <div className="profile_photo_in_messages_card">
                                    <img src={`https://chatterblast-server.onrender.com/profile/photo/stream/${profile_photo}`} alt="profile" className="profile-message"/>
                                </div>
                                <div className="username-last-message">
                                    <p className="username-message">{username}</p>
                                    <p className="last-message">{last_message}</p>
                                </div>
                            </div>
                            <div className="messages-three-dots">
                                <PiDotsThree />
                                <p className="message-sent-time">{lastMessageTime}</p>
                            </div>
                        </div>
                    </Link>
                </div>
            </>
        )
    }
}

export default MessagesDetails
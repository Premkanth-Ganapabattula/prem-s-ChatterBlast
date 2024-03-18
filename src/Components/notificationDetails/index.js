import { Component } from "react";
import { BsThreeDotsVertical } from "react-icons/bs";
import './index.css'

class NotificationDetails extends Component {

    render() {
        const {notificationDetails} = this.props
        const {profile_photo, username, notification_text, notification_time} = notificationDetails
        const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
        const date = new Date(notification_time)
        const notificationTime= date.toLocaleString(undefined, { timeZone: timezone });
        return (
            <div className="notification-main-card">
                <div className="profile-notification-content">
                    <img src={`https://chatterblast-server.onrender.com/profile/photo/stream/${profile_photo}`} alt="profile" className="profile-notification" />
                    <p className="notification-text">{username} {notification_text}</p>
                </div>
                <div className="notification-time-three-dots">
                    <BsThreeDotsVertical />
                    <p className="notification-time">{notificationTime}</p>
                </div>
            </div>
        )
    }
}

export default NotificationDetails;

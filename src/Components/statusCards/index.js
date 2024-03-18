import { Component } from "react";

import './index.css'

class StatusCard extends Component {
    state = {}

    render() {
        const {userDetails} = this.props
        const {profile_photo, username} = userDetails
        return (
            <div className="status-card-main-container">
                <div className="space-container">
                    <div className="profile-status-card-container">
                        <img src={`https://chatterblast-server.onrender.com/profile/photo/stream/${profile_photo}`} alt={username} className="profile-image-status-card" />
                    </div>
                </div>
            </div>
        )
    }
}

export default StatusCard

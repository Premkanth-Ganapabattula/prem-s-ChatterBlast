import { Component } from "react";
import Header from "../Header";
import Cookies from "js-cookie";
import ReactLoaderSpinner from "../reactSpinner";
import NotificationDetails from "../notificationDetails";

import './index.css'

class Notifications extends Component {
    state={notificationDetails: [], loadingNotifications: false}

    componentDidMount() {
        this.gettingNotificationDetails()
    }

    gettingNotificationDetails = async() => {
        const jwtToken = Cookies.get('jwt_token')
        const userId = Cookies.get('user_id')
        this.setState({loadingNotifications: true})
        const url = `https://chatterblast-server.onrender.com/get/notifications/${userId}`
        const options = {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${jwtToken}` 
          }
        }
        const response = await fetch(url, options)
        const data = await response.json()
        this.setState({notificationDetails: data.notificationDetails, loadingNotifications: false})
      }

    render(){
        const {notificationDetails, loadingNotifications} = this.state
        return (
            <>
                <Header />
                {loadingNotifications? <ReactLoaderSpinner/> :<div className="notification-container-small-devices">
                {notificationDetails && notificationDetails.length > 0 ? (
                    notificationDetails.map((each, index) => (
                        <NotificationDetails key={index} notificationDetails={each} />
                    ))
                    ) : (
                        <p>No notifications found</p>
                    )}
                </div>}
            </>
        )
    }
} 

export default Notifications

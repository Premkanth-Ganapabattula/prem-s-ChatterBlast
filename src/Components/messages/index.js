import { Component } from "react";
import Cookies from "js-cookie";
import MessagesDetails from "../messagesDetails";
import Header from "../Header";
import ReactLoaderSpinner from "../reactSpinner";

import './index.css'

class Messages extends Component {
    state = {messagedUsers: [], loadingMessages: false}

    componentDidMount() {
        this.gettingMessages()
    }

    gettingMessages = async () => {
        const jwtToken = Cookies.get('jwt_token')
        const userId = Cookies.get('user_id')
        this.setState({loadingMessages: true})
        const url = `https://chatterblast-server.onrender.com/messaged/users/${userId}`
        const options = {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${jwtToken}`
          }
        }
    
        const response = await fetch(url, options)
        const data = await response.json()
        this.setState({messagedUsers: data.messagedUsers, loadingMessages: false})
      }

    render() {
        const {messagedUsers, loadingMessages} = this.state
        const sortedMessagedUsers = messagedUsers.sort((a, b) => new Date(b.last_message_time) - new Date(a.last_message_time));
        return (
            <>
                <Header />
                    {loadingMessages? <ReactLoaderSpinner /> :<div className="persons-messages-main-container">
                    {sortedMessagedUsers && sortedMessagedUsers.length > 0 ? (
                        sortedMessagedUsers.map((each, index) => (
                            <MessagesDetails key={index} userDetails={each} gettingChatDetails={this.gettingChatDetails} />
                        ))
                    ) : (
                        <p>No users found</p>
                    )}
                </div>}
            </>
        )
    }
}

export default Messages;

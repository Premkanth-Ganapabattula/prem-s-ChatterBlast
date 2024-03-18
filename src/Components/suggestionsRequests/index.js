import { Component } from "react";
import Header from "../Header";
import Cookies from "js-cookie";
import UserDetails from "../userDetails";
import RequestedUsers from "../RequestedUsers";
import ReactLoaderSpinner from "../reactSpinner";

import './index.css'

class SuggestionsRequests extends Component {
    state = {
      suggestedUsers: '', 
      requestedUsers: '', 
      acceptedUserId: '',
      loadingRequests: false,
      loadingSuggestions: false
    }

    componentDidMount() {
        this.setupWebSocket();
        this.gettingRequestOfUser();
        this.gettingSuggestedusers(); // Corrected function name
      }
    
      componentWillUnmount() {
        this.closeWebSocket();
      }
    
      setupWebSocket = () => {
        this.socket = new WebSocket(`wss://chatterblast-server.onrender.com/`);
        this.socket.onopen = () => {
          console.log('WebSocket connection established');
        };
        this.socket.onmessage = (event) => {
          const message = JSON.parse(event.data);
          if (message.type === 'newFriendRequest') {
            /*const newRequest = message.payload;
            this.setState((prevState) => ({
              requests: [...prevState.requests, newRequest],
            })); */
            this.gettingRequestOfUser()
          } else if (message.type === 'newFriend') {
            this.gettingRequestOfUser()
            const acceptedUserId = message.payload;
            this.setState({acceptedUserId: acceptedUserId.following})
          }
        };
        this.socket.onerror = (error) => {
          console.error('WebSocket error:', error);
        };
      };
    
      closeWebSocket = () => {
        if (this.socket && this.socket.readyState === WebSocket.OPEN) {
          this.socket.close();
          console.log('WebSocket connection closed');
        }
      };

      gettingRequestOfUser = async () => {
        const jwtToken = Cookies.get('jwt_token')
        const userId = Cookies.get('user_id')
        this.setState({loadingRequests: true})
        const url = `https://chatterblast-server.onrender.com/requests/user/${userId}`
        const options = {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${jwtToken}` 
          }
        }
        const response = await fetch(url, options)
        const data = await response.json()
        this.setState({requestedUsers: data.requests, loadingRequests: false})
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
        const {suggestedUsers, acceptedUserId, requestedUsers, loadingRequests, loadingSuggestions} = this.state
        return (
            <>
                <Header />
                <div className="main-container-for-suggestions-and-requests">
                    {loadingRequests? <ReactLoaderSpinner /> :<div className="requested-users">
                        <p className="side-heading-suggestions-requests">Requests</p>
                        {requestedUsers && requestedUsers.length > 0 ? (
                            requestedUsers.map((each, index) => (
                            <RequestedUsers key={index} userDetails={each} />
                            ))
                        ) : (
                            <p>No requests found</p>
                        )}
                    </div>}
                    {loadingSuggestions? <ReactLoaderSpinner /> :<div className="suggested-users">
                        <p className='side-heading-suggestions-requests'>Suggestions</p>
                        {suggestedUsers && suggestedUsers.length > 0 ? (
                            suggestedUsers.map((each, index) => (
                                <UserDetails key={index} userDetails={each} isAccepted={each.user_id === acceptedUserId} />
                            ))
                        ) : (
                            <p>No users found</p>
                        )}
                    </div>}
                </div>
            </>
        )
    }
}

export default SuggestionsRequests;
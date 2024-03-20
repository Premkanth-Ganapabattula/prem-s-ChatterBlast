import React, { Component } from "react";
import Cookies from "js-cookie";
import ChatDetails from "../chatDetails";
import ChatDetailsSmallDevices from "../chatDetailsSmallDevices";
import { IoMdSend } from "react-icons/io";
import { PiDotsThreeOutlineVerticalFill } from "react-icons/pi";
import { ImAttachment } from "react-icons/im";
import { HiOutlineEmojiHappy } from "react-icons/hi";
import moment from "moment";
import './index.css'

class ConverstionDetails extends Component {
    state = {chatDetails: [], selectedId: '', selectedUser: {}, messageFromInput: ''}

    containerRef = React.createRef();

    onChangeMessage = event => {
        this.setState({messageFromInput: event.target.value})
    }

    componentDidMount() {
        const { location } = this.props;
        const { state } = location;
        const { user_id } = state;
        this.gettingChatDetails(user_id)
    }

    componentDidUpdate() {
        // Scroll to the bottom of the container on component update
        if (this.containerRef.current) {
            this.containerRef.current.scrollTop = this.containerRef.current.scrollHeight;
        }
    }
    
    gettingChatDetails = async(messageId) => {
        const jwtToken = Cookies.get('jwt_token')
        const userId = Cookies.get('user_id')
        const url = `https://chatterblast-server.onrender.com/get/chat/details/${userId}/${messageId}`
        const options = {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${jwtToken}` 
          }
        }
        const response = await fetch(url, options)
        const data = await response.json()
        this.setState({chatDetails: data.chatDetails, selectedId: messageId}, this.chatSeletedUserDetails)
    }

    chatSeletedUserDetails = async() => {
        const {selectedId} = this.state
        const jwtToken = Cookies.get('jwt_token')
        const url = `https://chatterblast-server.onrender.com/profile/details/${selectedId}`
        const options = {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${jwtToken}` 
          }
        }
        const response = await fetch(url, options)
        const data = await response.json()
        console.log(data.userDetails)
        this.setState({selectedUser: data.userDetails})    
    }

    deleteMessageForme = (messageId) => {
      const {chatDetails} = this.state
      const updatedchatDetails = chatDetails.filter(each => each.message_id !== messageId);
      this.setState({chatDetails: updatedchatDetails})
    }

    onClickSendIcon = async() => {
        const jwtToken = Cookies.get('jwt_token')
        const messageSentBy = Cookies.get('user_id')
        const {selectedId, messageFromInput, selectedUser, messagedUsers} = this.state
        const messageString = messageFromInput.trim()
        if (messageString !== ""){
        const time = new Date()
        const utcString = moment(time).utc().format();
        const addMessage = {
          messageSentBy : messageSentBy,
          messageSentToo : selectedId,
          messageContent: messageString,
          messageType: 'text',
          messagedTime: utcString
      }
    
      const newMessage = {
        message_sent_by : messageSentBy,
        message_sent_too : selectedId,
        message_content: messageString,
        message_type: 'text',
        message_sent_time: utcString
      }

    
      this.setState(prevState => ({
        chatDetails : [...prevState.chatDetails, newMessage],
        messageFromInput: ''
      }))
    
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
      }
    }

    render() {
        const{selectedUser, chatDetails, messageFromInput} = this.state
        return(
            <div className="main-container-chat-details-small">
                <div className='profile-bar-chat-small'>
                  <div className="profile-photo-three-dots">
                      <div className="profile-message-content">
                          <div className="profile_photo_in_messages_card">
                              {selectedUser.profile_photo && <img src={`https://chatterblast-server.onrender.com/profile/photo/stream/${selectedUser.profile_photo}`} alt="profile" className="profile-bar-message"/>}
                          </div>
                          <div className="username-last-message">
                              <p className="username-message">{selectedUser.username}</p>
                              <p className="last-message">Online</p>
                          </div>
                      </div>
                      <div className="messages-three-dots">
                          <PiDotsThreeOutlineVerticalFill />
                      </div>
                  </div>
                </div>
                <div className='chat-details-card-small' ref={this.containerRef}>
                  {chatDetails && chatDetails.length > 0 ? (
                      chatDetails.map((each, index) => (
                      <ChatDetails key={index} chatDetails={each} deleteMessageForMe={this.deleteMessageForme} />
                      ))
                  ) : (
                      <p>Start converstion</p>
                  )}
                </div>
                <div className='input-elements-for-messages-small'>
                  <div className="input-container">
                    <ImAttachment />
                    <HiOutlineEmojiHappy />
                    <input type="text" required value={messageFromInput} className='input-element-in-messages' placeholder='Write Message Here' onChange={this.onChangeMessage}/>
                    <IoMdSend className="send-icon" onClick={this.onClickSendIcon}/>
                  </div>
                  {/*<input type="file" className='file-input-element' />*/}             
                </div>
            </div>
        )
    }
}

export default ConverstionDetails;

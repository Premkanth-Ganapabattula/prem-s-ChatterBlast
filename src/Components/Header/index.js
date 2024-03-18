import React, { Component } from 'react';
import {Link, Redirect, withRouter} from 'react-router-dom'
import { FaMapMarkedAlt } from "react-icons/fa";
import { HiMiniVideoCamera } from "react-icons/hi2";
import { IoMdHome } from "react-icons/io";
import { IoIosNotifications } from "react-icons/io";
import { FaMessage } from "react-icons/fa6";
import { FaPersonShelter } from "react-icons/fa6";
import { IoCloseSharp } from "react-icons/io5";
import MessagesDetails from '../messagesDetails'
import ChatDetails from '../chatDetails';
import Modal from 'react-modal'
import { IoMdSend } from "react-icons/io";
import { PiDotsThreeOutlineVerticalFill } from "react-icons/pi";
import NotificationDetails from '../notificationDetails';
import VoiceControlledComponent from '../mikeTest3';
import { ImAttachment } from "react-icons/im";
import { HiOutlineEmojiHappy } from "react-icons/hi";
import { IoSearch } from "react-icons/io5";
import moment from 'moment';
import ReactLoaderSpinner from '../reactSpinner';
import VoiceMessagePlayerRecorderText from '../text2';


import Cookies from 'js-cookie'

import './index.css'


const languagesList = [
  { "code": "af", "name": "Afrikaans" },
  { "code": "sq", "name": "Albanian" },
  { "code": "am", "name": "Amharic" },
  { "code": "ar", "name": "Arabic" },
  { "code": "hy", "name": "Armenian" },
  { "code": "az", "name": "Azerbaijani" },
  { "code": "eu", "name": "Basque" },
  { "code": "be", "name": "Belarusian" },
  { "code": "bn", "name": "Bengali" },
  { "code": "bs", "name": "Bosnian" },
  { "code": "bg", "name": "Bulgarian" },
  { "code": "ca", "name": "Catalan" },
  { "code": "ceb", "name": "Cebuano" },
  { "code": "ny", "name": "Chichewa" },
  { "code": "zh-cn", "name": "Chinese (Simplified)" },
  { "code": "zh-tw", "name": "Chinese (Traditional)" },
  { "code": "co", "name": "Corsican" },
  { "code": "hr", "name": "Croatian" },
  { "code": "cs", "name": "Czech" },
  { "code": "da", "name": "Danish" },
  { "code": "nl", "name": "Dutch" },
  { "code": "en", "name": "English" },
  { "code": "eo", "name": "Esperanto" },
  { "code": "et", "name": "Estonian" },
  { "code": "tl", "name": "Filipino" },
  { "code": "fi", "name": "Finnish" },
  { "code": "fr", "name": "French" },
  { "code": "fy", "name": "Frisian" },
  { "code": "gl", "name": "Galician" },
  { "code": "ka", "name": "Georgian" },
  { "code": "de", "name": "German" },
  { "code": "el", "name": "Greek" },
  { "code": "gu", "name": "Gujarati" },
  { "code": "ht", "name": "Haitian Creole" },
  { "code": "ha", "name": "Hausa" },
  { "code": "haw", "name": "Hawaiian" },
  { "code": "iw", "name": "Hebrew" },
  { "code": "hi", "name": "Hindi" },
  { "code": "hmn", "name": "Hmong" },
  { "code": "hu", "name": "Hungarian" },
  { "code": "is", "name": "Icelandic" },
  { "code": "ig", "name": "Igbo" },
  { "code": "id", "name": "Indonesian" },
  { "code": "ga", "name": "Irish" },
  { "code": "it", "name": "Italian" },
  { "code": "ja", "name": "Japanese" },
  { "code": "jw", "name": "Javanese" },
  { "code": "kn", "name": "Kannada" },
  { "code": "kk", "name": "Kazakh" },
  { "code": "km", "name": "Khmer" },
  { "code": "ko", "name": "Korean" },
  { "code": "ku", "name": "Kurdish (Kurmanji)" },
  { "code": "ky", "name": "Kyrgyz" },
  { "code": "lo", "name": "Lao" },
  { "code": "la", "name": "Latin" },
  { "code": "lv", "name": "Latvian" },
  { "code": "lt", "name": "Lithuanian" },
  { "code": "lb", "name": "Luxembourgish" },
  { "code": "mk", "name": "Macedonian" },
  { "code": "mg", "name": "Malagasy" },
  { "code": "ms", "name": "Malay" },
  { "code": "ml", "name": "Malayalam" },
  { "code": "mt", "name": "Maltese" },
  { "code": "mi", "name": "Maori" },
  { "code": "mr", "name": "Marathi" },
  { "code": "mn", "name": "Mongolian" },
  { "code": "my", "name": "Myanmar (Burmese)" },
  { "code": "ne", "name": "Nepali" },
  { "code": "no", "name": "Norwegian" },
  { "code": "ps", "name": "Pashto" },
  { "code": "fa", "name": "Persian" },
  { "code": "pl", "name": "Polish" },
  { "code": "pt", "name": "Portuguese" },
  { "code": "pa", "name": "Punjabi" },
  { "code": "ro", "name": "Romanian" },
  { "code": "ru", "name": "Russian" },
  { "code": "sm", "name": "Samoan" },
  { "code": "gd", "name": "Scots Gaelic" },
  { "code": "sr", "name": "Serbian" },
  { "code": "st", "name": "Sesotho" },
  { "code": "sn", "name": "Shona" },
  { "code": "sd", "name": "Sindhi" },
  { "code": "si", "name": "Sinhala" },
  { "code": "sk", "name": "Slovak" },
  { "code": "sl", "name": "Slovenian" },
  { "code": "so", "name": "Somali" },
  { "code": "es", "name": "Spanish" },
  { "code": "su", "name": "Sundanese" },
  { "code": "sw", "name": "Swahili" },
  { "code": "sv", "name": "Swedish" },
  { "code": "tg", "name": "Tajik" },
  { "code": "ta", "name": "Tamil" },
  { "code": "te", "name": "Telugu" },
  { "code": "th", "name": "Thai" },
  { "code": "tr", "name": "Turkish" },
  { "code": "uk", "name": "Ukrainian" },
  { "code": "ur", "name": "Urdu" },
  { "code": "ug", "name": "Uyghur" },
  { "code": "uz", "name": "Uzbek" },
  { "code": "vi", "name": "Vietnamese" },
  { "code": "cy", "name": "Welsh" },
  { "code": "xh", "name": "Xhosa" },
  { "code": "yi", "name": "Yiddish" },
  { "code": "yo", "name": "Yoruba" },
  { "code": "zu", "name": "Zulu" }
]
class Header extends Component {
  state = {
    profilePhoto: '',
    redirect: false, 
    isCardOpen: false, 
    displayMesssagesModalcard: 'false', 
    isChatSelected: false, 
    selectedId: '', 
    messageFromInput: ''
  }

  constructor(props) {
    super(props);
    this.state = {
      isCardOpen: false,
      messagedUsers: [],
      chatDetails: [],
      isChatSelected: false,
      messageFromInput: '',
      selectedUser: {},
      isNotificationCard: false,
      notificationDetails: [],
      loadingMessagedUsers: false,
      loadingSelectedUser: false,
      loadingNotifications: false
    };
    this.containerRef = React.createRef();
    this.socket = null;    
  }

  toggleCard = () => {
    this.setState({isCardOpen: true})
  }

  handleCardClick = (e) => {
    e.stopPropagation(); // Prevent card click from closing the card
  };

  handleOutsideClick = () => {
    this.setState({isCardOpen: false})
  };

  handleOutSideClickNotification = () => {
    this.setState({isNotificationCard: false})
  }

  onClickMessagesIcon = () => {
    this.setState({displayMesssagesModalcard: true})
    this.gettingMessages()
  }

  onClickMessageCardCloseIcon = () => {
    this.setState({displayMesssagesModalcard: false})
  }

  componentDidMount() {
    this.userAdditionalDetails()
    this.setupWebSocket()
  }

  componentDidUpdate() {
    // Scroll to the bottom of the container on component update
    if (this.containerRef.current) {
      this.containerRef.current.scrollTop = this.containerRef.current.scrollHeight;
    }
  }

  componentWillUnmount() {
  }

  setupWebSocket = () => {
    this.socket = new WebSocket(`wss://chatterblast-server.onrender.com/`);
    this.socket.onopen = () => {
      console.log('WebSocket connection established');
    };
    this.socket.onmessage = (event) => {
      const message = JSON.parse(event.data);
      const {selectedId} = this.state
      const {payload} = message
      const {message_sent_by, message_id} = payload
      const userId = Cookies.get('user_id')
      if (message.type === 'newMessage') {
        /*const newRequest = message.payload;
        this.setState((prevState) => ({
          requests: [...prevState.requests, newRequest],
        }));*/
        this.gettingMessages()
        const isMessageIdUnique = !this.state.chatDetails.some(array => array.message_id === message_id);

        if ((selectedId === message_sent_by && isMessageIdUnique) || userId === message_sent_by) {
            this.setState(prevState => ({
                chatDetails: [...prevState.chatDetails, payload]
            }));
        }
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


  onClickLogout = () => {
    Cookies.remove('jwt_token')
    Cookies.remove('user_id')
    this.setState({redirect: true})
  }

  onChangeMessage = event => {
    this.setState({messageFromInput: event.target.value})
  }

  gettingMessages = async () => {
    const jwtToken = Cookies.get('jwt_token')
    const userId = Cookies.get('user_id')
    this.setState({loadingMessagedUsers: true})
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
    this.setState({messagedUsers: data.messagedUsers, loadingMessagedUsers: false})
  }


  gettingChatDetails = async(messageId) => {
    const jwtToken = Cookies.get('jwt_token')
    const userId = Cookies.get('user_id')
    this.setState({loadingSelectedUser: true})
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
    this.setState({chatDetails: data.chatDetails, isChatSelected: true, selectedId: messageId, loadingSelectedUser: false}, this.chatSeletedUserDetails)
  }

  gettingNotificationDetails = async() => {
    const jwtToken = Cookies.get('jwt_token')
    const userId = Cookies.get('user_id')
    this.setState({isNotificationCard: true, loadingNotifications: true})
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


  userAdditionalDetails = async () => {
    const jwtToken = Cookies.get('jwt_token')
    const userId = Cookies.get('user_id')
    const url = `https://chatterblast-server.onrender.com/profile/details/${userId}`
    const options = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${jwtToken}` 
      }
    }
    const response = await fetch(url, options)
    const data = await response.json()
    this.setState({profilePhoto: data.userDetails.profile_photo})
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
    console.log(data)
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

  const newMessagedUser = {
    profile_photo : selectedUser.profile_photo,
    username: selectedUser.username,
    last_message: messageFromInput,
    last_message_time: utcString
  }

  const updatedMessagedUsers = messagedUsers.filter(each => each.messaged_user_id !== selectedId);

  this.setState(prevState => ({
    messagedUsers: [...updatedMessagedUsers, newMessagedUser],
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
  }
  }


  render() {    
    const {
      profilePhoto, 
      isNotificationCard, 
      notificationDetails, 
      redirect,
      isCardOpen,
      displayMesssagesModalcard, 
      messagedUsers, 
      chatDetails, 
      messageFromInput, 
      isChatSelected, 
      selectedUser,
      loadingMessagedUsers,
      loadingNotifications,
      loadingSelectedUser
    } = this.state
    const sortedMessagedUsers = messagedUsers.sort((a, b) => new Date(b.last_message_time) - new Date(a.last_message_time));
    const uniqueMessages = [];
    chatDetails.forEach(array => {
            if (!uniqueMessages[array.message_id]) {
                uniqueMessages[array.message_id] = array;
            }
    });

    const uniqueChatDetails = Object.values(uniqueMessages);
    if (redirect) {
      return <Redirect to='login' />
    }
    return (
      <nav className='nav-container'>
        <Link to="/" className="chatterblast-logo">ChatterBlast</Link>
        <div className='e-commerce-food'>
          <Link to="/reels" >
            <HiMiniVideoCamera  className='logo-size' />
          </Link>
          <Link to="/map">
            <FaMapMarkedAlt className='logo-size'/>
          </Link>
        </div>
        <Modal className="modal-card-for-messages" isOpen={displayMesssagesModalcard}>
          {loadingMessagedUsers? <ReactLoaderSpinner /> :<div className='comments-converstions-card'>
            <div className='comments-card'>
              <div className="close-button">
                  <IoCloseSharp onClick={this.onClickMessageCardCloseIcon}/>
              </div>
              <div className='messages-search-input-card'>
                <input type="text" placeholder='Messages' className='messages-search-input' />
                <IoSearch />
              </div>
              {sortedMessagedUsers && sortedMessagedUsers.length > 0 ? (
                  sortedMessagedUsers.map((each, index) => (
                  <MessagesDetails key={index} userDetails={each} gettingChatDetails={this.gettingChatDetails} />
                  ))
              ) : (
                  <p>No users found</p>
              )}
            </div>
            {loadingSelectedUser? <ReactLoaderSpinner /> :<div className='converstion-card'>
              {isChatSelected? <>
                <div className='profile-bar-chat'>
                  <div className="profile-photo-three-dots">
                      <div className="profile-message-content">
                          <div className="profile_photo_in_messages_card">
                              {selectedUser.profile_photo && <img src={`https://chatterblast-server.onrender.com/profile/photo/stream/${selectedUser.profile_photo}`} alt="profile" className="profile-bar-message"/> }
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
                <div className='chat-details-card' ref={this.containerRef}>
                  {uniqueChatDetails && uniqueChatDetails.length > 0 ? (
                      uniqueChatDetails.map((each, index) => (
                      <ChatDetails key={index} chatDetails={each} deleteMessageForMe={this.deleteMessageForme} />
                      ))
                  ) : (
                      <p>Start converstion</p>
                  )}
                </div>
                <div className='input-elements-for-messages'>
                  <div className="input-container">
                    <ImAttachment />
                    <HiOutlineEmojiHappy className='emoji-chat-container'/>
                    <input type="text" required value={messageFromInput} className='input-element-in-messages' placeholder='Write Message Here' onChange={this.onChangeMessage}/>
                    <IoMdSend className="send-icon" onClick={this.onClickSendIcon}/>
                  </div>
                  {/*<input type="file" className='file-input-element' />*/}             
                </div>
                </> : ''
            }
            </div>}
          </div>}
        </Modal>
        {isNotificationCard && (
            <div className="card-notification" onClick={this.handleCardClick}>
                {notificationDetails && notificationDetails.length > 0 ? (
                  notificationDetails.map((each, index) => (
                  (loadingNotifications? <ReactLoaderSpinner /> : <NotificationDetails key={index} notificationDetails={each} />)
                  ))
                ) : (
                    <p>No notifications found</p>
                )}
            </div>
          )}
          {isNotificationCard && (
            <div className="overlay-notification" onClick={this.handleOutSideClickNotification}></div>
          )}
        <div className='social-media-elements-large'>
          <VoiceControlledComponent 
            onClickMessagesIcon={this.onClickMessagesIcon}
            onClickMessageCardCloseIcon={this.onClickMessageCardCloseIcon}
            gettingNotificationDetails={this.gettingNotificationDetails}
            handleOutSideClickNotification={this.handleOutSideClickNotification}
            className="voice-module-for-large-devices"
          />
          <Link to="/" >
            <IoMdHome className='logo-size'/>
          </Link>
          <IoIosNotifications className='logo-size' onClick={this.gettingNotificationDetails}/>
          <FaMessage className='logo-size' onClick={this.onClickMessagesIcon}/>
          <div className='profile-card' onClick={this.toggleCard}>
            {profilePhoto && <img src={`https://chatterblast-server.onrender.com/profile/photo/stream/${profilePhoto}`} alt="profile" className='profile-image' />}
          </div>
          {isCardOpen && (
            <div className="card" onClick={this.handleCardClick}>
              <p className='options-in-profile'>View Profile</p>
              <p className='options-in-profile'>Request Sent to</p>
              <p className='options-in-profile'>Requests</p>
              <p className='options-in-profile'>Settings</p>
              <button onClick={this.onClickLogout}>Logout</button>
            </div>
          )}
          {isCardOpen && (
            <div className="overlay" onClick={this.handleOutsideClick}></div>
          )}
        </div>
        <div className='social-media-elements-small'>
          <Link to="/map" className='logos-small-devices'>
            <FaMapMarkedAlt />
          </Link>
          <Link to="/friends">
            <FaPersonShelter className='logos-small-devices' />
          </Link>
          <Link to={{
            pathname:"/notifications",
            state: {notificationDetails: notificationDetails}
          }}>
            <IoIosNotifications className='logos-small-devices' />
          </Link>
          <Link to="/messages">
            <FaMessage className='logos-small-devices'/>
          </Link>
          <Link to='/menu'>
            <div className='profile-card'>
              {profilePhoto && <img src={`https://chatterblast-server.onrender.com/profile/photo/stream/${profilePhoto}`} alt="profile" className='profile-image' />}
            </div>
          </Link>
        </div>
      </nav> 
    )
  }
}


export default withRouter(Header)

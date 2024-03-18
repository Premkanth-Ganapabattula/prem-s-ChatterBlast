import { Component } from "react";
import Cookies from "js-cookie";
import { PiDotsThree } from "react-icons/pi";
import { AiFillDelete } from "react-icons/ai";
import { LuForward } from "react-icons/lu";
import { TiPin } from "react-icons/ti";

import './index.css'

class ChatDetailsSmallDevices extends Component {
    state = {isCardOpen: false}

    onClickMessageHandle = () => {
        this.setState({isCardOpen: true})
    }

    handleCardClick = (e) => {
        e.stopPropagation(); // Prevent card click from closing the card
    };

    handleOutsideClick = () => {
        this.setState({isCardOpen: false})
    };

    onClickDeleteForMe = async() => {
        const jwtToken = Cookies.get('jwt_token')
        const userId = Cookies.get('user_id')
        const {message_id} = this.props.chatDetails
        const{deleteMessageForMe} = this.props
        deleteMessageForMe(message_id)
        this.setState({isCardOpen: false})
        const url = `https://chatterblast-server.onrender.com/add/deleted/message/`
        const deletedMessage = {
            messageId: message_id,
            messageDeletedBy: userId
        }
        const options = {
            method: 'POST',
            headers: {
                Accept: 'application.json',
                'Content-Type': 'application/json',
                Authorization: `Bearer ${jwtToken}` 
                },
                body: JSON.stringify(deletedMessage)
            }
        const response = await fetch(url, options)
        const data = response.json()
        console.log(data)
    }

    renderingMessageSent = (messageContent, messageSentTime) => {
        const {isCardOpen} = this.state
        return (
            <div className="message-main-container-by">
                <>
                {isCardOpen && (
                    <div className="card-m" onClick={this.handleCardClick}>
                        <TiPin />
                        <AiFillDelete onClick={this.onClickDeleteForMe}/>
                        <LuForward />
                    </div>
                )}
                {isCardOpen && (
                    <div className="overlay-m" onClick={this.handleOutsideClick}></div>
                )}
                </>
                <div className="message-sent-by">
                    <div className="message-three-dots">
                        <p className="message-content">{messageContent}</p>
                        <PiDotsThree onClick={this.onClickMessageHandle}/>
                    </div>
                    <p className="message-time">{messageSentTime}</p>
                </div>
            </div>
        )
    }

    renderingMessageToo = (messageContent, messageSentTime) => {
        const {isCardOpen} = this.state
        return (
            <div className="message-main-container-too">
                <div className="message-sent-too">
                    <div className="message-three-dots">
                        <p className="message-content">{messageContent}</p>
                        <PiDotsThree onClick={this.onClickMessageHandle}/>
                    </div>
                    <p className="message-time">{messageSentTime}</p>
                </div>
                <>
                {isCardOpen && (
                    <div className="card-m-too" onClick={this.handleCardClick}>
                        <TiPin />
                        <AiFillDelete onClick={this.onClickDeleteForMe}/>
                        <LuForward />
                    </div>
                )}
                {isCardOpen && (
                    <div className="overlay-m" onClick={this.handleOutsideClick}></div>
                )}
                </>
            </div>
        )
    }

    render() {
        const {chatDetails} = this.props
        const {message_content, message_type, message_sent_time, message_sent_by} = chatDetails
        const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
        const date = new Date(message_sent_time)
        const messageSentTime= date.toLocaleString(undefined, { timeZone: timezone });
        const presentUserId = Cookies.get('user_id')
        return (
            <div className="chat-datails-main-container">
                {message_sent_by === presentUserId? 
                    this.renderingMessageSent(message_content, messageSentTime) :
                    this.renderingMessageToo(message_content, messageSentTime)                
                }
            </div>
        )
    }
}

export default ChatDetailsSmallDevices;

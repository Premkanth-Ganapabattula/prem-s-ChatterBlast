import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import { MdSettingsVoice } from "react-icons/md";

class VoiceControlledComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      listening: true,
      response: '',
      wordCom: ''
    };
    this.recognition = new window.webkitSpeechRecognition();
    this.recognition.continuous = true;
    this.recognition.interimResults = false;
    this.recognition.lang = 'en-US';
    this.recognition.onresult = this.handleResult;
    this.recognition.start()
  }

  startListening = () => {
    this.setState({
      listening: true
    });
    this.recognition.start();
  };

  stopListening = () => {
    this.setState({
      listening: false
    });
    this.recognition.stop();
  };

  

  handleResult = event => {
    const transcript = Array.from(event.results)
      .map(result => result[0])
      .map(result => result.transcript)
      

    const wordCom =  transcript[transcript.length-1];
    console.log(wordCom)
      if (wordCom.toLowerCase().includes('close messages')){
        const {onClickMessageCardCloseIcon} = this.props
        onClickMessageCardCloseIcon()
    } else if (wordCom.toLowerCase().includes('messages')){
        const {onClickMessagesIcon} = this.props
        onClickMessagesIcon()
    } else if (wordCom.toLowerCase().includes('close notifications')) {
        const {handleOutSideClickNotification} = this.props
        handleOutSideClickNotification()
    } else if (wordCom.toLowerCase().includes('notifications')) {
        const {gettingNotificationDetails} = this.props
        gettingNotificationDetails()
    }
    this.setState({wordCom: wordCom})

  };

  render() {
    const { listening, response, wordCom } = this.state;

    if (wordCom.toLowerCase().includes('home page') || wordCom.toLowerCase().includes('homepage')){
        return <Redirect to="/" />
    }else if (wordCom.toLowerCase().includes('following')) {
        return <Redirect to='/user/following' />
    } else if (wordCom.toLowerCase().includes('home')){
        return <Redirect to='/' />
    } else if (wordCom.toLowerCase().includes('map')) {
        return <Redirect to='/map' />
    } else if (wordCom.toLowerCase().includes('follower')){
        return <Redirect to='/user/followers' />
    }

    return (
      <div>
        {listening? <button onClick={this.stopListening}>
            <MdSettingsVoice />
        </button> :<button onClick={this.startListening}>
            <MdSettingsVoice />
        </button>}
        <div>{response}</div>
        <p>{wordCom}</p>
      </div>
    );
  }
}

export default VoiceControlledComponent;

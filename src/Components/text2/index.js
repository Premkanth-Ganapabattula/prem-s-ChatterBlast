import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import { MdSettingsVoice } from "react-icons/md";

class VoiceMessagePlayerRecorderText extends Component {
  constructor(props) {
    super(props);
    this.state = {
      recording: true,
      audioBlob: null,
      transcript: '',
      redirect: false,
      textRecorder: '',
      recognitionMike: true
    };
    this.audioRef = React.createRef();
  }

  componentDidMount() {
    const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
    recognition.lang = 'en-US';
    recognition.interimResults = false;
    recognition.continuous = true;

    recognition.onresult = async (event) => {
      const transcript = event.results[0][0].transcript.toLowerCase();
      this.setState({ transcript });
      console.log(transcript);
      this.setState({ textRecorder: transcript });
      if (transcript === 'hello.' && !this.state.recording) {
        this.startRecording();
        this.setState({recording: true})
      }
    };

    recognition.onerror = (event) => {
      console.error('Speech recognition error:', event.error);
    };

    recognition.onend = () => {
      console.log('Speech recognition ended');
      this.setState({recognitionMike: false})
    };

    recognition.start();

    this.recognition = recognition;
  }

  startRecognition = () => {
    const {recognitionMike} = this.setState
    if (!recognitionMike){
        recognitionMike.start()
    }
  }

  componentWillUnmount() {
    if (this.recognition) {
      this.recognition.stop();
    } 
  }

  startRecording = async () => {
    this.setState({ recording: true });
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const mediaRecorder = new MediaRecorder(stream);
    const chunks = [];

    mediaRecorder.ondataavailable = (e) => {
      chunks.push(e.data);
    };

    mediaRecorder.onstop = () => {
      const blob = new Blob(chunks, { type: 'audio/wav' });
      this.setState({ audioBlob: blob });
    };

    mediaRecorder.start();
    setTimeout(() => {
      mediaRecorder.stop();
      this.setState({ recording: false });
    }, 5000); // Set recording duration here (5 seconds in this example)
  };

  handlePlayback = () => {
    if (this.state.audioBlob && this.audioRef.current) {
      const audioElement = this.audioRef.current;
      audioElement.src = URL.createObjectURL(this.state.audioBlob);
      audioElement.play();
    }
  };

  redirectPage = () => {
    if (this.state.textRecorder.includes('followers')) {
      return <Redirect to='/user/followers' />
    } else if (this.state.textRecorder.includes('following')) {
      return <Redirect to='/user/following' />
    } else if (this.state.textRecorder.includes('home')){
        return <Redirect to='/' />
    } else if (this.state.textRecorder.includes('map')) {
        return <Redirect to='/map' />
    }
  }

  render() {
    return (
      <div>
        {this.state.textRecorder && this.redirectPage()}
        {this.state.recording ? (
          <p>Recording...</p>
        ) : (
          <button onClick={this.startRecording}>
            <MdSettingsVoice />
          </button>
        )}
        {this.state.audioBlob && (
          <div>
            <audio controls ref={this.audioRef}>
              <source src={URL.createObjectURL(this.state.audioBlob)} type="audio/wav" />
              Your browser does not support the audio element.
            </audio>
            <p>Transcript: {this.state.transcript}</p>
          </div>
        )}
      </div>
    );
  }
}

export default VoiceMessagePlayerRecorderText;
import React, { useEffect, useRef, useState } from 'react';
import Nouislider from 'nouislider-react';
import { FiUpload } from 'react-icons/fi';
import { IoCloseSharp } from "react-icons/io5";
import Cookies from 'js-cookie';
import Modal from 'react-modal';
import moment from 'moment';
import ReactLoaderSpinner from '../reactSpinner';
import 'nouislider/distribute/nouislider.css';
import './index.css';

function StatusUploader() {
  const [videoDuration, setVideoDuration] = useState(0);
  const [endTime, setEndTime] = useState(0);
  const [startTime, setStartTime] = useState(0);
  const [uploadedFile, setUploadedFile] = useState('')
  const [isCardOpen, setIsCardOpen] = useState(false)
  const [caption, setCaption] = useState('')
  const [loadingUploadStatus, setLoadingUploadStatus] = useState(false)
  const videoRef = useRef();

  // Convert the time obtained from the video to HH:MM:SS format
  const convertToHHMMSS = (val) => {
    const secNum = parseInt(val, 10);
    let hours = Math.floor(secNum / 3600);
    let minutes = Math.floor((secNum - hours * 3600) / 60);
    let seconds = secNum - hours * 3600 - minutes * 60;

    if (hours < 10) {
      hours = '0' + hours;
    }
    if (minutes < 10) {
      minutes = '0' + minutes;
    }
    if (seconds < 10) {
      seconds = '0' + seconds;
    }
    let time;
    // only mm:ss
    if (hours === '00') {
      time = minutes + ':' + seconds;
    } else {
      time = hours + ':' + minutes + ':' + seconds;
    }
    return time;
  };

  const onUploadPost = (event) => {
    const file = event.target.files[0]; 
    if (file) {
        setUploadedFile(file)
        setIsCardOpen(true)
    }
  }

  const onClickCloseButton = () => {
    setIsCardOpen(false)
    setUploadedFile('')
  }

  const onChangeCaption = event => {
    setCaption(event.target.value)
  }

  // Called when handle of the nouislider is being dragged
  const updateOnSliderChange = (values, handle) => {
    let readValue = values[handle] | 0;
    if (handle) {
      if (endTime !== readValue) {
        setEndTime(readValue);
      }
    } else {
      if (videoRef && videoRef.current) {
        videoRef.current.currentTime = readValue;
        setStartTime(readValue);
      }
    }
  };

  // Play the video when the button is clicked
  const handlePlay = () => {
    if (videoRef && videoRef.current) {
      videoRef.current.play();
    }
  };

  // Pause the video when then the endTime matches the currentTime of the playing video
  const handlePauseVideo = (e) => {
    const currentTime = Math.floor(e.currentTarget.currentTime);

    if (currentTime === endTime) {
      e.currentTarget.pause();
    }
  };

  const uploadStatusToDatabase = async() => {
    const jwtToken = Cookies.get('jwt_token')
    const userId = Cookies.get('user_id')
    setLoadingUploadStatus(true)
    setIsCardOpen(false)
    const time = new Date()
    const timeOfStatus = moment(time).utc().format();
    const statusBody = new FormData()
    statusBody.append('userId', userId)
    statusBody.append('statusFile', uploadedFile)
    statusBody.append('caption', caption)
    statusBody.append('startTime', startTime)
    statusBody.append('endTime', endTime)
    statusBody.append('timeOfStatus', timeOfStatus)
    setUploadedFile('')
    setCaption('')
    const url = 'https://chatterblast-server.onrender.com/status/upload/'
    const options = {
      method: "POST",
      headers: {
          Authorization: `Bearer ${jwtToken}` 
      },
      body: statusBody
    }

    const response = await fetch(url, options)
    const data = await response.json()
    if (response.status === 200) {
      setLoadingUploadStatus(false)
    }
  }

  return (
    <div className="App">
      <div className="file-input-container">
        <label className="file-input-label" htmlFor="fileInput">
          <FiUpload className="upload-icon" />
        </label>
        <input
          type="file"
          id="fileInput"
          accept="image/*, video/*"
          name="file"
          className="file-input"
          onChange={onUploadPost}
        />
      </div>
      <br />
      <Modal isOpen={isCardOpen}>
      <React.Fragment>
        <div className="close-button">
          <IoCloseSharp onClick={onClickCloseButton}/>
        </div>
        <div className='post-display-card-before-upload'>
          {uploadedFile && uploadedFile.type.startsWith('video/') ? (
            <video ref={videoRef} controls className="post-before-upload">
              <source src={URL.createObjectURL(uploadedFile)} type={uploadedFile.type}/>
            </video>
          ) : (
            uploadedFile && <img src={URL.createObjectURL(uploadedFile)} alt="Uploaded file" className="post-before-upload"/>
          )}
        </div>
        <br />
        <Nouislider
          behaviour="tap-drag"
          step={1}
          margin={3}
          limit={30} // Set limit to 30 seconds
          range={{ min: 0, max: videoDuration || 45 }} // Set range dynamically based on video duration
          start={[0, 31]} // Use endTime as the default end value
          connect
          onUpdate={updateOnSliderChange}
        />
        <br />
        Start duration: {convertToHHMMSS(startTime)} &nbsp; End duration:{' '}
        {convertToHHMMSS(endTime)}
        <br />
        <button onClick={handlePlay}>Play</button>
        <button onClick={handlePauseVideo}>Pause</button>
        <br />
        <input type="text" value={caption} onChange={onChangeCaption} placeholder='Add Caption' className='caption-status'/>
        <button type='button' onClick={uploadStatusToDatabase}>
          {loadingUploadStatus? <ReactLoaderSpinner /> :'Post'}
        </button>
      </React.Fragment>
      </Modal>      
    </div>
  );
}

export default StatusUploader;

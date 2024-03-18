import React, { useState, useRef } from 'react';

const VoiceMessagePlayerRecorder = () => {
  const [recording, setRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState(null);
  const audioRef = useRef(null);

  const handleStartRecording = async () => {
    setRecording(true);
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const mediaRecorder = new MediaRecorder(stream);
    const chunks = [];

    mediaRecorder.ondataavailable = (e) => {
      chunks.push(e.data);
    };

    mediaRecorder.onstop = () => {
      const blob = new Blob(chunks, { type: 'audio/wav' });
      setAudioBlob(blob);
    };

    mediaRecorder.start();
    setTimeout(() => {
      mediaRecorder.stop();
      setRecording(false);
    }, 5000); // Set recording duration here (5 seconds in this example)
  };

  const handlePlayback = () => {
    if (audioBlob && audioRef.current) {
      const audioElement = audioRef.current;
      audioElement.src = URL.createObjectURL(audioBlob);
      audioElement.play();
    }
  };

  return (
    <div>
      <h2>Voice Message Player and Recorder</h2>
      <div>
        {!recording ? (
          <button onClick={handleStartRecording}>Start Recording</button>
        ) : (
          <button disabled>Recording...</button>
        )}
        <button onClick={handlePlayback} disabled={!audioBlob}>
          Play Recorded Message
        </button>
      </div>
      {audioBlob && (
        <audio controls ref={audioRef}>
          <source src={URL.createObjectURL(audioBlob)} type="audio/wav" />
          Your browser does not support the audio element.
        </audio>
      )}
    </div>
  );
};

export default VoiceMessagePlayerRecorder;

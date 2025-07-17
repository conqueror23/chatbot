import React, { useState } from 'react';
import { useAudioRecorder } from '../hooks/useAudioRecorder';
import './AudioRecorder.css';

interface AudioRecorderProps {
  onAudioReady: (audioBlob: Blob, duration: number) => void;
  disabled?: boolean;
}

const AudioRecorder: React.FC<AudioRecorderProps> = ({ onAudioReady, disabled = false }) => {
  const [permissionError, setPermissionError] = useState<string>('');
  const {
    isRecording,
    audioBlob,
    duration,
    startRecording,
    stopRecording,
    resetRecording,
  } = useAudioRecorder();

  const handleStartRecording = async () => {
    setPermissionError('');
    const success = await startRecording();
    if (!success) {
      setPermissionError('Unable to access microphone. Please check your permissions.');
    }
  };

  const handleStopRecording = () => {
    stopRecording();
  };

  const handleSendAudio = () => {
    if (audioBlob) {
      onAudioReady(audioBlob, duration);
      resetRecording();
    }
  };

  const handleDiscardAudio = () => {
    resetRecording();
  };

  const formatDuration = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (audioBlob) {
    return (
      <div className="audio-recorder recorded">
        <div className="audio-preview">
          <audio controls src={URL.createObjectURL(audioBlob)} />
          <span className="duration">{formatDuration(duration)}</span>
        </div>
        <div className="audio-actions">
          <button 
            onClick={handleSendAudio}
            className="send-button"
            disabled={disabled}
          >
            Send
          </button>
          <button 
            onClick={handleDiscardAudio}
            className="discard-button"
            disabled={disabled}
          >
            Discard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="audio-recorder">
      {permissionError && (
        <div className="permission-error">{permissionError}</div>
      )}
      
      <div className="recording-controls">
        {!isRecording ? (
          <button
            onClick={handleStartRecording}
            className="record-button"
            disabled={disabled}
            title="Record audio message"
          >
            🎤 Record
          </button>
        ) : (
          <div className="recording-active">
            <button
              onClick={handleStopRecording}
              className="stop-button"
              disabled={disabled}
            >
              ⏹️ Stop
            </button>
            <span className="recording-duration">
              🔴 {formatDuration(duration)}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default AudioRecorder;
import React from 'react';
import { Message } from '../types/chat';
import { User } from '../types/auth';
import './MessageList.css';

interface MessageListProps {
  messages: Message[];
  currentUser: User | null;
}

const MessageList: React.FC<MessageListProps> = ({ messages, currentUser }) => {
  const formatTime = (timestamp: Date) => {
    return new Date(timestamp).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const renderMessage = (message: Message) => {
    const isCurrentUser = currentUser?.id === message.userId;
    const isSystemMessage = message.userId === 'system';

    if (isSystemMessage) {
      return (
        <div key={message.id} className="message system-message">
          <span className="system-text">{message.content}</span>
          <span className="message-time">{formatTime(message.timestamp)}</span>
        </div>
      );
    }

    return (
      <div 
        key={message.id} 
        className={`message ${isCurrentUser ? 'own-message' : 'other-message'}`}
      >
        <div className="message-header">
          <span className="username">{message.username}</span>
          <span className="message-time">{formatTime(message.timestamp)}</span>
        </div>
        
        <div className="message-content">
          {message.type === 'text' ? (
            <span className="text-content">{message.content}</span>
          ) : (
            <div className="audio-content">
              <audio controls src={message.audioUrl} />
              <span className="audio-description">{message.content}</span>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="message-list">
      {messages.length === 0 ? (
        <div className="no-messages">
          <p>No messages yet. Start the conversation!</p>
        </div>
      ) : (
        messages.map(renderMessage)
      )}
    </div>
  );
};

export default MessageList;
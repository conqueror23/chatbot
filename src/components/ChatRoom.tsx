import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Message, ChatRoom as ChatRoomType } from '../types/chat';
import AudioRecorder from './AudioRecorder';
import MessageList from './MessageList';
import { socket, connectServer } from '../lib/socket';
import './ChatRoom.css';

interface ChatRoomProps {
  room: ChatRoomType;
}

const ChatRoom: React.FC<ChatRoomProps> = ({ room }) => {
  const { user, logout } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [textMessage, setTextMessage] = useState('');
  const [isConnected, setIsConnected] = useState(false);
  const [participants, setParticipants] = useState<string[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Connect to socket
    connectServer();
    
    // Listen for connection status
    socket.on('connect', () => {
      setIsConnected(true);
      // Join the chat room
      socket.emit('join-room', { roomId: room.id, user });
    });

    socket.on('disconnect', () => {
      setIsConnected(false);
    });

    // Listen for new messages
    socket.on('new-message', (message: Message) => {
      setMessages(prev => [...prev, message]);
    });

    // Listen for room participants updates
    socket.on('room-participants', (participantList: string[]) => {
      setParticipants(participantList);
    });

    // Listen for user joined/left notifications
    socket.on('user-joined', (data: { username: string }) => {
      const systemMessage: Message = {
        id: Date.now().toString(),
        userId: 'system',
        username: 'System',
        content: `${data.username} joined the room`,
        timestamp: new Date(),
        type: 'text',
      };
      setMessages(prev => [...prev, systemMessage]);
    });

    socket.on('user-left', (data: { username: string }) => {
      const systemMessage: Message = {
        id: Date.now().toString(),
        userId: 'system',
        username: 'System',
        content: `${data.username} left the room`,
        timestamp: new Date(),
        type: 'text',
      };
      setMessages(prev => [...prev, systemMessage]);
    });

    return () => {
      socket.off('connect');
      socket.off('disconnect');
      socket.off('new-message');
      socket.off('room-participants');
      socket.off('user-joined');
      socket.off('user-left');
      socket.emit('leave-room', { roomId: room.id, user });
    };
  }, [room.id, user]);

  useEffect(() => {
    // Auto-scroll to bottom when new messages arrive
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendTextMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!textMessage.trim() || !user) return;

    const message: Message = {
      id: Date.now().toString(),
      userId: user.id,
      username: user.username,
      content: textMessage.trim(),
      timestamp: new Date(),
      type: 'text',
    };

    socket.emit('send-message', { roomId: room.id, message });
    setTextMessage('');
  };

  const sendAudioMessage = async (audioBlob: Blob, duration: number) => {
    if (!user) return;

    try {
      // Convert blob to base64 for transmission
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64Audio = reader.result as string;
        
        const message: Message = {
          id: Date.now().toString(),
          userId: user.id,
          username: user.username,
          content: `Audio message (${Math.floor(duration / 60)}:${(duration % 60).toString().padStart(2, '0')})`,
          audioUrl: base64Audio,
          timestamp: new Date(),
          type: 'audio',
        };

        socket.emit('send-message', { roomId: room.id, message });
      };
      reader.readAsDataURL(audioBlob);
    } catch (error) {
      console.error('Error sending audio message:', error);
    }
  };

  return (
    <div className="chat-room">
      <div className="chat-header">
        <div className="room-info">
          <h2>{room.name}</h2>
          <div className="connection-status">
            <span className={`status-indicator ${isConnected ? 'connected' : 'disconnected'}`}>
              {isConnected ? '🟢' : '🔴'}
            </span>
            {isConnected ? 'Connected' : 'Disconnected'}
          </div>
        </div>
        
        <div className="participants">
          <span>Participants ({participants.length}):</span>
          <div className="participant-list">
            {participants.map((participant, index) => (
              <span key={index} className="participant">{participant}</span>
            ))}
          </div>
        </div>

        <button onClick={logout} className="logout-button">
          Logout
        </button>
      </div>

      <div className="chat-messages">
        <MessageList messages={messages} currentUser={user} />
        <div ref={messagesEndRef} />
      </div>

      <div className="chat-input">
        <form onSubmit={sendTextMessage} className="text-input-form">
          <input
            type="text"
            value={textMessage}
            onChange={(e) => setTextMessage(e.target.value)}
            placeholder="Type a message..."
            disabled={!isConnected}
            className="text-input"
          />
          <button 
            type="submit" 
            disabled={!textMessage.trim() || !isConnected}
            className="send-text-button"
          >
            Send
          </button>
        </form>
        
        <AudioRecorder 
          onAudioReady={sendAudioMessage}
          disabled={!isConnected}
        />
      </div>
    </div>
  );
};

export default ChatRoom;
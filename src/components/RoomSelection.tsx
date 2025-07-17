import React, { useState, useEffect } from 'react';
import { ChatRoom } from '../types/chat';
import { useAuth } from '../contexts/AuthContext';
import './RoomSelection.css';

interface RoomSelectionProps {
  onRoomSelect: (room: ChatRoom) => void;
}

const RoomSelection: React.FC<RoomSelectionProps> = ({ onRoomSelect }) => {
  const { user, logout } = useAuth();
  const [rooms, setRooms] = useState<ChatRoom[]>([]);
  const [newRoomName, setNewRoomName] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Load available rooms from backend
    loadRooms();
  }, []);

  const loadRooms = async () => {
    try {
      // This would typically fetch from your backend API
      // For now, we'll use some default rooms
      const defaultRooms: ChatRoom[] = [
        {
          id: 'general',
          name: 'General Chat',
          participants: [],
          createdAt: new Date(),
        },
        {
          id: 'tech-talk',
          name: 'Tech Talk',
          participants: [],
          createdAt: new Date(),
        },
        {
          id: 'random',
          name: 'Random',
          participants: [],
          createdAt: new Date(),
        },
      ];
      
      setRooms(defaultRooms);
    } catch (error) {
      console.error('Error loading rooms:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const createRoom = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRoomName.trim()) return;

    setIsCreating(true);
    try {
      // This would typically send to your backend API
      const newRoom: ChatRoom = {
        id: newRoomName.toLowerCase().replace(/\s+/g, '-'),
        name: newRoomName.trim(),
        participants: [],
        createdAt: new Date(),
      };
      
      setRooms(prev => [...prev, newRoom]);
      setNewRoomName('');
    } catch (error) {
      console.error('Error creating room:', error);
    } finally {
      setIsCreating(false);
    }
  };

  if (isLoading) {
    return (
      <div className="room-selection loading">
        <div className="loading-spinner">Loading rooms...</div>
      </div>
    );
  }

  return (
    <div className="room-selection">
      <div className="room-header">
        <div className="user-info">
          <h2>Welcome, {user?.username}!</h2>
          <p>Select a chat room to join</p>
        </div>
        <button onClick={logout} className="logout-button">
          Logout
        </button>
      </div>

      <div className="room-content">
        <div className="create-room-section">
          <h3>Create New Room</h3>
          <form onSubmit={createRoom} className="create-room-form">
            <input
              type="text"
              value={newRoomName}
              onChange={(e) => setNewRoomName(e.target.value)}
              placeholder="Enter room name..."
              disabled={isCreating}
              className="room-name-input"
            />
            <button 
              type="submit" 
              disabled={!newRoomName.trim() || isCreating}
              className="create-room-button"
            >
              {isCreating ? 'Creating...' : 'Create Room'}
            </button>
          </form>
        </div>

        <div className="available-rooms-section">
          <h3>Available Rooms</h3>
          {rooms.length === 0 ? (
            <p className="no-rooms">No rooms available. Create one above!</p>
          ) : (
            <div className="rooms-grid">
              {rooms.map((room) => (
                <div 
                  key={room.id} 
                  className="room-card"
                  onClick={() => onRoomSelect(room)}
                >
                  <h4>{room.name}</h4>
                  <p>{room.participants.length} participants</p>
                  <span className="join-hint">Click to join</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RoomSelection;
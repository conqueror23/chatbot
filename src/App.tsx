import React, { useState } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Login from './components/Login';
import RoomSelection from './components/RoomSelection';
import ChatRoom from './components/ChatRoom';
import { ChatRoom as ChatRoomType } from './types/chat';
import './App.css';

const AppContent: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const [selectedRoom, setSelectedRoom] = useState<ChatRoomType | null>(null);

  if (!isAuthenticated) {
    return <Login />;
  }

  if (!selectedRoom) {
    return <RoomSelection onRoomSelect={setSelectedRoom} />;
  }

  return (
    <div className="app-container">
      <button 
        onClick={() => setSelectedRoom(null)}
        className="back-to-rooms-button"
      >
        ← Back to Rooms
      </button>
      <ChatRoom room={selectedRoom} />
    </div>
  );
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
};

export default App;


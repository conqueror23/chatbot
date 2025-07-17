import { io } from 'socket.io-client';

const socketPort = 5005;
export const socket = io(`http://localhost:${socketPort}`, {
  autoConnect: false, // Don't auto-connect, we'll connect manually when authenticated
});

export const connectServer = () => {
  if (!socket.connected) {
    socket.connect();
  }
  
  socket.on('connect', () => {
    console.log('Connected to chat server');
  });

  socket.on('disconnect', () => {
    console.log('Disconnected from chat server');
  });

  socket.on('connect_error', (error) => {
    console.error('Connection error:', error);
  });
};

export const disconnectServer = () => {
  if (socket.connected) {
    socket.disconnect();
  }
};

// Legacy functions for backward compatibility
export const getMessage = (passSocketMsg: Function) => {
  socket.on('response', (data: string) => {
    passSocketMsg(data);
    console.log('getMessage:', data);
  });
};

export const sendMessage = (message: string) => {
  socket.emit('message', message);
  socket.emit('client-message', message);
  socket.emit('chatMessage', { user: 'Alice', text: message });
};

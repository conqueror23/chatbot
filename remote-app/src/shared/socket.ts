import { io } from 'socket.io-client';

const socketPort = 5005
export const socket = io(`http://localhost:${socketPort}`);

export const connectServer = () => {
  socket.on('connect', () => {
    console.log('Connected to server');
    socket.emit('message', 'Hello from client!');
  });

}

export const getMessage = (passSocketMsg: Function) => {
  socket.on('response', (data: string) => {
    passSocketMsg(data)
    console.log('getMessage:', data);
  });
}


export const sendMessage = (message: string) => {
  socket.on('connect', () => {
    console.log('Connected to server');
  });

  // socket.on('server-message', (data) => {
  //   console.log('Message from server:', data);
  // });
  // Example: Send a simple string message
  socket.emit('message', message);

  socket.emit('client-message', message);

  // Example: Send an object with structured data
  socket.emit('chatMessage', { user: 'Alice', text: message });
}

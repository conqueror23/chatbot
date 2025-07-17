# Chat Room App with Audio Support

A real-time chat application built with React, TypeScript, and Socket.IO that supports both text and audio messaging.

## Features

- **User Authentication**: Login system with credential validation
- **Multiple Chat Rooms**: Users can create and join different chat rooms
- **Real-time Messaging**: Instant text messaging using Socket.IO
- **Audio Messages**: Record and send audio messages with playback
- **Multi-user Support**: Multiple users can join the same chat room
- **Backend Integration**: Designed to work with external backend API

## Tech Stack

- **Frontend**: React 19, TypeScript, Webpack Module Federation
- **Real-time Communication**: Socket.IO
- **Audio**: Web Audio API, MediaRecorder API
- **Styling**: CSS3 with responsive design

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm
- Backend API server (running on port 3000 by default)
- Socket.IO server (running on port 5005 by default)

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm start
   ```

4. Open http://localhost:3100 in your browser

### Configuration

#### Environment Variables

Create a `.env` file in the root directory with:

```env
REACT_APP_API_URL=http://localhost:3000/api
```

#### Backend API Requirements

Your backend API should provide the following endpoints:

- `POST /auth/login` - User authentication
- `POST /auth/validate` - Token validation
- `POST /chat/upload-audio` - Audio file upload
- `POST /chat/messages` - Save chat messages
- `GET /chat/messages/:roomId` - Retrieve chat history

#### Socket.IO Server Events

Your Socket.IO server should handle:

- `join-room` - User joins a chat room
- `leave-room` - User leaves a chat room
- `send-message` - Send a message to a room
- `new-message` - Broadcast new messages
- `room-participants` - Update participant list
- `user-joined` / `user-left` - User presence notifications

## Usage

1. **Login**: Enter your username and password
2. **Select Room**: Choose an existing room or create a new one
3. **Chat**: Send text messages or record audio messages
4. **Audio Recording**: 
   - Click "Record" to start recording
   - Click "Stop" to finish recording
   - Review and either "Send" or "Discard" the audio

## Browser Permissions

The app requires microphone access for audio recording. Users will be prompted to grant permission when first attempting to record audio.

## Module Federation

This app uses Webpack Module Federation architecture:
- **Host App**: Main application (port 3100)
- **Remote App**: Socket functionality module (port 3101)

## Development

### File Structure

```
src/
├── components/          # React components
│   ├── AudioRecorder.tsx
│   ├── ChatRoom.tsx
│   ├── Login.tsx
│   ├── MessageList.tsx
│   └── RoomSelection.tsx
├── contexts/           # React contexts
│   └── AuthContext.tsx
├── hooks/              # Custom hooks
│   └── useAudioRecorder.ts
├── services/           # API services
│   ├── authService.ts
│   └── chatService.ts
├── types/              # TypeScript types
│   ├── auth.ts
│   └── chat.ts
└── lib/                # Utilities
    └── socket.ts
```

### Building for Production

```bash
npm run build
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

MIT License

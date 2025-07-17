# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a React + TypeScript chatbot application using Socket.IO for real-time communication. The project uses Webpack Module Federation to create a microfrontend architecture with a host app and remote app setup.

## Common Commands

- **Development**: `npm start` - Starts webpack dev server on port 3100
- **Build**: `npm run build` - Creates production build
- **Host App Dev Server**: Runs on port 3100 (main application)
- **Remote App Dev Server**: Runs on port 3101 (microfrontend module)

## Architecture

### Module Federation Setup
- **Host App** (`src/`): Main React application that consumes remote modules
  - Webpack config exposes the main app on port 3100
  - Consumes `remoteApp@http://localhost:3101/socket.js`
- **Remote App** (`remote-app/`): Microfrontend that exposes socket functionality
  - Webpack config exposes `./socket` module via `shared/socket.ts`
  - Runs on port 3101

### Socket.IO Integration
- Socket server expected on port 5005
- Socket client logic in `src/lib/socket.ts` provides:
  - `connectServer()`: Establishes connection
  - `getMessage(callback)`: Listens for 'response' events
  - `sendMessage(message)`: Sends various message formats to server
- Remote app exposes shared socket functionality via Module Federation

### File Structure
- `src/`: Main React application source
  - `App.tsx`: Basic React component
  - `index.tsx`: React 19 root entry point
  - `lib/socket.ts`: Socket.IO client implementation
  - `components/`: (empty directory for future components)
- `remote-app/`: Microfrontend module
  - `shared/socket.ts`: Exposed socket functionality
  - Separate webpack config for module federation
- `public/index.html`: HTML template referencing "Chatbot" title

## Development Notes

- Uses React 19 with new `createRoot` API
- TypeScript with strict mode enabled
- CSS loader configured for styling
- Hot reload enabled in development
- Both apps share React/ReactDOM as singletons via Module Federation
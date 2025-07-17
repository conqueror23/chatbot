import { Message } from '../types/chat';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000/api';

export const chatService = {
  async uploadAudio(audioBlob: Blob, roomId: string, userId: string): Promise<string> {
    try {
      const formData = new FormData();
      formData.append('audio', audioBlob, `audio-${Date.now()}.webm`);
      formData.append('roomId', roomId);
      formData.append('userId', userId);

      const token = localStorage.getItem('auth_token');
      const response = await fetch(`${API_BASE_URL}/chat/upload-audio`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        return data.audioUrl;
      } else {
        throw new Error('Failed to upload audio');
      }
    } catch (error) {
      console.error('Error uploading audio:', error);
      throw error;
    }
  },

  async saveMessage(message: Message, roomId: string): Promise<void> {
    try {
      const token = localStorage.getItem('auth_token');
      const response = await fetch(`${API_BASE_URL}/chat/messages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          message,
          roomId,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to save message');
      }
    } catch (error) {
      console.error('Error saving message:', error);
      throw error;
    }
  },

  async getMessages(roomId: string, limit: number = 50): Promise<Message[]> {
    try {
      const token = localStorage.getItem('auth_token');
      const response = await fetch(
        `${API_BASE_URL}/chat/messages/${roomId}?limit=${limit}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        return data.messages || [];
      } else {
        throw new Error('Failed to fetch messages');
      }
    } catch (error) {
      console.error('Error fetching messages:', error);
      return [];
    }
  },
};
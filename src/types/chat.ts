export interface Message {
  id: string;
  userId: string;
  username: string;
  content: string;
  audioUrl?: string;
  timestamp: Date;
  type: 'text' | 'audio';
}

export interface ChatRoom {
  id: string;
  name: string;
  participants: string[];
  createdAt: Date;
}

export interface AudioMessage {
  blob: Blob;
  duration: number;
}
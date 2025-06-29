import axios from 'axios';
import api from './api';
import { Post, Comment } from '../types';

export const getPosts = async (): Promise<Post[]> => {
  const response = await api.get<Post[]>('posts');
  return response.data;
};

export const getComments = async (postId: number): Promise<Comment[]> => {
  const response = await api.get<Comment[]>(`posts/${postId}/comments`);
  return response.data;
};

// Mock user data with more realistic information
const mockUsers = [
  { id: 1, name: 'John Doe', avatar: 'https://i.pravatar.cc/150?img=1' },
  { id: 2, name: 'Jane Smith', avatar: 'https://i.pravatar.cc/150?img=2' },
  { id: 3, name: 'Alex Johnson', avatar: 'https://i.pravatar.cc/150?img=3' },
  { id: 4, name: 'Maria Garcia', avatar: 'https://i.pravatar.cc/150?img=4' },
  { id: 5, name: 'David Kim', avatar: 'https://i.pravatar.cc/150?img=5' },
  { id: 6, name: 'Sarah Wilson', avatar: 'https://i.pravatar.cc/150?img=6' },
  { id: 7, name: 'Michael Brown', avatar: 'https://i.pravatar.cc/150?img=7' },
  { id: 8, name: 'Emma Davis', avatar: 'https://i.pravatar.cc/150?img=8' },
];

export interface User {
  id: number;
  name: string;
  email: string;
  avatar: string;
}

export async function getUser(userId: number): Promise<User> {
  // Use the userId to get a consistent mock user
  const mockUser = mockUsers[userId % mockUsers.length];
  const email = `${mockUser.name.toLowerCase().replace(/[^a-z]/g, '')}@example.com`;
  
  return Promise.resolve({
    id: userId,
    name: mockUser.name,
    email: email,
    avatar: mockUser.avatar || `https://i.pravatar.cc/150?img=${userId}`
  });
}

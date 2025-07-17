import { LoginCredentials, AuthResponse } from '../types/auth';

// Backend API base URL - you'll need to update this to match your backend
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000/api';

export const authService = {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      });

      const data = await response.json();
      
      if (response.ok && data.success) {
        // Store token in localStorage
        if (data.token) {
          localStorage.setItem('auth_token', data.token);
        }
        return data;
      } else {
        return {
          success: false,
          message: data.message || 'Login failed',
        };
      }
    } catch (error) {
      console.error('Login error:', error);
      return {
        success: false,
        message: 'Network error. Please try again.',
      };
    }
  },

  async validateToken(token: string): Promise<AuthResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/validate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Token validation error:', error);
      return {
        success: false,
        message: 'Token validation failed',
      };
    }
  },

  logout(): void {
    localStorage.removeItem('auth_token');
  },

  getStoredToken(): string | null {
    return localStorage.getItem('auth_token');
  },
};
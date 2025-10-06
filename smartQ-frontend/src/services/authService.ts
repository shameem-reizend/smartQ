import api from './api';
import { LoginResponse, RegisterResponse } from '../types';

export const authService = {
  async register(data: {
    name: string;
    email: string;
    password: string;
    role?: string;
    phone?: string;
  }): Promise<RegisterResponse> {
    const response = await api.post<RegisterResponse>('/users/', data);
    return response.data;
  },

  async login(email: string, password: string): Promise<LoginResponse> {
    const response = await api.post<LoginResponse>('/users/login', {
      email,
      password,
    });
    return response.data;
  },

  async fetchUsers() {
    const response = await api.get('/admin/users/');
    return response.data;
  },
};

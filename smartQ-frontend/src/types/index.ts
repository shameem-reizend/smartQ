export interface User {
  user_id: string;
  name: string;
  email: string;
  role: 'user' | 'service provider' | 'admin';
  phone?: string;
  created_at: string;
}

export interface LoginResponse {
  success: boolean;
  message: string;
  accessToken: string;
}

export interface RegisterResponse {
  success: boolean;
  message: string;
  user: User;
}

export interface Service {
  service_id: string;
  name: string;
  description?: string;
  provider_id: string;
  created_at: string;
  location: string;
  queues: Queue[];
  provider: User;
}

export interface Queue {
  queue_id: string;
  service_id: string;
  date: string;
  status: 'open' | 'closed';
  max_capacity?: number;
  current_size?: number;
  created_at: string;
  service?: Service;
}

export interface QueueEntry {
  entry_id: string;
  queue_id: string;
  user_id: string;
  queue_number: number;
  status: 'waiting' | 'served' | 'cancelled';
  joined_at: string;
  served_at?: string;
  user?: User;
}

export interface ApiError {
  success: false;
  message: string;
  error?: string;
}

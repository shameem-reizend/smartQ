import api from './api';
import { Service } from '../types';

export const serviceService = {
  async createService(data: {
    name: string;
    location?: string;
    provider?: string 
  }): Promise<Service> {
    const response = await api.post('/services/', data);
    return response.data.service;
  },

  async fetchServices(): Promise<Service[]> {
    const response = await api.get('/services/');
    return response.data.services;
  },
};

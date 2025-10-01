import api from './api';
import { Queue, QueueEntry } from '../types';

export const queueService = {
  async createQueue(data: {
    service: string;
    max_capacity?: number;
  }): Promise<Queue> {
    const response = await api.post('/queues/', data);
    return response.data;
  },

  async updateQueueStatus(
    queueId: string,
    status: 'open' | 'closed'
  ): Promise<Queue> {
    const response = await api.patch<Queue>(`/queues/${queueId}/status`, {
      status,
    });
    return response.data;
  },

  async fetchQueues(): Promise<Queue[]> {
    const response = await api.get('/queues/');
    return response.data.queues;
  },

  async fetchQueueDetails(queueId: string): Promise<Queue> {
    const response = await api.get(`/queues/${queueId}`);
    return response.data.queue;
  },

  async joinQueue(queueId: string, user_id: string): Promise<QueueEntry> {
    const response = await api.post(`/entries/${queueId}/join`, {
      user_id: user_id
    });
    return response.data.entry;
  },

  async fetchQueueEntries(queueId: string): Promise<QueueEntry[]> {
    const response = await api.get(`/entries/${queueId}/entries`);
    return response.data.entries;
  },

  async updateEntryStatus(
    entryId: string,
    status: 'waiting' | 'served' | 'cancelled'
  ): Promise<QueueEntry> {
    const response = await api.patch(`/entries/${entryId}/status`, {
      status,
    });
    return response.data;
  },
};

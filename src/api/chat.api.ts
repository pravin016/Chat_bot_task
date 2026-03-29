import { apiClient } from './client';

export const sendMessageAPI = async (text: string) => {
  const res = await apiClient.post('/chat', { message: text });
  return res.data;
};
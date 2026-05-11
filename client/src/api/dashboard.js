import client from './client';

export const getStats = async () => {
  const response = await client.get('/dashboard/stats');
  return response.data;
};

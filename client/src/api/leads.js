import client from './client';

export const createLead = async (data) => {
  const response = await client.post('/leads', data);
  return response.data;
};

export const getLeads = async (params = {}) => {
  const response = await client.get('/leads', { params });
  return response.data;
};

export const getLead = async (id) => {
  const response = await client.get(`/leads/${id}`);
  return response.data;
};

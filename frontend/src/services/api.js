import axios from 'axios';

const API_BASE_URL = '/api';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const fetchHealth = async () => {
  const res = await apiClient.get('/health');
  return res.data;
};

export const fetchFilterOptions = async () => {
  const res = await apiClient.get('/filters/options');
  return res.data;
};

export const fetchKpis = async (params = {}) => {
  const res = await apiClient.get('/analytics/kpis', { params });
  return res.data;
};

export const fetchChartsData = async (params = {}) => {
  const res = await apiClient.get('/analytics/charts', { params });
  return res.data;
};

export const fetchInsights = async (params = {}) => {
  const res = await apiClient.get('/data', { params });
  return res.data;
};

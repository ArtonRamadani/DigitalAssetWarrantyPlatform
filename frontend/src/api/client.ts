import axios from 'axios';
import { CreateDigitalAssetInput, DigitalAsset, WarrantyQuote } from '../types/digitalAsset';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000/api',
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      throw new Error(error.response.data.error || 'An error occurred');
    }
    throw new Error('Network error');
  }
);

export const assetsApi = {
  create: (data: CreateDigitalAssetInput) => api.post('/assets', { ...data, value: parseFloat(data.value) }),
  list: () => api.get<DigitalAsset[]>('/assets'),
  getQuote: (id: number) => api.get<WarrantyQuote>(`/assets/${id}/quote`),
};

export default api;

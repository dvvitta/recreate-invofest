// src/api/axiosInstance.ts
import axios from 'axios';

const api = axios.create({
  // Ganti dengan URL domain publik dari Railway kamu
  baseURL: 'https://be-uts-production-526f.up.railway.app/', 
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;
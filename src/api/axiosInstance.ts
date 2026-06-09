import axios from 'axios';

const api = axios.create({
  baseURL: 'https://be-uts-production-526f.up.railway.app/', 
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;
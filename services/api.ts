// services/api.ts
import axios from 'axios';

const api = axios.create({
  baseURL: 'https://gorest.co.in/public/v2/',
});

export default api;

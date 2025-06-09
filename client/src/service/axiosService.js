import axios from 'axios';

const apiClient = axios.create({
  baseURL: 'https://pipeline-o6y4.onrender.com/', // Replace with your API URL
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
    Authorization: `Bearer ${localStorage.getItem('accessToken') || ''}`,
  },
});

export default apiClient;

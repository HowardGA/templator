import axios from 'axios';
export const apiClient = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL || 'https://templator.onrender.com/api',
    headers: {
        'content-type': 'application/json',

    },
    withCredentials: true,
});

apiClient.interceptors.response.use(
    response => {
        return response.data;
    },
     error => {
        console.error('API call failed:', error.response?.data || error.message);
        return Promise.reject(error);
    }
)
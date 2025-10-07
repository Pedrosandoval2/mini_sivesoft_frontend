import axios from 'axios';

const axiosInstance = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `Bearer ${JSON.parse(localStorage.getItem('user-storage') || '{}')?.state.user.token || ''}`
    }
});

export default axiosInstance;
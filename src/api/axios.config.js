import axios from 'axios';

const axiosInstance = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    }
});

// Interceptor de request para agregar el token dinámicamente
axiosInstance.interceptors.request.use(
    (config) => {
        // Obtener el token del localStorage en cada petición
        const userStorage = localStorage.getItem('user-storage');
        const userToken = userStorage ? JSON.parse(userStorage)?.state?.user?.token || '' : '';
        
        // Agregar el token al header si existe
        if (userToken) {
            config.headers.Authorization = `Bearer ${userToken}`;
        } else {
            delete config.headers.Authorization;
        }
        
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Interceptor de response para manejar errores de autenticación
axiosInstance.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        if (error.response && error.response.status === 401) {
            // Limpiar el storage y redirigir al login
            localStorage.removeItem('user-storage');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

export default axiosInstance;
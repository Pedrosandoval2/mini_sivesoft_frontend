import axios from 'axios';
import { queryClient } from '@/lib/react-query';

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
        
        if (!userStorage) {
            // Si no hay storage, asegurar que no se envíe el token
            delete config.headers.Authorization;
            return config;
        }
        
        try {
            const parsedStorage = JSON.parse(userStorage);
            const userToken = parsedStorage?.state?.user?.token || '';
            
            // Agregar el token al header si existe
            if (userToken) {
                config.headers.Authorization = `Bearer ${userToken}`;
            } else {
                delete config.headers.Authorization;
            }
        } catch (error) {
            // Si hay error al parsear, eliminar el Authorization
            console.error('Error parsing user storage:', error);
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
            // Limpiar el storage
            localStorage.removeItem('user-storage');
            
            // Limpiar el caché de React Query
            queryClient.clear();
            queryClient.cancelQueries();
            
            // Redirigir al login
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

export default axiosInstance;
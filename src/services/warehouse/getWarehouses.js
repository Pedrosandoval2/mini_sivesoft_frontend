
import axiosInstance from "@/api/axios.config";

export const getWarehouses = ({ page, limit, query }) => {
    const params = new URLSearchParams();
    if (page) params.append('page', page);
    if (limit) params.append('limit', limit);
    if (query) params.append('query', query);
    return axiosInstance.get('/warehouses', { params });
}
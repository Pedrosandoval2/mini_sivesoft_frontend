
import axiosInstance from "@/api/axios.config";

export const getEntities = ({ page, limit, query, onlyUnassigned }) => {
    const params = new URLSearchParams();
    if (page) params.append('page', page);
    if (limit) params.append('limit', limit);
    if (query) params.append('query', query);
    if (onlyUnassigned !== undefined) params.append('onlyUnassigned', onlyUnassigned);
    
    return axiosInstance.get(`/entities`, { params });
};
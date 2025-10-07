
import axiosInstance from "@/api/axios.config";

export const createEntity = (data) => axiosInstance.post('/entities', data);
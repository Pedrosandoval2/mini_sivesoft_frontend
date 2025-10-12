
import axiosInstance from "@/api/axios.config";

export const changeTenant = (data) => axiosInstance.post('/auth/switch-tenant', data);

import axiosInstance from "@/api/axios.config";

export const createWarehouse = (data) => axiosInstance.post('/warehouses', data);
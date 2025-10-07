
import axiosInstance from "@/api/axios.config";

export const getWarehousesByUser = () => axiosInstance.get('/warehouses/by-user');
import axiosInstance from "@/api/axios.config";

export const updateWarehouse = (id, data) => axiosInstance.patch(`/warehouses/${id}`, data);
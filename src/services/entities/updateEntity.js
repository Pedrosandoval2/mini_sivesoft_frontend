
import axiosInstance from "@/api/axios.config";

export const updateEntity = (id, data) => axiosInstance.patch(`/entities/${id}`, data);
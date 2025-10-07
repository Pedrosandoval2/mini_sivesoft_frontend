
import axiosInstance from "@/api/axios.config";

export const updateInventorySheets = (id, data) => axiosInstance.put(`/inventory-sheets/${id}`, data);
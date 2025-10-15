
import axiosInstance from "@/api/axios.config";

export const updateInventorySheets = (id, data) => axiosInstance.patch(`/inventory-sheets/${id}`, data);
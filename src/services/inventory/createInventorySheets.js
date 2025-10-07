
import axiosInstance from "@/api/axios.config";

export const createInventorySheets = (data) => axiosInstance.post('/inventory-sheets', data);
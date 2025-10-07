import axiosInstance from "@/api/axios.config";

export const getInventorySheets = ({ page, limit, query, state, dateFrom, dateTo, warehouseId, entity }) => {
    const params = new URLSearchParams();
    if (page) params.append('page', page);
    if (limit) params.append('limit', limit);
    if (query) params.append('query', query);
    if (state) params.append('state', state);
    if (warehouseId) params.append('warehouseId', warehouseId);
    if (dateFrom) params.append('dateFrom', dateFrom);
    if (dateTo) params.append('dateTo', dateTo);
    if (entity) params.append('entity', entity);


    return axiosInstance.get(`/inventory-sheets`, { params });
};
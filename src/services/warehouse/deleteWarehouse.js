import axiosInstance from "@/api/axios.config";

/**
 * Elimina un almacén por su ID
 * @param {number} id - ID del almacén a eliminar
 * @returns {Promise} - Promesa con la respuesta del servidor
 */
export const deleteWarehouse = (id) => {
    return axiosInstance.delete(`/warehouses/${id}`);
};

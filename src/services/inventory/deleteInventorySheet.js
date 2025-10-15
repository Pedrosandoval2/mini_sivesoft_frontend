import axiosInstance from "@/api/axios.config";

/**
 * Elimina una hoja de inventario por su ID
 * @param {number} id - ID de la hoja de inventario a eliminar
 * @returns {Promise} - Promesa con la respuesta del servidor
 */
export const deleteInventorySheet = (id) => {
    return axiosInstance.delete(`/inventory-sheets/${id}`);
};

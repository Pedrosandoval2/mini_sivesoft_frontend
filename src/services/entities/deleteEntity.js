import axiosInstance from "@/api/axios.config";

/**
 * Elimina una entidad por su ID
 * @param {number} id - ID de la entidad a eliminar
 * @returns {Promise} - Promesa con la respuesta del servidor
 */
export const deleteEntity = (id) => {
    return axiosInstance.delete(`/entities/${id}`);
};

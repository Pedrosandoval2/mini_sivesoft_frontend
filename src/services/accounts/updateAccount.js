import axiosInstance from "@/api/axios.config";

/**
 * Servicio para actualizar un usuario/cuenta existente
 * @param {number} id - ID del usuario a actualizar
 * @param {Object} data - Datos a actualizar
 * @returns {Promise} - Respuesta del servidor
 */
export const updateAccount = (id, data) => axiosInstance.patch(`/users/${id}`, data);

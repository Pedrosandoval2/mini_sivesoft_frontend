
/**
 * Obtiene la lista de usuarios.
 * @param {Object} params - Parámetros para filtrar usuarios.
 * @param {number} [params.page] - Número de página.
 * @param {number} [params.limit] - Cantidad de resultados por página.
 * @param {string} [params.search] - Texto de búsqueda.
 * @returns {Promise<Response>}
 */

import axiosInstance from "@/api/axios.config";

export const login = (params) => {
    return axiosInstance.post(`/auth/login`, params);
}
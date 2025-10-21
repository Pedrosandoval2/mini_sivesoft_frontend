import axiosInstance from "@/api/axios.config";


/**
 * Servicio para obtener lista de usuarios/cuentas con paginación y búsqueda
 * @param {Object} params - Parámetros de la consulta
 * @param {number} params.page - Número de página
 * @param {number} params.limit - Límite de resultados por página
 * @param {string} params.query - Término de búsqueda
 * @returns {Promise} - Respuesta del servidor con lista de usuarios
 */
export const getAccounts = async ({ page = 1, limit = 10, query = '' }) => {

    const paramsObj = {};
    if (page) paramsObj.page = page;
    if (limit) paramsObj.limit = limit;
    if (query) paramsObj.query = query;

    return axiosInstance.get(`/users`, { params: paramsObj });
}

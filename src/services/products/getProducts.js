import axiosInstance from "@/api/axios.config";

/**
 * Obtiene la lista de productos con paginación
 * @param {Object} params - Parámetros para filtrar productos
 * @param {number} [params.page] - Número de página
 * @param {number} [params.limit] - Cantidad de resultados por página
 * @param {string} [params.search] - Texto de búsqueda
 * @returns {Promise<Response>}
 */
export const getProducts = (params) => {
    return axiosInstance.get('/products', { params });
}

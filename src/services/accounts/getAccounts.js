import axios from '@/api/axios.config'

/**
 * Servicio para obtener lista de usuarios/cuentas con paginación y búsqueda
 * @param {Object} params - Parámetros de la consulta
 * @param {number} params.page - Número de página
 * @param {number} params.limit - Límite de resultados por página
 * @param {string} params.query - Término de búsqueda
 * @returns {Promise} - Respuesta del servidor con lista de usuarios
 */
export const getAccounts = async ({ page = 1, limit = 10, query = '' }) => {
  const response = await axios.get('/users', {
    params: {
      page,
      limit,
      search: query
    }
  })
  return response
}

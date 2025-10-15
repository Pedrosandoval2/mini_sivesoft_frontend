import { useQuery } from '@tanstack/react-query'
import { getWarehouses } from '@/services/warehouse/getWarehouses'

/**
 * Hook para obtener almacenes con paginación y búsqueda usando React Query
 * @param {Object} params - Parámetros de la consulta
 * @param {number} params.page - Número de página
 * @param {number} params.limit - Límite de resultados por página
 * @param {string} params.search - Término de búsqueda
 * @returns {Object} - Objeto con data, isLoading, error y helpers de React Query
 */
export const useWarehouses = ({ page = 1, limit = 10, search = '' }) => {
  return useQuery({
    queryKey: ['warehouses', { page, limit, search }],
    queryFn: async () => {
      const response = await getWarehouses({ page, limit, query: search })
      return response.data
    },
    // Mantener datos previos mientras se cargan nuevos (evita "flash" de loading)
    placeholderData: (previousData) => previousData,
  })
}

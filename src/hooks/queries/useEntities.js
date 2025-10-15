import { useQuery } from '@tanstack/react-query'
import { getEntities } from '@/services/entities/getEntites'

/**
 * Hook para obtener entidades con paginación y búsqueda usando React Query
 * @param {Object} params - Parámetros de la consulta
 * @param {number} params.page - Número de página
 * @param {number} params.limit - Límite de resultados por página
 * @param {string} params.search - Término de búsqueda
 * @returns {Object} - Objeto con data, isLoading, error y helpers de React Query
 */
export const useEntities = ({ page = 1, limit = 10, search = '' }) => {
  return useQuery({
    queryKey: ['entities', { page, limit, search }],
    queryFn: async () => {
      const response = await getEntities({ page, limit, query: search })
      return response.data
    },
    placeholderData: (previousData) => previousData,
  })
}

import { useQuery } from '@tanstack/react-query'
import { getAccounts } from '@/services/accounts/getAccounts'

/**
 * Hook para obtener usuarios/cuentas con paginación y búsqueda usando React Query
 * @param {Object} params - Parámetros de la consulta
 * @param {number} params.page - Número de página
 * @param {number} params.limit - Límite de resultados por página
 * @param {string} params.search - Término de búsqueda
 * @returns {Object} - Objeto con data, isLoading, error y helpers de React Query
 */
export const useAccounts = ({ page = 1, limit = 10, search = '' }) => {
  return useQuery({
    queryKey: ['accounts', { page, limit, search }],
    queryFn: async () => {
      const response = await getAccounts({ page, limit, query: search })
      return response.data
    },
    // Mantener datos previos mientras se cargan nuevos (evita "flash" de loading)
    placeholderData: (previousData) => previousData,
  })
}

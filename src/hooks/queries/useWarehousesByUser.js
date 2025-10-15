import { useQuery } from '@tanstack/react-query'
import { getWarehousesByUser } from '@/services/warehouse/getWarehouseByUser'

/**
 * Hook para obtener almacenes del usuario actual usando React Query
 * @returns {Object} - Objeto con data (array de almacenes), isLoading, error
 */
export const useWarehousesByUser = () => {
  return useQuery({
    queryKey: ['warehouses-by-user'],
    queryFn: async () => {
      const response = await getWarehousesByUser()
      return response.data
    },
    staleTime: 0, // Los datos se consideran obsoletos inmediatamente
    refetchOnMount: true, // Refetch cuando se monta el componente
    refetchOnWindowFocus: true, // Refetch cuando vuelves a la ventana
  })
}

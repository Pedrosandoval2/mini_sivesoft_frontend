import { useQuery } from '@tanstack/react-query'
import { getInventorySheets } from '@/services/inventory/getInventorySheets'

/**
 * Hook para obtener hojas de inventario con paginación, búsqueda y filtros usando React Query
 * @param {Object} params - Parámetros de la consulta
 * @param {number} params.page - Número de página
 * @param {number} params.limit - Límite de resultados por página
 * @param {string} params.search - Término de búsqueda
 * @param {string} params.state - Estado de la hoja de inventario (opcional)
 * @param {string} params.warehouseId - ID del almacén (opcional)
 * @param {string} params.dateFrom - Fecha desde (opcional)
 * @param {string} params.dateTo - Fecha hasta (opcional)
 * @param {string} params.entity - ID de la entidad (opcional)
 * @param {Object} options - Opciones adicionales de React Query
 * @returns {Object} - Objeto con data, isLoading, error y helpers de React Query
 */
export const useInventorySheets = ({ 
  page = 1, 
  limit = 10, 
  search = '',
  state = '',
  warehouseId = '',
  dateFrom = '',
  dateTo = '',
  entity = ''
}, options = {}) => {
  return useQuery({
    queryKey: ['inventory-sheets', { page, limit, search, state, warehouseId, dateFrom, dateTo, entity }],
    queryFn: async () => {
      const response = await getInventorySheets({ 
        page, 
        limit, 
        query: search,
        state,
        warehouseId,
        dateFrom,
        dateTo,
        entity
      })
      return response.data
    },
    placeholderData: (previousData) => previousData,
    ...options
  })
}

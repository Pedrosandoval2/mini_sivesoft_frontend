import { useQuery } from '@tanstack/react-query';
import { getProducts } from '@/services/products/getProducts';

/**
 * Hook para obtener la lista de productos con paginación
 * @param {Object} filters - Filtros para la consulta
 * @param {number} [filters.page] - Número de página
 * @param {number} [filters.limit] - Cantidad de resultados por página
 * @param {string} [filters.search] - Texto de búsqueda
 * @param {Object} options - Opciones adicionales de React Query
 * @returns {Object} Query result
 */
export const useProducts = (filters = {}, options = {}) => {
    return useQuery({
        queryKey: ['products', filters],
        queryFn: () => getProducts(filters),
        ...options
    });
};

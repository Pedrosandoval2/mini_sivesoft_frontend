import { useQuery } from '@tanstack/react-query';
import { getProductById } from '@/services/products/getProductById';

/**
 * Hook para obtener un producto por su ID
 * @param {string} id - ID del producto
 * @param {Object} options - Opciones adicionales de React Query
 * @returns {Object} Query result
 */
export const useProductById = (id, options = {}) => {
    return useQuery({
        queryKey: ['products', id],
        queryFn: () => getProductById(id),
        enabled: !!id, // Solo ejecuta si hay ID
        ...options
    });
};

import { useQuery } from '@tanstack/react-query';
import { getProductByBarcode } from '@/services/products/getProductByBarcode';

/**
 * Hook para obtener un producto por su código de barras
 * @param {string} barcode - Código de barras del producto
 * @param {Object} options - Opciones adicionales de React Query
 * @returns {Object} Query result
 */
export const useProductByBarcode = (barcode, options = {}) => {
    return useQuery({
        queryKey: ['products', 'barcode', barcode],
        queryFn: () => getProductByBarcode(barcode),
        enabled: !!barcode, // Solo ejecuta si hay código de barras
        ...options
    });
};

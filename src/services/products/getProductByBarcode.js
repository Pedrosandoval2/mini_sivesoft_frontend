import axiosInstance from "@/api/axios.config";

/**
 * Obtiene un producto por su código de barras
 * @param {string} barcode - Código de barras del producto
 * @returns {Promise<Response>}
 */
export const getProductByBarcode = (barcode) => {
    return axiosInstance.get('/products/barcode', {
        params: { barcode }
    });
}

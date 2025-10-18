import axiosInstance from "@/api/axios.config";

/**
 * Crea un nuevo producto
 * @param {Object} productData - Datos del producto
 * @returns {Promise<Response>}
 */
export const createProduct = (productData) => {
    return axiosInstance.post('/products', productData);
}

import axiosInstance from "@/api/axios.config";

/**
 * Actualiza un producto existente
 * @param {string} id - ID del producto
 * @param {Object} productData - Datos actualizados del producto
 * @returns {Promise<Response>}
 */
export const updateProduct = (id, productData) => {
    return axiosInstance.patch(`/products/${id}`, productData);
}

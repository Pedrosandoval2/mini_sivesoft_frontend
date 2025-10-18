import axiosInstance from "@/api/axios.config";

/**
 * Obtiene un producto por su ID
 * @param {string} id - ID del producto
 * @returns {Promise<Response>}
 */
export const getProductById = (id) => {
    return axiosInstance.get(`/products/${id}`);
}

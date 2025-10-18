import axiosInstance from "@/api/axios.config";

/**
 * Elimina un producto
 * @param {string} id - ID del producto a eliminar
 * @returns {Promise<Response>}
 */
export const deleteProduct = (id) => {
    return axiosInstance.delete(`/products/${id}`);
}

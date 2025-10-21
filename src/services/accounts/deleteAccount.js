import axios from '@/api/axios.config'

/**
 * Servicio para eliminar una cuenta de usuario
 * @param {string|number} id - ID del usuario a eliminar
 * @returns {Promise} - Respuesta del servidor
 */
export const deleteAccount = async (id) => {
  const response = await axios.delete(`/users/${id}`)
  return response
}

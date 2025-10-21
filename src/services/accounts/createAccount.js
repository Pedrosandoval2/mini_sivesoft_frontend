import axios from '@/api/axios.config'

/**
 * Servicio para crear una nueva cuenta de usuario
 * @param {Object} accountData - Datos de la cuenta
 * @param {string} accountData.username - Nombre de usuario
 * @param {string} accountData.password - Contraseña
 * @param {string} accountData.role - Rol del usuario (user, admin, etc)
 * @param {Array<string>} accountData.tenantIds - IDs de empresas asignadas
 * @param {string|null} accountData.entityRelationId - ID de entidad relacionada (opcional)
 * @param {Array<number>} accountData.warehouseIds - IDs de almacenes asignados
 * @returns {Promise} - Respuesta del servidor
 */
export const createAccount = async (accountData) => {
  const response = await axios.post('/users', accountData)
  return response
}

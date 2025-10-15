import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createWarehouse } from '@/services/warehouse/createWarehouse'
import { updateWarehouse } from '@/services/warehouse/updateWarehouse'
import { deleteWarehouse } from '@/services/warehouse/deleteWarehouse'
import { toast } from 'react-toastify'

/**
 * Hook para crear un nuevo almacén
 */
export const useCreateWarehouse = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (warehouseData) => createWarehouse(warehouseData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['warehouses'] })
      queryClient.invalidateQueries({ queryKey: ['warehouses-by-user'] })
      toast.success('Almacén creado exitosamente')
    },
    onError: (error) => {
      console.error('Error creating warehouse:', error)
      const errorMessage = error?.response?.data?.message || error?.message || 'Error al crear el almacén'
      toast.error(errorMessage)
    },
  })
}

/**
 * Hook para actualizar un almacén existente
 */
export const useUpdateWarehouse = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }) => {
      console.log(data);
      return updateWarehouse(id, data)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['warehouses'] })
      queryClient.invalidateQueries({ queryKey: ['warehouses-by-user'] })
      toast.success('Almacén actualizado exitosamente')
    },
    onError: (error) => {
      console.error('Error updating warehouse:', error)
      const errorMessage = error?.response?.data?.message || error?.message || 'Error al actualizar el almacén'
      toast.error(errorMessage)
    },
  })
}

/**
 * Hook para eliminar un almacén
 */
export const useDeleteWarehouse = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id) => deleteWarehouse(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['warehouses'] })
      queryClient.invalidateQueries({ queryKey: ['warehouses-by-user'] })
      toast.success('Almacén eliminado exitosamente')
    },
    onError: (error) => {
      console.error('Error deleting warehouse:', error)
      const errorMessage = error?.response?.data?.message || error?.message || 'Error al eliminar el almacén'
      toast.error(errorMessage)
    },
  })
}


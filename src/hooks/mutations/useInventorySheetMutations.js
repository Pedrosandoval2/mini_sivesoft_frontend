import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createInventorySheets } from '@/services/inventory/createInventorySheets'
import { updateInventorySheets } from '@/services/inventory/updateInventorySheets'
import { deleteInventorySheet } from '@/services/inventory/deleteInventorySheet'
import { toast } from 'react-toastify'


/**
 * Hook para crear una nueva hoja de inventario
 */
export const useCreateInventorySheet = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data) => createInventorySheets(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['inventory-sheets'] })
      toast.success('Hoja de inventario creada exitosamente')
    },
    onError: (error) => {
      console.error('Error creating inventory sheet:', error)
      const errorMessage = error?.response?.data?.message || error?.message || 'Error al crear la hoja de inventario'
      toast.error(errorMessage)
    }
  })
}

/**
 * Hook para actualizar una hoja de inventario existente
 */
export const useUpdateInventorySheet = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }) => updateInventorySheets(id, data),
    onSuccess: (response, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['inventory-sheets'] })
      queryClient.invalidateQueries({ queryKey: ['inventory-sheet', id] })
      toast.success('Hoja de inventario actualizada exitosamente')
    },
    onError: (error) => {
      console.error('Error updating inventory sheet:', error)
      const errorMessage = error?.response?.data?.message || error?.message || 'Error al actualizar la hoja de inventario'
      toast.error(errorMessage)
    }
  })
}

/**
 * Hook para eliminar una hoja de inventario
 */
export const useDeleteInventorySheet = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id) => deleteInventorySheet(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['inventory-sheets'] })
      toast.success('Hoja de inventario eliminada exitosamente')
    },
    onError: (error) => {
      console.error('Error deleting inventory sheet:', error)
      const errorMessage = error?.response?.data?.message || error?.message || 'Error al eliminar la hoja de inventario'
      toast.error(errorMessage)
    }
  })
}



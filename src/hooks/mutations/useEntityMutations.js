import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createEntity } from '@/services/entities/createEntity'
import { updateEntity } from '@/services/entities/updateEntity'
import { deleteEntity } from '@/services/entities/deleteEntity'
import { toast } from 'react-toastify'

/**
 * Hook para crear una nueva entidad
 */
export const useCreateEntity = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (entityData) => createEntity(entityData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['entities'] })
      toast.success('Entidad creada exitosamente')
    },
    onError: (error) => {
      console.error('Error creating entity:', error)
      const errorMessage = error?.response?.data?.message || error?.message || 'Error al crear la entidad'
      toast.error(errorMessage)
    },
  })
}

/**
 * Hook para actualizar una entidad existente
 */
export const useUpdateEntity = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }) => updateEntity(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['entities'] })
      toast.success('Entidad actualizada exitosamente')
    },
    onError: (error) => {
      console.error('Error updating entity:', error)
      const errorMessage = error?.response?.data?.message || error?.message || 'Error al actualizar la entidad'
      toast.error(errorMessage)
    },
  })
}

/**
 * Hook para eliminar una entidad
 */
export const useDeleteEntity = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id) => deleteEntity(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['entities'] })
      toast.success('Entidad eliminada exitosamente')
    },
    onError: (error) => {
      console.error('Error deleting entity:', error)
      const errorMessage = error?.response?.data?.message || error?.message || 'Error al eliminar la entidad'
      toast.error(errorMessage)
    },
  })
}


import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createAccount } from '@/services/accounts/createAccount'
import { deleteAccount } from '@/services/accounts/deleteAccount'
import { toast } from 'react-toastify'

/**
 * Hook para crear cuentas de usuario con React Query
 * Incluye invalidación automática del caché y notificaciones toast
 */
export const useCreateAccount = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: createAccount,
    onSuccess: () => {
      // Invalidar caché de usuarios si existe
      queryClient.invalidateQueries({ queryKey: ['accounts'] })
      queryClient.invalidateQueries({ queryKey: ['users'] })
      
      toast.success('Cuenta creada exitosamente')
    },
    onError: (error) => {
      const errorMessage = error.response?.data?.message || 'Error al crear la cuenta'
      toast.error(errorMessage)
      console.error('Error creating account:', error)
    }
  })
}

/**
 * Hook para eliminar cuentas de usuario con React Query
 * Incluye invalidación automática del caché y notificaciones toast
 */
export const useDeleteAccount = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: deleteAccount,
    onSuccess: () => {
      // Invalidar caché de usuarios
      queryClient.invalidateQueries({ queryKey: ['accounts'] })
      queryClient.invalidateQueries({ queryKey: ['users'] })
      
      toast.success('Cuenta eliminada exitosamente')
    },
    onError: (error) => {
      const errorMessage = error.response?.data?.message || 'Error al eliminar la cuenta'
      toast.error(errorMessage)
      console.error('Error deleting account:', error)
    }
  })
}

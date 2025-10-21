import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createAccount } from '@/services/accounts/createAccount'
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

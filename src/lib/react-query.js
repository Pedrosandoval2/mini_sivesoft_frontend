import { QueryClient } from '@tanstack/react-query'

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Tiempo que los datos permanecen frescos (no se revalidan automáticamente)
      staleTime: 1000 * 60 * 5, // 5 minutos
      
      // Tiempo que los datos permanecen en caché antes de ser eliminados
      gcTime: 1000 * 60 * 10, // 10 minutos (antes era cacheTime)
      
      // Reintentar peticiones fallidas
      retry: 1,
      
      // Refetch al volver a la ventana
      refetchOnWindowFocus: false,
      
      // Refetch al reconectar
      refetchOnReconnect: true,
      
      // Mostrar errores en la consola (útil para desarrollo)
      throwOnError: false,
    },
    mutations: {
      // Reintentar mutaciones fallidas
      retry: 0,
    },
  },
})

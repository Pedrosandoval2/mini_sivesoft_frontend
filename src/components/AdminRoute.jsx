import { Navigate } from 'react-router-dom'
import { useUserStore } from '@/store/userStore'

/**
 * Componente para proteger rutas que solo pueden acceder administradores
 * Redirige a /warehouses si el usuario tiene rol 'user'
 */
export default function AdminRoute({ children }) {
  const user = useUserStore((state) => state.user)
  
  // Si el usuario tiene rol 'user', redirigir a una página permitida
  if (user?.role === 'user') {
    return <Navigate to="/warehouses" replace />
  }
  
  return children
}

import { useNavigate, useLocation } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { LogOut, Package, Building2, FileText, User, File, Box } from 'lucide-react'
import { useUserStore } from '@/store/userStore'
import { useQueryClient } from '@tanstack/react-query'

export default function Layout({ children }) {
  const navigate = useNavigate()
  const location = useLocation()
  const isActive = location.pathname !== '/login' && location.pathname !== '/select-company'
  const clearUser = useUserStore((state) => state.clearUser)
  const user = useUserStore((state) => state?.user)
  const queryClient = useQueryClient()

  const handleLogout = () => {
    // Limpiar el store de usuario
    clearUser()
    
    // Limpiar el caché de React Query
    queryClient.clear()
    
    // Cancelar todas las queries en ejecución
    queryClient.cancelQueries()
    
    // Navegar al login
    navigate('/login', { replace: true })
  }

  const navigationItems = [
    {
      path: '/warehouses',
      label: 'Almacenes',
      icon: Package
    },
    {
      path: '/products',
      label: 'Productos',
      icon: Box
    },
    {
      path: '/inventory-sheets',
      label: 'Hoja de Inventario',
      icon: FileText
    },
    {
      path: '/entidades',
      label: 'Entidades',
      icon: User
    },
    {
      path: '/reportes',
      label: 'Reportes',
      icon: File
    }
  ]

  return (
    <>
      {isActive ? (
        <div className="bg-gray-50">
          <header className="bg-white shadow-sm border-b">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex justify-between items-center h-16">
                <div className="items-center space-x-4 flex">
                  <div className=' flex flex-col items-center justify-center'>
                    <Building2 className="h-8 w-8 text-blue-600" />
                    <p className="text-sm text-gray-500">
                      User: {user?.nameEntity || 'Invitado'}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <nav className="hidden md:flex items-center space-x-4">
                    {navigationItems.map((item) => {
                      const Icon = item.icon
                      const isActive = location.pathname === item.path
                      return (
                        <Button
                          key={item.path}
                          variant={isActive ? 'default' : 'ghost'}
                          onClick={() => navigate(item.path)}
                          className="flex items-center space-x-2"
                        >
                          <Icon className="h-4 w-4" />
                          <span>{item.label}</span>
                        </Button>
                      )
                    })}
                  </nav>

                  {/* Navegación móvil simplificada */}
                  <div className="md:hidden flex items-center space-x-2">
                    {navigationItems.map((item) => {
                      const Icon = item.icon
                      const isActive = location.pathname === item.path
                      return (
                        <Button
                          key={item.path}
                          variant={isActive ? 'default' : 'ghost'}
                          size="sm"
                          onClick={() => navigate(item.path)}
                        >
                          <Icon className="h-4 w-4" />
                        </Button>
                      )
                    })}
                  </div>
                </div>

                <Button variant="outline" onClick={handleLogout}>
                  <LogOut className="h-4 w-4 mr-2" />
                  Cerrar Sesión
                </Button>
              </div>
            </div>
          </header>

          <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
            {children}
          </main>
        </div>
      ) : (<>{children}</>)
      }
    </>
  )
}

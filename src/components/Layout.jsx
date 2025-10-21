import { useNavigate, useLocation } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { LogOut, Package, Building2, FileText, User, File, Box, Settings, UserPlus } from 'lucide-react'
import { useUserStore } from '@/store/userStore'
import { useQueryClient } from '@tanstack/react-query'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

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
                  <div className='flex flex-col items-center justify-center'>
                    <Building2 className="hidden h-8 w-8 text-blue-600 md:flex" />
                    <p className="text-sm text-gray-500">
                      User: {user?.nameEntity || 'Admin'}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <nav className="hidden md:flex items-center space-x-4">
                    {/* Botón Configuración con Popover */}
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="ghost"
                          className="flex items-center space-x-2"
                        >
                          <Settings className="h-4 w-4" />
                          <span>Configuración</span>
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-56 p-2" align="end">
                        <div className="space-y-1">
                          <Button
                            variant="ghost"
                            className="w-full justify-start"
                            onClick={() => navigate('/warehouses')}
                          >
                            <Package className="h-4 w-4 mr-2" />
                            Almacenes
                          </Button>
                          <Button
                            variant="ghost"
                            className="w-full justify-start"
                            onClick={() => navigate('/entidades')}
                          >
                            <User className="h-4 w-4 mr-2" />
                            Entidades
                          </Button>
                          <Button
                            variant="ghost"
                            className="w-full justify-start"
                            onClick={() => navigate('/accounts')}
                          >
                            <UserPlus className="h-4 w-4 mr-2" />
                            Cuentas
                          </Button>
                        </div>
                      </PopoverContent>
                    </Popover>

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
                    {/* Botón Configuración Móvil con Popover */}
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                        >
                          <Settings className="h-4 w-4" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-48 p-2" align="end">
                        <div className="space-y-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="w-full justify-start"
                            onClick={() => navigate('/warehouses')}
                          >
                            <Package className="h-4 w-4 mr-2" />
                            Almacenes
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="w-full justify-start"
                            onClick={() => navigate('/entidades')}
                          >
                            <User className="h-4 w-4 mr-2" />
                            Entidades
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="w-full justify-start"
                            onClick={() => navigate('/accounts')}
                          >
                            <User className="h-4 w-4 mr-2" />
                            Ver Cuentas
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="w-full justify-start"
                            onClick={() => navigate('/accounts/new')}
                          >
                            <UserPlus className="h-4 w-4 mr-2" />
                            Crear Cuenta
                          </Button>
                        </div>
                      </PopoverContent>
                    </Popover>
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
                  <LogOut className="md:h-4 md:w-4 md:mr-2 " />
                  <p className='hidden md:flex'>Cerrar Sesión</p>
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

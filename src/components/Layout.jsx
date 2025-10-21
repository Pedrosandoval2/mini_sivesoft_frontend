import { useNavigate, useLocation } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { LogOut, Package, Building2, FileText, User, File, Box } from 'lucide-react'
import { useUserStore } from '@/store/userStore'
import { useQueryClient } from '@tanstack/react-query'
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu"
import { cn } from "@/lib/utils"

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
        <div className="bg-gray-50 min-h-screen">
          <header className="bg-white shadow-sm border-b sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex justify-between items-center h-16">
                {/* Logo y Usuario */}
                <div className="items-center space-x-4 flex">
                  <div className='flex flex-col items-center justify-center'>
                    <Building2 className="h-8 w-8 text-blue-600" />
                    <p className="text-sm text-gray-500">
                      User: {user?.nameEntity || 'Admin'}
                    </p>
                  </div>
                </div>

                {/* Navegación con NavigationMenu */}
                <NavigationMenu className="hidden md:block">
                  <NavigationMenuList>
                    {navigationItems.map((item) => {
                      const Icon = item.icon
                      const isActiveRoute = location.pathname === item.path
                      return (
                        <NavigationMenuItem key={item.path}>
                          <NavigationMenuLink
                            onClick={() => navigate(item.path)}
                            className={cn(
                              navigationMenuTriggerStyle(),
                              "cursor-pointer flex items-center gap-2",
                              isActiveRoute && "bg-accent text-accent-foreground"
                            )}
                          >
                            <Icon className="h-4 w-4" />
                            <span>{item.label}</span>
                          </NavigationMenuLink>
                        </NavigationMenuItem>
                      )
                    })}
                  </NavigationMenuList>
                </NavigationMenu>

                {/* Navegación móvil simplificada */}
                <div className="md:hidden flex items-center space-x-2">
                  {navigationItems.map((item) => {
                    const Icon = item.icon
                    const isActiveRoute = location.pathname === item.path
                    return (
                      <Button
                        key={item.path}
                        variant={isActiveRoute ? 'default' : 'ghost'}
                        size="sm"
                        onClick={() => navigate(item.path)}
                      >
                        <Icon className="h-4 w-4" />
                      </Button>
                    )
                  })}
                </div>

                {/* Botón Logout */}
                <Button variant="outline" onClick={handleLogout}>
                  <LogOut className="h-4 w-4 mr-2" />
                  <span className="hidden md:inline">Cerrar Sesión</span>
                </Button>
              </div>
            </div>
          </header>

          <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
            {children}
          </main>
        </div>
      ) : (
        <>{children}</>
      )}
    </>
  )
}



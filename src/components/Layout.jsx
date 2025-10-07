import { useNavigate, useLocation } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { LogOut, Package, Building2, FileText, User, File } from 'lucide-react'
import { useUserStore } from '@/store/userStore'

export default function Layout({ children }) {
  const navigate = useNavigate()
  const location = useLocation()
  const isActive = location.pathname !== '/login' && location.pathname !== '/select-company'
  const clearUser = useUserStore((state) => state.clearUser)
  const user = useUserStore((state) => state?.user)

  const handleLogout = () => {
    clearUser()
  }

  const navigationItems = [
    {
      access: ['admin', 'manager', 'user'],
      path: '/warehouses',
      label: 'Almacenes',
      icon: Package
    },
    {
      access: ['admin', 'manager', 'user'],
      path: '/inventory-sheets',
      label: 'Hoja de Inventario',
      icon: FileText
    },
    {
      access: ['admin', 'manager', 'user'],
      path: '/entidades',
      label: 'Entidades',
      icon: User
    },
    {
      access: ['admin', 'manager', 'user'],
      path: '/reportes',
      label: 'Reportes',
      icon: File
    },
    {
      access: ['admin', 'manager'],
      path: '/configuraciones',
      label: 'Configuraciones',
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
                      if (!item.access.includes(user?.role)) return null
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

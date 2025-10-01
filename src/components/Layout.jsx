import { useNavigate, useLocation } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { LogOut, Package, Building2, FileText } from 'lucide-react'
import { useUserStore } from '@/store/userStore'

export default function Layout({ children }) {
  const navigate = useNavigate()
  const location = useLocation()
  const isActive = location.pathname !== '/login' && location.pathname !== '/select-company'
  const clearUser = useUserStore((state) => state.clearUser)

  const handleLogout = () => {
    clearUser()
  }

  const navigationItems = [
    {
      path: '/warehouses',
      label: 'Almacenes',
      icon: Package
    },
    {
      path: '/inventory-sheets/new',
      label: 'Nueva Hoja de Inventario',
      icon: FileText
    }
  ]

  return (
    <>
      {isActive ? (
        <div className="min-h-screen bg-gray-50">
          <header className="bg-white shadow-sm border-b">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex justify-between items-center h-16">
                <div className="flex items-center space-x-4">
                  <Building2 className="h-8 w-8 text-blue-600" />
                  <div>
                    <h1 className="text-xl font-bold text-gray-900">
                      Sistema de Gestión de Almacenes
                    </h1>
                    <p className="text-sm text-gray-500">
                      Usuario: {localStorage.getItem('currentUser') || 'Invitado'}
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

import './App.css'
import { lazy, Suspense } from 'react'
import { ToastContainer } from 'react-toastify'
import { useUserStore } from '@/store/userStore'
import { RoutesPages } from './routes/routesPages'

const routesPublics = [
  {
    path: '/login',
    component: lazy(() => import('./pages/login/LoginPage.jsx')),
  },
]

const routesPrivates = [
  {
    path: '/select-company',
    component: lazy(() => import('./pages/companySelect/SelectCompanyPage.jsx')),
  },
  {
    path: '/warehouses',
    component: lazy(() => import('./pages/warehouse/WarehousesPage.jsx')),
  },
  {
    path: '/warehouses/new',
    component: lazy(() => import('./pages/warehouse/NewWarehousePage.jsx')),
  },
  {
    path: '/inventory-sheets',
    component: lazy(() => import('./pages/inventory/InventorySheetPage.jsx')),
  },
  {
    path: '/inventory-sheets/new',
    component: lazy(() => import('./pages/inventory/NewInventorySheetPage.jsx')),
  },
]

function App() {
  const user = useUserStore((state) => state.user)

  const routes = user?.token ? routesPrivates : routesPublics
  const typeRoutes = user?.token ? 'private' : 'public'

  return (
    <Suspense
      fallback={
        <div className="flex justify-center items-center h-screen">
          Cargando...
        </div>
      }
    >
      <ToastContainer />
      <RoutesPages routes={routes} typeRoutes={typeRoutes} />
    </Suspense>
  )
}

export default App

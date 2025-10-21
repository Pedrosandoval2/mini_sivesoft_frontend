import './App.css'
import { lazy, Suspense } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import { QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { queryClient } from '@/lib/react-query'
import { useUserStore } from '@/store/userStore'
import Layout from '@/components/Layout'

// Importación lazy de componentes para optimizar el rendimiento y reducir el tamaño inicial del bundle
const LoginPage = lazy(() => import('./pages/login/LoginPage.jsx'))
const HomePage = lazy(() => import('./pages/home/HomePage'))
const SelectCompanyPage = lazy(() => import('./pages/companySelect/SelectCompanyPage'))
const WarehousesPage = lazy(() => import('./pages/warehouse/WarehousesPage'))
const NewWarehousePage = lazy(() => import('./pages/warehouse/NewWarehousePage'))
const ProductsPage = lazy(() => import('./pages/products/ProductsPage'))
const NewProductPage = lazy(() => import('./pages/products/NewProductPage'))
const InventorySheetPage = lazy(() => import('./pages/inventory/InventorySheetPage'))
const NewInventorySheetPage = lazy(() => import('./pages/inventory/NewInventorySheetPage'))
const EntitiesPage = lazy(() => import('./pages/entities/EntitiesPage'))
const NewEntityPage = lazy(() => import('./pages/entities/NewEntityPage'))
const InventoryReportsPage = lazy(() => import('./pages/reports/InventoryReportsPage'))
const ConfigurationsPage = lazy(() => import('./pages/configurations/ConfigurationsPage'))
const NewAccountPage = lazy(() => import('./pages/accounts/NewAccountPage'))

function App() {
  // Obtener el usuario del store para verificar el token
  const user = useUserStore((state) => state.user)
  // validar si el usuario tiene token
  const hasToken = !!user?.token

  return (
    // Proveedor de consultas de React Query para estandarizar el manejo de datos asíncronos
    <QueryClientProvider client={queryClient}>
      <Router>
        {/* En caso de que no haya token, redirigir a login */}
        <Suspense fallback={<div className="flex justify-center items-center h-screen">Cargando...</div>}>
          {/* Para mostrarq notificaciones */}
          <ToastContainer />

          {hasToken ? (
            // Con token: Mostrar todas las rutas privadas con Layout
            <Layout isActive={true}>
              <Routes>
                <Route path="/home" element={<HomePage />} />
                <Route path="/select-company" element={<SelectCompanyPage />} />
                <Route path="/warehouses" element={<WarehousesPage />} />
                <Route path="/warehouses/new" element={<NewWarehousePage />} />
                <Route path="/products" element={<ProductsPage />} />
                <Route path="/products/new" element={<NewProductPage />} />
                <Route path="/inventory-sheets" element={<InventorySheetPage />} />
                <Route path="/inventory-sheets/new" element={<NewInventorySheetPage />} />
                <Route path="/entidades" element={<EntitiesPage />} />
                <Route path="/entidades/new" element={<NewEntityPage />} />
                <Route path="/reportes" element={<InventoryReportsPage />} />
                <Route path="/configuraciones" element={<ConfigurationsPage />} />
                <Route path="/accounts/new" element={<NewAccountPage />} />
              </Routes>
            </Layout>
          ) : (
            // Sin token: Solo mostrar login
            <Routes>
              <Route path="/login" element={<LoginPage />} />
              <Route path="*" element={<Navigate to="/login" replace />} />
            </Routes>
          )}
        </Suspense>
      </Router>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  )
}

export default App

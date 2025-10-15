import './App.css'
import { lazy, Suspense } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import { QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { queryClient } from '@/lib/react-query'
import { useUserStore } from '@/store/userStore'
import Layout from '@/components/Layout'

// Importación lazy de componentes
const LoginPage = lazy(() => import('./pages/login/LoginPage.jsx'))
const HomePage = lazy(() => import('./pages/home/HomePage'))
const SelectCompanyPage = lazy(() => import('./pages/companySelect/SelectCompanyPage'))
const WarehousesPage = lazy(() => import('./pages/warehouse/WarehousesPage'))
const NewWarehousePage = lazy(() => import('./pages/warehouse/NewWarehousePage'))
const InventorySheetPage = lazy(() => import('./pages/inventory/InventorySheetPage'))
const NewInventorySheetPage = lazy(() => import('./pages/inventory/NewInventorySheetPage'))
const EntitiesPage = lazy(() => import('./pages/entities/EntitiesPage'))
const NewEntityPage = lazy(() => import('./pages/entities/NewEntityPage'))
const InventoryReportsPage = lazy(() => import('./pages/reports/InventoryReportsPage'))
const ConfigurationsPage = lazy(() => import('./pages/configurations/ConfigurationsPage'))

function App() {
  const user = useUserStore((state) => state.user)
  const hasToken = !!user?.token

  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <Suspense fallback={<div className="flex justify-center items-center h-screen">Cargando...</div>}>
          <ToastContainer />

          {!hasToken ? (
            // Sin token: Solo mostrar login
            <Routes>
              <Route path="/login" element={<LoginPage />} />
              <Route path="*" element={<Navigate to="/login" replace />} />
            </Routes>
          ) : (
            // Con token: Mostrar todas las rutas privadas con Layout
            <Layout isActive={true}>
              <Routes>
                <Route path="/home" element={<HomePage />} />
                <Route path="/select-company" element={<SelectCompanyPage />} />
                <Route path="/warehouses" element={<WarehousesPage />} />
                <Route path="/warehouses/new" element={<NewWarehousePage />} />
                <Route path="/inventory-sheets" element={<InventorySheetPage />} />
                <Route path="/inventory-sheets/new" element={<NewInventorySheetPage />} />
                <Route path="/entidades" element={<EntitiesPage />} />
                <Route path="/entidades/new" element={<NewEntityPage />} />
                <Route path="/reportes" element={<InventoryReportsPage />} />
                <Route path="/configuraciones" element={<ConfigurationsPage />} />
              </Routes>
            </Layout>
          )}
        </Suspense>
      </Router>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  )
}

export default App

import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from '@/components/ui/alert-dialog'
import { Plus, Search, Trash2, ChevronRight, ChevronLeft } from 'lucide-react'
import { useUserStore } from '@/store/userStore'
import { useDebounce } from '@/hooks/useDebounce'
import { useAccounts } from '@/hooks/queries/useAccounts'
import { useDeleteAccount } from '@/hooks/mutations/useAccountMutations'

/**
 * Página de listado de cuentas de usuario
 * 
 * Funcionalidades:
 * - Listar usuarios con paginación
 * - Búsqueda en tiempo real con debounce
 * - Eliminar usuarios (solo para roles admin/manager)
 * - Navegación a crear nueva cuenta
 */
export default function AccountsPage() {
  const role = useUserStore((state) => state.user.role)
  const [searchQuery, setSearchQuery] = useState('')
  const [page, setPage] = useState(1)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [accountToDelete, setAccountToDelete] = useState(null)
  const limit = 10
  const debouncedSearch = useDebounce(searchQuery, 500)

  const navigate = useNavigate()

  // React Query maneja automáticamente el estado y caché
  const { data, isLoading } = useAccounts({
    page,
    limit,
    search: debouncedSearch,
  })

  // Mutation para eliminar cuentas
  const deleteMutation = useDeleteAccount()

  const totalPages = data?.totalPages || 1

  const handleChange = (e) => {
    e.preventDefault()
    setSearchQuery(e.target.value)
    // Resetear a página 1 cuando se busca
    setPage(1)
  }

  const handleDeleteClick = (account) => {
    setAccountToDelete(account)
    setDeleteDialogOpen(true)
  }

  const handleDeleteConfirm = async () => {
    if (accountToDelete) {
      await deleteMutation.mutateAsync(accountToDelete.id)
      setDeleteDialogOpen(false)
      setAccountToDelete(null)
    }
  }

  /**
   * Obtener color del badge según el rol
   */
  const getRoleBadgeVariant = (role) => {
    switch (role) {
      case 'admin':
        return 'destructive'
      case 'manager':
        return 'default'
      case 'user':
        return 'secondary'
      default:
        return 'outline'
    }
  }

  /**
   * Formatear nombre del rol
   */
  const formatRoleName = (role) => {
    const roleNames = {
      'admin': 'Administrador',
      'manager': 'Manager',
      'user': 'Usuario'
    }
    return roleNames[role] || role
  }

  return (
    <div className="bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle className="text-2xl font-bold">
                Cuentas de Usuario
              </CardTitle>
              <Button onClick={() => navigate('/accounts/new')}>
                <Plus className="h-4 w-4 mr-2" />
                Nueva Cuenta
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Barra de búsqueda */}
            <div className="flex gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  type="text"
                  placeholder="Buscar por nombre de usuario..."
                  value={searchQuery}
                  onChange={handleChange}
                  className="pl-10"
                />
              </div>
            </div>

            {/* Tabla de cuentas */}
            <div className="border rounded-lg">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Usuario</TableHead>
                    <TableHead>Rol</TableHead>
                    <TableHead>Almacenes</TableHead>
                    <TableHead>Entidad</TableHead>
                    <TableHead>Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoading ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8">
                        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
                        <p className="mt-2 text-gray-600">Cargando cuentas...</p>
                      </TableCell>
                    </TableRow>
                  ) : data?.data?.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                        No se encontraron cuentas
                      </TableCell>
                    </TableRow>
                  ) : (
                    data?.data?.map((account) => (
                      <TableRow key={account.id}>
                        <TableCell className="font-medium">{account.id}</TableCell>
                        <TableCell>{account.username}</TableCell>
                        <TableCell>
                          <Badge variant={getRoleBadgeVariant(account.role)}>
                            {formatRoleName(account.role)}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-wrap gap-1">
                            {account.warehouseIds?.length > 0 ? (
                              account.warehouseIds.map((warehouseId) => (
                                <Badge key={warehouseId} variant="outline" className="text-xs">
                                  ID: {warehouseId}
                                </Badge>
                              ))
                            ) : (
                              <span className="text-gray-400 text-sm">Sin almacenes</span>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          {account.entityRelationId ? (
                            <Badge variant="outline">ID: {account.entityRelationId}</Badge>
                          ) : (
                            <span className="text-gray-400 text-sm">Sin entidad</span>
                          )}
                        </TableCell>
                        <TableCell>
                          {role !== 'user' && (
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-red-600 hover:bg-red-50"
                              onClick={() => handleDeleteClick(account)}
                              disabled={deleteMutation.isPending}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          )}
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>

            {/* Paginación */}
            <div className="flex items-center gap-2 mt-4">
              <div className="flex items-center gap-1">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage(Math.max(1, page - 1))}
                  disabled={isLoading || page === 1}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>

                <span className="text-sm px-3 py-1">
                  Página {page} de {totalPages}
                </span>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage(Math.min(totalPages, page + 1))}
                  disabled={isLoading || page === totalPages}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Dialog de confirmación de eliminación */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Estás seguro de eliminar esta cuenta?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. Se eliminará permanentemente la cuenta de usuario{' '}
              <span className="font-semibold">{accountToDelete?.username}</span>.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              className="bg-red-600 hover:bg-red-700"
              disabled={deleteMutation.isPending}
            >
              {deleteMutation.isPending ? 'Eliminando...' : 'Eliminar'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

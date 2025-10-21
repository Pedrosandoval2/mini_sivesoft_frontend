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
import { Plus, Search, Pencil, Trash2, ChevronRight, ChevronLeft } from 'lucide-react'
import { useUserStore } from '@/store/userStore'
import { useDebounce } from '@/hooks/useDebounce'
import { formatNumberWithZero } from '@/utils/formatNumberWithZero'
import { useWarehouses } from '@/hooks/queries/useWarehouses'
import { useDeleteWarehouse } from '@/hooks/mutations/useWarehouseMutations'
import { isUser } from '@/utils/IsUser'

export default function WarehousesPage() {
  const role = useUserStore((state) => state.user.role)
  const [searchQuery, setSearchQuery] = useState('')
  const [page, setPage] = useState(1)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [warehouseToDelete, setWarehouseToDelete] = useState(null)
  const limit = 10
  const debouncedSearch = useDebounce(searchQuery, 500)

  const navigate = useNavigate()

  // React Query maneja automáticamente el estado y caché
  const { data, isLoading, error, isFetching } = useWarehouses({
    page,
    limit,
    search: debouncedSearch,
  })

  // Mutation para eliminar almacenes
  const deleteMutation = useDeleteWarehouse()

  const handleChange = (e) => {
    e.preventDefault()
    setSearchQuery(e.target.value)
    // Resetear a página 1 cuando se busca
    setPage(1)
  }

  const handleEdit = (warehouse) => {
    navigate('/warehouses/new', { state: { warehouse } })
  }

  const handleDeleteClick = (warehouse) => {
    setWarehouseToDelete(warehouse)
    setDeleteDialogOpen(true)
  }

  const handleDeleteConfirm = async () => {
    if (warehouseToDelete) {
      await deleteMutation.mutateAsync(warehouseToDelete.id)
      setDeleteDialogOpen(false)
      setWarehouseToDelete(null)
    }
  }

  return (
    <div className="bg-gray-50 md:p-6">
      <div className="mx-auto space-y-6 md:max-w-6xl">
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center md:flex-row flex-col">
              <CardTitle className="text-2xl font-bold">
                Almacenes
              </CardTitle>
              {!isUser(role) && (
                <Button onClick={() => navigate('/warehouses/new')} className='w-full mt-2 md:w-auto md:mt-0'>
                  <Plus className="h-4 md:w-4 mr-2" />
                  Nuevo Almacén
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Barra de búsqueda */}
            <div className="flex gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  type="text"
                  placeholder="Buscar almacenes..."
                  value={searchQuery}
                  onChange={handleChange}
                  className="pl-10"
                />
              </div>
            </div>

            {/* Indicador de carga/refetch en background */}
            {isFetching && !isLoading && (
              <div className="text-sm text-gray-500 text-center">
                Actualizando datos...
              </div>
            )}

            {/* Estado de error */}
            {error && (
              <div className="text-red-500 text-center p-4">
                Error al cargar almacenes: {error.message}
              </div>
            )}

            {/* Estado de carga inicial */}
            {isLoading ? (
              <div className="text-center py-8">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
                <p className="mt-2 text-gray-600">Cargando almacenes...</p>
              </div>
            ) : (
              <>
                {/* Tabla de almacenes */}
                <div className="border rounded-lg overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>N°</TableHead>
                        <TableHead>Nombre</TableHead>
                        <TableHead>Propietario</TableHead>
                        <TableHead>Dirección</TableHead>
                        <TableHead>Estado</TableHead>
                        {role !== 'user' && <TableHead className='text-center'>Acciones</TableHead>}
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {data?.data?.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={5} className="text-center py-8 text-gray-500">
                            No se encontraron almacenes
                          </TableCell>
                        </TableRow>
                      ) : (
                        data?.data.map((warehouse) => (
                          <TableRow key={warehouse.id}>
                            <TableCell className="font-medium">
                              {formatNumberWithZero(warehouse.serieWarehouse || warehouse.id)}
                            </TableCell>
                            <TableCell>{warehouse.name}</TableCell>
                            <TableCell>{warehouse?.owner?.name}</TableCell>
                            <TableCell>{warehouse.address}</TableCell>
                            <TableCell>
                              <Badge variant={warehouse.isActive ? 'default' : 'secondary'}>
                                {warehouse.isActive ? 'Activo' : 'Inactivo'}
                              </Badge>
                            </TableCell>
                            {role !== 'user' && (
                              <TableCell className='flex justify-center'>
                                <div className="flex gap-2">
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => handleEdit(warehouse)}
                                  >
                                    <Pencil className="h-4 w-4" />
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => handleDeleteClick(warehouse)}
                                    disabled={deleteMutation.isPending}
                                  >
                                    <Trash2 className="h-4 w-4 text-red-500" />
                                  </Button>
                                </div>
                              </TableCell>
                            )}
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </div>

                {/* Paginación */}
                <div className="flex items-center md:justify-end justify-center">
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setPage((p) => Math.max(1, p - 1))}
                      disabled={page === 1 || isLoading}
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <span className="flex items-center px-4 text-sm">
                      Página {page} de {data?.totalPages || 1}
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setPage((p) => p + 1)}
                      disabled={page >= (data?.totalPages || 1) || isLoading}
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Dialog de confirmación de eliminación */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Estás seguro de eliminar este almacén?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. Se eliminará permanentemente el almacén{' '}
              <span className="font-semibold">{warehouseToDelete?.name}</span>.
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

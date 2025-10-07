
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge'
import { Plus, Search, Pencil, Trash2, ChevronRight, ChevronLeft } from 'lucide-react'
import { useUserStore } from '@/store/userStore'
import { Input } from '@/components/ui/input'
import { useGetWarehouses } from '@/hooks/useGetWarehouses'
import { useState } from 'react'
import { useDebounce } from '@/hooks/useDebounce'
import { formatNumberWithZero } from '@/utils/formatNumberWithZero';
import { useEffectOncePerDeps } from '@/hooks/useEffectOncePerDeps';


export default function WarehousesPage() {
  const role = useUserStore((state) => state.user.role)
  const [searchQuery, setSearchQuery] = useState('')
  const debouncedSearch = useDebounce(searchQuery)

  const navigate = useNavigate()
  const { data, fetchWarehouses, isLoading, setPage, page, totalPages, limit } = useGetWarehouses()


  const handleChange = (e) => {
    e.preventDefault();
    setSearchQuery(e.target.value)
  }

  useEffectOncePerDeps(() => {
    fetchWarehouses({ page, limit, query: debouncedSearch ?? '' });
  }, [debouncedSearch, page]);

  return (
    <div className="bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle className="text-2xl font-bold">
                Almacenes
              </CardTitle>
              {role !== 'user' && <Button onClick={() => navigate('/warehouses/new')}>
                <Plus className="h-4 w-4 mr-2" />
                Nuevo Almacén
              </Button>}
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="relative mb-6">
              <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
              <Input
                type="text"
                placeholder="Buscar por nombre, dirección o documento..."
                value={searchQuery}
                onChange={handleChange}
                className="pl-10"
              />
            </div>

            <div className="border rounded-lg">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Nombre</TableHead>
                    <TableHead>Dirección</TableHead>
                    <TableHead>Propietario</TableHead>
                    <TableHead>Serie</TableHead>
                    <TableHead>Estado</TableHead>
                    {role !== 'user' && <TableHead>Acciones</TableHead>}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data?.map((warehouse) => (
                    <TableRow key={warehouse.id}>
                      <TableCell className="font-medium">{warehouse.id}</TableCell>
                      <TableCell>{warehouse.name}</TableCell>
                      <TableCell>{warehouse.address}</TableCell>
                      <TableCell>{warehouse.owner}</TableCell>
                      <TableCell>{formatNumberWithZero(warehouse.serieWarehouse)}</TableCell>
                      <TableCell>
                        <Badge className={warehouse.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                          {warehouse.isActive ? 'Activo' : 'Inactivo'}
                        </Badge>
                      </TableCell>
                      {role !== 'user' &&
                        <TableCell>
                          <Button variant="ghost" size="sm" className="text-gray-600 hover:bg-gray-100" onClick={() => navigate(`/warehouses/new`, { state: { warehouse } })}>
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-red-600 hover:bg-red-50"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </TableCell>}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            <div className="flex items-center gap-2">
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
                  {page} de {totalPages}
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
    </div>
  )
}


import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'

import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Plus, Search } from 'lucide-react'
import { dataWarehouse } from '@/mockData/mock'

import { FaEdit } from "react-icons/fa";
import { useUserStore } from '@/store/userStore'

export default function WarehousesPage() {
  const role = useUserStore((state) => state.user.role)
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle className="text-2xl font-bold">
                Gestión de Almacenes
              </CardTitle>
              {role !== 'user' && <Button onClick={() => navigate('/warehouses/new')}>
                <Plus className="h-4 w-4 mr-2" />
                Nuevo Almacén
              </Button>}
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-2">
              <Search className="h-4 w-4 text-gray-500" />
              <div className="flex-1">
                <Label htmlFor="search" className="sr-only">Buscar</Label>
                {/* <Input
                  id="search"
                  placeholder="Buscar por nombre, dirección o propietario..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full"
                /> */}
              </div>
            </div>

            <div className="border rounded-lg">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Nombre</TableHead>
                    <TableHead>Dirección</TableHead>
                    <TableHead>Propietario</TableHead>
                    <TableHead>Estado</TableHead>
                    {role !== 'user' && <TableHead>Acciones</TableHead>}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {dataWarehouse.data.map((warehouse) => (
                    <TableRow key={warehouse.id}>
                      <TableCell className="font-medium">{warehouse.id}</TableCell>
                      <TableCell>{warehouse.name}</TableCell>
                      <TableCell>{warehouse.address}</TableCell>
                      <TableCell>{warehouse.owner}</TableCell>
                      <TableCell>
                        <Badge variant={warehouse.isActive ? 'default' : 'secondary'}>
                          {warehouse.isActive ? 'Activo' : 'Inactivo'}
                        </Badge>
                      </TableCell>
                      {role !== 'user' && <TableCell>
                        <Button
                          variant="link"
                          className="border-1 p-0"
                          onClick={() => navigate(`/warehouses/new`, { state: { warehouse } })}
                        >
                          <FaEdit />
                        </Button>
                      </TableCell>}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

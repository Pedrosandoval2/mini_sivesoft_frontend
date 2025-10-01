import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Plus, Search } from 'lucide-react'

export default function WarehousesPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const navigate = useNavigate()

  const warehouses = [
    {
      id: 1,
      name: 'Almacén Central',
      address: 'Av. Principal 123, Bogotá',
      owner: 'Juan Pérez',
      active: true
    },
    {
      id: 2,
      name: 'Bodega Norte',
      address: 'Calle 45 #12-34, Medellín',
      owner: 'María García',
      active: true
    },
    {
      id: 3,
      name: 'Depósito Sur',
      address: 'Carrera 15 #78-90, Cali',
      owner: 'Carlos López',
      active: false
    },
    {
      id: 4,
      name: 'Almacén Oriente',
      address: 'Diagonal 25 #56-78, Bucaramanga',
      owner: 'Ana Rodríguez',
      active: true
    }
  ]

  const filteredWarehouses = warehouses.filter(warehouse =>
    warehouse.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    warehouse.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
    warehouse.owner.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle className="text-2xl font-bold">
                Gestión de Almacenes
              </CardTitle>
              <Button onClick={() => navigate('/warehouses/new')}>
                <Plus className="h-4 w-4 mr-2" />
                Nuevo Almacén
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-2">
              <Search className="h-4 w-4 text-gray-500" />
              <div className="flex-1">
                <Label htmlFor="search" className="sr-only">Buscar</Label>
                <Input
                  id="search"
                  placeholder="Buscar por nombre, dirección o propietario..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full"
                />
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
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredWarehouses.map((warehouse) => (
                    <TableRow key={warehouse.id}>
                      <TableCell className="font-medium">{warehouse.id}</TableCell>
                      <TableCell>{warehouse.name}</TableCell>
                      <TableCell>{warehouse.address}</TableCell>
                      <TableCell>{warehouse.owner}</TableCell>
                      <TableCell>
                        <Badge variant={warehouse.active ? 'default' : 'secondary'}>
                          {warehouse.active ? 'Activo' : 'Inactivo'}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {filteredWarehouses.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                No se encontraron almacenes que coincidan con la búsqueda.
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

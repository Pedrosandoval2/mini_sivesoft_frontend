import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Plus, Search } from 'lucide-react'

import { useUserStore } from '@/store/userStore'
import { dataInventorySheets } from '@/mockData/mock'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { FaEdit } from 'react-icons/fa'
import { formatDate } from '@/utils/formatDate'
import { formatNumberWithZero } from '@/utils/formatNumberWithZero'


export default function InventorySheetPage() {
    const role = useUserStore((state) => state.user.role)

    const [searchTerm, setSearchTerm] = useState('')
    const navigate = useNavigate()


    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-6xl mx-auto space-y-6">
                <Card>
                    <CardHeader>
                        <div className="flex justify-between items-center">
                            <CardTitle className="text-2xl font-bold">
                                Gestión de Hojas de Inventario
                            </CardTitle>
                            {role !== 'user' && <Button onClick={() => navigate('/inventory-sheets/new')}>
                                <Plus className="h-4 w-4 mr-2" />
                                Nueva Hoja de Inventario
                            </Button>}
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
                                        <TableHead>Almacén</TableHead>
                                        <TableHead>Fecha de Emisión</TableHead>
                                        <TableHead>Serie</TableHead>
                                        <TableHead>N°</TableHead>
                                        <TableHead>Razón Social</TableHead>
                                        <TableHead>Usuario</TableHead>
                                        <TableHead>Estado</TableHead>
                                        {role !== 'user' && <TableHead>Acciones</TableHead>}
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {dataInventorySheets.data.map((sheet) => (
                                        <TableRow key={sheet.id}>
                                            <TableCell className="font-medium">{sheet.id}</TableCell>
                                            <TableCell>{sheet.warehouse.name}</TableCell>
                                            <TableCell>{formatDate(sheet.emissionDate)}</TableCell>
                                            <TableCell>{formatNumberWithZero(sheet.warehouse.serieWarehouse)}</TableCell>
                                            <TableCell>{sheet.id}</TableCell>
                                            <TableCell>{sheet.user.entityRelation.name}</TableCell>
                                            <TableCell>{sheet.user.username}</TableCell>
                                            <TableCell>
                                                <Badge variant={sheet.isActive ? 'default' : 'secondary'}>
                                                    {sheet.isActive ? 'Activo' : 'Inactivo'}
                                                </Badge>
                                            </TableCell>
                                            {role !== 'user' && <TableCell>
                                                <Button
                                                    variant="link"
                                                    className="border-1 p-0"
                                                    onClick={() => navigate(`/inventory-sheets/new`, { state: { sheet } })}
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
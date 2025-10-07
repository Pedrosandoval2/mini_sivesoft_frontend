import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Plus, Search, ChevronLeft, ChevronRight, Pencil, Trash2 } from 'lucide-react'

import { useUserStore } from '@/store/userStore'
import { useGetInventorySheets } from '@/hooks/useGetInventorySheets'
import { useDebounce } from '@/hooks/useDebounce'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { formatDate } from '@/utils/formatDate'
import { formatNumberWithZero } from '@/utils/formatNumberWithZero'
import { useEffectOncePerDeps } from '@/hooks/useEffectOncePerDeps'
import { assignedColorWithState } from '@/utils/assignedColorWithState'
import { transformState } from '@/utils/transformState'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Label } from '@/components/ui/label'


export default function InventorySheetPage() {
    const role = useUserStore((state) => state.user.role)

    const [searchQuery, setSearchQuery] = useState('')
    const [filterState, setFilterState] = useState('')
    const [dateFrom, setDateFrom] = useState('')
    const [dateTo, setDateTo] = useState('')

    const debouncedSearch = useDebounce(searchQuery)
    const debouncedFiltered = useDebounce(filterState)
    const debouncedDateFrom = useDebounce(dateFrom)
    const debouncedDateTo = useDebounce(dateTo)
    const { data, fetchInventorySheets, isLoading, setPage, page, totalPages, limit } = useGetInventorySheets()
    const navigate = useNavigate()

    const handleChange = (e) => {
        e.preventDefault();
        setSearchQuery(e.target.value)
    }

    useEffectOncePerDeps(() => {
        fetchInventorySheets({ page, limit, query: debouncedSearch ?? '', state: debouncedFiltered, dateFrom: debouncedDateFrom, dateTo: debouncedDateTo })
    }, [debouncedSearch, page, debouncedFiltered, debouncedDateFrom, debouncedDateTo])

    return (
        <div className=" bg-gray-50 p-6">
            <div className="max-w-6xl mx-auto space-y-6">
                <Card>
                    <CardHeader>
                        <div className="md:flex md:justify-between md:items-center md:gap-0 gap-2.5">
                            <CardTitle className="text-2xl font-bold">
                                Hojas de Inventario
                            </CardTitle>
                            <div className="md:flex md:items-end md:gap-4 block  ">
                                <div className='flex gap-2 mt-2'>
                                    <div className="space-y-2 w-full md:w-auto">
                                        <Label htmlFor="dateFrom">Fecha:</Label>
                                        <Input
                                            id="dateFrom"
                                            type="date"
                                            value={dateFrom}
                                            onChange={(e) => setDateFrom(e.target.value)}
                                            placeholder="04/07/2025"
                                        />
                                    </div>

                                    <div className="space-y-2 w-full md:w-auto">
                                        <Label htmlFor="dateTo">Hasta:</Label>
                                        <Input
                                            id="dateTo"
                                            type="date"
                                            value={dateTo}
                                            onChange={(e) => setDateTo(e.target.value)}
                                            placeholder="10/07/2025"
                                        />
                                    </div>
                                </div>
                                <div className="flex flex-col w-full md:w-48 gap-y-0 md:gap-y-2">
                                    <Label htmlFor="dateTo" className="mt-2 md:mt-0">Estado:</Label>
                                    <Select onValueChange={(value) => {
                                        setFilterState(value)
                                    }}>
                                        <SelectTrigger className='w-full my-2 md:my-0'>
                                            <SelectValue placeholder="Seleccionar estado" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="pending">Pendiente</SelectItem>
                                            <SelectItem value="registered">Registrado</SelectItem>
                                            <SelectItem value="approved">Aprobado</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                {role !== 'user' && <Button onClick={() => navigate('/inventory-sheets/new')}>
                                    <Plus className="h-4 w-4 mr-2" />
                                    Nueva Hoja de Inventario
                                </Button>}
                            </div>

                        </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="relative mb-6">
                            <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                            <Input
                                type="text"
                                placeholder="Buscar por almacén, usuario o razón social..."
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
                                    {isLoading ? <TableRow><TableCell colSpan={8} className="text-center">Cargando...</TableCell></TableRow> : data?.map((sheet) => {
                                        return (<TableRow key={sheet.id}>
                                            <TableCell className="font-medium">{sheet.id}</TableCell>
                                            <TableCell>{sheet.warehouse.name}</TableCell>
                                            <TableCell>{formatDate(sheet.emissionDate)}</TableCell>
                                            <TableCell>{formatNumberWithZero(sheet.warehouse.serieWarehouse)}</TableCell>
                                            <TableCell>{sheet.id}</TableCell>
                                            <TableCell>{sheet?.user?.entityRelation?.name}</TableCell>
                                            <TableCell>{sheet.user.username}</TableCell>
                                            <TableCell>
                                                <Badge className={assignedColorWithState(sheet.state)}>
                                                    {transformState(sheet.state)}
                                                </Badge>
                                            </TableCell>
                                            {role !== 'user' &&
                                                <TableCell>
                                                    <Button variant="ghost" size="sm" className="text-gray-600 hover:bg-gray-100" onClick={() => navigate(`/inventory-sheets/new`, {
                                                        state: {
                                                            inventorySheet: {
                                                                ...sheet,
                                                                state: transformState(sheet.state)
                                                            }
                                                        }
                                                    })}>
                                                        <Pencil className="h-4 w-4" />
                                                    </Button>
                                                    <Button variant="ghost" size="sm" className="text-red-600 hover:bg-red-50">
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                </TableCell>}
                                        </TableRow>);
                                    })}
                                </TableBody>
                            </Table>
                        </div>

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
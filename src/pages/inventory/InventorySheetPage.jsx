import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
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
import { Plus, Search, ChevronLeft, ChevronRight, Pencil, Trash2, Download } from 'lucide-react'

import { useInventorySheets } from '@/hooks/queries/useInventorySheets'
import { useDeleteInventorySheet } from '@/hooks/mutations/useInventorySheetMutations'
import { useDebounce } from '@/hooks/useDebounce'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { formatDate } from '@/utils/formatDate'
import { formatNumberWithZero } from '@/utils/formatNumberWithZero'
import { assignedColorWithState } from '@/utils/assignedColorWithState'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import { toast } from 'react-toastify'
import * as XLSX from "xlsx"



export default function InventorySheetPage() {

    const [searchQuery, setSearchQuery] = useState('')
    const [filterState, setFilterState] = useState('')
    const [dateFrom, setDateFrom] = useState('')
    const [dateTo, setDateTo] = useState('')
    const [page, setPage] = useState(1)
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
    const [sheetToDelete, setSheetToDelete] = useState(null)
    const limit = 10

    const debouncedSearch = useDebounce(searchQuery, 500)
    const debouncedFiltered = useDebounce(filterState, 500)
    const debouncedDateFrom = useDebounce(dateFrom, 500)
    const debouncedDateTo = useDebounce(dateTo, 500)

    // React Query maneja automáticamente el estado y caché
    const { data, isLoading } = useInventorySheets({
        page,
        limit,
        search: debouncedSearch,
        state: debouncedFiltered,
        dateFrom: debouncedDateFrom,
        dateTo: debouncedDateTo,
    })

    // Mutation para eliminar hojas de inventario
    const deleteMutation = useDeleteInventorySheet()

    const totalPages = data?.totalPages || 1

    const navigate = useNavigate()

    const handleChange = (e) => {
        e.preventDefault()
        setSearchQuery(e.target.value)
        // Resetear a página 1 cuando se busca
        setPage(1)
    }

    const handleEdit = (inventorySheet) => {
        navigate('/inventory-sheets/new', { state: { inventorySheet } })
    }

    const handleDeleteClick = (sheet) => {
        setSheetToDelete(sheet)
        setDeleteDialogOpen(true)
    }

    const handleDeleteConfirm = async () => {
        if (sheetToDelete) {
            await deleteMutation.mutateAsync(sheetToDelete.id)
            setDeleteDialogOpen(false)
            setSheetToDelete(null)
        }
    }

    const handleExportToExcel = (details) => {
        const filledCodes = details?.map((detail) => detail?.productId).filter(code => code.trim() !== '')

        if (filledCodes.length === 0) {
            toast.error("No hay códigos para exportar")
            return
        }

        const data = filledCodes.map((code, index) => ({
            Número: index + 1,
            Código: code,
            Fecha: new Date().toLocaleDateString("es-ES"),
        }))

        const worksheet = XLSX.utils.json_to_sheet(data)
        const workbook = XLSX.utils.book_new()
        XLSX.utils.book_append_sheet(workbook, worksheet, "Códigos")

        worksheet["!cols"] = [{ wch: 10 }, { wch: 30 }, { wch: 15 }]

        const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" })
        const blob = new Blob([excelBuffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" })
        const url = URL.createObjectURL(blob)
        const link = document.createElement("a")
        link.href = url
        link.download = `Hoja de inventario - ${filledCodes.length} CODIGOS - ${new Date().toLocaleDateString("es-ES")}.xlsx`
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        URL.revokeObjectURL(url)
    }

    const stateApprovated = (state) => state === 'aprobado'

    return (
        <div className=" bg-gray-50 md:p-6">
            <div className="max-w-6xl mx-auto space-y-6">
                <Card>
                    <CardHeader>
                        <div className="md:flex md:justify-between md:items-center md:gap-0 gap-2.5 flex-wrap">
                            <CardTitle className="text-3xl font-bold mb-2">
                                Hojas de Inventario
                            </CardTitle>
                            <div className="md:flex md:items-end md:gap-4 block">
                                <div className='flex gap-2 mt-2 md:flex-row flex-col'>
                                    <div className="space-y-2 w-full md:w-auto">
                                        <Label htmlFor="dateFrom">Fecha:</Label>
                                        <Input
                                            id="dateFrom"
                                            type="date"
                                            value={dateFrom}
                                            className='flex justify-center md:flex-none'
                                            onChange={(e) => setDateFrom(e.target.value)}
                                            placeholder="04/07/2025"
                                        />
                                    </div>

                                    <div className="space-y-2 w-full md:w-auto">
                                        <Label htmlFor="dateTo">Hasta:</Label>
                                        <Input
                                            id="dateTo"
                                            type="date"
                                            className='flex justify-center md:flex-none'
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
                                            <SelectItem value="pendiente">Pendiente</SelectItem>
                                            <SelectItem value="registrado">Registrado</SelectItem>
                                            <SelectItem value="aprobado">Aprobado</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                {<Button onClick={() => navigate('/inventory-sheets/new')} className='md:w-auto w-full'>
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
                                        {<TableHead></TableHead>}
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {isLoading ? (
                                        <TableRow>
                                            <TableCell colSpan={8} className="text-center py-8">
                                                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
                                                <p className="mt-2 text-gray-600">Cargando hojas de inventario...</p>
                                            </TableCell>
                                        </TableRow>
                                    ) : data?.data?.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={8} className="text-center py-8 text-gray-500">
                                                No se encontraron hojas de inventario
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        data?.data?.map((sheet) => {
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
                                                        {sheet.state}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell>
                                                    <div className="flex gap-2 text-gray-400">
                                                        {stateApprovated(sheet.state) && (
                                                            <>
                                                                <Button
                                                                    variant="ghost"
                                                                    size="sm"
                                                                    className="text-gray-600 hover:bg-gray-100"
                                                                    onClick={() => handleEdit(sheet)}
                                                                >
                                                                    <Pencil className="h-4 w-4" />
                                                                </Button>
                                                                <Button
                                                                    variant="ghost"
                                                                    size="sm"
                                                                    className="text-red-600 hover:bg-red-50"
                                                                    onClick={() => handleDeleteClick(sheet)}
                                                                    disabled={deleteMutation.isPending}
                                                                >
                                                                    <Trash2 className="h-4 w-4" />
                                                                </Button>
                                                            </>
                                                        )}
                                                        <Button
                                                            onClick={() => handleExportToExcel(sheet.details)}
                                                            className="bg-green-600 hover:bg-green-700 text-white"
                                                        >
                                                            <Download className="w-4 h-4" />
                                                        </Button>
                                                    </div>
                                                </TableCell>
                                            </TableRow>);
                                        })
                                    )}
                                </TableBody>
                            </Table>
                        </div>

                        <div className="flex items-center gap-2 mt-4 md:justify-start justify-center">
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

            {/* Dialog de confirmación de eliminación */}
            <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>¿Estás seguro de eliminar esta hoja de inventario?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Esta acción no se puede deshacer. Se eliminará permanentemente la hoja de inventario{' '}
                            <span className="font-semibold">ID: {sheetToDelete?.id}</span> del almacén{' '}
                            <span className="font-semibold">{sheetToDelete?.warehouse?.name}</span>.
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
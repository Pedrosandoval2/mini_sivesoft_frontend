import React, { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Download, ChevronDown, ChevronUp, ChevronLeft, ChevronRight } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import * as XLSX from "xlsx"
import { useInventorySheets } from "@/hooks/queries/useInventorySheets"
import { useWarehouses } from "@/hooks/queries/useWarehouses"
import { useEntities } from "@/hooks/queries/useEntities"
import { formatNumberWithZero } from "@/utils/formatNumberWithZero"
import { assignedColorWithState } from "@/utils/assignedColorWithState"
import { toast } from "react-toastify"

export default function InventoryReportsPage() {
    const [warehouseId, setWarehouseId] = useState("")
    const [entity, setEntity] = useState("")
    const [dateFrom, setDateFrom] = useState("")
    const [dateTo, setDateTo] = useState("")
    const [showResults, setShowResults] = useState(false)
    const [expandedRows, setExpandedRows] = useState(new Set())
    const [page, setPage] = useState(1)
    const limit = 20

    const { data: inventorySheetsData, isLoading: loadingSheets } = useInventorySheets({
        page,
        limit,
        search: "",
        entity,
        warehouseId,
        dateFrom,
        dateTo
    }, {
        enabled: showResults // Solo ejecutar query cuando showResults sea true
    })

    const { data: warehousesData } = useWarehouses({ page: 1, limit: 100, search: "" })
    const { data: entitiesData } = useEntities({ page: 1, limit: 100, search: "" })

    const inventorySheets = inventorySheetsData?.data || []
    const totalPages = inventorySheetsData?.totalPages || 1
    const warehouses = warehousesData?.data || []
    const entities = entitiesData?.data || []

    const toggleRow = (id) => {
        const newExpandedRows = new Set(expandedRows)
        if (newExpandedRows.has(id)) {
            newExpandedRows.delete(id)
        } else {
            newExpandedRows.add(id)
        }
        setExpandedRows(newExpandedRows)
    }

    const handleShow = () => {
        setShowResults(true)
        setPage(1)
        // Here you would fetch data from API based on filters
    }

    const handleClearFilters = () => {
        setWarehouseId("")
        setEntity("")
        setDateFrom("")
        setDateTo("")
        setShowResults(false)
        setExpandedRows(new Set())
        setPage(1)
    }

    const handleExport = () => {
        if (inventorySheets.length === 0) {
            toast.info("No hay datos para exportar")
            return
        }
        const wb = XLSX.utils.book_new()

        const summaryData = inventorySheets.map((sheet) => ({
            ID: sheet.id,
            "F. Emisión": new Date(sheet.emissionDate).toLocaleDateString("es-PE"),
            Serie: sheet.serie,
            "N° Serie Almacén": sheet.warehouse.serieWarehouse,
            Almacén: sheet.warehouse.name,
            "Dirección Almacén": sheet.warehouse.address,
            Responsable: sheet.user?.entityRelation?.name,
            "Tipo Doc": sheet.user?.entityRelation?.docType,
            "N° Documento": sheet.user?.entityRelation?.docNumber,
            Teléfono: sheet.user?.entityRelation?.phone,
            Usuario: sheet.user?.username,
            Rol: sheet.user?.role,
            Estado: sheet.state,
            "Fecha Creación": new Date(sheet.createdAt).toLocaleString("es-PE"),
            "Última Actualización": new Date(sheet.updatedAt).toLocaleString("es-PE"),
        }))

        const wsSummary = XLSX.utils.json_to_sheet(summaryData)
        wsSummary["!cols"] = [
            { wch: 6 }, // ID
            { wch: 12 }, // F. Emisión
            { wch: 8 }, // Serie
            { wch: 15 }, // N° Serie Almacén
            { wch: 20 }, // Almacén
            { wch: 25 }, // Dirección Almacén
            { wch: 30 }, // Responsable
            { wch: 10 }, // Tipo Doc
            { wch: 12 }, // N° Documento
            { wch: 12 }, // Teléfono
            { wch: 15 }, // Usuario
            { wch: 10 }, // Rol
            { wch: 12 }, // Estado
            { wch: 20 }, // Fecha Creación
            { wch: 20 }, // Última Actualización
        ]
        XLSX.utils.book_append_sheet(wb, wsSummary, "Resumen")

        const detailsData = []
        inventorySheets?.forEach((sheet) => {
            sheet?.details?.forEach((detail) => {
                detailsData?.push({
                    "ID Hoja": sheet.id,
                    "F. Emisión": new Date(sheet.emissionDate).toLocaleDateString("es-PE"),
                    Serie: sheet.serie,
                    Almacén: sheet.warehouse.name,
                    Responsable: sheet?.user?.entityRelation?.name,
                    "ID Detalle": detail.id,
                    "Código Producto": detail.productId,
                    Cantidad: detail.quantity,
                    Unidad: detail.unit,
                    "Precio Unitario": detail.price,
                    "Valor Total": (Number.parseFloat(detail.quantity) * Number.parseFloat(detail.price)).toFixed(2),
                })
            })
        })

        const wsDetails = XLSX.utils.json_to_sheet(detailsData)
        wsDetails["!cols"] = [
            { wch: 10 }, // ID Hoja
            { wch: 12 }, // F. Emisión
            { wch: 8 }, // Serie
            { wch: 20 }, // Almacén
            { wch: 30 }, // Responsable
            { wch: 10 }, // ID Detalle
            { wch: 20 }, // Código Producto
            { wch: 10 }, // Cantidad
            { wch: 12 }, // Unidad
            { wch: 15 }, // Precio Unitario
            { wch: 15 }, // Valor Total
        ]
        XLSX.utils.book_append_sheet(wb, wsDetails, "Detalle Productos")

        const completeData = inventorySheets?.map((sheet) => {
            const totalQuantity = sheet.details.reduce((sum, detail) => sum + Number.parseFloat(detail.quantity), 0)
            const totalValue = sheet.details.reduce(
                (sum, detail) => sum + Number.parseFloat(detail.quantity) * Number.parseFloat(detail.price),
                0,
            )

            return {
                "ID Hoja": sheet.id,
                "Fecha Emisión": new Date(sheet.emissionDate).toLocaleDateString("es-PE"),
                Serie: sheet.serie,
                "ID Almacén": sheet.warehouse.id,
                "Nombre Almacén": sheet.warehouse.name,
                "Dirección Almacén": sheet.warehouse.address,
                "Serie Almacén": formatNumberWithZero(sheet.warehouse.serieWarehouse),
                "Almacén Activo": sheet.warehouse.isActive ? "Sí" : "No",
                "ID Usuario": sheet.user.id,
                Usuario: sheet.user.username,
                "Rol Usuario": sheet?.user?.role,
                "ID Entidad": sheet?.user?.entityRelation?.id,
                "Nombre Responsable": sheet?.user?.entityRelation?.name,
                "Tipo Documento": sheet?.user?.entityRelation?.docType,
                "N° Documento": sheet?.user?.entityRelation?.docNumber,
                "Dirección Responsable": sheet?.user?.entityRelation?.address,
                "Teléfono Responsable": sheet?.user?.entityRelation?.phone,
                Estado: sheet.state,
                "Total Items": sheet.details.length,
                "Cantidad Total": totalQuantity.toFixed(2),
                "Valor Total": totalValue.toFixed(2),
                "Fecha Creación": new Date(sheet.createdAt).toLocaleString("es-PE"),
                "Última Actualización": new Date(sheet.updatedAt).toLocaleString("es-PE"),
            }
        })

        const wsComplete = XLSX.utils.json_to_sheet(completeData)
        wsComplete["!cols"] = Array(23).fill({ wch: 20 })
        XLSX.utils.book_append_sheet(wb, wsComplete, "Información Completa")

        const date = new Date().toISOString().split("T")[0]
        const filename = `Hoja_Inventario_Completo_${date}.xlsx`

        const wbout = XLSX.write(wb, { bookType: "xlsx", type: "array" })

        const blob = new Blob([wbout], { type: "application/octet-stream" })
        const url = URL.createObjectURL(blob)
        const link = document.createElement("a")
        link.href = url
        link.download = filename
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        URL.revokeObjectURL(url)
    }

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString("es-PE")
    }

    const calculateDetailTotal = (quantity, price) => {
        return (Number.parseFloat(quantity) * Number.parseFloat(price)).toFixed(2)
    }

    return (
        <div className=" bg-gray-50 md:p-6">
            <div className="mx-auto max-w-7xl">
                <div className="rounded-lg bg-white p-6 shadow-sm">
                    <h1 className="mb-3 text-3xl font-bold text-foreground">Reporte Hoja de inventario</h1>
                    <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">

                        <div className="space-y-2">
                            <Label htmlFor="warehouse">Almacén:</Label>
                            <Select value={warehouseId} onValueChange={setWarehouseId}>
                                <SelectTrigger id="warehouse" className="w-full">
                                    <SelectValue placeholder="Seleccionar..." />
                                </SelectTrigger>
                                <SelectContent>
                                    {warehouses.map((wh) => (
                                        <SelectItem key={wh.id} value={String(wh.id)}>
                                            {wh.name}
                                        </SelectItem>
                                    ))

                                    }
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="entity">Entidad:</Label>
                            <div className="relative">
                                <Select value={entity} onValueChange={setEntity}>
                                    <SelectTrigger id="entity" className="w-full">
                                        <SelectValue placeholder="Seleccionar..." />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {entities.map((entity) => (
                                            <SelectItem key={entity.id} value={String(entity.id)}>
                                                {entity.name}
                                            </SelectItem>
                                        ))

                                        }
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="dateFrom">Fecha:</Label>
                            <Input
                                id="dateFrom"
                                type="date"
                                value={dateFrom}
                                onChange={(e) => setDateFrom(e.target.value)}
                                placeholder="04/07/2025"
                            />
                        </div>

                        <div className="space-y-2">
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

                    <div className="mb-6 flex gap-3 justify-between md:flex-row flex-col">
                        <div className="flex gap-3 flex-col md:flex-row">
                            <Button onClick={handleShow} className="bg-blue-600 text-white hover:bg-blue-700">
                                <Search className="mr-2 h-4 w-4" />
                                Mostrar
                            </Button>
                            <Button onClick={handleClearFilters} className="bg-gray-200 text-gray-800 hover:bg-gray-300">
                                <Search className="mr-2 h-4 w-4" />
                                Limpiar filtros
                            </Button>
                        </div>
                        <Button
                            onClick={handleExport}
                            variant="outline"
                            className="border-green-600 text-green-600 hover:bg-green-50 bg-transparent"
                        >
                            <Download className="mr-2 h-4 w-4" />
                            Reporte
                        </Button>
                    </div>

                    {showResults && (
                        <div className="overflow-x-auto">
                            <Table>
                                <TableHeader>
                                    <TableRow className="bg-gray-100">
                                        <TableHead className="w-12"></TableHead>
                                        <TableHead className="font-semibold text-foreground">F. Emisión</TableHead>
                                        <TableHead className="font-semibold text-foreground">Almacén</TableHead>
                                        <TableHead className="font-semibold text-foreground">Serie</TableHead>
                                        <TableHead className="font-semibold text-foreground">N°</TableHead>
                                        <TableHead className="font-semibold text-foreground">Responsable</TableHead>
                                        <TableHead className="font-semibold text-foreground">Estado</TableHead>
                                        <TableHead className="font-semibold text-foreground">Usuario</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {inventorySheets.map((sheet) => (
                                        <>
                                            <TableRow key={sheet.id} className="hover:bg-gray-50">
                                                <TableCell>
                                                    <Button variant="ghost" size="sm" onClick={() => toggleRow(sheet.id)} className="h-8 w-8 p-0">
                                                        {expandedRows.has(sheet.id) ? (
                                                            <ChevronUp className="h-4 w-4" />
                                                        ) : (
                                                            <ChevronDown className="h-4 w-4" />
                                                        )}
                                                    </Button>
                                                </TableCell>
                                                <TableCell>{formatDate(sheet.emissionDate)}</TableCell>
                                                <TableCell>{sheet.warehouse.name}</TableCell>
                                                <TableCell>{sheet.serie}</TableCell>
                                                <TableCell>{sheet.warehouse.serieWarehouse}</TableCell>
                                                <TableCell>{sheet.user?.entityRelation?.name}</TableCell>
                                                <TableCell>
                                                    <Badge className={assignedColorWithState(sheet.state)}>{sheet.state}</Badge>
                                                </TableCell>
                                                <TableCell>{sheet.user.username}</TableCell>
                                            </TableRow>

                                            {expandedRows.has(sheet.id) && (
                                                <TableRow key={`${sheet.id}-details`}>
                                                    <TableCell colSpan={8} className="bg-gray-50 p-0">
                                                        <div className="p-4">
                                                            <h3 className="mb-3 font-semibold text-foreground">Detalle de Productos</h3>
                                                            <div className="overflow-x-auto rounded-md border">
                                                                <Table>
                                                                    <TableHeader>
                                                                        <TableRow className="bg-gray-100">
                                                                            <TableHead className="font-semibold">ID</TableHead>
                                                                            <TableHead className="font-semibold">Código Producto</TableHead>
                                                                            <TableHead className="font-semibold">Cantidad</TableHead>
                                                                            <TableHead className="font-semibold">Unidad</TableHead>
                                                                            <TableHead className="font-semibold">Precio Unit.</TableHead>
                                                                            <TableHead className="font-semibold">Total</TableHead>
                                                                        </TableRow>
                                                                    </TableHeader>
                                                                    <TableBody>
                                                                        {sheet.details.map((detail) => (
                                                                            <TableRow key={detail.id}>
                                                                                <TableCell>{detail.id}</TableCell>
                                                                                <TableCell className="font-medium">{detail.productId}</TableCell>
                                                                                <TableCell>{detail.quantity}</TableCell>
                                                                                <TableCell>{detail.unit}</TableCell>
                                                                                <TableCell>S/ {detail.price}</TableCell>
                                                                                <TableCell className="font-semibold">
                                                                                    S/ {calculateDetailTotal(detail.quantity, detail.price)}
                                                                                </TableCell>
                                                                            </TableRow>
                                                                        ))}
                                                                        <TableRow className="bg-gray-50 font-semibold">
                                                                            <TableCell colSpan={5} className="text-right">
                                                                                Total General:
                                                                            </TableCell>
                                                                            <TableCell>
                                                                                S/{" "}
                                                                                {sheet.details
                                                                                    .reduce(
                                                                                        (sum, detail) =>
                                                                                            sum +
                                                                                            Number.parseFloat(detail.quantity) * Number.parseFloat(detail.price),
                                                                                        0,
                                                                                    )
                                                                                    .toFixed(2)}
                                                                            </TableCell>
                                                                        </TableRow>
                                                                    </TableBody>
                                                                </Table>
                                                            </div>
                                                        </div>
                                                    </TableCell>
                                                </TableRow>
                                            )}
                                        </>
                                    ))}
                                </TableBody>
                            </Table>
                            <div className="flex items-center gap-2 mt-4">
                                <div className="flex items-center gap-1">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => setPage(Math.max(1, page - 1))}
                                        disabled={loadingSheets || page === 1}
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
                                        disabled={loadingSheets || page === totalPages}
                                    >
                                        <ChevronRight className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
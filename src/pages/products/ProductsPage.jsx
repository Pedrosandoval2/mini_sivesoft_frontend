import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Plus, Pencil, Trash2, Search, Scan, ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { useProducts } from '@/hooks/queries/useProducts'
import { useDeleteProduct } from '@/hooks/mutations/useProductMutations'
import { useDebounce } from '@/hooks/useDebounce'
import { QrScannerModal } from '@/components/scannerBarCode/QrScannerModal'
import { toast } from 'react-toastify'

export default function ProductsPage() {
    const navigate = useNavigate()
    const [page, setPage] = useState(1)
    const [searchTerm, setSearchTerm] = useState('')
    const debouncedSearch = useDebounce(searchTerm, 500)
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
    const [productToDelete, setProductToDelete] = useState(null)
    const [scannerOpen, setScannerOpen] = useState(false)
    const limit = 10

    const { data, isLoading, isError } = useProducts({
        page,
        limit,
        search: debouncedSearch
    })

    const deleteProductMutation = useDeleteProduct()

    const handleEdit = (product) => {
        navigate('/products/new', { state: { product } })
    }

    const handleDeleteClick = (product) => {
        setProductToDelete(product)
        setDeleteDialogOpen(true)
    }

    const handleDeleteConfirm = async () => {
        if (productToDelete) {
            await deleteProductMutation.mutateAsync(productToDelete.id)
            setDeleteDialogOpen(false)
            setProductToDelete(null)
        }
    }

    const handleSearch = (e) => {
        setSearchTerm(e.target.value)
        setPage(1)
    }

    const handleScanSuccess = (decodedText) => {
        setSearchTerm(decodedText)
        setPage(1)
        toast.success(`Código escaneado: ${decodedText}`)
    }

    const handleScanError = (error) => {
        // Solo loguear errores reales, no los de "no se encontró código"
        if (error && !error.includes('NotFoundException')) {
            console.error('Error escaneando:', error)
        }
    }

    if (isError) {
        return (
            <div className="p-6">
                <Card>
                    <CardContent className="pt-6">
                        <p className="text-red-500">Error al cargar los productos</p>
                    </CardContent>
                </Card>
            </div>
        )
    }

    return (
        <>
            <div className="p-6 space-y-6">
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-bold">Productos</h1>
                        <p className="text-gray-500 mt-1">Gestiona los productos del sistema</p>
                    </div>
                    <Button onClick={() => navigate('/products/new')}>
                        <Plus className="h-4 w-4 mr-2" />
                        Nuevo Producto
                    </Button>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Lista de Productos</CardTitle>
                        <CardDescription>
                            {data?.data?.total || 0} productos registrados
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="mb-4 flex gap-2">
                            <div className="relative flex-1">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                                <Input
                                    placeholder="Buscar por nombre, código de barras..."
                                    value={searchTerm}
                                    onChange={handleSearch}
                                    className="pl-10"
                                />
                            </div>
                            <Button
                                variant="outline"
                                onClick={() => setScannerOpen(true)}
                                className="shrink-0"
                            >
                                <Scan className="h-4 w-4 mr-2" />
                                Escanear
                            </Button>
                        </div>

                        {isLoading ? (
                            <div className="text-center py-8">
                                <p className="text-gray-500">Cargando productos...</p>
                            </div>
                        ) : (
                            <>
                                <div className="rounded-md border">
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead>ID</TableHead>
                                                <TableHead>Nombre</TableHead>
                                                <TableHead>Unidad</TableHead>
                                                <TableHead>Código de Barras</TableHead>
                                                <TableHead>Precio</TableHead>
                                                <TableHead className="text-right">Acciones</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {data?.data?.data?.length > 0 ? (
                                                data.data.data.map((product) => (
                                                    <TableRow key={product.id}>
                                                        <TableCell className="font-medium">#{product.id}</TableCell>
                                                        <TableCell>{product.name}</TableCell>
                                                        <TableCell>
                                                            <Badge variant="outline">{product.unit}</Badge>
                                                        </TableCell>
                                                        <TableCell>{product.barcode}</TableCell>
                                                        <TableCell>${product?.price}</TableCell>
                                                        <TableCell className="text-right">
                                                            <div className="flex justify-end gap-2">
                                                                <Button
                                                                    variant="outline"
                                                                    size="sm"
                                                                    onClick={() => handleEdit(product)}
                                                                >
                                                                    <Pencil className="h-4 w-4" />
                                                                </Button>
                                                                <Button
                                                                    variant="destructive"
                                                                    size="sm"
                                                                    onClick={() => handleDeleteClick(product)}
                                                                >
                                                                    <Trash2 className="h-4 w-4" />
                                                                </Button>
                                                            </div>
                                                        </TableCell>
                                                    </TableRow>
                                                ))
                                            ) : (
                                                <TableRow>
                                                    <TableCell colSpan={6} className="text-center py-8">
                                                        <p className="text-gray-500">No se encontraron productos</p>
                                                    </TableCell>
                                                </TableRow>
                                            )}
                                        </TableBody>
                                    </Table>
                                </div>

                                <div className="flex items-center justify-between">
                                    <p className="text-sm text-gray-600">
                                        Mostrando {data?.data?.length || 0} de {data?.total || 0} almacenes
                                    </p>
                                    <div className="flex gap-2">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => setPage((p) => Math.max(1, p - 1))}
                                            disabled={page === 1 || isLoading}
                                        >
                                            <ChevronLeft className="h-4 w-4" />
                                            Anterior
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
                                            Siguiente
                                            <ChevronRight className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </div>
                            </>
                        )}
                    </CardContent>
                </Card>

                <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
                            <AlertDialogDescription>
                                Esta acción no se puede deshacer. Se eliminará permanentemente el producto{' '}
                                <span className="font-semibold">{productToDelete?.name}</span>.
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel onClick={() => setProductToDelete(null)}>
                                Cancelar
                            </AlertDialogCancel>
                            <AlertDialogAction
                                onClick={handleDeleteConfirm}
                                className="bg-red-600 hover:bg-red-700"
                            >
                                Eliminar
                            </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            </div>
            <QrScannerModal
                isOpen={scannerOpen}
                onClose={() => setScannerOpen(false)}
                onScanSuccess={handleScanSuccess}
                onScanError={handleScanError}
                title="Escanear Código de Barras"
                description="Apunta la cámara hacia el código de barras del producto para buscarlo"
            />
        </>
    )
}

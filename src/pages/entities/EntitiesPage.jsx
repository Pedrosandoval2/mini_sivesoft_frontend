import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useNavigate } from 'react-router-dom'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
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
import { useEntities } from '@/hooks/queries/useEntities'
import { useDeleteEntity } from '@/hooks/mutations/useEntityMutations'
import { useDebounce } from '@/hooks/useDebounce'
import {
    Trash2,
    Pencil,
    Search,
    Plus,
    ChevronRight,
    ChevronLeft
} from 'lucide-react'

import { useState } from 'react'

export default function EntitiesPage() {
    const [searchQuery, setSearchQuery] = useState("")
    const [page, setPage] = useState(1)
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
    const [entityToDelete, setEntityToDelete] = useState(null)
    const limit = 5
    const debouncedSearch = useDebounce(searchQuery, 500)
    const navigation = useNavigate()

    // React Query maneja automáticamente el estado y caché
    const { data, isLoading } = useEntities({
        page,
        limit,
        search: debouncedSearch
    })

    // Mutation para eliminar entidades
    const deleteMutation = useDeleteEntity()

    const totalPages = data?.totalPages || 1

    const handleChange = (e) => {
        e.preventDefault()
        setSearchQuery(e.target.value)
        // Resetear a página 1 cuando se busca
        setPage(1)
    }

    const handleEdit = (entity) => {
        navigation('/entidades/new', { state: { entity } })
    }

    const handleDeleteClick = (entity) => {
        setEntityToDelete(entity)
        setDeleteDialogOpen(true)
    }

    const handleDeleteConfirm = async () => {
        if (entityToDelete) {
            await deleteMutation.mutateAsync(entityToDelete.id)
            setDeleteDialogOpen(false)
            setEntityToDelete(null)
        }
    }

    return (
        <div className=" bg-gray-50 md:p-6">
            <div className="mx-auto max-w-7xl">
                <div className="rounded-2xl bg-white md:p-8 shadow-sm p-5">
                    <div className="mb-6 flex items-center justify-between md:flex-row flex-col">
                        <h1 className="md:text-3xl font-bold text-foreground text-2xl md:mb-0 mb-2.5">Gestión de Entidades</h1>
                        <Button className="bg-black text-white hover:bg-gray-800" onClick={() => { navigation('/entidades/new') }}>
                            <Plus className="mr-2 h-4 w-4" />
                            Nueva Entidad
                        </Button>
                    </div>

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

                    <div className="overflow-hidden rounded-lg border">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>ID</TableHead>
                                    <TableHead>Nombre</TableHead>
                                    <TableHead>Tipo Doc.</TableHead>
                                    <TableHead>Número Doc.</TableHead>
                                    <TableHead>Dirección</TableHead>
                                    <TableHead>Teléfono</TableHead>
                                    <TableHead>Acciones</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody className="divide-y divide-gray-200 bg-white">
                                {isLoading ? (
                                    <TableRow>
                                        <TableCell colSpan={7} className="text-center py-8">
                                            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
                                            <p className="mt-2 text-gray-600">Cargando entidades...</p>
                                        </TableCell>
                                    </TableRow>
                                ) : data?.data?.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                                            No se encontraron entidades
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    data?.data?.map((entity) => (
                                        <TableRow key={entity.id}>
                                            <TableCell>{entity.id}</TableCell>
                                            <TableCell>{entity.name}</TableCell>
                                            <TableCell>{entity.docType}</TableCell>
                                            <TableCell>{entity.docNumber}</TableCell>
                                            <TableCell>{entity.address}</TableCell>
                                            <TableCell>{entity.phone}</TableCell>
                                            <TableCell>
                                                <div className="flex gap-2">
                                                    <Button 
                                                        variant="ghost" 
                                                        size="sm" 
                                                        className="text-gray-600 hover:bg-gray-100" 
                                                        onClick={() => handleEdit(entity)}
                                                    >
                                                        <Pencil className="h-4 w-4" />
                                                    </Button>
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        className="text-red-600 hover:bg-red-50"
                                                        onClick={() => handleDeleteClick(entity)}
                                                        disabled={deleteMutation.isPending}
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
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
                </div>
            </div>

            {/* Dialog de confirmación de eliminación */}
            <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>¿Estás seguro de eliminar esta entidad?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Esta acción no se puede deshacer. Se eliminará permanentemente la entidad{' '}
                            <span className="font-semibold">{entityToDelete?.name}</span> con documento{' '}
                            <span className="font-semibold">{entityToDelete?.docNumber}</span>.
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


import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useNavigate } from 'react-router-dom'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { useGetEntities } from '@/hooks/useGetEntities'
import { useDebounce } from '@/hooks/useDebounce'
import {
    Trash2,
    Pencil,
    Search,
    Plus,
    ChevronRight,
    ChevronLeft
} from 'lucide-react'

import React, { useState } from 'react'
import { useEffectOncePerDeps } from '@/hooks/useEffectOncePerDeps'

export default function EntitiesPage() {

    const [searchQuery, setSearchQuery] = useState("")
    const debouncedSearch = useDebounce(searchQuery)
    const navigation = useNavigate()
    const { data, fetchEntities, isLoading, setPage, page, totalPages, limit } = useGetEntities()

    const handleChange = (e) => {
        e.preventDefault();
        setSearchQuery(e.target.value)
    }

    useEffectOncePerDeps(() => {
        fetchEntities({ page, limit, query: debouncedSearch ?? '' });
    }, [debouncedSearch, page]);

    return (
        <div className=" bg-gray-50 p-6">
            <div className="mx-auto max-w-7xl">
                <div className="rounded-2xl bg-white p-8 shadow-sm">
                    <div className="mb-6 flex items-center justify-between">
                        <h1 className="text-3xl font-bold text-foreground">Gestión de Entidades</h1>
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
                                {data?.map((entity) => (
                                    <TableRow key={entity.id}>
                                        <TableCell>{entity.id}</TableCell>
                                        <TableCell>{entity.name}</TableCell>
                                        <TableCell>{entity.docType}</TableCell>
                                        <TableCell>{entity.docNumber}</TableCell>
                                        <TableCell>{entity.address}</TableCell>
                                        <TableCell>{entity.phone}</TableCell>
                                        <TableCell>
                                            <div >
                                                <Button variant="ghost" size="sm" className="text-gray-600 hover:bg-gray-100" onClick={() => navigation(`/entidades/new`, { state: { entity } })}>
                                                    <Pencil className="h-4 w-4" />
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    className="text-red-600 hover:bg-red-50"
                                                // onClick={() => deleteEntity(entity.id)}
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}
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
        </div>
    )
}


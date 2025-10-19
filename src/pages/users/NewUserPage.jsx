import { useEffect, useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { Controller, useForm } from 'react-hook-form'
import { ArrowLeft, Eye, EyeOff } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { useCreateUser, useUpdateUser } from '@/hooks/mutations/useUserMutations'
import { useEntities } from '@/hooks/queries/useEntities'
import { useWarehouses } from '@/hooks/queries/useWarehouses'

/**
 * Página para crear o editar usuarios
 * 
 * Funcionalidades:
 * - Crear nuevo usuario con username, password, rol
 * - Asignar múltiples empresas (tenantIds) al usuario
 * - Asignar relación con entidad (entityRelationId - opcional)
 * - Asignar almacenes (warehouseIds)
 * - Editar usuario existente
 * - Validación de formularios con React Hook Form
 * - Mostrar/ocultar contraseña
 */
export default function NewUserPage() {
    const navigate = useNavigate()
    const location = useLocation()
    const user = location.state?.user
    const isEditing = !!user

    const [showPassword, setShowPassword] = useState(false)
    const [selectedTenants, setSelectedTenants] = useState([])
    const [selectedWarehouses, setSelectedWarehouses] = useState([])

    // ✨ React Query: Obtener entidades para el selector de empresas
    const { data: entitiesData, isLoading: entitiesLoading } = useEntities({
        page: 1,
        limit: 100,
        search: ''
    })

    // ✨ React Query: Obtener almacenes para el selector
    const { data: warehousesData, isLoading: warehousesLoading } = useWarehouses({
        page: 1,
        limit: 100,
        search: ''
    })

    const { register, handleSubmit, formState: { errors }, reset, control } = useForm({
        defaultValues: {
            username: '',
            password: '',
            role: 'user',
            entityRelationId: '',
        }
    })

    const createUserMutation = useCreateUser()
    const updateUserMutation = useUpdateUser()

    // Cargar datos del usuario si está en modo edición
    useEffect(() => {
        if (user) {
            reset({
                username: user.username || '',
                role: user.role || 'user',
                password: '', // No mostrar password en edición
                entityRelationId: user.entityRelationId || ''
            })
            setSelectedTenants(user.tenantIds || [])
            setSelectedWarehouses(user.warehouseIds || [])
        }
    }, [user, reset])

    /**
     * Toggle selección de empresa (tenant)
     */
    const toggleTenant = (tenantId) => {
        setSelectedTenants(prev => {
            if (prev.includes(tenantId)) {
                return prev.filter(id => id !== tenantId)
            } else {
                return [...prev, tenantId]
            }
        })
    }

    /**
     * Toggle selección de almacén
     */
    const toggleWarehouse = (warehouseId) => {
        setSelectedWarehouses(prev => {
            if (prev.includes(warehouseId)) {
                return prev.filter(id => id !== warehouseId)
            } else {
                return [...prev, warehouseId]
            }
        })
    }

    /**
     * Enviar formulario
     */
    const onSubmit = async (data) => {
        try {
            const userData = {
                username: data.username,
                role: data.role,
                tenantIds: selectedTenants,
                warehouseIds: selectedWarehouses,
                entityRelationId: data.entityRelationId || null
            }

            // Solo incluir password si no está vacío (importante en edición)
            if (data.password && data.password.trim() !== '') {
                userData.password = data.password
            }

            if (isEditing) {
                await updateUserMutation.mutateAsync({
                    id: user.id,
                    data: userData
                })
            } else {
                // En creación, password es obligatorio
                if (!data.password || data.password.trim() === '') {
                    throw new Error('La contraseña es requerida para crear un usuario')
                }
                await createUserMutation.mutateAsync(userData)
            }

            navigate('/users')
        } catch (error) {
            console.error('Error submitting user:', error)
        }
    }

    const isLoading = createUserMutation.isPending || updateUserMutation.isPending

    const getButtonText = () => {
        if (isLoading) return 'Guardando...'
        if (isEditing) return 'Actualizar Usuario'
        return 'Crear Usuario'
    }

    return (
        <div className="p-6 space-y-6">
            {/* 🔙 Header */}
            <div className="flex items-center gap-4">
                <Button variant="outline" size="icon" onClick={() => navigate('/users')}>
                    <ArrowLeft className="h-4 w-4" />
                </Button>
                <div>
                    <h1 className="text-3xl font-bold">
                        {isEditing ? 'Editar Usuario' : 'Nuevo Usuario'}
                    </h1>
                    <p className="text-gray-500 mt-1">
                        {isEditing ? 'Actualiza la información del usuario' : 'Completa el formulario para crear un nuevo usuario'}
                    </p>
                </div>
            </div>

            {/* 📋 Formulario */}
            <Card>
                <CardHeader>
                    <CardTitle>Información del Usuario</CardTitle>
                    <CardDescription>
                        {isEditing ? 'Modifica los campos necesarios' : 'Ingresa los datos del usuario y asigna las empresas correspondientes'}
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* 👤 Username */}
                            <div className="space-y-2">
                                <Label htmlFor="username">
                                    Nombre de Usuario <span className="text-red-500">*</span>
                                </Label>
                                <Input
                                    id="username"
                                    placeholder="Ej: juan_perez"
                                    {...register('username', {
                                        required: 'El nombre de usuario es requerido',
                                        minLength: {
                                            value: 3,
                                            message: 'Mínimo 3 caracteres'
                                        }
                                    })}
                                    className={errors.username ? 'border-red-500' : ''}
                                />
                                {errors.username && (
                                    <p className="text-sm text-red-500">{errors.username.message}</p>
                                )}
                            </div>

                            {/* 🔑 Password */}
                            <div className="space-y-2">
                                <Label htmlFor="password">
                                    Contraseña {!isEditing && <span className="text-red-500">*</span>}
                                    {isEditing && <span className="text-gray-500 text-xs ml-2">(Dejar vacío para no cambiar)</span>}
                                </Label>
                                <div className="relative">
                                    <Input
                                        id="password"
                                        type={showPassword ? 'text' : 'password'}
                                        placeholder={isEditing ? '••••••••' : 'Ingresa una contraseña'}
                                        {...register('password', {
                                            required: isEditing ? false : 'La contraseña es requerida',
                                            minLength: {
                                                value: 6,
                                                message: 'Mínimo 6 caracteres'
                                            }
                                        })}
                                        className={errors.password ? 'border-red-500 pr-10' : 'pr-10'}
                                    />
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="sm"
                                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                                        onClick={() => setShowPassword(!showPassword)}
                                    >
                                        {showPassword ? (
                                            <EyeOff className="h-4 w-4 text-gray-500" />
                                        ) : (
                                            <Eye className="h-4 w-4 text-gray-500" />
                                        )}
                                    </Button>
                                </div>
                                {errors.password && (
                                    <p className="text-sm text-red-500">{errors.password.message}</p>
                                )}
                            </div>

                            {/* 🎭 Rol */}
                            <div className="space-y-2">
                                <Controller
                                    name="role"
                                    control={control}
                                    rules={{ required: 'El rol es requerido' }}
                                    render={({ field }) => (
                                        <div className="space-y-2">
                                            <Label htmlFor="role">
                                                Rol <span className="text-red-500">*</span>
                                            </Label>
                                            <Select
                                                value={field.value}
                                                onValueChange={field.onChange}
                                            >
                                                <SelectTrigger className={errors.role ? 'border-red-500' : ''}>
                                                    <SelectValue placeholder="Selecciona un rol" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="super_admin">Super Admin</SelectItem>
                                                    <SelectItem value="manager">Manager</SelectItem>
                                                    <SelectItem value="user">Usuario</SelectItem>
                                                </SelectContent>
                                            </Select>
                                            {errors.role && (
                                                <p className="text-sm text-red-500">{errors.role.message}</p>
                                            )}
                                        </div>
                                    )}
                                />
                            </div>

                            {/* 🏢 Entity Relation ID (Opcional) */}
                            <div className="space-y-2">
                                <Controller
                                    name="entityRelationId"
                                    control={control}
                                    render={({ field }) => (
                                        <div className="space-y-2">
                                            <Label htmlFor="entityRelationId">
                                                Entidad Relacionada <span className="text-gray-500 text-xs">(Opcional)</span>
                                            </Label>
                                            <Select
                                                value={field.value}
                                                onValueChange={field.onChange}
                                            >
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Selecciona una entidad" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="">Ninguna</SelectItem>
                                                    {entitiesData?.data?.map((entity) => (
                                                        <SelectItem key={entity.id} value={entity.id}>
                                                            {entity.name}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    )}
                                />
                            </div>
                        </div>

                        {/* 🏢 Empresas Asignadas */}
                        <div className="space-y-3">
                            <Label>
                                Empresas Asignadas <span className="text-gray-500 text-xs">(Selecciona al menos una)</span>
                            </Label>
                            <Card className="p-4">
                                {entitiesLoading ? (
                                    <p className="text-gray-500">Cargando empresas...</p>
                                ) : entitiesData?.data?.length > 0 ? (
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                                        {entitiesData.data.map((entity) => (
                                            <div key={entity.id} className="flex items-center space-x-2">
                                                <Checkbox
                                                    id={`tenant-${entity.id}`}
                                                    checked={selectedTenants.includes(entity.id)}
                                                    onCheckedChange={() => toggleTenant(entity.id)}
                                                />
                                                <label
                                                    htmlFor={`tenant-${entity.id}`}
                                                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                                                >
                                                    {entity.name}
                                                </label>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-gray-500">No hay empresas disponibles</p>
                                )}
                            </Card>
                            {selectedTenants.length === 0 && (
                                <p className="text-sm text-amber-600">⚠️ Debes seleccionar al menos una empresa</p>
                            )}
                        </div>

                        {/* 🏭 Almacenes Asignados */}
                        <div className="space-y-3">
                            <Label>
                                Almacenes Asignados <span className="text-gray-500 text-xs">(Opcional)</span>
                            </Label>
                            <Card className="p-4">
                                {warehousesLoading ? (
                                    <p className="text-gray-500">Cargando almacenes...</p>
                                ) : warehousesData?.data?.length > 0 ? (
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                                        {warehousesData.data.map((warehouse) => (
                                            <div key={warehouse.id} className="flex items-center space-x-2">
                                                <Checkbox
                                                    id={`warehouse-${warehouse.id}`}
                                                    checked={selectedWarehouses.includes(warehouse.id)}
                                                    onCheckedChange={() => toggleWarehouse(warehouse.id)}
                                                />
                                                <label
                                                    htmlFor={`warehouse-${warehouse.id}`}
                                                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                                                >
                                                    {warehouse.name}
                                                </label>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-gray-500">No hay almacenes disponibles</p>
                                )}
                            </Card>
                        </div>

                        {/* 🎯 Botones de Acción */}
                        <div className="flex justify-end gap-4 pt-4">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => navigate('/users')}
                                disabled={isLoading}
                            >
                                Cancelar
                            </Button>
                            <Button 
                                type="submit" 
                                disabled={isLoading || selectedTenants.length === 0}
                            >
                                {getButtonText()}
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}

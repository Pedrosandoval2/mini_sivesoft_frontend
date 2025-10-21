import { useNavigate, useLocation } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { ArrowLeft } from 'lucide-react'
import { Controller, useForm } from 'react-hook-form'
import { useCreateWarehouse, useUpdateWarehouse } from '@/hooks/mutations/useWarehouseMutations'
// import { useState } from 'react'
import { useEntities } from '@/hooks/queries/useEntities'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

export default function NewWarehousePage() {
  const navigate = useNavigate()
  const location = useLocation()
  const { warehouse } = location.state || {}

  // ✨ Usar mutations de React Query
  const createMutation = useCreateWarehouse()
  const updateMutation = useUpdateWarehouse()
  const { data, isLoading: entitiesLoading } = useEntities({ page: 1, limit: 100, search: "" });

  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
  } = useForm({
    defaultValues: {
      name: warehouse?.name || '',
      address: warehouse?.address || '',
      isActive: warehouse?.isActive || false,
      ownerId: warehouse?.owner.id ? String(warehouse.owner.id) : '',
    },
  })

  const onSubmit = async (data) => {
    const body = {
      name: data.name,
      address: data.address,
      isActive: data.isActive,
      ownerId: Number(data.ownerId),
    }


    try {
      if (warehouse) {
        // Actualizar almacén existente
        await updateMutation.mutateAsync({ id: warehouse.id, data: body })
      } else {
        // Crear nuevo almacén
        await createMutation.mutateAsync(body)
      }
      // Navegar después de éxito (los toast se manejan en el mutation)
      navigate('/warehouses')
    } catch (error) {
      console.log("🚀 ~ onSubmit ~ error:", error)
      // El error ya se maneja en el mutation
    }
  }

  // Determinar si está cargando alguna de las mutaciones
  const isLoading = createMutation.isPending || updateMutation.isPending

  return (
    <div className="bg-gray-50 p-">
      <div className="max-w-2xl mx-auto space-y-6">
        <Button variant="ghost" onClick={() => navigate('/warehouses')} className="mb-4">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Volver a Almacenes
        </Button>

        <Card>
          <CardHeader>
            <CardTitle className="text-2xl font-bold">
              {warehouse ? 'Editar Almacén' : 'Nuevo Almacén'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="name">
                  Nombre del Almacén <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="name"
                  name="name"
                  {...register('name', {
                    required: 'El nombre es requerido',
                  })}
                  placeholder="Ej: Almacén Central"
                />
                {errors.name && (
                  <p className="text-sm text-red-500">{errors.name.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="entity">Propietario:</Label>
                <div className="relative">
                  <Controller
                    name="ownerId"
                    control={control}
                    render={({ field }) => (
                      <Select value={field.value} onValueChange={field.onChange}>
                        <SelectTrigger id="ownerId" className="w-full">
                          <SelectValue placeholder="Seleccionar Propietario" />
                        </SelectTrigger>
                        <SelectContent>
                          {entitiesLoading ? (
                            <div className="p-4 text-center text-gray-500">Cargando...</div>
                          ) : (
                            data?.data?.map((owner) => (
                              <SelectItem key={owner.id} value={String(owner.id)}>
                                {owner.name}
                              </SelectItem>
                            ))
                          )}
                        </SelectContent>
                      </Select>
                    )}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="address">
                  Dirección <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="address"
                  {...register('address', {
                    required: 'La dirección es requerida',
                  })}
                  placeholder="Ej: Av. Principal 123"
                />
                {errors.address && (
                  <p className="text-sm text-red-500">{errors.address.message}</p>
                )}
              </div>

              <div className="flex items-center space-x-2">
                <Controller
                  name="isActive"
                  control={control}
                  render={({ field }) => (
                    <Checkbox
                      id="isActive"
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  )}
                />
                <Label htmlFor="isActive" className="cursor-pointer">
                  Almacén activo
                </Label>
              </div>

              <div className="flex gap-4 pt-4 md:flex-row flex-col">
              <Button type="submit" className="flex-1" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                      {warehouse ? 'Actualizando...' : 'Guardando...'}
                    </>
                  ) : (
                    <>{warehouse ? 'Actualizar Almacén' : 'Crear Almacén'}</>
                  )}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate('/warehouses')}
                  className="flex-1"
                  disabled={isLoading}
                >
                  Cancelar
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

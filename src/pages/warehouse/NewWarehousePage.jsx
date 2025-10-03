import { useNavigate, useLocation } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { ArrowLeft } from 'lucide-react'
import { useForm } from 'react-hook-form'


export default function NewWarehousePage() {
  const navigate = useNavigate()

  const location = useLocation();
  const { warehouse } = location.state || {};


  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: warehouse
  })

  // const owners = [
  //   { id: '1', name: 'Juan Pérez' },
  //   { id: '2', name: 'María García' },
  //   { id: '3', name: 'Carlos López' },
  //   { id: '4', name: 'Ana Rodríguez' },
  //   { id: '5', name: 'Luis Martínez' }
  // ]



  const onSubmit = (data) => {
    console.log('Formulario enviado:', data)
    // Aquí iría la lógica para enviar los datos al backend
    navigate('/warehouses')
  }

  const handleCancel = () => {
    navigate('/warehouses')
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="flex items-center space-x-4">
          <Button variant="outline" size="sm" onClick={handleCancel}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Volver
          </Button>
          <h1 className="text-2xl font-bold">Nuevo Almacén</h1>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Información del Almacén</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">

              <div className="space-y-2">
                <Label htmlFor="name">Nombre *</Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="Ingrese el nombre del almacén"
                  className="w-full"
                  {...register('name', { required: 'El nombre es obligatorio' })}
                />
                {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="address">Dirección *</Label>
                <Input
                  id="address"
                  type="text"
                  placeholder="Ingrese la dirección completa"
                  className="w-full"
                  {...register('address', { required: 'La dirección es obligatoria' })}
                />
                {errors.address && <p className="text-red-500 text-sm mt-1">{errors.address.message}</p>}
              </div>

              {/* <div className="space-y-2">
                <Label htmlFor="owner">Propietario *</Label>
                <Select {...register('owner', { required: 'El propietario es obligatorio' })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccione un propietario" />
                  </SelectTrigger>
                  <SelectContent>
                    {owners.map((owner) => (
                      <SelectItem key={owner.id} value={owner.id}>
                        {owner.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.owner && <p className="text-red-500 text-sm mt-1">{errors.owner.message}</p>}
              </div> */}

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="isActive"
                  defaultChecked={warehouse ? warehouse.isActive : false}
                  {...register('isActive')}
                />
                <Label htmlFor="isActive">Almacén activo</Label>
                {errors.isActive && <p className="text-red-500 text-sm mt-1">{errors.isActive.message}</p>}
              </div>

              <div className="flex space-x-4 pt-4">
                <Button type="submit" className="flex-1">
                  Guardar
                </Button>
                <Button type="button" variant="outline" className="flex-1" onClick={handleCancel}>
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

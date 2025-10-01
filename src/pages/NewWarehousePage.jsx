import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { AlertCircle, ArrowLeft } from 'lucide-react'

export default function NewWarehousePage() {
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    owner: '',
    active: true
  })
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const owners = [
    { id: '1', name: 'Juan Pérez' },
    { id: '2', name: 'María García' },
    { id: '3', name: 'Carlos López' },
    { id: '4', name: 'Ana Rodríguez' },
    { id: '5', name: 'Luis Martínez' }
  ]

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
    setError('')
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    setError('')

    // Validaciones específicas
    if (!formData.name.trim()) {
      setError('El nombre del almacén es obligatorio')
      return
    }

    if (formData.name.trim().length < 3) {
      setError('El nombre debe tener al menos 3 caracteres')
      return
    }

    if (!formData.address.trim()) {
      setError('La dirección es obligatoria')
      return
    }

    if (formData.address.trim().length < 10) {
      setError('La dirección debe ser más específica (mínimo 10 caracteres)')
      return
    }

    if (!formData.owner) {
      setError('Debe seleccionar un propietario')
      return
    }

    // Simulación de guardado exitoso
    const newWarehouse = {
      ...formData,
      id: Date.now(), // ID temporal
      createdAt: new Date().toISOString()
    }
    
    console.log('Nuevo almacén creado:', newWarehouse)
    
    // Mostrar mensaje de éxito (en una aplicación real, esto sería un toast)
    alert('Almacén creado exitosamente')
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
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <div className="space-y-2">
                <Label htmlFor="name">Nombre *</Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="Ingrese el nombre del almacén"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  className="w-full"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="address">Dirección *</Label>
                <Input
                  id="address"
                  type="text"
                  placeholder="Ingrese la dirección completa"
                  value={formData.address}
                  onChange={(e) => handleInputChange('address', e.target.value)}
                  className="w-full"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="owner">Propietario *</Label>
                <Select value={formData.owner} onValueChange={(value) => handleInputChange('owner', value)}>
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
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="active"
                  checked={formData.active}
                  onCheckedChange={(checked) => handleInputChange('active', checked)}
                />
                <Label htmlFor="active">Almacén activo</Label>
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

import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { AlertCircle, ArrowLeft, Calendar } from 'lucide-react'

export default function NewInventorySheetPage() {
  const [formData, setFormData] = useState({
    warehouse: '',
    issueDate: new Date().toISOString().split('T')[0],
    status: 'draft'
  })
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const warehouses = [
    { id: '1', name: 'Almacén Central' },
    { id: '2', name: 'Bodega Norte' },
    { id: '3', name: 'Depósito Sur' },
    { id: '4', name: 'Almacén Oriente' }
  ]

  const statuses = [
    { id: 'draft', name: 'Borrador' },
    { id: 'in_progress', name: 'En Progreso' },
    { id: 'completed', name: 'Finalizado' },
    { id: 'cancelled', name: 'Cancelado' }
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
    if (!formData.warehouse) {
      setError('Debe seleccionar un almacén')
      return
    }

    if (!formData.issueDate) {
      setError('La fecha de emisión es obligatoria')
      return
    }

    // Validar que la fecha no sea futura
    const selectedDate = new Date(formData.issueDate)
    const today = new Date()
    today.setHours(23, 59, 59, 999) // Fin del día actual
    
    if (selectedDate > today) {
      setError('La fecha de emisión no puede ser futura')
      return
    }

    // Validar que la fecha no sea muy antigua (más de 1 año)
    const oneYearAgo = new Date()
    oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1)
    
    if (selectedDate < oneYearAgo) {
      setError('La fecha de emisión no puede ser anterior a un año')
      return
    }

    if (!formData.status) {
      setError('Debe seleccionar un estado')
      return
    }

    // Simulación de guardado exitoso
    const newInventorySheet = {
      ...formData,
      id: Date.now(), // ID temporal
      createdAt: new Date().toISOString(),
      createdBy: localStorage.getItem('currentUser') || 'Usuario'
    }
    
    console.log('Nueva hoja de inventario creada:', newInventorySheet)
    
    // Mostrar mensaje de éxito
    alert('Hoja de inventario creada exitosamente')
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
          <h1 className="text-2xl font-bold">Nueva Hoja de Inventario</h1>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Información de la Hoja de Inventario</CardTitle>
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
                <Label htmlFor="warehouse">Almacén *</Label>
                <Select value={formData.warehouse} onValueChange={(value) => handleInputChange('warehouse', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccione un almacén" />
                  </SelectTrigger>
                  <SelectContent>
                    {warehouses.map((warehouse) => (
                      <SelectItem key={warehouse.id} value={warehouse.id}>
                        {warehouse.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="issueDate">Fecha de Emisión *</Label>
                <div className="relative">
                  <Input
                    id="issueDate"
                    type="date"
                    value={formData.issueDate}
                    onChange={(e) => handleInputChange('issueDate', e.target.value)}
                    className="w-full"
                  />
                  <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="status">Estado *</Label>
                <Select value={formData.status} onValueChange={(value) => handleInputChange('status', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccione un estado" />
                  </SelectTrigger>
                  <SelectContent>
                    {statuses.map((status) => (
                      <SelectItem key={status.id} value={status.id}>
                        {status.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
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

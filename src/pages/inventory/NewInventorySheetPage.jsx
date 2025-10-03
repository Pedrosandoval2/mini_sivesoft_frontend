import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { ChevronDown, Plus, ArrowLeft } from 'lucide-react'
import { useState } from 'react'
import { Trash2 } from 'lucide-react'


export default function NewInventorySheetPage() {
  const [isItemsOpen, setIsItemsOpen] = useState(true)
  const navigate = useNavigate()
  const [items, setItems] = useState([{ id: 1, productId: "", quantity: 0, unit: "unidades", price: 0 }])

  const addItem = () => {
    const newId = items.length > 0 ? Math.max(...items.map((i) => i.id)) + 1 : 1
    setItems([...items, { id: newId, productId: "", quantity: 0, unit: "unidades", price: 0 }])
  }

  const deleteItem = (id) => {
    if (items.length > 1) {
      setItems(items.filter((item) => item.id !== id))
    }
  }

  const updateItem = (id, field, value) => {
    setItems(items.map((item) => (item.id === id ? { ...item, [field]: value } : item)))
  }

  const handleCancel = () => {
    navigate('/inventory-sheets')
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="mx-auto max-w-5xl">
        <div className=' flex items-center space-x-4 mb-8'>
          <Button variant="outline" size="sm" onClick={handleCancel} className="cursor-pointer">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Volver
          </Button>
          <h1 className="text-3xl font-bold text-foreground">Hoja de Inventario</h1>
        </div>

        <div className="rounded-lg bg-white p-8 shadow-sm">
          <h2 className="mb-6 text-xl font-semibold text-foreground">Nueva Hoja de Inventario</h2>

          <div className="space-y-6">
            <div>
              <div className='flex gap-4 mb-6'>
                <div className='flex-1'>
                  <Label htmlFor="warehouse" className="mb-2">Almacén</Label>
                  <Select>
                    <SelectTrigger id="warehouse" className={"w-full"}>
                      <SelectValue placeholder="Seleccionar almacén..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="warehouse1">Almacén 1</SelectItem>
                      <SelectItem value="warehouse2">Almacén 2</SelectItem>
                      <SelectItem value="warehouse3">Almacén 3</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex-1">
                  <Label htmlFor="issueDate" className="mb-2">F. Emisión</Label>
                  <Input id="issueDate" type="date" className="w-full" />
                </div>
              </div>




              <div className="space-y-2">
                <Label htmlFor="series">Serie</Label>
                <Select>
                  <SelectTrigger id="series">
                    <SelectValue placeholder="Seleccionar serie..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="series1">Serie A</SelectItem>
                    <SelectItem value="series2">Serie B</SelectItem>
                    <SelectItem value="series3">Serie C</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="status">Estado</Label>
                <Select>
                  <SelectTrigger id="status">
                    <SelectValue placeholder="Seleccionar estado..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="draft">Borrador</SelectItem>
                    <SelectItem value="pending">Pendiente</SelectItem>
                    <SelectItem value="approved">Aprobado</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="responsibleEntity">Entidad Responsable</Label>
              <Input id="responsibleEntity" placeholder="Ingrese entidad responsable" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="observation">Observación</Label>
              <Textarea
                id="observation"
                placeholder="Ingrese observaciones adicionales..."
                rows={4}
                className="resize-none"
              />
            </div>

            <div className="border-t pt-6">
              <Collapsible open={isItemsOpen} onOpenChange={setIsItemsOpen}>
                <CollapsibleTrigger className="flex w-full items-center justify-between rounded-md p-2 hover:bg-gray-50">
                  <span className="font-semibold text-foreground">Items</span>
                  <ChevronDown className={`h-5 w-5 transition-transform ${isItemsOpen ? "rotate-180" : ""}`} />
                </CollapsibleTrigger>
                <CollapsibleContent className="mt-4 space-y-6">
                  {items.map((item, index) => (
                    <div key={item.id} className="space-y-4 rounded-lg border bg-gray-50 p-6">
                      <div className="flex items-center justify-between">
                        <h3 className="font-semibold text-foreground">Item #{index + 1}</h3>
                        {items.length > 1 && (
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="text-red-600 hover:bg-red-50 hover:text-red-700"
                            onClick={() => deleteItem(item.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
                      </div>

                      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        <div className="space-y-2">
                          <Label htmlFor={`productId-${item.id}`}>
                            ID Producto <span className="text-red-500">*</span>
                          </Label>
                          <Input
                            id={`productId-${item.id}`}
                            placeholder="ej: WATER-CIELO-1L"
                            value={item.productId}
                            onChange={(e) => updateItem(item.id, "productId", e.target.value)}
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor={`quantity-${item.id}`}>
                            Cantidad <span className="text-red-500">*</span>
                          </Label>
                          <Input
                            id={`quantity-${item.id}`}
                            type="number"
                            value={item.quantity}
                            onChange={(e) => updateItem(item.id, "quantity", Number.parseFloat(e.target.value) || 0)}
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor={`unit-${item.id}`}>
                            Unidad <span className="text-red-500">*</span>
                          </Label>
                          <Select value={item.unit} onValueChange={(value) => updateItem(item.id, "unit", value)}>
                            <SelectTrigger id={`unit-${item.id}`}>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="unidades">unidades</SelectItem>
                              <SelectItem value="cajas">cajas</SelectItem>
                              <SelectItem value="paquetes">paquetes</SelectItem>
                              <SelectItem value="litros">litros</SelectItem>
                              <SelectItem value="kilogramos">kilogramos</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor={`price-${item.id}`}>
                            Precio <span className="text-red-500">*</span>
                          </Label>
                          <Input
                            id={`price-${item.id}`}
                            type="number"
                            step="0.01"
                            value={item.price}
                            onChange={(e) => updateItem(item.id, "price", Number.parseFloat(e.target.value) || 0)}
                          />
                        </div>
                      </div>
                    </div>
                  ))}

                  <Button type="button" variant="ghost" className="text-blue-600 hover:text-blue-700" onClick={addItem}>
                    <Plus className="mr-2 h-4 w-4" />
                    Agregar Item
                  </Button>
                </CollapsibleContent>
              </Collapsible>
            </div>
          </div>

          <div className="mt-8 flex justify-end gap-3">
            <Button variant="secondary" className="bg-gray-400 text-white hover:bg-gray-500">
              Cancelar
            </Button>
            <Button className="bg-blue-600 text-white hover:bg-blue-700">Guardar</Button>
          </div>
        </div>
      </div>
    </div>
  )
}

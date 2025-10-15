import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ChevronDown, Plus, ArrowLeft, Trash2 } from 'lucide-react';
import { Controller, useFieldArray, useForm } from 'react-hook-form';
import { useUserStore } from '@/store/userStore';
import { formatNumberWithZero } from '@/utils/formatNumberWithZero';
import { useWarehousesByUser } from '@/hooks/queries/useWarehousesByUser';
import { useCreateInventorySheet, useUpdateInventorySheet } from '@/hooks/mutations/useInventorySheetMutations';
import { useState, useMemo } from 'react';

const transformInitialData = (data) => {
  return {
    sheet: {
      warehouseId: data?.warehouse?.id ?? "",
      emissionDate: data?.emissionDate?.split("T")[0] ?? "",
      state: data?.state ?? "registrado",
      serie: data?.serie ?? "",
    },
    details: data?.details?.map((d) => ({
      productId: d.productId,
      quantity: d.quantity,
      unit: d.unit,
      price: d.price,
    })) || [],
  }
}

export default function NewInventorySheetPage() {
  const name = useUserStore((state) => state.user)


  // ✨ React Query para obtener almacenes del usuario
  const { data: warehouses, isLoading: loadingWarehouses } = useWarehousesByUser();
  
  // ✨ React Query mutations para crear/actualizar hojas de inventario
  const createMutation = useCreateInventorySheet()
  const updateMutation = useUpdateInventorySheet()

  const [isItemsOpen, setIsItemsOpen] = useState(true)
  const [isSheetOpen, setIsSheetOpen] = useState(true)

  const navigate = useNavigate()
  const location = useLocation();
  const { inventorySheet } = location.state || {};

  const defaultValues = transformInitialData(inventorySheet);

  const { register, handleSubmit, formState: { errors }, control, watch } = useForm({
    defaultValues: inventorySheet ? defaultValues : {
      sheet: {
        warehouseId: "",
        emissionDate: "",
        state: "registrado",
        serie: "INV"
      },
      details: [{ productId: "", quantity: 0, unit: "unidades", price: 0 }]
    }
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "details"
  })

  const warehouseSelected = watch("sheet.warehouseId");

  const warehouseSerie = useMemo(() => {
    if (!warehouseSelected || !warehouses?.length) return "0000";
    return warehouses.find(w => w?.id === Number(warehouseSelected))?.serieWarehouse || "0000";
  }, [warehouseSelected, warehouses]);

  const handleCancel = () => {
    navigate('/inventory-sheets')
  }

  const onSubmit = async (data) => {
    console.log("🚀 ~ onSubmit ~ data:", data)
    const body = {
      sheet: {
        warehouseId: Number(data.sheet.warehouseId),
        emissionDate: data.sheet.emissionDate,
        state: data.sheet.state,
        serie: "INV",
      },
      details: data.details.map(item => ({
        productId: item.productId,
        quantity: Number(item.quantity),
        unit: item.unit,
        price: Number(item.price)
      }))
    }

    try {
      if (inventorySheet) {
        // Actualizar hoja de inventario existente
        await updateMutation.mutateAsync({ id: inventorySheet.id, data: body })
      } else {
        // Crear nueva hoja de inventario
        await createMutation.mutateAsync(body)
      }
      // Navegar después de éxito (los toast se manejan en el mutation)
      navigate('/inventory-sheets')
    } catch {
      // El error ya se maneja en el mutation
    }
  }

  // Determinar si está cargando alguna de las mutaciones
  const isLoading = createMutation.isPending || updateMutation.isPending
  
  // Texto del botón según el modo (crear/editar)
  const submitButtonText = inventorySheet ? 'Actualizar Hoja' : 'Guardar Hoja'
  const loadingButtonText = inventorySheet ? 'Actualizando...' : 'Guardando...'

  return (
    <div className=" bg-gray-50 p-6">
      <div className="mx-auto max-w-5xl">
        <div className=' flex items-center space-x-4 mb-8'>
          <Button variant="outline" size="sm" onClick={handleCancel} className="cursor-pointer">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Volver
          </Button>

          <h1 className="text-3xl font-bold text-foreground">Hoja de Inventario</h1>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="rounded-lg bg-white p-8 shadow-sm">
          <Collapsible open={isSheetOpen} onOpenChange={setIsSheetOpen}>
            <CollapsibleTrigger className="flex w-full items-center justify-between rounded-md p-2 hover:bg-gray-50">
              <span className="font-semibold text-foreground">Nueva Hoja de Inventario</span>
              <ChevronDown className={`h-5 w-5 transition-transform ${isSheetOpen ? "rotate-180" : ""}`} />
            </CollapsibleTrigger>
            <CollapsibleContent className="mt-4 space-y-6">
              <div className="space-y-6">
                <div>
                  <div className='flex gap-4 mb-6'>
                    <div className='flex-1'>
                      <Label htmlFor="warehouseId" className="mb-2">Almacén</Label>
                      <Controller
                        control={control}
                        name="sheet.warehouseId"
                        rules={{ required: "El almacén es obligatorio" }}
                        render={({ field }) => (
                          <Select onValueChange={field.onChange} value={field.value?.toString() ?? ""}>
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder="Seleccionar almacén..." />
                            </SelectTrigger>
                            <SelectContent>
                              {loadingWarehouses ? (
                                <SelectItem value="loading" disabled>Cargando almacenes...</SelectItem>
                              ) : (
                                warehouses?.map((warehouse) => {
                                  return (
                                    <SelectItem key={warehouse.id} value={warehouse.id.toString()}>
                                      {warehouse.name}
                                    </SelectItem>
                                  )
                                })
                              )}
                            </SelectContent>
                          </Select>
                        )}
                      />
                      {errors.sheet?.warehouseId && <p className="text-red-500 text-sm mt-1">{errors.sheet.warehouseId.message}</p>}
                    </div>
                    <div className="flex-1">
                      <Label htmlFor="issueDate" className="mb-2">F. Emisión</Label>
                      <Input type="date" className="w-full" name="sheet.emissionDate" id="issueDate"
                        {...register("sheet.emissionDate", { required: true })} />
                      {errors.sheet?.emissionDate && <p className="text-red-500 text-sm mt-1">La fecha de emisión es obligatoria</p>}
                    </div>
                  </div>
                  <div className='flex gap-4'>
                    <div className="flex-1">
                      <Label htmlFor="status" className="mb-2">Estado</Label>
                      {/* <Controller
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
                            data.data?.map((owner) => (
                              <SelectItem key={owner.id} value={String(owner.id)}>
                                {owner.name}
                              </SelectItem>
                            ))
                          )}
                        </SelectContent>
                      </Select>
                    )}
                  /> */}
                      <Controller
                        control={control}
                        name='sheet.state'
                        render={({ field }) => (
                          <Select onValueChange={field.onChange} value={field.value}>
                            <SelectTrigger id="sheet.state" className='w-full'>
                              <SelectValue placeholder="Seleccionar estado"/>
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="pendiente">Pendiente</SelectItem>
                              <SelectItem value="registrado">Registrado</SelectItem>
                              <SelectItem value="aprobado">Aprobado</SelectItem>
                            </SelectContent>
                          </Select>
                        )}
                      />
                      {errors.sheet?.state && <p className="text-red-500 text-sm mt-1">El estado es obligatorio</p>}
                    </div>

                    <div className="flex-1">
                      <Label htmlFor="series" className="mb-2">Serie</Label>
                      <div id="serie" className="border p-[6.5px] rounded-md">
                        <p className='ml-2.5 text-[#8a8e91] text-[14.5px]'>{formatNumberWithZero(warehouseSerie)}</p>
                      </div>
                    </div>
                  </div>
                  <div className="w-[49%] mt-6">
                    <Label htmlFor="responsibleEntity" className="mb-2">Entidad Responsable</Label>
                    <div id="responsibleEntity" className="border p-[6.5px] rounded-md">
                      <p className='ml-2.5 text-[#8a8e91] text-[14.5px]'>{inventorySheet?.user?.entityRelation?.name || name.nameEntity || 'Role Admin'}</p>
                    </div>
                  </div>
                </div>
              </div>
            </CollapsibleContent>
          </Collapsible>

          <div className="border-t mt-5">
            <Collapsible open={isItemsOpen} onOpenChange={setIsItemsOpen}>
              <CollapsibleTrigger className="flex w-full items-center justify-between rounded-md p-2 hover:bg-gray-50">
                <span className="font-semibold text-foreground">Items</span>
                <ChevronDown className={`h-5 w-5 transition-transform ${isItemsOpen ? "rotate-180" : ""}`} />
              </CollapsibleTrigger>
              <CollapsibleContent className="mt-4 space-y-6">
                {fields.map((item, index) => (
                  <div key={item.id} className="space-y-4 rounded-lg border bg-gray-50 p-6">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold text-foreground">Item #{index + 1}</h3>
                      {fields.length > 1 && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="text-red-600 hover:bg-red-50 hover:text-red-700"
                          onClick={() => remove(index)}
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
                        <Controller
                          control={control}
                          name={`details.${index}.productId`}
                          render={({ field }) => (
                            <Input placeholder="ej: WATER-CIELO-1L"{...field} />
                          )}
                        />

                      </div>

                      <div className="space-y-2">
                        <Label htmlFor={`quantity-${item.id}`}>
                          Cantidad <span className="text-red-500">*</span>
                        </Label>
                        <Controller
                          control={control}
                          name={`details.${index}.quantity`}
                          render={({ field }) => (
                            <Input
                              type="number"
                              placeholder="ej: 100"
                              {...field}
                            />
                          )}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor={`unit-${item.id}`}>
                          Unidad <span className="text-red-500">*</span>
                        </Label>
                        <Controller
                          control={control}
                          name={`details.${index}.unit`}
                          render={({ field }) => (
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
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
                          )}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor={`price-${item.id}`}>
                          Precio <span className="text-red-500">*</span>
                        </Label>
                        <Controller
                          control={control}
                          name={`details.${index}.price`}
                          render={({ field }) => (
                            <Input
                              type="number"
                              step="0.01"
                              {...field}
                            />
                          )}
                        />
                      </div>
                    </div>
                  </div>
                ))}

                <Button type="button" variant="ghost" className="text-blue-600 hover:text-blue-700" onClick={() => append({ productId: "", quantity: 0, unit: "unidades", price: 0 })}>
                  <Plus className="mr-2 h-4 w-4" />
                  Agregar Item
                </Button>
              </CollapsibleContent>
            </Collapsible>
          </div>

          <div className="mt-8 flex justify-end gap-3">
            <Button 
              type="button"
              variant="secondary" 
              className="bg-gray-400 text-white hover:bg-gray-500" 
              onClick={handleCancel}
              disabled={isLoading}
            >
              Cancelar
            </Button>
            <Button 
              type="submit"
              className="bg-blue-600 text-white hover:bg-blue-700"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  {loadingButtonText}
                </>
              ) : (
                submitButtonText
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}

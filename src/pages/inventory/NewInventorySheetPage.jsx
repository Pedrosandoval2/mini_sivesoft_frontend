import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ChevronDown, Plus, ArrowLeft, Trash2 } from 'lucide-react';
import { Controller, useFieldArray, useForm } from 'react-hook-form';
import { useUserStore } from '@/store/userStore';
import { formatNumberWithZero } from '@/utils/formatNumberWithZero';
import { useWarehousesByUser } from '@/hooks/queries/useWarehousesByUser';
import {
  useCreateInventorySheet,
  useUpdateInventorySheet,
} from '@/hooks/mutations/useInventorySheetMutations';
import { useState, useMemo, useEffect } from 'react';
import { useProductByBarcode } from '@/hooks/queries/useProductByBarcode';
import { QrScannerModal } from '@/components/scannerBarCode/QrScannerModal';
import { toast } from 'react-toastify';
import { CodesModal } from '@/components/codesModal/CodesModal';
import { queryClient } from '@/lib/react-query';
import { getProductByBarcode } from '@/services/products/getProductByBarcode';

/**
 * Estructura inicial de un producto vacío
 * Se usa como template al agregar nuevos items a la hoja de inventario
 */
const initialProducts = {
  productId: '',
  quantity: 0,
  unit: 'unidades',
  price: 0,
};

/**
 * Transforma los datos de la hoja de inventario del backend al formato del formulario
 * @param {Object} data - Datos de la hoja de inventario desde el backend
 * @returns {Object} - Datos formateados para el formulario
 */
const transformInitialData = (data) => {
  return {
    sheet: {
      warehouseId: data?.warehouse?.id ?? '',
      emissionDate: data?.emissionDate?.split('T')[0] ?? '',
      state: data?.state ?? 'registrado',
      serie: data?.serie ?? '',
    },
    details:
      data?.details?.map((d) => ({
        productId: d.productId,
        quantity: d.quantity,
        unit: d.unit,
        price: d.price,
      })) || [],
  };
};

/**
 * Componente para crear o editar hojas de inventario
 *
 * Funcionalidades principales:
 * - Crear nueva hoja de inventario con múltiples productos
 * - Editar hoja de inventario existente
 * - Escanear códigos de barras para agregar productos automáticamente
 * - Validación de formularios con React Hook Form
 * - Gestión de estado con React Query
 */
export default function NewInventorySheetPage() {
  // 📦 Estado del usuario desde Zustand store
  const name = useUserStore((state) => state.user);

  // 🔍 Estado para el código escaneado por la cámara
  const [scannedResult, setScannedResult] = useState('');

  // 📷 Estado para controlar la visibilidad del modal del escáner
  const [qrScannerOpen, setQrScannerOpen] = useState(false);

  // ✨ React Query: Obtener almacenes del usuario autenticado
  const { data: warehouses, isLoading: loadingWarehouses } =
    useWarehousesByUser();

  // ✨ React Query: Buscar producto por código de barras escaneado
  // Solo se ejecuta cuando hay un código escaneado (enabled)
  const { data: productData } = useProductByBarcode(scannedResult, {
    enabled: scannedResult.length > 0,
  });

  const [isModalOpenCodes, setIsModalOpenCodes] = useState(false);

  const handleAddMultiCodes = async (codes) => {
    setIsModalOpenCodes(false);

    // Filtrar códigos vacíos
    const validCodes = codes.filter(
      (code) => code.value && code.value.trim() !== ''
    );

    if (validCodes.length === 0) {
      toast.warning('No hay códigos válidos para procesar');
      return;
    }

    // Mostrar toast de inicio
    const loadingToastId = toast.loading(
      `Procesando ${validCodes.length} código(s)...`
    );

    try {
      // Usar fetchQuery para aprovechar el caché de React Query
      const promises = validCodes.map((code) => {
        return queryClient
          .fetchQuery({
            queryKey: ['products', 'barcode', code.value],
            queryFn: () => getProductByBarcode(code.value),
            staleTime: 5 * 60 * 1000, // 5 minutos de caché
          })
          .then((response) => {
            console.log(response);

            return {
              success: true,
              code: code.value,
              product: response.data,
            };
          })
          .catch((error) => {
            console.log('🚀 ~ handleAddMultiCodes ~ error:', error);
            return {
              success: false,
              code: code.value,
              error: error.response?.data?.message || 'Producto no encontrado',
            };
          });
      });

      // Esperar a que todas las promesas se resuelvan
      const results = await Promise.all(promises);
      console.log('🚀 ~ handleAddMultiCodes ~ results:', results);

      // Separar resultados exitosos de los fallidos
      const successResults = results.filter((r) => r.success);
      console.log('🚀 ~ handleAddMultiCodes ~ successResults:', successResults);
      const failedResults = results.filter((r) => !r.success);

      // Agregar productos encontrados al formulario
      if (successResults.length > 0) {
        // Remover el último item vacío si existe
        const lastIndex = fields.length - 1;
        const lastItem = watch(`details.${lastIndex}`);
        if (!lastItem.productId) {
          remove(lastIndex);
        }

        // Agregar cada producto encontrado
        successResults.forEach((result) => {
          console.log('🚀 ~ handleAddMultiCodes ~ result:', result);
          append({
            productId: result.product.barcode,
            quantity: 1,
            unit: result.product.unit,
            price: result.product.price,
          });
        });

        // Actualizar toast de carga a éxito
        toast.update(loadingToastId, {
          render: `${successResults.length} producto(s) agregado(s) exitosamente`,
          type: 'success',
          isLoading: false,
          autoClose: 3000,
        });
      }

      // Mostrar errores si hubo productos no encontrados
      if (failedResults.length > 0) {
        const failedCodes = failedResults.map((r) => r.code).join(', ');

        if (successResults.length === 0) {
          // Si todos fallaron, actualizar el toast de loading
          toast.update(loadingToastId, {
            render: `Códigos no encontrados: ${failedCodes}`,
            type: 'error',
            isLoading: false,
            autoClose: 5000,
          });
        } else {
          // Si algunos fallaron, mostrar nuevo toast
          toast.error(
            `${failedResults.length} código(s) no encontrado(s): ${failedCodes}`,
            { autoClose: 5000 }
          );
        }
      }
    } catch (error) {
      console.error('Error al procesar códigos múltiples:', error);
      toast.update(loadingToastId, {
        render: 'Error al procesar los códigos de barras',
        type: 'error',
        isLoading: false,
        autoClose: 3000,
      });
    }
  };

  // ✨ React Query: Mutations para crear/actualizar hojas de inventario
  // Incluyen invalidación de caché y notificaciones toast automáticas
  const createMutation = useCreateInventorySheet();
  const updateMutation = useUpdateInventorySheet();

  // 🎨 Estado para controlar la visibilidad de las secciones colapsables
  const [isItemsOpen, setIsItemsOpen] = useState(true);
  const [isSheetOpen, setIsSheetOpen] = useState(true);

  // 🧭 Navegación y datos de la hoja a editar (si existe)
  const navigate = useNavigate();
  const location = useLocation();
  const { inventorySheet } = location.state || {};

  // 📝 Valores por defecto del formulario
  // Si existe inventorySheet, transforma los datos para el formulario
  // Si no, usa valores vacíos para crear nueva hoja
  const defaultValues = transformInitialData(inventorySheet);

  // 📋 React Hook Form: Configuración del formulario
  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
    watch,
    setValue,
  } = useForm({
    defaultValues: inventorySheet
      ? defaultValues
      : {
        sheet: {
          warehouseId: '',
          emissionDate: '',
          state: 'registrado',
          serie: 'INV',
        },
        details: [initialProducts],
      },
  });

  // 📝 useFieldArray: Manejo dinámico del array de productos
  // Permite agregar, eliminar y modificar items de forma reactiva
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'details',
  });

  // 👀 Watch: Observar el almacén seleccionado para actualizar la serie
  const warehouseSelected = watch('sheet.warehouseId');

  // 🔢 Calcular la serie del almacén seleccionado
  // useMemo evita recalcular en cada render, solo cuando cambian las dependencias
  const warehouseSerie = useMemo(() => {
    if (!warehouseSelected || !warehouses?.length) return '0000';
    return (
      warehouses.find((w) => w?.id === Number(warehouseSelected))
        ?.serieWarehouse || '0000'
    );
  }, [warehouseSelected, warehouses]);

  /**
   * Cancela la creación/edición y vuelve a la lista de hojas
   */
  const handleCancel = () => {
    navigate('/inventory-sheets');
  };

  /**
   * useEffect: Procesar producto escaneado
   *
   * Flujo:
   * 1. Si no hay productData y hay código escaneado → Error (producto no encontrado)
   * 2. Si hay productData → Llenar el último item del formulario con los datos del producto
   * 3. Mostrar notificación de éxito/error
   * 4. Limpiar el código escaneado
   * 5. Agregar un nuevo item vacío al formulario
   */
  useEffect(() => {
    if (!productData) {
      if (scannedResult.length > 0) {
        toast.error('Producto no encontrado para el código escaneado');
        setScannedResult('');
      }
      return;
    }

    // Obtener el índice del último item agregado
    const lastIndex = fields.length - 1;
    const product = productData.data;

    // Llenar automáticamente los campos del producto escaneado
    setValue(`details.${lastIndex}.productId`, product.barcode);
    setValue(`details.${lastIndex}.quantity`, 1);
    setValue(`details.${lastIndex}.unit`, product.unit);
    setValue(`details.${lastIndex}.price`, product.price);

    toast.success(`Producto "${product.name}" agregado`);
    setScannedResult('');

    // Agregar un nuevo item vacío para el próximo escaneo
    append(initialProducts);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [productData]);
  /**
   * Maneja el envío del formulario
   *
   * @param {Object} data - Datos del formulario validados por React Hook Form
   *
   * Proceso:
   * 1. Transformar datos del formulario al formato del backend
   * 2. Filtrar productos vacíos (sin productId)
   * 3. Validar que haya al menos un producto
   * 4. Crear o actualizar según el modo (isEditMode)
   * 5. Navegar a la lista después del éxito
   */
  const onSubmit = async (data) => {
    // Preparar body para el backend
    const body = {
      sheet: {
        warehouseId: Number(data.sheet.warehouseId),
        emissionDate: data.sheet.emissionDate,
        state: data.sheet.state,
        serie: 'INV',
      },
      details: data.details
        .filter((item) => item.productId) // Filtrar items vacíos
        .map((item) => ({
          productId: item.productId,
          quantity: Number(item.quantity),
          unit: item.unit,
          price: Number(item.price),
        })),
    };

    // Validar que haya al menos un producto
    if (body.details.length === 0) {
      toast.error('Debes agregar al menos un producto');
      return;
    }

    try {
      if (inventorySheet) {
        // Modo edición: Actualizar hoja existente
        await updateMutation.mutateAsync({ id: inventorySheet.id, data: body });
      } else {
        // Modo creación: Crear nueva hoja
        await createMutation.mutateAsync(body);
      }
      // Navegar después del éxito (los toast se manejan en la mutation)
      navigate('/inventory-sheets');
    } catch {
      // El error ya se maneja en la mutation con toast.error
    }
  };

  /**
   * Abre el modal del escáner de códigos de barras
   */
  const handleScanBarcode = () => {
    setQrScannerOpen(true);
  };

  /**
   * Procesa el resultado del escaneo
   * @param {string} decodedText - Código de barras escaneado
   */
  const handleNewScanResult = (decodedText) => {
    setScannedResult(decodedText);
    setQrScannerOpen(false);
  };

  // 🔄 Estados de carga de las mutaciones
  const isLoading = createMutation.isPending || updateMutation.isPending;

  // 📝 Determinar si está en modo edición
  const isEditMode = Boolean(inventorySheet);

  // 🏷️ Textos dinámicos según el modo
  const submitButtonText = isEditMode ? 'Actualizar Hoja' : 'Guardar Hoja';
  const loadingButtonText = isEditMode ? 'Actualizando...' : 'Guardando...';

  return (
    <div className=" bg-gray-50 md:p-6">
      <div className="mx-auto max-w-5xl">
        {/* 🔙 Header con botón de volver y título dinámico */}
        <div className="flex items-center space-x-4 mb-8">
          <Button variant="ghost" onClick={handleCancel}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Volver a los inventarios
          </Button>
        </div>

        {/* 📋 Formulario principal */}
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="rounded-lg bg-white p-8 shadow-sm"
        >
          {/* 📄 Sección 1: Información de la Hoja (Collapsible) */}
          <Collapsible open={isSheetOpen} onOpenChange={setIsSheetOpen}>
            <CollapsibleTrigger className="flex w-full items-center justify-between rounded-md p-2 hover:bg-gray-50">
              <span className="font-semibold text-foreground">
                Información de la Hoja
              </span>
              <ChevronDown
                className={`h-5 w-5 transition-transform ${isSheetOpen ? 'rotate-180' : ''
                  }`}
              />
            </CollapsibleTrigger>
            <CollapsibleContent className="mt-4 space-y-6">
              <div className="space-y-6">
                <div>
                  {/* Fila 1: Almacén y Fecha de Emisión */}
                  <div className="flex gap-4 mb-6 md:flex-row flex-col">
                    {/* Select de Almacenes con React Hook Form Controller */}
                    <div className="flex-1">
                      <Label htmlFor="warehouseId" className="mb-2">
                        Almacén
                      </Label>
                      <Controller
                        control={control}
                        name="sheet.warehouseId"
                        rules={{ required: 'El almacén es obligatorio' }}
                        render={({ field }) => (
                          <Select
                            onValueChange={field.onChange}
                            value={field.value?.toString() ?? ''}
                          >
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder="Seleccionar almacén..." />
                            </SelectTrigger>
                            <SelectContent>
                              {loadingWarehouses ? (
                                <SelectItem value="loading" disabled>
                                  Cargando almacenes...
                                </SelectItem>
                              ) : (
                                warehouses?.map((warehouse) => {
                                  return (
                                    <SelectItem
                                      key={warehouse.id}
                                      value={warehouse.id.toString()}
                                    >
                                      {warehouse.name}
                                    </SelectItem>
                                  );
                                })
                              )}
                            </SelectContent>
                          </Select>
                        )}
                      />
                      {errors.sheet?.warehouseId && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.sheet.warehouseId.message}
                        </p>
                      )}
                    </div>

                    {/* Input de Fecha */}
                    <div className="flex-1">
                      <Label htmlFor="issueDate" className="mb-2">
                        F. Emisión
                      </Label>
                      <Input
                        type="date"
                        className="w-full"
                        name="sheet.emissionDate"
                        id="issueDate"
                        {...register('sheet.emissionDate', { required: true })}
                      />
                      {errors.sheet?.emissionDate && (
                        <p className="text-red-500 text-sm mt-1">
                          La fecha de emisión es obligatoria
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Fila 2: Estado y Serie */}
                  <div className="flex gap-4 md:flex-row flex-col">
                    {/* Select de Estado */}
                    <div className="flex-1">
                      <Label htmlFor="status" className="mb-2">
                        Estado
                      </Label>
                      <Controller
                        control={control}
                        name="sheet.state"
                        render={({ field }) => (
                          <Select
                            onValueChange={field.onChange}
                            value={field.value}
                          >
                            <SelectTrigger id="sheet.state" className="w-full">
                              <SelectValue placeholder="Seleccionar estado" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="pendiente">
                                Pendiente
                              </SelectItem>
                              <SelectItem value="registrado">
                                Registrado
                              </SelectItem>
                              <SelectItem value="aprobado">Aprobado</SelectItem>
                            </SelectContent>
                          </Select>
                        )}
                      />
                      {errors.sheet?.state && (
                        <p className="text-red-500 text-sm mt-1">
                          El estado es obligatorio
                        </p>
                      )}
                    </div>

                    {/* Campo de Serie (solo lectura, calculado automáticamente) */}
                    <div className="flex-1">
                      <Label htmlFor="series" className="mb-2">
                        Serie
                      </Label>
                      <div id="serie" className="border p-[6.5px] rounded-md">
                        <p className="ml-2.5 text-[#8a8e91] text-[14.5px]">
                          {formatNumberWithZero(warehouseSerie)}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Campo de Entidad Responsable (solo lectura) */}
                  <div className="mt-6 md:w-[49%]  w-full">
                    <Label htmlFor="responsibleEntity" className="mb-2">
                      Entidad Responsable
                    </Label>
                    <div
                      id="responsibleEntity"
                      className="border p-[6.5px] rounded-md"
                    >
                      <p className="ml-2.5 text-[#8a8e91] text-[14.5px]">
                        {inventorySheet?.user?.entityRelation?.name ||
                          name?.nameEntity ||
                          'Role Admin'}
                      </p>
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
                <ChevronDown
                  className={`h-5 w-5 transition-transform ${isItemsOpen ? 'rotate-180' : ''
                    }`}
                />
              </CollapsibleTrigger>
              <CollapsibleContent className="mt-4 space-y-6">
                {fields.map((item, index) => (
                  <div
                    key={item.id}
                    className="space-y-4 rounded-lg border bg-gray-50 p-6"
                  >
                    <h3 className="font-semibold text-foreground">
                      Item {index + 1}
                    </h3>
                    <div className="flex items-center justify-center md:justify-end">
                      <div className="flex items-center gap-3 md:justify-end justify-start md:flex-row flex-col w-full md:w-auto md:gap-4">
                        {fields.length - 1 === index && (
                          <Button
                            size="sm"
                            type="button"
                            className="text-white bg-green-600 hover:bg-green-700 w-full md:w-auto"
                            onClick={handleScanBarcode}
                          >
                            Escanear Código
                          </Button>
                        )}
                        <Button
                          onClick={() => setIsModalOpenCodes(true)}
                          type="button"
                          size="sm"
                          className="hover:bg-blue-700 bg-blue-600 w-full md:w-auto"
                        >
                          Escanear códigos
                        </Button>

                        <CodesModal
                          isOpen={isModalOpenCodes}
                          onClose={() => setIsModalOpenCodes(false)}
                          onAddCodes={handleAddMultiCodes}
                        />
                        {fields.length > 1 && (
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="text-red-600 hover:bg-red-50 hover:text-red-700 flex-1 md:border md:rounded w-full md:w-auto p-2"
                            onClick={() => remove(index)}
                          >
                            <Trash2 className="h-4 w-4 md:block" />
                            <p>Eliminar</p>
                          </Button>
                        )}
                      </div>
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
                            <Input
                              placeholder="ej: WATER-CIELO-1L"
                              {...field}
                            />
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
                            <Select
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                            >
                              <SelectTrigger id={`unit-${item.id}`} className='w-full'>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="unidades">
                                  unidades
                                </SelectItem>
                                <SelectItem value="cajas">cajas</SelectItem>
                                <SelectItem value="paquetes">
                                  paquetes
                                </SelectItem>
                                <SelectItem value="litros">litros</SelectItem>
                                <SelectItem value="kilogramos">
                                  kilogramos
                                </SelectItem>
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
                            <Input type="number" step="0.01" {...field} />
                          )}
                        />
                      </div>
                    </div>
                  </div>
                ))}

                <Button
                  type="button"
                  variant="ghost"
                  className="text-blue-600 hover:text-blue-700"
                  onClick={() => append(initialProducts)}
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Agregar Item
                </Button>
              </CollapsibleContent>
            </Collapsible>
          </div>

          {/* 🎯 Botones de Acción del Formulario */}
          <div className="mt-8 flex justify-end gap-3 md:flex-row flex-col">
            <Button
              type="submit"
              className="bg-blue-600 text-white hover:bg-blue-700"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  {/* Spinner de carga */}
                  <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  {loadingButtonText}
                </>
              ) : (
                submitButtonText
              )}
            </Button>
            <Button
              type="button"
              variant="secondary"
              className="bg-gray-400 text-white hover:bg-gray-500"
              onClick={handleCancel}
              disabled={isLoading}
            >
              Cancelar
            </Button>
          </div>
        </form>
      </div>

      {/* 📷 Modal del Escáner de Códigos de Barras */}
      <QrScannerModal
        isOpen={qrScannerOpen}
        title="Escanear Código de Barras"
        description="Apunta la cámara hacia el código de barras del producto"
        onScanSuccess={handleNewScanResult}
        onScanError={(errorMessage) => {
          // Solo loguear errores reales, ignorar "NotFoundException"
          if (!errorMessage.includes('NotFoundException')) {
            console.error('Error de escaneo:', errorMessage);
          }
        }}
        onClose={() => setQrScannerOpen(false)}
      />
    </div>
  );
}

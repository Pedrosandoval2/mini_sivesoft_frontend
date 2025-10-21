import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Controller, useForm } from 'react-hook-form';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  useCreateProduct,
  useUpdateProduct,
} from '@/hooks/mutations/useProductMutations';

export default function NewProductPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const product = location.state?.product;
  const isEditing = !!product;

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    control,
  } = useForm({
    defaultValues: {
      name: '',
      unit: 'unidades',
      barcode: '',
      price: '',
    },
  });

  const createProductMutation = useCreateProduct();
  const updateProductMutation = useUpdateProduct();

  useEffect(() => {
    if (product) {
      reset({
        name: product.name || '',
        unit: product.unit || 'unidades',
        barcode: product.barcode || '',
        price: product.price || '',
      });
    }
  }, [product, reset]);

  const onSubmit = async (data) => {
    try {
      const productData = {
        name: data.name,
        unit: data.unit,
        barcode: data.barcode,
        price: Number.parseFloat(data.price),
      };

      if (isEditing) {
        await updateProductMutation.mutateAsync({
          id: product.id,
          data: productData,
        });
      } else {
        await createProductMutation.mutateAsync(productData);
      }

      navigate('/products');
    } catch (error) {
      console.error('Error submitting product:', error);
    }
  };

  const isLoading =
    createProductMutation.isPending || updateProductMutation.isPending;

  const getButtonText = () => {
    if (isLoading) return 'Guardando...';
    if (isEditing) return 'Actualizar Producto';
    return 'Guardar Producto';
  };

  return (
    <div className="p-6 space-y-6 max-w-2xl mx-auto">
      <div className="flex items-center gap-4 ">
        <Button variant="ghost" onClick={() => navigate('/products')}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-2xl font-semibold">Volver a productos</h1>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-3xl font-bold">
            {isEditing ? 'Editar Producto' : 'Nuevo Producto'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Nombre */}
              <div className="space-y-2">
                <Label htmlFor="name">
                  Nombre <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="name"
                  placeholder="Ej: Laptop HP"
                  {...register('name', {
                    required: 'El nombre es requerido',
                  })}
                  className={errors.name ? 'border-red-500' : ''}
                />
                {errors.name && (
                  <p className="text-sm text-red-500">{errors.name.message}</p>
                )}
              </div>

              {/* Unidad */}
              <div className="space-y-2">
                <Controller
                  name="unit"
                  control={control}
                  render={({ field }) => (
                    <div className="space-y-2">
                      <Label htmlFor="unit">
                        Unidad <span className="text-red-500">*</span>
                      </Label>
                      <Select
                        value={field.value.toString()}
                        onValueChange={field.onChange}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Selecciona una unidad" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="unidades">Unidades</SelectItem>
                          <SelectItem value="cajas">Cajas</SelectItem>
                          <SelectItem value="paquetes">Paquetes</SelectItem>
                          <SelectItem value="litros">Litros</SelectItem>
                          <SelectItem value="kilogramos">Kilogramos</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  )}
                />
              </div>

              {/* Código de Barras */}
              <div className="space-y-2">
                <Label htmlFor="barcode">
                  Código de Barras <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="barcode"
                  placeholder="Ej: 7501234567890"
                  {...register('barcode', {
                    required: 'El código de barras es requerido',
                  })}
                  className={errors.barcode ? 'border-red-500' : ''}
                />
                {errors.barcode && (
                  <p className="text-sm text-red-500">
                    {errors.barcode.message}
                  </p>
                )}
              </div>

              {/* Precio */}
              <div className="space-y-2">
                <Label htmlFor="price">
                  Precio <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="price"
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  {...register('price', {
                    required: 'El precio es requerido',
                    min: {
                      value: 0,
                      message: 'El precio debe ser mayor o igual a 0',
                    },
                  })}
                  className={errors.price ? 'border-red-500' : ''}
                />
                {errors.price && (
                  <p className="text-sm text-red-500">{errors.price.message}</p>
                )}
              </div>
            </div>

            {/* Botones */}
            <div className="flex justify-end gap-4 md:flex-row flex-col">
              <Button type="submit" disabled={isLoading} className="flex-1">
                {getButtonText()}
              </Button>
              <Button
                type="button"
                variant="outline"
                className="flex-1"
                onClick={() => navigate('/products')}
                disabled={isLoading}
              >
                Cancelar
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

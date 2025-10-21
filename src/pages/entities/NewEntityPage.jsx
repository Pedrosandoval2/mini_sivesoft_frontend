import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  useCreateEntity,
  useUpdateEntity,
} from '@/hooks/mutations/useEntityMutations';
import { ArrowLeft } from 'lucide-react';
import React, { useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useNavigate, useLocation } from 'react-router-dom';

const validateDocLengthNumber = (value) => {
  switch (value) {
    case 'DNI':
      return 8;
    case 'RUC':
      return 11;
    case 'CE':
      return 12;
    case 'Pasaporte':
      return 12;
    default:
      return 8;
  }
};

export default function NewEntityPage() {
  const navigation = useNavigate();
  const location = useLocation();
  const { entity } = location.state || {};

  // ✨ Usar mutations de React Query
  const createMutation = useCreateEntity();
  const updateMutation = useUpdateEntity();

  const {
    register,
    handleSubmit,
    control,
    watch,
    formState: { errors },
    clearErrors,
  } = useForm({
    defaultValues: entity || {
      name: '',
      docType: 'DNI',
      docNumber: '',
      address: '',
      phone: '',
    },
    mode: 'onChange',
  });

  const whatchedDocType = watch('docType');

  useEffect(() => {
    // Cuando cambie el tipo de documento, limpiamos los errores relacionados
    clearErrors(['docType', 'docNumber']);
  }, [whatchedDocType, clearErrors]);

  const onSubmit = async (data) => {
    const body = {
      name: data.name,
      docType: data.docType,
      docNumber: data.docNumber,
      address: data.address,
      phone: data.phone,
    };

    try {
      if (entity) {
        // Actualizar entidad existente
        await updateMutation.mutateAsync({ id: entity.id, data: body });
      } else {
        // Crear nueva entidad
        await createMutation.mutateAsync(body);
      }
      // Navegar después de éxito (los toast se manejan en el mutation)
      navigation('/entidades');
    } catch {
      // El error ya se maneja en el mutation
    }
  };

  // Determinar si está cargando alguna de las mutaciones
  const isLoading = createMutation.isPending || updateMutation.isPending;

  return (
    <div className=" bg-gray-50 md:p-6">
      <div className="mx-auto max-w-3xl">
        <div className="mb-6 flex items-center gap-4">
          <Button
            variant="ghost"
            onClick={() => navigation('/entidades')}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Volver a Almacenes
          </Button>
        </div>

        <div className="rounded-2xl bg-white p-8 shadow-sm">
          <h2 className="mb-6 text-2xl font-bold">
          {entity ? 'Editar Entitidad' : 'Nueva Entidad'}
          </h2>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name">
                Nombre <span className="text-red-500">*</span>
              </Label>
              <Input
                {...register('name', { required: true })}
                placeholder="Ingrese el nombre de la entidad"
              />
              {errors.name && (
                <p className="text-red-500 text-sm mt-1">
                  El nombre es obligatorio
                </p>
              )}
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="docType">
                  Tipo de Documento <span className="text-red-500">*</span>
                </Label>
                <Controller
                  control={control}
                  name="docType"
                  render={({ field }) => (
                    <Select
                      onValueChange={field.onChange}
                      value={field.value?.toString() ?? ''}
                    >
                      <SelectTrigger id="docType" className='w-full'>
                        <SelectValue placeholder="Seleccione tipo"/>
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="DNI">DNI</SelectItem>
                        <SelectItem value="RUC">RUC</SelectItem>
                        <SelectItem value="CE">
                          Carnet de Extranjería
                        </SelectItem>
                        <SelectItem value="Pasaporte">Pasaporte</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.docType && (
                  <p className="text-red-500 text-sm mt-1">
                    El tipo de documento es obligatorio
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="docNumber">
                  Número de Documento <span className="text-red-500">*</span>
                </Label>
                <Input
                  {...register('docNumber', {
                    required: true,
                    pattern: /^\d+$/,
                    maxLength: validateDocLengthNumber(whatchedDocType),
                  })}
                  placeholder="Ingrese el número"
                />
                {errors.docNumber?.type === 'required' && (
                  <p className="text-red-500 text-sm mt-1">
                    El número de documento es obligatorio
                  </p>
                )}
                {errors.docNumber?.type === 'pattern' && (
                  <p className="text-red-500 text-sm mt-1">
                    El número de documento debe ser numérico
                  </p>
                )}
                {errors.docNumber?.type === 'maxLength' && (
                  <p className="text-red-500 text-sm mt-1">
                    El número de documento debe tener{' '}
                    {validateDocLengthNumber(whatchedDocType)} dígitos
                  </p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="address">
                Dirección <span className="text-red-500">*</span>
              </Label>
              <Input
                {...register('address', { required: true })}
                placeholder="Ingrese la dirección completa"
              />
              {errors.address && (
                <p className="text-red-500 text-sm mt-1">
                  La dirección es obligatoria
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">
                Teléfono <span className="text-red-500">*</span>
              </Label>
              <Input
                {...register('phone', { required: true })}
                placeholder="Ingrese el número de teléfono"
              />
              {errors.phone && (
                <p className="text-red-500 text-sm mt-1">
                  El teléfono es obligatorio
                </p>
              )}
            </div>

            <div className="flex gap-3 pt-4 md:flex-row flex-col">
              <Button
                type="submit"
                className="flex-1 bg-black text-white hover:bg-gray-800"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    {entity ? 'Actualizando...' : 'Guardando...'}
                  </>
                ) : entity ? (
                  'Actualizar Entidad'
                ) : (
                  'Guardar Entidad'
                )}
              </Button>
              <Button
                type="button"
                variant="outline"
                className="flex-1 bg-transparent"
                onClick={() => navigation('/entidades')}
                disabled={isLoading}
              >
                Cancelar
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

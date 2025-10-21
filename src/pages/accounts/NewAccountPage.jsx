import { useNavigate, useLocation } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import { ArrowLeft, Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Card,
  CardContent,
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
import { Checkbox } from '@/components/ui/checkbox';
import {
  useCreateAccount,
  useUpdateAccount,
} from '@/hooks/mutations/useAccountMutations';
import { useEntities } from '@/hooks/queries/useEntities';
import { useWarehouses } from '@/hooks/queries/useWarehouses';
import { useUserStore } from '@/store/userStore';
import { useState, useEffect } from 'react';

/**
 * Página para crear cuentas de usuario
 *
 * Funcionalidades:
 * - Crear cuenta con username, password, rol
 * - Asignar automáticamente la empresa actual del usuario (tenantIds)
 * - Seleccionar entidad relacionada (entityRelationId - opcional)
 * - Asignar múltiples almacenes (warehouseIds)
 * - Validación de formularios con React Hook Form
 */
export default function NewAccountPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { account } = location.state || {};

  const [showPassword, setShowPassword] = useState(false);
  const [selectedWarehouses, setSelectedWarehouses] = useState([]);

  // Obtener tenant actual del usuario autenticado
  const currentTenant = useUserStore((state) => state.user?.tenantId);

  // React Query: Obtener entidades y almacenes
  const { data: entitiesData, isLoading: entitiesLoading } = useEntities({
    page: 1,
    limit: 100,
    search: '',
    onlyUnassigned: true,
  });

  const { data: warehousesData, isLoading: warehousesLoading } = useWarehouses({
    page: 1,
    limit: 100,
    search: '',
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
    reset,
  } = useForm({
    defaultValues: {
      username: '',
      password: '',
      role: 'user',
      entityRelationId: '',
    },
  });

  const createAccountMutation = useCreateAccount();
  const updateAccountMutation = useUpdateAccount();

  // Cargar datos del usuario a editar
  useEffect(() => {
    if (account) {
      // Obtener el entityRelationId ya sea del campo directo o del objeto entityRelation
      const entityId =
        account.entityRelation?.id || account.entityRelationId || '';

      reset({
        username: account.username || '',
        password: '', // No pre-cargar contraseña por seguridad
        role: account.role || 'user',
        entityRelationId: entityId ? String(entityId) : '',
      });

      // Cargar almacenes seleccionados
      const warehouseIds = account.warehouses?.map((w) => w.id) || [];
      setSelectedWarehouses(warehouseIds);
    }
  }, [account, reset]);

  /**
   * Toggle selección de almacén
   */
  const toggleWarehouse = (warehouseId) => {
    setSelectedWarehouses((prev) => {
      if (prev.includes(warehouseId)) {
        return prev.filter((id) => id !== warehouseId);
      } else {
        return [...prev, warehouseId];
      }
    });
  };

  /**
   * Enviar formulario
   */
  const onSubmit = async (data) => {
    try {
      const accountData = {
        username: data.username,
        role: data.role,
        tenantIds: account ? account.tenantIds : [currentTenant], // Mantener tenants en edición
        entityRelationId: Number(data.entityRelationId) || null,
        warehouseIds: selectedWarehouses,
      };

      // Solo incluir password si hay valor (crear o actualizar contraseña)
      if (data.password) {
        accountData.password = data.password;
      }

      if (account) {
        // Actualizar cuenta existente
        await updateAccountMutation.mutateAsync({
          id: account.id,
          data: accountData,
        });
      } else {
        // Crear nueva cuenta
        await createAccountMutation.mutateAsync(accountData);
      }

      navigate('/accounts');
    } catch (error) {
      console.error('Error submitting account:', error);
    }
  };

  const isLoading =
    createAccountMutation.isPending || updateAccountMutation.isPending;
  const isEditMode = Boolean(account);

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" onClick={() => navigate('/warehouses')}>
          <ArrowLeft className="h-4 w-4 mr-2" />
        </Button>
        <div>
          <h1 className="text-lg font-semibold">Volver a las cuentas</h1>
        </div>
      </div>

      {/* Formulario */}
      <Card>
        <CardHeader>
          <CardTitle className="text-3xl font-bold">
            {account ? 'Actualizar cuenta' : 'Nueva cuenta'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Username */}
              <div className="space-y-2">
                <Label htmlFor="username">
                  Nombre de Usuario <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="username"
                  placeholder="Ej: pedro_almacenista"
                  {...register('username', {
                    required: 'El nombre de usuario es requerido',
                    minLength: {
                      value: 3,
                      message: 'Mínimo 3 caracteres',
                    },
                  })}
                  className={errors.username ? 'border-red-500' : ''}
                />
                {errors.username && (
                  <p className="text-sm text-red-500">
                    {errors.username.message}
                  </p>
                )}
              </div>

              {/* Password */}
              <div className="space-y-2">
                <Label htmlFor="password">
                  Contraseña{' '}
                  {!isEditMode && <span className="text-red-500">*</span>}
                  {isEditMode && (
                    <span className="text-sm text-gray-500 ml-1">
                      (opcional - dejar vacío para mantener la actual)
                    </span>
                  )}
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder={
                      isEditMode
                        ? 'Dejar vacío para no cambiar'
                        : 'Ingresa una contraseña'
                    }
                    {...register('password', {
                      required: isEditMode
                        ? false
                        : 'La contraseña es requerida',
                      minLength: {
                        value: 6,
                        message: 'Mínimo 6 caracteres',
                      },
                    })}
                    className={
                      errors.password ? 'border-red-500 pr-10' : 'pr-10'
                    }
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
                  <p className="text-sm text-red-500">
                    {errors.password.message}
                  </p>
                )}
              </div>

              {/* Rol */}
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
                        value={field.value.toString()}
                        onValueChange={field.onChange}
                      >
                        <SelectTrigger
                          className={errors.role ? 'border-red-500' : '' + 'w-full'}
                        >
                          <SelectValue placeholder="Selecciona un rol" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="user">Usuario</SelectItem>
                          <SelectItem value="manager">Manager</SelectItem>
                        </SelectContent>
                      </Select>
                      {errors.role && (
                        <p className="text-sm text-red-500">
                          {errors.role.message}
                        </p>
                      )}
                    </div>
                  )}
                />
              </div>

              {/* Entity Relation ID */}
              <div className="space-y-2">
                <Controller
                  name="entityRelationId"
                  control={control}
                  render={({ field }) => (
                    <div className="space-y-2">
                      <Label htmlFor="entityRelationId">
                        Entidad Relacionada{' '}
                        <span className="text-gray-500 text-xs">
                          (Opcional)
                        </span>
                      </Label>
                      <Select
                        value={field.value.toString() || undefined}
                        onValueChange={field.onChange}
                      >
                        <SelectTrigger className='w-full'>
                          <SelectValue placeholder="Selecciona una entidad o deja vacío" />
                        </SelectTrigger>
                        <SelectContent>
                          {entitiesLoading ? (
                            <div className="p-2 text-sm text-gray-500">
                              Cargando...
                            </div>
                          ) : entitiesData?.data?.length > 0 ? (
                            entitiesData.data.map((entity) => (
                              <SelectItem
                                key={entity.id}
                                value={String(entity.id)}
                              >
                                {entity.name}
                              </SelectItem>
                            ))
                          ) : (
                            <div className="p-2 text-sm text-gray-500">
                              No hay entidades disponibles
                            </div>
                          )}
                        </SelectContent>
                      </Select>
                    </div>
                  )}
                />
              </div>
            </div>

            {/* Almacenes Asignados */}
            <div className="space-y-3">
              <Label>
                Almacenes Asignados{' '}
                <span className="text-gray-500 text-xs">
                  (Selecciona al menos uno)
                </span>
              </Label>
              <Card className="p-4">
                {warehousesLoading ? (
                  <p className="text-gray-500">Cargando almacenes...</p>
                ) : warehousesData?.data?.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    {warehousesData.data.map((warehouse) => (
                      <div
                        key={warehouse.id}
                        className="flex items-center space-x-2"
                      >
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

            {/* Botones de Acción */}
            <div className="flex gap-4 pt-4 md:flex-row flex-col">
              <Button
                type="submit"
                className='flex-1'
                disabled={isLoading || selectedWarehouses.length === 0}
              >
                {(() => {
                  if (isLoading) {
                    return isEditMode ? 'Actualizando...' : 'Creando...';
                  }
                  return isEditMode ? 'Actualizar Cuenta' : 'Crear Cuenta';
                })()}
              </Button>
              <Button
                type="button"
                variant="outline"
                className='flex-1'
                onClick={() => navigate(-1)}
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

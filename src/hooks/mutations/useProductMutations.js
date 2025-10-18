import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createProduct } from '@/services/products/createProduct';
import { updateProduct } from '@/services/products/updateProduct';
import { deleteProduct } from '@/services/products/deleteProduct';
import { toast } from 'react-toastify';

/**
 * Hook para crear un nuevo producto
 */
export const useCreateProduct = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: createProduct,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['products'] });
            toast.success('Producto creado exitosamente');
        },
        onError: (error) => {
            console.error('Error creating product:', error);
            const errorMessage = error?.response?.data?.message || error?.message || 'Error al crear el producto';
            toast.error(errorMessage);
        }
    });
};

/**
 * Hook para actualizar un producto existente
 */
export const useUpdateProduct = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, data }) => updateProduct(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['products'] });
            toast.success('Producto actualizado exitosamente');
        },
        onError: (error) => {
            console.error('Error updating product:', error);
            const errorMessage = error?.response?.data?.message || error?.message || 'Error al actualizar el producto';
            toast.error(errorMessage);
        }
    });
};

/**
 * Hook para eliminar un producto
 */
export const useDeleteProduct = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: deleteProduct,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['products'] });
            toast.success('Producto eliminado exitosamente');
        },
        onError: (error) => {
            console.error('Error deleting product:', error);
            const errorMessage = error?.response?.data?.message || error?.message || 'Error al eliminar el producto';
            toast.error(errorMessage);
        }
    });
};

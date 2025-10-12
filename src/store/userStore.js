import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export const useUserStore = create(persist((set) => ({
    user: null,
    
    // Establecer usuario completo (incluyendo token)
    setUser: (newUser) => set({ user: newUser }),
    
    // Actualizar solo el token
    updateToken: (newToken) => set((state) => ({
        user: state.user ? { ...state.user, token: newToken } : null
    })),
    
    // Limpiar usuario y token
    clearUser: () => {
        set({ user: null });
        // Asegurar que se limpia el localStorage
        localStorage.removeItem('user-storage');
    },
}), {
    name: 'user-storage',
    getStorage: () => localStorage,
}))
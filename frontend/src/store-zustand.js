import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { v4 as uuidv4 } from 'uuid';

const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      refreshToken: null,
      anonUserId: localStorage.getItem('anonUserId') || uuidv4(),  // Genera un ID si no existe

      login: (user, token, refreshToken) => set({ 
        user: {
          id: user.id,
          username: user.username,
        }, 
        token,
        refreshToken
      }),

      logout: () => {
        set({ user: null, token: null, refreshToken: null });
        localStorage.removeItem('auth-storage');
        // Persistir el anonUserId en el logout
        const anonUserId = get().anonUserId;
        if (anonUserId) {
          localStorage.setItem('anonUserId', anonUserId);
        }
        window.location.reload(); // Para asegurar que el estado del usuario anónimo se recarga correctamente
      },

      setAnonUserId: (anonUserId) => {
        set({ anonUserId });
        localStorage.setItem('anonUserId', anonUserId); 
      },

      setToken: (token) => set({ token }),

    }),
    {
      name: 'auth-storage', // Nombre para almacenar en localStorage
      getStorage: () => localStorage,
    }
  )
);

export default useAuthStore;







/*import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { v4 as uuidv4 } from 'uuid';

const useAuthStore = create(
  persist(
    (set) => ({
      user: null,
      token: null,
      refreshToken: null,
      anonUserId: localStorage.getItem('anonUserId') || uuidv4(),

      login: (user, token, refreshToken) => set({
        user: {
          id: user.id,
          username: user.username,
        },
        token,
        refreshToken
      }),

      /*logout: () => {
        const anonUserId = uuidv4();
        set({ user: null, token: null, refreshToken: null, anonUserId });
        localStorage.setItem('anonUserId', anonUserId);
        window.location.reload();
      },*/
      
/*      logout: () => {
        set({ user: null, token: null, refreshToken: null});
        localStorage.removeItem('auth-storage');

        window.location.reload();
      },

      setAnonUserId: (anonUserId) => {
        set({ anonUserId });
        localStorage.setItem('anonUserId', anonUserId);
      },

      setToken: (token) => set({ token }),

    }),

    {
      name: 'auth-storage', 
      getStorage: () => localStorage,
    }

  )
);

export default useAuthStore;*/
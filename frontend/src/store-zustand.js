import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useAuthStore = create(
  persist(
    (set) => ({
      user: null,
      token: null,
      login: (user, token) => set({ user, token }),
      logout: () => {
        set({ user: null, token: null });
        localStorage.removeItem('refreshToken');
      },
    }),
    {
      name: 'auth-storage', // NAME FOR STORING AT LOCALSTORAGE
      getStorage: () => localStorage,
    }
  )
);

export default useAuthStore;
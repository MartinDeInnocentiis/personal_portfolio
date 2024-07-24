import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useAuthStore = create(
  persist(
    (set) => ({
      user: null,
      token: null,
      refreshToken: null,
      login: (user, token, refreshToken) => set({ 
        user: {
          id: user.id,
          username: user.username,
        }, 
        token,
        refreshToken
      }),
      logout: () => {
        set({ user: null, token: null, refreshToken: null});
        localStorage.removeItem('refreshToken');
      },
      setToken: (token) => set({ token }),
    }),
    {
      name: 'auth-storage', // NAME FOR STORING AT localStorage
      getStorage: () => localStorage,
    }
  )
);

export default useAuthStore;
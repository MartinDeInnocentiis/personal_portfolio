import { create } from 'zustand';
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

      logout: () => {
        set({ user: null, token: null, refreshToken: null});
        localStorage.removeItem('auth-storage');
      },

      setAnonUserId: (anonUserId) => {
        set({ anonUserId });
        localStorage.setItem('anonUserId', anonUserId); 
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
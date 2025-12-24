import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { signIn, signUp, signOut, getCurrentUser, fetchUserAttributes } from 'aws-amplify/auth';

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'ADMIN' | 'USER';
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  logout: () => Promise<void>;
  initSession: () => Promise<void>; // เปลี่ยนชื่อจาก checkSession เป็น initSession ให้ตรงกับ App.tsx
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      login: async (email, password) => {
        set({ isLoading: true, error: null });
        try {
          const { isSignedIn } = await signIn({ username: email, password });
          if (isSignedIn) {
            const user = await getCurrentUser();
            const attributes = await fetchUserAttributes();
            set({
              user: {
                id: user.userId,
                email: attributes.email || email,
                name: attributes.name || email,
                role: (attributes['custom:role'] as any) === 'ADMIN' ? 'ADMIN' : 'USER',
              },
              isAuthenticated: true,
            });
          }
        } catch (error: any) {
          set({ error: error.message || 'Login failed' });
          throw error;
        } finally {
          set({ isLoading: false });
        }
      },

      register: async (email, password, name) => {
        set({ isLoading: true, error: null });
        try {
          await signUp({
            username: email,
            password,
            options: {
              userAttributes: { email, name },
            },
          });
        } catch (error: any) {
          set({ error: error.message || 'Registration failed' });
          throw error;
        } finally {
          set({ isLoading: false });
        }
      },

      logout: async () => {
        try {
          await signOut();
          set({ user: null, isAuthenticated: false });
          localStorage.removeItem('auth-storage');
        } catch (error) {
          console.error('Logout error:', error);
        }
      },

      initSession: async () => {
        try {
          const user = await getCurrentUser();
          const attributes = await fetchUserAttributes();
          set({
            user: {
              id: user.userId,
              email: attributes.email || '',
              name: attributes.name || '',
              role: (attributes['custom:role'] as any) === 'ADMIN' ? 'ADMIN' : 'USER',
            },
            isAuthenticated: true,
          });
        } catch (error) {
          set({ user: null, isAuthenticated: false });
        }
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ 
        user: state.user, 
        isAuthenticated: state.isAuthenticated 
      }),
    }
  )
);
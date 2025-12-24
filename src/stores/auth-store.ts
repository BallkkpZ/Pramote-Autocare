import { create } from 'zustand';
import { AuthSession } from '@/types';
import { setAuthToken } from '@/api/client';

const SESSION_KEY = 'autocare_session_v1';

interface AuthState {
  session: AuthSession | null;
  isLoading: boolean;
  setSession: (session: AuthSession | null) => void;
  logout: () => void;
  initSession: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  session: null,
  isLoading: true,

  setSession: (session) => {
    if (session) {
      localStorage.setItem(SESSION_KEY, JSON.stringify(session));
      setAuthToken(session.accessToken);
    } else {
      localStorage.removeItem(SESSION_KEY);
      setAuthToken(null);
    }
    set({ session, isLoading: false });
  },

  logout: () => {
    localStorage.removeItem(SESSION_KEY);
    setAuthToken(null);
    set({ session: null });
  },

  initSession: () => {
    try {
      const stored = localStorage.getItem(SESSION_KEY);
      if (stored) {
        const session: AuthSession = JSON.parse(stored);
        setAuthToken(session.accessToken);
        set({ session, isLoading: false });
      } else {
        set({ isLoading: false });
      }
    } catch (error) {
      console.error('Failed to init session:', error);
      set({ isLoading: false });
    }
  },
}));

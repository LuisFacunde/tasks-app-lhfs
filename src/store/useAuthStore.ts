import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const baseURL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:5000';

export interface User {
  id: number;
  email: string;
}

interface AuthState {
  token: string | null;
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<string | null>;
  signup: (email: string, password: string) => Promise<string | null>;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      user: null,
      loading: false,

      login: async (email, password) => {
        set({ loading: true });
        try {
          const response = await axios.post<{ token: string; user: User }>(
            `${baseURL}/api/auth/login`,
            { email, password }
          );
          const { token, user } = response.data;
          set({ token, user, loading: false });
          return null; // Retorna null indicando sucesso
        } catch (error: any) {
          set({ loading: false });
          console.error('Erro de login:', error?.response?.data || error.message);
          return error?.response?.data?.error || 'Erro ao realizar login. Verifique suas credenciais.';
        }
      },

      signup: async (email, password) => {
        set({ loading: true });
        try {
          const response = await axios.post<{ token: string; user: User }>(
            `${baseURL}/api/auth/signup`,
            { email, password }
          );
          const { token, user } = response.data;
          set({ token, user, loading: false });
          return null; // Retorna null indicando sucesso
        } catch (error: any) {
          set({ loading: false });
          console.error('Erro de cadastro:', error?.response?.data || error.message);
          return error?.response?.data?.error || 'Erro ao criar conta. Tente novamente.';
        }
      },

      logout: () => {
        set({ token: null, user: null });
      },
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);

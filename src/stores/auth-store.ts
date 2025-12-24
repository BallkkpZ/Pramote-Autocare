import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { signIn, signUp, signOut, getCurrentUser, fetchUserAttributes } from 'aws-amplify/auth';

// กำหนดหน้าตาข้อมูล User
export interface User {
  id: string;
  email: string;
  name: string;
  role: 'ADMIN' | 'USER';
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  logout: () => Promise<void>;
  checkSession: () => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      // ฟังก์ชั่น Login จริงผ่าน AWS Cognito
      login: async (email, password) => {
        set({ isLoading: true, error: null });
        try {
          // 1. ส่งข้อมูลไป Login ที่ AWS
          const { isSignedIn, nextStep } = await signIn({ username: email, password });
          
          if (isSignedIn) {
            // 2. ถ้าผ่าน ดึงข้อมูล User มาเก็บ
            const user = await getCurrentUser();
            const attributes = await fetchUserAttributes();
            
            // 3. อัปเดตสถานะในเว็บ
            set({
              user: {
                id: user.userId,
                email: attributes.email || email,
                name: attributes.name || email, // ถ้าไม่มีชื่อ ใช้อีเมลแทน
                role: 'USER', // ค่าเริ่มต้นเป็น User ธรรมดา
              },
              isAuthenticated: true,
              token: 'aws-jwt-token', // Dummy token for now
            });
            console.log("Login Success via AWS!");
          } else {
             console.log("Login Next Step:", nextStep);
          }
        } catch (error: any) {
          console.error('Login Failed:', error);
          set({ error: error.message || 'Login failed' });
          throw error;
        } finally {
          set({ isLoading: false });
        }
      },

      // ฟังก์ชั่น Register จริงผ่าน AWS Cognito
      register: async (email, password, name) => {
        set({ isLoading: true, error: null });
        try {
          await signUp({
            username: email,
            password,
            options: {
              userAttributes: {
                email,
                name, // บันทึกชื่อลง AWS
              },
            },
          });
          // สมัครเสร็จแล้วให้ไปหน้า Login (หรือรอ Verify Email)
        } catch (error: any) {
          console.error('Register Failed:', error);
          set({ error: error.message || 'Registration failed' });
          throw error;
        } finally {
          set({ isLoading: false });
        }
      },

      // ฟังก์ชั่น Logout จริง
      logout: async () => {
        try {
          await signOut();
          set({ user: null, token: null, isAuthenticated: false });
          localStorage.clear(); // ล้างข้อมูลเก่าให้หมด
        } catch (error) {
          console.error('Logout error:', error);
        }
      },

      // เช็คว่าเคย Login ค้างไว้ไหม (เช่น ตอนกด Refresh หน้าจอ)
      checkSession: async () => {
        try {
          const user = await getCurrentUser();
          const attributes = await fetchUserAttributes();
          set({
            user: {
              id: user.userId,
              email: attributes.email || '',
              name: attributes.name || '',
              role: 'USER',
            },
            isAuthenticated: true,
          });
        } catch (error) {
          // ถ้าเช็คไม่ผ่าน แปลว่า Session หมดอายุ
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
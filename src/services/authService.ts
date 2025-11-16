import { api } from '@/lib/api'; 
import { LoginRequest, LoginResponse, VerifyEmailResponse } from '@/models/auth'; 

const USER_KEY = 'user';
const TOKEN_KEY = 'token';

export const authService = {
  /**
   * Login user dan simpan data ke local storage
   */
  async login(data: LoginRequest): Promise<LoginResponse> {
    const response = await api.post('/auth/login', data);
    const result = response.data as LoginResponse;

    // --- INI PERBAIKANNYA ---
    // Cek properti yang benar (nama, role, token) yang dikirim dari Go
    if (result.token && result.nama && result.role) {
      
      // 1. Simpan token
      localStorage.setItem(TOKEN_KEY, result.token);

      // 2. Buat objek user yang akan disimpan
      const userPayload = {
        nama: result.nama,
        role: result.role,
        email: data.email, // Ambil email dari data login
        no_pendaftaran: result.no_pendaftaran,
      };
      
      // 3. Simpan user
      localStorage.setItem(USER_KEY, JSON.stringify(userPayload));
    } else {
      // Jika backend tidak mengirim data yang diharapkan
      throw new Error("Respons login tidak valid dari server.");
    }
    
    return result;
  },

  /**
   * Hapus data dari local storage
   */
  logout() {
    localStorage.removeItem(USER_KEY);
    localStorage.removeItem(TOKEN_KEY);
  },

  /**
   * Cek apakah token ada dan valid
   */
  isAuthenticated(): boolean {
    const token = localStorage.getItem(TOKEN_KEY);
    if (!token) {
      return false;
    }
    return true;
  },

  /**
   * Ambil token dari local storage
   */
  getToken(): string | null {
    return localStorage.getItem(TOKEN_KEY);
  },

  /**
   * Ambil data user dari local storage
   */
  getUser() {
    const userStr = localStorage.getItem(USER_KEY);
    return userStr ? JSON.parse(userStr) : null;
  },


  /**
   * Mengirim token verifikasi ke backend.
   * (Memanggil POST /api/auth/verify-email)
   */
  async verifyEmail(token: string): Promise<VerifyEmailResponse> {
    try {
      const response = await api.post('/auth/verify-email', { token });
      return response.data;
    } catch (error) {
      console.error('Email verification failed:', error);
      throw error; 
    }
  },

  async forgotPassword(email: string): Promise<{ message: string }> {
    try {
      const response = await api.post('/auth/forgot-password', { email });
      return response.data;
    } catch (error) {
      console.error('Forgot password request failed:', error);
      throw error;
    }
  },
};  
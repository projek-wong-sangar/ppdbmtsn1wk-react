import { api } from '@/lib/api';

export interface LoginData {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  nama: string;
  nisn: string;
}

export interface User {
  id: string;
  email: string;
  nama: string;
  role: 'siswa' | 'admin';
}

export const authService = {
  async login(data: LoginData): Promise<{ token: string; user: User }> {
    const response = await api.post('/auth/login', data);
    const { token, nama, email, role } = response.data;
    const normalizedEmail = email || data.email; // ensure email is present
    const user: User = { id: '', nama, email: normalizedEmail, role };
    // Add id if provided
    if (response.data.id) user.id = response.data.id;
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
    return { token, user };
  },

  async register(data: RegisterData): Promise<{ message: string }> {
    // Fallback, BE belum ada endpoint
    return { message: 'Registrasi belum tersedia di backend.' };
    // Jika sudah ada, aktifkan berikut:
    // const response = await api.post('/auth/register', data);
    // return response.data;
  },

  async getMe(): Promise<User> {
    // Fallback localStorage, BE belum ada endpoint getMe
    const userStr = localStorage.getItem('user');
    if (!userStr) throw new Error('Not authenticated');
    return JSON.parse(userStr);
    // Jika sudah ada:
    // const response = await api.get('/auth/me');
    // return response.data;
  },

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  isAuthenticated(): boolean {
    return !!localStorage.getItem('token');
  },

  getToken(): string | null {
    return localStorage.getItem('token');
  },
};

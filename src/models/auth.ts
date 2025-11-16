
export interface LoginRequest {
    email: string;
    password: string;
  }
  
  export interface LoginResponse {
    message: string;
    nama: string;
    role: 'siswa' | 'admin' | 'superadmin';
    token: string;
    no_pendaftaran?: string;
  }
  
  export interface VerifyEmailResponse {
    message: string;
    password: string;
    email: string;
  }
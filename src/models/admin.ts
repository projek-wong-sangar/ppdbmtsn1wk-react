// src/models/admin.ts

// Sesuai dengan models.AdminCreateRequest di Go
export interface AdminCreateRequest {
    email: string;
    password: string;
    nama: string;
    role: 'admin' | 'superadmin';
  }
  
  // Sesuai dengan models.AdminUserResponse di Go
  export interface AdminUserResponse {
    id: string;
    email: string;
    nama: string;
    role: 'admin' | 'superadmin';
    created_at: string;
  }
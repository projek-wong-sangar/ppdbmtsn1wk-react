import api from '@/lib/api';
import { StatusPendaftaran } from './pendaftaranService';

export interface PendaftarDetail extends StatusPendaftaran {
  nisn: string;
  nik: string;
  tempat_lahir: string;
  tanggal_lahir: string;
  jenis_kelamin: string;
  agama: string;
  alamat: string;
  no_hp: string;
  email: string;
  asal_sekolah: string;
  nama_ayah: string;
  nama_ibu: string;
  berkas: {
    foto?: string;
    akta_kelahiran?: string;
    ijazah?: string;
    kartu_keluarga?: string;
    ktp_ortu?: string;
    surat_pernyataan?: string;
  };
}

export interface DashboardStats {
  total_pendaftar: number;
  pending: number;
  verified: number;
  rejected: number;
  accepted: number;
}

// Mock admin service
export const adminService = {
  async getDashboardStats(): Promise<DashboardStats> {
    await new Promise((resolve) => setTimeout(resolve, 500));
    
    return {
      total_pendaftar: 145,
      pending: 23,
      verified: 98,
      rejected: 12,
      accepted: 12,
    };
    
    // Real implementation:
    // const response = await api.get('/admin/stats');
    // return response.data;
  },

  async getPendaftarList(filters?: {
    status?: string;
    search?: string;
    page?: number;
    limit?: number;
  }): Promise<{ data: StatusPendaftaran[]; total: number }> {
    await new Promise((resolve) => setTimeout(resolve, 800));
    
    const mockData: StatusPendaftaran[] = [
      {
        id: '1',
        no_pendaftaran: 'PPDB2024001',
        nama: 'Ahmad Fauzi',
        status: 'pending',
        tanggal_daftar: '2024-01-15T10:30:00',
      },
      {
        id: '2',
        no_pendaftaran: 'PPDB2024002',
        nama: 'Siti Nurhaliza',
        status: 'verified',
        tanggal_daftar: '2024-01-16T09:15:00',
      },
      {
        id: '3',
        no_pendaftaran: 'PPDB2024003',
        nama: 'Budi Santoso',
        status: 'accepted',
        tanggal_daftar: '2024-01-14T14:20:00',
      },
    ];
    
    return {
      data: mockData,
      total: mockData.length,
    };
    
    // Real implementation:
    // const response = await api.get('/admin/pendaftar', { params: filters });
    // return response.data;
  },

  async getPendaftarDetail(id: string): Promise<PendaftarDetail> {
    await new Promise((resolve) => setTimeout(resolve, 500));
    
    return {
      id,
      no_pendaftaran: 'PPDB2024001',
      nama: 'Ahmad Fauzi',
      nisn: '0123456789',
      nik: '3201234567890123',
      tempat_lahir: 'Bandar Lampung',
      tanggal_lahir: '2010-05-15',
      jenis_kelamin: 'L',
      agama: 'Islam',
      alamat: 'Jl. Lintas Sumatera, Blambangan Umpu, Kabupaten Way Kanan, Lampung.',
      no_hp: '081234567890',
      email: 'ahmad@example.com',
      asal_sekolah: 'SDN 1 Way Kanan',
      nama_ayah: 'Bapak Ahmad',
      nama_ibu: 'Ibu Siti',
      status: 'pending',
      tanggal_daftar: '2024-01-15T10:30:00',
      berkas: {
        foto: 'https://mock-storage.com/foto/ahmad.jpg',
        akta_kelahiran: 'https://mock-storage.com/akta/ahmad.pdf',
        ijazah: 'https://mock-storage.com/ijazah/ahmad.pdf',
        kartu_keluarga: 'https://mock-storage.com/kk/ahmad.pdf',
        ktp_ortu: 'https://mock-storage.com/ktp/ahmad.pdf',
        surat_pernyataan: 'https://mock-storage.com/surat/ahmad.pdf',
      },
    };
    
    // Real implementation:
    // const response = await api.get(`/admin/pendaftar/${id}`);
    // return response.data;
  },

  async verifikasiPendaftar(id: string, status: 'verified' | 'rejected', keterangan?: string): Promise<{ message: string }> {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    
    return {
      message: `Pendaftar berhasil ${status === 'verified' ? 'diverifikasi' : 'ditolak'}`,
    };
    
    // Real implementation:
    // const response = await api.put(`/admin/verifikasi/${id}`, { status, keterangan });
    // return response.data;
  },
};

import { api } from '@/lib/api';
import { StatusPendaftaran } from './pendaftaranService';

export interface AdminPendaftarSummary {
  no_pendaftaran: string;
  nama_lengkap: string;
  email: string;
  status: 'pending' | 'verified' | 'rejected' | 'accepted' | string;
  tanggal_daftar: string; // "YYYY-MM-DD HH:mm:ss"
  keterangan?: string;
}

export interface PendaftarDetail {
  no_pendaftaran: string;
  nama_lengkap: string;
  email: string;
  nisn: string;
  nik: string;
  tempat_lahir: string;
  tanggal_lahir: string;
  jenis_kelamin: string;
  agama: string;
  anak_ke: number;
  jumlah_saudara: number;
  alamat: string;
  rt: string;
  rw: string;
  desa: string;
  kecamatan: string;
  kabupaten: string;
  provinsi: string;
  kode_pos: string;
  no_hp: string;
  asal_sekolah: string;
  npsn_sekolah: string;
  alamat_sekolah: string;
  tahun_lulus: string;
  no_ijazah: string;
  nama_ayah: string;
  nama_ibu: string;
  nama_wali?: string | null;
  status: string;
  keterangan?: string | null;
  tanggal_daftar: string;
}

export interface DashboardStats {
  total_pendaftar: number;
  pending: number;
  in_review: number;
  verified: number;
  rejected: number;
  accepted: number;
}

export interface ReviewPendaftar {
  id: string;
  siswa_id?: string;
  status: string;
  in_review_by?: string;
  in_review_at?: string; // ISO string
}

export const adminService = {
  async getDashboardStats(): Promise<DashboardStats> {
    // GET /api/admin/pendaftar/summary
    // payload: { total, pending, verified, accepted, rejected, today, this_week }
    const response = await api.get('/admin/pendaftar/summary');
    const s = response.data as {
      total: number;
      pending: number;
      verified: number;
      accepted: number;
      rejected: number;
      today?: number;
      this_week?: number;
    };
    return {
      total_pendaftar: s.total ?? 0,
      pending: s.pending ?? 0,
      in_review: (s as any).in_review ?? 0,
      verified: s.verified ?? 0,
      rejected: s.rejected ?? 0,
      accepted: s.accepted ?? 0,
    };
  },

  async getPendaftarList(filters?: {
    status?: string;
    search?: string;
    page?: number;
    limit?: number;
  }): Promise<{ data: AdminPendaftarSummary[]; total: number }> {
    // Backend returns an array of summary rows (no pagination)
    const response = await api.get('/admin/pendaftar');
    const rows = (response.data || []) as AdminPendaftarSummary[];

    // Client-side filter
    let filtered = rows;
    if (filters?.status && filters.status !== 'all') {
      filtered = filtered.filter(r => String(r.status).toLowerCase() === String(filters.status).toLowerCase());
    }
    if (filters?.search) {
      const q = filters.search.toLowerCase();
      filtered = filtered.filter(r =>
        (r.no_pendaftaran || '').toLowerCase().includes(q) ||
        (r.nama_lengkap || '').toLowerCase().includes(q) ||
        (r.email || '').toLowerCase().includes(q)
      );
    }

    const total = filtered.length;
    const page = Math.max(1, filters?.page || 1);
    const limit = Math.max(1, filters?.limit || 10);
    const start = (page - 1) * limit;
    const end = start + limit;
    const paged = filtered.slice(start, end);

    return { data: paged, total };
  },

  async getPendaftarDetail(id: string): Promise<PendaftarDetail> {
    const response = await api.get(`/admin/pendaftar/${id}`);
    return response.data as PendaftarDetail;
  },

  async starReviewPendaftar(id: string): Promise<ReviewPendaftar> {
    const response = await api.post(`/admin/start-review/${id}`);
    return response.data as ReviewPendaftar;
  },

  async verifikasiPendaftar(id: string, status: 'verified' | 'rejected', keterangan?: string): Promise<{ message: string }> {
    const response = await api.put(`/admin/verifikasi/${id}`, { status, keterangan });
    return response.data;
  },

  async cancelReviewPendaftar(id: string): Promise<{ message: string }> {
    const response = await api.post(`/admin/cancel-review/${id}`);
    return response.data;
  },
};

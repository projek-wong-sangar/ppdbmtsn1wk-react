import { api } from '@/lib/api';

export interface PendaftaranData {
  // Step 1: Data Diri
  nisn: string;
  nik: string;
  nama_lengkap: string;
  tempat_lahir: string;
  tanggal_lahir: string;
  jenis_kelamin: 'L' | 'P';
  agama: string;
  anak_ke: number;
  jumlah_saudara: number;
  
  // Step 2: Alamat & Kontak
  alamat: string;
  rt: string;
  rw: string;
  desa: string;
  kecamatan: string;
  kabupaten: string;
  provinsi: string;
  kode_pos: string;
  no_hp: string;
  email: string;
  
  // Step 3: Data Asal Sekolah
  asal_sekolah: string;
  npsn_sekolah: string;
  alamat_sekolah: string;
  tahun_lulus: string;
  no_ijazah: string;
  
  // Step 4: Data Orang Tua
  nama_ayah: string;
  nik_ayah: string;
  pekerjaan_ayah: string;
  penghasilan_ayah: string;
  pendidikan_ayah: string;
  no_hp_ayah: string;
  
  nama_ibu: string;
  nik_ibu: string;
  pekerjaan_ibu: string;
  penghasilan_ibu: string;
  pendidikan_ibu: string;
  no_hp_ibu: string;
  
  nama_wali?: string;
  nik_wali?: string;
  pekerjaan_wali?: string;
  penghasilan_wali?: string;
  pendidikan_wali?: string;
  no_hp_wali?: string;
  hubungan_wali?: string;
  
  // Step 5: Upload Berkas (file paths/URLs)
  foto?: string;
  akta_kelahiran?: string;
  ijazah?: string;
  kartu_keluarga?: string;
  ktp_ortu?: string;
  surat_pernyataan?: string;
}

export interface StatusPendaftaran {
  id: string;
  no_pendaftaran: string;
  nama: string;
  status: 'pending' | 'verified' | 'rejected' | 'accepted';
  tanggal_daftar: string;
  keterangan?: string;
}

export const pendaftaranService = {
  async submitPendaftaran(data: PendaftaranData): Promise<{ message: string; no_pendaftaran: string }> {
    const response = await api.post('/siswa/pendaftaran', data);
    return response.data;
  },

  async getStatus(): Promise<StatusPendaftaran> {
    // Fallback jika BE blm ada endpoint /siswa/status
    return {
      id: '-',
      no_pendaftaran: '-',
      nama: '-',
      status: 'pending',
      tanggal_daftar: new Date().toISOString(),
      keterangan: 'Fitur status belum tersedia - tunggu backend.'
    };
    // Jika sudah ada:
    // const response = await api.get('/siswa/status');
    // return response.data;
  },

  async uploadFile(file: File, type: string): Promise<{ url: string }> {
    // Fallback - backend blm ada endpoint upload
    return {
      url: `https://mock-storage.com/${type}/${file.name}`,
    };
    // Jika sudah ada:
    // const formData = new FormData();
    // formData.append('file', file);
    // formData.append('type', type);
    // const response = await api.post('/siswa/upload', formData, {
    //   headers: { 'Content-Type': 'multipart/form-data' },
    // });
    // return response.data;
  },
};

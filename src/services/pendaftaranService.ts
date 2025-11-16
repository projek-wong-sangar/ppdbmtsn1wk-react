import { api } from '@/lib/api';

export interface InitialRegisterData {
  nama_lengkap: string;
  nisn: string;
  email: string;
}

export interface PendaftaranData {
  nama_lengkap?: string; 
  nisn?: string;
  email?: string;
  // Step 1: Data Diri
  nik: string;
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
  foto?: File;
  akta?: File;
  ijazah?: File;
  kk?: File;
  ktp?: File;
  surat?: File;

  // Tipe string URL saat data di-load dari server (getProfil)
  foto_url?: string;
  akta_kelahiran_url?: string;
  ijazah_url?: string;
  kartu_keluarga_url?: string;
  ktp_ortu_url?: string;
  surat_pernyataan_url?: string;
}

// Tipe data yang dikembalikan oleh API Pendaftaran
export interface RegisterResponse {
  message: string;
  no_pendaftaran: string;
  id: string;
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
  /**
   * Register Awal (Hanya Nama, NISN, Email)
   */
  async registerInitial(data: InitialRegisterData): Promise<RegisterResponse> {
    const response = await api.post('/siswa/pendaftaran', data);
    return response.data;
  },

  async getProfil(): Promise<any> { // Return type bisa disesuaikan dengan PendaftaranData + extra fields
    const response = await api.get('/siswa/profil');
    return response.data;
  },

  /**
   * Mengirim Update Data Lengkap (Step 1-6)
   */
  async updateDataLengkap(data: PendaftaranData) {
    // Gunakan PUT ke endpoint protected
    const response = await api.put('/siswa/pendaftaran', data);
    return response.data;
  },

  /**
   * Mengirim file berkas (Step 5)
   * Ini adalah endpoint publik yang memerlukan siswa_id
   */
  async uploadBerkas(siswaId: string, files: Partial<PendaftaranData>) {
    const formData = new FormData();
    
    // WAJIB: Kirim siswa_id agar backend tahu ini file milik siapa
    formData.append('siswa_id', siswaId); 

    // Tambahkan file ke form data hanya jika ada
    if (files.foto) formData.append('foto', files.foto);
    if (files.akta) formData.append('akta', files.akta);
    if (files.ijazah) formData.append('ijazah', files.ijazah);
    if (files.kk) formData.append('kk', files.kk);
    if (files.ktp) formData.append('ktp', files.ktp);
    if (files.surat) formData.append('surat', files.surat);

    // Kirim ke endpoint publik
    const response = await api.post('/siswa/berkas', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    
    return response.data;
  }
};
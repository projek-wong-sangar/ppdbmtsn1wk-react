import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent } from '@/components/ui/card';
import { toast } from 'sonner';
import { Loader2, FileText, AlertCircle } from 'lucide-react';
import { PendaftaranData } from '@/services/pendaftaranService';

interface Props {
  data: Partial<PendaftaranData>; 
  onPrev: () => void;
  onSubmitSuccess: () => Promise<void>; // Ubah agar bisa di-await
}

// Tentukan file apa saja yang wajib
const REQUIRED_FILES: (keyof PendaftaranData)[] = [
  'foto', 
  'akta', 
  'ijazah', 
  'kk', 
  'ktp', 
  'surat'
];

const FILE_LABELS: Record<string, string> = {
  foto: 'Pas Foto',
  akta: 'Akta Kelahiran',
  ijazah: 'Ijazah/SKL',
  kk: 'Kartu Keluarga',
  ktp: 'KTP Orang Tua',
  surat: 'Surat Pernyataan'
};


const Step6Verifikasi = ({ data, onPrev, onSubmitSuccess }: Props) => {
  const [agreed, setAgreed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async () => {
    // 1. Validasi Checkbox
    if (!agreed) {
      toast.warning("Peringatan", {
        description: "Harap setujui pernyataan terlebih dahulu.",
      });
      return;
    }

    // --- PERBAIKAN BUG 2: VALIDASI FILE WAJIB ---
    const missingFiles: string[] = [];
    for (const key of REQUIRED_FILES) {
      if (!data[key as keyof PendaftaranData]) {
        missingFiles.push(FILE_LABELS[key]);
      }
    }

    if (missingFiles.length > 0) {
      toast.error("Berkas Belum Lengkap", {
        description: `Harap kembali ke Step 5 dan upload file berikut: ${missingFiles.join(', ')}`,
      });
      return;
    }
    // --- AKHIR PERBAIKAN BUG 2 ---
    
    setIsLoading(true);
    try {
      await onSubmitSuccess();
      // Jika sukses, Dashboard.tsx akan handle redirect/refresh
      // Jika gagal, Dashboard.tsx akan melempar error
    } catch (err) {
      // Tangkap error dari Dashboard.tsx agar loading stop
      console.error("Submit gagal:", err);
      toast.error("Gagal Menyimpan", {
        description: "Terjadi kesalahan. Silakan coba beberapa saat lagi."
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Helper untuk menampilkan Nama File & Ukuran
  const renderFile = (file: any) => {
    if (file && file instanceof File) {
      return (
        <div className="flex items-center gap-2 text-green-700 bg-green-50 px-2 py-1 rounded border border-green-200 w-fit">
            <FileText className="w-3 h-3" />
            <span className="font-medium truncate max-w-[200px]">{file.name}</span>
            <span className="text-xs text-green-600">({(file.size / 1024 / 1024).toFixed(2)} MB)</span>
        </div>
      );
    }
    // Tampilkan error jika file wajib tapi tidak ada
    return <span className="text-red-500 flex items-center gap-1"><AlertCircle className="w-3 h-3"/> Belum dipilih</span>;
  };

  return (
    <div className="space-y-6">
      
      {/* --- CSS UNTUK ANIMASI TOMBOL --- */}
      <style>
        {`
          @keyframes loading-slide {
            0% { transform: translateX(-100%); }
            100% { transform: translateX(100%); }
          }
          .loading-overlay {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent);
            animation: loading-slide 1.5s infinite linear;
          }
        `}
      </style>

      <div className="space-y-4">
        <h3 className="font-bold text-lg">Ringkasan Data</h3>
        
        {/* ... (Card Data Pribadi, Alamat, Sekolah, Ortu tidak berubah) ... */}
        <Card>
          <CardContent className="p-4">
            <h4 className="font-semibold mb-3 text-primary">Data Pribadi</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
              <div className="grid grid-cols-2"><span className="text-muted-foreground">Nama Lengkap:</span><span className="font-medium">{data.nama_lengkap || '-'}</span></div>
              <div className="grid grid-cols-2"><span className="text-muted-foreground">NISN:</span><span className="font-medium">{data.nisn || '-'}</span></div>
              <div className="grid grid-cols-2"><span className="text-muted-foreground">NIK:</span><span className="font-medium">{data.nik || '-'}</span></div>
              <div className="grid grid-cols-2"><span className="text-muted-foreground">Tempat Lahir:</span><span className="font-medium">{data.tempat_lahir || '-'}</span></div>
              <div className="grid grid-cols-2"><span className="text-muted-foreground">Tanggal Lahir:</span><span className="font-medium">{data.tanggal_lahir || '-'}</span></div>
              <div className="grid grid-cols-2"><span className="text-muted-foreground">Jenis Kelamin:</span><span className="font-medium">{data.jenis_kelamin === 'L' ? 'Laki-laki' : 'Perempuan'}</span></div>
            </div>
          </CardContent>
        </Card>

        <Card>
            <CardContent className="p-4">
                <h4 className="font-semibold mb-3 text-primary">Alamat</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                    <div className="grid grid-cols-2"><span className="text-muted-foreground">Provinsi:</span><span className="font-medium">{data.provinsi || '-'}</span></div>
                    <div className="grid grid-cols-2"><span className="text-muted-foreground">Kabupaten:</span><span className="font-medium">{data.kabupaten || '-'}</span></div>
                    <div className="grid grid-cols-2"><span className="text-muted-foreground">Kecamatan:</span><span className="font-medium">{data.kecamatan || '-'}</span></div>
                    <div className="grid grid-cols-2"><span className="text-muted-foreground">Desa/Kel:</span><span className="font-medium">{data.desa || '-'}</span></div>
                    <div className="grid grid-cols-2"><span className="text-muted-foreground">Jalan:</span><span className="font-medium">{data.alamat || '-'}</span></div>
                </div>
            </CardContent>
        </Card>

        <Card>
            <CardContent className="p-4">
                <h4 className="font-semibold mb-3 text-primary">Asal Sekolah</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                    <div className="grid grid-cols-2"><span className="text-muted-foreground">Nama Sekolah:</span><span className="font-medium">{data.asal_sekolah || '-'}</span></div>
                    <div className="grid grid-cols-2"><span className="text-muted-foreground">NPSN:</span><span className="font-medium">{data.npsn_sekolah || '-'}</span></div>
                    <div className="grid grid-cols-2"><span className="text-muted-foreground">Alamat Sekolah:</span><span className="font-medium">{data.alamat_sekolah || '-'}</span></div>
                    <div className="grid grid-cols-2"><span className="text-muted-foreground">Tahun Lulus:</span><span className="font-medium">{data.tahun_lulus || '-'}</span></div>
                    <div className="grid grid-cols-2"><span className="text-muted-foreground">No. Ijazah:</span><span className="font-medium">{data.no_ijazah || '-'}</span></div>
                </div>
            </CardContent>
        </Card>

        <Card>
            <CardContent className="p-4">
                <h4 className="font-semibold mb-3 text-primary">Data Orang Tua</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                    <div className="grid grid-cols-2"><span className="text-muted-foreground">Nama Ayah:</span><span className="font-medium">{data.nama_ayah || '-'}</span></div>
                    <div className="grid grid-cols-2"><span className="text-muted-foreground">NIK Ayah:</span><span className="font-medium">{data.nik_ayah || '-'}</span></div>
                    <div className="grid grid-cols-2"><span className="text-muted-foreground">Pekerjaan Ayah:</span><span className="font-medium">{data.pekerjaan_ayah || '-'}</span></div>
                    <div className="grid grid-cols-2"><span className="text-muted-foreground">Penghasilan Ayah:</span><span className="font-medium">{data.penghasilan_ayah || '-'}</span></div>
                    <div className="grid grid-cols-2"><span className="text-muted-foreground">Pendidikan Ayah:</span><span className="font-medium">{data.pendidikan_ayah || '-'}</span></div>
                    <div className="grid grid-cols-2"><span className="text-muted-foreground">No. HP Ayah:</span><span className="font-medium">{data.no_hp_ayah || '-'}</span></div>
                    
                    <div className="grid grid-cols-2 md:col-span-2 my-2 border-t border-dashed"></div>

                    <div className="grid grid-cols-2"><span className="text-muted-foreground">Nama Ibu:</span><span className="font-medium">{data.nama_ibu || '-'}</span></div>
                    <div className="grid grid-cols-2"><span className="text-muted-foreground">NIK Ibu:</span><span className="font-medium">{data.nik_ibu || '-'}</span></div>
                    <div className="grid grid-cols-2"><span className="text-muted-foreground">Pekerjaan Ibu:</span><span className="font-medium">{data.pekerjaan_ibu || '-'}</span></div>
                    <div className="grid grid-cols-2"><span className="text-muted-foreground">Penghasilan Ibu:</span><span className="font-medium">{data.penghasilan_ibu || '-'}</span></div>
                    <div className="grid grid-cols-2"><span className="text-muted-foreground">Pendidikan Ibu:</span><span className="font-medium">{data.pendidikan_ibu || '-'}</span></div>
                    <div className="grid grid-cols-2"><span className="text-muted-foreground">No. HP Ibu:</span><span className="font-medium">{data.no_hp_ibu || '-'}</span></div>
                </div>
            </CardContent>
        </Card>

        {/* --- PERBAIKAN ISU KECIL A: Tambah 'Surat' & Rapikan UI --- */}
        <Card>
          <CardContent className="p-4">
            <h4 className="font-semibold mb-3 text-primary">Berkas yang akan diupload</h4>
            <div className="grid grid-cols-1 gap-2 text-sm">
                
                <div className="flex items-center justify-between border-b py-2">
                    <span className="text-muted-foreground w-32">Pas Foto:</span> 
                    {renderFile(data.foto)}
                </div>
                <div className="flex items-center justify-between border-b py-2">
                    <span className="text-muted-foreground w-32">Akta Kelahiran:</span> 
                    {renderFile(data.akta)}
                </div>
                <div className="flex items-center justify-between border-b py-2">
                    <span className="text-muted-foreground w-32">Ijazah/SKL:</span> 
                    {renderFile(data.ijazah)}
                </div>
                <div className="flex items-center justify-between border-b py-2">
                    <span className="text-muted-foreground w-32">Kartu Keluarga:</span> 
                    {renderFile(data.kk)}
                </div>
                <div className="flex items-center justify-between border-b py-2">
                    <span className="text-muted-foreground w-32">KTP Orang Tua:</span> 
                    {renderFile(data.ktp)}
                </div>
                <div className="flex items-center justify-between pt-2">
                    <span className="text-muted-foreground w-32">Surat Pernyataan:</span> 
                    {renderFile(data.surat)}
                </div>

            </div>
          </CardContent>
        </Card>
        {/* --- AKHIR PERBAIKAN ISU KECIL A --- */}

      </div>

      <div className="flex items-start gap-3 p-4 border border-border rounded-lg bg-muted/20">
        <Checkbox id="agree" checked={agreed} onCheckedChange={(checked) => setAgreed(checked as boolean)} />
        <label htmlFor="agree" className="text-sm cursor-pointer leading-relaxed">
          Saya menyatakan bahwa data yang saya isikan adalah benar dan dapat dipertanggungjawabkan. 
          Apabila dikemudian hari terbukti data yang saya isikan tidak benar, saya bersedia menerima sanksi 
          sesuai ketentuan yang berlaku.
        </label>
      </div>

      <div className="flex justify-between pt-4">
        <Button type="button" variant="outline" onClick={onPrev} disabled={isLoading}>
          Kembali
        </Button>

        {/* TOMBOL SIMPAN DENGAN VISUAL LOADING */}
        <Button 
          type="button" 
          onClick={handleSubmit} 
          className="btn-primary min-w-[200px] relative overflow-hidden transition-all" 
          disabled={isLoading || !agreed}
        >
          {isLoading && (
            <div className="loading-overlay" />
          )}
          
          <span className="relative z-10 flex items-center gap-2">
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Sedang Menyimpan...
              </>
            ) : (
              "Simpan Permanen"
            )}
          </span>
        </Button>
      </div>
    </div>
  );
};

export default Step6Verifikasi;
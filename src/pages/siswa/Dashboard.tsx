import { useEffect, useState } from 'react';
import Navigation from '@/components/layout/Navigation';
import Footer from '@/components/layout/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Loader2, CheckCircle, Clock, RefreshCcw } from 'lucide-react';
import { toast } from 'sonner';
import { pendaftaranService, PendaftaranData } from '@/services/pendaftaranService';

// Import Step Components
import Step1DataDiri from '@/components/register/Step1DataDiri';
import Step2Alamat from '@/components/register/Step2Alamat';
import Step3AsalSekolah from '@/components/register/Step3AsalSekolah';
import Step4OrangTua from '@/components/register/Step4OrangTua';
import Step5Berkas from '@/components/register/Step5Berkas';
import Step6Verifikasi from '@/components/register/Step6Verifikasi';

const Dashboard = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isDataComplete, setIsDataComplete] = useState(false);
  const [profil, setProfil] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<Partial<PendaftaranData>>({});
  const totalSteps = 6;
  
  useEffect(() => {
    fetchProfil();
  }, []);

  const fetchProfil = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await pendaftaranService.getProfil();
      setProfil(data);
      
      // Indikator form lengkap: Jika NIK sudah terisi
      if (data.nik && data.nik.length > 0) {
        setIsDataComplete(true);
      } else {
        setIsDataComplete(false);
        // Pre-fill data wizard dengan data yang sudah ada (dari register awal)
        setFormData({
            nama_lengkap: data.nama_lengkap,
            nisn: data.nisn,
            email: data.email,
            ...data
        });
      }
    } catch (err: any) {
      // Jika 404, artinya data siswa belum lengkap/belum ada -> Masuk mode Wizard
      if (err.response && err.response.status === 404) {
         console.log("Profil belum lengkap (404), mengarahkan ke pengisian data.");
         setIsDataComplete(false);
      } else {
         console.error("Gagal load profil:", err);
         setError("Gagal mengambil data profil. Pastikan server berjalan.");
         toast.error("Gagal Memuat", {
           description: "Terjadi kesalahan saat mengambil data profil.",
         });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const progress = (currentStep / totalSteps) * 100;
  const steps = [
    { number: 1, title: 'Data Diri', component: Step1DataDiri },
    { number: 2, title: 'Alamat', component: Step2Alamat },
    { number: 3, title: 'Sekolah', component: Step3AsalSekolah },
    { number: 4, title: 'Orang Tua', component: Step4OrangTua },
    { number: 5, title: 'Berkas', component: Step5Berkas },
    { number: 6, title: 'Konfirmasi', component: Step6Verifikasi },
  ];

  const handleNext = (data: Partial<PendaftaranData>) => {
    setFormData((prev) => ({ ...prev, ...data }));
    if (currentStep < totalSteps) {
      setCurrentStep((prev) => prev + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handlePrev = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleSubmitSuccess = async () => {
    try {
        // --- PERBAIKAN BUG 1: PISAHKAN DATA TEKS DAN FILE ---
        // 1. Buat salinan data teks
        const textData = { ...formData };
        
        // 2. Hapus kunci file dari data teks
        // Ini SANGAT PENTING agar file tidak dikirim sebagai JSON
        const fileKeys: (keyof PendaftaranData)[] = ['foto', 'akta', 'ijazah', 'kk', 'ktp', 'surat'];
        for (const key of fileKeys) {
            delete textData[key];
        }

        // 3. Simpan Data Teks (Step 1-4)
        await pendaftaranService.updateDataLengkap(textData as PendaftaranData);
        
        // 4. Siapkan data file
        const filesToUpload: Partial<PendaftaranData> = {
          foto: formData.foto,
          akta: formData.akta,
          ijazah: formData.ijazah,
          kk: formData.kk,
          ktp: formData.ktp,
          surat: formData.surat
        };
        // --- AKHIR PERBAIKAN BUG 1 ---

        // Cek apakah user memilih file untuk diupload
        const hasFiles = Object.values(filesToUpload).some(f => f instanceof File);
        
        if (hasFiles) {
            // Gunakan ID Siswa dari profil yang didapat saat fetchProfil
            // (Asumsi `getProfil` mengembalikan `id` dari tabel siswa)
            const siswaId = profil?.id; 
            if (siswaId) {
                await pendaftaranService.uploadBerkas(siswaId, filesToUpload);
            } else {
                toast.warning("Gagal Upload Berkas", {
                  description: "ID Siswa tidak ditemukan. Data teks tersimpan, silakan coba upload ulang.",
                });
            }
        }
        
        toast.success("Sukses", {
          description: "Data pendaftaran Anda berhasil disimpan permanen.",
        });
        
        // Set status lengkap dan refresh data
        setIsDataComplete(true);
        fetchProfil();

    } catch (err: any) {
        console.error(err);
        toast.error("Gagal Menyimpan", {
          description: err.message || "Terjadi kesalahan saat menyimpan data.",
        });
        // JANGAN reset loading jika gagal, agar user bisa coba lagi
        throw err; // Lempar error agar Step6 tahu prosesnya gagal
    }
  };

  const CurrentStepComponent = steps[currentStep - 1].component;

  if (isLoading) {
    return <div className="h-screen flex items-center justify-center"><Loader2 className="animate-spin text-primary w-8 h-8" /></div>;
  }

  if (error) {
    return (
      <div className="h-screen flex flex-col items-center justify-center gap-4 bg-background">
        <p className="text-destructive font-semibold">{error}</p>
        <Button onClick={fetchProfil} variant="outline"><RefreshCcw className="mr-2 h-4 w-4"/> Coba Lagi</Button>
      </div>
    );
  }

  // --- MODE 1: WIZARD (Isi Data) ---
  if (!isDataComplete) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="section-padding bg-accent/5">
          <div className="container-custom max-w-4xl">
            <h1 className="text-3xl font-bold text-center mb-6">Lengkapi Data Pendaftaran</h1>
            
            {/* Progress Bar */}
            <div className="mb-6">
                <div className="flex justify-between text-sm mb-2 text-muted-foreground">
                    <span>Langkah {currentStep} dari {totalSteps}</span>
                    <span>{Math.round(progress)}% Selesai</span>
                </div>
                <Progress value={progress} className="h-2" />
            </div>

            {/* Form Card */}
            <Card className="shadow-md border-primary/10">
                <CardHeader className="border-b bg-card">
                    <CardTitle>{steps[currentStep-1].title}</CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                    <CurrentStepComponent 
                        data={formData} 
                        onNext={handleNext} 
                        onPrev={handlePrev} 
                        onSubmitSuccess={handleSubmitSuccess} 
                    />
                </CardContent>
            </Card>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  // --- MODE 2: DASHBOARD (Data Lengkap) ---
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <div className="section-padding">
        <div className="container-custom max-w-5xl">
          <h1 className="text-3xl font-bold mb-6">Dashboard Siswa</h1>
          
          {/* Kartu Status Utama */}
          <Card className="mb-6 border-l-4 border-l-primary shadow-sm">
            <CardContent className="flex flex-col md:flex-row items-start md:items-center gap-4 pt-6 pb-6">
                {profil?.status === 'verified' ? (
                    <CheckCircle className="text-green-500 w-12 h-12 shrink-0"/>
                ) : profil?.status === 'rejected' ? (
                    <Clock className="text-red-500 w-12 h-12 shrink-0"/>
                ) : (
                    <Clock className="text-yellow-500 w-12 h-12 shrink-0"/>
                )}
                
                <div className="space-y-1">
                    <h3 className="text-xl font-bold capitalize">
                    {profil?.status === 'draft' ? 'Formulir Belum Dikirim' : 
                    profil?.status === 'pending' ? 'Menunggu Verifikasi' : 
                    profil?.status}
                </h3>
                <p className="text-muted-foreground">
                    {profil?.status === 'draft' 
                        ? 'Silakan lengkapi formulir pendaftaran Anda agar dapat diverifikasi.' 
                        : profil?.status === 'pending' 
                        ? 'Data sedang dalam antrian verifikasi panitia, mohon cek berkala.' 
                        : profil?.keterangan}
                </p>
                    {profil?.no_pendaftaran && (
                        <p className="text-sm font-medium text-primary mt-2 bg-primary/10 inline-block px-2 py-1 rounded">
                            No. Pendaftaran: {profil.no_pendaftaran}
                        </p>
                    )}
                </div>
            </CardContent>
          </Card>
          
          {/* Informasi Detail */}
           <div className="grid md:grid-cols-2 gap-6">
              <Card>
                  <CardHeader><CardTitle>Data Diri</CardTitle></CardHeader>
                  <CardContent className="space-y-3 text-sm">
                      <div className="grid grid-cols-3 gap-2">
                          <span className="text-muted-foreground">Nama</span>
                          <span className="col-span-2 font-medium">: {profil?.nama_lengkap}</span>
                      </div>
                      <div className="grid grid-cols-3 gap-2">
                          <span className="text-muted-foreground">NISN</span>
                          <span className="col-span-2 font-medium">: {profil?.nisn}</span>
                      </div>
                      <div className="grid grid-cols-3 gap-2">
                          <span className="text-muted-foreground">Email</span>
                          <span className="col-span-2 font-medium">: {profil?.email}</span>
                      </div>
                      <div className="grid grid-cols-3 gap-2">
                          <span className="text-muted-foreground">TTL</span>
                          <span className="col-span-2 font-medium">
                            : {profil?.tempat_lahir}, {profil?.tanggal_lahir ? profil.tanggal_lahir.split('-').reverse().join('-') : '-'}
                          </span>
                      </div>
                      <div className="grid grid-cols-3 gap-2">
                          <span className="text-muted-foreground">Jenis Kelamin</span>
                          <span className="col-span-2 font-medium">: {profil?.jenis_kelamin === 'L' ? 'Laki-laki' : 'Perempuan'}</span>
                      </div>
                      <div className="grid grid-cols-3 gap-2">
                          <span className="text-muted-foreground">Agama</span>
                          <span className="col-span-2 font-medium">: {profil?.agama}</span>
                      </div>
                  </CardContent>
              </Card>

              <Card>
                  <CardHeader><CardTitle>Sekolah Asal</CardTitle></CardHeader>
                  <CardContent className="space-y-3 text-sm">
                      <div className="grid grid-cols-3 gap-2">
                          <span className="text-muted-foreground">Sekolah</span>
                          <span className="col-span-2 font-medium">: {profil?.asal_sekolah}</span>
                      </div>
                      <div className="grid grid-cols-3 gap-2">
                          <span className="text-muted-foreground">NPSN</span>
                          <span className="col-span-2 font-medium">: {profil?.npsn_sekolah}</span>
                      </div>
                      <div className="grid grid-cols-3 gap-2">
                          <span className="text-muted-foreground">Tahun Lulus</span>
                          <span className="col-span-2 font-medium">: {profil?.tahun_lulus}</span>
                      </div>
                  </CardContent>
              </Card>
           </div>

        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Dashboard;
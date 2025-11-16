import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { MailCheck, Loader2, School } from 'lucide-react';

import Navigation from '@/components/layout/Navigation';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
// HAPUS: import { useToast } from '@/hooks/use-toast';
// GANTI DENGAN:
import { toast } from 'sonner';
import { pendaftaranService, InitialRegisterData } from '@/services/pendaftaranService';

const registerSchema = z.object({
  nama_lengkap: z.string().min(3, 'Nama minimal 3 karakter'),
  nisn: z.string().length(10, 'NISN harus 10 digit angka').regex(/^[0-9]+$/, 'NISN hanya boleh angka'),
  email: z.string().email('Email tidak valid'),
});

type RegisterFormData = z.infer<typeof registerSchema>;

const Register = () => {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [submittedEmail, setSubmittedEmail] = useState('');
  // HAPUS: const { toast } = useToast();

  const { register, handleSubmit, formState: { errors } } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterFormData) => {
    setIsLoading(true);
    try {
      await pendaftaranService.registerInitial(data as InitialRegisterData);
      
      setSubmittedEmail(data.email);
      setIsSubmitted(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      
      // Opsional: Toast sukses
      toast.success('Registrasi Berhasil', {
        description: 'Silakan cek email Anda untuk verifikasi.',
      });
      
    } catch (error: any) {
      console.error("Register error:", error);
      const msg = error.response?.data?.error || "Terjadi kesalahan saat mendaftar.";
      
      // GANTI DENGAN SONNER:
      toast.error("Gagal Mendaftar", {
        description: msg,
      });
    } finally {
      setIsLoading(false);
    }
  };

  // TAMPILAN SUKSES (Cek Email)
  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Navigation />
        <div className="flex-1 flex items-center justify-center section-padding">
          <div className="container-custom max-w-md">
            <Card className="border-primary/20 shadow-lg">
              <CardHeader className="text-center">
                <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6 animate-in zoom-in duration-500">
                  <MailCheck className="w-10 h-10 text-primary" />
                </div>
                <CardTitle className="text-2xl text-primary">Cek Email Anda</CardTitle>
                <CardDescription className="text-base mt-2">
                  Link verifikasi dan password akun telah dikirim ke:
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="bg-muted p-4 rounded-lg text-center font-medium text-foreground border border-primary/10">
                  {submittedEmail}
                </div>

                <div className="space-y-3 text-sm text-muted-foreground bg-accent/5 p-4 rounded-md">
                  <p className="font-semibold text-foreground">Langkah selanjutnya:</p>
                  <ol className="list-decimal list-inside space-y-1 ml-1">
                    <li>Buka inbox email Anda.</li>
                    <li>Klik tombol/link verifikasi.</li>
                    <li>Gunakan <b>Password</b> yang ada di email untuk Login.</li>
                    <li>Lengkapi data diri di Dashboard.</li>
                  </ol>
                </div>
              </CardContent>
              <CardFooter className="flex flex-col gap-3">
                <Link to="/login" className="w-full">
                  <Button className="w-full btn-primary">
                    Masuk ke Halaman Login
                  </Button>
                </Link>
                <Link to="/">
                  <Button variant="ghost" className="w-full">
                    Kembali ke Beranda
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  // TAMPILAN FORM REGISTER
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navigation />

      <div className="flex-1 section-padding bg-gradient-to-br from-primary/5 via-background to-secondary/5 flex items-center">
        <div className="container-custom max-w-lg">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center p-3 bg-primary/10 rounded-full mb-4">
              <School className="w-8 h-8 text-primary" />
            </div>
            <h1 className="text-3xl font-bold text-foreground mb-2">
              Pendaftaran Siswa Baru
            </h1>
            <p className="text-muted-foreground">
              Buat akun untuk memulai proses PPDB MTsN 1 Way Kanan
            </p>
          </div>

          <Card className="shadow-xl border-muted">
            <CardHeader>
              <CardTitle>Buat Akun</CardTitle>
              <CardDescription>
                Isi data di bawah ini. Password akan dikirim otomatis ke email Anda.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                
                <div className="space-y-2">
                  <Label htmlFor="nama_lengkap">Nama Lengkap (Sesuai Ijazah SD/MI)</Label>
                  <Input 
                    id="nama_lengkap" 
                    placeholder="Contoh: Ahmad Dahlan" 
                    {...register('nama_lengkap')}
                    disabled={isLoading}
                  />
                  {errors.nama_lengkap && (
                    <p className="text-sm text-destructive font-medium">{errors.nama_lengkap.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="nisn">NISN</Label>
                  <Input 
                    id="nisn" 
                    placeholder="10 Digit Angka" 
                    maxLength={10}
                    {...register('nisn')}
                    disabled={isLoading}
                  />
                  {errors.nisn && (
                    <p className="text-sm text-destructive font-medium">{errors.nisn.message}</p>
                  )}
                  <p className="text-xs text-muted-foreground">Pastikan NISN valid dan aktif.</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email Aktif</Label>
                  <Input 
                    id="email" 
                    type="email" 
                    placeholder="nama@email.com" 
                    {...register('email')}
                    disabled={isLoading}
                  />
                  {errors.email && (
                    <p className="text-sm text-destructive font-medium">{errors.email.message}</p>
                  )}
                  <p className="text-xs text-muted-foreground">
                    Password & Verifikasi akan dikirim ke email ini.
                  </p>
                </div>

                <div className="pt-4">
                  <Button type="submit" className="w-full btn-primary h-12 text-lg" disabled={isLoading}>
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                        Memproses...
                      </>
                    ) : (
                      'Daftar Sekarang'
                    )}
                  </Button>
                </div>
              </form>
            </CardContent>
            <CardFooter className="justify-center border-t bg-accent/5 pt-6">
              <p className="text-sm text-muted-foreground">
                Sudah punya akun?{' '}
                <Link to="/login" className="text-primary font-semibold hover:underline">
                  Login disini
                </Link>
              </p>
            </CardFooter>
          </Card>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Register;
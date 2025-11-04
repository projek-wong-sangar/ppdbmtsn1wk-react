import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { authService } from '@/services/authService';
import { Loader2 } from 'lucide-react';
import axios from 'axios';

const loginSchema = z.object({
  email: z.string().email({ message: 'Email tidak valid' }),
  password: z.string().min(5, { message: 'Password ada 5 karakter' }),
});

type LoginFormData = z.infer<typeof loginSchema>;

const Login = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [showForgot, setShowForgot] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotLoading, setForgotLoading] = useState(false);
  const [forgotSuccess, setForgotSuccess] = useState(false);
  const [forgotError, setForgotError] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true);
    try {
      const { user } = await authService.login({
        email: data.email!,
        password: data.password!
      });
      toast.success('Login berhasil!');
      
      // Redirect based on role
      if (user.role === 'admin') {
        navigate('/admin/dashboard', { state: { email: user.email } });
      } else {
        navigate('/siswa/dashboard', { state: { email: user.email } });
      }
    } catch (error) {
      toast.error('Login gagal. Periksa email dan password Anda.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setForgotLoading(true);
    setForgotSuccess(false);
    setForgotError('');
    try {
      // Step 1: check email terdaftar
      const checkRes = await axios.post('/api/auth/check-email', { email: forgotEmail });
      if (!checkRes.data?.exists) {
        setForgotError('Email tidak ditemukan di sistem.');
        setForgotLoading(false);
        return;
      }
      // Step 2: kirim instruksi reset password
      await axios.post('/api/auth/forgot-password', { email: forgotEmail });
      setForgotSuccess(true);
    } catch (err:any) {
      setForgotError('Terjadi kesalahan. Coba beberapa saat lagi.');
    } finally {
      setForgotLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1 text-center">
          <div className="flex items-center justify-center gap-6 mb-4">
            <div className="w-32 h-32 flex items-center justify-center">
              <img src="https://lulusku.kemusukkidul.com/img/kemenag.png" alt="Logo KEMENAG" />
            </div>
            <div className="w-32 h-32 flex items-center justify-center">
              <img src="https://mtsn1waykanan.com/img/mtsn1logo.png" alt="Logo MTsN 1 Way Kanan" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold">Masuk ke Akun</CardTitle>
          <CardDescription>PPDB MTsN 1 Way Kanan 2025/2026</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="nama@email.com"
                {...register('email')}
                disabled={isLoading}
              />
              {errors.email && (
                <p className="text-sm text-destructive">{errors.email.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                {...register('password')}
                disabled={isLoading}
              />
              {errors.password && (
                <p className="text-sm text-destructive">{errors.password.message}</p>
              )}
            </div>

            <Button type="submit" className="w-full btn-primary" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Masuk
            </Button>
          </form>
          <div className="flex justify-end mt-2 mb-1">
            <button
              type="button"
              className="text-primary hover:underline text-sm font-medium"
              onClick={() => setShowForgot(true)}
              disabled={isLoading}
            >
              Lupa password?
            </button>
          </div>
          {/* Lupa Password Modal */}
          {showForgot && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[100]">
              <div className="bg-white rounded-md p-6 w-full max-w-sm shadow-xl relative">
                <button onClick={() => setShowForgot(false)} className="absolute right-3 top-2 text-xl" aria-label="Tutup">×</button>
                <h4 className="font-bold mb-3 text-lg text-primary">Reset Password</h4>
                <form className="space-y-3" onSubmit={handleForgotSubmit}>
                  <div className="space-y-1">
                    <Label htmlFor="forgot-email">Email yang terdaftar</Label>
                    <Input id="forgot-email" type="email" value={forgotEmail} onChange={e => setForgotEmail(e.target.value)} required disabled={forgotLoading} />
                  </div>
                  {forgotError && <p className="text-sm text-destructive">{forgotError}</p>}
                  <Button type="submit" className="w-full btn-primary" disabled={forgotLoading || !forgotEmail}>
                    {forgotLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Kirim Instruksi"}
                  </Button>
                  {forgotSuccess && <p className="text-sm text-green-700 mt-2">Jika email terdaftar, password baru sudah dikirim!</p>}
                </form>
              </div>
            </div>
          )}

          <div className="mt-6 text-center text-sm">
            <p className="text-foreground">
              Belum punya akun?{' '}
              <Link to="/register" className="text-primary hover:underline font-medium">
                Daftar sekarang
              </Link>
            </p>
          </div>

          <div className="mt-4 text-center">
            <Link to="/" className="text-sm text-foreground hover:text-foreground">
              ← Kembali ke Beranda
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;

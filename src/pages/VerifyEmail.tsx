import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import Navigation from '@/components/layout/Navigation';
import Footer from '@/components/layout/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Input } from '@/components/ui/input';
import { authService } from '@/services/authService';
import { Loader2, CheckCircle2, AlertCircle, TriangleAlert, Copy, Check } from 'lucide-react';
import { toast } from 'sonner';

const VerifyEmail = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  
  // --- KEMBALIKAN STATE LOADING & ERROR ---
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  // ----------------------------------------

  const [password, setPassword] = useState<string | null>(null);
  const [verifiedEmail, setVerifiedEmail] = useState<string>('');
  const [isCopied, setIsCopied] = useState(false);
  const [isLoginButtonReady, setIsLoginButtonReady] = useState(false);

  useEffect(() => {
    const token = searchParams.get('token');

    // Deklarasi timer di luar agar scope-nya bisa diakses cleanup
    let timer: NodeJS.Timeout;

    const verifyToken = async (token: string) => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await authService.verifyEmail(token);
        
        setPassword(response.password);
        if (response.email) {
          setVerifiedEmail(response.email);
        }

        toast.success('Akun Aktif!', { 
          description: 'Silakan login dengan password yang diberikan.' 
        });

        // --- MULAI TIMER 5 DETIK SAAT SUKSES ---
        timer = setTimeout(() => {
          setIsLoginButtonReady(true);
        }, 10000); // 5 detik

      } catch (err: any) {
        // Handle Error
        let msg = 'Terjadi kesalahan. Silakan coba lagi nanti.';
        if (err.response?.status === 404) {
          msg = 'Token verifikasi tidak valid atau sudah kedaluwarsa.';
        }
        
        setError(msg); // Set pesan error ke state
        console.error(err);
        toast.error('Verifikasi Gagal', {
          description: err.response?.data?.error || 'Token tidak valid.'
        });
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      verifyToken(token);
    } else {
      setError('Token verifikasi tidak ditemukan.');
      setLoading(false);
    }

    // Cleanup function untuk membatalkan timer jika user pindah halaman sebelum 5 detik
    return () => clearTimeout(timer);
  }, [searchParams]);

  const handleLoginClick = () => {
    navigate('/login', { state: { email: verifiedEmail } });
  };

  const handleCopyPassword = () => {
    if (password) {
      navigator.clipboard.writeText(password);
      setIsCopied(true);
      toast.success("Password disalin ke clipboard");
      setTimeout(() => setIsCopied(false), 2000);
    }
  };

  const renderContent = () => {
    if (loading) {
      return (
        <div className="flex flex-col items-center gap-4 py-8">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
          <p className="text-muted-foreground">Sedang memverifikasi akun Anda...</p>
        </div>
      );
    }

    if (error) {
      return (
        <div className="flex flex-col items-center gap-4 py-8">
          <AlertCircle className="h-12 w-12 text-destructive" />
          <p className="text-destructive font-semibold text-center">{error}</p>
          <Button asChild variant="outline">
            <Link to="/">Kembali ke Beranda</Link>
          </Button>
        </div>
      );
    }

    if (password) {
      return (
        <div className="flex flex-col items-center gap-6 py-4 text-center animate-in fade-in zoom-in duration-500">
          
          {/* CSS Animasi */}
          <style>
            {`
              @keyframes fill-width {
                from { width: 0%; }
                to { width: 100%; }
              }
              .loading-fill-bar {
                animation: fill-width 10s linear forwards;
                transform-origin: left;
              }
            `}
          </style>

          {/* Header Sukses */}
          <div className="space-y-2">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
                <CheckCircle2 className="h-8 w-8 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-foreground">Verifikasi Berhasil!</h2>
            <p className="text-muted-foreground max-w-xs mx-auto">
              Akun Anda telah aktif. Gunakan password di bawah ini untuk login pertama kali.
            </p>
          </div>

          {/* Warning Box */}
          <Alert className="bg-amber-50 border-amber-200 text-amber-900 text-left">
            <TriangleAlert className="h-5 w-5 text-amber-600" />
            <AlertTitle className="font-bold text-amber-800">PENTING: Simpan Password Ini</AlertTitle>
            <AlertDescription className="text-sm text-amber-700/90 mt-1 leading-relaxed">
              Password ini <b>hanya tampil satu kali</b> di halaman ini. Harap segera salin dan simpan di tempat yang aman.
            </AlertDescription>
          </Alert>

          {/* Password Display */}
          <div className="w-full space-y-2">
            <div className="relative group">
                <Input 
                    readOnly 
                    value={password} 
                    className="text-center font-mono text-lg font-bold h-12 bg-muted/50 border-primary/20 text-foreground pr-12 tracking-widest"
                />
                <Button
                    size="icon"
                    variant="ghost"
                    className="absolute right-1 top-1 h-10 w-10 hover:bg-primary/10 text-muted-foreground hover:text-primary transition-colors"
                    onClick={handleCopyPassword}
                    title="Salin Password"
                >
                    {isCopied ? <Check className="h-5 w-5 text-green-600" /> : <Copy className="h-5 w-5" />}
                </Button>
            </div>
            <p className="text-xs text-muted-foreground">
                Klik ikon di kanan untuk menyalin password.
            </p>
          </div>

          {/* Action Button dengan Loading */}
          <Button 
            onClick={handleLoginClick} 
            className="w-full btn-primary h-11 text-base shadow-lg shadow-primary/20 relative overflow-hidden transition-all duration-300"
            disabled={!isLoginButtonReady}
          >
            {/* Bar Loading */}
            {!isLoginButtonReady && (
              <div 
                className="absolute top-0 left-0 h-full bg-black/20 loading-fill-bar" 
              />
            )}
            
            <span className="relative z-10">
              {isLoginButtonReady ? 'Lanjut ke Halaman Login' : 'Harap Tunggu...'}
            </span>
          </Button>
        </div>
      );
    }

    return null;
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <div className="section-padding container-custom flex justify-center items-center min-h-[70vh]">
        <Card className="w-full max-w-md shadow-xl border-primary/10">
          <CardContent>
            {renderContent()}
          </CardContent>
        </Card>
      </div>
      <Footer />
    </div>
  );
};

export default VerifyEmail;
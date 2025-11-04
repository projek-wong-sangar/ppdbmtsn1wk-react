import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Suspense, lazy, useEffect } from "react";
import { CD } from '@/daka';
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import ProtectedRoute from "./components/ProtectedRoute";

// Lazy load pages
const Login = lazy(() => import("./pages/Login"));
const Register = lazy(() => import("./pages/Register"));
const Informasi = lazy(() => import("./pages/Informasi"));
const Pengumuman = lazy(() => import("./pages/Pengumuman"));
const Kontak = lazy(() => import("./pages/Kontak"));
const Faq = lazy(() => import("./pages/Faq"));

const DashboardSiswa = lazy(() => import('./pages/siswa/Dashboard'));
const ProfilSiswa = lazy(() => import('./pages/siswa/Profil'));
const BerkasSiswa = lazy(() => import('./pages/siswa/Berkas'));


const DashboardAdmin = lazy(() => import('./pages/admin/Dashboard'));
const PendaftarAdmin = lazy(() => import('./pages/admin/Pendaftar'));
const DetailPendaftarAdmin = lazy(() => import('./pages/admin/DetailPendaftar'));


const queryClient = new QueryClient();

const Loading = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
  </div>
);

const App = () => {
  useEffect(() => {
    if (import.meta.env.DEV) CD();
  }, []);

  // Disable page scrolling via ArrowUp/ArrowDown across all pages, while
  // preserving arrow-key behavior inside editable fields (inputs/textareas/contentEditable)
  useEffect(() => {
    const handleArrowScrollBlock = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      const isEditable = !!target && (
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        (target as HTMLElement).isContentEditable
      );
      if (!isEditable && (e.key === 'ArrowDown' || e.key === 'ArrowUp')) {
        e.preventDefault();
      }
    };
    const opts = { passive: false } as AddEventListenerOptions;
    window.addEventListener('keydown', handleArrowScrollBlock, opts);
    return () => window.removeEventListener('keydown', handleArrowScrollBlock, opts);
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Suspense fallback={<Loading />}>
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Index />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/informasi" element={<Informasi />} />
              <Route path="/pengumuman" element={<Pengumuman />} />
              <Route path="/kontak" element={<Kontak />} />
              <Route path="/faq" element={<Faq />} />
              {/* Protected Routes */}
              <Route element={<ProtectedRoute allowedRoles={['siswa']} />}>
                <Route path="/siswa/dashboard" element={<DashboardSiswa />} />
                <Route path="/siswa/profil" element={<ProfilSiswa />} />
                <Route path="/siswa/berkas" element={<BerkasSiswa />} />
              </Route>
              <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
                <Route path="/admin/dashboard" element={<DashboardAdmin />} />
                <Route path="/admin/pendaftar" element={<PendaftarAdmin />} />
                <Route path="/admin/pendaftar/:id" element={<DetailPendaftarAdmin />} />

              </Route>
              {/* 404 */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;

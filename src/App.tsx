import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Suspense, lazy } from "react";
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


// Dashboard Siswa
const DashboardSiswa = lazy(() => import("./pages/siswa/Dashboard"));
const ProfilSiswa = lazy(() => import("./pages/siswa/Profil"));
const BerkasSiswa = lazy(() => import("./pages/siswa/Berkas"));
const StatusSiswa = lazy(() => import("./pages/siswa/Status"));

// Dashboard Admin
const DashboardAdmin = lazy(() => import("./pages/admin/Dashboard"));
const PendaftarAdmin = lazy(() => import("./pages/admin/Pendaftar"));
const DetailPendaftarAdmin = lazy(() => import("./pages/admin/DetailPendaftar"));

const queryClient = new QueryClient();

const Loading = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
  </div>
);

const App = () => (
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

            {/* Protected Routes - Siswa */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <DashboardSiswa />
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard/profil"
              element={
                <ProtectedRoute>
                  <ProfilSiswa />
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard/berkas"
              element={
                <ProtectedRoute>
                  <BerkasSiswa />
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard/status"
              element={
                <ProtectedRoute>
                  <StatusSiswa />
                </ProtectedRoute>
              }
            />

            {/* Protected Routes - Admin */}
            <Route
              path="/admin"
              element={
                <ProtectedRoute adminOnly>
                  <DashboardAdmin />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/pendaftar"
              element={
                <ProtectedRoute adminOnly>
                  <PendaftarAdmin />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/pendaftar/:id"
              element={
                <ProtectedRoute adminOnly>
                  <DetailPendaftarAdmin />
                </ProtectedRoute>
              }
            />

            {/* 404 */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

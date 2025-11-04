import { useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { authService } from '@/services/authService';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import Navigation from '@/components/layout/Navigation';
import Footer from '@/components/layout/Footer';

type StatusPendaftaran = 'pending' | 'verified' | 'rejected' | 'accepted' | string;

interface SiswaStatus {
  no_pendaftaran: string;
  nama: string;
  status: StatusPendaftaran;
  tanggal_daftar: string; // "YYYY-MM-DD HH:mm:ss"
  keterangan: string;
}

interface DashboardSiswaProps {
  /** Email siswa; opsional. Jika tidak ada, akan dicoba ambil dari route state (navigate state). */
  email?: string;
  /** Optional override API base URL; default dari VITE_API_URL atau http://localhost:4006 */
  apiBaseUrl?: string;
  /** Optional: Authorization bearer token jika endpoint BE memerlukannya. */
  authToken?: string;
}

const DEFAULT_API_BASE =
  (import.meta as any).env?.VITE_API_URL || 'http://localhost:4006';

const MONTHS_ID = [
  'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
  'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
];

function classForStatus(s?: StatusPendaftaran) {
  switch ((s || '').toLowerCase()) {
    case 'verified':
    case 'accepted':
      return 'bg-green-600';
    case 'rejected':
      return 'bg-destructive';
    case 'in_review':
      return 'bg-yellow-600';
    case 'pending':
    default:
      return 'bg-warning';
  }
}

function labelForStatus(s?: StatusPendaftaran) {
  switch ((s || '').toLowerCase()) {
    case 'in_review':
      return 'In Review';
    case 'pending':
      return 'Pending';
    case 'verified':
      return 'Verified';
    case 'accepted':
      return 'Accepted';
    case 'rejected':
      return 'Rejected';
    default:
      return s || '-';
  }
}

/** Format "YYYY-MM-DD HH:mm:ss" → "DD NamaBulan YYYY HH:mm" */
function formatTanggalHuman(input?: string) {
  if (!input) return '';
  try {
    const [datePart, timePart] = input.split(' ');
    const [y, m, d] = datePart.split('-').map(Number);
    const [hh, mm] = (timePart || '').split(':');
    const bulan = MONTHS_ID[(m || 1) - 1] ?? '';
    return `${d} ${bulan} ${y}${hh ? ` ${hh}:${mm}` : ''}`;
  } catch {
    return input;
  }
}

/** Fetch helper dengan timeout & AbortController */
async function fetchJSON<T>(
  url: string,
  init: RequestInit & { timeoutMs?: number } = {}
): Promise<T> {
  const { timeoutMs = 15000, ...rest } = init;
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetch(url, { ...rest, signal: controller.signal });
    const text = await res.text();
    // coba parse json jika memungkinkan
    const data = text ? (() => { try { return JSON.parse(text); } catch { return text as unknown as T; } })() : ({} as T);
    if (!res.ok) {
      const message =
        typeof data === 'object' && data && 'error' in (data as any)
          ? (data as any).error
          : text || `HTTP ${res.status}`;
      throw new Error(String(message));
    }
    return data as T;
  } finally {
    clearTimeout(id);
  }
}

const DashboardSiswa = ({
  email: emailProp,
  apiBaseUrl = DEFAULT_API_BASE,
  authToken,
}: DashboardSiswaProps) => {
  const location = useLocation() as { state?: { email?: string } };
  const emailFromStorage = (() => {
    try {
      const userStr = localStorage.getItem('user');
      if (!userStr) return '';
      const user = JSON.parse(userStr) as { email?: string };
      return user?.email || '';
    } catch {
      return '';
    }
  })();
  const email = emailProp ?? location?.state?.email ?? emailFromStorage ?? '';

  const [data, setData] = useState<SiswaStatus | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const lastFetchRef = useRef<number>(0);

  const doFetch = async () => {
    if (!email) {
      setError('Email pengguna tidak tersedia. Silakan login ulang.');
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const token = authToken ?? authService.getToken() ?? localStorage.getItem('token');
      const headers: HeadersInit = { 'Content-Type': 'application/json' };
      if (token) headers.Authorization = `Bearer ${token}`;

      const result = await fetchJSON<SiswaStatus>(
        `${apiBaseUrl}/api/siswa/status`,
        {
          method: 'POST', // ShouldBindJSON di server → POST
          headers,
          body: JSON.stringify({ email }),
          timeoutMs: 15000,
        }
      );

      setData(result);
      lastFetchRef.current = Date.now();
    } catch (e: any) {
      setError(e?.message || 'Terjadi kesalahan tak terduga saat memuat status.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let cancelled = false;
    (async () => {
      if (!cancelled) await doFetch();
    })();
    return () => {
      cancelled = true;
    };
    // hanya berubah jika email atau apiBaseUrl/authToken berubah
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [email, apiBaseUrl, authToken]);

  const canRefresh =
    !loading && (Date.now() - lastFetchRef.current > 2000 || !lastFetchRef.current);

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <div className="section-padding">
        <div className="container-custom max-w-4xl">
          <div className="mb-16 flex items-center justify-between gap-4">
            <h1 className="text-3xl font-bold">Dashboard Siswa</h1>
            {/* <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={doFetch}
                disabled={!canRefresh}
                title={canRefresh ? 'Muat ulang status' : 'Tunggu sebentar...'}
              >
                Refresh
              </Button>
            </div> */}
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Status Pendaftaran</CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="space-y-4 animate-pulse">
                  <div className="h-5 w-40 bg-muted rounded" />
                  <div className="h-8 w-64 bg-muted rounded" />
                  <div className="h-5 w-48 bg-muted rounded" />
                </div>
              ) : error ? (
                <div className="space-y-3">
                  <p className="text-destructive">{error}</p>
                  <Button variant="secondary" onClick={doFetch}>Coba Lagi</Button>
                </div>
              ) : data ? (
                <div className="space-y-4">
                  <div>
                    <span className="text-foreground">Nomor Pendaftaran:</span>
                    <p className="text-2xl font-bold text-primary">
                      {data.no_pendaftaran}
                    </p>
                  </div>
                  <div>
                    <span className="text-foreground">Status:</span>
                    <div className="mt-2">
                      <Badge className={classForStatus(data.status)}>
                        {labelForStatus(data.status)}
                      </Badge>
                    </div>
                  </div>
                  <div>
                    <span className="text-foreground">Tanggal Daftar:</span>
                    <p className="font-medium">{formatTanggalHuman(data.tanggal_daftar)}</p>
                  </div>
                  {data.status.toLowerCase() !== 'pending' && (
                  <div>
                    <span className="text-foreground">Keterangan:</span>
                    <p className="font-medium">{data.keterangan || '-'}</p>
                  </div>
                )}
                </div>
              ) : (
                <div>Data tidak tersedia.</div>
              )}
            </CardContent>
          </Card>

          {!email && (
            <p className="mt-4 text-sm text-muted-foreground">
              Catatan: Email tidak ditemukan pada props/route state. Pastikan halaman Login
              melakukan <code>navigate('/siswa/dashboard', &#123; state: &#123; email &#125; &#125;)</code>
              {' '}atau parent route mengoper <code>&lt;DashboardSiswa email=&#123;...&#125; /&gt;</code>.
            </p>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default DashboardSiswa;
import Navigation from '@/components/layout/Navigation';
import Footer from '@/components/layout/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, UserCheck, UserX, Clock, Eye, CheckCircle, Search, Filter, ChevronDown, ChevronLeft, ChevronRight, X, Loader2 } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { adminService } from '@/services/adminService';
import { authService } from '@/services/authService';

const DashboardAdmin = () => {
  const navigate = useNavigate();
  const token = authService.getToken() || '';
  const [summary, setSummary] = useState({
    total_pendaftar: 0,
    pending: 0,
    in_review: 0,
    verified: 0,
    rejected: 0,
  });
  const [summaryLoading, setSummaryLoading] = useState(true);

  const nf = useMemo(() => new Intl.NumberFormat('id-ID'), []);

  const stats = [
    { icon: Users,       label: 'Total Pendaftar', value: nf.format(summary.total_pendaftar), color: 'text-primary',         bg: 'bg-primary/5' },
    { icon: Clock,       label: 'Pending',         value: nf.format(summary.pending),         color: 'text-slate-700',        bg: 'bg-slate-100 dark:bg-slate-950/30' },
    { icon: Eye,         label: 'In Review',       value: nf.format(summary.in_review),      color: 'text-amber-700',        bg: 'bg-amber-100 dark:bg-amber-950/30' },
    { icon: UserCheck,   label: 'Verified',        value: nf.format(summary.verified),       color: 'text-emerald-700',      bg: 'bg-emerald-100 dark:bg-emerald-950/30' },
    { icon: UserX,       label: 'Rejected',        value: nf.format(summary.rejected),       color: 'text-rose-700',         bg: 'bg-rose-100 dark:bg-rose-950/30' },
  ];

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'in_review' | 'verified' | 'rejected'>('all');
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(20);
  const [total, setTotal] = useState(0);
  const [rows, setRows] = useState<any[]>([]);

  const handleOpenDetail = (id?: string) => {
    if (!id) return;
    navigate(`/admin/pendaftar/${id}`);
  };

  const renderStatusBadge = (status?: string) => {
    const s = (status || '').toLowerCase();
    const base = 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium';
    if (s === 'verified')  return <span className={`${base} bg-emerald-100 text-emerald-800 dark:bg-emerald-950/30 dark:text-emerald-300`}>Verified</span>;
    if (s === 'rejected')  return <span className={`${base} bg-rose-100 text-rose-800 dark:bg-rose-950/30 dark:text-rose-300`}>Rejected</span>;
    if (s === 'in_review') return <span className={`${base} bg-amber-100 text-amber-800 dark:bg-amber-950/30 dark:text-amber-300`}>In Review</span>;
    return                       <span className={`${base} bg-slate-100 text-slate-800 dark:bg-slate-950/30 dark:text-slate-300`}>Pending</span>;
  };

  const totalPages = useMemo(() => Math.max(1, Math.ceil(total / limit)), [total, limit]);

  const fetchRows = async () => {
    try {
      setLoading(true);
      setError('');
      const { data, total: t } = await adminService.getPendaftarList({
        status: statusFilter === 'all' ? undefined : statusFilter,
        search: searchTerm || undefined,
        page,
        limit,
      });
      setRows(data || []);
      setTotal(t || 0);
    } catch (e: any) {
      setError(e?.message || 'Gagal memuat data pendaftar');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRows();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [statusFilter, page, limit]);

  useEffect(() => {
    const id = setTimeout(() => {
      setPage(1);
      fetchRows();
    }, 300);
    return () => clearTimeout(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchTerm]);

  useEffect(() => {
    (async () => {
      try {
        setSummaryLoading(true);
        const s = await adminService.getDashboardStats();
        setSummary(s || summary);
      } catch {
        // keep defaults
      } finally {
        setSummaryLoading(false);
      }
    })();
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <div className="section-padding">
        <div className="container-custom">
          <div className="mb-6">
            <h1 className="text-3xl font-bold">Dashboard Admin</h1>
            <p className="text-muted-foreground mt-1 text-sm">Ringkasan dan daftar pendaftar terbaru</p>
          </div>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6">
            {stats.map((stat, i) => (
              <Card key={i} className={stat.bg}>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">{stat.label}</CardTitle>
                  <stat.icon className={`h-4 w-4 ${stat.color}`} />
                </CardHeader>
                <CardContent>
                  {summaryLoading ? (
                    <div className="h-7 w-24 rounded-md bg-muted animate-pulse" />
                  ) : (
                    <div className="text-2xl font-bold">{stat.value}</div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Search & Filter */}
          <div className="bg-card rounded-2xl border border-border shadow-sm p-6 mt-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-semibold">Filter Pencarian</h2>
            </div>
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Cari nama/no pendaftaran/nisn/nik/email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-16 py-3 border border-border rounded-xl focus:ring-2 focus:ring-ring focus:border-ring transition-colors bg-background"
                />
                {searchTerm && (
                  <button
                    onClick={() => setSearchTerm('')}
                    className="absolute right-10 top-1/2 -translate-y-1/2 p-1 rounded hover:bg-accent"
                    aria-label="Clear search"
                  >
                    <X className="h-4 w-4 text-muted-foreground" />
                  </button>
                )}
                {loading && (
                  <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 animate-spin text-muted-foreground" />
                )}
              </div>

              <div className="relative min-w-[220px]">
                <Filter className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground pointer-events-none" />
                <select
                  value={statusFilter}
                  onChange={(e) => { setPage(1); setStatusFilter(e.target.value as any); }}
                  className="appearance-none w-full pl-10 pr-8 py-3 border border-border rounded-xl focus:ring-2 focus:ring-ring focus:border-ring bg-background text-foreground font-medium shadow-sm hover:border-ring transition-all cursor-pointer"
                >
                  <option value="all">Semua Status</option>
                  <option value="pending">Pending</option>
                  <option value="in_review">In Review</option>
                  <option value="verified">Verified</option>
                  <option value="rejected">Rejected</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground pointer-events-none" />
              </div>

              <div className="relative min-w-[160px]">
                <label className="sr-only" htmlFor="per-page">Per Page</label>
                <select
                  id="per-page"
                  value={limit}
                  onChange={(e) => { setPage(1); setLimit(Number(e.target.value)); }}
                  className="appearance-none w-full pr-8 pl-3 py-3 border border-border rounded-xl focus:ring-2 focus:ring-ring focus:border-ring bg-background text-foreground shadow-sm hover:border-ring cursor-pointer"
                >
                  <option value={10}>10 / halaman</option>
                  <option value={20}>20 / halaman</option>
                  <option value={50}>50 / halaman</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground pointer-events-none" />
              </div>
            </div>
          </div>

          {/* Table (summary fields only) */}
          <div className="mt-6 bg-card rounded-2xl border border-border shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-muted/50 sticky top-0 z-10">
                  <tr>
                    <th className="px-4 py-3 text-left font-medium">No. Pendaftaran</th>
                    <th className="px-4 py-3 text-left font-medium">Nama</th>
                    <th className="px-4 py-3 text-left font-medium">Email</th>
                    <th className="px-4 py-3 text-left font-medium">Status</th>
                    <th className="px-4 py-3 text-left font-medium">Keterangan</th>
                    <th className="px-4 py-3 text-left font-medium">Tanggal Daftar</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan={6} className="px-4 py-6 text-center">Memuat data...</td>
                    </tr>
                  ) : error ? (
                    <tr>
                      <td colSpan={6} className="px-4 py-6 text-center text-destructive">Gagal memuat data. Periksa koneksi atau coba lagi.</td>
                    </tr>
                  ) : rows.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="px-4 py-6 text-center">Tidak ada data</td>
                    </tr>
                  ) : (
                    rows.map((r, idx) => (
                      <tr
                        key={r.id || idx}
                        className="border-t border-border odd:bg-muted/30 hover:bg-accent/40 cursor-pointer"
                        onClick={() => handleOpenDetail(r.id)}
                      >
                        <td className="px-4 py-3 font-medium">{r.no_pendaftaran || '-'}</td>
                        <td className="px-4 py-3">{r.nama_lengkap || '-'}</td>
                        <td className="px-4 py-3">{r.email || '-'}</td>
                        <td className="px-4 py-3">{renderStatusBadge(r.status)}</td>
                        <td className="px-4 py-3">{r.status === 'in_review' ? `by ${r.in_review_by || '-'}`: (r.keterangan?.trim() ? r.keterangan : '-')}</td>
                        <td className="px-4 py-3 whitespace-nowrap">{r.tanggal_daftar || '-'}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-between p-4 border-t border-border">
              <div className="text-sm text-muted-foreground">
                Menampilkan {rows.length === 0 ? 0 : (page - 1) * limit + 1}–{(page - 1) * limit + rows.length} dari {total}
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1 || loading}
                  className={`px-3 py-2 rounded-md border text-sm inline-flex items-center gap-1 ${page === 1 || loading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-accent'}`}
                >
                  <ChevronLeft className="h-4 w-4" /> Prev
                </button>
                <span className="text-sm">{page} / {totalPages}</span>
                <button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages || loading}
                  className={`px-3 py-2 rounded-md border text-sm inline-flex items-center gap-1 ${page === totalPages || loading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-accent'}`}
                >
                  Next <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* <Footer /> */}
    </div>
  );
};

export default DashboardAdmin;

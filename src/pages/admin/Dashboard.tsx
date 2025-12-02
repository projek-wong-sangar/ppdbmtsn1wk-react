import Navigation from '@/components/layout/Navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Users, UserCheck, UserX, Clock, SquarePen, Eye, Search, Filter, ChevronDown, ChevronLeft, ChevronRight, X, Loader2 } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { adminService } from '@/services/adminService';
import { authService } from '@/services/authService';

const DashboardAdmin = () => {
  const navigate = useNavigate();
  const token = authService.getToken() || '';
  const [summary, setSummary] = useState({
    total_pendaftar: 0,
    draft: 0,
    pending: 0,
    in_review: 0,
    verified: 0,
    rejected: 0,
  });
  const [summaryLoading, setSummaryLoading] = useState(true);

  const nf = useMemo(() => new Intl.NumberFormat('id-ID'), []);

  const stats = [
    { icon: Users,       label: 'Total',           value: nf.format(summary.total_pendaftar), color: 'text-indigo-700',       bg: 'bg-indigo-100 dark:bg-indigo-950/30' },
    { icon: SquarePen,   label: 'Draft',           value: nf.format(summary.draft),           color: 'text-zinc-600',         bg: 'bg-zinc-100 dark:bg-zinc-950/30' },
    { icon: Clock,       label: 'Pending',         value: nf.format(summary.pending),         color: 'text-blue-700',         bg: 'bg-blue-100 dark:bg-blue-950/30' },
    { icon: Eye,         label: 'In Review',       value: nf.format(summary.in_review),       color: 'text-amber-700',        bg: 'bg-amber-100 dark:bg-amber-950/30' },
    { icon: UserCheck,   label: 'Verified',        value: nf.format(summary.verified),        color: 'text-emerald-700',      bg: 'bg-emerald-100 dark:bg-emerald-950/30' },
    { icon: UserX,       label: 'Rejected',        value: nf.format(summary.rejected),        color: 'text-rose-700',         bg: 'bg-rose-100 dark:bg-rose-950/30' },
  ];

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string[]>(['all']);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(20);
  const [total, setTotal] = useState(0);
  const [rows, setRows] = useState<any[]>([]);

  const handleOpenDetail = (id?: string) => {
    if (!id) return;
    navigate(`/admin/pendaftar/${id}`);
  };

  const filterStatusOptions = [
    { value: 'draft',     label: 'Draft' },
    { value: 'pending',   label: 'Pending' },
    { value: 'in_review', label: 'In Review' },
    { value: 'verified',  label: 'Verified' },
    { value: 'rejected',  label: 'Rejected' },
  ];

  const toggleStatusFilter = (value: string) => {
    setPage(1);
    setStatusFilter((prev) => {
      if (value === 'all') {
        return ['all'];
      } else {
        let newFilter = prev.filter((f) => f !== 'all');

        if (newFilter.includes(value)) {
          newFilter = newFilter.filter((v) => v !== value);
        } else {
          newFilter = [...newFilter, value];
        }

        if (newFilter.length === 0) {
          return ['all'];
        }

        return newFilter;
      }
    });
  };

  const renderStatusBadge = (status?: string) => {
    const s = (status || '').toLowerCase();
    const base = 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium';
    if (s === 'verified')  return <span className={`${base} bg-emerald-100 text-emerald-800 dark:bg-emerald-950/30 dark:text-emerald-300`}>Verified</span>;
    if (s === 'rejected')  return <span className={`${base} bg-rose-100 text-rose-800 dark:bg-rose-950/30 dark:text-rose-300`}>Rejected</span>;
    if (s === 'in_review') return <span className={`${base} bg-amber-100 text-amber-800 dark:bg-amber-950/30 dark:text-amber-300`}>In Review</span>;
    if (s === 'pending') return  <span className={`${base} bg-blue-100 text-slate-800 dark:bg-slate-950/30 dark:text-slate-300`}>Pending</span>;
    return                     <span className={`${base} bg-slate-100 text-slate-800 dark:bg-slate-950/30 dark:text-slate-300`}>Draft</span>;
  };

  const totalPages = useMemo(() => Math.max(1, Math.ceil(total / limit)), [total, limit]);

  const fetchRows = async () => {
    try {
      setLoading(true);
      setError('');
      const { data, total: t } = await adminService.getPendaftarList({
        status: statusFilter.includes('all') ? undefined : statusFilter.join(','),
        search: searchTerm || undefined,
        page,
        limit,
      });
      setRows((data || []).sort((a, b) => {
        const t1 = new Date(a.tanggal_daftar || 0).getTime();
        const t2 = new Date(b.tanggal_daftar || 0).getTime();
        return t1 - t2;
      }));
      setTotal(t || 0);
    } catch (e: any) {
      setError(e?.message || 'Gagal memuat data pendaftar');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRows();
  }, [statusFilter, page, limit]);

  useEffect(() => {
    const id = setTimeout(() => {
      setPage(1);
      fetchRows();
    }, 300);
    return () => clearTimeout(id);
  }, [searchTerm]);

  useEffect(() => {
    (async () => {
      try {
        setSummaryLoading(true);
        const s = await adminService.getDashboardStats();
        setSummary(s || summary);
      } catch {
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
          
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-6">
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
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button
                      className="w-full flex items-center justify-between px-3 py-3 border border-border rounded-xl bg-background text-foreground font-medium shadow-sm hover:border-ring transition-all"
                      type="button"
                    >
                      <span className="inline-flex items-center gap-2">
                        <Filter className="h-5 w-5 text-muted-foreground" />
                        {statusFilter.length === 0
                          ? 'Semua Status'
                          : `${statusFilter.length} status dipilih`}
                      </span>
                      <ChevronDown className="h-4 w-4 text-muted-foreground" />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56">
                    <DropdownMenuCheckboxItem
                      checked={statusFilter.includes('all')}
                      onCheckedChange={() => setStatusFilter([])}
                      onSelect={(e) => e.preventDefault()}
                    >
                      Semua Status
                    </DropdownMenuCheckboxItem>
                    <div className="border-t my-1" />
                    {filterStatusOptions.map((opt) => (
                      <DropdownMenuCheckboxItem
                        key={opt.value}
                        checked={statusFilter.includes(opt.value)}
                        onCheckedChange={() => toggleStatusFilter(opt.value)}
                        onSelect={(e) => e.preventDefault()}
                      >
                        {opt.label}
                      </DropdownMenuCheckboxItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              <div className="relative min-w-[160px]">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button
                      type="button"
                      className="w-full flex items-center justify-between px-3 py-3 border border-border rounded-xl bg-background text-foreground shadow-sm hover:border-ring transition-all"
                    >
                      <span className="text-sm">
                        {limit} / halaman
                      </span>
                      <ChevronDown className="h-4 w-4 text-muted-foreground" />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-40">
                    <DropdownMenuItem
                      onClick={() => { setPage(1); setLimit(10); }}
                    >
                      <span className={limit === 10 ? 'font-semibold' : ''}>10 / halaman</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => { setPage(1); setLimit(20); }}
                    >
                      <span className={limit === 20 ? 'font-semibold' : ''}>20 / halaman</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => { setPage(1); setLimit(50); }}
                    >
                      <span className={limit === 50 ? 'font-semibold' : ''}>50 / halaman</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </div>

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
    </div>
  );
};

export default DashboardAdmin;
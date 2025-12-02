import Navigation from '@/components/layout/Navigation';
import Footer from '@/components/layout/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useEffect, useState } from 'react';
import { useParams, useNavigate, useBlocker as useBlocker } from 'react-router-dom';
import { adminService, PendaftarDetail, ReviewPendaftar } from '@/services/adminService';
import { ArrowLeft, Loader2, UserCheck, UserX, AlertCircle, CheckCircle2, FileText, Eye, Download } from 'lucide-react';
import { toast } from 'sonner';

const DetailPendaftarAdmin = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [data, setData] = useState<PendaftarDetail | null>(null);
  const [isReviewing, setIsReviewing] = useState(false);
  const [reviewStatus, setReviewPendaftar] = useState<ReviewPendaftar | null>(null);
  const [verifying, setVerifying] = useState(false);
  const [showVerifikasiDialog, setShowVerifikasiDialog] = useState(false);
  const [showTolakDialog, setShowTolakDialog] = useState(false);
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [keterangan, setKeterangan] = useState('');
  const [actionType, setActionType] = useState<'verified' | 'rejected' | null>(null);
  const [isReadOnly, setIsReadOnly] = useState(false);

  const shouldBlock = data && data.status !== 'verified' && data.status !== 'rejected' && isReviewing && !isReadOnly;
  const blocker = useBlocker(shouldBlock);

  useEffect(() => {
    if (blocker && blocker.state === 'blocked') {
      setShowCancelDialog(true);
    }
  }, [blocker]);

  useEffect(() => {
    if (!id) {
      setError('ID pendaftar tidak ditemukan');
      setLoading(false);
      return;
    }

    let isMounted = true;
    let reviewStarted = false; 
    let readOnlyToastId: string | number | undefined = undefined;

    (async () => {
      try {
        setLoading(true);
        setError('');
        setIsReviewing(false);
        setIsReadOnly(false);

        const result = await adminService.getPendaftarDetail(id);
        if (!isMounted) return;

        setData(result);

        const status = result.status?.toLowerCase();
        const canReview = !status || !['draft', 'verified', 'rejected'].includes(status);

        if (!canReview) {
          setIsReadOnly(true);
          return;
        }

        try {
          const review = await adminService.startReviewPendaftar(id);
          reviewStarted = true;
          if (isMounted) {
            setReviewPendaftar(review);
            setIsReviewing(true);
          }
        } catch (e: any) {
          if (e?.response?.status === 409) {
            if (isMounted) {
              setIsReadOnly(true);

              readOnlyToastId = toast.warning('Sedang direview admin lain', {
                description: 'Anda hanya dapat melihat data (read-only).',
                duration: Infinity,
              });
            }
          } else {
            throw e;
          }
        }
      } catch (e: any) {
        if (isMounted) {
          setError(e?.response?.data?.error || e?.message || 'Gagal memuat detail pendaftar');
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    })();

    return () => {
      isMounted = false;
      
      if (readOnlyToastId) {
        toast.dismiss(readOnlyToastId);
      }

      if (reviewStarted && id) {
        console.log('Cleanup: Canceling review...');
        adminService.cancelReviewPendaftar(id)
          .catch(err => console.error('Error in cleanup cancelReview:', err));
      }
    };
  }, [id]);

  useEffect(() => {
    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      if (shouldBlock) {
        event.preventDefault();
        event.returnValue = '';
        return '';
      }
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [shouldBlock]);

  const handleBack = () => {
    navigate('/admin/dashboard');
  };

  const handleConfirmCancel = async () => {
    if (!id) return;
    
    setShowCancelDialog(false);
    
    try {
      await adminService.cancelReviewPendaftar(id);
      toast.info('Review dibatalkan');
    } catch (e: any) {
      toast.error('Gagal membatalkan review');
    } finally {
      if (blocker) {
        blocker.proceed();
      }
    }
  };

  const handleStayOnPage = () => {
    setShowCancelDialog(false);
    if (blocker) {
      blocker.reset();
    }
  };

  const openVerifikasiDialog = () => {
    setKeterangan('Lolos administrasi');
    setActionType('verified');
    setShowVerifikasiDialog(true);
  };

  const openTolakDialog = () => {
    setKeterangan('');
    setActionType('rejected');
    setShowTolakDialog(true);
  };

  const closeDialogs = () => {
    setShowVerifikasiDialog(false);
    setShowTolakDialog(false);
    setKeterangan('');
    setActionType(null);
  };

  const handleSubmitVerifikasi = async () => {
    if (!id || !data || !actionType) return;
    
    if (actionType === 'rejected' && !keterangan.trim()) {
      toast.error('Keterangan wajib diisi');
      return;
    }

    try {
      setVerifying(true);
      await adminService.verifikasiPendaftar(
        id, 
        actionType, 
        keterangan.trim() || undefined
      );
      
      setIsReviewing(false);
      
      const updated = await adminService.getPendaftarDetail(id);
      setData(updated);
      closeDialogs();
      
      if (actionType === 'verified') {
        toast.success('Pendaftar berhasil diverifikasi');
      } else {
        toast.success('Pendaftar ditolak');
      }
    } catch (e: any) {
      toast.error('Gagal memproses');
    } finally {
      setVerifying(false);
    }
  };

  const renderStatusBadge = (status?: string) => {
    const s = (status || '').toLowerCase();
    if (s === 'verified') return <Badge className="bg-emerald-500 text-white">Verified</Badge>;
    if (s === 'rejected') return <Badge className="bg-rose-500 text-white">Rejected</Badge>;
    if (s === 'accepted') return <Badge className="bg-blue-500 text-white">Accepted</Badge>;
    if (s === 'reviewing' || s === 'in_review') return <Badge className="bg-blue-500 text-white">In Review</Badge>;
    if (s === 'pending') return <Badge className="bg-amber-500 text-white">Pending</Badge>;
    return <Badge className="bg-slate-500 text-white">Draft</Badge>;
  };

  const BerkasItem = ({ label, url }: { label: string, url?: string }) => {
    if (!url) {
      return (
        <div className="p-3 border rounded-lg bg-muted/30 flex items-center gap-3 opacity-60">
          <div className="p-2 bg-muted rounded-full"><FileText className="w-4 h-4" /></div>
          <div className="text-sm">
            <p className="font-medium">{label}</p>
            <p className="text-xs text-destructive">Tidak ada file</p>
          </div>
        </div>
      );
    }
  
    const isImage = url.match(/\.(jpeg|jpg|png)$/i);
  
    return (
      <div className="p-3 border rounded-lg flex items-center justify-between hover:bg-accent/5 transition-colors">
        <div className="flex items-center gap-3 overflow-hidden">
          {isImage ? (
              <img src={url} alt={label} className="w-10 h-10 object-cover rounded bg-muted" />
          ) : (
              <div className="p-2 bg-blue-100 text-blue-600 rounded-full">
                  <FileText className="w-5 h-5" />
              </div>
          )}
          <div className="min-w-0">
            <p className="font-medium text-sm truncate">{label}</p>
            <a href={url} target="_blank" rel="noreferrer" className="text-xs text-blue-600 hover:underline flex items-center gap-1">
              <Eye className="w-3 h-3" /> Lihat File
            </a>
          </div>
        </div>
        
        <Button variant="ghost" size="icon" asChild title="Download">
          <a href={url} download>
              <Download className="w-4 h-4 text-muted-foreground" />
          </a>
        </Button>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="section-padding">
          <div className="container-custom">
            <div className="flex items-center justify-center min-h-[60vh]">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="section-padding">
          <div className="container-custom">
            <Button variant="ghost" onClick={() => navigate('/admin/dashboard')} className="mb-4">
              <ArrowLeft className="h-4 w-4 mr-2" /> Kembali
            </Button>
            <Card>
              <CardContent className="pt-6">
                <p className="text-destructive">{error || 'Data tidak ditemukan'}</p>
              </CardContent>
            </Card>
          </div>
        </div>
        <Footer />
      </div>
    );
  }


  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <div className="section-padding">
        <div className="container-custom">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <Button variant="ghost" onClick={handleBack} className="mb-2">
                <ArrowLeft className="h-4 w-4 mr-2" /> Kembali
              </Button>
              <h1 className="text-3xl font-bold">Detail Pendaftar</h1>
              <p className="text-muted-foreground mt-1 text-sm">No. Pendaftaran: {data.no_pendaftaran}</p>
            </div>
            <div className="flex items-center gap-3 flex-wrap">
              {renderStatusBadge(data.status)}
              
              {data.status && ['pending', 'reviewing', 'in_review'].includes(data.status.toLowerCase()) && !isReadOnly && (
                <div className="flex gap-2">
                  <Button
                    onClick={openVerifikasiDialog}
                    disabled={verifying}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white"
                  >
                    <UserCheck className="h-4 w-4 mr-2" />
                    Verifikasi
                  </Button>
                  <Button
                    onClick={openTolakDialog}
                    disabled={verifying}
                    variant="destructive"
                  >
                    <UserX className="h-4 w-4 mr-2" />
                    Tolak
                  </Button>
                </div>
              )}
            </div>
          </div>

          <div className="grid gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Data Diri</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm text-muted-foreground">Nama Lengkap</label>
                    <p className="font-medium">{data.nama_lengkap}</p>
                  </div>
                  <div>
                    <label className="text-sm text-muted-foreground">NISN</label>
                    <p className="font-medium">{data.nisn}</p>
                  </div>
                  <div>
                    <label className="text-sm text-muted-foreground">NIK</label>
                    <p className="font-medium">{data.nik}</p>
                  </div>
                  <div>
                    <label className="text-sm text-muted-foreground">Email</label>
                    <p className="font-medium">{data.email}</p>
                  </div>
                  <div>
                    <label className="text-sm text-muted-foreground">Tempat, Tanggal Lahir</label>
                    <p className="font-medium">{data.tempat_lahir}, {new Date(data.tanggal_lahir).toLocaleDateString('id-ID')}</p>
                  </div>
                  <div>
                    <label className="text-sm text-muted-foreground">Jenis Kelamin</label>
                    <p className="font-medium">{data.jenis_kelamin === 'L' ? 'Laki-laki' : data.jenis_kelamin === 'P' ? 'Perempuan' : '-'}</p>
                  </div>
                  <div>
                    <label className="text-sm text-muted-foreground">Agama</label>
                    <p className="font-medium">{data.agama}</p>
                  </div>
                  <div>
                    <label className="text-sm text-muted-foreground">Anak Ke</label>
                    <p className="font-medium">{data.anak_ke}</p>
                  </div>
                  <div>
                    <label className="text-sm text-muted-foreground">Jumlah Saudara</label>
                    <p className="font-medium">{data.jumlah_saudara}</p>
                  </div>
                  <div>
                    <label className="text-sm text-muted-foreground">Tanggal Daftar</label>
                    <p className="font-medium">{data.tanggal_daftar}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Alamat & Kontak</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <label className="text-sm text-muted-foreground">Alamat Lengkap</label>
                    <p className="font-medium">{data.alamat}</p>
                  </div>
                  <div>
                    <label className="text-sm text-muted-foreground">RT / RW</label>
                    <p className="font-medium">{data.rt} / {data.rw}</p>
                  </div>
                  <div>
                    <label className="text-sm text-muted-foreground">Kode Pos</label>
                    <p className="font-medium">{data.kode_pos}</p>
                  </div>
                  <div>
                    <label className="text-sm text-muted-foreground">Desa/Kelurahan</label>
                    <p className="font-medium">{data.desa}</p>
                  </div>
                  <div>
                    <label className="text-sm text-muted-foreground">Kecamatan</label>
                    <p className="font-medium">{data.kecamatan}</p>
                  </div>
                  <div>
                    <label className="text-sm text-muted-foreground">Kabupaten/Kota</label>
                    <p className="font-medium">{data.kabupaten}</p>
                  </div>
                  <div>
                    <label className="text-sm text-muted-foreground">Provinsi</label>
                    <p className="font-medium">{data.provinsi}</p>
                  </div>
                  <div>
                    <label className="text-sm text-muted-foreground">No. HP</label>
                    <p className="font-medium">{data.no_hp}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Data Asal Sekolah</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm text-muted-foreground">Nama Sekolah</label>
                    <p className="font-medium">{data.asal_sekolah}</p>
                  </div>
                  <div>
                    <label className="text-sm text-muted-foreground">NPSN</label>
                    <p className="font-medium">{data.npsn_sekolah}</p>
                  </div>
                  <div className="md:col-span-2">
                    <label className="text-sm text-muted-foreground">Alamat Sekolah</label>
                    <p className="font-medium">{data.alamat_sekolah}</p>
                  </div>
                  <div>
                    <label className="text-sm text-muted-foreground">Tahun Lulus</label>
                    <p className="font-medium">{data.tahun_lulus}</p>
                  </div>
                  <div>
                    <label className="text-sm text-muted-foreground">No. Ijazah</label>
                    <p className="font-medium">{data.no_ijazah}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Data Orang Tua</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-semibold mb-3 text-lg">Ayah</h3>
                    <div className="space-y-3">
                      <div>
                        <label className="text-sm text-muted-foreground">Nama</label>
                        <p className="font-medium">{data.nama_ayah}</p>
                      </div>
                      <div>
                        <label className="text-sm text-muted-foreground">NIK</label>
                        <p className="font-medium">{data.nik_ayah}</p>
                      </div>
                      <div>
                        <label className="text-sm text-muted-foreground">Pekerjaan</label>
                        <p className="font-medium">{data.pekerjaan_ayah}</p>
                      </div>
                      <div>
                        <label className="text-sm text-muted-foreground">Penghasilan</label>
                        <p className="font-medium">{data.penghasilan_ayah}</p>
                      </div>
                      <div>
                        <label className="text-sm text-muted-foreground">Pendidikan</label>
                        <p className="font-medium">{data.pendidikan_ayah}</p>
                      </div>
                      <div>
                        <label className="text-sm text-muted-foreground">No. HP</label>
                        <p className="font-medium">{data.no_hp_ayah}</p>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-3 text-lg">Ibu</h3>
                    <div className="space-y-3">
                      <div>
                        <label className="text-sm text-muted-foreground">Nama</label>
                        <p className="font-medium">{data.nama_ibu}</p>
                      </div>
                      <div>
                        <label className="text-sm text-muted-foreground">NIK</label>
                        <p className="font-medium">{data.nik_ibu}</p>
                      </div>
                      <div>
                        <label className="text-sm text-muted-foreground">Pekerjaan</label>
                        <p className="font-medium">{data.pekerjaan_ibu}</p>
                      </div>
                      <div>
                        <label className="text-sm text-muted-foreground">Penghasilan</label>
                        <p className="font-medium">{data.penghasilan_ibu}</p>
                      </div>
                      <div>
                        <label className="text-sm text-muted-foreground">Pendidikan</label>
                        <p className="font-medium">{data.pendidikan_ibu}</p>
                      </div>
                      <div>
                        <label className="text-sm text-muted-foreground">No. HP</label>
                        <p className="font-medium">{data.no_hp_ibu}</p>
                      </div>
                      </div>
                  </div>
                  {data.nama_wali && (
                    <div className="md:col-span-2">
                      <h3 className="font-semibold mb-3 text-lg">Wali</h3>
                      <div>
                        <label className="text-sm text-muted-foreground">Nama</label>
                        <p className="font-medium">{data.nama_wali}</p>
                      </div>
                      <div>
                        <label className="text-sm text-muted-foreground">NIK</label>
                        <p className="font-medium">{data.nik_wali}</p>
                      </div>
                      <div>
                        <label className="text-sm text-muted-foreground">Pekerjaan</label>
                        <p className="font-medium">{data.pekerjaan_wali}</p>
                      </div>
                      <div>
                        <label className="text-sm text-muted-foreground">Penghasilan</label>
                        <p className="font-medium">{data.penghasilan_wali}</p>
                      </div>
                      <div>
                        <label className="text-sm text-muted-foreground">Pendidikan</label>
                        <p className="font-medium">{data.pendidikan_wali}</p>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Berkas Lampiran</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-4">
                  <BerkasItem label="Pas Foto" url={data?.foto_url} />
                  <BerkasItem label="Akta Kelahiran" url={data?.akta_kelahiran_url} />
                  <BerkasItem label="Ijazah / SKL" url={data?.ijazah_url} />
                  <BerkasItem label="Kartu Keluarga" url={data?.kartu_keluarga_url} />
                  <BerkasItem label="KTP Orang Tua" url={data?.ktp_ortu_url} />
                  <BerkasItem label="Surat Pernyataan" url={data?.surat_pernyataan_url} />
                </div>
              </CardContent>
            </Card>

            {data.keterangan && (
              <Card>
                <CardHeader>
                  <CardTitle>Keterangan</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>{data.keterangan}</p>
                </CardContent>
              </Card>
            )}

          </div>
        </div>
      </div>
      <Footer />

      <Dialog open={showVerifikasiDialog} onOpenChange={setShowVerifikasiDialog}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-emerald-100 dark:bg-emerald-900/30 rounded-full">
                <CheckCircle2 className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
              </div>
              <DialogTitle>Verifikasi Pendaftar</DialogTitle>
            </div>
            <DialogDescription>
              Anda akan memverifikasi pendaftaran <strong>{data?.nama_lengkap}</strong> dengan nomor pendaftaran <strong>{data?.no_pendaftaran}</strong>.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4 space-y-4">
            <div className="bg-muted/50 p-4 rounded-lg">
              <p className="text-sm text-muted-foreground mb-2">Informasi Pendaftar:</p>
              <div className="space-y-1 text-sm">
                <p><span className="font-medium">Nama:</span> {data?.nama_lengkap}</p>
                <p><span className="font-medium">NISN:</span> {data?.nisn}</p>
                <p><span className="font-medium">Email:</span> {data?.email}</p>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="keterangan-verified">
                Keterangan <span className="text-muted-foreground">(opsional)</span>
              </Label>
              <Textarea
                id="keterangan-verified"
                placeholder="Contoh: Lolos administrasi, semua dokumen lengkap"
                value={keterangan}
                onChange={(e) => setKeterangan(e.target.value)}
                rows={3}
                className="resize-none"
              />
              <p className="text-xs text-muted-foreground">
                Keterangan akan disimpan sebagai catatan verifikasi
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={closeDialogs}
              disabled={verifying}
            >
              Batal
            </Button>
            <Button
              onClick={handleSubmitVerifikasi}
              disabled={verifying}
              className="bg-emerald-600 hover:bg-emerald-700 text-white"
            >
              {verifying ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  Memproses...
                </>
              ) : (
                <>
                  <CheckCircle2 className="h-4 w-4 mr-2" />
                  Verifikasi
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <Dialog open={showTolakDialog} onOpenChange={setShowTolakDialog}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-rose-100 dark:bg-rose-900/30 rounded-full">
                <AlertCircle className="h-6 w-6 text-rose-600 dark:text-rose-400" />
              </div>
              <DialogTitle>Tolak Pendaftar</DialogTitle>
            </div>
            <DialogDescription>
              Anda akan menolak pendaftaran <strong>{data?.nama_lengkap}</strong> dengan nomor pendaftaran <strong>{data?.no_pendaftaran}</strong>.
              <span className="block mt-2 text-rose-600 dark:text-rose-400 font-medium">
                ⚠️ Tindakan ini tidak dapat dibatalkan.
              </span>
            </DialogDescription>
          </DialogHeader>
          <div className="py-4 space-y-4">
            <div className="bg-muted/50 p-4 rounded-lg">
              <p className="text-sm text-muted-foreground mb-2">Informasi Pendaftar:</p>
              <div className="space-y-1 text-sm">
                <p><span className="font-medium">Nama:</span> {data?.nama_lengkap}</p>
                <p><span className="font-medium">NISN:</span> {data?.nisn}</p>
                <p><span className="font-medium">Email:</span> {data?.email}</p>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="keterangan-rejected">
                Alasan Penolakan <span className="text-destructive">*</span>
              </Label>
              <Textarea
                id="keterangan-rejected"
                placeholder="Contoh: Dokumen tidak lengkap, data tidak sesuai, dll."
                value={keterangan}
                onChange={(e) => setKeterangan(e.target.value)}
                rows={4}
                className="resize-none"
                required
              />
              <p className="text-xs text-muted-foreground">
                Alasan penolakan wajib diisi untuk keperluan audit dan informasi kepada pendaftar
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={closeDialogs}
              disabled={verifying}
            >
              Batal
            </Button>
            <Button
              onClick={handleSubmitVerifikasi}
              disabled={verifying || !keterangan.trim()}
              variant="destructive"
            >
              {verifying ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  Memproses...
                </>
              ) : (
                <>
                  <AlertCircle className="h-4 w-4 mr-2" />
                  Tolak Pendaftar
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={showCancelDialog} onOpenChange={setShowCancelDialog}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-amber-100 dark:bg-amber-900/30 rounded-full">
                <AlertCircle className="h-6 w-6 text-amber-600 dark:text-amber-400" />
              </div>
              <DialogTitle>Batalkan Review?</DialogTitle>
            </div>
            <DialogDescription>
              Anda sedang dalam mode review untuk pendaftar ini. Jika Anda keluar,
              review akan dibatalkan dan pendaftar akan dilepas (unlocked).
              <br/><br/>
              <strong>Lanjutkan keluar dan batalkan review?</strong>
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={handleStayOnPage}
            >
              Tetap di Halaman Ini
            </Button>
            <Button
              variant="destructive"
              onClick={handleConfirmCancel}
            >
              Ya, Keluar & Batalkan
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default DetailPendaftarAdmin;
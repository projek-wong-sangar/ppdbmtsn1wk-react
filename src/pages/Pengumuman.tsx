import Navigation from '@/components/layout/Navigation';
import Footer from '@/components/layout/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock } from 'lucide-react';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';

const Pengumuman = () => {
  const announcements = [
    {
      id: 1,
      title: 'Pembukaan PPDB Tahun Pelajaran 2025/2026',
      date: '2025-01-01T08:00:00',
      category: 'Penting',
      content:
        'Pendaftaran Peserta Didik Baru (PPDB) MTsN 1 Way Kanan Tahun Pelajaran 2025/2026 dibuka mulai tanggal 1 Januari 2025. Calon siswa dapat mendaftar secara online melalui website ini. Kuota yang tersedia sebanyak 250 siswa.',
    },
    {
      id: 2,
      title: 'Persyaratan Upload Berkas',
      date: '2025-01-05T10:00:00',
      category: 'Info',
      content:
        'Harap memperhatikan format dan ukuran file yang diupload. Foto harus format JPG/PNG maksimal 500KB. Dokumen lainnya format PDF maksimal 1MB. Pastikan semua dokumen terscanning dengan jelas dan tidak blur.',
    },
    {
      id: 3,
      title: 'Jadwal Verifikasi Berkas',
      date: '2025-01-10T09:00:00',
      category: 'Jadwal',
      content:
        'Proses verifikasi berkas akan dilakukan mulai tanggal 1-15 Februari 2025. Tim admin akan melakukan pengecekan kelengkapan dan keabsahan dokumen. Status verifikasi dapat dilihat di dashboard masing-masing.',
    },
    {
      id: 4,
      title: 'Pengumuman Hasil Seleksi',
      date: '2025-01-15T14:00:00',
      category: 'Penting',
      content:
        'Pengumuman hasil seleksi PPDB akan dilaksanakan pada tanggal 20 Februari 2025. Calon siswa yang diterima akan menerima notifikasi via email dan dapat mengecek di dashboard. Daftar ulang dilakukan tanggal 25 Februari - 5 Maret 2025.',
    },
  ];

  const getCategoryColor = (category: string) => {
    switch (category.toLowerCase()) {
      case 'penting':
        return 'bg-destructive text-destructive-foreground';
      case 'jadwal':
        return 'bg-warning text-foreground';
      case 'info':
        return 'bg-primary text-primary-foreground';
      default:
        return 'bg-secondary text-secondary-foreground';
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      {/* Hero */}
      <section className="bg-primary text-primary-foreground section-padding">
        <div className="container-custom text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Pengumuman</h1>
          <p className="text-xl opacity-90 max-w-2xl mx-auto">
            Informasi terbaru seputar PPDB MTsN 1 Way Kanan 2025/2026
          </p>
        </div>
      </section>

      <div className="section-padding">
        <div className="container-custom max-w-4xl">
          <div className="space-y-6">
            {announcements.map((announcement) => (
              <Card key={announcement.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <Badge className={getCategoryColor(announcement.category)}>
                          {announcement.category}
                        </Badge>
                      </div>
                      <CardTitle className="text-2xl mb-3">{announcement.title}</CardTitle>
                      <div className="flex flex-wrap items-center gap-4 text-sm text-foreground">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4" />
                          <span>
                            {format(new Date(announcement.date), 'dd MMMM yyyy', {
                              locale: id,
                            })}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4" />
                          <span>{format(new Date(announcement.date), 'HH:mm')} WIB</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-foreground leading-relaxed">{announcement.content}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          {announcements.length === 0 && (
            <Card>
              <CardContent className="p-12 text-center">
                <p className="text-foreground text-lg">Belum ada pengumuman saat ini</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Pengumuman;

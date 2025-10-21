import Navigation from '@/components/layout/Navigation';
import Footer from '@/components/layout/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle2, Clock, FileText, Users } from 'lucide-react';

const Informasi = () => {
  const syarat = [
    'Lulus SD/MI atau sederajat',
    'Berusia maksimal 15 tahun pada tanggal 1 Juli 2024',
    'Memiliki Ijazah SD/MI atau Surat Keterangan Lulus',
    'Memiliki nilai rapor minimal rata-rata 7.0',
    'Berkelakuan baik (tidak terlibat tawuran, narkoba, dll)',
    'Sehat jasmani dan rohani',
  ];

  const berkas = [
    'Foto 3x4 berwarna (format JPG/PNG, max 500KB)',
    'Scan Ijazah SD/MI atau SKL (PDF, max 1MB)',
    'Scan Kartu Keluarga (PDF, max 1MB)',
    'Scan Akta Kelahiran (PDF, max 1MB)',
    'Scan KTP Orang Tua (PDF, max 1MB)',
    'Surat Pernyataan bermaterai (download template)',
  ];

  const alur = [
    {
      step: 1,
      title: 'Registrasi Online',
      desc: 'Daftar akun dan lengkapi formulir pendaftaran online',
    },
    {
      step: 2,
      title: 'Upload Berkas',
      desc: 'Upload semua berkas persyaratan dalam format yang ditentukan',
    },
    {
      step: 3,
      title: 'Verifikasi',
      desc: 'Tim admin akan memverifikasi data dan berkas Anda (1-3 hari kerja)',
    },
    {
      step: 4,
      title: 'Pengumuman',
      desc: 'Cek pengumuman hasil seleksi di website atau dashboard',
    },
    {
      step: 5,
      title: 'Daftar Ulang',
      desc: 'Calon siswa yang diterima melakukan daftar ulang sesuai jadwal',
    },
  ];

  const jadwal = [
    { kegiatan: 'Pendaftaran Online', waktu: '1 - 31 Januari 2025' },
    { kegiatan: 'Verifikasi Berkas', waktu: '1 - 15 Februari 2025' },
    { kegiatan: 'Pengumuman Hasil Seleksi', waktu: '20 Februari 2025' },
    { kegiatan: 'Daftar Ulang', waktu: '25 Februari - 5 Maret 2025' },
    { kegiatan: 'MPLS (Masa Pengenalan Lingkungan Sekolah)', waktu: '8 - 10 Juli 2025' },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      {/* Hero */}
      <section className="bg-primary text-primary-foreground section-padding">
        <div className="container-custom text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Informasi PPDB</h1>
          <p className="text-xl opacity-90 max-w-2xl mx-auto">
            Panduan lengkap persyaratan, berkas, dan alur pendaftaran PPDB MTsN 1 Way Kanan 2025/2026
          </p>
        </div>
      </section>

      <div className="section-padding">
        <div className="container-custom space-y-12">
          {/* Syarat Pendaftaran */}
          <section>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                <CheckCircle2 className="w-6 h-6 text-primary" />
              </div>
              <h2 className="text-3xl font-bold text-foreground">Syarat Pendaftaran</h2>
            </div>
            <Card>
              <CardContent className="p-6">
                <ul className="space-y-3">
                  {syarat.map((item, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-success flex-shrink-0 mt-0.5" />
                      <span className="text-foreground">{item}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </section>

          {/* Berkas yang Dibutuhkan */}
          <section>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                <FileText className="w-6 h-6 text-primary" />
              </div>
              <h2 className="text-3xl font-bold text-foreground">Berkas yang Dibutuhkan</h2>
            </div>
            <Card>
              <CardContent className="p-6">
                <ul className="space-y-3">
                  {berkas.map((item, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <div className="w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center flex-shrink-0 text-sm font-bold mt-0.5">
                        {index + 1}
                      </div>
                      <span className="text-foreground">{item}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </section>

          {/* Alur Pendaftaran */}
          <section>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                <Users className="w-6 h-6 text-primary" />
              </div>
              <h2 className="text-3xl font-bold text-foreground">Alur Pendaftaran</h2>
            </div>
            <div className="space-y-4">
              {alur.map((item) => (
                <Card key={item.step}>
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-primary text-primary-foreground rounded-full flex items-center justify-center flex-shrink-0 font-bold text-lg">
                        {item.step}
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-foreground mb-1">{item.title}</h3>
                        <p className="text-foreground">{item.desc}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

          {/* Jadwal */}
          <section>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                <Clock className="w-6 h-6 text-primary" />
              </div>
              <h2 className="text-3xl font-bold text-foreground">Jadwal PPDB</h2>
            </div>
            <Card>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-accent/50">
                      <tr>
                        <th className="text-left p-4 font-bold text-foreground">Kegiatan</th>
                        <th className="text-left p-4 font-bold text-foreground">Waktu</th>
                      </tr>
                    </thead>
                    <tbody>
                      {jadwal.map((item, index) => (
                        <tr key={index} className="border-t border-border">
                          <td className="p-4 text-foreground">{item.kegiatan}</td>
                          <td className="p-4 text-foreground">{item.waktu}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </section>

          {/* Info Kuota */}
          <section>
            <Card className="bg-primary text-primary-foreground">
              <CardHeader>
                <CardTitle className="text-2xl">Kuota Penerimaan</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-5xl font-bold mb-2">250 Siswa</div>
                <p className="opacity-90">Untuk Tahun Pelajaran 2025/2026</p>
              </CardContent>
            </Card>
          </section>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Informasi;

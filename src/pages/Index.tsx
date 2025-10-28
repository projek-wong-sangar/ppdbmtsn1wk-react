import { Link } from 'react-router-dom';
import { ArrowRight, Users, FileCheck, Clock, Award, BookOpen, GraduationCap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import Navigation from '@/components/layout/Navigation';
import Footer from '@/components/layout/Footer';

const Index = () => {
  const stats = [
    { icon: Users, label: 'Total Pendaftar', value: '500+' },
    { icon: GraduationCap, label: 'Siswa Aktif', value: '1.200+' },
    { icon: Award, label: 'Prestasi', value: '50+' },
    { icon: FileCheck, label: 'Kuota Tersedia', value: '250' },
  ];

  const timeline = [
    { phase: 'Pendaftaran', date: '1 - 15 November 2024', status: 'active' },
    { phase: 'Seleksi Administrasi', date: '16 - 25 November 2024', status: 'upcoming' },
    { phase: 'Pengumuman', date: '27 November 2024', status: 'upcoming' },
    { phase: 'Daftar Ulang', date: '28 - 30 November 2024', status: 'upcoming' },
  ];

  const features = [
    {
      icon: Clock,
      title: 'Pendaftaran Online',
      desc: 'Daftar kapan saja, dimana saja dengan sistem online 24/7',
    },
    {
      icon: FileCheck,
      title: 'Proses Cepat',
      desc: 'Verifikasi berkas otomatis dan pengumuman real-time',
    },
    {
      icon: BookOpen,
      title: 'Fasilitas Lengkap',
      desc: 'Laboratorium, perpustakaan, dan fasilitas modern lainnya',
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary via-primary to-secondary text-primary-foreground section-padding overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDE4YzAtMy4zMTQgMi42ODYtNiA2LTZzNiAyLjY4NiA2IDYtMi42ODYgNi02IDYtNi0yLjY4Ni02LTZ6Ii8+PC9nPjwvZz48L3N2Zz4=')] opacity-30" />
        
        <div className="container-custom relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 animate-fade-in">
              PPDB MTsN 1 Way Kanan
            </h1>
            <p className="text-xl md:text-2xl mb-4 opacity-95">
              Tahun Pelajaran 2025/2026
            </p>
            <p className="text-lg mb-8 opacity-90 max-w-2xl mx-auto">
              Bergabunglah dengan madrasah terbaik di Way Kanan. Wujudkan cita-cita menjadi generasi Qur'ani, berakhlak mulia, dan berprestasi.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/register">
                <Button size="lg" className="bg-primary-foreground text-primary hover:bg-primary-foreground/70 shadow-lg">
                  Daftar Sekarang
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
              <Link to="/informasi">
                <Button size="lg" variant="link" className="bg-primary-foreground text-primary hover:bg-primary-foreground/70 shadow-lg">
                  Informasi Lengkap
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="section-padding bg-background">
        <div className="container-custom">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
              <Card key={index} className="border-border hover:shadow-lg transition-shadow">
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <stat.icon className="w-6 h-6 text-primary" />
                  </div>
                  <div className="text-3xl font-bold text-foreground mb-1">{stat.value}</div>
                  <div className="text-sm text-foreground">{stat.label}</div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="section-padding bg-accent/5">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Mengapa Memilih MTsN 1 Way Kanan?
            </h2>
            <p className="text-lg text-foreground max-w-2xl mx-auto">
              Kami menyediakan lingkungan belajar yang kondusif dengan fasilitas terbaik
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="border-border hover:border-primary transition-colors">
                <CardContent className="p-6">
                  <div className="w-14 h-14 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                    <feature.icon className="w-7 h-7 text-primary" />
                  </div>
                  <h3 className="text-xl font-bold text-foreground mb-2">{feature.title}</h3>
                  <p className="text-foreground">{feature.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline Section */}
      <section className="section-padding bg-background">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Timeline PPDB 2025/2026
            </h2>
            <p className="text-lg text-foreground">
              Ikuti setiap tahapan pendaftaran dengan baik
            </p>
          </div>

          <div className="max-w-3xl mx-auto">
            <div className="space-y-4">
              {timeline.map((item, index) => (
                <div
                  key={index}
                  className={`p-6 rounded-lg border-2 ${
                    item.status === 'active'
                      ? 'border-primary bg-primary/5'
                      : 'border-border bg-card'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-xl font-bold text-foreground mb-1">
                        {item.phase}
                      </h3>
                      <p className="text-foreground">{item.date}</p>
                    </div>
                    {item.status === 'active' && (
                      <span className="px-4 py-1 bg-primary text-primary-foreground rounded-full text-sm font-medium">
                        Aktif
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section-padding bg-primary text-primary-foreground">
        <div className="container-custom text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Siap Bergabung dengan Kami?
          </h2>
          <p className="text-lg mb-8 opacity-90 max-w-2xl mx-auto">
            Jangan lewatkan kesempatan emas ini. Daftarkan diri Anda sekarang dan raih masa depan gemilang!
          </p>
          <Link to="/register">
            <Button size="lg" className="bg-primary-foreground text-primary hover:bg-primary-foreground/90 shadow-lg">
              Daftar Sekarang
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Index;

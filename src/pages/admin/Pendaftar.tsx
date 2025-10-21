import Navigation from '@/components/layout/Navigation';
import Footer from '@/components/layout/Footer';

const PendaftarAdmin = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <div className="section-padding">
        <div className="container-custom">
          <h1 className="text-3xl font-bold mb-8">Data Pendaftar</h1>
          <p className="text-foreground">Halaman data pendaftar dalam pengembangan</p>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default PendaftarAdmin;

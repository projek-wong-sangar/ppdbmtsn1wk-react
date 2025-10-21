import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Navigation from '@/components/layout/Navigation';
import Footer from '@/components/layout/Footer';

const DashboardSiswa = () => {
  const status = {
    no_pendaftaran: 'PPDB2024001',
    status: 'pending',
    tanggal_daftar: '15 Januari 2025',
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <div className="section-padding">
        <div className="container-custom max-w-4xl">
          <h1 className="text-3xl font-bold mb-8">Dashboard Siswa</h1>
          
          <Card>
            <CardHeader>
              <CardTitle>Status Pendaftaran</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <span className="text-foreground">Nomor Pendaftaran:</span>
                  <p className="text-2xl font-bold text-primary">{status.no_pendaftaran}</p>
                </div>
                <div>
                  <span className="text-foreground">Status:</span>
                  <div className="mt-2">
                    <Badge className="bg-warning">{status.status}</Badge>
                  </div>
                </div>
                <div>
                  <span className="text-foreground">Tanggal Daftar:</span>
                  <p className="font-medium">{status.tanggal_daftar}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default DashboardSiswa;

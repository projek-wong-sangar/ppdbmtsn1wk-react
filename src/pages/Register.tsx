import { useState } from 'react';
import { Link } from 'react-router-dom';
import Navigation from '@/components/layout/Navigation';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { CheckCircle2 } from 'lucide-react';
import Step1DataDiri from '@/components/register/Step1DataDiri';
import Step2Alamat from '@/components/register/Step2Alamat';
import Step3AsalSekolah from '@/components/register/Step3AsalSekolah';
import Step4OrangTua from '@/components/register/Step4OrangTua';
import Step5Berkas from '@/components/register/Step5Berkas';
import Step6Verifikasi from '@/components/register/Step6Verifikasi';
import { PendaftaranData } from '@/services/pendaftaranService';

const Register = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<Partial<PendaftaranData>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [noPendaftaran, setNoPendaftaran] = useState('');

  const totalSteps = 6;
  const progress = (currentStep / totalSteps) * 100;

  const steps = [
    { number: 1, title: 'Data Diri', component: Step1DataDiri },
    { number: 2, title: 'Alamat & Kontak', component: Step2Alamat },
    { number: 3, title: 'Asal Sekolah', component: Step3AsalSekolah },
    { number: 4, title: 'Data Orang Tua', component: Step4OrangTua },
    { number: 5, title: 'Upload Berkas', component: Step5Berkas },
    { number: 6, title: 'Verifikasi', component: Step6Verifikasi },
  ];

  const handleNext = (data: Partial<PendaftaranData>) => {
    setFormData((prev) => ({ ...prev, ...data }));
    if (currentStep < totalSteps) {
      setCurrentStep((prev) => prev + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handlePrev = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleSubmitSuccess = (no: string) => {
    setNoPendaftaran(no);
    setIsSubmitted(true);
  };

  const CurrentStepComponent = steps[currentStep - 1].component;

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="section-padding">
          <div className="container-custom max-w-2xl">
            <Card className="border-success">
              <CardHeader className="text-center">
                <div className="w-20 h-20 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle2 className="w-12 h-12 text-success" />
                </div>
                <CardTitle className="text-3xl text-success">Pendaftaran Berhasil!</CardTitle>
                <CardDescription className="text-lg">
                  Selamat, pendaftaran Anda telah berhasil disimpan
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="bg-accent/10 p-6 rounded-lg text-center">
                  <p className="text-sm text-foreground mb-2">Nomor Pendaftaran Anda</p>
                  <p className="text-3xl font-bold text-primary">{noPendaftaran}</p>
                  <p className="text-sm text-foreground mt-2">
                    Simpan nomor ini untuk tracking status pendaftaran
                  </p>
                </div>

                <div className="space-y-3 text-sm text-foreground">
                  <p className="font-medium text-foreground">Langkah Selanjutnya:</p>
                  <ul className="list-disc list-inside space-y-2 ml-2">
                    <li>Login ke dashboard untuk melihat status pendaftaran</li>
                    <li>Pastikan semua berkas sudah terupload dengan benar</li>
                    <li>Tunggu proses verifikasi dari admin (1-3 hari kerja)</li>
                    <li>Cek email Anda secara berkala untuk update status</li>
                  </ul>
                </div>

                <div className="flex flex-col gap-3">
                  <Link to="/login">
                    <Button className="w-full btn-primary">Login ke Dashboard</Button>
                  </Link>
                  <Link to="/">
                    <Button variant="outline" className="w-full">
                      Kembali ke Beranda
                    </Button>
                  </Link>
                </div>
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

      <div className="section-padding bg-gradient-to-br from-primary/5 via-background to-secondary/5">
        <div className="container-custom max-w-4xl">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
              Formulir Pendaftaran
            </h1>
            <p className="text-foreground">
              Lengkapi semua data dengan benar dan teliti
            </p>
          </div>

          {/* Progress Bar */}
          <div className="mb-8">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-foreground">
                Step {currentStep} dari {totalSteps}
              </span>
              <span className="text-sm text-foreground">{Math.round(progress)}% selesai</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>

          {/* Steps Indicator */}
          <div className="mb-8 hidden md:block">
            <div className="flex justify-between">
              {steps.map((step) => (
                <div
                  key={step.number}
                  className={`flex-1 text-center ${
                    step.number < currentStep ? 'opacity-50' : ''
                  }`}
                >
                  <div
                    className={`w-10 h-10 rounded-full mx-auto mb-2 flex items-center justify-center font-bold text-sm ${
                      step.number === currentStep
                        ? 'bg-primary text-primary-foreground'
                        : step.number < currentStep
                        ? 'bg-success text-primary-foreground'
                        : 'bg-muted text-foreground-foreground'
                    }`}
                  >
                    {step.number < currentStep ? '✓' : step.number}
                  </div>
                  <p className="text-xs font-medium">{step.title}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Form Card */}
          <Card>
            <CardHeader>
              <CardTitle>{steps[currentStep - 1].title}</CardTitle>
            </CardHeader>
            <CardContent>
              <CurrentStepComponent
                data={formData}
                onNext={handleNext}
                onPrev={handlePrev}
                onSubmitSuccess={handleSubmitSuccess}
              />
            </CardContent>
          </Card>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Register;

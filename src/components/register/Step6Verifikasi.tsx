import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent } from '@/components/ui/card';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';
import { PendaftaranData, pendaftaranService } from '@/services/pendaftaranService';

interface Props {
  data: Partial<PendaftaranData>;
  onPrev: () => void;
  onSubmitSuccess: (noPendaftaran: string) => void;
}

const Step6Verifikasi = ({ data, onPrev, onSubmitSuccess }: Props) => {
  const [agreed, setAgreed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async () => {
    if (!agreed) {
      toast.error('Harap setujui pernyataan terlebih dahulu');
      return;
    }

    setIsLoading(true);
    try {
      const result = await pendaftaranService.submitPendaftaran(data as PendaftaranData);
      toast.success(result.message);
      onSubmitSuccess(result.no_pendaftaran);
    } catch (error) {
      toast.error('Gagal menyimpan pendaftaran');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <h3 className="font-bold text-lg">Ringkasan Data</h3>
        
        <Card>
          <CardContent className="p-4 space-y-2 text-sm">
            <div className="grid grid-cols-2">
              <span className="text-foreground">Nama:</span>
              <span className="font-medium">{data.nama_lengkap}</span>
            </div>
            <div className="grid grid-cols-2">
              <span className="text-foreground">NISN:</span>
              <span className="font-medium">{data.nisn}</span>
            </div>
            <div className="grid grid-cols-2">
              <span className="text-foreground">Email:</span>
              <span className="font-medium">{data.email}</span>
            </div>
            <div className="grid grid-cols-2">
              <span className="text-foreground">Asal Sekolah:</span>
              <span className="font-medium">{data.asal_sekolah}</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex items-start gap-3 p-4 border border-border rounded-lg">
        <Checkbox id="agree" checked={agreed} onCheckedChange={(checked) => setAgreed(checked as boolean)} />
        <label htmlFor="agree" className="text-sm cursor-pointer leading-relaxed">
          Saya menyatakan bahwa data yang saya isikan adalah benar dan dapat dipertanggungjawabkan. 
          Apabila dikemudian hari terbukti data yang saya isikan tidak benar, saya bersedia menerima sanksi 
          sesuai ketentuan yang berlaku.
        </label>
      </div>

      <div className="flex justify-between">
        <Button type="button" variant="outline" onClick={onPrev} disabled={isLoading}>
          Kembali
        </Button>
        <Button onClick={handleSubmit} className="btn-primary" disabled={isLoading || !agreed}>
          {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Submit Pendaftaran
        </Button>
      </div>
    </div>
  );
};

export default Step6Verifikasi;

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { Upload, FileCheck } from 'lucide-react';
import { PendaftaranData } from '@/services/pendaftaranService';

interface Props {
  data: Partial<PendaftaranData>;
  onNext: (data: Partial<PendaftaranData>) => void;
  onPrev: () => void;
}

const Step5Berkas = ({ data, onNext, onPrev }: Props) => {
  const [files, setFiles] = useState<Record<string, File | null>>({
    foto: null,
    akta_kelahiran: null,
    ijazah: null,
    kartu_keluarga: null,
    ktp_ortu: null,
    surat_pernyataan: null,
  });

  const handleFileChange = (type: string, file: File | null) => {
    setFiles((prev) => ({ ...prev, [type]: file }));
  };

  const handleSubmit = () => {
    // Mock upload - in real app, upload files here
    if (!files.foto || !files.akta_kelahiran || !files.ijazah) {
      toast.error('File wajib belum lengkap');
      return;
    }

    toast.success('File berhasil diupload');
    onNext({
      foto: 'mock-url/foto.jpg',
      akta_kelahiran: 'mock-url/akta.pdf',
      ijazah: 'mock-url/ijazah.pdf',
      kartu_keluarga: 'mock-url/kk.pdf',
      ktp_ortu: 'mock-url/ktp.pdf',
      surat_pernyataan: 'mock-url/surat.pdf',
    });
  };

  const FileUploadField = ({ label, type, accept, maxSize, required }: any) => (
    <div className="space-y-2">
      <Label>{label} {required && '*'}</Label>
      <div className="border-2 border-dashed border-border rounded-lg p-6 text-center hover:border-primary transition-colors">
        <Input
          type="file"
          accept={accept}
          onChange={(e) => handleFileChange(type, e.target.files?.[0] || null)}
          className="hidden"
          id={type}
        />
        <label htmlFor={type} className="cursor-pointer">
          {files[type] ? (
            <div className="flex items-center justify-center gap-2 text-success">
              <FileCheck className="w-5 h-5" />
              <span className="text-sm">{files[type]?.name}</span>
            </div>
          ) : (
            <div className="space-y-2">
              <Upload className="w-8 h-8 mx-auto text-foreground" />
              <p className="text-sm text-foreground">Klik untuk upload</p>
              <p className="text-xs text-foreground">{accept} • Max {maxSize}</p>
            </div>
          )}
        </label>
      </div>
    </div>
  );

  return (
    <div className="space-y-4">
      <FileUploadField
        label="Foto 3x4"
        type="foto"
        accept=".jpg,.png"
        maxSize="500KB"
        required
      />
      <FileUploadField
        label="Akta Kelahiran"
        type="akta_kelahiran"
        accept=".pdf"
        maxSize="1MB"
        required
      />
      <FileUploadField
        label="Ijazah SD/MI"
        type="ijazah"
        accept=".pdf"
        maxSize="1MB"
        required
      />
      <FileUploadField
        label="Kartu Keluarga"
        type="kartu_keluarga"
        accept=".pdf"
        maxSize="1MB"
        required
      />
      <FileUploadField
        label="KTP Orang Tua"
        type="ktp_ortu"
        accept=".pdf"
        maxSize="1MB"
        required
      />
      <FileUploadField
        label="Surat Pernyataan"
        type="surat_pernyataan"
        accept=".pdf"
        maxSize="1MB"
        required
      />

      <div className="flex justify-between pt-4">
        <Button type="button" variant="outline" onClick={onPrev}>Kembali</Button>
        <Button onClick={handleSubmit} className="btn-primary">Selanjutnya</Button>
      </div>
    </div>
  );
};

export default Step5Berkas;

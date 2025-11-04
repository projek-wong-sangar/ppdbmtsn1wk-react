import * as React from 'react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { Upload, FileCheck } from 'lucide-react';
import { PendaftaranData } from '@/services/pendaftaranService';
import { pendaftaranStorage } from '@/utils/pendaftaranStorage';
import { saveDraftStep, loadDraftStep } from '@/utils/pendaftaranStorage';

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

  const [fileErrors, setFileErrors] = useState<Record<string, string>>({});

  // Load/save file drafts (simpan info nama file SEMENTARA di localStorage, bukan isi file)
  React.useEffect(() => {
    const draft = loadDraftStep(5);
    if (draft) {
      setFiles(draft.files || files);
    }
  }, []);
  React.useEffect(() => {
    saveDraftStep(5, { files });
    pendaftaranStorage.saveData({ files });
  }, [files]);

  // Helper function to convert size string to bytes
  const parseSizeToBytes = (sizeStr: string): number => {
    const size = parseFloat(sizeStr);
    if (sizeStr.includes('KB')) return size * 1024;
    if (sizeStr.includes('MB')) return size * 1024 * 1024;
    if (sizeStr.includes('GB')) return size * 1024 * 1024 * 1024;
    return size; // bytes
  };

  // Helper function to format file size
  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const handleFileChange = (type: string, file: File | null, maxSizeStr: string) => {
    if (!file) {
      setFiles((prev) => ({ ...prev, [type]: null }));
      setFileErrors((prev) => ({ ...prev, [type]: '' }));
      return;
    }

    // Validate file size
    const maxSizeBytes = parseSizeToBytes(maxSizeStr);
    if (file.size > maxSizeBytes) {
      setFileErrors((prev) => ({ 
        ...prev, 
        [type]: `Ukuran file terlalu besar. Maksimal ${maxSizeStr}, file Anda ${formatFileSize(file.size)}` 
      }));
      return;
    }

    // Clear error and set file
    setFileErrors((prev) => ({ ...prev, [type]: '' }));
    setFiles((prev) => ({ ...prev, [type]: file }));
    toast.success(`${file.name} berhasil diupload`);
  };

  const handleSubmit = () => {
    // Check for file errors
    const hasErrors = Object.values(fileErrors).some(error => error !== '');
    if (hasErrors) {
      toast.error('Ada file yang tidak valid. Silakan periksa kembali.');
      return;
    }

    // Mock upload - in real app, upload files here
    if (!files.foto || !files.akta_kelahiran || !files.ijazah) {
      toast.error('File wajib belum lengkap');
      return;
    }

    // Simpan data file ke localStorage
    const fileData = {
      foto: 'mock-url/foto.jpg',
      akta_kelahiran: 'mock-url/akta.pdf',
      ijazah: 'mock-url/ijazah.pdf',
      kartu_keluarga: 'mock-url/kk.pdf',
      ktp_ortu: 'mock-url/ktp.pdf',
      surat_pernyataan: 'mock-url/surat.pdf',
    };
    
    pendaftaranStorage.saveData(fileData);
    toast.success('File berhasil diupload');
    onNext(fileData);
  };

  const FileUploadField = ({ label, type, accept, maxSize, required }: any) => (
    <div className="space-y-2">
      <Label>{label} {required && '*'}</Label>
      <div className={`border-2 border-dashed rounded-lg p-6 text-center hover:border-primary transition-colors ${
        fileErrors[type] ? 'border-destructive' : 'border-border'
      }`}>
        <Input
          type="file"
          accept={accept}
          onChange={(e) => handleFileChange(type, e.target.files?.[0] || null, maxSize)}
          className="hidden"
          id={type}
        />
        <label htmlFor={type} className="cursor-pointer">
          {files[type] ? (
            <div className="flex items-center justify-center gap-2 text-success">
              <FileCheck className="w-5 h-5" />
              <div className="text-sm">
                <div className="font-medium">{files[type]?.name}</div>
                <div className="text-xs text-muted-foreground">
                  {formatFileSize(files[type]?.size || 0)}
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-2">
              <Upload className="w-8 h-8 mx-auto text-foreground" />
              <p className="text-sm text-foreground">Klik untuk upload</p>
              <p className="text-xs text-muted-foreground">{accept} • Max {maxSize}</p>
            </div>
          )}
        </label>
      </div>
      {fileErrors[type] && (
        <p className="text-sm text-destructive">{fileErrors[type]}</p>
      )}
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

import { useEffect, useState } from 'react'; // Tambah useState, useEffect
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { PendaftaranData } from '@/services/pendaftaranService';
import { UploadCloud, X, FileText, Image as ImageIcon, Eye } from 'lucide-react';
import { toast } from 'sonner';

interface Props {
  data: Partial<PendaftaranData>;
  onNext: (data: Partial<PendaftaranData>) => void;
  onPrev: () => void;
} 

const MAX_FILE_SIZE = 2 * 1024 * 1024; 

const Step5Berkas = ({ data, onNext, onPrev }: Props) => {
  const { handleSubmit, setValue, watch } = useForm<Partial<PendaftaranData>>({
    defaultValues: data
  });

  // Kita butuh akses ke data form real-time untuk menampilkan preview
  const values = watch();

  const handleFileChange = (key: keyof PendaftaranData) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > MAX_FILE_SIZE) {
        toast.error("File Terlalu Besar", { description: `File "${file.name}" melebihi 2MB.` });
        e.target.value = ''; 
        setValue(key, undefined); 
        return;
      }
      setValue(key, file); // Simpan File object ke form
      toast.success("File dipilih", { description: file.name });
    }
  };

  const onSubmit = (formData: Partial<PendaftaranData>) => {
    onNext(formData);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* ... (Bagian Info Petunjuk Upload tetap sama) ... */}

      <div className="grid md:grid-cols-2 gap-6">
        {/* Pass 'currentFile' agar bisa dipreview */}
        <FileItemWithPreview label="Pas Foto (3x4)" id="foto" onChange={handleFileChange('foto')} currentFile={values.foto} existingUrl={data.foto_url} />
        <FileItemWithPreview label="Akta Kelahiran" id="akta" onChange={handleFileChange('akta')} currentFile={values.akta} existingUrl={data.akta_kelahiran_url} />
        <FileItemWithPreview label="Ijazah / SKL" id="ijazah" onChange={handleFileChange('ijazah')} currentFile={values.ijazah} existingUrl={data.ijazah_url} />
        <FileItemWithPreview label="Kartu Keluarga" id="kk" onChange={handleFileChange('kk')} currentFile={values.kk} existingUrl={data.kartu_keluarga_url} />
        <FileItemWithPreview label="KTP Orang Tua" id="ktp" onChange={handleFileChange('ktp')} currentFile={values.ktp} existingUrl={data.ktp_ortu_url} />
        <FileItemWithPreview label="Surat Pernyataan" id="surat" onChange={handleFileChange('surat')} currentFile={values.surat} existingUrl={data.surat_pernyataan_url} />
      </div>

      <div className="flex justify-between pt-4">
        <Button type="button" variant="outline" onClick={onPrev}>Kembali</Button>
        <Button type="submit" className="btn-primary">Lanjut ke Verifikasi</Button>
      </div>
    </form>
  );
};

// --- COMPONENT BARU: File Item dengan Preview ---
const FileItemWithPreview = ({ label, id, onChange, currentFile, existingUrl }: any) => {
  const [preview, setPreview] = useState<string | null>(null);
  const [fileType, setFileType] = useState<'image' | 'pdf' | null>(null);

  // Efek untuk generate preview URL dari File Object (Client Side)
  useEffect(() => {
    if (currentFile instanceof File) {
      const objectUrl = URL.createObjectURL(currentFile);
      setPreview(objectUrl);
      setFileType(currentFile.type.includes('image') ? 'image' : 'pdf');
      
      // Cleanup memory saat component unmount/file ganti
      return () => URL.revokeObjectURL(objectUrl);
    } else if (existingUrl) {
      // Jika tidak ada file baru tapi ada URL dari database (Server Side)
      setPreview(existingUrl);
      const isImg = existingUrl.match(/\.(jpeg|jpg|png)$/i);
      setFileType(isImg ? 'image' : 'pdf');
    } else {
      setPreview(null);
    }
  }, [currentFile, existingUrl]);

  return (
    <Card className={`transition-all ${preview ? 'border-primary/40 bg-primary/5' : 'hover:border-primary/50'}`}>
      <CardContent className="pt-6 pb-4">
        <div className="flex justify-between items-start mb-2">
            <Label htmlFor={id} className="block font-medium text-sm text-muted-foreground">{label}</Label>
            {preview && (
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-green-100 text-green-700">
                    {currentFile ? 'Siap Upload' : 'Tersimpan'}
                </span>
            )}
        </div>

        {/* INPUT FILE */}
        <div className="relative">
            <Input 
                id={id} 
                type="file" 
                accept=".jpg,.jpeg,.png,.pdf"
                onChange={onChange}
                className="cursor-pointer file:text-primary file:font-medium file:bg-primary/10 file:rounded-md file:px-2 file:mr-2 hover:file:bg-primary/20 transition-all pr-10"
            />
             {/* Tampilkan checkmark jika file sudah ada */}
             {preview && <div className="absolute right-3 top-2.5 text-green-600 pointer-events-none"><UploadCloud className="w-4 h-4" /></div>}
        </div>

        {/* PREVIEW AREA */}
        {preview && (
            <div className="mt-3 p-2 bg-background rounded border border-dashed border-muted-foreground/30 flex items-center gap-3">
                {fileType === 'image' ? (
                    <img src={preview} alt="Preview" className="h-12 w-12 object-cover rounded-md border" />
                ) : (
                    <div className="h-12 w-12 flex items-center justify-center bg-red-50 rounded-md border text-red-500">
                        <FileText className="w-6 h-6" />
                    </div>
                )}
                
                <div className="overflow-hidden flex-1">
                    <p className="text-xs font-medium truncate">
                        {currentFile ? currentFile.name : "File tersimpan di server"}
                    </p>
                    <p className="text-[10px] text-muted-foreground">
                        {currentFile ? (currentFile.size / 1024 / 1024).toFixed(2) + ' MB' : 'Klik tombol lihat untuk cek detail'}
                    </p>
                </div>

                {/* Tombol Lihat (sangat berguna untuk PDF atau gambar full) */}
                <Button variant="ghost" size="icon" type="button" onClick={() => window.open(preview, '_blank')}>
                    <Eye className="w-4 h-4 text-primary" />
                </Button>
            </div>
        )}
      </CardContent>
    </Card>
  );
};

export default Step5Berkas;
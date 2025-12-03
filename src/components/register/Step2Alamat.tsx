import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import WilayahDropdown from '@/components/ui/wilayah-dropdown-autocomplete';
import { PendaftaranData } from '@/services/pendaftaranService';
import { Provinsi, Kota, Kecamatan, Kelurahan } from '@/services/wilayahService';
import { pendaftaranStorage } from '@/utils/pendaftaranStorage';
import * as React from 'react';
import { saveDraftStep, loadDraftStep } from '@/utils/pendaftaranStorage';
// Hapus cekService karena tidak lagi diperlukan di sini
// import { cekService } from '@/services/cekService';

const schema = z.object({
  alamat: z.string().min(10, 'Alamat minimal 10 karakter'),
  rt: z.string().min(1, 'RT wajib diisi').regex(/^\d{3}$/, 'RT harus berupa 3 digit angka'),
  rw: z.string().min(1, 'RW wajib diisi').regex(/^\d{3}$/, 'RW harus berupa 3 digit angka'),
  desa: z.string().min(2, 'Desa/Kelurahan wajib diisi'),
  kecamatan: z.string().min(2, 'Kecamatan wajib diisi'),
  kabupaten: z.string().min(2, 'Kabupaten wajib diisi'),
  provinsi: z.string().min(2, 'Provinsi wajib diisi'),
  kode_pos: z.string().min(5, 'Kode pos minimal 5 digit').regex(/^\d{5}$/, 'Kode pos harus berupa 5 digit angka'),
  no_hp: z.string().min(10, 'Nomor HP minimal 10 digit').regex(/^\d{10,15}$/, 'Nomor HP harus 10-15 digit angka'),
  email: z.string().email('Email tidak valid'), // Tetap divalidasi, tapi nilainya dari props
  // Wilayah IDs
  provinsi_id: z.number().optional(),
  kota_id: z.number().optional(),
  kecamatan_id: z.number().optional(),
  kelurahan_id: z.number().optional(),
});

type FormData = z.infer<typeof schema>;

interface Props {
  data: Partial<PendaftaranData>;
  onNext: (data: Partial<PendaftaranData>) => void;
  onPrev: () => void;
}

const Step2Alamat = ({ data, onNext, onPrev }: Props) => {
  const { register, handleSubmit, setValue, watch, reset, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: data as FormData,
  });

  const values = watch();

  // Load draf dari local storage
  React.useEffect(() => {
    const draft = loadDraftStep(2);
    if (draft) {
      // Pastikan data email dari server (props 'data') tidak tertimpa draf
      reset({ ...draft, email: data.email });
    } else {
      reset(data as FormData);
    }
  }, [data, reset]);

  // Auto-save draf
  React.useEffect(() => {
    const subscription = watch((values) => {
      saveDraftStep(2, values);
      pendaftaranStorage.saveData(values);
    });
    return () => subscription.unsubscribe();
  }, [watch]);

  // --- Fungsi Wilayah (tidak berubah) ---
  const handleProvinsiChange = (provinsi: Provinsi | null) => {
    if (provinsi) {
      setValue('provinsi', provinsi.nama, { shouldValidate: true });
      setValue('provinsi_id', provinsi.id);
    } else {
      setValue('provinsi', '');
      setValue('provinsi_id', undefined);
    }
  };
  const handleKotaChange = (kota: Kota | null) => {
    if (kota) {
      setValue('kabupaten', kota.nama, { shouldValidate: true });
      setValue('kota_id', kota.id);
    } else {
      setValue('kabupaten', '');
      setValue('kota_id', undefined);
    }
  };
  const handleKecamatanChange = (kecamatan: Kecamatan | null) => {
    if (kecamatan) {
      setValue('kecamatan', kecamatan.nama, { shouldValidate: true });
      setValue('kecamatan_id', kecamatan.id);
    } else {
      setValue('kecamatan', '');
      setValue('kecamatan_id', undefined);
    }
  };
  const handleKelurahanChange = (kelurahan: Kelurahan | null) => {
    if (kelurahan) {
      setValue('desa', kelurahan.nama, { shouldValidate: true });
      setValue('kelurahan_id', kelurahan.id);
    } else {
      setValue('desa', '');
      setValue('kelurahan_id', undefined);
    }
  };
  // --- Akhir Fungsi Wilayah ---


  // --- PERUBAHAN 2: Hapus cek email di onSubmit ---
  const onSubmit = async (formData: FormData) => {
    saveDraftStep(2, formData);
    pendaftaranStorage.saveData(formData);

    // Cek email tidak diperlukan lagi, user sudah login
    // if (await cekService.cekEmail(formData.email)) { ... }

    // Gabungkan data form dengan data awal (email)
    const finalData = { ...data, ...formData };
    onNext(finalData as Partial<PendaftaranData>);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <Label htmlFor="alamat">Alamat Lengkap (Sesuai KK) *</Label>
        <Textarea id="alamat" {...register('alamat')} rows={3} placeholder="Contoh: Jl. Merdeka No. 10..." />
        {errors.alamat && <p className="text-sm text-destructive mt-1">{errors.alamat.message}</p>}
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="rt">RT *</Label>
          <Input id="rt" {...register('rt')} placeholder="001" maxLength={3} />
          {errors.rt && <p className="text-sm text-destructive mt-1">{errors.rt.message}</p>}
        </div>
        <div>
          <Label htmlFor="rw">RW *</Label>
          <Input id="rw" {...register('rw')} placeholder="002" maxLength={3} />
          {errors.rw && <p className="text-sm text-destructive mt-1">{errors.rw.message}</p>}
        </div>
      </div>

      {/* --- PERBAIKAN 3: Perbaiki props defaultValues --- */}
      <WilayahDropdown
        onProvinsiChange={handleProvinsiChange}
        onKotaChange={handleKotaChange}
        onKecamatanChange={handleKecamatanChange}
        onKelurahanChange={handleKelurahanChange}
        errorProvinsi={errors.provinsi?.message}
        errorKota={errors.kabupaten?.message}
        errorKecamatan={errors.kecamatan?.message}
        errorKelurahan={errors.desa?.message}
        // Kirim nilai default (jika ada) ke dropdown
        defaultValues={{
          provinsi: values.provinsi,
          kabupaten: values.kabupaten, // <-- Fix 1: ganti 'kota' jadi 'kabupaten'
          kecamatan: values.kecamatan,
          kelurahan: values.desa      // <-- Fix 2: ganti 'desa' jadi 'kelurahan'
        }}
      />

      {/* Hidden inputs untuk validasi Zod */}
      <input type="hidden" {...register('provinsi')} />
      <input type="hidden" {...register('kabupaten')} />
      <input type="hidden" {...register('kecamatan')} />
      <input type="hidden" {...register('desa')} />
      <input type="hidden" {...register('provinsi_id')} />
      <input type="hidden" {...register('kota_id')} />
      <input type="hidden" {...register('kecamatan_id')} />
      <input type="hidden" {...register('kelurahan_id')} />

      <div>
        <Label htmlFor="kode_pos">Kode Pos *</Label>
        <Input id="kode_pos" {...register('kode_pos')} placeholder="34771" maxLength={5} />
        {errors.kode_pos && <p className="text-sm text-destructive mt-1">{errors.kode_pos.message}</p>}
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="no_hp">Nomor HP (WhatsApp) *</Label>
          <Input id="no_hp" {...register('no_hp')} placeholder="081234567890" />
          {errors.no_hp && <p className="text-sm text-destructive mt-1">{errors.no_hp.message}</p>}
        </div>
        
        {/* --- PERUBAHAN 1: Buat Email Read-Only --- */}
        <div>
          <Label htmlFor="email">Email</Label>
          <Input 
            id="email" 
            type="email" 
            {...register('email')} 
            disabled 
            className="opacity-70 cursor-not-allowed"
          />
          {errors.email && <p className="text-sm text-destructive mt-1">{errors.email.message}</p>}
          <p className="text-xs text-muted-foreground mt-1">Email tidak dapat diubah.</p>
        </div>
      </div>

      <div className="flex justify-between pt-4">
        <Button type="button" variant="outline" onClick={onPrev}>Kembali</Button>
        <Button type="submit" className="btn-primary">Selanjutnya</Button>
      </div>
    </form>
  );
};

export default Step2Alamat;
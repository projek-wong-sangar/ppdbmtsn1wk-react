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
import { cekService } from '@/services/cekService';

// Validasi Zod yang lama - dikomentari untuk development
const schema = z.object({
  alamat: z.string().min(10, 'Alamat minimal 10 karakter'),
  rt: z.string().min(1, 'RT wajib diisi').regex(/^\d{3}$/, 'RT harus berupa 3 digit angka'),
  rw: z.string().min(1, 'RW wajib diisi').regex(/^\d{3}$/, 'RW harus berupa 3 digit angka'),
  desa: z.string().min(2, 'Desa/Kelurahan wajib diisi'),
  kecamatan: z.string().min(2, 'Kecamatan wajib diisi'),
  kabupaten: z.string().min(2, 'Kabupaten wajib diisi'),
  provinsi: z.string().min(2, 'Provinsi wajib diisi'),
  kode_pos: z.string().min(5, 'Kode pos minimal 5 digit').regex(/^\d{5}$/, 'Kode pos harus berupa 5 digit angka'),
  no_hp: z.string().min(10, 'Nomor HP minimal 10 digit').regex(/^\d{10}$/, 'Nomor HP harus berupa 10 digit angka'),
  email: z.string().email('Email tidak valid'),
  // Wilayah IDs untuk referensi database
  provinsi_id: z.number().optional(),
  kota_id: z.number().optional(),
  kecamatan_id: z.number().optional(),
  kelurahan_id: z.number().optional(),
});

// Schema sementara dengan semua field optional untuk development
// const schema = z.object({
//   alamat: z.string().optional(),
//   rt: z.string().optional(),
//   rw: z.string().optional(),
//   desa: z.string().optional(),
//   kecamatan: z.string().optional(),
//   kabupaten: z.string().optional(),
//   provinsi: z.string().optional(),
//   kode_pos: z.string().optional(),
//   no_hp: z.string().optional(),
//   email: z.string().optional(),
//   provinsi_id: z.number().optional(),
//   kota_id: z.number().optional(),
//   kecamatan_id: z.number().optional(),
//   kelurahan_id: z.number().optional(),
// });

type FormData = z.infer<typeof schema>;

interface Props {
  data: Partial<PendaftaranData>;
  onNext: (data: Partial<PendaftaranData>) => void;
  onPrev: () => void;
}

const Step2Alamat = ({ data, onNext, onPrev }: Props) => {
  const { register, handleSubmit, setValue, setError, watch, reset, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: data as FormData,
  });

  React.useEffect(() => {
    const draft = loadDraftStep(2);
    if (draft) reset(draft);
  }, [reset]);

  React.useEffect(() => {
    const subscription = watch((values) => {
      saveDraftStep(2, values);
      pendaftaranStorage.saveData(values);
    });
    return () => subscription.unsubscribe();
  }, [watch]);

  const handleProvinsiChange = (provinsi: Provinsi | null) => {
    if (provinsi) {
      setValue('provinsi', provinsi.nama);
      setValue('provinsi_id', provinsi.id);
    } else {
      setValue('provinsi', '');
      setValue('provinsi_id', undefined);
    }
  };

  const handleKotaChange = (kota: Kota | null) => {
    if (kota) {
      setValue('kabupaten', kota.nama);
      setValue('kota_id', kota.id);
    } else {
      setValue('kabupaten', '');
      setValue('kota_id', undefined);
    }
  };

  const handleKecamatanChange = (kecamatan: Kecamatan | null) => {
    if (kecamatan) {
      setValue('kecamatan', kecamatan.nama);
      setValue('kecamatan_id', kecamatan.id);
    } else {
      setValue('kecamatan', '');
      setValue('kecamatan_id', undefined);
    }
  };

  const handleKelurahanChange = (kelurahan: Kelurahan | null) => {
    if (kelurahan) {
      setValue('desa', kelurahan.nama);
      setValue('kelurahan_id', kelurahan.id);
    } else {
      setValue('desa', '');
      setValue('kelurahan_id', undefined);
    }
  };

  // Note: Kode pos auto-fill disabled as API endpoint not available
  // const handleKodePosChange = (kodePos: string) => {
  //   setValue('kode_pos', kodePos);
  // };

  const onSubmit = async (formData: FormData) => {
    saveDraftStep(2, formData);
    pendaftaranStorage.saveData(formData);

    // Pastikan email diisi
    if (!formData.email) {
      setError('email', { type: 'manual', message: 'Email wajib diisi' });
      return;
    }
    // Cek unik ke backend
    if (await cekService.cekEmail(formData.email)) {
      setError('email', { type: 'manual', message: 'Email sudah terdaftar' });
      return;
    }
    onNext(formData as Partial<PendaftaranData>);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <Label htmlFor="alamat">Alamat Lengkap *</Label>
        <Textarea id="alamat" {...register('alamat')} rows={3} />
        {errors.alamat && <p className="text-sm text-destructive mt-1">{errors.alamat.message}</p>}
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="rt">RT *</Label>
          <Input id="rt" {...register('rt')} placeholder="001" />
          {errors.rt && <p className="text-sm text-destructive mt-1">{errors.rt.message}</p>}
        </div>
        <div>
          <Label htmlFor="rw">RW *</Label>
          <Input id="rw" {...register('rw')} placeholder="002" />
          {errors.rw && <p className="text-sm text-destructive mt-1">{errors.rw.message}</p>}
        </div>
      </div>

      {/* Dropdown Wilayah */}
      <WilayahDropdown
        onProvinsiChange={handleProvinsiChange}
        onKotaChange={handleKotaChange}
        onKecamatanChange={handleKecamatanChange}
        onKelurahanChange={handleKelurahanChange}
        errorProvinsi={errors.provinsi?.message}
        errorKota={errors.kabupaten?.message}
        errorKecamatan={errors.kecamatan?.message}
        errorKelurahan={errors.desa?.message}
        // onKodePosChange={handleKodePosChange} // Disabled as API not available
      />

      {/* Hidden inputs untuk validasi */}
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
        <Input id="kode_pos" {...register('kode_pos')} placeholder="34771" />
        {errors.kode_pos && <p className="text-sm text-destructive mt-1">{errors.kode_pos.message}</p>}
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="no_hp">Nomor HP *</Label>
          <Input id="no_hp" {...register('no_hp')} placeholder="081234567890" />
          {errors.no_hp && <p className="text-sm text-destructive mt-1">{errors.no_hp.message}</p>}
        </div>
        <div>
          <Label htmlFor="email">Email *</Label>
          <Input id="email" type="email" {...register('email')} placeholder="nama@email.com" />
          {errors.email && <p className="text-sm text-destructive mt-1">{errors.email.message}</p>}
        </div>
      </div>

      <div className="flex justify-between">
        <Button type="button" variant="outline" onClick={onPrev}>Kembali</Button>
        <Button type="submit" className="btn-primary">Selanjutnya</Button>
      </div>
    </form>
  );
};

export default Step2Alamat;

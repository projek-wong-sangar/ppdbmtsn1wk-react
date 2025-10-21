import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { PendaftaranData } from '@/services/pendaftaranService';

const schema = z.object({
  alamat: z.string().min(10, 'Alamat minimal 10 karakter'),
  rt: z.string().min(1, 'RT wajib diisi'),
  rw: z.string().min(1, 'RW wajib diisi'),
  desa: z.string().min(2, 'Desa/Kelurahan wajib diisi'),
  kecamatan: z.string().min(2, 'Kecamatan wajib diisi'),
  kabupaten: z.string().min(2, 'Kabupaten wajib diisi'),
  provinsi: z.string().min(2, 'Provinsi wajib diisi'),
  kode_pos: z.string().min(5, 'Kode pos minimal 5 digit'),
  no_hp: z.string().min(10, 'Nomor HP minimal 10 digit'),
  email: z.string().email('Email tidak valid'),
});

type FormData = z.infer<typeof schema>;

interface Props {
  data: Partial<PendaftaranData>;
  onNext: (data: Partial<PendaftaranData>) => void;
  onPrev: () => void;
}

const Step2Alamat = ({ data, onNext, onPrev }: Props) => {
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: data as FormData,
  });

  return (
    <form onSubmit={handleSubmit(onNext)} className="space-y-4">
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

      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="desa">Desa/Kelurahan *</Label>
          <Input id="desa" {...register('desa')} />
          {errors.desa && <p className="text-sm text-destructive mt-1">{errors.desa.message}</p>}
        </div>
        <div>
          <Label htmlFor="kecamatan">Kecamatan *</Label>
          <Input id="kecamatan" {...register('kecamatan')} />
          {errors.kecamatan && <p className="text-sm text-destructive mt-1">{errors.kecamatan.message}</p>}
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="kabupaten">Kabupaten *</Label>
          <Input id="kabupaten" {...register('kabupaten')} />
          {errors.kabupaten && <p className="text-sm text-destructive mt-1">{errors.kabupaten.message}</p>}
        </div>
        <div>
          <Label htmlFor="provinsi">Provinsi *</Label>
          <Input id="provinsi" {...register('provinsi')} />
          {errors.provinsi && <p className="text-sm text-destructive mt-1">{errors.provinsi.message}</p>}
        </div>
      </div>

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

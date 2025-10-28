import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { PendaftaranData } from '@/services/pendaftaranService';

const schema = z.object({
  asal_sekolah: z.string().min(5, 'Nama sekolah minimal 5 karakter'),
  npsn_sekolah: z.string().min(8, 'NPSN minimal 8 digit'),
  alamat_sekolah: z.string().min(10, 'Alamat sekolah minimal 10 karakter'),
  tahun_lulus: z.string().min(4, 'Tahun lulus wajib diisi'),
  no_ijazah: z.string().min(5, 'Nomor ijazah wajib diisi'),
});

type FormData = z.infer<typeof schema>;

interface Props {
  data: Partial<PendaftaranData>;
  onNext: (data: Partial<PendaftaranData>) => void;
  onPrev: () => void;
}

const Step3AsalSekolah = ({ data, onNext, onPrev }: Props) => {
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: data as FormData,
  });

  return (
    <form onSubmit={handleSubmit(onNext)} className="space-y-4">
      <div>
        <Label htmlFor="asal_sekolah">Nama Sekolah SD/MI *</Label>
        <Input id="asal_sekolah" {...register('asal_sekolah')} placeholder="SDN 1 Way Kanan" />
        {errors.asal_sekolah && <p className="text-sm text-destructive mt-1">{errors.asal_sekolah.message}</p>}
      </div>

      <div>
        <Label htmlFor="npsn_sekolah">NPSN Sekolah *</Label>
        <Input id="npsn_sekolah" {...register('npsn_sekolah')} placeholder="12345678" />
        {errors.npsn_sekolah && <p className="text-sm text-destructive mt-1">{errors.npsn_sekolah.message}</p>}
      </div>

      <div>
        <Label htmlFor="alamat_sekolah">Alamat Sekolah *</Label>
        <Textarea id="alamat_sekolah" {...register('alamat_sekolah')} rows={3} />
        {errors.alamat_sekolah && <p className="text-sm text-destructive mt-1">{errors.alamat_sekolah.message}</p>}
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="tahun_lulus">Tahun Lulus *</Label>
          <Input id="tahun_lulus" {...register('tahun_lulus')} placeholder="2024" />
          {errors.tahun_lulus && <p className="text-sm text-destructive mt-1">{errors.tahun_lulus.message}</p>}
        </div>
        <div>
          <Label htmlFor="no_ijazah">Nomor Ijazah *</Label>
          <Input id="no_ijazah" {...register('no_ijazah')} placeholder="DN-01/D-SD/K13/24/0000007" />
          {errors.no_ijazah && <p className="text-sm text-destructive mt-1">{errors.no_ijazah.message}</p>}
        </div>
      </div>

      <div className="flex justify-between">
        <Button type="button" variant="outline" onClick={onPrev}>Kembali</Button>
        <Button type="submit" className="btn-primary">Selanjutnya</Button>
      </div>
    </form>
  );
};

export default Step3AsalSekolah;

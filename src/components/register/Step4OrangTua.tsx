import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { PendaftaranData } from '@/services/pendaftaranService';
import { Separator } from '@/components/ui/separator';

const schema = z.object({
  nama_ayah: z.string().min(3,'Nama Ayah minimal 3 karakter'),
  nik_ayah: z.string().min(16).max(16,'NIK Ayah minimal 16 digit'),
  pekerjaan_ayah: z.string().min(3,'Pekerjaan Ayah minimal 3 karakter'),
  penghasilan_ayah: z.string().min(1,'Penghasilan Ayah waijib diisi'),
  pendidikan_ayah: z.string().min(1,'Pendidikan Ayah waijib diisi'),
  no_hp_ayah: z.string().min(10,'Nomor HP Ayah minimal 10 digit'),
  nama_ibu: z.string().min(3,'Nama Ibu minimal 3 karakter'),
  nik_ibu: z.string().min(16).max(16,'NIK Ibu minimal 16 digit'),
  pekerjaan_ibu: z.string().min(3,'Pekerjaan Ibu minimal 3 karakter'),
  penghasilan_ibu: z.string().min(1,'Penghasilan Ibu waijib diisi'),
  pendidikan_ibu: z.string().min(1,'Pendidikan Ibu waijib diisi'),
  no_hp_ibu: z.string().min(10,'Nomor HP Ibu minimal 10 digit'),
  nama_wali: z.string().min(3,'Nama Wali minimal 3 karakter'),
  nik_wali: z.string().min(16).max(16,'NIK Wali minimal 16 digit'),
  pekerjaan_wali: z.string().min(3,'Pekerjaan Wali minimal 3 karakter'),
  penghasilan_wali: z.string().min(1,'Penghasilan Wali waijib diisi'),
  pendidikan_wali: z.string().min(1,'Pendidikan Wali waijib diisi'),
  no_hp_wali: z.string().min(10,'Nomor HP Wali minimal 10 digit'),
  hubungan_wali: z.string().min(1,'Hubungan Wali waijib diisi'),
});

type FormData = z.infer<typeof schema>;

interface Props {
  data: Partial<PendaftaranData>;
  onNext: (data: Partial<PendaftaranData>) => void;
  onPrev: () => void;
}

const Step4OrangTua = ({ data, onNext, onPrev }: Props) => {
  const { register, handleSubmit, formState: { errors }, setValue } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: data as FormData,
  });

  const penghasilanOptions = [
    '< Rp 1.000.000',
    'Rp 1.000.000 - Rp 3.000.000',
    'Rp 3.000.000 - Rp 5.000.000',
    '> Rp 5.000.000',
  ];

  const pendidikanOptions = ['SD', 'SMP', 'SMA', 'D3', 'S1', 'S2', 'S3'];

  return (
    <form onSubmit={handleSubmit(onNext)} className="space-y-6">
      {/* Data Ayah */}
      <div className="space-y-4">
        <h3 className="text-lg font-bold text-foreground">Data Ayah</h3>
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <Label>Nama Ayah *</Label>
            <Input {...register('nama_ayah')} />
            {errors.nama_ayah && <p className="text-sm text-destructive mt-1">{errors.nama_ayah.message}</p>}
          </div>
          <div>
            <Label>NIK Ayah *</Label>
            <Input {...register('nik_ayah')} />
            {errors.nik_ayah && <p className="text-sm text-destructive mt-1">{errors.nik_ayah.message}</p>}
          </div>
          <div>
            <Label>Pekerjaan *</Label>
            <Input {...register('pekerjaan_ayah')} />
            {errors.pekerjaan_ayah && <p className="text-sm text-destructive mt-1">{errors.pekerjaan_ayah.message}</p>}
          </div>
          <div>
            <Label>Penghasilan *</Label>
            <Select onValueChange={(v) => setValue('penghasilan_ayah', v)} defaultValue={data.penghasilan_ayah}>
              <SelectTrigger><SelectValue placeholder="Pilih" /></SelectTrigger>
              <SelectContent>
                {penghasilanOptions.map((o) => <SelectItem key={o} value={o}>{o}</SelectItem>)}
              </SelectContent>
            </Select>
            {errors.penghasilan_ayah && <p className="text-sm text-destructive mt-1">{errors.penghasilan_ayah.message}</p>}
          </div>
          <div>
            <Label>Pendidikan *</Label>
            <Select onValueChange={(v) => setValue('pendidikan_ayah', v)} defaultValue={data.pendidikan_ayah}>
              <SelectTrigger><SelectValue placeholder="Pilih" /></SelectTrigger>
              <SelectContent>
                {pendidikanOptions.map((o) => <SelectItem key={o} value={o}>{o}</SelectItem>)}
              </SelectContent>
            </Select>
            {errors.pendidikan_ayah && <p className="text-sm text-destructive mt-1">{errors.pendidikan_ayah.message}</p>}
          </div>
          <div>
            <Label>Nomor HP *</Label>
            <Input {...register('no_hp_ayah')} />
            {errors.no_hp_ayah && <p className="text-sm text-destructive mt-1">{errors.no_hp_ayah.message}</p>}
          </div>
        </div>
      </div>

      <Separator />

      {/* Data Ibu */}
      <div className="space-y-4">
        <h3 className="text-lg font-bold text-foreground">Data Ibu</h3>
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <Label>Nama Ibu *</Label>
            <Input {...register('nama_ibu')} />
            {errors.nama_ibu && <p className="text-sm text-destructive mt-1">{errors.nama_ibu.message}</p>}
          </div>
          <div>
            <Label>NIK Ibu *</Label>
            <Input {...register('nik_ibu')} />
            {errors.nik_ibu && <p className="text-sm text-destructive mt-1">{errors.nik_ibu.message}</p>}
          </div>
          <div>
            <Label>Pekerjaan *</Label>
            <Input {...register('pekerjaan_ibu')} />
            {errors.pekerjaan_ibu && <p className="text-sm text-destructive mt-1">{errors.pekerjaan_ibu.message}</p>}
          </div>
          <div>
            <Label>Penghasilan *</Label>
            <Select onValueChange={(v) => setValue('penghasilan_ibu', v)} defaultValue={data.penghasilan_ibu}>
              <SelectTrigger><SelectValue placeholder="Pilih" /></SelectTrigger>
              <SelectContent>
                {penghasilanOptions.map((o) => <SelectItem key={o} value={o}>{o}</SelectItem>)}
              </SelectContent>
            </Select>
            {errors.penghasilan_ibu && <p className="text-sm text-destructive mt-1">{errors.penghasilan_ibu.message}</p>}
          </div>
          <div>
            <Label>Pendidikan *</Label>
            <Select onValueChange={(v) => setValue('pendidikan_ibu', v)} defaultValue={data.pendidikan_ibu}>
              <SelectTrigger><SelectValue placeholder="Pilih" /></SelectTrigger>
              <SelectContent>
                {pendidikanOptions.map((o) => <SelectItem key={o} value={o}>{o}</SelectItem>)}
              </SelectContent>
            </Select>
            {errors.pendidikan_ibu && <p className="text-sm text-destructive mt-1">{errors.pendidikan_ibu.message}</p>}
          </div>
          <div>
            <Label>Nomor HP *</Label>
            <Input {...register('no_hp_ibu')} />
            {errors.no_hp_ibu && <p className="text-sm text-destructive mt-1">{errors.no_hp_ibu.message}</p>}
          </div>
        </div>
      </div>

      <div className="flex justify-between">
        <Button type="button" variant="outline" onClick={onPrev}>Kembali</Button>
        <Button type="submit" className="btn-primary">Selanjutnya</Button>
      </div>
    </form>
  );
};

export default Step4OrangTua;

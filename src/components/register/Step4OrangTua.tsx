import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { PendaftaranData } from '@/services/pendaftaranService';
import { Separator } from '@/components/ui/separator';
import { pendaftaranStorage } from '@/utils/pendaftaranStorage';
import { useState, useEffect } from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import * as React from 'react';
import { saveDraftStep, loadDraftStep } from '@/utils/pendaftaranStorage';

const schema = z
  .object({
    nama_ayah: z.string().min(3,'Nama Ayah minimal 3 karakter'),
    nik_ayah: z.string().length(16, 'NIK harus 16 digit').regex(/^[0-9]{16}$/, 'NIK harus berupa 16 digit angka'),
    pekerjaan_ayah: z.string().min(3,'Pekerjaan Ayah minimal 3 karakter'),
    penghasilan_ayah: z.string({ required_error: 'Penghasilan Ayah wajib diisi' }).min(1, 'Penghasilan Ayah wajib diisi'),
    pendidikan_ayah: z.string({ required_error: 'Pendidikan Ayah wajib diisi' }).min(1, 'Pendidikan Ayah wajib diisi'),
    no_hp_ayah: z.string().min(10, 'Nomor HP Ayah minimal 10 digit').max(14, 'Nomor HP Ayah maksimal 14 digit').regex(/^\d{10,14}$/, 'Nomor HP Ayah harus berupa angka'),

    nama_ibu: z.string().min(3,'Nama Ibu minimal 3 karakter'),
    nik_ibu: z.string().length(16, 'NIK harus 16 digit').regex(/^[0-9]{16}$/, 'NIK harus berupa 16 digit angka'),
    pekerjaan_ibu: z.string().min(3,'Pekerjaan Ibu minimal 3 karakter'),
    penghasilan_ibu: z.string({ required_error: 'Penghasilan Ibu wajib diisi' }).min(1, 'Penghasilan Ibu wajib diisi'),
    pendidikan_ibu: z.string({ required_error: 'Pendidikan Ibu wajib diisi' }).min(1, 'Pendidikan Ibu wajib diisi'),
    no_hp_ibu: z.string().min(10, 'Nomor HP Ibu minimal 10 digit').max(14, 'Nomor HP Ibu maksimal 14 digit').regex(/^\d{10,14}$/, 'Nomor HP Ibu harus berupa angka'),

    // Wali (opsional secara field, tapi akan diatur oleh checkbox & superRefine)
    nama_wali: z.string().optional(),
    nik_wali: z.string().optional(),
    pekerjaan_wali: z.string().optional(),
    penghasilan_wali: z.string().optional(),
    pendidikan_wali: z.string().optional(),
    no_hp_wali: z.string().optional(),
    hubungan_wali: z.string().optional(),

    // Checkbox pengendali
    tinggal_dengan_wali: z.boolean().optional().default(false),
  })
  .superRefine((val, ctx) => {
    const waliKeys = [
      'nama_wali',
      'nik_wali',
      'pekerjaan_wali',
      'penghasilan_wali',
      'pendidikan_wali',
      'no_hp_wali',
      'hubungan_wali',
    ] as const;

    const isFilled = (v: unknown) => typeof v === 'string' && v.trim().length > 0;
    const tinggalDenganWali = Boolean((val as any).tinggal_dengan_wali);

    const filledCount = waliKeys.reduce(
      (acc, k) => acc + (isFilled((val as any)[k]) ? 1 : 0),
      0
    );

    if (tinggalDenganWali) {
      // Jika tinggal dengan wali → semua field wali WAJIB
      if (filledCount < waliKeys.length) {
        waliKeys.forEach((k) => {
          if (!isFilled((val as any)[k])) {
            ctx.addIssue({
              code: z.ZodIssueCode.custom,
              path: [k],
              message: 'Wajib diisi karena tinggal bersama wali',
            });
          }
        });
        return;
      }
    } else {
      // Jika tidak tinggal dengan wali, abaikan validasi field wali
      return;
    }

    // Validasi minimum saat semua field wali terisi
    const v: any = val;
    if (v.nama_wali.trim().length < 3) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, path: ['nama_wali'], message: 'Nama Wali minimal 3 karakter' });
    }
    if (String(v.nik_wali).length !== 16) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, path: ['nik_wali'], message: 'NIK Wali harus 16 digit' });
    }
    if (v.pekerjaan_wali.trim().length < 3) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, path: ['pekerjaan_wali'], message: 'Pekerjaan Wali minimal 3 karakter' });
    }
    if (!isFilled(v.penghasilan_wali)) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, path: ['penghasilan_wali'], message: 'Penghasilan Wali wajib diisi' });
    }
    if (!isFilled(v.pendidikan_wali)) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, path: ['pendidikan_wali'], message: 'Pendidikan Wali wajib diisi' });
    }
    const hpDigits = String(v.no_hp_wali || '').replace(/\D/g, '');
    if (hpDigits.length < 10) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, path: ['no_hp_wali'], message: 'Nomor HP Wali minimal 10 digit' });
    }
    if (!isFilled(v.hubungan_wali)) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, path: ['hubungan_wali'], message: 'Hubungan Wali wajib diisi' });
    }
  });

// Schema sementara dengan semua field optional untuk development
// const schema = z.object({
//   nama_ayah: z.string().optional(),
//   nik_ayah: z.string().optional(),
//   pekerjaan_ayah: z.string().optional(),
//   penghasilan_ayah: z.string().optional(),
//   pendidikan_ayah: z.string().optional(),
//   no_hp_ayah: z.string().optional(),
//   nama_ibu: z.string().optional(),
//   nik_ibu: z.string().optional(),
//   pekerjaan_ibu: z.string().optional(),
//   penghasilan_ibu: z.string().optional(),
//   pendidikan_ibu: z.string().optional(),
//   no_hp_ibu: z.string().optional(),
//   nama_wali: z.string().optional(),
//   nik_wali: z.string().optional(),
//   pekerjaan_wali: z.string().optional(),
//   penghasilan_wali: z.string().optional(),
//   pendidikan_wali: z.string().optional(),
//   no_hp_wali: z.string().optional(),
//   hubungan_wali: z.string().optional(),
// });

type FormData = z.infer<typeof schema>;

interface Props {
  data: Partial<PendaftaranData>;
  onNext: (data: Partial<PendaftaranData>) => void;
  onPrev: () => void;
}

const Step4OrangTua = ({ data, onNext, onPrev }: Props) => {
  const { register, handleSubmit, setValue, watch, reset, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: data as FormData,
  });

  React.useEffect(() => {
    const draft = loadDraftStep(4);
    if (draft) reset(draft);
  }, [reset]);

  useEffect(() => {
    const subscription = watch((values) => {
      saveDraftStep(4, values);
      pendaftaranStorage.saveData(values);
    });
    return () => subscription.unsubscribe();
  }, [watch]);

  // Sync hubungan_wali state with form value
  const hubunganWaliValue = watch('hubungan_wali');
  useEffect(() => {
    if (hubunganWaliValue && !HubunganWaliOptions.includes(hubunganWaliValue)) {
      setIsHubunganLainnya(true);
      setHubunganWaliPilihan('Lainnya');
    } else if (hubunganWaliValue) {
      setIsHubunganLainnya(false);
      setHubunganWaliPilihan(hubunganWaliValue);
    } else {
      setIsHubunganLainnya(false);
      setHubunganWaliPilihan('');
    }
  }, [hubunganWaliValue]);

  const tinggalDenganWali = watch('tinggal_dengan_wali') || false;

  const penghasilanOptions = [
    '< Rp 1.000.000',
    'Rp 1.000.000 - Rp 3.000.000',
    'Rp 3.000.000 - Rp 5.000.000',
    '> Rp 5.000.000',
  ];

  const pendidikanOptions = ['SD', 'SMP', 'SMA', 'D3', 'S1', 'S2', 'S3'];

  const HubunganWaliOptions = [
    'Kakek',
    'Nenek',
    'Paman',
    'Bibi',
    'Kakak',
    'Saudara Kandung',
    'Saudara Sepupu',
    'Tetangga',
    'Guru Ngaji',
    'Lainnya',
  ];
  const [hubunganWaliPilihan, setHubunganWaliPilihan] = useState<string>(data.hubungan_wali ?? '');
  const [isHubunganLainnya, setIsHubunganLainnya] = useState<boolean>((data.hubungan_wali ?? '') !== '' && !HubunganWaliOptions.includes(data.hubungan_wali as string));


  const onSubmit = (formData: FormData) => {
    saveDraftStep(4, formData);
    onNext(formData as Partial<PendaftaranData>);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
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
            <Select onValueChange={(v) => setValue('penghasilan_ayah', v, { shouldValidate: true })} defaultValue={data.penghasilan_ayah || ""}>
              <SelectTrigger><SelectValue placeholder="Pilih" /></SelectTrigger>
              <SelectContent>
                {penghasilanOptions.map((o) => <SelectItem key={o} value={o}>{o}</SelectItem>)}
              </SelectContent>
            </Select>
            {errors.penghasilan_ayah && <p className="text-sm text-destructive mt-1">{errors.penghasilan_ayah.message}</p>}
          </div>
          <div>
            <Label>Pendidikan *</Label>
            <Select onValueChange={(v) => setValue('pendidikan_ayah', v, { shouldValidate: true })} defaultValue={data.pendidikan_ayah || ""}>
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
            <Select onValueChange={(v) => setValue('penghasilan_ibu', v, { shouldValidate: true })} defaultValue={data.penghasilan_ibu || ""}>
              <SelectTrigger><SelectValue placeholder="Pilih" /></SelectTrigger>
              <SelectContent>
                {penghasilanOptions.map((o) => <SelectItem key={o} value={o}>{o}</SelectItem>)}
              </SelectContent>
            </Select>
            {errors.penghasilan_ibu && <p className="text-sm text-destructive mt-1">{errors.penghasilan_ibu.message}</p>}
          </div>
          <div>
            <Label>Pendidikan *</Label>
            <Select onValueChange={(v) => setValue('pendidikan_ibu', v, { shouldValidate: true })} defaultValue={data.pendidikan_ibu || ""}>
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
      <Separator />
      {/* Data Wali */}
      <div className="space-y-4">
        <h3 className="text-lg font-bold text-foreground">Data Wali</h3>
        <p className="text-xs text-muted-foreground -mt-2">
          Opsional. Centang jika tinggal bersama wali. Jika dicentang, semua data wali wajib diisi.
          Jika tidak memiliki orang tua, harap centang ini dan isi lengkap data wali.
        </p>
        <div className="flex items-center gap-2 pt-2">
          <Checkbox
            checked={tinggalDenganWali}
            onCheckedChange={(v) => {
              const on = Boolean(v);
              setValue('tinggal_dengan_wali', on, { shouldValidate: true });
              if (!on) {
                ['nama_wali','nik_wali','pekerjaan_wali','penghasilan_wali','pendidikan_wali','no_hp_wali','hubungan_wali']
                  .forEach((k) => setValue(k as any, undefined, { shouldValidate: true }));
              }
            }}
            id="tinggal_dengan_wali"
          />
          <Label htmlFor="tinggal_dengan_wali">Tinggal bersama wali</Label>
        </div>
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <Label>Nama Wali</Label>
            <Input {...register('nama_wali')} disabled={!tinggalDenganWali} />
            {errors.nama_wali && <p className="text-sm text-destructive mt-1">{errors.nama_wali.message}</p>}
          </div>
          <div>
            <Label>NIK Wali</Label>
            <Input {...register('nik_wali')} disabled={!tinggalDenganWali} />
            {errors.nik_wali && <p className="text-sm text-destructive mt-1">{errors.nik_wali.message}</p>}
          </div>
          <div>
            <Label>Pekerjaan</Label>
            <Input {...register('pekerjaan_wali')} disabled={!tinggalDenganWali} />
            {errors.pekerjaan_wali && <p className="text-sm text-destructive mt-1">{errors.pekerjaan_wali.message}</p>}
          </div>
          <div>
            <Label>Penghasilan</Label>
            <Select onValueChange={(v) => setValue('penghasilan_wali', v, { shouldValidate: true })} defaultValue={data.penghasilan_wali}>
              <SelectTrigger disabled={!tinggalDenganWali}><SelectValue placeholder="Pilih" /></SelectTrigger>
              <SelectContent>
                {penghasilanOptions.map((o) => <SelectItem key={o} value={o}>{o}</SelectItem>)}
              </SelectContent>
            </Select>
            {errors.penghasilan_wali && <p className="text-sm text-destructive mt-1">{errors.penghasilan_wali.message}</p>}
          </div>
          <div>
            <Label>Pendidikan</Label>
            <Select onValueChange={(v) => setValue('pendidikan_wali', v, { shouldValidate: true })} defaultValue={data.pendidikan_wali}>
              <SelectTrigger disabled={!tinggalDenganWali}><SelectValue placeholder="Pilih" /></SelectTrigger>
              <SelectContent>
                {pendidikanOptions.map((o) => <SelectItem key={o} value={o}>{o}</SelectItem>)}
              </SelectContent>
            </Select>
            {errors.pendidikan_wali && <p className="text-sm text-destructive mt-1">{errors.pendidikan_wali.message}</p>}
          </div>
          <div>
            <Label>Nomor HP</Label>
            <Input {...register('no_hp_wali')} disabled={!tinggalDenganWali} />
            {errors.no_hp_wali && <p className="text-sm text-destructive mt-1">{errors.no_hp_wali.message}</p>}
          </div>
          <div>
            <Label>Hubungan Wali</Label>
            <Select
              onValueChange={(v) => {
                setHubunganWaliPilihan(v);
                const isLainnya = v === 'Lainnya';
                setIsHubunganLainnya(isLainnya);
                setValue('hubungan_wali', isLainnya ? '' : v, { shouldValidate: true });
              }}
              defaultValue={HubunganWaliOptions.includes((data.hubungan_wali as string) || '') ? data.hubungan_wali : undefined}
            >
              <SelectTrigger disabled={!tinggalDenganWali}><SelectValue placeholder="Pilih" /></SelectTrigger>
              <SelectContent>
                {HubunganWaliOptions.map((o) => <SelectItem key={o} value={o}>{o}</SelectItem>)}
              </SelectContent>
            </Select>
            {isHubunganLainnya && (
              <div className="mt-2">
                <Input placeholder="Tulis hubungan wali" {...register('hubungan_wali')} disabled={!tinggalDenganWali} />
                <p className="text-xs text-muted-foreground mt-1">Contoh: Orang tua asuh, Pengurus panti, Tetangga dsb.</p>
              </div>
            )}
            {errors.hubungan_wali && <p className="text-sm text-destructive mt-1">{errors.hubungan_wali.message}</p>}
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

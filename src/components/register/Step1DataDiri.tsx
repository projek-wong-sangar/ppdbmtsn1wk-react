import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { PendaftaranData } from '@/services/pendaftaranService';
import { pendaftaranStorage } from '@/utils/pendaftaranStorage';
import React, { useState, useEffect } from 'react';
import { saveDraftStep, loadDraftStep } from '@/utils/pendaftaranStorage';
import { cekService } from '@/services/cekService';
import { toast } from 'sonner';

import { CalendarIcon, ChevronDown } from "lucide-react";
import { format } from "date-fns";
import { id as idLocale } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

const schema = z.object({
  nama_lengkap: z.string(),
  nisn: z.string().length(10, 'NISN harus 10 digit').regex(/^[0-9]{10}$/, 'NISN harus berupa 10 digit angka'),
  nik: z.string().length(16, 'NIK harus 16 digit').regex(/^[0-9]{16}$/, 'NIK harus berupa 16 digit angka'),
  tempat_lahir: z.string().min(2, 'Tempat lahir minimal 2 karakter').regex(/^[a-zA-Z\s]+$/, 'Tempat lahir hanya boleh berisi huruf dan spasi'),
  tanggal_lahir: z
    .string({ required_error: 'Tanggal lahir wajib diisi' })
    .min(1, 'Tanggal lahir wajib diisi')
    .refine((v) => {
      if (!v) return false;
      const birthDate = new Date(v);
      if (isNaN(birthDate.getTime())) return false;

      const currentYear = new Date().getFullYear();
      const cutoffDate = new Date(currentYear, 6, 1); // 1 Juli

      let age = cutoffDate.getFullYear() - birthDate.getFullYear();
      const m = cutoffDate.getMonth() - birthDate.getMonth();
      
      if (m < 0 || (m === 0 && cutoffDate.getDate() < birthDate.getDate())) {
        age--;
      }
      return age <= 15;
    }, { message: 'Umur maksimal 15 tahun pada tanggal 1 Juli tahun ini' }),
    jenis_kelamin: z.preprocess(
      (val) => (val === '' ? undefined : val),
      z.enum(['L', 'P'], { 
        required_error: 'Jenis kelamin wajib dipilih'
      })
    ),
  agama: z.string({ required_error: 'Agama wajib diisi' }).min(1, 'Agama wajib diisi'),
  
  anak_ke: z.preprocess(
    (val) => (val === '' ? undefined : Number(val)),
    z.number({ required_error: 'Anak ke wajib diisi' }).min(1, 'Anak ke minimal 1')
  ),
  jumlah_saudara: z.preprocess(
    (val) => (val === '' ? undefined : Number(val)),
    z.number({ required_error: 'Jumlah saudara wajib diisi' }).min(0, 'Jumlah saudara minimal 0')
  ),
});

type FormData = z.infer<typeof schema>;

interface Props {
  data: Partial<PendaftaranData>;
  onNext: (data: Partial<PendaftaranData>) => void;
  onPrev: () => void;
}

const Step1DataDiri = ({ data, onNext }: Props) => {

  const isNewData = (data.nik === '' || !data.nik);

  const { register, handleSubmit, formState: { errors }, setValue, setError, reset, watch, trigger } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
        ...data as FormData,
        anak_ke: (isNewData && data.anak_ke === 0) ? undefined : data.anak_ke,
        jumlah_saudara: (isNewData && data.jumlah_saudara === 0) ? undefined : data.jumlah_saudara,
    },
  });

  const [calendarOpen, setCalendarOpen] = useState(false);
  const [date, setDate] = useState<Date | undefined>(() => {
    if (data.tanggal_lahir) {
      const d = new Date(data.tanggal_lahir);
      return isNaN(d.getTime()) ? undefined : d;
    }
    return undefined;
  });

  useEffect(() => {
    const localDraft = loadDraftStep(1);
    if (localDraft) {
      reset({ 
        ...localDraft, 
        nama_lengkap: data.nama_lengkap, 
        nisn: data.nisn 
      });
      
      if (localDraft.tanggal_lahir) {
        const d = new Date(localDraft.tanggal_lahir);
        if (!isNaN(d.getTime())) setDate(d);
      }
    }
  }, [data, reset]);

  useEffect(() => {
    const subscription = watch((values) => {
      saveDraftStep(1, values);
      pendaftaranStorage.saveData(values);
    });
    return () => subscription.unsubscribe();
  }, [watch]);

  const jenisKelaminOptions = ['L', 'P'];
  const agamaOptions = ['Islam', 'Kristen', 'Katolik', 'Hindu', 'Buddha', 'Konghucu'];

  const onSubmit = async (formData: FormData) => {
    saveDraftStep(1, formData);
    pendaftaranStorage.saveData(formData);

    try {
        if (isNewData) {
            const nikTaken = await cekService.cekNik(formData.nik);
            if (nikTaken) {
            setError('nik', { type: 'manual', message: 'NIK sudah terdaftar' });
            return;
            }
        }
    } catch (err) {
        toast.error("Gagal validasi NIK", { description: "Gagal terhubung ke server untuk cek NIK." });
        return;
    }
    
    const finalData = { ...data, ...formData };
    onNext(finalData as Partial<PendaftaranData>);
  };

  const handleNumberInput = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === '-' || e.key === 'e' || e.key === 'E' || e.key === '+') {
      e.preventDefault();
    }
  };
  const handleNumberPaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    const pastedText = e.clipboardData.getData('text');
    if (pastedText.includes('-') || isNaN(Number(pastedText)) || Number(pastedText) < 0) {
      e.preventDefault();
    }
  };

  return (
    <form noValidate onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      
      <div>
        <Label htmlFor="nama_lengkap">Nama Lengkap</Label>
        <Input 
            id="nama_lengkap" 
            {...register('nama_lengkap')} 
            disabled 
            className="opacity-70 cursor-not-allowed"
        />
        <p className="text-xs text-muted-foreground mt-1">Nama diambil dari data registrasi awal.</p>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="nisn">NISN</Label>
            <Input 
                id="nisn" 
                {...register('nisn')} 
                disabled 
                className="opacity-70 cursor-not-allowed"
            />
            <p className="text-xs text-muted-foreground mt-1">NISN tidak dapat diubah.</p>
          </div>
          
          <div>
            <Label htmlFor="nik">NIK (Siswa) *</Label>
            <Input id="nik" {...register('nik')} placeholder="16 Digit NIK dari KK" />
            {errors.nik && <p className="text-sm text-destructive mt-1">{errors.nik.message}</p>}
          </div>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="tempat_lahir">Tempat Lahir *</Label>
          <Input id="tempat_lahir" {...register('tempat_lahir')} />
          {errors.tempat_lahir && <p className="text-sm text-destructive mt-1">{errors.tempat_lahir.message}</p>}
        </div>
        
        <div className="flex flex-col gap-1">
          <Label htmlFor="tanggal_lahir">Tanggal Lahir *</Label>
          <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                id="tanggal_lahir"
                className={cn(
                  "w-full justify-between font-normal text-left px-3",
                  !date && "text-muted-foreground",
                  errors.tanggal_lahir && "border-destructive text-destructive"
                )}
              >
                {date ? (
                    format(date, "d MMMM yyyy", { locale: idLocale })
                ) : (
                    <span>Pilih tanggal lahir</span>
                )}
                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={date}
                captionLayout="dropdown"
                startMonth={new Date(2010, 0)} 
                endMonth={new Date(2015, 0)}
                onSelect={(selectedDate) => {
                  if (selectedDate) {
                    setDate(selectedDate);
                    setValue('tanggal_lahir', format(selectedDate, 'yyyy-MM-dd'), { shouldValidate: true });
                    setCalendarOpen(false);
                  }
                }}
                initialFocus
              />
            </PopoverContent>
          </Popover>
          <input type="hidden" {...register('tanggal_lahir')} />
          
          {errors.tanggal_lahir && (
            <p className="text-sm text-destructive mt-1">{errors.tanggal_lahir.message}</p>
          )}
        </div>

      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="jenis_kelamin">Jenis Kelamin *</Label>
          <Select onValueChange={(value) => setValue('jenis_kelamin', value as 'L' | 'P')} defaultValue={data.jenis_kelamin}>
            <SelectTrigger>
              <SelectValue placeholder="Pilih" />
            </SelectTrigger>
            <SelectContent>
            {jenisKelaminOptions.map((o) => <SelectItem key={o} value={o}>{o === 'L' ? 'Laki-laki' : 'Perempuan'}</SelectItem>)}
            </SelectContent>
          </Select>
          {errors.jenis_kelamin && <p className="text-sm text-destructive mt-1">{errors.jenis_kelamin.message}</p>}
        </div>
        <div>
          <Label htmlFor="agama">Agama *</Label>
          <Select onValueChange={(value) => setValue('agama', value, { shouldValidate: true })} defaultValue={data.agama || ""}>
            <SelectTrigger>
              <SelectValue placeholder="Pilih" />
            </SelectTrigger>
            <SelectContent>
              {agamaOptions.map((o) => <SelectItem key={o} value={o}>{o}</SelectItem>)}
            </SelectContent>
          </Select>
          {errors.agama && <p className="text-sm text-destructive mt-1">{errors.agama.message}</p>}
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="anak_ke">Anak Ke- *</Label>
          <Input 
            id="anak_ke" 
            type="number" 
            min="1" 
            onKeyDown={handleNumberInput}
            onPaste={handleNumberPaste}
            {...register('anak_ke')} 
          />
          {errors.anak_ke && <p className="text-sm text-destructive mt-1">{errors.anak_ke.message}</p>}
        </div>
        <div>
          <Label htmlFor="jumlah_saudara">Jumlah Saudara *</Label>
          <Input 
            id="jumlah_saudara" 
            type="number" 
            min="0" 
            onKeyDown={handleNumberInput}
            onPaste={handleNumberPaste}
            {...register('jumlah_saudara')} 
          />
          {errors.jumlah_saudara && <p className="text-sm text-destructive mt-1">{errors.jumlah_saudara.message}</p>}
        </div>
      </div>

      <div className="flex justify-end pt-4">
        <Button type="submit" className="btn-primary">Selanjutnya</Button>
      </div>
    </form>
  );
};

export default Step1DataDiri;
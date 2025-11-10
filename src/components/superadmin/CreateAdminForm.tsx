import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  RadioGroup,
  RadioGroupItem
} from '@/components/ui/radio-group';
import { DialogFooter } from '@/components/ui/dialog';
import { Loader2, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';
import { adminService } from '@/services/adminService';
import { AdminCreateRequest } from '@/models/admin'; // <-- Kita impor tipe ini

// Skema validasi Zod (Tidak berubah)
const formSchema = z.object({
  nama: z.string().min(3, { message: "Nama wajib diisi (min. 3 karakter)." }),
  email: z.string().email({ message: "Format email tidak valid." }),
  role: z.enum(['admin', 'superadmin'], {
    required_error: "Role wajib dipilih.",
  }),
  password: z.string().min(8, { message: "Password minimal 8 karakter." }),
});

// --- PERBAIKAN UTAMA DI SINI ---
// 1. Hapus 'type FormValues = z.infer<typeof formSchema>;'
// 2. Ganti namanya menjadi 'AdminFormValues' dan pastikan ia = AdminCreateRequest
type AdminFormValues = AdminCreateRequest;
// --- AKHIR PERBAIKAN ---


interface CreateAdminFormProps {
  onSuccess: () => void;
}

export const CreateAdminForm: React.FC<CreateAdminFormProps> = ({ onSuccess }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 3. Gunakan 'AdminFormValues' sebagai tipe generic untuk useForm
  const form = useForm<AdminFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nama: '',
      email: '',
      role: 'admin', 
      password: '',
    },
  });

  // Fungsi untuk generate password acak
  const generatePassword = () => {
    const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*';
    let newPassword = '';
    for (let i = 0; i < 12; i++) {
      newPassword += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    form.setValue('password', newPassword);
    toast.info('Password baru telah di-generate');
  };

  // 4. Gunakan 'AdminFormValues' sebagai tipe data di onSubmit
  const onSubmit = async (data: AdminFormValues) => {
    setIsSubmitting(true);
    try {
      // 5. Baris ini sekarang 100% aman karena 'data' sudah bertipe 'AdminCreateRequest'
      await adminService.createAdmin(data); 
      onSuccess();
    } catch (err: any) {
      if (err.response?.status === 409) {
        form.setError('email', {
          type: 'manual',
          message: 'Email ini sudah terdaftar. Gunakan email lain.',
        });
        toast.error('Gagal membuat admin', {
          description: 'Email ini sudah terdaftar.',
        });
      } else {
        toast.error('Gagal membuat admin', {
          description: (err as Error).message,
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        {/* ... (Semua FormField Anda tidak berubah) ... */}
        <FormField
          control={form.control}
          name="nama"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nama Lengkap</FormLabel>
              <FormControl>
                <Input placeholder="contoh: Admin Verifikator" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input type="email" placeholder="admin@email.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="role"
          render={({ field }) => (
            <FormItem className="space-y-3">
              <FormLabel>Peran Akun</FormLabel>
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  className="flex flex-col space-y-1"
                >
                  <FormItem className="flex items-center space-x-3 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="admin" />
                    </FormControl>
                    <FormLabel className="font-normal">
                      Admin
                      <FormDescription className="!mt-0">
                        Bisa me-review dan memverifikasi pendaftar.
                      </FormDescription>
                    </FormLabel>
                  </FormItem>
                  <FormItem className="flex items-center space-x-3 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="superadmin" />
                    </FormControl>
                    <FormLabel className="font-normal">
                      Superadmin
                      <FormDescription className="!mt-0">
                        Akses penuh, termasuk menambah admin lain.
                      </FormDescription>
                    </FormLabel>
                  </FormItem>
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <div className="flex gap-2">
                  <Input type="text" placeholder="Min. 8 karakter" {...field} />
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={generatePassword}
                  >
                    <RefreshCw className="h-4 w-4" />
                  </Button>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <DialogFooter>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Simpan
          </Button>
        </DialogFooter>
      </form>
    </Form>
  );
};
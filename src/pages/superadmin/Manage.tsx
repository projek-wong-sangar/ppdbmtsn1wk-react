import React, { useState, useEffect } from 'react';
import Navigation from '@/components/layout/Navigation';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from '@/components/ui/badge';
import { Loader2, UserPlus, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { AdminUserResponse } from '@/models/admin';
import { adminService } from '@/services/adminService';
import { CreateAdminForm } from '@/components/superadmin/CreateAdminForm';

const ManageAdmin = () => {
  const [admins, setAdmins] = useState<AdminUserResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [deleteDialog, setDeleteDialog] = useState<{ isOpen: boolean; admin?: AdminUserResponse }>({ isOpen: false });

  // Fungsi untuk memuat data admin
  const fetchAdmins = async () => {
    try {
      setLoading(true);
      const data = await adminService.listAdmins();
      setAdmins(data);
      setError(null);
    } catch (err) {
      setError('Gagal memuat data admin.');
      toast.error('Gagal memuat data admin', {
        description: (err as Error).message,
      });
    } finally {
      setLoading(false);
    }
  };

  // Muat data saat komponen di-mount
  useEffect(() => {
    fetchAdmins();
  }, []);

  // Handler setelah admin baru berhasil dibuat
  const handleAdminCreated = () => {
    setIsCreateDialogOpen(false); // Tutup dialog form
    toast.success('Admin baru berhasil dibuat!');
    fetchAdmins(); // Muat ulang data tabel
  };

  // Handler untuk menghapus admin
  const handleDeleteAdmin = async () => {
    if (!deleteDialog.admin) return;

    try {
      await adminService.deleteAdmin(deleteDialog.admin.id);
      toast.success(`Admin "${deleteDialog.admin.nama}" berhasil dihapus.`);
      setDeleteDialog({ isOpen: false }); // Tutup dialog konfirmasi
      fetchAdmins(); // Muat ulang data tabel
    } catch (err) {
      toast.error('Gagal menghapus admin', {
        description: (err as Error).message,
      });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <div className="section-padding container-custom">
        
        {/* --- 1. Header Halaman (Sama seperti Dashboard) --- */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold">Manajemen Admin</h1>
          <p className="text-muted-foreground mt-1 text-sm">
            Tambah, lihat, atau hapus akun admin dan superadmin.
          </p>
        </div>

        {/* --- 2. Blok Aksi (Sama seperti Filter Box di Dashboard) --- */}
        <div className="bg-card rounded-2xl border border-border shadow-sm p-6">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-semibold">Tindakan</h2>
            
            <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
              <DialogTrigger asChild>
                <Button className="gap-2">
                  <UserPlus className="h-4 w-4" />
                  Tambah Admin Baru
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Buat Akun Admin Baru</DialogTitle>
                  <DialogDescription>
                    Isi detail di bawah ini untuk menambah admin baru.
                  </DialogDescription>
                </DialogHeader>
                <CreateAdminForm onSuccess={handleAdminCreated} />
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* --- 3. Blok Tabel (Sama seperti Table Wrapper di Dashboard) --- */}
        <div className="mt-6 bg-card rounded-2xl border border-border shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <Table> {/* Menggunakan <Table> Shadcn lebih baik dari <table> biasa */}
              <TableHeader className="bg-muted/50">
                <TableRow>
                  <TableHead>Nama</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Dibuat</TableHead>
                  <TableHead className="text-right">Tindakan</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={5} className="h-64 text-center">
                      <div className="flex justify-center items-center">
                        <Loader2 className="h-8 w-8 animate-spin text-primary" />
                      </div>
                    </TableCell>
                  </TableRow>
                ) : error ? (
                  <TableRow>
                    <TableCell colSpan={5} className="h-64 text-center text-destructive">
                      {error}
                    </TableCell>
                  </TableRow>
                ) : admins.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="h-64 text-center">
                      Belum ada data admin.
                    </TableCell>
                  </TableRow>
                ) : (
                  admins.map((admin) => (
                    <TableRow key={admin.id}>
                      <TableCell className="font-medium">{admin.nama}</TableCell>
                      <TableCell>{admin.email}</TableCell>
                      <TableCell>
                        <Badge variant={admin.role === 'superadmin' ? 'default' : 'outline'}>
                          {admin.role}
                        </Badge>
                      </TableCell>
                      <TableCell>{admin.created_at}</TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-destructive hover:text-destructive"
                          onClick={() => setDeleteDialog({ isOpen: true, admin: admin })}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
          {/* Anda bisa menambahkan pagination di sini jika mau, seperti di Dashboard */}
        </div>

      </div>

      {/* Dialog Konfirmasi Hapus */}
      <AlertDialog
        open={deleteDialog.isOpen}
        onOpenChange={(isOpen) => setDeleteDialog({ isOpen })}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Anda yakin ingin menghapus?</AlertDialogTitle>
            <AlertDialogDescription>
              Tindakan ini akan menghapus akun admin:
              <br />
              <strong className="py-2 block">{deleteDialog.admin?.nama} ({deleteDialog.admin?.email})</strong>
              Tindakan ini tidak dapat dibatalkan.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive hover:bg-destructive/90"
              onClick={handleDeleteAdmin}
            >
              Ya, Hapus
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default ManageAdmin;
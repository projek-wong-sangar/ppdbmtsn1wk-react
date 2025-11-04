import { api } from '@/lib/api';

export const cekService = {
  async cekEmail(email: string): Promise<boolean> {
    const res = await api.get('/cek/email', { params: { email } });
    return !!res.data?.exists;
  },
  async cekNisn(nisn: string): Promise<boolean> {
    const res = await api.get('/cek/nisn', { params: { nisn } });
    return !!res.data?.exists;
  },
  async cekNik(nik: string): Promise<boolean> {
    const res = await api.get('/cek/nik', { params: { nik } });
    return !!res.data?.exists;
  },
};

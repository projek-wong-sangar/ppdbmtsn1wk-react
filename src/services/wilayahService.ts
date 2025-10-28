import { wilayahApi } from '@/lib/api';

export interface Provinsi {
  id: number;
  nama: string;
}

export interface Kota {
  id: number;
  nama: string;
}

export interface Kecamatan {
  id: number;
  nama: string;
}

export interface Kelurahan {
  id: number;
  nama: string;
}

export const wilayahService = {
  // Mendapatkan semua provinsi
  async getProvinsi(): Promise<Provinsi[]> {
    try {
      const response = await wilayahApi.get('/wilayah/provinsi');
      return response.data;
    } catch (error) {
      console.error('Error fetching provinsi:', error);
      throw error;
    }
  },

  // Mendapatkan kota berdasarkan provinsi
  async getKota(provinsiId: number): Promise<Kota[]> {
    try {
      const response = await wilayahApi.get(`/wilayah/kota?provinsi_id=${provinsiId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching kota:', error);
      throw error;
    }
  },

  // Mendapatkan kecamatan berdasarkan kota
  async getKecamatan(kotaId: number): Promise<Kecamatan[]> {
    try {
      const response = await wilayahApi.get(`/wilayah/kecamatan?kota_id=${kotaId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching kecamatan:', error);
      throw error;
    }
  },

  // Mendapatkan kelurahan berdasarkan kecamatan
  async getKelurahan(kecamatanId: number): Promise<Kelurahan[]> {
    try {
      const response = await wilayahApi.get(`/wilayah/kelurahan?kecamatan_id=${kecamatanId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching kelurahan:', error);
      throw error;
    }
  },

  // Search functions untuk autocomplete
  async searchProvinsi(query: string): Promise<Provinsi[]> {
    try {
      const response = await wilayahApi.get(`/wilayah/provinsi?search=${encodeURIComponent(query)}`);
      return response.data;
    } catch (error) {
      console.error('Error searching provinsi:', error);
      throw error;
    }
  },

  async searchKota(query: string, provinsiId?: number): Promise<Kota[]> {
    try {
      let url = `/wilayah/kota?search=${encodeURIComponent(query)}`;
      if (provinsiId) {
        url += `&provinsi_id=${provinsiId}`;
      }
      const response = await wilayahApi.get(url);
      return response.data;
    } catch (error) {
      console.error('Error searching kota:', error);
      throw error;
    }
  },

  async searchKecamatan(query: string, kotaId?: number): Promise<Kecamatan[]> {
    try {
      let url = `/wilayah/kecamatan?search=${encodeURIComponent(query)}`;
      if (kotaId) {
        url += `&kota_id=${kotaId}`;
      }
      const response = await wilayahApi.get(url);
      return response.data;
    } catch (error) {
      console.error('Error searching kecamatan:', error);
      throw error;
    }
  },

  async searchKelurahan(query: string, kecamatanId?: number): Promise<Kelurahan[]> {
    try {
      let url = `/wilayah/kelurahan?search=${encodeURIComponent(query)}`;
      if (kecamatanId) {
        url += `&kecamatan_id=${kecamatanId}`;
      }
      const response = await wilayahApi.get(url);
      return response.data;
    } catch (error) {
      console.error('Error searching kelurahan:', error);
      throw error;
    }
  }

  // Note: getKodePos endpoint not available in current API
  // async getKodePos(kelurahanId: number): Promise<{ kode_pos: string }> {
  //   try {
  //     const response = await wilayahApi.get(`/wilayah/kode-pos?kelurahan_id=${kelurahanId}`);
  //     return response.data;
  //   } catch (error) {
  //     console.error('Error fetching kode pos:', error);
  //     throw error;
  //   }
  // }
};

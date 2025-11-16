import React, { useState, useEffect, useCallback } from 'react';
import AutocompleteDropdown from '@/components/ui/autocomplete-dropdown';
import { wilayahService, Provinsi, Kota, Kecamatan, Kelurahan } from '@/services/wilayahService';

interface WilayahDropdownProps {
  onProvinsiChange?: (provinsi: Provinsi | null) => void;
  onKotaChange?: (kota: Kota | null) => void;
  onKecamatanChange?: (kecamatan: Kecamatan | null) => void;
  onKelurahanChange?: (kelurahan: Kelurahan | null) => void;
  onKodePosChange?: (kodePos: string) => void;
  defaultValues?: {
    provinsi?: string;
    kota?: string;
    kabupaten?: string;
    kecamatan?: string;
    kelurahan?: string;
  };
  disabled?: boolean;
  // Error messages
  errorProvinsi?: string;
  errorKota?: string;
  errorKecamatan?: string;
  errorKelurahan?: string;
}

const WilayahDropdown: React.FC<WilayahDropdownProps> = ({
  onProvinsiChange,
  onKotaChange,
  onKecamatanChange,
  onKelurahanChange,
  onKodePosChange,
  defaultValues,
  disabled = false,
  errorProvinsi,
  errorKota,
  errorKecamatan,
  errorKelurahan
}) => {
  // State untuk menyimpan data wilayah
  const [provinsiList, setProvinsiList] = useState<Provinsi[]>([]);
  const [kotaList, setKotaList] = useState<Kota[]>([]);
  const [kecamatanList, setKecamatanList] = useState<Kecamatan[]>([]);
  const [kelurahanList, setKelurahanList] = useState<Kelurahan[]>([]);

  // State untuk nilai input
  const [provinsiValue, setProvinsiValue] = useState<string>(defaultValues?.provinsi || '');
  const [kotaValue, setKotaValue] = useState<string>(defaultValues?.kota || '');
  const [kecamatanValue, setKecamatanValue] = useState<string>(defaultValues?.kecamatan || '');
  const [kelurahanValue, setKelurahanValue] = useState<string>(defaultValues?.kelurahan || '');

  // State untuk menyimpan ID yang dipilih
  const [selectedProvinsiId, setSelectedProvinsiId] = useState<number | null>(null);
  const [selectedKotaId, setSelectedKotaId] = useState<number | null>(null);
  const [selectedKecamatanId, setSelectedKecamatanId] = useState<number | null>(null);
  const [selectedKelurahanId, setSelectedKelurahanId] = useState<number | null>(null);

  const [loading, setLoading] = useState({
    provinsi: false,
    kota: false,
    kecamatan: false,
    kelurahan: false
  });

  // Debounce function untuk search
  const useDebounce = (value: string, delay: number) => {
    const [debouncedValue, setDebouncedValue] = useState(value);

    useEffect(() => {
      const handler = setTimeout(() => {
        setDebouncedValue(value);
      }, delay);

      return () => {
        clearTimeout(handler);
      };
    }, [value, delay]);

    return debouncedValue;
  };

  const debouncedProvinsiValue = useDebounce(provinsiValue, 300);
  const debouncedKotaValue = useDebounce(kotaValue, 300);
  const debouncedKecamatanValue = useDebounce(kecamatanValue, 300);
  const debouncedKelurahanValue = useDebounce(kelurahanValue, 300);

  // Load provinsi on mount
  useEffect(() => {
    loadProvinsi();
  }, []);

  // Search provinsi when user types
  useEffect(() => {
    if (debouncedProvinsiValue.length >= 8) {
      searchProvinsi(debouncedProvinsiValue);
    } else if (debouncedProvinsiValue.length === 0) {
      loadProvinsi();
    }
  }, [debouncedProvinsiValue]);

  // Search kota when user types
  useEffect(() => {
    if (debouncedKotaValue.length >= 8 && selectedProvinsiId) {
      searchKota(debouncedKotaValue, selectedProvinsiId);
    } else if (debouncedKotaValue.length === 0 && selectedProvinsiId) {
      loadKota(selectedProvinsiId);
    }
  }, [debouncedKotaValue, selectedProvinsiId]);

  // Search kecamatan when user types
  useEffect(() => {
    if (debouncedKecamatanValue.length >= 8 && selectedKotaId) {
      searchKecamatan(debouncedKecamatanValue, selectedKotaId);
    } else if (debouncedKecamatanValue.length === 0 && selectedKotaId) {
      loadKecamatan(selectedKotaId);
    }
  }, [debouncedKecamatanValue, selectedKotaId]);

  // Search kelurahan when user types
  useEffect(() => {
    if (debouncedKelurahanValue.length >= 8 && selectedKecamatanId) {
      searchKelurahan(debouncedKelurahanValue, selectedKecamatanId);
    } else if (debouncedKelurahanValue.length === 0 && selectedKecamatanId) {
      loadKelurahan(selectedKecamatanId);
    }
  }, [debouncedKelurahanValue, selectedKecamatanId]);

  const loadProvinsi = async () => {
    setLoading(prev => ({ ...prev, provinsi: true }));
    try {
      const data = await wilayahService.getProvinsi();
      setProvinsiList(data);
    } catch (error) {
      console.error('Error loading provinsi:', error);
    } finally {
      setLoading(prev => ({ ...prev, provinsi: false }));
    }
  };

  const searchProvinsi = async (query: string) => {
    setLoading(prev => ({ ...prev, provinsi: true }));
    try {
      const data = await wilayahService.searchProvinsi(query);
      setProvinsiList(data);
    } catch (error) {
      console.error('Error searching provinsi:', error);
      // Fallback to client-side filtering
      const allProvinsi = await wilayahService.getProvinsi();
      const filtered = allProvinsi.filter(p => 
        p.nama.toLowerCase().includes(query.toLowerCase())
      );
      setProvinsiList(filtered);
    } finally {
      setLoading(prev => ({ ...prev, provinsi: false }));
    }
  };

  const loadKota = async (provinsiId: number) => {
    setLoading(prev => ({ ...prev, kota: true }));
    try {
      const data = await wilayahService.getKota(provinsiId);
      setKotaList(data);
    } catch (error) {
      console.error('Error loading kota:', error);
    } finally {
      setLoading(prev => ({ ...prev, kota: false }));
    }
  };

  const searchKota = async (query: string, provinsiId: number) => {
    setLoading(prev => ({ ...prev, kota: true }));
    try {
      const data = await wilayahService.searchKota(query, provinsiId);
      setKotaList(data);
    } catch (error) {
      console.error('Error searching kota:', error);
      // Fallback to client-side filtering
      const allKota = await wilayahService.getKota(provinsiId);
      const filtered = allKota.filter(k => 
        k.nama.toLowerCase().includes(query.toLowerCase())
      );
      setKotaList(filtered);
    } finally {
      setLoading(prev => ({ ...prev, kota: false }));
    }
  };

  const loadKecamatan = async (kotaId: number) => {
    setLoading(prev => ({ ...prev, kecamatan: true }));
    try {
      const data = await wilayahService.getKecamatan(kotaId);
      setKecamatanList(data);
    } catch (error) {
      console.error('Error loading kecamatan:', error);
    } finally {
      setLoading(prev => ({ ...prev, kecamatan: false }));
    }
  };

  const searchKecamatan = async (query: string, kotaId: number) => {
    setLoading(prev => ({ ...prev, kecamatan: true }));
    try {
      const data = await wilayahService.searchKecamatan(query, kotaId);
      setKecamatanList(data);
    } catch (error) {
      console.error('Error searching kecamatan:', error);
      // Fallback to client-side filtering
      const allKecamatan = await wilayahService.getKecamatan(kotaId);
      const filtered = allKecamatan.filter(k => 
        k.nama.toLowerCase().includes(query.toLowerCase())
      );
      setKecamatanList(filtered);
    } finally {
      setLoading(prev => ({ ...prev, kecamatan: false }));
    }
  };

  const loadKelurahan = async (kecamatanId: number) => {
    setLoading(prev => ({ ...prev, kelurahan: true }));
    try {
      const data = await wilayahService.getKelurahan(kecamatanId);
      setKelurahanList(data);
    } catch (error) {
      console.error('Error loading kelurahan:', error);
    } finally {
      setLoading(prev => ({ ...prev, kelurahan: false }));
    }
  };

  const searchKelurahan = async (query: string, kecamatanId: number) => {
    setLoading(prev => ({ ...prev, kelurahan: true }));
    try {
      const data = await wilayahService.searchKelurahan(query, kecamatanId);
      setKelurahanList(data);
    } catch (error) {
      console.error('Error searching kelurahan:', error);
      // Fallback to client-side filtering
      const allKelurahan = await wilayahService.getKelurahan(kecamatanId);
      const filtered = allKelurahan.filter(k => 
        k.nama.toLowerCase().includes(query.toLowerCase())
      );
      setKelurahanList(filtered);
    } finally {
      setLoading(prev => ({ ...prev, kelurahan: false }));
    }
  };

  const handleProvinsiChange = useCallback((value: string) => {
    setProvinsiValue(value);
  }, []);

  const handleProvinsiSelect = useCallback((provinsi: Provinsi | null) => {
    if (provinsi) {
      setSelectedProvinsiId(provinsi.id);
      onProvinsiChange?.(provinsi);
      
      // Reset dependent selections
      setKotaValue('');
      setKecamatanValue('');
      setKelurahanValue('');
      setSelectedKotaId(null);
      setSelectedKecamatanId(null);
      setSelectedKelurahanId(null);
      onKotaChange?.(null);
      onKecamatanChange?.(null);
      onKelurahanChange?.(null);
    } else {
      setSelectedProvinsiId(null);
      onProvinsiChange?.(null);
      
      // Reset dependent selections
      setKotaValue('');
      setKecamatanValue('');
      setKelurahanValue('');
      setSelectedKotaId(null);
      setSelectedKecamatanId(null);
      setSelectedKelurahanId(null);
      onKotaChange?.(null);
      onKecamatanChange?.(null);
      onKelurahanChange?.(null);
    }
  }, [onProvinsiChange, onKotaChange, onKecamatanChange, onKelurahanChange]);

  const handleKotaChange = useCallback((value: string) => {
    setKotaValue(value);
  }, []);

  const handleKotaSelect = useCallback((kota: Kota | null) => {
    if (kota) {
      setSelectedKotaId(kota.id);
      onKotaChange?.(kota);
      
      // Reset dependent selections
      setKecamatanValue('');
      setKelurahanValue('');
      setSelectedKecamatanId(null);
      setSelectedKelurahanId(null);
      onKecamatanChange?.(null);
      onKelurahanChange?.(null);
    } else {
      setSelectedKotaId(null);
      onKotaChange?.(null);
      
      // Reset dependent selections
      setKecamatanValue('');
      setKelurahanValue('');
      setSelectedKecamatanId(null);
      setSelectedKelurahanId(null);
      onKecamatanChange?.(null);
      onKelurahanChange?.(null);
    }
  }, [onKotaChange, onKecamatanChange, onKelurahanChange]);

  const handleKecamatanChange = useCallback((value: string) => {
    setKecamatanValue(value);
  }, []);

  const handleKecamatanSelect = useCallback((kecamatan: Kecamatan | null) => {
    if (kecamatan) {
      setSelectedKecamatanId(kecamatan.id);
      onKecamatanChange?.(kecamatan);
      
      // Reset dependent selections
      setKelurahanValue('');
      setSelectedKelurahanId(null);
      onKelurahanChange?.(null);
    } else {
      setSelectedKecamatanId(null);
      onKecamatanChange?.(null);
      
      // Reset dependent selections
      setKelurahanValue('');
      setSelectedKelurahanId(null);
      onKelurahanChange?.(null);
    }
  }, [onKecamatanChange, onKelurahanChange]);

  const handleKelurahanChange = useCallback((value: string) => {
    setKelurahanValue(value);
  }, []);

  const handleKelurahanSelect = useCallback((kelurahan: Kelurahan | null) => {
    if (kelurahan) {
      setSelectedKelurahanId(kelurahan.id);
      onKelurahanChange?.(kelurahan);
    } else {
      setSelectedKelurahanId(null);
      onKelurahanChange?.(null);
    }
  }, [onKelurahanChange]);

  return (
    <div className="space-y-4">
      {/* Provinsi */}
      <AutocompleteDropdown
        label="Provinsi *"
        placeholder="Ketik nama provinsi..."
        options={provinsiList}
        value={provinsiValue}
        onValueChange={handleProvinsiChange}
        onSelect={handleProvinsiSelect}
        disabled={disabled}
        loading={loading.provinsi}
        error={errorProvinsi}
      />

      {/* Kota/Kabupaten */}
      <AutocompleteDropdown
        label="Kota/Kabupaten *"
        placeholder="Ketik nama kota/kabupaten..."
        options={kotaList}
        value={kotaValue}
        onValueChange={handleKotaChange}
        onSelect={handleKotaSelect}
        disabled={disabled || !selectedProvinsiId}
        loading={loading.kota}
        error={errorKota}
      />

      {/* Kecamatan */}
      <AutocompleteDropdown
        label="Kecamatan *"
        placeholder="Ketik nama kecamatan..."
        options={kecamatanList}
        value={kecamatanValue}
        onValueChange={handleKecamatanChange}
        onSelect={handleKecamatanSelect}
        disabled={disabled || !selectedKotaId}
        loading={loading.kecamatan}
        error={errorKecamatan}
      />

      {/* Kelurahan/Desa */}
      <AutocompleteDropdown
        label="Kelurahan/Desa *"
        placeholder="Ketik nama kelurahan/desa..."
        options={kelurahanList}
        value={kelurahanValue}
        onValueChange={handleKelurahanChange}
        onSelect={handleKelurahanSelect}
        disabled={disabled || !selectedKecamatanId}
        loading={loading.kelurahan}
        error={errorKelurahan}
      />
    </div>
  );
};

export default WilayahDropdown;

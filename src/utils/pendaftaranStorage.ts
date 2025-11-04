// Utility untuk mengelola data pendaftaran di localStorage
export const pendaftaranStorage = {
  // Key untuk localStorage
  STORAGE_KEY: 'pendaftaran_data',

  // Simpan data ke localStorage
  saveData: (data: Partial<any>) => {
    try {
      const existingData = pendaftaranStorage.getData();
      const mergedData = { ...existingData, ...data };
      localStorage.setItem(pendaftaranStorage.STORAGE_KEY, JSON.stringify(mergedData));
      return true;
    } catch (error) {
      console.error('Error saving to localStorage:', error);
      return false;
    }
  },

  // Ambil data dari localStorage
  getData: (): Partial<any> => {
    try {
      const data = localStorage.getItem(pendaftaranStorage.STORAGE_KEY);
      return data ? JSON.parse(data) : {};
    } catch (error) {
      console.error('Error reading from localStorage:', error);
      return {};
    }
  },

  // Hapus data dari localStorage
  clearData: () => {
    try {
      localStorage.removeItem(pendaftaranStorage.STORAGE_KEY);
      return true;
    } catch (error) {
      console.error('Error clearing localStorage:', error);
      return false;
    }
  },

  // Cek apakah ada data tersimpan
  hasData: (): boolean => {
    const data = pendaftaranStorage.getData();
    return Object.keys(data).length > 0;
  }
};

// Utilitas untuk menyimpan draft pendaftaran per step di localStorage
export function saveDraftStep(step: number, data: any) {
  localStorage.setItem(`ppdb-draft-step${step}`, JSON.stringify(data));
}

export function loadDraftStep(step: number) {
  const data = localStorage.getItem(`ppdb-draft-step${step}`);
  return data ? JSON.parse(data) : null;
}

export function clearAllDrafts() {
  for (let i = 1; i <= 6; i++) {
    localStorage.removeItem(`ppdb-draft-step${i}`);
  }
}

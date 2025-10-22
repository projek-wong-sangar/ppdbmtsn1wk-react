import Navigation from '@/components/layout/Navigation';
import Footer from '@/components/layout/Footer';
import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Search } from 'lucide-react';

interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: 'general' | 'users' | 'vendors' | 'technical';
}

export default function FAQ() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [openItems, setOpenItems] = useState<string[]>([]);

  const faqItems: FAQItem[] = [
    {
      id: '1',
      question: 'Apa itu PPDB MTsN 1 Way Kanan?',
      answer: 'PPDB (Penerimaan Peserta Didik Baru) MTsN 1 Way Kanan adalah proses pendaftaran dan seleksi calon peserta didik baru yang dilaksanakan secara online melalui website ini.',
      category: 'general'
    },
    {
      id: '2',
      question: 'Siapa saja yang dapat mendaftar?',
      answer: 'Siswa lulusan SD/MI atau sederajat pada tahun berjalan atau tahun sebelumnya yang memenuhi persyaratan administrasi dan usia yang ditetapkan.',
      category: 'users'
    },
    {
      id: '3',
      question: 'Kapan jadwal pendaftaran dibuka dan ditutup?',
      answer: 'Jadwal pendaftaran mengacu pada pengumuman resmi di halaman Informasi dan Pengumuman. Mohon cek secara berkala untuk tanggal mulai dan batas akhir pendaftaran.',
      category: 'general'
    },
    {
      id: '4',
      question: 'Bagaimana alur pendaftaran di website ini?',
      answer: 'Buat akun, login, lengkapi data diri, alamat, asal sekolah, data orang tua, unggah berkas, lalu verifikasi dan kirim. Anda dapat memantau status pada halaman Dashboard.',
      category: 'users'
    },
    {
      id: '5',
      question: 'Apakah ada biaya pendaftaran?',
      answer: 'PPDB MTsN 1 Way Kanan tidak memungut biaya pendaftaran (GRATIS). Waspada terhadap penipuan yang mengatasnamakan panitia.',
      category: 'general'
    },
    {
      id: '6',
      question: 'Apa saja berkas yang perlu diunggah?',
      answer: 'Umumnya meliputi pas foto, scan akta kelahiran, kartu keluarga, rapor/surat keterangan lulus, serta berkas pendukung lain bila diminta. Lihat detail pada langkah Berkas.',
      category: 'users'
    },
    {
      id: '7',
      question: 'Bagaimana jika lupa kata sandi akun?',
      answer: 'Silakan hubungi panitia melalui email ppdb@mtsn1waykanan.sch.id atau menu Kontak untuk bantuan reset akses akun.',
      category: 'technical'
    },
    {
      id: '8',
      question: 'Mengapa unggah berkas saya gagal?',
      answer: 'Pastikan ukuran dan format file sesuai ketentuan, koneksi internet stabil, dan coba ulang. Jika tetap gagal, hubungi panitia melalui halaman Kontak.',
      category: 'technical'
    },
    {
      id: '9',
      question: 'Bagaimana cara melihat status pendaftaran?',
      answer: 'Masuk ke Dashboard setelah login. Status akan diperbarui oleh panitia, termasuk verifikasi berkas dan hasil seleksi.',
      category: 'users'
    },
    {
      id: '10',
      question: 'Kapan dan di mana hasil seleksi diumumkan?',
      answer: 'Hasil seleksi akan diumumkan melalui halaman Pengumuman pada tanggal yang ditentukan. Pantau halaman tersebut secara berkala.',
      category: 'general'
    },
    {
      id: '11',
      question: 'Apa yang harus dilakukan setelah dinyatakan lulus?',
      answer: 'Ikuti instruksi daftar ulang pada Pengumuman, siapkan berkas fisik bila diminta, dan lakukan konfirmasi kehadiran sesuai jadwal.',
      category: 'vendors'
    },
    {
      id: '12',
      question: 'Siapa yang dapat dihubungi bila membutuhkan bantuan?',
      answer: 'Anda dapat menghubungi panitia melalui halaman Kontak atau email ke ppdb@mtsn1waykanan.sch.id pada jam operasional.',
      category: 'vendors'
    }
  ];

  const categories = [
    { id: 'all', label: 'Semua Pertanyaan' },
    { id: 'general', label: 'Umum' },
    { id: 'users', label: 'Pendaftar' },
    { id: 'vendors', label: 'Orang Tua/Wali' },
    { id: 'technical', label: 'Teknis' }
  ];

  const filteredFAQs = faqItems.filter(item => {
    const matchesSearch = item.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.answer.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const toggleItem = (id: string) => {
    setOpenItems(prev => 
      prev.includes(id) 
        ? prev.filter(item => item !== id)
        : [...prev, id]
    );
  };

  return (
    <div className="min-h-screen bg-background">
         <Navigation />
        {/* Header */}
        <section className="bg-primary text-primary-foreground section-padding mb-16">
        <div className="container-custom text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Pertanyaan yang Sering Diajukan (FAQ)</h1>
          <p className="text-xl opacity-90 max-w-2xl mx-auto">
          Temukan jawaban atas pertanyaan umum tentang PPDB MTsN 1 Way Kanan
          </p>
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      

        {/* Search and Filter */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Cari pertanyaan..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Category Filter */}
            <div className="md:w-48">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {categories.map(category => (
                  <option key={category.id} value={category.id}>
                    {category.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* FAQ Items */}
        <div className="space-y-4">
          {filteredFAQs.map(item => (
            <div
              key={item.id}
              className="bg-white rounded-2xl shadow-lg overflow-hidden"
            >
              <button
                onClick={() => toggleItem(item.id)}
                className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center space-x-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    item.category === 'general' ? 'bg-blue-100 text-blue-800' :
                    item.category === 'users' ? 'bg-green-100 text-green-800' :
                    item.category === 'vendors' ? 'bg-purple-100 text-purple-800' :
                    'bg-orange-100 text-orange-800'
                  }`}>
                    {categories.find(c => c.id === item.category)?.label}
                  </span>
                  <h3 className="text-lg font-semibold text-gray-900">
                    {item.question}
                  </h3>
                </div>
                {openItems.includes(item.id) ? (
                  <ChevronUp className="h-5 w-5 text-gray-500" />
                ) : (
                  <ChevronDown className="h-5 w-5 text-gray-500" />
                )}
              </button>
              
              {openItems.includes(item.id) && (
                <div className="px-6 pb-4">
                  <div className="border-t border-gray-200 pt-4">
                    <p className="text-gray-700 leading-relaxed">
                      {item.answer}
                    </p>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* No Results */}
        {filteredFAQs.length === 0 && (
          <div className="text-center py-12">
            <div className="bg-gray-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Tidak ada pertanyaan ditemukan
            </h3>
            <p className="text-gray-600 mb-6">
              Coba ubah kata kunci atau kategori pencarian
            </p>
            <button
              onClick={() => {
                setSearchTerm('');
                setSelectedCategory('all');
              }}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
            >
              Bersihkan Filter
            </button>
          </div>
        )}

        {/* Contact Section */}
        <div className="mt-16 mb-16 bg-gradient-to-br from-primary via-primary to-secondary rounded-2xl p-8 text-white text-center">
          <h2 className="text-2xl font-bold mb-4">
            Masih ada pertanyaan?
          </h2>
          <p className="text-blue-100 mb-6">
            Jika belum menemukan jawaban, silakan hubungi panitia PPDB kami.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="mailto:ppdb@mtsn1waykanan.sch.id"
              className="bg-muted text-primary hover:bg-blue-50 px-6 py-3 rounded-lg font-semibold transition-all"
            >
              Hubungi Panitia
            </a>
            <a
              href="/kontak"
              className="border-2 border-white text-white hover:bg-white hover:text-blue-600 px-6 py-3 rounded-lg font-semibold transition-all"
            >
              Lihat Halaman Kontak
            </a>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
import { MapPin, Phone, Mail, Facebook, Instagram, Youtube } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="container-custom section-padding">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Info Sekolah */}
          <div>
            <h3 className="text-xl font-bold mb-4">MTsN 1 Way Kanan</h3>
            <p className="text-sm opacity-90 mb-4">
              Madrasah Tsanawiyah Negeri 1 Way Kanan adalah lembaga pendidikan Islam yang berkomitmen mencetak generasi Qur'ani, berakhlak mulia, dan berprestasi.
            </p>
            <div className="flex space-x-3">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-full bg-primary-foreground/10 hover:bg-primary-foreground/20 transition-colors"
              >
                <Facebook className="w-5 h-5" />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-full bg-primary-foreground/10 hover:bg-primary-foreground/20 transition-colors"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-full bg-primary-foreground/10 hover:bg-primary-foreground/20 transition-colors"
              >
                <Youtube className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Link Cepat */}
          <div>
            <h3 className="text-xl font-bold mb-4">Link Cepat</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/" className="hover:underline opacity-90 hover:opacity-100">
                  Beranda
                </Link>
              </li>
              <li>
                <Link to="/informasi" className="hover:underline opacity-90 hover:opacity-100">
                  Informasi PPDB
                </Link>
              </li>
              <li>
                <Link to="/pengumuman" className="hover:underline opacity-90 hover:opacity-100">
                  Pengumuman
                </Link>
              </li>
              <li>
                <Link to="/kontak" className="hover:underline opacity-90 hover:opacity-100">
                  Kontak
                </Link>
              </li>
              <li>
                <Link to="/register" className="hover:underline opacity-90 hover:opacity-100">
                  Daftar Sekarang
                </Link>
              </li>
            </ul>
          </div>

          {/* Kontak */}
          <div>
            <h3 className="text-xl font-bold mb-4">Kontak Kami</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 flex-shrink-0 mt-0.5" />
                <span className="opacity-90">
                  Jl. Lintas Sumatera, Blambangan Umpu, Kabupaten Way Kanan, Lampung.
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-5 h-5 flex-shrink-0" />
                <a href="tel:+6281234567890" className="opacity-90 hover:opacity-100 hover:underline">
                  +62 812-3456-7890
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-5 h-5 flex-shrink-0" />
                <a
                  href="mailto:ppdb@mtsn1waykanan.sch.id"
                  className="opacity-90 hover:opacity-100 hover:underline"
                >
                  ppdb@mtsn1waykanan.sch.id
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-primary-foreground/20 mt-8 pt-6 text-center text-sm opacity-90">
          <p>&copy; {currentYear} MTsN 1 Way Kanan. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

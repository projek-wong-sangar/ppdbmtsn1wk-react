import Navigation from '@/components/layout/Navigation';
import Footer from '@/components/layout/Footer';
import { Card, CardContent } from '@/components/ui/card';
import { MapPin, Phone, Mail, Clock, Facebook, Instagram, Youtube } from 'lucide-react';

const Kontak = () => {
  const contacts = [
    {
      icon: MapPin,
      title: 'Alamat',
      content: 'Jl. Lintas Sumatera, Blambangan Umpu, Kabupaten Way Kanan, Lampung. 34771',
    },
    {
      icon: Phone,
      title: 'Telepon',
      content: '+62 812-3456-7890',
      href: 'tel:+6281234567890',
    },
    {
      icon: Mail,
      title: 'Email',
      content: 'ppdb@mtsn1waykanan.sch.id',
      href: 'mailto:ppdb@mtsn1waykanan.sch.id',
    },
    {
      icon: Clock,
      title: 'Jam Operasional',
      content: 'Senin - Jumat: 08:00 - 15:00 WIB',
    },
  ];

  const socials = [
    {
      name: 'Facebook',
      icon: Facebook,
      url: 'https://facebook.com',
      color: 'hover:text-[#1877F2]',
    },
    {
      name: 'Instagram',
      icon: Instagram,
      url: 'https://instagram.com',
      color: 'hover:text-[#E4405F]',
    },
    {
      name: 'YouTube',
      icon: Youtube,
      url: 'https://youtube.com',
      color: 'hover:text-[#FF0000]',
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      {/* Hero */}
      <section className="bg-primary text-primary-foreground section-padding">
        <div className="container-custom text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Hubungi Kami</h1>
          <p className="text-xl opacity-90 max-w-2xl mx-auto">
            Jangan ragu untuk menghubungi kami jika ada pertanyaan seputar PPDB
          </p>
        </div>
      </section>

      <div className="section-padding">
        <div className="container-custom">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Contact Info */}
            <div className="space-y-6">
              <div>
                <h2 className="text-3xl font-bold text-foreground mb-2">
                  MTsN 1 Way Kanan
                </h2>
                <p className="text-foreground text-lg">
                  Madrasah Tsanawiyah Negeri terbaik di Way Kanan
                </p>
              </div>

              <div className="space-y-4">
                {contacts.map((contact, index) => (
                  <Card key={index}>
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                          <contact.icon className="w-6 h-6 text-primary" />
                        </div>
                        <div>
                          <h3 className="font-bold text-foreground mb-1">{contact.title}</h3>
                          {contact.href ? (
                            <a
                              href={contact.href}
                              className="text-foreground hover:text-primary transition-colors"
                            >
                              {contact.content}
                            </a>
                          ) : (
                            <p className="text-foreground">{contact.content}</p>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Social Media */}
              <div>
                <h3 className="font-bold text-foreground mb-4 text-lg">Ikuti Kami</h3>
                <div className="flex gap-3">
                  {socials.map((social) => (
                    <a
                      key={social.name}
                      href={social.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`w-12 h-12 bg-accent rounded-lg flex items-center justify-center transition-colors ${social.color}`}
                      title={social.name}
                    >
                      <social.icon className="w-6 h-6" />
                    </a>
                  ))}
                </div>
              </div>
            </div>

            {/* Map */}
            <div>
              <Card className="overflow-hidden h-full">
                <CardContent className="p-0 h-full min-h-[500px]">
                  <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3976.3204527473085!2d104.45607199999999!3d-4.714288600000001!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e388fc3f5966b99%3A0x8593780b9de1bc7d!2sMTsN%201%20Way%20Kanan!5e0!3m2!1sid!2sid!4v1761052197253!5m2!1sid!2sid"
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title="Lokasi MTsN 1 Way Kanan"
                    className="min-h-[500px]"
                  />
                </CardContent>
              </Card>
            </div>
          </div>

          {/* FAQ Section */}
          <div className="mt-16">
            <h2 className="text-3xl font-bold text-foreground mb-8 text-center">
              Pertanyaan yang Sering Diajukan
            </h2>
            <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
              <Card>
                <CardContent className="p-6">
                  <h3 className="font-bold text-foreground mb-2">
                    Kapan batas akhir pendaftaran?
                  </h3>
                  <p className="text-foreground">
                    Pendaftaran ditutup pada tanggal 15 November 2024 pukul 23:59 WIB.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <h3 className="font-bold text-foreground mb-2">
                    Berapa biaya pendaftaran?
                  </h3>
                  <p className="text-foreground">
                    Pendaftaran PPDB MTsN 1 Way Kanan adalah GRATIS, tidak dipungut biaya apapun.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <h3 className="font-bold text-foreground mb-2">
                    Bagaimana jika lupa password?
                  </h3>
                  <p className="text-foreground">
                    Anda dapat menghubungi admin via WhatsApp atau email untuk reset password.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <h3 className="font-bold text-foreground mb-2">
                    Apakah bisa daftar offline?
                  </h3>
                  <p className="text-foreground">
                    Untuk tahun ini, pendaftaran hanya dilakukan secara online melalui website.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Kontak;

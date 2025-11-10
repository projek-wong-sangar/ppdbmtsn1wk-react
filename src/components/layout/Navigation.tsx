import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, User, LogOut, ShieldUser, UserCog, LayoutDashboard } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { authService } from '@/services/authService';

// 1. Impor komponen NavigationMenu
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { ListItem } from "@/components/ui/list-item";

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const isAuth = authService.isAuthenticated();
  const userStr = localStorage.getItem('user');
  const user = userStr ? JSON.parse(userStr) : null;

  const publicLinks = [
    { name: 'Beranda', path: '/' },
    { name: 'Informasi', path: '/informasi' },
    { name: 'Pengumuman', path: '/pengumuman' },
    { name: 'Kontak', path: '/kontak' },
    { name: 'FAQ', path: '/faq' },
  ];

  const handleLogout = () => {
    authService.logout();
    window.location.href = '/login';
  };

  const isActive = (path: string) => location.pathname === path;

  const RoleIcon = () => {
    const role = user?.role;
    const className = "w-4 h-4"; 

    if (role === 'superadmin') {
      return <ShieldUser className={className} />;
    }
    if (role === 'admin') {
      return <UserCog className={className} />;
    }
    return <User className={className} />;
  };

  const dashboardPath = (user?.role === 'admin' || user?.role === 'superadmin')
    ? '/admin/dashboard'
    : '/siswa/dashboard';
  
  const manageAdminPath = "/superadmin/admin"; 

  return (
    <nav className="bg-background border-b border-border sticky top-0 z-50 shadow-sm">
      <div className="container-custom">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3">
            <div className="w-10 h-10 flex items-center justify-center">
              <img src="https://lulusku.kemusukkidul.com/img/kemenag.png" alt="Logo KEMENAG" />
            </div>
            <div className="w-10 h-10 flex items-center justify-center">
              <img src="https://mtsn1waykanan.com/img/mtsn1logo.png" alt="Logo MTsN 1 Way Kanan" />
            </div>
            <div className="hidden sm:block">
              <div className="text-foreground font-bold text-lg">MTsN 1 Way Kanan</div>
              <div className="text-foreground text-xs">PPDB 2025/2026</div>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {publicLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActive(link.path)
                    ? 'bg-primary text-primary-foreground'
                    : 'text-foreground hover:bg-accent hover:text-accent-foreground'
                }`}
              >
                {link.name}
              </Link>
            ))}
          </div>

          {/* Auth Buttons */}
          <div className="hidden md:flex items-center space-x-2">
            {isAuth ? (
              <>
                {/* --- 3. INI ADALAH NAVIGATIONMENU BARU (DESKTOP) --- */}
                <NavigationMenu>
                  <NavigationMenuList>
                    <NavigationMenuItem>
                      {/* Ini adalah pemicu yang di-hover */}
                      <NavigationMenuTrigger className="gap-2 bg-transparent hover:bg-accent focus:bg-accent text-sm font-medium h-10 px-4 py-2">
                        <RoleIcon />
                        {user?.nama || 'Menu'}
                      </NavigationMenuTrigger>
                      {/* Ini adalah konten yang muncul saat di-hover */}
                      <NavigationMenuContent>
                        <ul className="grid w-[200px] gap-3 p-4">
                          <ListItem to={dashboardPath} title="Dashboard">
                            <LayoutDashboard className="h-4 w-4" />
                          </ListItem>

                          {/* Tampilkan link ini HANYA jika superadmin */}
                          {user?.role === 'superadmin' && (
                            <ListItem to={manageAdminPath} title="Manage Admin">
                              <UserCog className="h-4 w-4" />
                            </ListItem>
                          )}
                          
                          {/* Garis pemisah */}
                          <li className="h-px w-full bg-border my-1"></li>

                          <ListItem onClick={handleLogout} title="Keluar" className="text-destructive focus:bg-destructive/10 focus:text-destructive">
                            <LogOut className="h-4 w-4" />
                          </ListItem>
                        </ul>
                      </NavigationMenuContent>
                    </NavigationMenuItem>
                  </NavigationMenuList>
                </NavigationMenu>
              </>
            ) : (
              <>
                {/* ... (Tombol Login/Register tidak berubah) ... */}
                <Link to="/login">
                  <Button variant="outline" size="sm">
                    Masuk
                  </Button>
                </Link>
                <Link to="/register">
                  <Button size="sm" className="btn-primary">
                    Daftar
                  </Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 rounded-md hover:bg-accent"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu (Tidak berubah, ini sudah benar menggunakan klik) */}
        {isOpen && (
          <div className="md:hidden py-4 space-y-2 border-t border-border">
            {publicLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setIsOpen(false)}
                className={`block px-4 py-2 rounded-md text-sm font-medium ${
                  isActive(link.path)
                    ? 'bg-primary text-primary-foreground'
                    : 'text-foreground hover:bg-accent'
                }`}
              >
                {link.name}
              </Link>
            ))}
            <div className="pt-4 space-y-2">
              {isAuth ? (
                <>
                  <Link
                    to={dashboardPath}
                    onClick={() => setIsOpen(false)}
                  >
                    <Button variant="ghost" size="sm" className="w-full justify-start gap-2">
                      <RoleIcon />
                      {user?.nama || 'Dashboard'}
                    </Button>
                  </Link>
                  {user?.role === 'superadmin' && (
                    <Link
                      to={manageAdminPath}
                      onClick={() => setIsOpen(false)}
                    >
                      <Button variant="ghost" size="sm" className="w-full justify-start gap-2">
                        <UserCog className="w-4 h-4" />
                        <span>Manage Admin</span>
                      </Button>
                    </Link>
                  )}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      handleLogout();
                      setIsOpen(false);
                    }}
                    className="w-full justify-start gap-2"
                  >
                    <LogOut className="w-4 h-4" />
                    Keluar
                  </Button>
                </>
              ) : (
                <>
                  <Link to="/login" onClick={() => setIsOpen(false)}>
                    <Button variant="outline" size="sm" className="w-full">
                      Masuk
                    </Button>
                  </Link>
                  <Link to="/register" onClick={() => setIsOpen(false)}>
                    <Button size="sm" className="w-full btn-primary">
                      Daftar
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;
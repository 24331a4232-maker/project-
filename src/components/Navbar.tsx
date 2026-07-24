import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { Menu, X, LogOut, User as UserIcon, LayoutDashboard } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { profile, signOut } = useAuth();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
    setUserMenuOpen(false);
  }, [location.pathname]);

  const isHome = location.pathname === '/';
  const transparent = isHome && !scrolled && !mobileOpen;

  const links = [
    { to: '/', label: 'Home' },
    { to: '/about', label: 'About' },
    { to: '/donations', label: 'Available Food' },
    { to: '/contact', label: 'Contact' },
  ];

  const dashboardLink =
    profile?.role === 'admin' ? '/admin' : profile?.role === 'volunteer' ? '/volunteer' : '/donate';

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        transparent ? 'bg-transparent' : 'bg-white/90 backdrop-blur-md shadow-md'
      }`}
    >
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <img
              src="/food-bridge-logo.svg"
              alt="Food Bridge"
              className="w-10 h-10 group-hover:scale-110 transition-transform"
            />
            <span className={`font-display font-bold text-lg tracking-tight ${transparent ? 'text-white' : 'text-gray-900'}`}>
              <span className={transparent ? 'text-white' : 'text-brand-600'}>Food</span>
              {' '}
              <span className={transparent ? 'text-accent-300' : 'text-accent-500'}>Bridge</span>
            </span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-1">
            {links.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  location.pathname === link.to
                    ? transparent
                      ? 'text-white bg-white/10'
                      : 'text-brand-700 bg-brand-50'
                    : transparent
                      ? 'text-white/80 hover:text-white hover:bg-white/10'
                      : 'text-gray-600 hover:text-brand-700 hover:bg-gray-50'
                }`}
              >
                {link.label}
              </Link>
            ))}

            {profile ? (
              <div className="relative ml-2">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-all"
                >
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center text-white text-xs font-bold">
                    {profile.full_name.charAt(0).toUpperCase()}
                  </div>
                  <span className="max-w-[100px] truncate">{profile.full_name.split(' ')[0]}</span>
                </button>
                {userMenuOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-gray-100 py-2 animate-fade-in">
                    <div className="px-4 py-2 border-b border-gray-100">
                      <p className="text-sm font-semibold text-gray-900 truncate">{profile.full_name}</p>
                      <p className="text-xs text-gray-400 capitalize">{profile.role}</p>
                    </div>
                    <Link to={dashboardLink} className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                      <LayoutDashboard className="w-4 h-4" /> Dashboard
                    </Link>
                    <button
                      onClick={() => { signOut(); navigate('/'); }}
                      className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
                    >
                      <LogOut className="w-4 h-4" /> Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Link to="/login" className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${transparent ? 'text-white/80 hover:text-white' : 'text-gray-600 hover:text-brand-700'}`}>
                  Sign In
                </Link>
                <Link to="/register" className="ml-2 px-5 py-2 rounded-lg text-sm font-semibold text-white bg-gradient-to-r from-brand-500 to-brand-600 hover:from-brand-600 hover:to-brand-700 shadow-lg shadow-brand-500/30 transition-all hover:-translate-y-0.5">
                  Get Started
                </Link>
              </>
            )}
          </div>

          {/* Mobile toggle */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className={`md:hidden p-2 rounded-lg transition-colors ${transparent ? 'text-white hover:bg-white/10' : 'text-gray-700 hover:bg-gray-100'}`}
          >
            {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <div className="md:hidden pb-4 space-y-1 bg-white rounded-b-2xl mx-2 shadow-lg">
            {links.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`block px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                  location.pathname === link.to ? 'text-brand-700 bg-brand-50' : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                {link.label}
              </Link>
            ))}
            {profile ? (
              <>
                <Link to={dashboardLink} className="flex items-center gap-2 px-4 py-3 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50">
                  <UserIcon className="w-4 h-4" /> Dashboard
                </Link>
                <button onClick={() => { signOut(); navigate('/'); }} className="w-full text-left flex items-center gap-2 px-4 py-3 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50">
                  <LogOut className="w-4 h-4" /> Sign Out
                </button>
              </>
            ) : (
              <div className="pt-2 space-y-2">
                <Link to="/login" className="block px-4 py-3 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50">
                  Sign In
                </Link>
                <Link to="/register" className="block px-4 py-3 rounded-lg text-sm font-semibold text-white bg-brand-500 text-center">
                  Get Started
                </Link>
              </div>
            )}
          </div>
        )}
      </nav>
    </header>
  );
}

import { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import { Menu, X, LogOut, User as UserIcon, LayoutDashboard, ChevronDown, Utensils, Heart, Users, Info, Mail, Package } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

const NAV_LINKS = [
  { label: 'Home',           href: '/',          icon: Heart },
  { label: 'About',          href: '/about',     icon: Info },
  { label: 'Available Food', href: '/donations', icon: Package },
  { label: 'Donate Food',    href: '/donate',    icon: Utensils },
  { label: 'Contact',        href: '/contact',   icon: Mail },
];

export default function Navbar() {
  const { user, profile, signOut } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [isOpen, setIsOpen]           = useState(false);
  const [scrolled, setScrolled]       = useState(false);
  const [hidden, setHidden]           = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const lastScrollY                   = useRef(0);
  const dropdownRef                   = useRef<HTMLDivElement>(null);
  const isHome                        = location.pathname === '/';

  const { scrollYProgress } = useScroll();
  const progressWidth = useTransform(scrollYProgress, [0, 1], ['0%', '100%']);

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 20);
      setHidden(y > lastScrollY.current && y > 120);
      lastScrollY.current = y;
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  useEffect(() => { setIsOpen(false); setDropdownOpen(false); }, [location.pathname]);

  const dashboardPath = profile?.role === 'admin' ? '/admin' : profile?.role === 'volunteer' ? '/volunteer' : '/donate';
  const dashboardLabel = profile?.role === 'admin' ? 'Admin Panel' : profile?.role === 'volunteer' ? 'My Pickups' : 'Donate Food';

  const transparent = isHome && !scrolled;

  return (
    <>
      {/* Scroll progress bar */}
      <motion.div
        id="scroll-progress"
        style={{ width: progressWidth }}
        className="fixed top-0 left-0 h-0.5 z-[9999] bg-gradient-to-r from-brand-500 to-accent-500 origin-left"
      />

      <motion.header
        initial={{ y: 0 }}
        animate={{ y: hidden ? '-100%' : 0 }}
        transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
        className={`fixed top-0.5 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled
            ? 'mx-4 mt-2'
            : 'mx-0 mt-0'
        }`}
      >
        <nav className={`
          relative flex items-center justify-between px-5 lg:px-8 h-16
          transition-all duration-500
          ${scrolled
            ? 'rounded-2xl bg-white/80 backdrop-blur-2xl border border-white/60 shadow-premium mx-auto max-w-6xl'
            : transparent
              ? 'bg-transparent'
              : 'bg-white/95 backdrop-blur-xl border-b border-surface-100 shadow-sm'
          }
        `}>

          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 group shrink-0">
            <div className={`
              w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-300
              group-hover:scale-110 group-hover:rotate-3
              ${scrolled || !isHome ? 'bg-brand-50 shadow-md shadow-brand-500/20' : 'bg-white/15 backdrop-blur-sm'}
            `}>
              <img src="/food-bridge-logo.svg" alt="Food Bridge" className="w-7 h-7" />
            </div>
            <span className="font-display font-bold text-base tracking-tight leading-tight">
              <span className={transparent ? 'text-white' : 'text-brand-600'}>Food</span>
              {' '}
              <span className={transparent ? 'text-accent-300' : 'text-accent-500'}>Bridge</span>
            </span>
          </Link>

          {/* Desktop nav links */}
          <div className="hidden lg:flex items-center gap-1">
            {NAV_LINKS.map(({ label, href }) => {
              const active = location.pathname === href;
              return (
                <Link
                  key={href}
                  to={href}
                  className={`
                    relative px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200
                    ${active
                      ? transparent
                        ? 'text-white bg-white/15'
                        : 'text-brand-600 bg-brand-50'
                      : transparent
                        ? 'text-white/80 hover:text-white hover:bg-white/10'
                        : 'text-surface-dark hover:text-brand-600 hover:bg-brand-50'
                    }
                  `}
                >
                  {label}
                  {active && (
                    <motion.div
                      layoutId="nav-indicator"
                      className={`absolute bottom-0.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full ${transparent ? 'bg-white' : 'bg-brand-500'}`}
                    />
                  )}
                </Link>
              );
            })}
          </div>

          {/* Right: Auth controls */}
          <div className="hidden lg:flex items-center gap-3">
            {user && profile ? (
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className={`
                    flex items-center gap-2.5 pl-2 pr-3 py-2 rounded-2xl transition-all duration-200
                    ${transparent ? 'hover:bg-white/10 text-white' : 'hover:bg-surface-100 text-surface-dark'}
                  `}
                >
                  <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-brand-400 to-brand-600 flex items-center justify-center text-white text-xs font-bold shadow-md">
                    {profile.full_name?.charAt(0).toUpperCase() || 'U'}
                  </div>
                  <div className="text-left leading-tight">
                    <p className="text-xs font-semibold line-clamp-1 max-w-[90px]">{profile.full_name?.split(' ')[0]}</p>
                    <p className={`text-[10px] capitalize font-medium ${transparent ? 'text-white/60' : 'text-surface-300'}`}>{profile.role}</p>
                  </div>
                  <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${dropdownOpen ? 'rotate-180' : ''} ${transparent ? 'text-white/70' : 'text-surface-300'}`} />
                </button>

                <AnimatePresence>
                  {dropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95, y: -8 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95, y: -8 }}
                      transition={{ duration: 0.15, ease: 'easeOut' }}
                      className="absolute right-0 top-full mt-2 w-56 bg-white rounded-2xl border border-surface-100 shadow-premium overflow-hidden"
                    >
                      <div className="p-4 border-b border-surface-100 bg-gradient-to-br from-brand-50 to-white">
                        <p className="font-semibold text-sm text-surface-dark">{profile.full_name}</p>
                        <p className="text-xs text-surface-300 mt-0.5">{user.email}</p>
                        <span className="badge-green mt-2 capitalize">{profile.role}</span>
                      </div>
                      <div className="p-2">
                        <Link
                          to={dashboardPath}
                          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-surface-dark hover:bg-brand-50 hover:text-brand-600 transition-colors"
                        >
                          <LayoutDashboard className="w-4 h-4" />
                          {dashboardLabel}
                        </Link>
                        <Link
                          to="/donate"
                          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-surface-dark hover:bg-brand-50 hover:text-brand-600 transition-colors"
                        >
                          <Utensils className="w-4 h-4" />
                          Donate Food
                        </Link>
                      </div>
                      <div className="p-2 border-t border-surface-100">
                        <button
                          onClick={() => { signOut(); navigate('/'); setDropdownOpen(false); }}
                          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-red-500 hover:bg-red-50 transition-colors"
                        >
                          <LogOut className="w-4 h-4" />
                          Sign Out
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className={`px-4 py-2 rounded-full text-sm font-semibold transition-all duration-200 hover:scale-105 ${
                    transparent ? 'text-white hover:bg-white/10' : 'text-surface-dark hover:bg-surface-100'
                  }`}
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="btn-primary text-sm py-2 px-5"
                >
                  Get Started
                </Link>
              </div>
            )}
          </div>

          {/* Mobile hamburger */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className={`lg:hidden w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-200 ${
              transparent ? 'text-white hover:bg-white/10' : 'text-surface-dark hover:bg-surface-100'
            }`}
            aria-label="Toggle menu"
          >
            <AnimatePresence mode="wait" initial={false}>
              {isOpen ? (
                <motion.div key="close" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.15 }}>
                  <X className="w-5 h-5" />
                </motion.div>
              ) : (
                <motion.div key="menu" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.15 }}>
                  <Menu className="w-5 h-5" />
                </motion.div>
              )}
            </AnimatePresence>
          </button>
        </nav>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: -16, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -16, scale: 0.97 }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
              className="lg:hidden mt-2 mx-4 rounded-3xl bg-white/95 backdrop-blur-2xl border border-surface-100 shadow-premium overflow-hidden"
            >
              {user && profile && (
                <div className="px-5 py-4 border-b border-surface-100 bg-gradient-to-r from-brand-50 to-accent-50 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-brand-400 to-brand-600 flex items-center justify-center text-white font-bold">
                    {profile.full_name?.charAt(0).toUpperCase() || 'U'}
                  </div>
                  <div>
                    <p className="font-semibold text-sm text-surface-dark">{profile.full_name}</p>
                    <p className="text-xs text-surface-300 capitalize">{profile.role} account</p>
                  </div>
                </div>
              )}
              <div className="p-3 space-y-1">
                {NAV_LINKS.map(({ label, href, icon: Icon }, i) => {
                  const active = location.pathname === href;
                  return (
                    <motion.div
                      key={href}
                      initial={{ opacity: 0, x: -16 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.05, duration: 0.2 }}
                    >
                      <Link
                        to={href}
                        className={`flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-medium transition-all duration-200 ${
                          active ? 'bg-brand-50 text-brand-600' : 'text-surface-dark hover:bg-surface-50 hover:text-brand-600'
                        }`}
                      >
                        <Icon className={`w-4 h-4 ${active ? 'text-brand-500' : 'text-surface-300'}`} />
                        {label}
                      </Link>
                    </motion.div>
                  );
                })}
              </div>
              <div className="p-3 border-t border-surface-100">
                {user && profile ? (
                  <div className="space-y-1">
                    <Link to={dashboardPath} className="flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-medium text-surface-dark hover:bg-surface-50 transition-colors">
                      <LayoutDashboard className="w-4 h-4 text-surface-300" />
                      {dashboardLabel}
                    </Link>
                    <button
                      onClick={() => { signOut(); navigate('/'); }}
                      className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-medium text-red-500 hover:bg-red-50 transition-colors"
                    >
                      <LogOut className="w-4 h-4" />
                      Sign Out
                    </button>
                  </div>
                ) : (
                  <div className="flex gap-2">
                    <Link to="/login" className="flex-1 btn-outline text-sm py-2.5">Sign In</Link>
                    <Link to="/register" className="flex-1 btn-primary text-sm py-2.5">Get Started</Link>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.header>
    </>
  );
}

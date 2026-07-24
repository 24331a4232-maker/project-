import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Heart, Mail, Phone, MapPin, Facebook, Twitter, Instagram, Linkedin, ArrowRight, Leaf } from 'lucide-react';

const FOOTER_LINKS = {
  Platform: [
    { label: 'Available Food',    href: '/donations' },
    { label: 'Donate Food',       href: '/donate' },
    { label: 'Volunteer',         href: '/volunteer' },
    { label: 'Admin Dashboard',   href: '/admin' },
  ],
  Company: [
    { label: 'About Us',   href: '/about' },
    { label: 'Contact',    href: '/contact' },
    { label: 'Register',   href: '/register' },
    { label: 'Sign In',    href: '/login' },
  ],
};

const SOCIALS = [
  { Icon: Facebook,  href: '#', label: 'Facebook' },
  { Icon: Twitter,   href: '#', label: 'Twitter' },
  { Icon: Instagram, href: '#', label: 'Instagram' },
  { Icon: Linkedin,  href: '#', label: 'LinkedIn' },
];

export default function Footer() {
  return (
    <footer className="relative bg-surface-dark overflow-hidden">
      {/* Gradient mesh */}
      <div className="absolute inset-0 bg-mesh-dark opacity-70 pointer-events-none" />
      {/* Top accent line */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-brand-500/50 to-transparent" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-10">
        {/* Main grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          {/* Brand column */}
          <div className="lg:col-span-2">
            <Link to="/" className="inline-flex items-center gap-3 group mb-6">
              <div className="w-11 h-11 rounded-2xl bg-white/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                <img src="/food-bridge-logo.svg" alt="Food Bridge" className="w-8 h-8" />
              </div>
              <span className="font-display font-bold text-xl">
                <span className="text-brand-400">Food</span>{' '}
                <span className="text-accent-400">Bridge</span>
              </span>
            </Link>

            <p className="text-surface-300 text-sm leading-relaxed max-w-xs mb-8">
              Connecting surplus food with people in need. Together, we're building a world where no meal goes to waste and no one goes hungry.
            </p>

            {/* Newsletter mini CTA */}
            <div className="flex gap-2 max-w-xs">
              <input
                type="email"
                placeholder="Your email address"
                className="flex-1 px-4 py-2.5 rounded-xl bg-white/10 border border-white/10 text-white placeholder:text-white/40 text-sm focus:outline-none focus:ring-1 focus:ring-brand-500 transition-all"
              />
              <button className="p-2.5 rounded-xl bg-brand-500 hover:bg-brand-400 text-white transition-all hover:scale-105 active:scale-95">
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            {/* Contact info */}
            <div className="mt-8 space-y-3">
              {[
                { Icon: Mail,    text: 'hello@foodbridge.org' },
                { Icon: Phone,   text: '+91 98765 43210' },
                { Icon: MapPin,  text: 'Mumbai, Maharashtra, India' },
              ].map(({ Icon, text }) => (
                <div key={text} className="flex items-center gap-3 text-sm text-surface-300 group cursor-default">
                  <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center group-hover:bg-brand-500/20 transition-colors">
                    <Icon className="w-3.5 h-3.5 text-brand-400" />
                  </div>
                  <span className="group-hover:text-white transition-colors">{text}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Links */}
          {Object.entries(FOOTER_LINKS).map(([section, links]) => (
            <div key={section}>
              <h4 className="text-white font-semibold text-sm mb-5 tracking-wide">{section}</h4>
              <ul className="space-y-3">
                {links.map(({ label, href }) => (
                  <li key={href}>
                    <Link
                      to={href}
                      className="text-surface-300 text-sm hover:text-brand-400 transition-colors duration-200 flex items-center gap-1 group"
                    >
                      <span className="w-0 group-hover:w-3 overflow-hidden transition-all duration-200">
                        <ArrowRight className="w-3 h-3" />
                      </span>
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="border-t border-white/5 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-surface-300 text-sm">
            <Leaf className="w-4 h-4 text-brand-400" />
            <span>© 2025 Food Bridge. Made with</span>
            <Heart className="w-3.5 h-3.5 text-red-400 fill-red-400 mx-0.5" />
            <span>for a hunger-free world.</span>
          </div>

          <div className="flex items-center gap-2">
            {SOCIALS.map(({ Icon, href, label }) => (
              <motion.a
                key={label}
                href={href}
                aria-label={label}
                whileHover={{ scale: 1.1, y: -2 }}
                whileTap={{ scale: 0.95 }}
                className="w-9 h-9 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-surface-300 hover:text-brand-400 hover:bg-brand-500/10 hover:border-brand-500/30 transition-colors"
              >
                <Icon className="w-4 h-4" />
              </motion.a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}

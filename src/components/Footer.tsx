import { Link } from 'react-router-dom';
import { Heart, Mail, Phone, MapPin, Facebook, Twitter, Instagram, Linkedin } from 'lucide-react';

export default function Footer() {
  const linkSections = [
    {
      title: 'Platform',
      links: [
        { to: '/donations', label: 'Available Food' },
        { to: '/donate', label: 'Donate Food' },
        { to: '/volunteer', label: 'Volunteer Dashboard' },
        { to: '/admin', label: 'Admin Dashboard' },
      ],
    },
    {
      title: 'Company',
      links: [
        { to: '/about', label: 'About Us' },
        { to: '/contact', label: 'Contact' },
        { to: '/register', label: 'Sign Up' },
        { to: '/login', label: 'Sign In' },
      ],
    },
  ];

  const socials = [
    { icon: Facebook, label: 'Facebook' },
    { icon: Twitter, label: 'Twitter' },
    { icon: Instagram, label: 'Instagram' },
    { icon: Linkedin, label: 'LinkedIn' },
  ];

  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid lg:grid-cols-5 gap-10">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Link to="/" className="flex items-center gap-2.5 mb-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center shadow-lg">
                <Heart className="w-5 h-5 text-white" fill="white" />
              </div>
              <span className="font-display font-bold text-xl text-white">The Last Plate</span>
            </Link>
            <p className="text-gray-400 leading-relaxed max-w-sm mb-6">
              Don't Waste Food. Share Hope. We connect surplus food from donors
              with volunteers who deliver it to people in need.
            </p>
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2 text-gray-400">
                <Mail className="w-4 h-4 text-brand-500" /> hello@lastplate.org
              </div>
              <div className="flex items-center gap-2 text-gray-400">
                <Phone className="w-4 h-4 text-brand-500" /> +1 (555) 123-4567
              </div>
              <div className="flex items-center gap-2 text-gray-400">
                <MapPin className="w-4 h-4 text-brand-500" /> 100 Community St, Food City
              </div>
            </div>
          </div>

          {/* Link sections */}
          {linkSections.map((section) => (
            <div key={section.title}>
              <h4 className="font-display font-semibold text-white mb-4">{section.title}</h4>
              <ul className="space-y-2.5">
                {section.links.map((link) => (
                  <li key={link.to}>
                    <Link to={link.to} className="text-sm text-gray-400 hover:text-brand-400 transition-colors">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Social */}
          <div>
            <h4 className="font-display font-semibold text-white mb-4">Follow Us</h4>
            <div className="flex gap-3">
              {socials.map((social) => (
                <a
                  key={social.label}
                  href="#"
                  aria-label={social.label}
                  className="w-10 h-10 rounded-xl bg-gray-800 flex items-center justify-center text-gray-400 hover:bg-brand-500 hover:text-white transition-all hover:-translate-y-0.5"
                >
                  <social.icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-gray-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-gray-500">
            © {new Date().getFullYear()} The Last Plate Project. All rights reserved.
          </p>
          <p className="text-sm text-gray-500">
            Built with <Heart className="w-3.5 h-3.5 inline text-brand-500" fill="currentColor" /> for a hunger-free world.
          </p>
        </div>
      </div>
    </footer>
  );
}

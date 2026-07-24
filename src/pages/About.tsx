import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, useInView } from 'framer-motion';
import { Heart, Target, Eye, Users, Leaf, Zap, Shield, Globe, ArrowRight, CheckCircle } from 'lucide-react';
import PageHeader from '@/components/PageHeader';

function Reveal({ children, delay = 0, className = '' }: { children: React.ReactNode; delay?: number; className?: string }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });
  return (
    <motion.div ref={ref} initial={{ opacity: 0, y: 28 }} animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay, ease: [0.4, 0, 0.2, 1] }} className={className}>
      {children}
    </motion.div>
  );
}

const VALUES = [
  { icon: Heart,  color: 'text-red-500',    bg: 'bg-red-50',    title: 'Compassion',     desc: 'Every action we take is driven by empathy for those facing hunger and those who choose to help.' },
  { icon: Shield, color: 'text-blue-500',   bg: 'bg-blue-50',   title: 'Safety',         desc: 'We uphold the highest food safety standards so every shared meal is safe, fresh, and dignified.' },
  { icon: Leaf,   color: 'text-brand-500',  bg: 'bg-brand-50',  title: 'Sustainability', desc: 'Reducing food waste is core to our mission — every rescued meal is a win for the planet.' },
  { icon: Globe,  color: 'text-violet-500', bg: 'bg-violet-50', title: 'Community',      desc: 'We believe that real change happens when communities come together with a shared purpose.' },
];

const TIMELINE = [
  { year: '2023', color: 'bg-brand-500', title: 'Founded', desc: 'Food Bridge launched in Mumbai with 12 partner restaurants and 30 volunteers.' },
  { year: '2024', color: 'bg-accent-500', title: 'City Expansion', desc: 'Expanded to Delhi, Bangalore, and Pune. Crossed 10,000 meals delivered.' },
  { year: '2025', color: 'bg-blue-500', title: 'National Scale', desc: '20+ cities, 1,200+ active volunteers, 24,500+ meals and counting.' },
  { year: '2026', color: 'bg-violet-500', title: 'Vision Ahead', desc: 'Building AI-powered route optimization and expanding to 100 cities.' },
];

const TEAM = [
  { name: 'Anita Nair',    role: 'CEO & Co-Founder',     initials: 'AN', color: 'from-brand-400 to-brand-600',    bio: 'Ex-Google, 10 years in social impact tech.' },
  { name: 'Rohan Gupta',   role: 'CTO & Co-Founder',     initials: 'RG', color: 'from-blue-400 to-blue-600',      bio: 'Full-stack engineer, food systems enthusiast.' },
  { name: 'Sneha Kapoor',  role: 'Head of Volunteers',   initials: 'SK', color: 'from-violet-400 to-violet-600',  bio: 'Built volunteer networks across 15 cities.' },
  { name: 'Dev Malhotra',  role: 'Head of Partnerships', initials: 'DM', color: 'from-accent-400 to-accent-600',  bio: 'Onboarded 500+ restaurant partners nationally.' },
];

export default function About() {
  return (
    <div className="overflow-hidden">
      <PageHeader
        title="Our Mission to End Food Waste"
        subtitle="Food Bridge was built on a simple belief: no meal should go to waste while someone nearby goes hungry. We're building the infrastructure to make that a reality."
      />

      {/* ── Mission & Vision ── */}
      <section className="section-padding bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-8">
            {[
              { icon: Target, gradient: 'from-brand-500 to-brand-600', label: 'Mission', heading: 'Bridge the Gap Between Surplus and Need',
                body: 'We connect restaurants, hotels, event venues, and households that have surplus food with a network of trained volunteers who deliver it to underserved families, shelter homes, and community kitchens — all within hours.',
                points: ['Zero-waste food chain', 'Same-day pickup & delivery', 'Dignity-first approach'] },
              { icon: Eye, gradient: 'from-accent-500 to-accent-600', label: 'Vision', heading: 'A World Where Every Meal Finds a Home',
                body: "We envision a future where food waste is unthinkable and food insecurity is history. Food Bridge will be the operating system for community food sharing in every city — powered by technology, driven by compassion.",
                points: ['100+ cities by 2027', 'Pan-India volunteer network', 'AI-optimized distribution'] },
            ].map(({ icon: Icon, gradient, label, heading, body, points }, i) => (
              <Reveal key={label} delay={i * 0.15}>
                <motion.div whileHover={{ y: -4 }} className="card p-8 card-hover h-full">
                  <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${gradient} flex items-center justify-center mb-6 shadow-lg`}>
                    <Icon className="w-7 h-7 text-white" />
                  </div>
                  <span className="badge-green mb-3">{label}</span>
                  <h3 className="text-2xl font-bold text-surface-dark mb-4">{heading}</h3>
                  <p className="text-surface-300 leading-relaxed mb-6">{body}</p>
                  <ul className="space-y-2">
                    {points.map(p => (
                      <li key={p} className="flex items-center gap-2 text-sm text-surface-dark">
                        <CheckCircle className="w-4 h-4 text-brand-500 shrink-0" />
                        {p}
                      </li>
                    ))}
                  </ul>
                </motion.div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── Core Values ── */}
      <section className="section-padding bg-surface-50 relative overflow-hidden">
        <div className="absolute inset-0 bg-mesh-green opacity-40 pointer-events-none" />
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <Reveal className="text-center mb-16">
            <span className="badge-orange mb-4">Core Values</span>
            <h2 className="text-4xl lg:text-5xl font-bold text-surface-dark mt-3">What Drives Us</h2>
          </Reveal>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {VALUES.map(({ icon: Icon, color, bg, title, desc }, i) => (
              <Reveal key={title} delay={i * 0.1}>
                <motion.div whileHover={{ y: -6, scale: 1.02 }} className="card p-7 card-hover text-center group">
                  <div className={`w-14 h-14 ${bg} rounded-2xl flex items-center justify-center mx-auto mb-5 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300`}>
                    <Icon className={`w-7 h-7 ${color}`} />
                  </div>
                  <h3 className="font-bold text-surface-dark text-lg mb-3">{title}</h3>
                  <p className="text-surface-300 text-sm leading-relaxed">{desc}</p>
                </motion.div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── Timeline ── */}
      <section className="section-padding bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Reveal className="text-center mb-16">
            <span className="badge-blue mb-4">Our Journey</span>
            <h2 className="text-4xl lg:text-5xl font-bold text-surface-dark mt-3">
              Growing <span className="text-gradient-green">Together</span>
            </h2>
          </Reveal>
          <div className="relative">
            <div className="absolute left-[28px] md:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-brand-200 via-accent-200 to-violet-200 -translate-x-1/2" />
            <div className="space-y-12">
              {TIMELINE.map(({ year, color, title, desc }, i) => (
                <Reveal key={year} delay={i * 0.12}>
                  <div className={`flex items-start gap-6 md:gap-0 ${i % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'}`}>
                    <div className={`flex-1 ${i % 2 === 0 ? 'md:pr-12 md:text-right' : 'md:pl-12'}`}>
                      <motion.div whileHover={{ y: -4 }} className="card p-6 card-hover inline-block w-full">
                        <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold text-white ${color} mb-3`}>{year}</span>
                        <h4 className="font-bold text-surface-dark text-lg mb-2">{title}</h4>
                        <p className="text-surface-300 text-sm leading-relaxed">{desc}</p>
                      </motion.div>
                    </div>
                    <div className={`relative z-10 w-14 h-14 rounded-2xl ${color} flex items-center justify-center shadow-lg shrink-0 text-white font-bold text-sm md:mx-auto`}>
                      {year.slice(2)}
                    </div>
                    <div className="flex-1 hidden md:block" />
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Team ── */}
      <section className="section-padding bg-surface-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <Reveal className="text-center mb-16">
            <span className="badge-violet mb-4">The Team</span>
            <h2 className="text-4xl lg:text-5xl font-bold text-surface-dark mt-3">People Behind the Mission</h2>
          </Reveal>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {TEAM.map(({ name, role, initials, color, bio }, i) => (
              <Reveal key={name} delay={i * 0.1}>
                <motion.div whileHover={{ y: -6 }} className="card p-6 card-hover text-center group">
                  <div className={`w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br ${color} flex items-center justify-center text-white font-bold text-xl mb-4 shadow-lg group-hover:scale-110 transition-transform`}>
                    {initials}
                  </div>
                  <h4 className="font-bold text-surface-dark">{name}</h4>
                  <p className="text-xs font-semibold text-brand-500 mt-1 mb-3">{role}</p>
                  <p className="text-surface-300 text-xs leading-relaxed">{bio}</p>
                </motion.div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="relative py-24 hero-bg overflow-hidden">
        <div className="relative max-w-3xl mx-auto px-4 text-center">
          <Reveal>
            <h2 className="text-4xl lg:text-5xl font-bold text-white mb-5">Be Part of the Story</h2>
            <p className="text-white/60 text-lg mb-10">Whether you donate, volunteer, or spread the word — every action matters.</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/register" className="btn-primary text-base px-8 py-4">
                Join Food Bridge <ArrowRight className="w-5 h-5" />
              </Link>
              <Link to="/contact" className="btn-glass text-base px-8 py-4">Contact Us</Link>
            </div>
          </Reveal>
        </div>
      </section>
    </div>
  );
}

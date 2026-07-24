import { useRef, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, useInView, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import {
  ArrowRight, Utensils, Users, Package, Leaf, Heart, Star, ChevronDown,
  Zap, Shield, Globe, Clock, CheckCircle, TrendingUp, Sparkles, Play
} from 'lucide-react';

/* ─── Animated counter ─── */
function Counter({ to, suffix = '' }: { to: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!inView) return;
    let start = 0;
    const duration = 1800;
    const step = to / (duration / 16);
    const timer = setInterval(() => {
      start = Math.min(start + step, to);
      setCount(Math.floor(start));
      if (start >= to) clearInterval(timer);
    }, 16);
    return () => clearInterval(timer);
  }, [inView, to]);

  return <span ref={ref}>{inView ? count.toLocaleString() : '0'}{suffix}</span>;
}

/* ─── Section animation wrapper ─── */
function Reveal({ children, delay = 0, className = '' }: { children: React.ReactNode; delay?: number; className?: string }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 32 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay, ease: [0.4, 0, 0.2, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

const STATS = [
  { value: 24500, suffix: '+', label: 'Meals Shared',    icon: Utensils,    color: 'text-brand-500',  bg: 'bg-brand-50' },
  { value: 1200,  suffix: '+', label: 'Volunteers',      icon: Users,       color: 'text-blue-500',   bg: 'bg-blue-50' },
  { value: 5800,  suffix: '+', label: 'Deliveries',      icon: Package,     color: 'text-accent-500', bg: 'bg-accent-50' },
  { value: 12,    suffix: 't', label: 'Food Waste Saved', icon: Leaf,        color: 'text-brand-600',  bg: 'bg-brand-50' },
];

const HOW_STEPS = [
  { step: '01', icon: Utensils, color: 'bg-brand-500', title: 'Post a Donation', desc: 'Restaurants, hotels, and households list surplus food in under 2 minutes.' },
  { step: '02', icon: Package,  color: 'bg-accent-500', title: 'Volunteers Claim', desc: 'Trained volunteers receive alerts and claim nearby pickups instantly.' },
  { step: '03', icon: Heart,    color: 'bg-violet-500', title: 'Food Delivered', desc: 'Meals reach families in need — fresh, safe, and with care.' },
];

const FEATURES = [
  { icon: Zap,        color: 'text-amber-500',  bg: 'bg-amber-50',   title: 'Real-time Alerts',    desc: 'Instant notifications to volunteers the moment a donation is posted nearby.' },
  { icon: Shield,     color: 'text-blue-500',   bg: 'bg-blue-50',    title: 'Food Safety First',   desc: 'Built-in quality checks ensure every meal shared is safe to eat.' },
  { icon: Globe,      color: 'text-brand-500',  bg: 'bg-brand-50',   title: 'City-wide Network',   desc: 'Donors, volunteers, and recipients all on one connected platform.' },
  { icon: Clock,      color: 'text-violet-500', bg: 'bg-violet-50',  title: 'Fast Pickup Windows', desc: 'Average pickup time under 45 minutes — no food left behind.' },
  { icon: TrendingUp, color: 'text-accent-500', bg: 'bg-accent-50',  title: 'Impact Tracking',     desc: 'Dashboards showing your exact contribution to reducing hunger.' },
  { icon: Leaf,       color: 'text-brand-600',  bg: 'bg-brand-50',   title: 'Zero Waste Mission',  desc: 'Every kilogram rescued is a step toward a sustainable, fair food system.' },
];

const TESTIMONIALS = [
  {
    name: 'Chef Arjun Sharma', role: 'Executive Chef, The Grand Hotel',
    avatar: 'AS', color: 'from-brand-400 to-brand-600',
    text: '"Food Bridge transformed how we handle surplus. What used to go in the bin now feeds families every single evening. It takes our team less than 2 minutes to post a donation."',
  },
  {
    name: 'Priya Menon', role: 'Volunteer Coordinator',
    avatar: 'PM', color: 'from-violet-400 to-violet-600',
    text: '"I coordinate 40+ volunteers through this platform. The dashboard is intuitive, alerts are instant, and the satisfaction of seeing meals reach families is beyond words."',
  },
  {
    name: 'Ravi Kumar', role: 'NGO Partner – Hope Foundation',
    avatar: 'RK', color: 'from-accent-400 to-accent-600',
    text: '"In 6 months, we received over 1,800 meals through Food Bridge. The transparency and reliability is exceptional — this platform genuinely changes lives."',
  },
];

const FLOATING_ICONS = [
  { Icon: Utensils, x: '8%',  y: '22%', delay: 0,    size: 'w-10 h-10', color: 'text-brand-400', bg: 'bg-brand-500/10' },
  { Icon: Heart,    x: '88%', y: '18%', delay: 1.2,  size: 'w-8 h-8',  color: 'text-red-400',   bg: 'bg-red-500/10' },
  { Icon: Leaf,     x: '82%', y: '72%', delay: 0.6,  size: 'w-9 h-9',  color: 'text-brand-300', bg: 'bg-brand-500/10' },
  { Icon: Star,     x: '6%',  y: '75%', delay: 1.8,  size: 'w-8 h-8',  color: 'text-amber-300', bg: 'bg-amber-500/10' },
  { Icon: Sparkles, x: '50%', y: '8%',  delay: 0.9,  size: 'w-7 h-7',  color: 'text-violet-300',bg: 'bg-violet-500/10' },
];

export default function Home() {
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] });
  const heroY    = useTransform(scrollYProgress, [0, 1], [0, 80]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);

  return (
    <div className="overflow-hidden">

      {/* ════════════════════════════════════════
          HERO
      ════════════════════════════════════════ */}
      <section ref={heroRef} className="relative min-h-screen flex flex-col justify-center hero-bg overflow-hidden">
        {/* Animated gradient orbs */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <motion.div
            animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
            transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute top-1/4 -left-32 w-96 h-96 rounded-full bg-brand-500/20 blur-3xl"
          />
          <motion.div
            animate={{ scale: [1.2, 1, 1.2], opacity: [0.2, 0.4, 0.2] }}
            transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
            className="absolute bottom-1/4 -right-32 w-80 h-80 rounded-full bg-accent-500/20 blur-3xl"
          />
          <motion.div
            animate={{ scale: [1, 1.3, 1], opacity: [0.15, 0.3, 0.15] }}
            transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut', delay: 4 }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-violet-500/10 blur-3xl"
          />
        </div>

        {/* Floating icons */}
        {FLOATING_ICONS.map(({ Icon, x, y, delay, size, color, bg }, i) => (
          <motion.div
            key={i}
            style={{ position: 'absolute', left: x, top: y }}
            animate={{ y: [-10, 10, -10], rotate: [-5, 5, -5] }}
            transition={{ duration: 5 + i, repeat: Infinity, ease: 'easeInOut', delay }}
            className={`w-14 h-14 rounded-2xl ${bg} backdrop-blur-sm border border-white/10 flex items-center justify-center hidden lg:flex`}
          >
            <Icon className={`${size} ${color}`} />
          </motion.div>
        ))}

        {/* Hero content */}
        <motion.div
          style={{ y: heroY, opacity: heroOpacity }}
          className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-20 text-center"
        >
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1, duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white/80 text-sm font-medium mb-8"
          >
            <span className="w-2 h-2 rounded-full bg-brand-400 animate-pulse" />
            Connecting food donors with families in need
            <Sparkles className="w-3.5 h-3.5 text-brand-400" />
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.7, ease: [0.4, 0, 0.2, 1] }}
            className="text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-bold text-white leading-[1.05] tracking-tight mb-6"
          >
            Share{' '}
            <span className="relative">
              <span className="text-gradient-green">Food.</span>
            </span>
            <br />
            Share{' '}
            <span className="text-gradient-orange">Hope.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="text-lg sm:text-xl text-white/65 max-w-2xl mx-auto leading-relaxed mb-10"
          >
            Food Bridge is the platform where restaurants, hotels, and households donate surplus meals — and volunteers bring them to families who need it most.
          </motion.p>

          {/* CTA buttons */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.55, duration: 0.6 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Link to="/register" className="btn-primary text-base px-8 py-4 shadow-2xl shadow-brand-500/40">
              Start Donating Free
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link to="/donations" className="btn-glass text-base px-8 py-4">
              <Play className="w-4 h-4" />
              Browse Available Food
            </Link>
          </motion.div>

          {/* Floating logo */}
          <motion.div
            animate={{ y: [-12, 12, -12] }}
            transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
            className="mt-16 inline-block"
          >
            <div className="w-32 h-32 mx-auto rounded-3xl bg-white/10 backdrop-blur-md border border-white/15 flex items-center justify-center shadow-2xl shadow-black/30">
              <img src="/food-bridge-logo.svg" alt="Food Bridge" className="w-24 h-24" />
            </div>
          </motion.div>
        </motion.div>

        {/* Scroll hint */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-white/40 text-xs"
        >
          <span>Scroll to explore</span>
          <motion.div animate={{ y: [0, 8, 0] }} transition={{ duration: 1.5, repeat: Infinity }}>
            <ChevronDown className="w-5 h-5" />
          </motion.div>
        </motion.div>
      </section>

      {/* ════════════════════════════════════════
          STATS
      ════════════════════════════════════════ */}
      <section className="relative bg-surface-50 py-16 overflow-hidden">
        <div className="absolute inset-0 bg-mesh-green opacity-50 pointer-events-none" />
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {STATS.map(({ value, suffix, label, icon: Icon, color, bg }, i) => (
              <Reveal key={label} delay={i * 0.1}>
                <motion.div
                  whileHover={{ y: -6, scale: 1.03 }}
                  className="card p-6 text-center group card-hover"
                >
                  <div className={`w-14 h-14 ${bg} rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform`}>
                    <Icon className={`w-7 h-7 ${color}`} />
                  </div>
                  <p className={`text-3xl lg:text-4xl font-bold ${color} mb-1`}>
                    <Counter to={value} suffix={suffix} />
                  </p>
                  <p className="text-sm text-surface-300 font-medium">{label}</p>
                </motion.div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════
          HOW IT WORKS
      ════════════════════════════════════════ */}
      <section className="section-padding bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <Reveal className="text-center mb-16">
            <span className="badge-green mb-4">How It Works</span>
            <h2 className="text-4xl lg:text-5xl font-bold text-surface-dark mt-3 mb-4">
              Simple. Fast. <span className="text-gradient-green">Impactful.</span>
            </h2>
            <p className="text-surface-300 text-lg max-w-xl mx-auto">
              Three steps from surplus food on a shelf to a warm meal on a family's table.
            </p>
          </Reveal>

          <div className="grid md:grid-cols-3 gap-8 relative">
            {/* Connector line */}
            <div className="hidden md:block absolute top-12 left-1/3 right-1/3 h-px bg-gradient-to-r from-brand-300 via-accent-300 to-violet-300 -translate-x-0" />

            {HOW_STEPS.map(({ step, icon: Icon, color, title, desc }, i) => (
              <Reveal key={step} delay={i * 0.15}>
                <motion.div
                  whileHover={{ y: -8 }}
                  className="card p-8 text-center group card-hover relative"
                >
                  <div className={`w-16 h-16 ${color} rounded-2xl flex items-center justify-center mx-auto mb-5 shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-all duration-300`}>
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                  <div className="absolute top-4 right-4 text-5xl font-black text-surface-100 select-none">{step}</div>
                  <h3 className="text-xl font-bold text-surface-dark mb-3">{title}</h3>
                  <p className="text-surface-300 leading-relaxed text-sm">{desc}</p>
                </motion.div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════
          FEATURES
      ════════════════════════════════════════ */}
      <section className="section-padding bg-surface-50 relative overflow-hidden">
        <div className="absolute inset-0 bg-mesh-green opacity-40 pointer-events-none" />
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <Reveal className="text-center mb-16">
            <span className="badge-orange mb-4">Platform Features</span>
            <h2 className="text-4xl lg:text-5xl font-bold text-surface-dark mt-3 mb-4">
              Built for <span className="text-gradient-orange">Impact</span>
            </h2>
            <p className="text-surface-300 text-lg max-w-xl mx-auto">
              Every feature designed to make food sharing faster, safer, and more impactful.
            </p>
          </Reveal>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {FEATURES.map(({ icon: Icon, color, bg, title, desc }, i) => (
              <Reveal key={title} delay={i * 0.08}>
                <motion.div
                  whileHover={{ y: -6, scale: 1.02 }}
                  className="card p-7 card-hover group"
                >
                  <div className={`w-12 h-12 ${bg} rounded-2xl flex items-center justify-center mb-5 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300`}>
                    <Icon className={`w-6 h-6 ${color}`} />
                  </div>
                  <h3 className="font-bold text-surface-dark text-lg mb-2">{title}</h3>
                  <p className="text-surface-300 text-sm leading-relaxed">{desc}</p>
                </motion.div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════
          TESTIMONIALS
      ════════════════════════════════════════ */}
      <section className="section-padding bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <Reveal className="text-center mb-16">
            <span className="badge-blue mb-4">Testimonials</span>
            <h2 className="text-4xl lg:text-5xl font-bold text-surface-dark mt-3 mb-4">
              Real Stories, <span className="text-gradient-green">Real Impact</span>
            </h2>
          </Reveal>

          <div className="grid md:grid-cols-3 gap-6">
            {TESTIMONIALS.map(({ name, role, avatar, color, text }, i) => (
              <Reveal key={name} delay={i * 0.12}>
                <motion.div
                  whileHover={{ y: -6 }}
                  className="card p-7 card-hover relative"
                >
                  <div className="flex mb-4">
                    {[...Array(5)].map((_, j) => (
                      <Star key={j} className="w-4 h-4 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <p className="text-surface-300 text-sm leading-relaxed mb-6 italic">{text}</p>
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center text-white text-sm font-bold`}>
                      {avatar}
                    </div>
                    <div>
                      <p className="font-semibold text-surface-dark text-sm">{name}</p>
                      <p className="text-xs text-surface-300">{role}</p>
                    </div>
                  </div>
                  <div className="absolute top-6 right-6 text-6xl text-surface-100 font-serif leading-none select-none">"</div>
                </motion.div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════
          MISSION BANNER
      ════════════════════════════════════════ */}
      <section className="relative py-24 hero-bg overflow-hidden">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 60, repeat: Infinity, ease: 'linear' }}
            className="absolute -top-48 -right-48 w-96 h-96 rounded-full border border-white/5"
          />
          <motion.div
            animate={{ rotate: -360 }}
            transition={{ duration: 45, repeat: Infinity, ease: 'linear' }}
            className="absolute -bottom-48 -left-48 w-80 h-80 rounded-full border border-white/5"
          />
        </div>

        <div className="relative max-w-4xl mx-auto px-4 text-center">
          <Reveal>
            <motion.div
              animate={{ y: [-6, 6, -6] }}
              transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
              className="w-20 h-20 mx-auto mb-8 rounded-3xl bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center"
            >
              <img src="/food-bridge-logo.svg" alt="Food Bridge" className="w-14 h-14" />
            </motion.div>
            <h2 className="text-4xl lg:text-5xl font-bold text-white mb-5 leading-tight">
              Together We Can End<br />
              <span className="text-gradient-green">Food Waste</span> &{' '}
              <span className="text-gradient-orange">Hunger</span>
            </h2>
            <p className="text-white/60 text-lg mb-10 max-w-xl mx-auto">
              Join thousands of donors and volunteers already making a difference across India. It's free, it's fast, and it changes lives.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/register" className="btn-primary text-base px-8 py-4 shadow-2xl shadow-brand-500/40">
                Join Food Bridge
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link to="/donations" className="btn-glass text-base px-8 py-4">
                Browse Donations
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

    </div>
  );
}

import { useRef, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, useInView, useScroll, useTransform } from 'framer-motion';
import {
  Heart, Target, Eye, Users, Leaf, Zap, Shield, Globe, ArrowRight,
  CheckCircle, TrendingUp, Utensils, Package, Clock, Sparkles,
  AlertTriangle, Recycle, Droplet, Sun, Award, Quote, ChevronDown,
} from 'lucide-react';

/* ─── Reveal helper ─── */
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

/* ─── Data ─── */
const IMPACT_STATS = [
  { value: 24500, suffix: '+', label: 'Meals Shared',     icon: Utensils,    color: 'text-brand-500',  bg: 'bg-brand-50' },
  { value: 1200,  suffix: '+', label: 'Active Volunteers', icon: Users,       color: 'text-blue-500',   bg: 'bg-blue-50' },
  { value: 5800,  suffix: '+', label: 'Deliveries Done',   icon: Package,     color: 'text-accent-500', bg: 'bg-accent-50' },
  { value: 12,    suffix: 't', label: 'Food Waste Saved',  icon: Leaf,        color: 'text-brand-600',  bg: 'bg-brand-50' },
  { value: 20,    suffix: '+', label: 'Cities Reached',    icon: Globe,       color: 'text-violet-500', bg: 'bg-violet-50' },
  { value: 500,   suffix: '+', label: 'Partner Donors',     icon: Award,       color: 'text-accent-600', bg: 'bg-accent-50' },
];

const VALUES = [
  { icon: Heart,  color: 'text-red-500',    bg: 'bg-red-50',    title: 'Compassion',     desc: 'Every action we take is driven by empathy for those facing hunger and those who choose to help.' },
  { icon: Shield, color: 'text-blue-500',   bg: 'bg-blue-50',   title: 'Safety',         desc: 'We uphold the highest food safety standards so every shared meal is safe, fresh, and dignified.' },
  { icon: Leaf,   color: 'text-brand-500',  bg: 'bg-brand-50',  title: 'Sustainability', desc: 'Reducing food waste is core to our mission — every rescued meal is a win for the planet.' },
  { icon: Globe,  color: 'text-violet-500', bg: 'bg-violet-50', title: 'Community',      desc: 'We believe that real change happens when communities come together with a shared purpose.' },
];

const TEAM = [
  { name: 'Anita Nair',    role: 'CEO & Co-Founder',     initials: 'AN', color: 'from-brand-400 to-brand-600',    bio: 'Ex-Google, 10 years in social impact tech.' },
  { name: 'Rohan Gupta',   role: 'CTO & Co-Founder',     initials: 'RG', color: 'from-blue-400 to-blue-600',      bio: 'Full-stack engineer, food systems enthusiast.' },
  { name: 'Sneha Kapoor',  role: 'Head of Volunteers',   initials: 'SK', color: 'from-violet-400 to-violet-600',  bio: 'Built volunteer networks across 15 cities.' },
  { name: 'Dev Malhotra',  role: 'Head of Partnerships', initials: 'DM', color: 'from-accent-400 to-accent-600',  bio: 'Onboarded 500+ restaurant partners nationally.' },
];

const WASTE_FACTS = [
  { value: '1.3B',  label: 'tonnes of food wasted globally each year', icon: AlertTriangle, color: 'text-red-500',     bg: 'bg-red-50' },
  { value: '40%',   label: 'of all food produced is never eaten',         icon: Recycle,      color: 'text-accent-500',  bg: 'bg-accent-50' },
  { value: '828M',  label: 'people go to bed hungry every night',          icon: Heart,        color: 'text-violet-500',  bg: 'bg-violet-50' },
  { value: '8-10%', label: 'of global greenhouse gas from food waste',     icon: Droplet,      color: 'text-blue-500',    bg: 'bg-blue-50' },
];

const SDG_GOALS = [
  {
    number: 2, title: 'Zero Hunger', icon: Utensils,
    gradient: 'from-brand-500 to-brand-600',
    desc: 'End hunger, achieve food security, improve nutrition, and promote sustainable agriculture. Food Bridge directly addresses this by redirecting surplus food to those who need it most.',
    points: ['End all forms of hunger by 2030', 'Ensure access to safe, nutritious food', 'Promote sustainable food systems'],
  },
  {
    number: 12, title: 'Responsible Consumption', icon: Recycle,
    gradient: 'from-accent-500 to-accent-600',
    desc: 'Ensure sustainable consumption and production patterns. By rescuing food that would otherwise be wasted, we reduce environmental impact and promote a circular food economy.',
    points: ['Halve global food waste by 2030', 'Reduce waste through prevention', 'Encourage sustainable practices'],
  },
];

const FLOATING_ICONS = [
  { Icon: Utensils, x: '8%',  y: '30%', delay: 0,    size: 'w-8 h-8',  color: 'text-brand-400',  bg: 'bg-brand-500/10' },
  { Icon: Heart,    x: '88%', y: '25%', delay: 1.2,  size: 'w-7 h-7',  color: 'text-red-400',    bg: 'bg-red-500/10' },
  { Icon: Leaf,     x: '85%', y: '70%', delay: 0.6,  size: 'w-8 h-8',  color: 'text-brand-300',  bg: 'bg-brand-500/10' },
  { Icon: Sparkles, x: '12%', y: '75%', delay: 1.8,  size: 'w-7 h-7',  color: 'text-violet-300', bg: 'bg-violet-500/10' },
];

export default function About() {
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] });
  const heroY = useTransform(scrollYProgress, [0, 1], [0, 80]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);

  return (
    <div className="overflow-hidden">

      {/* ════════════════════════════════════════
          HERO
      ════════════════════════════════════════ */}
      <section ref={heroRef} className="relative min-h-[80vh] flex items-center hero-bg overflow-hidden">
        {/* Animated orbs */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <motion.div animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
            transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute top-1/4 -left-32 w-96 h-96 rounded-full bg-brand-500/20 blur-3xl" />
          <motion.div animate={{ scale: [1.2, 1, 1.2], opacity: [0.2, 0.4, 0.2] }}
            transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
            className="absolute bottom-1/4 -right-32 w-80 h-80 rounded-full bg-accent-500/20 blur-3xl" />
        </div>

        {/* Floating icons */}
        {FLOATING_ICONS.map(({ Icon, x, y, delay, size, color, bg }, i) => (
          <motion.div key={i} style={{ position: 'absolute', left: x, top: y }}
            animate={{ y: [-10, 10, -10], rotate: [-5, 5, -5] }}
            transition={{ duration: 5 + i, repeat: Infinity, ease: 'easeInOut', delay }}
            className={`w-14 h-14 rounded-2xl ${bg} backdrop-blur-sm border border-white/10 flex items-center justify-center hidden lg:flex`}>
            <Icon className={`${size} ${color}`} />
          </motion.div>
        ))}

        <motion.div style={{ y: heroY, opacity: heroOpacity }}
          className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-20 text-center">
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1, duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white/80 text-sm font-medium mb-8">
            <span className="w-2 h-2 rounded-full bg-brand-400 animate-pulse" />
            Our Story
            <Sparkles className="w-3.5 h-3.5 text-brand-400" />
          </motion.div>

          <motion.h1 initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.7, ease: [0.4, 0, 0.2, 1] }}
            className="text-5xl sm:text-6xl lg:text-7xl font-bold text-white leading-[1.05] tracking-tight mb-6">
            We're Building a <span className="text-gradient-green">Bridge</span><br />
            Between Food and <span className="text-gradient-orange">Hope</span>
          </motion.h1>

          <motion.p initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="text-lg sm:text-xl text-white/65 max-w-2xl mx-auto leading-relaxed mb-10">
            Food Bridge is a movement to end food waste and hunger — one meal, one volunteer, one community at a time.
          </motion.p>

          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.55, duration: 0.6 }}
            className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/register" className="btn-primary text-base px-8 py-4 shadow-2xl shadow-brand-500/40">
              Join the Movement <ArrowRight className="w-5 h-5" />
            </Link>
            <a href="#story" className="btn-glass text-base px-8 py-4">
              Read Our Story <ChevronDown className="w-4 h-4" />
            </a>
          </motion.div>
        </motion.div>
      </section>

      {/* ════════════════════════════════════════
          OUR STORY
      ════════════════════════════════════════ */}
      <section id="story" className="section-padding bg-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-brand-500/5 blur-3xl pointer-events-none" />
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <Reveal>
              <span className="badge-green mb-4">Our Story</span>
              <h2 className="text-4xl lg:text-5xl font-bold text-surface-dark mb-6 leading-tight">
                It Started With One <span className="text-gradient-green">Plate</span>
              </h2>
              <div className="space-y-4 text-surface-300 leading-relaxed">
                <p>
                  In 2023, our co-founder Anita was walking past a restaurant in Mumbai late at night. Inside, the kitchen was throwing away trays of perfectly good biryani — food that had been cooked for an event that ended early. Outside, a family sat on the pavement, hungry.
                </p>
                <p>
                  The gap between those two scenes — surplus on one side, need on the other — became impossible to unsee. That night, the idea for Food Bridge was born: a platform that connects people who have food to spare with people who need it, fast.
                </p>
                <p>
                  What started with 12 restaurants and 30 volunteers in Mumbai has grown into a national network spanning 20+ cities, 1,200+ volunteers, and over 24,500 meals delivered. But the mission remains the same: <span className="font-semibold text-surface-dark">no meal should go to waste while someone nearby goes hungry.</span>
                </p>
              </div>
            </Reveal>

            {/* Illustration card */}
            <Reveal delay={0.2}>
              <motion.div whileHover={{ y: -6 }} className="card p-8 card-hover relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-brand-50/50 to-accent-50/30 pointer-events-none" />
                <div className="relative">
                  {/* Logo illustration */}
                  <motion.div animate={{ y: [-8, 8, -8] }} transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
                    className="w-40 h-40 mx-auto rounded-4xl bg-white shadow-premium flex items-center justify-center mb-6">
                    <img src="/food-bridge-logo.svg" alt="Food Bridge" className="w-32 h-32" />
                  </motion.div>
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { icon: Utensils, label: 'Donors',    color: 'text-brand-500',  bg: 'bg-brand-50' },
                      { icon: Package,  label: 'Volunteers', color: 'text-blue-500',   bg: 'bg-blue-50' },
                      { icon: Heart,    label: 'Families',  color: 'text-accent-500', bg: 'bg-accent-50' },
                    ].map(({ icon: Icon, label, color, bg }) => (
                      <div key={label} className="text-center p-3 rounded-2xl bg-white/60 backdrop-blur-sm">
                        <div className={`w-10 h-10 ${bg} rounded-xl flex items-center justify-center mx-auto mb-2`}>
                          <Icon className={`w-5 h-5 ${color}`} />
                        </div>
                        <p className="text-xs font-medium text-surface-dark">{label}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════
          WHY FOOD BRIDGE WAS CREATED
      ════════════════════════════════════════ */}
      <section className="section-padding bg-surface-50 relative overflow-hidden">
        <div className="absolute inset-0 bg-mesh-green opacity-40 pointer-events-none" />
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <Reveal className="text-center mb-16">
            <span className="badge-orange mb-4">The Problem</span>
            <h2 className="text-4xl lg:text-5xl font-bold text-surface-dark mt-3 mb-4">
              Why <span className="text-gradient-orange">Food Bridge</span> Exists
            </h2>
            <p className="text-surface-300 text-lg max-w-2xl mx-auto">
              Two massive problems. One simple solution.
            </p>
          </Reveal>

          <div className="grid md:grid-cols-2 gap-8 mb-12">
            {/* Problem 1 */}
            <Reveal delay={0.1}>
              <motion.div whileHover={{ y: -4 }} className="card p-8 card-hover h-full">
                <div className="w-14 h-14 rounded-2xl bg-red-50 flex items-center justify-center mb-6">
                  <AlertTriangle className="w-7 h-7 text-red-500" />
                </div>
                <h3 className="text-xl font-bold text-surface-dark mb-3">Food Waste Crisis</h3>
                <p className="text-surface-300 leading-relaxed mb-4">
                  Restaurants, hotels, and households throw away tonnes of perfectly good food every single day — food that took resources to grow, transport, and cook, only to end up in landfills where it produces methane.
                </p>
                <div className="space-y-2">
                  {['1.3 billion tonnes wasted yearly', '40% of all food produced is discarded', '8-10% of global emissions from food waste'].map(p => (
                    <div key={p} className="flex items-center gap-2 text-sm text-surface-dark">
                      <div className="w-1.5 h-1.5 rounded-full bg-red-400" /> {p}
                    </div>
                  ))}
                </div>
              </motion.div>
            </Reveal>

            {/* Problem 2 */}
            <Reveal delay={0.2}>
              <motion.div whileHover={{ y: -4 }} className="card p-8 card-hover h-full">
                <div className="w-14 h-14 rounded-2xl bg-violet-50 flex items-center justify-center mb-6">
                  <Heart className="w-7 h-7 text-violet-500" />
                </div>
                <h3 className="text-xl font-bold text-surface-dark mb-3">Hunger Persists</h3>
                <p className="text-surface-300 leading-relaxed mb-4">
                  While food is being discarded, 828 million people go to bed hungry every night. The food exists — it just isn't reaching the people who need it. The gap isn't supply, it's distribution.
                </p>
                <div className="space-y-2">
                  {['828 million face chronic hunger', '1 in 9 people are undernourished', 'Food exists — distribution is broken'].map(p => (
                    <div key={p} className="flex items-center gap-2 text-sm text-surface-dark">
                      <div className="w-1.5 h-1.5 rounded-full bg-violet-400" /> {p}
                    </div>
                  ))}
                </div>
              </motion.div>
            </Reveal>
          </div>

          {/* Solution */}
          <Reveal delay={0.3}>
            <motion.div whileHover={{ y: -4 }} className="card p-10 card-hover text-center relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-brand-50/50 via-white to-accent-50/30 pointer-events-none" />
              <div className="relative">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-brand-500 to-brand-600 flex items-center justify-center mx-auto mb-6 shadow-lg shadow-brand-500/30">
                  <Sparkles className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl lg:text-3xl font-bold text-surface-dark mb-4">
                  Our Solution: <span className="text-gradient-green">The Bridge</span>
                </h3>
                <p className="text-surface-300 text-lg max-w-2xl mx-auto leading-relaxed">
                  A real-time platform that connects donors who have surplus food with trained volunteers who pick it up and deliver it to families in need — within hours, not days. Simple, fast, and dignified.
                </p>
              </div>
            </motion.div>
          </Reveal>
        </div>
      </section>

      {/* ════════════════════════════════════════
          MISSION & VISION
      ════════════════════════════════════════ */}
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

      {/* ════════════════════════════════════════
          OUR IMPACT
      ════════════════════════════════════════ */}
      <section className="section-padding bg-surface-50 relative overflow-hidden">
        <div className="absolute inset-0 bg-mesh-green opacity-40 pointer-events-none" />
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <Reveal className="text-center mb-16">
            <span className="badge-blue mb-4">Our Impact</span>
            <h2 className="text-4xl lg:text-5xl font-bold text-surface-dark mt-3 mb-4">
              Real Numbers, <span className="text-gradient-green">Real Lives</span>
            </h2>
            <p className="text-surface-300 text-lg max-w-xl mx-auto">
              Every number represents a meal shared, a family fed, and a step toward a zero-waste future.
            </p>
          </Reveal>

          <div className="grid grid-cols-2 lg:grid-cols-3 gap-6">
            {IMPACT_STATS.map(({ value, suffix, label, icon: Icon, color, bg }, i) => (
              <Reveal key={label} delay={i * 0.08}>
                <motion.div whileHover={{ y: -6, scale: 1.03 }} className="card p-7 card-hover group text-center">
                  <div className={`w-14 h-14 ${bg} rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300`}>
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
          CORE VALUES
      ════════════════════════════════════════ */}
      <section className="section-padding bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
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

      {/* ════════════════════════════════════════
          FOOD WASTE AWARENESS
      ════════════════════════════════════════ */}
      <section className="section-padding bg-surface-dark relative overflow-hidden">
        <div className="absolute inset-0 bg-mesh-dark opacity-70 pointer-events-none" />
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-red-500/30 to-transparent" />

        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <Reveal className="text-center mb-16">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-red-500/20 text-red-300 border border-red-500/30 mb-4">
              <AlertTriangle className="w-3 h-3" /> Awareness
            </span>
            <h2 className="text-4xl lg:text-5xl font-bold text-white mt-3 mb-4">
              The Food Waste <span className="text-gradient-orange">Crisis</span>
            </h2>
            <p className="text-white/60 text-lg max-w-2xl mx-auto">
              The numbers are staggering — but they're not inevitable. Awareness is the first step toward change.
            </p>
          </Reveal>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {WASTE_FACTS.map(({ value, label, icon: Icon, color, bg }, i) => (
              <Reveal key={label} delay={i * 0.1}>
                <motion.div whileHover={{ y: -6, scale: 1.03 }} className="card-dark p-7 text-center group">
                  <div className={`w-12 h-12 ${bg} rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform`}>
                    <Icon className={`w-6 h-6 ${color}`} />
                  </div>
                  <p className={`text-3xl lg:text-4xl font-bold ${color} mb-2`}>{value}</p>
                  <p className="text-white/60 text-sm leading-relaxed">{label}</p>
                </motion.div>
              </Reveal>
            ))}
          </div>

          {/* Callout banner */}
          <Reveal delay={0.3}>
            <div className="card-dark p-8 lg:p-10 flex flex-col lg:flex-row items-center gap-6">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-red-500 to-accent-500 flex items-center justify-center shrink-0 shadow-lg">
                <Sun className="w-8 h-8 text-white" />
              </div>
              <div className="flex-1 text-center lg:text-left">
                <h3 className="text-xl lg:text-2xl font-bold text-white mb-2">Every Meal Rescued Is a Win for the Planet</h3>
                <p className="text-white/60 leading-relaxed">
                  When you donate surplus food through Food Bridge, you're not just feeding someone — you're preventing methane emissions, saving water, and building a circular food economy. One rescued meal = 2.5 kg of CO₂ saved.
                </p>
              </div>
              <Link to="/register" className="btn-primary shrink-0">
                Start Helping <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ════════════════════════════════════════
          SDG GOALS
      ════════════════════════════════════════ */}
      <section className="section-padding bg-surface-50 relative overflow-hidden">
        <div className="absolute inset-0 bg-mesh-green opacity-30 pointer-events-none" />
        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <Reveal className="text-center mb-16">
            <span className="badge-green mb-4">UN Sustainable Development Goals</span>
            <h2 className="text-4xl lg:text-5xl font-bold text-surface-dark mt-3 mb-4">
              Aligned With <span className="text-gradient-green">Global Goals</span>
            </h2>
            <p className="text-surface-300 text-lg max-w-xl mx-auto">
              Food Bridge directly contributes to two United Nations Sustainable Development Goals.
            </p>
          </Reveal>

          <div className="grid md:grid-cols-2 gap-8">
            {SDG_GOALS.map(({ number, title, icon: Icon, gradient, desc, points }, i) => (
              <Reveal key={title} delay={i * 0.15}>
                <motion.div whileHover={{ y: -6 }} className="card p-8 card-hover h-full relative overflow-hidden">
                  {/* SDG number watermark */}
                  <div className="absolute top-4 right-4 text-7xl font-black text-surface-100 select-none">{number}</div>
                  <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${gradient} flex items-center justify-center mb-6 shadow-lg`}>
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-xs font-bold text-surface-300 uppercase tracking-widest">SDG Goal {number}</span>
                  </div>
                  <h3 className="text-2xl font-bold text-surface-dark mb-4">{title}</h3>
                  <p className="text-surface-300 leading-relaxed mb-6">{desc}</p>
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

      {/* ════════════════════════════════════════
          MEET OUR TEAM
      ════════════════════════════════════════ */}
      <section className="section-padding bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <Reveal className="text-center mb-16">
            <span className="badge-violet mb-4">The Team</span>
            <h2 className="text-4xl lg:text-5xl font-bold text-surface-dark mt-3 mb-4">
              People Behind the <span className="text-gradient-green">Mission</span>
            </h2>
            <p className="text-surface-300 text-lg max-w-xl mx-auto">
              A dedicated team of builders, dreamers, and doers committed to ending food waste.
            </p>
          </Reveal>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {TEAM.map(({ name, role, initials, color, bio }, i) => (
              <Reveal key={name} delay={i * 0.1}>
                <motion.div whileHover={{ y: -8 }} className="card p-6 card-hover text-center group">
                  <div className={`w-20 h-20 mx-auto rounded-3xl bg-gradient-to-br ${color} flex items-center justify-center text-white font-bold text-2xl mb-5 shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-all duration-300`}>
                    {initials}
                  </div>
                  <h4 className="font-bold text-surface-dark text-lg">{name}</h4>
                  <p className="text-xs font-semibold text-brand-500 mt-1 mb-3">{role}</p>
                  <p className="text-surface-300 text-xs leading-relaxed">{bio}</p>
                  {/* Social icons */}
                  <div className="flex justify-center gap-2 mt-4">
                    {['in', 'X', '@'].map(s => (
                      <div key={s} className="w-7 h-7 rounded-lg bg-surface-50 flex items-center justify-center text-surface-300 text-xs font-medium group-hover:bg-brand-50 group-hover:text-brand-500 transition-colors cursor-pointer">
                        {s}
                      </div>
                    ))}
                  </div>
                </motion.div>
              </Reveal>
            ))}
          </div>

          {/* Quote */}
          <Reveal delay={0.4}>
            <motion.div whileHover={{ y: -4 }} className="card p-10 mt-12 text-center relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-brand-50/40 to-accent-50/20 pointer-events-none" />
              <div className="relative">
                <Quote className="w-10 h-10 text-brand-300 mx-auto mb-6" />
                <p className="text-xl lg:text-2xl font-medium text-surface-dark leading-relaxed max-w-3xl mx-auto italic">
                  "We don't need to produce more food to end hunger. We just need to stop throwing away what we already have. Food Bridge is proof that the solution already exists — it just needed a bridge."
                </p>
                <div className="mt-6 flex items-center justify-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-400 to-brand-600 flex items-center justify-center text-white font-bold text-sm">AN</div>
                  <div className="text-left">
                    <p className="font-semibold text-surface-dark text-sm">Anita Nair</p>
                    <p className="text-xs text-surface-300">CEO & Co-Founder</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </Reveal>
        </div>
      </section>

      {/* ════════════════════════════════════════
          CTA
      ════════════════════════════════════════ */}
      <section className="relative py-24 hero-bg overflow-hidden">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <motion.div animate={{ rotate: 360 }} transition={{ duration: 60, repeat: Infinity, ease: 'linear' }}
            className="absolute -top-48 -right-48 w-96 h-96 rounded-full border border-white/5" />
          <motion.div animate={{ rotate: -360 }} transition={{ duration: 45, repeat: Infinity, ease: 'linear' }}
            className="absolute -bottom-48 -left-48 w-80 h-80 rounded-full border border-white/5" />
        </div>

        <div className="relative max-w-3xl mx-auto px-4 text-center">
          <Reveal>
            <motion.div animate={{ y: [-6, 6, -6] }} transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
              className="w-20 h-20 mx-auto mb-8 rounded-3xl bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center">
              <img src="/food-bridge-logo.svg" alt="Food Bridge" className="w-14 h-14" />
            </motion.div>
            <h2 className="text-4xl lg:text-5xl font-bold text-white mb-5 leading-tight">
              Be Part of the <span className="text-gradient-green">Story</span>
            </h2>
            <p className="text-white/60 text-lg mb-10 max-w-xl mx-auto">
              Whether you donate surplus food, volunteer to deliver, or simply spread the word — every action brings us closer to a hunger-free world.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/register" className="btn-primary text-base px-8 py-4 shadow-2xl shadow-brand-500/40">
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

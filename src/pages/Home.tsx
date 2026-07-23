import { Link } from 'react-router-dom';
import {
  ArrowRight, Utensils, Users, Truck, Clock, Shield, MapPin,
  Heart, TrendingDown, Sparkles, Star, Quote, ChevronRight,
} from 'lucide-react';

export default function Home() {
  const stats = [
    { icon: Utensils, value: '24,500+', label: 'Meals Rescued', color: 'text-brand-600', bg: 'bg-brand-50' },
    { icon: Users, value: '1,200+', label: 'Active Volunteers', color: 'text-accent-600', bg: 'bg-accent-50' },
    { icon: Truck, value: '5,800+', label: 'Deliveries Made', color: 'text-blue-600', bg: 'bg-blue-50' },
    { icon: TrendingDown, value: '12 Tons', label: 'Food Waste Reduced', color: 'text-purple-600', bg: 'bg-purple-50' },
  ];

  const steps = [
    {
      icon: Utensils,
      title: 'Donor Posts Food',
      desc: 'Hotels, restaurants, and event organizers post surplus food with pickup details and expiry times.',
      color: 'from-brand-500 to-brand-700',
      step: '01',
    },
    {
      icon: Users,
      title: 'Volunteer Claims',
      desc: 'Nearby volunteers browse available donations and claim the ones they can pick up and deliver.',
      color: 'from-accent-500 to-accent-700',
      step: '02',
    },
    {
      icon: Heart,
      title: 'Food Reaches Needy',
      desc: 'Volunteers pick up the food and deliver it to shelters, families, and individuals who need it most.',
      color: 'from-emerald-500 to-teal-700',
      step: '03',
    },
  ];

  const features = [
    { icon: Clock, title: 'Real-Time Coordination', desc: 'Live donation status updates from posting to delivery, so nothing falls through the cracks.' },
    { icon: Shield, title: 'Verified Community', desc: 'Every donor and volunteer is authenticated, building trust across the entire platform.' },
    { icon: MapPin, title: 'Location-Based Matching', desc: 'Volunteers see donations near them, minimizing travel time and maximizing freshness.' },
    { icon: Sparkles, title: 'Easy Image Upload', desc: 'Donors upload food photos so volunteers know exactly what they are picking up.' },
    { icon: Truck, title: 'Proof of Delivery', desc: 'Volunteers upload delivery confirmation photos, closing the loop on every donation.' },
    { icon: Heart, title: 'Impact Tracking', desc: 'Dashboards show meals saved, waste reduced, and lives touched — in real numbers.' },
  ];

  const testimonials = [
    {
      name: 'Sarah Mitchell',
      role: 'Restaurant Owner',
      avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=200',
      text: 'We used to throw away trays of food every night. Now volunteers pick it up within an hour. It feels amazing to feed people instead of trash cans.',
      rating: 5,
    },
    {
      name: 'James Okoro',
      role: 'Volunteer Courier',
      avatar: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=200',
      text: 'I deliver on my way home from work. Three trips a week, about 40 meals each. Knowing where that food goes makes every minute worth it.',
      rating: 5,
    },
    {
      name: 'Maria Santos',
      role: 'Shelter Coordinator',
      avatar: 'https://images.pexels.com/photos/3763188/pexels-photo-3763188.jpeg?auto=compress&cs=tinysrgb&w=200',
      text: 'The Last Plate has become a lifeline for our shelter. Fresh, hot meals arrive regularly. The proof-of-delivery system gives us total confidence.',
      rating: 5,
    },
  ];

  return (
    <div>
      {/* ===== HERO ===== */}
      <section className="relative min-h-screen flex items-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-brand-600 via-brand-700 to-emerald-800" />
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage:
              'radial-gradient(circle at 20% 30%, rgba(255,255,255,0.3) 0%, transparent 50%), radial-gradient(circle at 80% 70%, rgba(249,115,22,0.2) 0%, transparent 50%)',
          }}
        />
        <div className="absolute inset-0">
          <div className="absolute top-20 left-10 w-72 h-72 bg-brand-400/20 rounded-full blur-3xl animate-pulse-slow" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-accent-500/20 rounded-full blur-3xl animate-pulse-slow" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16 w-full">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="text-white space-y-6 animate-fade-in-up">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-sm font-medium">
                <span className="w-2 h-2 rounded-full bg-accent-400 animate-pulse" />
                Fighting hunger, one plate at a time
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight leading-[1.1] font-display">
                Don't Waste Food.{' '}
                <span className="text-accent-400">Share Hope.</span>
              </h1>
              <p className="text-lg text-brand-50 max-w-xl leading-relaxed">
                The Last Plate Project connects hotels, restaurants, and event
                organizers with volunteers who collect surplus food and deliver
                it to people in need — in real time.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link
                  to="/register"
                  className="px-7 py-3.5 rounded-xl bg-white text-brand-700 font-semibold hover:bg-brand-50 transition-all hover:-translate-y-0.5 shadow-xl flex items-center gap-2"
                >
                  Join the Movement <ArrowRight className="w-5 h-5" />
                </Link>
                <Link
                  to="/donations"
                  className="px-7 py-3.5 rounded-xl bg-white/10 backdrop-blur-sm text-white font-semibold border border-white/30 hover:bg-white/20 transition-all hover:-translate-y-0.5"
                >
                  Browse Donations
                </Link>
              </div>
            </div>

            <div className="relative animate-scale-in">
              <div className="relative rounded-3xl overflow-hidden shadow-2xl aspect-[4/3]">
                <img
                  src="https://images.pexels.com/photos/6210748/pexels-photo-6210748.jpeg?auto=compress&cs=tinysrgb&w=800"
                  alt="Volunteers packing surplus food"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
              </div>
              {/* Floating cards */}
              <div className="absolute -bottom-5 -left-5 bg-white rounded-2xl shadow-xl p-4 max-w-[200px] animate-float">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-brand-100 flex items-center justify-center">
                    <Utensils className="w-5 h-5 text-brand-600" />
                  </div>
                  <div>
                    <p className="text-xl font-bold text-gray-900">24,500+</p>
                    <p className="text-xs text-gray-500">meals rescued</p>
                  </div>
                </div>
              </div>
              <div className="absolute -top-5 -right-5 bg-white rounded-2xl shadow-xl p-4 max-w-[200px] animate-float" style={{ animationDelay: '1s' }}>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-accent-100 flex items-center justify-center">
                    <Heart className="w-5 h-5 text-accent-600" fill="currentColor" />
                  </div>
                  <div>
                    <p className="text-xl font-bold text-gray-900">1,200+</p>
                    <p className="text-xs text-gray-500">volunteers</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Wave divider */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 100" fill="none" className="w-full h-auto">
            <path d="M0 100V40C240 80 480 100 720 80C960 60 1200 20 1440 40V100H0Z" fill="white" />
          </svg>
        </div>
      </section>

      {/* ===== STATS ===== */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat, i) => (
              <div
                key={i}
                className="text-center p-6 rounded-2xl bg-gray-50 hover:bg-white hover:shadow-lg transition-all border border-gray-100"
              >
                <div className={`w-12 h-12 rounded-xl ${stat.bg} flex items-center justify-center mx-auto mb-4`}>
                  <stat.icon className={`w-6 h-6 ${stat.color}`} />
                </div>
                <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                <p className="text-sm text-gray-500 mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== ABOUT SECTION ===== */}
      <section className="section-padding bg-gradient-to-b from-white to-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="relative">
              <div className="rounded-3xl overflow-hidden shadow-xl aspect-square">
                <img
                  src="https://images.pexels.com/photos/6646917/pexels-photo-6646917.jpeg?auto=compress&cs=tinysrgb&w=600"
                  alt="Community food sharing"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute -bottom-6 -right-6 bg-brand-600 text-white rounded-2xl shadow-xl p-6 max-w-[240px] hidden sm:block">
                <p className="text-3xl font-bold">1/3</p>
                <p className="text-sm text-brand-100 mt-1">of all food produced globally is wasted. We're changing that.</p>
              </div>
            </div>
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-100 text-brand-700 text-sm font-medium mb-4">
                <Sparkles className="w-4 h-4" /> Our Mission
              </div>
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4 font-display">
                Bridging the gap between surplus and need
              </h2>
              <p className="text-gray-600 leading-relaxed mb-6">
                Every day, tons of perfectly good food ends up in dumpsters while
                millions go hungry. The Last Plate Project is a technology-driven
                platform that makes it effortless to redirect surplus food to the
                people who need it most — before it's too late.
              </p>
              <div className="space-y-4">
                {[
                  { icon: Utensils, text: 'Real-time donation matching between donors and volunteers' },
                  { icon: Shield, text: 'Verified, authenticated community of trusted participants' },
                  { icon: TrendingDown, text: 'Measurable impact tracking — meals saved, waste reduced' },
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <div className="w-9 h-9 rounded-lg bg-brand-50 flex items-center justify-center flex-shrink-0">
                      <item.icon className="w-5 h-5 text-brand-600" />
                    </div>
                    <p className="text-gray-700 pt-1.5">{item.text}</p>
                  </div>
                ))}
              </div>
              <Link to="/about" className="mt-8 inline-flex items-center gap-2 text-brand-600 font-semibold hover:gap-3 transition-all">
                Learn more about us <ChevronRight className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ===== HOW IT WORKS ===== */}
      <section className="section-padding bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-accent-100 text-accent-700 text-sm font-medium mb-4">
              <Truck className="w-4 h-4" /> Simple Process
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 font-display">How It Works</h2>
            <p className="text-gray-500 mt-3 max-w-2xl mx-auto">
              Three simple steps turn surplus food into someone's next meal.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {steps.map((step, i) => (
              <div key={i} className="relative group">
                <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition-all">
                  <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${step.color} flex items-center justify-center mb-5 shadow-lg`}>
                    <step.icon className="w-8 h-8 text-white" />
                  </div>
                  <p className="text-5xl font-bold text-gray-100 absolute top-4 right-6 font-display">{step.step}</p>
                  <h3 className="text-xl font-bold text-gray-900 mb-2 relative">{step.title}</h3>
                  <p className="text-gray-500 leading-relaxed relative">{step.desc}</p>
                </div>
                {i < steps.length - 1 && (
                  <div className="hidden md:flex absolute top-1/2 -right-4 -translate-y-1/2 z-10">
                    <ArrowRight className="w-6 h-6 text-gray-300" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== FEATURES ===== */}
      <section className="section-padding bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-100 text-brand-700 text-sm font-medium mb-4">
              <Sparkles className="w-4 h-4" /> Platform Features
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 font-display">Everything you need to make a difference</h2>
            <p className="text-gray-500 mt-3 max-w-2xl mx-auto">
              Powerful tools designed to make food donation effortless and transparent.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, i) => (
              <div key={i} className="card p-6 card-hover">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center mb-4 shadow-lg shadow-brand-500/20">
                  <feature.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-bold text-lg text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-500 leading-relaxed text-sm">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== TESTIMONIALS ===== */}
      <section className="section-padding bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-accent-100 text-accent-700 text-sm font-medium mb-4">
              <Star className="w-4 h-4" /> Stories
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 font-display">Voices from our community</h2>
            <p className="text-gray-500 mt-3 max-w-2xl mx-auto">
              Real people, real impact. Hear from donors, volunteers, and recipients.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <div key={i} className="card p-6 card-hover">
                <Quote className="w-8 h-8 text-brand-200 mb-4" fill="currentColor" />
                <p className="text-gray-700 leading-relaxed mb-6 italic">"{t.text}"</p>
                <div className="flex items-center gap-3">
                  <img src={t.avatar} alt={t.name} className="w-12 h-12 rounded-full object-cover" />
                  <div>
                    <p className="font-semibold text-gray-900">{t.name}</p>
                    <p className="text-sm text-gray-500">{t.role}</p>
                  </div>
                  <div className="ml-auto flex gap-0.5">
                    {Array.from({ length: t.rating }).map((_, j) => (
                      <Star key={j} className="w-4 h-4 text-accent-500" fill="currentColor" />
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== CTA ===== */}
      <section className="py-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-brand-600 to-emerald-800 p-10 sm:p-16 text-center">
            <div
              className="absolute inset-0 opacity-20"
              style={{
                backgroundImage:
                  'radial-gradient(circle at 30% 20%, rgba(255,255,255,0.3) 0%, transparent 50%), radial-gradient(circle at 70% 80%, rgba(249,115,22,0.2) 0%, transparent 50%)',
              }}
            />
            <div className="relative">
              <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4 font-display">
                Ready to make a difference?
              </h2>
              <p className="text-brand-50 text-lg max-w-2xl mx-auto mb-8">
                Whether you have food to spare or time to give, your contribution
                feeds someone in your community today.
              </p>
              <div className="flex flex-wrap gap-4 justify-center">
                <Link
                  to="/register"
                  className="px-7 py-3.5 rounded-xl bg-white text-brand-700 font-semibold hover:bg-brand-50 transition-all hover:-translate-y-0.5 shadow-xl flex items-center gap-2"
                >
                  Get Started Free <ArrowRight className="w-5 h-5" />
                </Link>
                <Link
                  to="/contact"
                  className="px-7 py-3.5 rounded-xl bg-white/10 backdrop-blur-sm text-white font-semibold border border-white/30 hover:bg-white/20 transition-all hover:-translate-y-0.5"
                >
                  Contact Us
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

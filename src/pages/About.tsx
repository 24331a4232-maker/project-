import { Link } from 'react-router-dom';
import { Target, Eye, Heart, TrendingDown, Users, Utensils, ArrowRight, CheckCircle } from 'lucide-react';
import PageHeader from '@/components/PageHeader';

export default function About() {
  const values = [
    { icon: Heart, title: 'Compassion', desc: 'We believe no one should go hungry while food goes to waste.' },
    { icon: Users, title: 'Community', desc: 'We build bridges between donors, volunteers, and those in need.' },
    { icon: TrendingDown, title: 'Sustainability', desc: 'Every meal rescued is a step toward a zero-waste future.' },
    { icon: CheckCircle, title: 'Transparency', desc: 'Proof of delivery and real-time tracking on every donation.' },
  ];

  const milestones = [
    { year: '2023', title: 'The Idea', desc: 'Founded after seeing tons of event food thrown away nightly.' },
    { year: '2024', title: 'First 1,000 Meals', desc: 'Reached our first major milestone within three months of launch.' },
    { year: '2025', title: '1,200+ Volunteers', desc: 'A growing community spanning cities and neighborhoods.' },
    { year: '2026', title: '24,500+ Meals', desc: 'And counting — with expansion to new regions underway.' },
  ];

  return (
    <div>
      <PageHeader
        title="About The Last Plate Project"
        subtitle="We're on a mission to eliminate food waste and fight hunger through community-driven technology."
      />

      {/* Mission & Vision */}
      <section className="section-padding bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-8 mb-16">
            <div className="card p-8">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center mb-5 shadow-lg">
                <Target className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">Our Mission</h3>
              <p className="text-gray-600 leading-relaxed">
                To build a world where surplus food never reaches a landfill while
                people go hungry. We use technology to connect those who have extra
                food with those who need it, powered by a network of dedicated volunteers.
              </p>
            </div>
            <div className="card p-8">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-accent-500 to-accent-700 flex items-center justify-center mb-5 shadow-lg">
                <Eye className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">Our Vision</h3>
              <p className="text-gray-600 leading-relaxed">
                A future where every city, every neighborhood, and every event
                has a seamless way to redirect surplus food to people in need —
                making hunger a solvable problem, one plate at a time.
              </p>
            </div>
          </div>

          {/* Values */}
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 font-display">Our Core Values</h2>
            <p className="text-gray-500 mt-3">The principles that guide everything we do.</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, i) => (
              <div key={i} className="card p-6 card-hover text-center">
                <div className="w-12 h-12 rounded-xl bg-brand-50 flex items-center justify-center mx-auto mb-4">
                  <value.icon className="w-6 h-6 text-brand-600" />
                </div>
                <h3 className="font-bold text-gray-900 mb-2">{value.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{value.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Milestones */}
      <section className="section-padding bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-bold text-gray-900 font-display">Our Journey</h2>
            <p className="text-gray-500 mt-3">From an idea to a movement.</p>
          </div>
          <div className="space-y-8">
            {milestones.map((m, i) => (
              <div key={i} className="flex gap-6 items-start">
                <div className="flex flex-col items-center">
                  <div className="w-14 h-14 rounded-full bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center text-white font-bold text-sm shadow-lg flex-shrink-0">
                    {m.year.slice(2)}
                  </div>
                  {i < milestones.length - 1 && <div className="w-0.5 h-16 bg-gray-200 mt-2" />}
                </div>
                <div className="pt-3">
                  <p className="text-sm font-semibold text-brand-600">{m.year}</p>
                  <h3 className="text-lg font-bold text-gray-900 mt-1">{m.title}</h3>
                  <p className="text-gray-500 mt-1">{m.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="rounded-3xl bg-gradient-to-br from-brand-600 to-emerald-800 p-10 sm:p-16 text-center">
            <Utensils className="w-12 h-12 text-white mx-auto mb-4" />
            <h2 className="text-3xl font-bold text-white mb-4 font-display">Join us in the fight against hunger</h2>
            <p className="text-brand-50 text-lg mb-8 max-w-2xl mx-auto">
              Every donation, every delivery, every volunteer hour brings us closer to a hunger-free world.
            </p>
            <Link to="/register" className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl bg-white text-brand-700 font-semibold hover:bg-brand-50 transition-all hover:-translate-y-0.5 shadow-xl">
              Get Started <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

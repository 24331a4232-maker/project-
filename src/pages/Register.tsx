import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Heart, Mail, Lock, User, Phone, Building, MapPin, Loader2,
  AlertCircle, ArrowRight, Utensils, Truck, Shield,
} from 'lucide-react';
import { useAuth } from '@/context/useAuth';
import { UserRole } from '@/lib/supabase';

export default function Register() {
  const navigate = useNavigate();
  const { signUp } = useAuth();
  const [form, setForm] = useState({
    full_name: '',
    email: '',
    password: '',
    phone: '',
    organization: '',
    address: '',
    role: 'donor' as UserRole,
  });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const update = (field: string, value: string) => setForm((p) => ({ ...p, [field]: value }));

  const roleOptions = [
    { value: 'donor' as UserRole, label: 'Donor', icon: Utensils, desc: 'I have surplus food to share', color: 'from-brand-500 to-brand-700' },
    { value: 'volunteer' as UserRole, label: 'Volunteer', icon: Truck, desc: 'I want to pick up & deliver', color: 'from-accent-500 to-accent-700' },
    { value: 'admin' as UserRole, label: 'Admin', icon: Shield, desc: 'I manage the platform', color: 'from-blue-500 to-blue-700' },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const { error } = await signUp(form);
    setLoading(false);
    if (error) {
      setError(error);
      return;
    }
    setSuccess(true);
    setTimeout(() => navigate('/login'), 2500);
  };

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 py-20 bg-gradient-to-br from-brand-50 via-white to-accent-50">
        <div className="max-w-md text-center">
          <div className="w-20 h-20 rounded-full bg-brand-100 flex items-center justify-center mx-auto mb-6">
            <Heart className="w-10 h-10 text-brand-600" fill="currentColor" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-3">Account created!</h2>
          <p className="text-gray-500 mb-6">
            Your account has been created successfully. You can now sign in and start
            making a difference.
          </p>
          <Link to="/login" className="btn-primary">
            Go to Sign In <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen px-4 py-20 bg-gradient-to-br from-brand-50 via-white to-accent-50">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2.5 mb-6">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center shadow-lg">
              <Heart className="w-6 h-6 text-white" fill="white" />
            </div>
          </Link>
          <h1 className="text-2xl font-bold text-gray-900 font-display">Join The Last Plate</h1>
          <p className="text-gray-500 mt-2">Create your account and start making a difference today.</p>
        </div>

        <div className="card p-8">
          {error && (
            <div className="mb-5 px-4 py-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm flex items-center gap-2">
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              {error}
            </div>
          )}

          {/* Role selector */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-700 mb-3">I want to join as a...</label>
            <div className="grid grid-cols-3 gap-3">
              {roleOptions.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => update('role', opt.value)}
                  className={`p-4 rounded-xl border-2 text-center transition-all ${
                    form.role === opt.value
                      ? 'border-brand-500 bg-brand-50 shadow-md'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${opt.color} flex items-center justify-center mx-auto mb-2`}>
                    <opt.icon className="w-5 h-5 text-white" />
                  </div>
                  <p className="font-semibold text-sm text-gray-900">{opt.label}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{opt.desc}</p>
                </button>
              ))}
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Full Name *</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input type="text" required value={form.full_name} onChange={(e) => update('full_name', e.target.value)} placeholder="Your name" className="input-field pl-10" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Phone *</label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input type="tel" required value={form.phone} onChange={(e) => update('phone', e.target.value)} placeholder="+1 (555) 000-0000" className="input-field pl-10" />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Email *</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input type="email" required value={form.email} onChange={(e) => update('email', e.target.value)} placeholder="you@example.com" className="input-field pl-10" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Password *</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input type="password" required minLength={6} value={form.password} onChange={(e) => update('password', e.target.value)} placeholder="Min. 6 characters" className="input-field pl-10" />
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Organization {form.role === 'donor' ? '*' : '(optional)'}</label>
                <div className="relative">
                  <Building className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input type="text" value={form.organization} onChange={(e) => update('organization', e.target.value)} placeholder="Hotel, restaurant, etc." className="input-field pl-10" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Address (optional)</label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input type="text" value={form.address} onChange={(e) => update('address', e.target.value)} placeholder="Your area" className="input-field pl-10" />
                </div>
              </div>
            </div>

            <button type="submit" disabled={loading} className="btn-primary w-full disabled:opacity-60 disabled:cursor-not-allowed">
              {loading ? (
                <><Loader2 className="w-5 h-5 animate-spin" /> Creating account...</>
              ) : (
                <>Create Account <ArrowRight className="w-5 h-5" /></>
              )}
            </button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-6">
            Already have an account?{' '}
            <Link to="/login" className="text-brand-600 font-semibold hover:text-brand-700">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

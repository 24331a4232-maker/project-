import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { User, Mail, Lock, Phone, Building2, MapPin, Eye, EyeOff, ArrowRight, CheckCircle2, AlertCircle, Utensils, Package, Shield } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import type { UserRole } from '@/lib/supabase';

const ROLES: { value: UserRole; label: string; icon: typeof Utensils; color: string; bg: string; border: string; desc: string }[] = [
  { value: 'donor',     label: 'Donor',     icon: Utensils, color: 'text-brand-600',  bg: 'bg-brand-50',  border: 'border-brand-300',  desc: 'Share surplus food from your restaurant, hotel, or home.' },
  { value: 'volunteer', label: 'Volunteer', icon: Package,  color: 'text-blue-600',   bg: 'bg-blue-50',   border: 'border-blue-300',   desc: 'Pick up donations and deliver to families in need.' },
  { value: 'admin',     label: 'Admin',     icon: Shield,   color: 'text-violet-600', bg: 'bg-violet-50', border: 'border-violet-300', desc: 'Manage the platform and oversee all operations.' },
];

export default function Register() {
  const { signUp } = useAuth();
  const navigate = useNavigate();

  const [role, setRole]       = useState<UserRole>('donor');
  const [showPw, setShowPw]   = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState('');
  const [success, setSuccess] = useState(false);
  const [form, setForm]       = useState({
    full_name: '', phone: '', email: '', password: '', organization: '', address: '',
  });

  const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm(f => ({ ...f, [k]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    const { error: err } = await signUp({
      email: form.email, password: form.password,
      full_name: form.full_name, phone: form.phone, role,
      organization: form.organization, address: form.address,
    });
    if (err) {
      setError(err || 'Registration failed. Please try again.');
    } else {
      setSuccess(true);
      setTimeout(() => navigate('/login'), 3000);
    }
    setLoading(false);
  };

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-surface-50 p-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="card p-12 text-center max-w-md w-full shadow-premium"
        >
          <motion.div
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 0.5 }}
            className="w-20 h-20 rounded-full bg-brand-50 flex items-center justify-center mx-auto mb-6"
          >
            <CheckCircle2 className="w-10 h-10 text-brand-500" />
          </motion.div>
          <h2 className="text-2xl font-bold text-surface-dark mb-3">You're In!</h2>
          <p className="text-surface-300 mb-2">Your account has been created successfully.</p>
          <p className="text-sm text-surface-300">Redirecting to sign in…</p>
          <div className="mt-6 h-1 bg-surface-100 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-brand-500 to-accent-500"
              initial={{ width: '0%' }}
              animate={{ width: '100%' }}
              transition={{ duration: 3, ease: 'linear' }}
            />
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex">
      {/* Left panel */}
      <div className="hidden lg:flex lg:w-5/12 hero-bg relative overflow-hidden flex-col items-center justify-center p-12">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <motion.div animate={{ scale:[1,1.2,1], opacity:[0.3,0.5,0.3] }} transition={{ duration:8, repeat:Infinity }}
            className="absolute top-1/4 -left-20 w-72 h-72 rounded-full bg-brand-500/20 blur-3xl" />
        </div>

        <motion.div animate={{ y:[-10,10,-10] }} transition={{ duration:5, repeat:Infinity, ease:'easeInOut' }}
          className="w-24 h-24 rounded-3xl bg-white/10 border border-white/20 flex items-center justify-center mb-6">
          <img src="/food-bridge-logo.svg" alt="" className="w-18 h-18" />
        </motion.div>

        <h2 className="text-2xl font-bold text-white text-center mb-3">Join Food Bridge</h2>
        <p className="text-white/60 text-sm text-center max-w-xs leading-relaxed">
          Create your free account and start making a real difference in your community.
        </p>

        <div className="mt-10 space-y-3 w-full max-w-xs">
          {ROLES.map(({ value, label, icon: Icon, desc }) => (
            <motion.div key={value} whileHover={{ x: 4 }}
              className={`flex items-start gap-3 p-3 rounded-2xl border transition-colors cursor-pointer ${
                role === value ? 'bg-white/15 border-white/30' : 'bg-white/5 border-white/10 hover:bg-white/10'
              }`}
              onClick={() => setRole(value)}
            >
              <Icon className="w-5 h-5 text-white mt-0.5 shrink-0" />
              <div>
                <p className="text-white text-sm font-medium">{label}</p>
                <p className="text-white/50 text-xs">{desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Right panel – form */}
      <div className="flex-1 flex items-center justify-center p-6 lg:p-12 bg-surface-50 overflow-y-auto">
        <motion.div initial={{ opacity:0, y:24 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.5 }}
          className="w-full max-w-lg py-8">

          <div className="lg:hidden text-center mb-8">
            <Link to="/" className="inline-flex items-center gap-2">
              <img src="/food-bridge-logo.svg" alt="" className="w-10 h-10" />
              <span className="font-bold text-lg"><span className="text-brand-500">Food</span> <span className="text-accent-500">Bridge</span></span>
            </Link>
          </div>

          <div className="card p-8 shadow-premium">
            <div className="mb-6">
              <h1 className="text-2xl font-bold text-surface-dark mb-1">Create Account</h1>
              <p className="text-surface-300 text-sm">Join thousands already making a difference.</p>
            </div>

            {/* Role picker */}
            <div className="grid grid-cols-3 gap-3 mb-6">
              {ROLES.map(({ value, label, icon: Icon, color, bg, border }) => (
                <motion.button key={value} type="button" whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                  onClick={() => setRole(value)}
                  className={`p-3 rounded-2xl border-2 text-center transition-all duration-200 ${
                    role === value ? `${bg} ${border}` : 'bg-surface-50 border-surface-200 hover:border-surface-300'
                  }`}
                >
                  <Icon className={`w-5 h-5 mx-auto mb-1.5 ${role === value ? color : 'text-surface-300'}`} />
                  <span className={`text-xs font-semibold ${role === value ? color : 'text-surface-300'}`}>{label}</span>
                </motion.button>
              ))}
            </div>

            {error && (
              <motion.div initial={{ opacity:0, y:-8 }} animate={{ opacity:1, y:0 }}
                className="flex items-center gap-3 p-4 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-sm mb-5">
                <AlertCircle className="w-4 h-4 shrink-0" />
                {error}
              </motion.div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-surface-dark mb-1.5 uppercase tracking-wide">Full Name</label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-300" />
                    <input value={form.full_name} onChange={set('full_name')} required placeholder="Jane Smith" className="input-field pl-11" />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-surface-dark mb-1.5 uppercase tracking-wide">Phone</label>
                  <div className="relative">
                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-300" />
                    <input value={form.phone} onChange={set('phone')} placeholder="+91 98765 43210" className="input-field pl-11" />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-surface-dark mb-1.5 uppercase tracking-wide">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-300" />
                  <input type="email" value={form.email} onChange={set('email')} required placeholder="you@example.com" className="input-field pl-11" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-surface-dark mb-1.5 uppercase tracking-wide">Password</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-300" />
                  <input type={showPw ? 'text' : 'password'} value={form.password} onChange={set('password')} required
                    placeholder="Min. 8 characters" className="input-field pl-11 pr-11" />
                  <button type="button" onClick={() => setShowPw(!showPw)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-surface-300 hover:text-surface-dark transition-colors">
                    {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-surface-dark mb-1.5 uppercase tracking-wide">
                  Organization <span className="text-surface-300 normal-case font-normal">(optional)</span>
                </label>
                <div className="relative">
                  <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-300" />
                  <input value={form.organization} onChange={set('organization')} placeholder="Restaurant / NGO / Company" className="input-field pl-11" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-surface-dark mb-1.5 uppercase tracking-wide">
                  Address <span className="text-surface-300 normal-case font-normal">(optional)</span>
                </label>
                <div className="relative">
                  <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-300" />
                  <input value={form.address} onChange={set('address')} placeholder="Your city or area" className="input-field pl-11" />
                </div>
              </div>

              <button type="submit" disabled={loading} className="btn-primary w-full py-3.5 text-base disabled:opacity-70">
                {loading ? (
                  <span className="flex items-center gap-2">
                    <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                    Creating Account…
                  </span>
                ) : (
                  <>Create Free Account <ArrowRight className="w-4 h-4" /></>
                )}
              </button>
            </form>

            <p className="text-center text-sm text-surface-300 mt-5">
              Already have an account?{' '}
              <Link to="/login" className="text-brand-500 font-semibold hover:text-brand-600 transition-colors">Sign in</Link>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

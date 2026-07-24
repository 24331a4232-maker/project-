import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Lock, Eye, EyeOff, ArrowRight, AlertCircle, Leaf } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

export default function Login() {
  const { signIn } = useAuth();
  const navigate   = useNavigate();
  const location   = useLocation();
  const from       = (location.state as any)?.from?.pathname || '/';

  const [form, setForm]       = useState({ email: '', password: '' });
  const [showPw, setShowPw]   = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    const { error: err } = await signIn(form.email, form.password);
    if (err) {
      setError(err || 'Invalid credentials. Please try again.');
    } else {
      navigate(from, { replace: true });
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex">
      {/* Left panel – decorative */}
      <div className="hidden lg:flex lg:w-1/2 hero-bg relative overflow-hidden flex-col items-center justify-center p-12">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <motion.div animate={{ scale: [1,1.2,1], opacity:[0.3,0.5,0.3] }} transition={{ duration:8, repeat:Infinity }}
            className="absolute top-1/4 -left-20 w-72 h-72 rounded-full bg-brand-500/20 blur-3xl" />
          <motion.div animate={{ scale: [1.2,1,1.2], opacity:[0.2,0.4,0.2] }} transition={{ duration:10, repeat:Infinity, delay:2 }}
            className="absolute bottom-1/4 -right-20 w-64 h-64 rounded-full bg-accent-500/20 blur-3xl" />
        </div>

        <motion.div
          animate={{ y: [-10, 10, -10] }}
          transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
          className="w-28 h-28 rounded-3xl bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center mb-8 shadow-2xl"
        >
          <img src="/food-bridge-logo.svg" alt="Food Bridge" className="w-20 h-20" />
        </motion.div>

        <h2 className="text-3xl font-bold text-white text-center mb-4">
          Welcome Back to<br />
          <span className="text-gradient-green">Food Bridge</span>
        </h2>
        <p className="text-white/60 text-center max-w-xs leading-relaxed">
          Sign in to your account and continue making a difference — one meal at a time.
        </p>

        <div className="mt-12 grid grid-cols-3 gap-4 w-full max-w-xs">
          {[['24,500+', 'Meals Shared'], ['1,200+', 'Volunteers'], ['12t', 'Food Saved']].map(([v, l]) => (
            <div key={l} className="text-center bg-white/10 backdrop-blur-sm rounded-2xl p-3 border border-white/15">
              <p className="text-white font-bold text-lg">{v}</p>
              <p className="text-white/50 text-xs">{l}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Right panel – form */}
      <div className="flex-1 flex items-center justify-center p-6 lg:p-12 bg-surface-50">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          {/* Mobile logo */}
          <div className="lg:hidden text-center mb-8">
            <Link to="/" className="inline-flex items-center gap-2">
              <img src="/food-bridge-logo.svg" alt="Food Bridge" className="w-10 h-10" />
              <span className="font-bold text-lg"><span className="text-brand-500">Food</span> <span className="text-accent-500">Bridge</span></span>
            </Link>
          </div>

          <div className="card p-8 shadow-premium">
            <div className="mb-8">
              <h1 className="text-2xl font-bold text-surface-dark mb-1">Sign In</h1>
              <p className="text-surface-300 text-sm">Enter your credentials to access your dashboard.</p>
            </div>

            {error && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-3 p-4 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-sm mb-6"
              >
                <AlertCircle className="w-4 h-4 shrink-0" />
                {error}
              </motion.div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-surface-dark mb-1.5">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-300" />
                  <input
                    type="email" value={form.email} onChange={e => setForm(f => ({...f, email: e.target.value}))}
                    required placeholder="you@example.com" className="input-field pl-11"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-sm font-medium text-surface-dark">Password</label>
                  <button type="button" className="text-xs text-brand-500 hover:text-brand-600 font-medium">Forgot password?</button>
                </div>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-300" />
                  <input
                    type={showPw ? 'text' : 'password'} value={form.password}
                    onChange={e => setForm(f => ({...f, password: e.target.value}))}
                    required placeholder="Your password" className="input-field pl-11 pr-11"
                  />
                  <button type="button" onClick={() => setShowPw(!showPw)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-surface-300 hover:text-surface-dark transition-colors">
                    {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button type="submit" disabled={loading}
                className="btn-primary w-full py-3.5 text-base mt-2 disabled:opacity-70">
                {loading ? (
                  <span className="flex items-center gap-2">
                    <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                    Signing In…
                  </span>
                ) : (
                  <>Sign In <ArrowRight className="w-4 h-4" /></>
                )}
              </button>
            </form>

            <p className="text-center text-sm text-surface-300 mt-6">
              Don't have an account?{' '}
              <Link to="/register" className="text-brand-500 font-semibold hover:text-brand-600 transition-colors">
                Create one free
              </Link>
            </p>
          </div>

          <p className="text-center text-xs text-surface-300 mt-6 flex items-center justify-center gap-1">
            <Leaf className="w-3 h-3 text-brand-400" />
            Secure sign-in powered by Supabase Auth
          </p>
        </motion.div>
      </div>
    </div>
  );
}

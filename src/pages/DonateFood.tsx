import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Upload, X, CheckCircle2, ArrowRight, Camera, Package, Clock,
  MapPin, Phone, AlertCircle, Utensils, ChevronRight
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { supabase, FOOD_TYPES } from '@/lib/supabase';
import PageHeader from '@/components/PageHeader';

const TIPS = [
  'Only donate food that is safe, fresh, and suitable for consumption.',
  'Cooked food should be donated within 2–3 hours of preparation.',
  'Include accurate pickup time so volunteers can plan efficiently.',
  'Add a contact number so the volunteer can reach you easily.',
];

export default function DonateFood() {
  const { user, profile } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    food_name: '', food_type: 'Cooked', quantity: '', pickup_address: '',
    pickup_time: '', expiry_time: '', contact_number: profile?.phone || '',
  });
  const [imageFile, setImageFile]   = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [loading, setLoading]       = useState(false);
  const [success, setSuccess]       = useState(false);
  const [donationId, setDonationId] = useState('');
  const [error, setError]           = useState('');
  const fileRef = useRef<HTMLInputElement>(null);

  const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    setForm(f => ({ ...f, [k]: e.target.value }));

  const handleImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !profile) return;
    setError('');
    setLoading(true);
    try {
      let image_url = '';
      if (imageFile) {
        const ext  = imageFile.name.split('.').pop();
        const path = `${user.id}/${Date.now()}.${ext}`;
        const { error: upErr } = await supabase.storage.from('food-images').upload(path, imageFile);
        if (upErr) throw upErr;
        const { data: { publicUrl } } = supabase.storage.from('food-images').getPublicUrl(path);
        image_url = publicUrl;
      }

      const { data, error: insErr } = await supabase.from('donations').insert({
        donor_id:     user.id,
        donor_name:   profile.full_name,
        ...form,
        image_url,
        status: 'available',
      }).select('id').single();
      if (insErr) throw insErr;

      setDonationId(data.id);
      setSuccess(true);
    } catch (err: any) {
      setError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-surface-50 p-6 pt-24">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="card p-12 text-center max-w-md w-full shadow-premium"
        >
          <motion.div
            animate={{ scale: [0.8, 1.1, 1] }}
            transition={{ duration: 0.5 }}
            className="w-24 h-24 rounded-full bg-brand-50 flex items-center justify-center mx-auto mb-6"
          >
            <CheckCircle2 className="w-12 h-12 text-brand-500" />
          </motion.div>
          <h2 className="text-2xl font-bold text-surface-dark mb-3">Donation Posted!</h2>
          <p className="text-surface-300 mb-8 leading-relaxed">
            Your food donation is now live. Volunteers in your area will be notified and will contact you for pickup.
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <button onClick={() => navigate('/donations')} className="btn-primary flex-1">
              View All Donations <ArrowRight className="w-4 h-4" />
            </button>
            <button onClick={() => { setSuccess(false); setImageFile(null); setImagePreview(null);
              setForm({ food_name:'', food_type:'Cooked', quantity:'', pickup_address:'', pickup_time:'', expiry_time:'', contact_number: profile?.phone||'' });
            }} className="btn-secondary flex-1">
              Donate More
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="overflow-hidden">
      <PageHeader title="Donate Surplus Food" subtitle="Post your surplus food in under 2 minutes and help feed families in need." />

      <section className="section-padding bg-surface-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-3 gap-8">

            {/* Tips sidebar */}
            <div className="lg:col-span-1 space-y-6">
              <motion.div initial={{ opacity:0, x:-24 }} animate={{ opacity:1, x:0 }} transition={{ duration:0.5 }}
                className="card p-6">
                <h3 className="font-bold text-surface-dark mb-4 flex items-center gap-2">
                  <Utensils className="w-5 h-5 text-brand-500" /> Food Safety Tips
                </h3>
                <ul className="space-y-3">
                  {TIPS.map((tip, i) => (
                    <li key={i} className="flex items-start gap-2.5 text-sm text-surface-300">
                      <ChevronRight className="w-4 h-4 text-brand-400 mt-0.5 shrink-0" />
                      {tip}
                    </li>
                  ))}
                </ul>
              </motion.div>

              <motion.div initial={{ opacity:0, x:-24 }} animate={{ opacity:1, x:0 }} transition={{ duration:0.5, delay:0.1 }}
                className="card p-6 bg-gradient-to-br from-brand-50 to-brand-100/50 border-brand-100">
                <h3 className="font-bold text-brand-800 mb-2">Why Donate?</h3>
                <p className="text-brand-700 text-sm leading-relaxed">
                  Each donation prevents 2–5 kg of food from going to waste while feeding a real family. Your contribution is tracked and impacts lives directly.
                </p>
                <div className="mt-4 grid grid-cols-2 gap-3">
                  {[['2 min', 'to post'], ['45 min', 'avg pickup'], ['0 waste', 'guaranteed'], ['100%', 'free']].map(([v,l]) => (
                    <div key={l} className="text-center bg-white/70 rounded-xl p-2">
                      <p className="font-bold text-brand-600 text-sm">{v}</p>
                      <p className="text-brand-500/70 text-xs">{l}</p>
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>

            {/* Form */}
            <motion.div
              initial={{ opacity:0, y:24 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.5, delay:0.1 }}
              className="lg:col-span-2"
            >
              <div className="card p-8 shadow-premium">
                {error && (
                  <motion.div initial={{ opacity:0, y:-8 }} animate={{ opacity:1, y:0 }}
                    className="flex items-center gap-3 p-4 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-sm mb-6">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    {error}
                  </motion.div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Image upload */}
                  <div>
                    <label className="block text-sm font-semibold text-surface-dark mb-2">Food Photo <span className="text-surface-300 font-normal">(optional)</span></label>
                    <div
                      onClick={() => fileRef.current?.click()}
                      className={`relative rounded-2xl border-2 border-dashed cursor-pointer transition-all duration-200 ${
                        imagePreview ? 'border-brand-300 bg-brand-50/30' : 'border-surface-200 bg-surface-50 hover:border-brand-300 hover:bg-brand-50/20'
                      }`}
                    >
                      <input ref={fileRef} type="file" accept="image/*" onChange={handleImage} className="hidden" />
                      {imagePreview ? (
                        <div className="relative h-48">
                          <img src={imagePreview} alt="Preview" className="w-full h-full object-cover rounded-2xl" />
                          <button type="button" onClick={e => { e.stopPropagation(); setImageFile(null); setImagePreview(null); }}
                            className="absolute top-2 right-2 w-8 h-8 rounded-full bg-red-500 text-white flex items-center justify-center hover:bg-red-600 transition-colors">
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ) : (
                        <div className="h-36 flex flex-col items-center justify-center gap-2">
                          <Camera className="w-8 h-8 text-surface-300" />
                          <p className="text-sm text-surface-300 font-medium">Click to upload a photo</p>
                          <p className="text-xs text-surface-300">PNG, JPG up to 10MB</p>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-surface-dark mb-1.5 uppercase tracking-wide">Food Name *</label>
                      <input value={form.food_name} onChange={set('food_name')} required placeholder="e.g. Biryani, Bread, Salad…"
                        className="input-field" />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-surface-dark mb-1.5 uppercase tracking-wide">Food Type *</label>
                      <select value={form.food_type} onChange={set('food_type')} className="input-field">
                        {FOOD_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-surface-dark mb-1.5 uppercase tracking-wide">Quantity *</label>
                    <div className="relative">
                      <Package className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-300" />
                      <input value={form.quantity} onChange={set('quantity')} required placeholder="e.g. 20 portions, 5 kg, 2 boxes…"
                        className="input-field pl-11" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-surface-dark mb-1.5 uppercase tracking-wide">Pickup Address *</label>
                    <div className="relative">
                      <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-300" />
                      <input value={form.pickup_address} onChange={set('pickup_address')} required placeholder="Full address for pickup…"
                        className="input-field pl-11" />
                    </div>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-surface-dark mb-1.5 uppercase tracking-wide">Pickup Time *</label>
                      <div className="relative">
                        <Clock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-300" />
                        <input type="datetime-local" value={form.pickup_time} onChange={set('pickup_time')} required className="input-field pl-11" />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-surface-dark mb-1.5 uppercase tracking-wide">Expiry Time</label>
                      <div className="relative">
                        <Clock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-300" />
                        <input type="datetime-local" value={form.expiry_time} onChange={set('expiry_time')} className="input-field pl-11" />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-surface-dark mb-1.5 uppercase tracking-wide">Contact Number *</label>
                    <div className="relative">
                      <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-300" />
                      <input value={form.contact_number} onChange={set('contact_number')} required placeholder="+91 98765 43210"
                        className="input-field pl-11" />
                    </div>
                  </div>

                  <button type="submit" disabled={loading} className="btn-primary w-full py-4 text-base disabled:opacity-70">
                    {loading ? (
                      <span className="flex items-center gap-2">
                        <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                        Posting Donation…
                      </span>
                    ) : (
                      <>Post Donation <ArrowRight className="w-5 h-5" /></>
                    )}
                  </button>
                </form>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}

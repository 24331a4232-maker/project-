import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Package, CheckCircle, Truck, Star, Upload, X, AlertCircle,
  Clock, MapPin, Phone, User, ChevronRight, Award
} from 'lucide-react';
import { supabase, type Donation, STATUS_META } from '@/lib/supabase';
import { useAuth } from '@/context/AuthContext';
import PageHeader from '@/components/PageHeader';

function StatusBadge({ status }: { status: string }) {
  const meta = STATUS_META[status] || { label: status, color: 'bg-gray-100 text-gray-700', dot: 'bg-gray-400' };
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${meta.color}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${meta.dot}`} />
      {meta.label}
    </span>
  );
}

export default function VolunteerDashboard() {
  const { user, profile } = useAuth();
  const [donations, setDonations]   = useState<Donation[]>([]);
  const [loading, setLoading]       = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [proofFile, setProofFile]   = useState<{ [id: string]: File }>({});
  const [error, setError]           = useState('');

  useEffect(() => {
    if (!user) return;
    const fetchData = async () => {
      const { data } = await supabase
        .from('donations').select('*')
        .eq('volunteer_id', user.id)
        .order('accepted_at', { ascending: false });
      setDonations(data || []);
      setLoading(false);
    };
    fetchData();
  }, [user]);

  const active  = donations.filter(d => ['accepted', 'picked_up'].includes(d.status));
  const history = donations.filter(d => ['delivered', 'cancelled'].includes(d.status));

  const markPickedUp = async (id: string) => {
    setUpdatingId(id);
    await supabase.from('donations').update({ status: 'picked_up', picked_up_at: new Date().toISOString() }).eq('id', id);
    setDonations(prev => prev.map(d => d.id === id ? { ...d, status: 'picked_up' as any, picked_up_at: new Date().toISOString() } : d));
    setUpdatingId(null);
  };

  const confirmDelivery = async (donation: Donation) => {
    const file = proofFile[donation.id];
    if (!file || !user) return;
    setUpdatingId(donation.id);
    setError('');
    try {
      const path = `proofs/${user.id}/${Date.now()}.${file.name.split('.').pop()}`;
      const { error: upErr } = await supabase.storage.from('food-images').upload(path, file);
      if (upErr) throw upErr;
      const { data: { publicUrl } } = supabase.storage.from('food-images').getPublicUrl(path);
      await supabase.from('donations').update({
        status: 'delivered', proof_image_url: publicUrl, delivered_at: new Date().toISOString(),
      }).eq('id', donation.id);
      setDonations(prev => prev.map(d => d.id === donation.id ? { ...d, status: 'delivered' as any, proof_image_url: publicUrl } : d));
    } catch (err: any) {
      setError(err.message);
    } finally {
      setUpdatingId(null);
    }
  };

  const STATS = [
    { icon: Package,     label: 'Active Pickups',  value: active.length,    color: 'text-brand-500',  bg: 'bg-brand-50' },
    { icon: Truck,       label: 'Picked Up',        value: donations.filter(d=>d.status==='picked_up').length, color: 'text-blue-500', bg: 'bg-blue-50' },
    { icon: CheckCircle, label: 'Delivered',        value: donations.filter(d=>d.status==='delivered').length, color: 'text-brand-500', bg: 'bg-brand-50' },
    { icon: Star,        label: 'Total Claims',     value: donations.length, color: 'text-accent-500', bg: 'bg-accent-50' },
  ];

  return (
    <div className="overflow-hidden">
      <PageHeader
        title={`Hey, ${profile?.full_name?.split(' ')[0] || 'Volunteer'}!`}
        subtitle="Track your active pickups and delivery history. Every delivery makes a difference."
      />

      <section className="section-padding bg-surface-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">

          {/* Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {STATS.map(({ icon: Icon, label, value, color, bg }, i) => (
              <motion.div key={label} initial={{ opacity:0, y:16 }} animate={{ opacity:1, y:0 }}
                transition={{ delay: i*0.08 }} whileHover={{ y:-4, scale:1.02 }}
                className="card p-5 card-hover group">
                <div className={`w-11 h-11 ${bg} rounded-2xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}>
                  <Icon className={`w-5 h-5 ${color}`} />
                </div>
                <p className="text-2xl font-bold text-surface-dark">{value}</p>
                <p className="text-xs text-surface-300 font-medium mt-0.5">{label}</p>
              </motion.div>
            ))}
          </div>

          {/* Error */}
          <AnimatePresence>
            {error && (
              <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}
                className="flex items-center gap-3 p-4 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-sm">
                <AlertCircle className="w-4 h-4 shrink-0" />
                {error}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Active pickups */}
          <div>
            <h2 className="text-xl font-bold text-surface-dark mb-4 flex items-center gap-2">
              <div className="w-2 h-6 bg-brand-500 rounded-full" />
              Active Pickups
              {active.length > 0 && <span className="badge-green ml-1">{active.length}</span>}
            </h2>

            {loading ? (
              <div className="space-y-4">
                {[1,2].map(i => <div key={i} className="skeleton h-40 rounded-3xl" />)}
              </div>
            ) : active.length === 0 ? (
              <div className="card p-12 text-center">
                <Package className="w-12 h-12 text-surface-200 mx-auto mb-3" />
                <p className="font-semibold text-surface-dark mb-1">No active pickups</p>
                <p className="text-sm text-surface-300">Head to Available Donations to claim your next pickup.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {active.map((d, i) => (
                  <motion.div key={d.id} initial={{ opacity:0, y:16 }} animate={{ opacity:1, y:0 }}
                    transition={{ delay: i*0.08 }} className="card p-6">
                    <div className="flex flex-col lg:flex-row gap-6">
                      {/* Info */}
                      <div className="flex-1">
                        <div className="flex items-start justify-between gap-4 mb-4">
                          <div>
                            <h3 className="font-bold text-surface-dark text-lg">{d.food_name}</h3>
                            <p className="text-sm text-surface-300 mt-0.5">{d.donor_name}</p>
                          </div>
                          <StatusBadge status={d.status} />
                        </div>
                        <div className="grid sm:grid-cols-2 gap-3">
                          {[
                            { icon: Package,  text: d.quantity,         color: 'text-brand-400' },
                            { icon: MapPin,   text: d.pickup_address,   color: 'text-accent-400' },
                            { icon: Clock,    text: d.pickup_time ? new Date(d.pickup_time).toLocaleString() : '', color: 'text-blue-400' },
                            { icon: Phone,    text: d.contact_number,   color: 'text-violet-400' },
                          ].filter(r => r.text).map(({ icon: Icon, text, color }) => (
                            <div key={text} className="flex items-center gap-2 text-sm text-surface-300">
                              <Icon className={`w-4 h-4 ${color} shrink-0`} />
                              <span className="line-clamp-1">{text}</span>
                            </div>
                          ))}
                        </div>

                        {/* Timeline progress */}
                        <div className="mt-5 flex items-center gap-0">
                          {[
                            { key: 'accepted',  label: 'Claimed',   done: true },
                            { key: 'picked_up', label: 'Picked Up', done: d.status === 'picked_up' || d.status === 'delivered' },
                            { key: 'delivered', label: 'Delivered', done: d.status === 'delivered' },
                          ].map(({ label, done }, idx, arr) => (
                            <div key={label} className="flex items-center gap-0 flex-1">
                              <div className="flex flex-col items-center gap-1">
                                <div className={`w-6 h-6 rounded-full flex items-center justify-center transition-all ${
                                  done ? 'bg-brand-500 shadow-md shadow-brand-500/40' : 'bg-surface-100'
                                }`}>
                                  {done ? <CheckCircle className="w-3.5 h-3.5 text-white" /> : <div className="w-2 h-2 rounded-full bg-surface-200" />}
                                </div>
                                <span className="text-[10px] text-surface-300 whitespace-nowrap">{label}</span>
                              </div>
                              {idx < arr.length - 1 && (
                                <div className={`flex-1 h-0.5 mb-4 mx-1 transition-colors ${done ? 'bg-brand-300' : 'bg-surface-200'}`} />
                              )}
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="lg:w-56 flex flex-col gap-3">
                        {d.status === 'accepted' && (
                          <button onClick={() => markPickedUp(d.id)} disabled={updatingId === d.id}
                            className="btn-primary text-sm py-2.5 disabled:opacity-70">
                            {updatingId === d.id ? (
                              <span className="flex items-center gap-2"><span className="w-3.5 h-3.5 border-2 border-white/40 border-t-white rounded-full animate-spin" />Updating…</span>
                            ) : (
                              <><Truck className="w-4 h-4" />Mark as Picked Up</>
                            )}
                          </button>
                        )}
                        {d.status === 'picked_up' && (
                          <div className="space-y-2">
                            <label className="block text-xs font-semibold text-surface-dark mb-1">Upload Proof Photo</label>
                            <input type="file" accept="image/*"
                              onChange={e => { const f = e.target.files?.[0]; if (f) setProofFile(p => ({...p, [d.id]: f})); }}
                              className="w-full text-xs text-surface-300 file:mr-2 file:py-1.5 file:px-3 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-brand-50 file:text-brand-600 hover:file:bg-brand-100 cursor-pointer"
                            />
                            {proofFile[d.id] && (
                              <button onClick={() => confirmDelivery(d)} disabled={updatingId === d.id}
                                className="btn-accent text-sm py-2.5 w-full disabled:opacity-70">
                                {updatingId === d.id ? (
                                  <span className="flex items-center gap-2"><span className="w-3.5 h-3.5 border-2 border-white/40 border-t-white rounded-full animate-spin" />Confirming…</span>
                                ) : (
                                  <><CheckCircle className="w-4 h-4" />Confirm Delivery</>
                                )}
                              </button>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>

          {/* History */}
          {!loading && history.length > 0 && (
            <div>
              <h2 className="text-xl font-bold text-surface-dark mb-4 flex items-center gap-2">
                <div className="w-2 h-6 bg-surface-200 rounded-full" />
                Delivery History
              </h2>
              <div className="card overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-surface-50 border-b border-surface-100">
                      <tr>
                        {['Food Item', 'Donor', 'Date', 'Status', 'Proof'].map(h => (
                          <th key={h} className="px-5 py-3.5 text-left text-xs font-semibold text-surface-300 uppercase tracking-wide">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-surface-50">
                      {history.map(d => (
                        <tr key={d.id} className="hover:bg-surface-50 transition-colors">
                          <td className="px-5 py-4 font-medium text-surface-dark">{d.food_name}</td>
                          <td className="px-5 py-4 text-surface-300">{d.donor_name}</td>
                          <td className="px-5 py-4 text-surface-300">{d.delivered_at ? new Date(d.delivered_at).toLocaleDateString() : '—'}</td>
                          <td className="px-5 py-4"><StatusBadge status={d.status} /></td>
                          <td className="px-5 py-4">
                            {d.proof_image_url
                              ? <a href={d.proof_image_url} target="_blank" rel="noopener noreferrer"
                                  className="text-brand-500 hover:text-brand-600 text-xs font-medium">View</a>
                              : <span className="text-surface-200 text-xs">—</span>
                            }
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

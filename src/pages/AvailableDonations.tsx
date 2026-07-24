import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, RefreshCw, Filter, Package, AlertCircle, SlidersHorizontal } from 'lucide-react';
import { supabase, FOOD_TYPES, type Donation } from '@/lib/supabase';
import { useAuth } from '@/context/AuthContext';
import DonationCard from '@/components/DonationCard';
import PageHeader from '@/components/PageHeader';

export default function AvailableDonations() {
  const { user, profile } = useAuth();
  const [donations, setDonations]   = useState<Donation[]>([]);
  const [loading, setLoading]       = useState(true);
  const [accepting, setAccepting]   = useState<string | null>(null);
  const [search, setSearch]         = useState('');
  const [typeFilter, setTypeFilter] = useState('All');
  const [error, setError]           = useState('');

  const fetchDonations = async () => {
    setLoading(true);
    const { data, error: err } = await supabase
      .from('donations')
      .select('*')
      .eq('status', 'available')
      .order('created_at', { ascending: false });
    if (err) setError(err.message);
    else setDonations(data || []);
    setLoading(false);
  };

  useEffect(() => { fetchDonations(); }, []);

  const handleAccept = async (donation: Donation) => {
    if (!user || !profile) return;
    if (profile.role === 'donor') { setError("Donors can't accept donations. Please use a volunteer account."); return; }
    setAccepting(donation.id);
    setError('');
    const { error: err } = await supabase
      .from('donations')
      .update({ status: 'accepted', volunteer_id: user.id, volunteer_name: profile.full_name, accepted_at: new Date().toISOString() })
      .eq('id', donation.id);
    if (err) { setError(err.message); setAccepting(null); return; }
    setDonations(prev => prev.filter(d => d.id !== donation.id));
    setAccepting(null);
  };

  const filtered = donations.filter(d => {
    const matchSearch = !search ||
      d.food_name.toLowerCase().includes(search.toLowerCase()) ||
      d.pickup_address?.toLowerCase().includes(search.toLowerCase());
    const matchType = typeFilter === 'All' || d.food_type === typeFilter;
    return matchSearch && matchType;
  });

  const FILTERS = ['All', ...FOOD_TYPES];

  return (
    <div className="overflow-hidden">
      <PageHeader
        title="Available Donations"
        subtitle="Fresh food donations posted by generous donors in your area. Claim one and deliver it to a family in need."
      />

      <section className="section-padding bg-surface-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* Search + filter bar */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="card p-4 mb-8 flex flex-col sm:flex-row gap-4"
          >
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-300" />
              <input
                value={search} onChange={e => setSearch(e.target.value)}
                placeholder="Search by food name or address…"
                className="input-field pl-11"
              />
            </div>
            <button onClick={fetchDonations}
              className="btn-secondary gap-2 shrink-0">
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </button>
          </motion.div>

          {/* Type filters */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="flex flex-wrap gap-2 mb-8"
          >
            {FILTERS.map(f => (
              <button key={f} onClick={() => setTypeFilter(f)}
                className={typeFilter === f ? 'chip-active' : 'chip-inactive'}>
                {f}
              </button>
            ))}
          </motion.div>

          {/* Error */}
          <AnimatePresence>
            {error && (
              <motion.div initial={{ opacity:0, y:-8 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0 }}
                className="flex items-center gap-3 p-4 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-sm mb-6">
                <AlertCircle className="w-4 h-4 shrink-0" />
                {error}
                <button onClick={() => setError('')} className="ml-auto text-red-400 hover:text-red-600">×</button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Loading skeletons */}
          {loading && (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="card overflow-hidden">
                  <div className="skeleton h-44 rounded-t-3xl rounded-b-none" />
                  <div className="p-5 space-y-3">
                    <div className="skeleton h-4 w-3/4" />
                    <div className="skeleton h-3 w-1/2" />
                    <div className="skeleton h-3 w-5/6" />
                    <div className="skeleton h-10 w-full mt-2" />
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Empty state */}
          {!loading && filtered.length === 0 && (
            <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} className="text-center py-20">
              <div className="w-20 h-20 rounded-full bg-surface-100 flex items-center justify-center mx-auto mb-4">
                <Package className="w-10 h-10 text-surface-300" />
              </div>
              <h3 className="text-xl font-bold text-surface-dark mb-2">No donations found</h3>
              <p className="text-surface-300">
                {search || typeFilter !== 'All' ? 'Try adjusting your search or filters.' : 'Be the first to post a donation today!'}
              </p>
            </motion.div>
          )}

          {/* Grid */}
          {!loading && filtered.length > 0 && (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              <AnimatePresence>
                {filtered.map((donation, i) => (
                  <motion.div
                    key={donation.id}
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0, transition: { delay: i * 0.04 } }}
                    exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
                  >
                    <DonationCard
                      donation={donation}
                      onAction={user && profile?.role !== 'donor' ? () => handleAccept(donation) : undefined}
                      actionLabel="Claim Pickup"
                      actionVariant="primary"
                      actionLoading={accepting === donation.id}
                    />
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Package, Users, CheckCircle, TrendingUp, Search, Trash2,
  AlertCircle, BarChart3, List, UserCog, ChevronRight
} from 'lucide-react';
import { supabase, type Donation, type Profile, STATUS_META, FOOD_TYPE_META } from '@/lib/supabase';
import PageHeader from '@/components/PageHeader';
import StatCard from '@/components/StatCard';

const TABS = [
  { id: 'overview',  label: 'Overview',    icon: BarChart3 },
  { id: 'donations', label: 'Donations',   icon: List },
  { id: 'users',     label: 'Users',       icon: UserCog },
] as const;

type Tab = typeof TABS[number]['id'];

export default function AdminDashboard() {
  const [donations, setDonations] = useState<Donation[]>([]);
  const [profiles, setProfiles]   = useState<Profile[]>([]);
  const [loading, setLoading]     = useState(true);
  const [tab, setTab]             = useState<Tab>('overview');
  const [search, setSearch]       = useState('');
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [error, setError]         = useState('');

  useEffect(() => {
    const load = async () => {
      const [{ data: d }, { data: p }] = await Promise.all([
        supabase.from('donations').select('*').order('created_at', { ascending: false }),
        supabase.from('profiles').select('*').order('created_at', { ascending: false }),
      ]);
      setDonations(d || []);
      setProfiles(p || []);
      setLoading(false);
    };
    load();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm('Permanently delete this donation?')) return;
    setDeletingId(id);
    const { error: err } = await supabase.from('donations').delete().eq('id', id);
    if (err) { setError(err.message); setDeletingId(null); return; }
    setDonations(prev => prev.filter(d => d.id !== id));
    setDeletingId(null);
  };

  const statusCounts = Object.fromEntries(
    ['available','accepted','picked_up','delivered','cancelled'].map(s => [s, donations.filter(d => d.status === s).length])
  );
  const typeCounts = Object.fromEntries(
    ['Cooked','Raw','Bakery','Beverages','Other'].map(t => [t, donations.filter(d => d.food_type === t).length])
  );

  const filteredDonations = donations.filter(d =>
    !search || d.food_name.toLowerCase().includes(search.toLowerCase()) ||
    d.donor_name?.toLowerCase().includes(search.toLowerCase())
  );
  const filteredProfiles = profiles.filter(p =>
    !search || p.full_name?.toLowerCase().includes(search.toLowerCase()) ||
    p.role?.toLowerCase().includes(search.toLowerCase())
  );

  const STATS = [
    { icon: <Package className="w-6 h-6" />, label: 'Total Donations',  value: donations.length,              color: 'text-brand-600',  bg: 'bg-brand-50' },
    { icon: <CheckCircle className="w-6 h-6" />, label: 'Meals Delivered', value: statusCounts.delivered || 0, color: 'text-brand-500',  bg: 'bg-brand-50' },
    { icon: <Users className="w-6 h-6" />,   label: 'Total Users',      value: profiles.length,               color: 'text-blue-600',   bg: 'bg-blue-50' },
    { icon: <TrendingUp className="w-6 h-6" />, label: 'In Progress',   value: (statusCounts.accepted||0)+(statusCounts.picked_up||0), color: 'text-accent-600', bg: 'bg-accent-50' },
  ];

  return (
    <div className="overflow-hidden">
      <PageHeader title="Admin Dashboard" subtitle="Full visibility into Food Bridge operations — manage donations and users." />

      <section className="section-padding bg-surface-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">

          {/* Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {STATS.map((s, i) => (
              <motion.div key={i} initial={{ opacity:0, y:16 }} animate={{ opacity:1, y:0 }} transition={{ delay:i*0.07 }}>
                <StatCard {...s} value={s.value.toString()} />
              </motion.div>
            ))}
          </div>

          {/* Tabs */}
          <div className="card p-1.5 flex gap-1 w-fit">
            {TABS.map(({ id, label, icon: Icon }) => (
              <button key={id} onClick={() => setTab(id)}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl text-sm font-semibold transition-all duration-200 ${
                  tab === id ? 'bg-brand-500 text-white shadow-md shadow-brand-500/30' : 'text-surface-dark hover:bg-surface-50'
                }`}
              >
                <Icon className="w-4 h-4" />
                {label}
              </button>
            ))}
          </div>

          {/* Error */}
          <AnimatePresence>
            {error && (
              <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}
                className="flex items-center gap-3 p-4 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-sm">
                <AlertCircle className="w-4 h-4 shrink-0" />
                {error}
                <button onClick={() => setError('')} className="ml-auto">×</button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Tab: Overview */}
          <AnimatePresence mode="wait">
            {tab === 'overview' && (
              <motion.div key="overview" initial={{ opacity:0, y:12 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0 }}
                className="space-y-6">

                <div className="grid md:grid-cols-2 gap-6">
                  {/* Status chart */}
                  <div className="card p-6">
                    <h3 className="font-bold text-surface-dark mb-5 flex items-center gap-2">
                      <BarChart3 className="w-5 h-5 text-brand-500" /> Donations by Status
                    </h3>
                    <div className="space-y-3">
                      {Object.entries(statusCounts).map(([status, count]) => {
                        const meta = STATUS_META[status];
                        const pct = donations.length ? Math.round((count/donations.length)*100) : 0;
                        return (
                          <div key={status}>
                            <div className="flex items-center justify-between text-sm mb-1.5">
                              <span className="font-medium text-surface-dark capitalize">{meta?.label || status}</span>
                              <span className="text-surface-300">{count} ({pct}%)</span>
                            </div>
                            <div className="h-2 bg-surface-100 rounded-full overflow-hidden">
                              <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${pct}%` }}
                                transition={{ duration: 0.8, ease: 'easeOut' }}
                                className={`h-full rounded-full ${meta?.dot?.replace('bg-', 'bg-').replace('-400', '-500') || 'bg-gray-400'}`}
                              />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Food type chart */}
                  <div className="card p-6">
                    <h3 className="font-bold text-surface-dark mb-5 flex items-center gap-2">
                      <Package className="w-5 h-5 text-accent-500" /> Donations by Food Type
                    </h3>
                    <div className="space-y-3">
                      {Object.entries(typeCounts).map(([type, count]) => {
                        const meta = FOOD_TYPE_META[type];
                        const pct = donations.length ? Math.round((count/donations.length)*100) : 0;
                        return (
                          <div key={type}>
                            <div className="flex items-center justify-between text-sm mb-1.5">
                              <span className="font-medium text-surface-dark">{meta?.emoji} {type}</span>
                              <span className="text-surface-300">{count} ({pct}%)</span>
                            </div>
                            <div className="h-2 bg-surface-100 rounded-full overflow-hidden">
                              <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${pct}%` }}
                                transition={{ duration: 0.8, ease: 'easeOut', delay: 0.1 }}
                                className="h-full rounded-full bg-brand-400"
                              />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* Recent donations list */}
                <div className="card overflow-hidden">
                  <div className="px-6 py-4 border-b border-surface-100 flex items-center justify-between">
                    <h3 className="font-bold text-surface-dark">Recent Donations</h3>
                    <button onClick={() => setTab('donations')} className="text-sm text-brand-500 font-medium flex items-center gap-1 hover:text-brand-600 transition-colors">
                      View All <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead className="bg-surface-50">
                        <tr>{['Food', 'Donor', 'Type', 'Status', 'Date'].map(h => (
                          <th key={h} className="px-5 py-3 text-left text-xs font-semibold text-surface-300 uppercase tracking-wide">{h}</th>
                        ))}</tr>
                      </thead>
                      <tbody className="divide-y divide-surface-50">
                        {donations.slice(0, 5).map(d => {
                          const sm = STATUS_META[d.status];
                          return (
                            <tr key={d.id} className="hover:bg-surface-50 transition-colors">
                              <td className="px-5 py-4 font-medium text-surface-dark">{d.food_name}</td>
                              <td className="px-5 py-4 text-surface-300">{d.donor_name}</td>
                              <td className="px-5 py-4">
                                <span className="badge-gray">{FOOD_TYPE_META[d.food_type]?.emoji} {d.food_type}</span>
                              </td>
                              <td className="px-5 py-4">
                                <span className={`badge text-xs ${sm?.color}`}>
                                  <span className={`w-1.5 h-1.5 rounded-full ${sm?.dot} mr-1`} />{sm?.label}
                                </span>
                              </td>
                              <td className="px-5 py-4 text-surface-300 text-xs">{new Date(d.created_at || '').toLocaleDateString()}</td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Tab: Manage Donations */}
            {tab === 'donations' && (
              <motion.div key="donations" initial={{ opacity:0, y:12 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0 }}
                className="space-y-4">
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-300" />
                  <input value={search} onChange={e => setSearch(e.target.value)}
                    placeholder="Search donations…" className="input-field pl-11" />
                </div>
                <div className="card overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead className="bg-surface-50 border-b border-surface-100">
                        <tr>{['Food', 'Donor', 'Volunteer', 'Status', 'Date', ''].map(h => (
                          <th key={h} className="px-5 py-3.5 text-left text-xs font-semibold text-surface-300 uppercase tracking-wide">{h}</th>
                        ))}</tr>
                      </thead>
                      <tbody className="divide-y divide-surface-50">
                        {filteredDonations.map(d => {
                          const sm = STATUS_META[d.status];
                          return (
                            <motion.tr key={d.id} layout className="hover:bg-surface-50 transition-colors">
                              <td className="px-5 py-4 font-medium text-surface-dark">{d.food_name}</td>
                              <td className="px-5 py-4 text-surface-300">{d.donor_name || '—'}</td>
                              <td className="px-5 py-4 text-surface-300">{d.volunteer_name || '—'}</td>
                              <td className="px-5 py-4">
                                <span className={`badge text-xs ${sm?.color}`}>
                                  <span className={`w-1.5 h-1.5 rounded-full ${sm?.dot} mr-1`} />{sm?.label}
                                </span>
                              </td>
                              <td className="px-5 py-4 text-surface-300 text-xs">{new Date(d.created_at||'').toLocaleDateString()}</td>
                              <td className="px-5 py-4">
                                <button onClick={() => handleDelete(d.id)} disabled={deletingId === d.id}
                                  className="w-8 h-8 rounded-xl bg-red-50 text-red-400 hover:bg-red-100 hover:text-red-600 flex items-center justify-center transition-all disabled:opacity-50">
                                  {deletingId === d.id
                                    ? <span className="w-3 h-3 border-2 border-red-300 border-t-red-500 rounded-full animate-spin" />
                                    : <Trash2 className="w-3.5 h-3.5" />}
                                </button>
                              </td>
                            </motion.tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Tab: Manage Users */}
            {tab === 'users' && (
              <motion.div key="users" initial={{ opacity:0, y:12 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0 }}
                className="space-y-4">
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-300" />
                  <input value={search} onChange={e => setSearch(e.target.value)}
                    placeholder="Search users…" className="input-field pl-11" />
                </div>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredProfiles.map((p, i) => {
                    const roleColor = p.role === 'admin' ? 'badge-violet' : p.role === 'volunteer' ? 'badge-blue' : 'badge-green';
                    const initials = p.full_name?.split(' ').map(n=>n[0]).join('').slice(0,2).toUpperCase() || 'U';
                    const gradients = ['from-brand-400 to-brand-600','from-blue-400 to-blue-600','from-violet-400 to-violet-600','from-accent-400 to-accent-600'];
                    const grad = gradients[i % gradients.length];
                    return (
                      <motion.div key={p.id} initial={{ opacity:0, y:16 }} animate={{ opacity:1, y:0 }}
                        transition={{ delay: i*0.04 }} className="card p-5 flex items-center gap-4 card-hover">
                        <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${grad} flex items-center justify-center text-white font-bold text-sm shrink-0`}>
                          {initials}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-surface-dark truncate">{p.full_name || 'Unknown'}</p>
                          <p className="text-xs text-surface-300 truncate">{p.phone || '—'}</p>
                          <div className="flex items-center gap-2 mt-1.5">
                            <span className={roleColor}>{p.role}</span>
                            {p.organization && (
                              <span className="text-xs text-surface-300 truncate">{p.organization}</span>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>
    </div>
  );
}

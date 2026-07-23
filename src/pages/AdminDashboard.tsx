import { useEffect, useState, useCallback } from 'react';
import {
  Package, Users, Truck, CheckCircle, Loader2, AlertCircle,
  TrendingUp, Search, Trash2, X,
} from 'lucide-react';
import { useAuth } from '@/context/useAuth';
import { supabase, Donation, Profile, STATUS_META, FOOD_TYPE_META, FoodType } from '@/lib/supabase';
import StatCard from '@/components/StatCard';
import PageHeader from '@/components/PageHeader';

type Tab = 'overview' | 'donations' | 'users';

export default function AdminDashboard() {
  const { profile } = useAuth();
  const [tab, setTab] = useState<Tab>('overview');
  const [donations, setDonations] = useState<Donation[]>([]);
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [deleteLoading, setDeleteLoading] = useState<string | null>(null);

  const loadData = useCallback(async () => {
    setLoading(true);
    const [donationsRes, profilesRes] = await Promise.all([
      supabase.from('donations').select('*').order('created_at', { ascending: false }),
      supabase.from('profiles').select('*').order('created_at', { ascending: false }),
    ]);

    if (donationsRes.error || profilesRes.error) {
      setError('Could not load dashboard data.');
    } else {
      setDonations((donationsRes.data as Donation[]) || []);
      setProfiles((profilesRes.data as Profile[]) || []);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleDelete = async (id: string) => {
    setDeleteLoading(id);
    const { error } = await supabase.from('donations').delete().eq('id', id);
    setDeleteLoading(null);
    if (error) {
      setError('Could not delete donation.');
      return;
    }
    setDonations((prev) => prev.filter((d) => d.id !== id));
  };

  // Stats
  const totalDonations = donations.length;
  const deliveredMeals = donations.filter((d) => d.status === 'delivered').length;
  const activeVolunteers = profiles.filter((p) => p.role === 'volunteer').length;
  const inProgress = donations.filter((d) => d.status === 'accepted' || d.status === 'picked_up').length;

  // Analytics: donations by status
  const statusCounts = {
    available: donations.filter((d) => d.status === 'available').length,
    accepted: donations.filter((d) => d.status === 'accepted').length,
    picked_up: donations.filter((d) => d.status === 'picked_up').length,
    delivered: donations.filter((d) => d.status === 'delivered').length,
    cancelled: donations.filter((d) => d.status === 'cancelled').length,
  };

  // Analytics: donations by food type
  const typeCounts: Record<string, number> = {};
  donations.forEach((d) => {
    typeCounts[d.food_type] = (typeCounts[d.food_type] || 0) + 1;
  });

  // Recent donations for overview
  const recentDonations = donations.slice(0, 5);

  // Filtered donations for table
  const filteredDonations = donations.filter((d) => {
    if (!search) return true;
    const s = search.toLowerCase();
    return (
      d.food_name.toLowerCase().includes(s) ||
      d.donor_name.toLowerCase().includes(s) ||
      (d.volunteer_name?.toLowerCase().includes(s) ?? false) ||
      d.status.toLowerCase().includes(s)
    );
  });

  const formatTime = (iso: string) =>
    new Date(iso).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' });

  const maxStatusCount = Math.max(...Object.values(statusCounts), 1);
  const maxTypeCount = Math.max(...Object.values(typeCounts), 1);

  const tabs: { id: Tab; label: string; icon: typeof Package }[] = [
    { id: 'overview', label: 'Overview', icon: TrendingUp },
    { id: 'donations', label: 'Manage Donations', icon: Package },
    { id: 'users', label: 'Manage Users', icon: Users },
  ];

  return (
    <div>
      <PageHeader title="Admin Dashboard" subtitle={`Welcome, ${profile?.full_name?.split(' ')[0] || 'Admin'}. Monitor and manage the entire platform here.`} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
          <StatCard icon={Package} label="Total Donations" value={totalDonations} color="text-brand-600" bg="bg-brand-50" />
          <StatCard icon={CheckCircle} label="Delivered Meals" value={deliveredMeals} color="text-emerald-600" bg="bg-emerald-50" />
          <StatCard icon={Users} label="Active Volunteers" value={activeVolunteers} color="text-accent-600" bg="bg-accent-50" />
          <StatCard icon={Truck} label="In Progress" value={inProgress} color="text-blue-600" bg="bg-blue-50" />
        </div>

        {error && (
          <div className="mb-6 px-4 py-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm flex items-center gap-2">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            {error}
            <button onClick={() => setError(null)} className="ml-auto text-red-400 hover:text-red-600"><X className="w-4 h-4" /></button>
          </div>
        )}

        {/* Tabs */}
        <div className="flex gap-2 mb-6 border-b border-gray-200">
          {tabs.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`flex items-center gap-2 px-5 py-3 text-sm font-semibold transition-all border-b-2 -mb-px ${
                tab === t.id
                  ? 'text-brand-600 border-brand-500'
                  : 'text-gray-500 border-transparent hover:text-gray-700'
              }`}
            >
              <t.icon className="w-4 h-4" />
              {t.label}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 text-brand-500 animate-spin" />
          </div>
        ) : (
          <>
            {/* ===== OVERVIEW ===== */}
            {tab === 'overview' && (
              <div className="grid lg:grid-cols-2 gap-6">
                {/* Status chart */}
                <div className="card p-6">
                  <h3 className="font-bold text-gray-900 mb-5">Donations by Status</h3>
                  <div className="space-y-3">
                    {Object.entries(statusCounts).map(([status, count]) => {
                      const meta = STATUS_META[status as keyof typeof STATUS_META];
                      return (
                        <div key={status}>
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-sm text-gray-600 flex items-center gap-2">
                              <span className={`w-2 h-2 rounded-full ${meta.dot}`} />
                              {meta.label}
                            </span>
                            <span className="text-sm font-semibold text-gray-900">{count}</span>
                          </div>
                          <div className="h-2 rounded-full bg-gray-100 overflow-hidden">
                            <div
                              className={`h-full rounded-full ${meta.dot} transition-all duration-700`}
                              style={{ width: `${(count / maxStatusCount) * 100}%` }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Food type chart */}
                <div className="card p-6">
                  <h3 className="font-bold text-gray-900 mb-5">Donations by Food Type</h3>
                  <div className="space-y-3">
                    {Object.entries(typeCounts).map(([type, count]) => {
                      const meta = FOOD_TYPE_META[type as FoodType] || FOOD_TYPE_META.Other;
                      return (
                        <div key={type}>
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-sm text-gray-600">{meta.emoji} {type}</span>
                            <span className="text-sm font-semibold text-gray-900">{count}</span>
                          </div>
                          <div className="h-2 rounded-full bg-gray-100 overflow-hidden">
                            <div
                              className="h-full rounded-full bg-brand-500 transition-all duration-700"
                              style={{ width: `${(count / maxTypeCount) * 100}%` }}
                            />
                          </div>
                        </div>
                      );
                    })}
                    {Object.keys(typeCounts).length === 0 && (
                      <p className="text-gray-400 text-sm">No data yet.</p>
                    )}
                  </div>
                </div>

                {/* Recent donations */}
                <div className="card p-6 lg:col-span-2">
                  <h3 className="font-bold text-gray-900 mb-5">Recent Donations</h3>
                  {recentDonations.length === 0 ? (
                    <p className="text-gray-400 text-sm">No donations yet.</p>
                  ) : (
                    <div className="space-y-3">
                      {recentDonations.map((d) => {
                        const meta = STATUS_META[d.status];
                        return (
                          <div key={d.id} className="flex items-center gap-4 py-2 border-b border-gray-50 last:border-0">
                            <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center text-lg flex-shrink-0">
                              {FOOD_TYPE_META[d.food_type]?.emoji || '📦'}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="font-medium text-sm text-gray-900 truncate">{d.food_name}</p>
                              <p className="text-xs text-gray-400">by {d.donor_name} · {formatTime(d.created_at)}</p>
                            </div>
                            <span className={`px-2.5 py-1 rounded-full text-xs font-semibold flex-shrink-0 ${meta.color}`}>
                              {meta.label}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* ===== MANAGE DONATIONS ===== */}
            {tab === 'donations' && (
              <div>
                <div className="relative mb-5 max-w-md">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search donations..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="input-field pl-11"
                  />
                </div>
                <div className="card overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-50 border-b border-gray-100">
                        <tr>
                          <th className="text-left text-xs font-semibold text-gray-500 uppercase px-5 py-3">Food</th>
                          <th className="text-left text-xs font-semibold text-gray-500 uppercase px-5 py-3 hidden sm:table-cell">Donor</th>
                          <th className="text-left text-xs font-semibold text-gray-500 uppercase px-5 py-3 hidden md:table-cell">Volunteer</th>
                          <th className="text-left text-xs font-semibold text-gray-500 uppercase px-5 py-3">Status</th>
                          <th className="text-left text-xs font-semibold text-gray-500 uppercase px-5 py-3 hidden lg:table-cell">Date</th>
                          <th className="text-right text-xs font-semibold text-gray-500 uppercase px-5 py-3">Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-50">
                        {filteredDonations.map((d) => {
                          const meta = STATUS_META[d.status];
                          return (
                            <tr key={d.id} className="hover:bg-gray-50 transition-colors">
                              <td className="px-5 py-3">
                                <p className="font-medium text-gray-900 text-sm">{d.food_name}</p>
                                <p className="text-xs text-gray-400">{d.quantity} · {d.food_type}</p>
                              </td>
                              <td className="px-5 py-3 text-sm text-gray-600 hidden sm:table-cell">{d.donor_name}</td>
                              <td className="px-5 py-3 text-sm text-gray-600 hidden md:table-cell">{d.volunteer_name || '—'}</td>
                              <td className="px-5 py-3">
                                <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${meta.color}`}>{meta.label}</span>
                              </td>
                              <td className="px-5 py-3 text-sm text-gray-500 hidden lg:table-cell">{formatTime(d.created_at)}</td>
                              <td className="px-5 py-3 text-right">
                                <button
                                  onClick={() => handleDelete(d.id)}
                                  disabled={deleteLoading === d.id}
                                  className="p-2 rounded-lg text-red-500 hover:bg-red-50 transition-colors disabled:opacity-50"
                                >
                                  {deleteLoading === d.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                                </button>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                  {filteredDonations.length === 0 && (
                    <div className="p-8 text-center text-gray-400 text-sm">No donations found.</div>
                  )}
                </div>
              </div>
            )}

            {/* ===== MANAGE USERS ===== */}
            {tab === 'users' && (
              <div className="card overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-100">
                      <tr>
                        <th className="text-left text-xs font-semibold text-gray-500 uppercase px-5 py-3">Name</th>
                        <th className="text-left text-xs font-semibold text-gray-500 uppercase px-5 py-3 hidden sm:table-cell">Phone</th>
                        <th className="text-left text-xs font-semibold text-gray-500 uppercase px-5 py-3">Role</th>
                        <th className="text-left text-xs font-semibold text-gray-500 uppercase px-5 py-3 hidden md:table-cell">Organization</th>
                        <th className="text-left text-xs font-semibold text-gray-500 uppercase px-5 py-3 hidden lg:table-cell">Joined</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                      {profiles.map((p) => (
                        <tr key={p.id} className="hover:bg-gray-50 transition-colors">
                          <td className="px-5 py-3">
                            <div className="flex items-center gap-3">
                              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                                {p.full_name.charAt(0).toUpperCase()}
                              </div>
                              <p className="font-medium text-gray-900 text-sm">{p.full_name}</p>
                            </div>
                          </td>
                          <td className="px-5 py-3 text-sm text-gray-600 hidden sm:table-cell">{p.phone || '—'}</td>
                          <td className="px-5 py-3">
                            <span className={`px-2.5 py-1 rounded-full text-xs font-semibold capitalize ${
                              p.role === 'admin' ? 'bg-purple-100 text-purple-700' :
                              p.role === 'volunteer' ? 'bg-accent-100 text-accent-700' :
                              'bg-brand-100 text-brand-700'
                            }`}>
                              {p.role}
                            </span>
                          </td>
                          <td className="px-5 py-3 text-sm text-gray-600 hidden md:table-cell">{p.organization || '—'}</td>
                          <td className="px-5 py-3 text-sm text-gray-500 hidden lg:table-cell">{formatTime(p.created_at)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                {profiles.length === 0 && (
                  <div className="p-8 text-center text-gray-400 text-sm">No users found.</div>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

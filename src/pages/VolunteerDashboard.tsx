import { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import {
  Package, Truck, CheckCircle, Clock, Loader2, Upload,
  Image as ImageIcon, AlertCircle, ArrowRight, History,
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { supabase, Donation, STATUS_META } from '@/lib/supabase';
import StatCard from '@/components/StatCard';
import PageHeader from '@/components/PageHeader';

export default function VolunteerDashboard() {
  const { user, profile } = useAuth();
  const [active, setActive] = useState<Donation[]>([]);
  const [history, setHistory] = useState<Donation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [proofFile, setProofFile] = useState<File | null>(null);
  const [proofPreview, setProofPreview] = useState<string | null>(null);
  const [proofFor, setProofFor] = useState<string | null>(null);

  const loadDonations = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    const { data, error } = await supabase
      .from('donations')
      .select('*')
      .eq('volunteer_id', user.id)
      .order('created_at', { ascending: false });

    if (error) {
      setError('Could not load your donations.');
    } else {
      const all = (data as Donation[]) || [];
      setActive(all.filter((d) => d.status === 'accepted' || d.status === 'picked_up'));
      setHistory(all.filter((d) => d.status === 'delivered' || d.status === 'cancelled'));
    }
    setLoading(false);
  }, [user]);

  useEffect(() => {
    loadDonations();
  }, [loadDonations]);

  const updateStatus = async (donationId: string, status: 'picked_up' | 'delivered', extra?: Record<string, string>) => {
    setActionLoading(donationId);
    const updates: Record<string, string | null> = { status };
    if (status === 'picked_up') updates.picked_up_at = new Date().toISOString();
    if (status === 'delivered') updates.delivered_at = new Date().toISOString();
    if (extra) Object.assign(updates, extra);

    const { error } = await supabase.from('donations').update(updates).eq('id', donationId);
    setActionLoading(null);
    if (error) {
      setError('Could not update donation status.');
      return;
    }
    await loadDonations();
  };

  const handleProofUpload = async (donationId: string) => {
    if (!proofFile || !user) return;
    setActionLoading(donationId);
    const ext = proofFile.name.split('.').pop();
    const fileName = `proof/${user.id}/${donationId}.${ext}`;
    const { error: uploadError } = await supabase.storage
      .from('food-images')
      .upload(fileName, proofFile, { upsert: true });
    if (uploadError) {
      setError('Proof image upload failed.');
      setActionLoading(null);
      return;
    }
    const { data } = supabase.storage.from('food-images').getPublicUrl(fileName);
    await updateStatus(donationId, 'delivered', { proof_image_url: data.publicUrl });
    setProofFile(null);
    setProofPreview(null);
    setProofFor(null);
  };

  const handleProofSelect = (e: React.ChangeEvent<HTMLInputElement>, donationId: string) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setProofFile(file);
    setProofPreview(URL.createObjectURL(file));
    setProofFor(donationId);
  };

  const stats = [
    { icon: Package, label: 'Active Pickups', value: active.length, color: 'text-brand-600', bg: 'bg-brand-50' },
    { icon: Truck, label: 'Picked Up', value: active.filter((d) => d.status === 'picked_up').length, color: 'text-accent-600', bg: 'bg-accent-50' },
    { icon: CheckCircle, label: 'Delivered', value: history.filter((d) => d.status === 'delivered').length, color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { icon: Clock, label: 'Total Claims', value: active.length + history.length, color: 'text-blue-600', bg: 'bg-blue-50' },
  ];

  const formatTime = (iso: string | null) => {
    if (!iso) return '—';
    return new Date(iso).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' });
  };

  return (
    <div>
      <PageHeader title="Volunteer Dashboard" subtitle={`Welcome back, ${profile?.full_name?.split(' ')[0] || 'Volunteer'}! Manage your pickups and deliveries here.`} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
          {stats.map((stat, i) => (
            <StatCard key={i} {...stat} />
          ))}
        </div>

        {error && (
          <div className="mb-6 px-4 py-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm flex items-center gap-2">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            {error}
            <button onClick={() => setError(null)} className="ml-auto text-red-400 hover:text-red-600">×</button>
          </div>
        )}

        {/* Active pickups */}
        <div className="mb-10">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <Package className="w-5 h-5 text-brand-600" /> Active Pickups
            </h2>
            <Link to="/donations" className="text-sm font-semibold text-brand-600 hover:text-brand-700 flex items-center gap-1">
              Find More <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 text-brand-500 animate-spin" />
            </div>
          ) : active.length === 0 ? (
            <div className="card p-10 text-center">
              <Package className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500">No active pickups right now.</p>
              <Link to="/donations" className="mt-4 inline-block btn-primary">
                Browse Available Food
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {active.map((donation) => {
                const statusMeta = STATUS_META[donation.status];
                return (
                  <div key={donation.id} className="card p-5">
                    <div className="flex flex-col lg:flex-row gap-5">
                      {/* Image */}
                      <div className="w-full lg:w-32 h-32 rounded-xl overflow-hidden bg-gradient-to-br from-brand-100 to-brand-50 flex-shrink-0">
                        {donation.image_url ? (
                          <img src={donation.image_url} alt={donation.food_name} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-4xl">📦</div>
                        )}
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-3 mb-2">
                          <div>
                            <h3 className="font-bold text-lg text-gray-900">{donation.food_name}</h3>
                            <p className="text-sm text-gray-500">From {donation.donor_name} · {donation.quantity}</p>
                          </div>
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1.5 flex-shrink-0 ${statusMeta.color}`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${statusMeta.dot}`} />
                            {statusMeta.label}
                          </span>
                        </div>
                        <div className="grid sm:grid-cols-2 gap-2 text-sm text-gray-600 mb-3">
                          <p><span className="text-gray-400">Pickup:</span> {donation.pickup_address}</p>
                          <p><span className="text-gray-400">Contact:</span> {donation.contact_number}</p>
                          <p><span className="text-gray-400">Pickup by:</span> {formatTime(donation.pickup_time)}</p>
                          <p><span className="text-gray-400">Expires:</span> {formatTime(donation.expiry_time)}</p>
                        </div>

                        {/* Timeline */}
                        <div className="flex items-center gap-2 mb-4">
                          <div className={`flex items-center gap-1.5 text-xs font-medium ${donation.accepted_at ? 'text-blue-600' : 'text-gray-400'}`}>
                            <div className={`w-6 h-6 rounded-full flex items-center justify-center ${donation.accepted_at ? 'bg-blue-100' : 'bg-gray-100'}`}>
                              <CheckCircle className="w-3.5 h-3.5" />
                            </div>
                            Accepted
                          </div>
                          <div className={`flex-1 h-0.5 ${donation.picked_up_at ? 'bg-accent-300' : 'bg-gray-200'}`} />
                          <div className={`flex items-center gap-1.5 text-xs font-medium ${donation.picked_up_at ? 'text-accent-600' : 'text-gray-400'}`}>
                            <div className={`w-6 h-6 rounded-full flex items-center justify-center ${donation.picked_up_at ? 'bg-accent-100' : 'bg-gray-100'}`}>
                              <Truck className="w-3.5 h-3.5" />
                            </div>
                            Picked Up
                          </div>
                          <div className={`flex-1 h-0.5 ${donation.delivered_at ? 'bg-emerald-300' : 'bg-gray-200'}`} />
                          <div className={`flex items-center gap-1.5 text-xs font-medium ${donation.delivered_at ? 'text-emerald-600' : 'text-gray-400'}`}>
                            <div className={`w-6 h-6 rounded-full flex items-center justify-center ${donation.delivered_at ? 'bg-emerald-100' : 'bg-gray-100'}`}>
                              <CheckCircle className="w-3.5 h-3.5" />
                            </div>
                            Delivered
                          </div>
                        </div>

                        {/* Actions */}
                        {donation.status === 'accepted' && (
                          <button
                            onClick={() => updateStatus(donation.id, 'picked_up')}
                            disabled={actionLoading === donation.id}
                            className="btn-accent !py-2.5 !text-sm disabled:opacity-60"
                          >
                            {actionLoading === donation.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Truck className="w-4 h-4" />}
                            Mark as Picked Up
                          </button>
                        )}
                        {donation.status === 'picked_up' && (
                          <div className="space-y-3">
                            {proofFor === donation.id ? (
                              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
                                {proofPreview && (
                                  <img src={proofPreview} alt="Proof preview" className="w-20 h-20 rounded-lg object-cover" />
                                )}
                                <button
                                  onClick={() => handleProofUpload(donation.id)}
                                  disabled={actionLoading === donation.id}
                                  className="btn-primary !py-2.5 !text-sm disabled:opacity-60"
                                >
                                  {actionLoading === donation.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle className="w-4 h-4" />}
                                  Confirm Delivery
                                </button>
                                <button onClick={() => { setProofFor(null); setProofFile(null); setProofPreview(null); }} className="text-sm text-gray-500 hover:text-gray-700">
                                  Cancel
                                </button>
                              </div>
                            ) : (
                              <label className="cursor-pointer inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-brand-50 text-brand-700 font-semibold text-sm hover:bg-brand-100 transition-all border border-brand-200">
                                <Upload className="w-4 h-4" />
                                Upload Proof & Complete
                                <input type="file" accept="image/*" className="hidden" onChange={(e) => handleProofSelect(e, donation.id)} />
                              </label>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* History */}
        <div>
          <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2 mb-5">
            <History className="w-5 h-5 text-gray-500" /> Donation History
          </h2>
          {history.length === 0 ? (
            <div className="card p-8 text-center">
              <History className="w-10 h-10 text-gray-300 mx-auto mb-2" />
              <p className="text-gray-500 text-sm">No completed deliveries yet.</p>
            </div>
          ) : (
            <div className="card overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-100">
                    <tr>
                      <th className="text-left text-xs font-semibold text-gray-500 uppercase px-5 py-3">Food</th>
                      <th className="text-left text-xs font-semibold text-gray-500 uppercase px-5 py-3 hidden sm:table-cell">Donor</th>
                      <th className="text-left text-xs font-semibold text-gray-500 uppercase px-5 py-3 hidden md:table-cell">Date</th>
                      <th className="text-left text-xs font-semibold text-gray-500 uppercase px-5 py-3">Status</th>
                      <th className="text-left text-xs font-semibold text-gray-500 uppercase px-5 py-3 hidden lg:table-cell">Proof</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {history.map((d) => {
                      const statusMeta = STATUS_META[d.status];
                      return (
                        <tr key={d.id} className="hover:bg-gray-50 transition-colors">
                          <td className="px-5 py-3">
                            <p className="font-medium text-gray-900 text-sm">{d.food_name}</p>
                            <p className="text-xs text-gray-400">{d.quantity}</p>
                          </td>
                          <td className="px-5 py-3 text-sm text-gray-600 hidden sm:table-cell">{d.donor_name}</td>
                          <td className="px-5 py-3 text-sm text-gray-500 hidden md:table-cell">{formatTime(d.delivered_at || d.created_at)}</td>
                          <td className="px-5 py-3">
                            <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${statusMeta.color}`}>
                              {statusMeta.label}
                            </span>
                          </td>
                          <td className="px-5 py-3 hidden lg:table-cell">
                            {d.proof_image_url ? (
                              <img src={d.proof_image_url} alt="Proof" className="w-10 h-10 rounded-lg object-cover" />
                            ) : (
                              <ImageIcon className="w-5 h-5 text-gray-300" />
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

import { useEffect, useState, useCallback } from 'react';
import { Search, Filter, Loader2, Package, AlertCircle, RefreshCw } from 'lucide-react';
import { supabase, Donation, FoodType, FOOD_TYPES, FOOD_TYPE_META } from '@/lib/supabase';
import PageHeader from '@/components/PageHeader';
import DonationCard from '@/components/DonationCard';
import { useAuth } from '@/context/AuthContext';

export default function AvailableDonations() {
  const { user, profile, refreshProfile } = useAuth();
  const [donations, setDonations] = useState<Donation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState<FoodType | 'All'>('All');
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const loadDonations = useCallback(async () => {
    setLoading(true);
    setError(null);
    const { data, error } = await supabase
      .from('donations')
      .select('*')
      .eq('status', 'available')
      .order('created_at', { ascending: false });

    if (error) {
      setError('Could not load donations. Please try again.');
    } else {
      setDonations((data as Donation[]) || []);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    loadDonations();
  }, [loadDonations]);

  const handleAccept = async (donation: Donation) => {
    if (!user || !profile) return;
    if (profile.role === 'donor') {
      setError('Only volunteers and admins can accept donations. Sign in as a volunteer to continue.');
      return;
    }
    setActionLoading(donation.id);
    const { error: updateError } = await supabase
      .from('donations')
      .update({
        status: 'accepted',
        volunteer_id: user.id,
        volunteer_name: profile.full_name,
        accepted_at: new Date().toISOString(),
      })
      .eq('id', donation.id);

    if (updateError) {
      setError('Could not accept this donation. Please try again.');
      setActionLoading(null);
      return;
    }

    setDonations((prev) => prev.filter((d) => d.id !== donation.id));
    setActionLoading(null);
  };

  const filtered = donations.filter((d) => {
    const matchesSearch =
      !search ||
      d.food_name.toLowerCase().includes(search.toLowerCase()) ||
      d.pickup_address.toLowerCase().includes(search.toLowerCase()) ||
      d.donor_name.toLowerCase().includes(search.toLowerCase());
    const matchesType = filterType === 'All' || d.food_type === filterType;
    return matchesSearch && matchesType;
  });

  return (
    <div>
      <PageHeader
        title="Available Donations"
        subtitle="Browse surplus food ready for pickup. Claim a donation to pick it up and deliver it to someone in need."
      >
        {profile?.role === 'donor' && (
          <div className="mt-4 px-4 py-2.5 rounded-xl bg-accent-50 border border-accent-200 text-accent-700 text-sm flex items-center gap-2 max-w-fit">
            <AlertCircle className="w-4 h-4" />
            You're signed in as a donor. Switch to a volunteer account to accept donations.
          </div>
        )}
      </PageHeader>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Search & Filter */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by food name, location, or donor..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="input-field pl-12"
            />
          </div>
          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            <Filter className="w-5 h-5 text-gray-400 flex-shrink-0" />
            {(['All', ...FOOD_TYPES] as const).map((type) => (
              <button
                key={type}
                onClick={() => setFilterType(type)}
                className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${
                  filterType === type
                    ? 'bg-brand-600 text-white shadow-md'
                    : 'bg-white text-gray-600 border border-gray-200 hover:border-brand-300'
                }`}
              >
                {type === 'All' ? 'All' : `${FOOD_TYPE_META[type].emoji} ${type}`}
              </button>
            ))}
          </div>
          <button onClick={loadDonations} className="btn-secondary !py-2.5 !px-4 flex-shrink-0">
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
        </div>

        {/* Content */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 text-brand-500 animate-spin" />
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <AlertCircle className="w-12 h-12 text-red-400 mb-4" />
            <p className="text-gray-600">{error}</p>
            <button onClick={loadDonations} className="mt-4 btn-primary">Try Again</button>
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <Package className="w-12 h-12 text-gray-300 mb-4" />
            <p className="text-gray-500 text-lg">No donations match your search.</p>
            <p className="text-gray-400 text-sm mt-1">Try different filters or check back later.</p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((donation) => (
              <div key={donation.id} className="relative">
                <DonationCard
                  donation={donation}
                  onAction={handleAccept}
                  actionLabel={actionLoading === donation.id ? 'Accepting...' : 'Accept & Deliver'}
                  actionVariant="primary"
                />
                {actionLoading === donation.id && (
                  <div className="absolute inset-0 bg-white/60 rounded-2xl flex items-center justify-center">
                    <Loader2 className="w-6 h-6 text-brand-500 animate-spin" />
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

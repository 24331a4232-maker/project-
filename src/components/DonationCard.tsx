import { MapPin, Clock, Package, User } from 'lucide-react';
import { Donation, FOOD_TYPE_META, STATUS_META } from '@/lib/supabase';

interface DonationCardProps {
  donation: Donation;
  onAction?: (donation: Donation) => void;
  actionLabel?: string;
  actionVariant?: 'primary' | 'accent' | 'secondary';
  showStatus?: boolean;
}

export default function DonationCard({
  donation,
  onAction,
  actionLabel,
  actionVariant = 'primary',
  showStatus = true,
}: DonationCardProps) {
  const foodMeta = FOOD_TYPE_META[donation.food_type] || FOOD_TYPE_META.Other;
  const statusMeta = STATUS_META[donation.status];

  const formatTime = (iso: string) => {
    const d = new Date(iso);
    return d.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    });
  };

  const isExpiringSoon = () => {
    if (!donation.expiry_time) return false;
    const diff = new Date(donation.expiry_time).getTime() - Date.now();
    return diff < 6 * 60 * 60 * 1000 && diff > 0;
  };

  const actionClasses = {
    primary: 'bg-brand-500 text-white hover:bg-brand-600 shadow-md shadow-brand-500/20',
    accent: 'bg-accent-500 text-white hover:bg-accent-600 shadow-md shadow-accent-500/20',
    secondary: 'bg-gray-100 text-gray-700 hover:bg-gray-200',
  };

  return (
    <div className="card card-hover overflow-hidden group">
      {/* Image */}
      <div className="relative h-44 overflow-hidden bg-gradient-to-br from-brand-100 to-brand-50">
        {donation.image_url ? (
          <img
            src={donation.image_url}
            alt={donation.food_name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-5xl">
            {foodMeta.emoji}
          </div>
        )}
        <div className="absolute top-3 left-3">
          <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${foodMeta.color}`}>
            {foodMeta.emoji} {donation.food_type}
          </span>
        </div>
        {showStatus && (
          <div className="absolute top-3 right-3">
            <span className={`px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1.5 ${statusMeta.color}`}>
              <span className={`w-1.5 h-1.5 rounded-full ${statusMeta.dot}`} />
              {statusMeta.label}
            </span>
          </div>
        )}
      </div>

      {/* Body */}
      <div className="p-5">
        <h3 className="font-bold text-lg text-gray-900 mb-1">{donation.food_name}</h3>
        <p className="text-sm text-gray-500 line-clamp-2 mb-3">
          Donated by {donation.donor_name}
        </p>

        <div className="space-y-2 text-sm text-gray-600 mb-4">
          <div className="flex items-center gap-2">
            <Package className="w-4 h-4 text-brand-500 flex-shrink-0" />
            <span>{donation.quantity}</span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-brand-500 flex-shrink-0" />
            <span className="line-clamp-1">{donation.pickup_address}</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-brand-500 flex-shrink-0" />
            <span>Pickup: {formatTime(donation.pickup_time)}</span>
          </div>
          <div className="flex items-center gap-2">
            <User className="w-4 h-4 text-brand-500 flex-shrink-0" />
            <span>Contact: {donation.contact_number}</span>
          </div>
        </div>

        {isExpiringSoon() && (
          <div className="px-3 py-2 rounded-lg bg-accent-50 border border-accent-200 text-accent-700 text-xs font-medium mb-3 flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5" />
            Expires soon — please pick up quickly!
          </div>
        )}

        {onAction && actionLabel && (
          <button
            onClick={() => onAction(donation)}
            className={`w-full py-2.5 rounded-xl text-sm font-semibold transition-all ${actionClasses[actionVariant]}`}
          >
            {actionLabel}
          </button>
        )}
      </div>
    </div>
  );
}

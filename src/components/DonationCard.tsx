import { motion } from 'framer-motion';
import { Clock, MapPin, Phone, Package, User, CheckCircle2, AlertTriangle } from 'lucide-react';
import { Donation, FOOD_TYPE_META, STATUS_META } from '@/lib/supabase';

interface Props {
  donation: Donation;
  onAction?: () => void;
  actionLabel?: string;
  actionVariant?: 'primary' | 'accent' | 'secondary';
  actionLoading?: boolean;
}

export default function DonationCard({ donation, onAction, actionLabel, actionVariant = 'primary', actionLoading }: Props) {
  const meta       = FOOD_TYPE_META[donation.food_type] || { emoji: '🍱', color: 'bg-gray-100 text-gray-700' };
  const statusMeta = STATUS_META[donation.status] || { label: donation.status, color: 'bg-gray-100 text-gray-700', dot: 'bg-gray-400' };

  const now       = new Date();
  const expiry    = donation.expiry_time ? new Date(donation.expiry_time) : null;
  const expireSoon = expiry ? (expiry.getTime() - now.getTime()) < 6 * 3600 * 1000 && expiry > now : false;

  const btnClass = actionVariant === 'accent' ? 'btn-accent' : actionVariant === 'secondary' ? 'btn-secondary' : 'btn-primary';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.3 }}
      className="card card-hover overflow-hidden"
    >
      {/* Image / emoji header */}
      <div className="relative h-44 bg-gradient-to-br from-surface-100 to-surface-200 overflow-hidden">
        {donation.image_url ? (
          <img src={donation.image_url} alt={donation.food_name} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <span className="text-7xl">{meta.emoji}</span>
          </div>
        )}
        {/* Badges overlay */}
        <div className="absolute top-3 left-3 right-3 flex items-start justify-between gap-2">
          <span className={`badge text-xs ${meta.color}`}>{donation.food_type}</span>
          <span className={`badge text-xs ${statusMeta.color}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${statusMeta.dot} mr-1`} />
            {statusMeta.label}
          </span>
        </div>
        {expireSoon && (
          <div className="absolute bottom-0 left-0 right-0 bg-amber-500/90 backdrop-blur-sm px-3 py-1.5 flex items-center gap-1.5">
            <AlertTriangle className="w-3.5 h-3.5 text-white" />
            <span className="text-white text-xs font-medium">Expires soon – claim now!</span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-5 space-y-4">
        <div>
          <h3 className="font-bold text-surface-dark text-base leading-tight line-clamp-1">{donation.food_name}</h3>
          {donation.donor_name && (
            <p className="text-xs text-surface-300 mt-0.5 flex items-center gap-1">
              <User className="w-3 h-3" />
              {donation.donor_name}
            </p>
          )}
        </div>

        <div className="space-y-2.5">
          <div className="flex items-center gap-2 text-xs text-surface-300">
            <Package className="w-3.5 h-3.5 shrink-0 text-brand-400" />
            <span className="font-medium">{donation.quantity}</span>
          </div>
          {donation.pickup_address && (
            <div className="flex items-start gap-2 text-xs text-surface-300">
              <MapPin className="w-3.5 h-3.5 shrink-0 mt-0.5 text-accent-400" />
              <span className="line-clamp-1">{donation.pickup_address}</span>
            </div>
          )}
          {donation.pickup_time && (
            <div className="flex items-center gap-2 text-xs text-surface-300">
              <Clock className="w-3.5 h-3.5 shrink-0 text-blue-400" />
              <span>{new Date(donation.pickup_time).toLocaleString()}</span>
            </div>
          )}
          {donation.contact_number && (
            <div className="flex items-center gap-2 text-xs text-surface-300">
              <Phone className="w-3.5 h-3.5 shrink-0 text-violet-400" />
              <span>{donation.contact_number}</span>
            </div>
          )}
        </div>

        {onAction && actionLabel && (
          <button
            onClick={onAction}
            disabled={actionLoading}
            className={`${btnClass} w-full text-sm py-2.5 mt-2 disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            {actionLoading ? (
              <span className="flex items-center gap-2">
                <span className="w-3.5 h-3.5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                Processing…
              </span>
            ) : (
              <>
                <CheckCircle2 className="w-4 h-4" />
                {actionLabel}
              </>
            )}
          </button>
        )}
      </div>
    </motion.div>
  );
}

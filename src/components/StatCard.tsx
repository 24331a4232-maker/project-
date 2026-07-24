import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface Props {
  icon: ReactNode;
  label: string;
  value: string | number;
  color?: string;
  bg?: string;
  suffix?: string;
  trend?: string;
}

export default function StatCard({ icon, label, value, color = 'text-brand-600', bg = 'bg-brand-50', suffix = '', trend }: Props) {
  return (
    <motion.div
      whileHover={{ y: -4, scale: 1.02 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      className="card p-6 card-hover group"
    >
      <div className="flex items-start justify-between mb-4">
        <div className={`w-12 h-12 rounded-2xl ${bg} flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
          <span className={color}>{icon}</span>
        </div>
        {trend && (
          <span className={`text-xs font-semibold px-2 py-1 rounded-full ${
            trend.startsWith('+') ? 'bg-brand-50 text-brand-600' : 'bg-red-50 text-red-500'
          }`}>
            {trend}
          </span>
        )}
      </div>
      <div className="space-y-1">
        <p className="text-3xl font-bold text-surface-dark tracking-tight">
          {value}<span className="text-lg text-surface-300 font-medium ml-0.5">{suffix}</span>
        </p>
        <p className="text-sm text-surface-300 font-medium">{label}</p>
      </div>
    </motion.div>
  );
}

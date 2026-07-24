import { ReactNode } from 'react';
import { motion } from 'framer-motion';

interface Props {
  title: string;
  subtitle?: string;
  children?: ReactNode;
  dark?: boolean;
}

export default function PageHeader({ title, subtitle, children, dark = false }: Props) {
  return (
    <section className={`relative pt-32 pb-16 overflow-hidden ${dark ? 'hero-bg' : 'bg-gradient-to-br from-surface-50 via-brand-50/30 to-accent-50/20'}`}>
      {/* Decorative blobs */}
      <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-brand-500/8 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-64 h-64 rounded-full bg-accent-500/8 blur-3xl pointer-events-none" />

      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
        >
          <h1 className={`text-4xl md:text-5xl lg:text-6xl font-bold mb-4 ${dark ? 'text-white' : 'text-surface-dark'}`}>
            {title}
          </h1>
          {subtitle && (
            <p className={`text-lg md:text-xl max-w-2xl mx-auto leading-relaxed ${dark ? 'text-white/70' : 'text-surface-300'}`}>
              {subtitle}
            </p>
          )}
          {children && <div className="mt-8">{children}</div>}
        </motion.div>
      </div>

      {/* Bottom fade */}
      {dark && <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-surface-50 to-transparent" />}
    </section>
  );
}

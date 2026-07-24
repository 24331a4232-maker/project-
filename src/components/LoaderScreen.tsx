import { motion, AnimatePresence } from 'framer-motion';

interface Props { visible?: boolean; }

export default function LoaderScreen({ visible = true }: Props) {
  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4 }}
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-surface-dark"
        >
          {/* Animated logo */}
          <motion.div
            animate={{ scale: [1, 1.08, 1], rotate: [0, 3, -3, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            className="w-20 h-20 mb-6"
          >
            <img src="/food-bridge-logo.svg" alt="Loading" className="w-full h-full" />
          </motion.div>

          {/* Logo text */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-center mb-8"
          >
            <p className="text-xl font-bold">
              <span className="text-brand-400">Food</span>{' '}
              <span className="text-accent-400">Bridge</span>
            </p>
            <p className="text-surface-300 text-sm mt-1">Share Food. Share Hope.</p>
          </motion.div>

          {/* Loading bar */}
          <div className="w-48 h-1 bg-white/10 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-brand-500 to-accent-500 rounded-full"
              animate={{ x: ['-100%', '100%'] }}
              transition={{ duration: 1.4, repeat: Infinity, ease: 'easeInOut' }}
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

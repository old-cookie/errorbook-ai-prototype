import { motion } from 'motion/react';
import { TrendingUp } from 'lucide-react';

interface ProgressBadgeProps {
  topic: string;
  improvement: string;
  icon?: string;
}

export function ProgressBadge({ topic, improvement, icon = '📊' }: ProgressBadgeProps) {
  return (
    <motion.div
      initial={{ scale: 0, rotate: -10 }}
      animate={{ scale: 1, rotate: 0 }}
      transition={{ type: 'spring', damping: 15 }}
      className="relative inline-flex items-center gap-3 px-5 py-4 bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-200 rounded-2xl shadow-lg"
    >
      {/* Icon */}
      <div className="text-3xl">{icon}</div>
      
      <div className="flex-1">
        <div className="flex items-center gap-2 mb-1">
          <TrendingUp size={16} className="text-green-600" />
          <span className="text-xs font-semibold text-green-700 uppercase tracking-wide">Improved</span>
        </div>
        <p className="font-bold text-gray-900">{topic}</p>
        <p className="text-sm text-green-700 font-semibold">{improvement}</p>
      </div>
      
      {/* Shine effect */}
      <motion.div
        initial={{ x: -100, opacity: 0 }}
        animate={{ x: 100, opacity: [0, 1, 0] }}
        transition={{ delay: 0.5, duration: 1 }}
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent"
        style={{ transform: 'skewX(-20deg)' }}
      />
    </motion.div>
  );
}

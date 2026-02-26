import { motion } from 'motion/react';
import { Calendar, Clock } from 'lucide-react';

interface TimelineChipProps {
  label: string;
  time: string;
  isPrimary?: boolean;
}

export function TimelineChip({ label, time, isPrimary = false }: TimelineChipProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className={`inline-flex items-center gap-2 px-4 py-2 rounded-full border-2 ${
        isPrimary 
          ? 'bg-[#6C5CE7]/10 border-[#6C5CE7] text-[#6C5CE7]'
          : 'bg-gray-100 border-gray-300 text-gray-700'
      }`}
    >
      {isPrimary ? (
        <Clock size={16} className="flex-shrink-0" />
      ) : (
        <Calendar size={16} className="flex-shrink-0" />
      )}
      <div className="text-sm">
        <span className="font-bold">{label}</span>
        <span className="opacity-75"> · {time}</span>
      </div>
    </motion.div>
  );
}

import { motion } from 'motion/react';

interface FractionBarProps {
  numerator: number;
  denominator: number;
  filled?: number;
  label?: string;
  color?: string;
  showHighlight?: boolean;
}

export function FractionBar({
  numerator,
  denominator,
  filled,
  label,
  color = '#6C5CE7',
  showHighlight = false
}: FractionBarProps) {
  const actualFilled = filled !== undefined ? filled : numerator;

  return (
    <div className="inline-flex flex-col items-center gap-2">
      {label && (
        <span className="text-sm font-semibold text-gray-700">{label}</span>
      )}

      {/* Visual fraction */}
      <div className="text-center">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="text-2xl font-bold text-gray-900 mb-1"
        >
          {numerator}
        </motion.div>
        <div className="h-1 bg-gray-900 w-12 mx-auto mb-1" />
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.1 }}
          className={`text-2xl font-bold ${showHighlight ? 'text-yellow-600' : 'text-gray-900'}`}
        >
          {denominator}
        </motion.div>
      </div>

      {/* Bar visualization */}
      <div className="flex gap-0.5 max-w-full">
        {Array.from({ length: denominator }).map((_, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 + i * 0.05 }}
            className={`flex-1 min-w-0 h-12 rounded border-2 ${i < actualFilled ? '' : 'bg-white'}`}
            style={{
              backgroundColor: i < actualFilled ? color : undefined,
              borderColor: i < actualFilled ? color : '#d1d5db',
              maxWidth: '48px'
            }}
          />
        ))}
      </div>
    </div>
  );
}

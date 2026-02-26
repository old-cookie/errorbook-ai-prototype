import { motion } from 'motion/react';

interface HighlighterOverlayProps {
  label: string;
  position: 'top' | 'bottom' | 'left' | 'right';
  highlightColor?: string;
}

export function HighlighterOverlay({ 
  label, 
  position,
  highlightColor = '#FBBF24' 
}: HighlighterOverlayProps) {
  const arrowDirection = {
    top: 'rotate-180',
    bottom: 'rotate-0',
    left: 'rotate-90',
    right: '-rotate-90'
  };

  const labelPosition = {
    top: 'bottom-full mb-2',
    bottom: 'top-full mt-2',
    left: 'left-full ml-2',
    right: 'right-full mr-2'
  };

  return (
    <div className="relative inline-block">
      {/* Highlight box */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="absolute inset-0 rounded-lg border-4"
        style={{ 
          backgroundColor: `${highlightColor}40`,
          borderColor: highlightColor
        }}
      />
      
      {/* Arrow */}
      <motion.div
        initial={{ opacity: 0, y: position === 'bottom' ? -10 : 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className={`absolute ${labelPosition[position]} left-1/2 -translate-x-1/2`}
      >
        <div className={`w-0 h-0 border-l-8 border-r-8 border-b-8 border-l-transparent border-r-transparent ${arrowDirection[position]}`}
          style={{ borderBottomColor: highlightColor }}
        />
        
        {/* Label */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.3, type: 'spring' }}
          className="px-3 py-1.5 rounded-full font-bold text-sm whitespace-nowrap shadow-lg"
          style={{ 
            backgroundColor: highlightColor,
            color: '#000'
          }}
        >
          {label}
        </motion.div>
      </motion.div>
    </div>
  );
}

import { motion } from 'motion/react';
import { Lightbulb, Lock } from 'lucide-react';

interface HintTokenProps {
  number: 1 | 2 | 3;
  isUnlocked: boolean;
  isCurrent: boolean;
  onClick?: () => void;
  isInteractive?: boolean;
}

export function HintToken({ number, isUnlocked, isCurrent, onClick, isInteractive = true }: HintTokenProps) {
  const MotionComponent = isInteractive ? motion.button : motion.div;
  const showMotion = isInteractive;
  
  return (
    <MotionComponent
      onClick={isInteractive && isUnlocked ? onClick : undefined}
      initial={showMotion ? { scale: 0, rotate: -180 } : false}
      animate={showMotion ? {
        scale: 1,
        rotate: 0,
        y: isCurrent ? [0, -4, 0] : 0
      } : {}}
      transition={showMotion ? {
        scale: { type: 'spring', damping: 15 },
        y: { repeat: isCurrent ? Infinity : 0, duration: 1.5 }
      } : {}}
      className={`relative w-16 h-16 rounded-full flex items-center justify-center transition-all ${
        !isInteractive ? 'pointer-events-none' : ''
      } ${
        isUnlocked 
          ? `bg-gradient-to-br from-yellow-400 to-amber-500 shadow-lg shadow-yellow-500/40 ${isInteractive ? 'cursor-pointer hover:scale-110' : ''}` 
          : 'bg-gray-200 cursor-not-allowed'
      }`}
      {...(isInteractive && { disabled: !isUnlocked })}
    >
      {isUnlocked ? (
        <Lightbulb size={28} className="text-white" fill="white" />
      ) : (
        <Lock size={24} className="text-gray-400" />
      )}
      
      {/* Number badge */}
      <div className={`absolute -top-1 -right-1 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
        isUnlocked ? 'bg-white text-yellow-600' : 'bg-gray-300 text-gray-600'
      }`}>
        {number}
      </div>
      
      {/* Current indicator */}
      {isInteractive && isCurrent && isUnlocked && (
        <motion.div
          initial={{ scale: 1, opacity: 0.8 }}
          animate={{ scale: 1.5, opacity: 0 }}
          transition={{ repeat: Infinity, duration: 1.5 }}
          className="absolute inset-0 bg-yellow-400 rounded-full"
        />
      )}
    </MotionComponent>
  );
}

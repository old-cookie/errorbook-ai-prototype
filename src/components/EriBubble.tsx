import { motion } from 'motion/react';
import { Bot, Sparkles } from 'lucide-react';

interface EriBubbleProps {
  state?: 'idle' | 'listening' | 'celebrating';
  onClick?: () => void;
  position?: { bottom: number; right: number };
  isDraggable?: boolean;
}

export function EriBubble({ 
  state = 'idle', 
  onClick, 
  position = { bottom: 100, right: 24 },
  isDraggable = true 
}: EriBubbleProps) {
  const getAnimations = () => {
    switch (state) {
      case 'listening':
        return {
          scale: [1, 1.1, 1],
          transition: { repeat: Infinity, duration: 1.5 }
        };
      case 'celebrating':
        return {
          rotate: [0, -10, 10, -10, 0],
          transition: { repeat: Infinity, duration: 0.8 }
        };
      default: // idle
        return {
          y: [0, -4, 0],
          transition: { repeat: Infinity, duration: 3, ease: 'easeInOut' }
        };
    }
  };

  return (
    <motion.button
      onClick={onClick}
      animate={getAnimations()}
      drag={isDraggable}
      dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
      dragElastic={0.2}
      whileTap={{ scale: 0.95 }}
      style={{
        position: 'fixed',
        bottom: position.bottom,
        right: position.right,
        zIndex: 50
      }}
      className="w-14 h-14 bg-gradient-to-br from-[#6C5CE7] to-[#8B7FE8] rounded-full shadow-2xl shadow-[#6C5CE7]/40 flex items-center justify-center cursor-pointer"
    >
      {/* Bot Icon */}
      <Bot size={28} className="text-white" strokeWidth={2.5} />
      
      {/* State indicator */}
      {state === 'listening' && (
        <motion.div
          initial={{ scale: 1, opacity: 0.8 }}
          animate={{ scale: 1.8, opacity: 0 }}
          transition={{ repeat: Infinity, duration: 1.5 }}
          className="absolute inset-0 bg-[#6C5CE7] rounded-full"
        />
      )}
      
      {state === 'celebrating' && (
        <>
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute -top-1 -right-1"
          >
            <Sparkles size={16} className="text-yellow-400 fill-yellow-400" />
          </motion.div>
          {[...Array(8)].map((_, i) => (
            <motion.div
              key={i}
              initial={{ scale: 0, x: 0, y: 0 }}
              animate={{
                scale: [0, 1, 0],
                x: Math.cos((i * Math.PI * 2) / 8) * 30,
                y: Math.sin((i * Math.PI * 2) / 8) * 30,
                opacity: [1, 0]
              }}
              transition={{ duration: 0.8, repeat: Infinity, delay: i * 0.1 }}
              className="absolute w-1 h-1 bg-yellow-400 rounded-full"
            />
          ))}
        </>
      )}
      
      {/* Pulse dot for idle state */}
      {state === 'idle' && (
        <motion.div
          animate={{ scale: [1, 1.2, 1], opacity: [0.8, 1, 0.8] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="absolute -top-0.5 -right-0.5 w-3 h-3 bg-green-400 rounded-full border-2 border-white"
        />
      )}
    </motion.button>
  );
}

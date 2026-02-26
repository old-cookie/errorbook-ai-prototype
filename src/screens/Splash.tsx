import { motion } from 'motion/react';
import { Brain, Sparkles, Bot } from 'lucide-react';
import { useEffect } from 'react';

interface SplashProps {
  onComplete: () => void;
}

export function Splash({ onComplete }: SplashProps) {
  useEffect(() => {
    const timer = setTimeout(onComplete, 3000);
    return () => clearTimeout(timer);
  }, [onComplete]);
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#6C5CE7] via-[#8B7FE8] to-[#A99FEA] flex flex-col items-center justify-center p-8">
      <motion.div
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: 'spring', damping: 15, stiffness: 100 }}
        className="relative"
      >
        <div className="w-24 h-24 bg-white rounded-3xl flex items-center justify-center shadow-2xl">
          <Brain size={48} className="text-[#6C5CE7]" strokeWidth={2.5} />
        </div>
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.3, type: 'spring' }}
          className="absolute -top-2 -right-2"
        >
          <Sparkles size={28} className="text-yellow-300 fill-yellow-300" />
        </motion.div>
      </motion.div>
      
      {/* Eri waving */}
      <motion.div
        initial={{ scale: 0, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        transition={{ delay: 1, type: 'spring', damping: 10 }}
        className="mt-6"
      >
        <motion.div
          animate={{ rotate: [0, 14, -8, 14, -4, 10, 0] }}
          transition={{ delay: 1.3, duration: 1, ease: 'easeInOut' }}
          className="inline-flex items-center justify-center w-16 h-16 bg-white rounded-full shadow-xl"
        >
          <Bot size={32} className="text-[#6C5CE7]" strokeWidth={2.5} />
        </motion.div>
      </motion.div>
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="mt-8 text-center"
      >
        <h1 className="text-4xl font-bold text-white mb-2">ErrorBook AI</h1>
        <p className="text-white/80 text-lg">Let's fix one mistake at a time.</p>
      </motion.div>
      
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="absolute bottom-12"
      >
        <div className="flex gap-2">
          <div className="w-2 h-2 bg-white/50 rounded-full animate-pulse" />
          <div className="w-2 h-2 bg-white/50 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }} />
          <div className="w-2 h-2 bg-white/50 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }} />
        </div>
      </motion.div>
    </div>
  );
}

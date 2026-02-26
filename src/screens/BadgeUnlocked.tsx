import { Button } from '../components/Button';
import { Modal } from '../components/Modal';
import { Share2, X } from 'lucide-react';
import { motion } from 'motion/react';

interface BadgeUnlockedProps {
  isOpen: boolean;
  onClose: () => void;
}

export function BadgeUnlocked({ isOpen, onClose }: BadgeUnlockedProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} showClose={false}>
      <div className="text-center relative">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-0 right-0 p-2 hover:bg-gray-100 rounded-full transition-colors"
        >
          <X size={20} />
        </button>
        
        {/* Confetti effect (simulated with particles) */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              initial={{ y: -20, x: Math.random() * 300 - 150, opacity: 1 }}
              animate={{
                y: 400,
                x: Math.random() * 300 - 150 + (Math.random() - 0.5) * 100,
                opacity: 0,
                rotate: Math.random() * 360
              }}
              transition={{
                duration: 2,
                delay: Math.random() * 0.5,
                ease: 'easeOut'
              }}
              className="absolute left-1/2 w-2 h-2 rounded-full"
              style={{
                backgroundColor: ['#6C5CE7', '#F59E0B', '#10B981', '#EF4444', '#EC4899'][
                  Math.floor(Math.random() * 5)
                ]
              }}
            />
          ))}
        </div>
        
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: 'spring', damping: 10, stiffness: 100 }}
          className="mb-6"
        >
          <div className="inline-flex items-center justify-center w-32 h-32 bg-gradient-to-br from-yellow-400 to-amber-500 rounded-full shadow-2xl">
            <span className="text-7xl">🔥</span>
          </div>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Badge Unlocked!</h2>
          <p className="text-lg font-semibold text-[#6C5CE7] mb-2">7-Day Streak</p>
          <p className="text-gray-600 mb-6">
            You've practiced for 7 days in a row. Keep the momentum going! 🎉
          </p>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="space-y-3"
        >
          <Button
            variant="secondary"
            fullWidth
            icon={<Share2 size={20} />}
          >
            Share Achievement
          </Button>
          
          <Button onClick={onClose} variant="ghost" fullWidth>
            Continue
          </Button>
        </motion.div>
      </div>
    </Modal>
  );
}

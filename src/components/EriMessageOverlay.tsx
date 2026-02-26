import { Modal } from './Modal';
import { Bot } from 'lucide-react';
import { motion } from 'motion/react';

interface EriMessageOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  message: string;
  type?: 'tip' | 'feedback' | 'explanation';
}

export function EriMessageOverlay({ 
  isOpen, 
  onClose, 
  message, 
  type = 'tip' 
}: EriMessageOverlayProps) {
  const titles = {
    tip: '💡 Eri\'s Tip',
    feedback: '💬 Eri says',
    explanation: '🎯 Here\'s why'
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} showClose={false}>
      <div className="text-center">
        {/* Eri Avatar */}
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: 'spring', damping: 15 }}
          className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-[#6C5CE7] to-[#8B7FE8] rounded-full shadow-xl mb-4"
        >
          <Bot size={36} className="text-white" strokeWidth={2.5} />
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h3 className="text-xl font-bold text-gray-900 mb-3">
            {titles[type]}
          </h3>
          <p className="text-gray-700 leading-relaxed mb-6">
            {message}
          </p>
        </motion.div>
        
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          onClick={onClose}
          className="px-6 py-3 bg-[#6C5CE7] text-white rounded-xl font-semibold hover:bg-[#5F4FD1] transition-colors w-full"
        >
          Got it!
        </motion.button>
      </div>
    </Modal>
  );
}

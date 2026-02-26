import { BottomSheet } from './BottomSheet';
import { motion } from 'motion/react';
import { Bot } from 'lucide-react';
import { ReactNode } from 'react';

interface VisualCoachSheetProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
}

export function VisualCoachSheet({ 
  isOpen, 
  onClose, 
  title = "Visual Coach",
  children 
}: VisualCoachSheetProps) {
  return (
    <BottomSheet isOpen={isOpen} onClose={onClose} title="">
      <div className="space-y-4">
        {/* Eri header */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="flex items-center gap-3 pb-4"
        >
          <div className="w-12 h-12 bg-gradient-to-br from-[#6C5CE7] to-[#8B7FE8] rounded-full flex items-center justify-center">
            <Bot size={24} className="text-white" strokeWidth={2.5} />
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-900">{title}</h3>
            <p className="text-sm text-gray-600">Let me show you visually</p>
          </div>
        </motion.div>
        
        {/* Visual content */}
        {children}
      </div>
    </BottomSheet>
  );
}

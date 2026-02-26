import { motion, AnimatePresence } from 'motion/react';
import { CheckCircle2, X, AlertCircle, Info } from 'lucide-react';
import { useEffect } from 'react';

interface ToastProps {
  isOpen: boolean;
  onClose: () => void;
  message: string;
  type?: 'success' | 'error' | 'info';
  duration?: number;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export function Toast({ 
  isOpen, 
  onClose, 
  message, 
  type = 'success', 
  duration = 3000,
  action 
}: ToastProps) {
  useEffect(() => {
    if (isOpen && duration > 0) {
      const timer = setTimeout(onClose, duration);
      return () => clearTimeout(timer);
    }
  }, [isOpen, duration, onClose]);

  const icons = {
    success: CheckCircle2,
    error: X,
    info: Info
  };

  const colors = {
    success: 'bg-green-50 border-green-200 text-green-900',
    error: 'bg-red-50 border-red-200 text-red-900',
    info: 'bg-blue-50 border-blue-200 text-blue-900'
  };

  const Icon = icons[type];

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="fixed top-4 left-4 right-4 z-50 max-w-[358px] mx-auto"
        >
          <div className={`rounded-2xl border-2 shadow-lg p-4 ${colors[type]}`}>
            <div className="flex items-start gap-3">
              <Icon size={20} className="flex-shrink-0 mt-0.5" />
              <p className="flex-1 font-medium">{message}</p>
              {action ? (
                <button
                  onClick={action.onClick}
                  className="text-sm font-semibold underline hover:no-underline flex-shrink-0"
                >
                  {action.label}
                </button>
              ) : (
                <button
                  onClick={onClose}
                  className="p-1 hover:bg-black/5 rounded-lg transition-colors flex-shrink-0"
                >
                  <X size={16} />
                </button>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

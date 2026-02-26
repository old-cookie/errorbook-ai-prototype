import { motion } from 'motion/react';
import { X, CheckCircle2, ArrowRight } from 'lucide-react';
import { ReactNode } from 'react';

interface SplitViewProps {
  yourStep: ReactNode;
  correctStep: ReactNode;
  yourLabel?: string;
  correctLabel?: string;
}

export function SplitView({ 
  yourStep, 
  correctStep,
  yourLabel = "Your step",
  correctLabel = "Correct step"
}: SplitViewProps) {
  return (
    <div className="space-y-4">
      {/* Your step (incorrect) */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="relative"
      >
        <div className="bg-red-50 border-2 border-red-200 rounded-2xl p-4">
          <div className="flex items-center gap-2 mb-3">
            <div className="p-1.5 bg-red-100 rounded-lg">
              <X size={16} className="text-red-600" strokeWidth={3} />
            </div>
            <span className="text-sm font-bold text-red-900">{yourLabel}</span>
          </div>
          <div className="text-center">
            {yourStep}
          </div>
        </div>
      </motion.div>

      {/* Arrow indicator */}
      <motion.div
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2 }}
        className="flex justify-center"
      >
        <div className="p-3 bg-gray-100 rounded-full">
          <ArrowRight size={24} className="text-gray-600" strokeWidth={3} />
        </div>
      </motion.div>

      {/* Correct step */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.3 }}
        className="relative"
      >
        <div className="bg-green-50 border-2 border-green-200 rounded-2xl p-4">
          <div className="flex items-center gap-2 mb-3">
            <div className="p-1.5 bg-green-100 rounded-lg">
              <CheckCircle2 size={16} className="text-green-600" strokeWidth={3} />
            </div>
            <span className="text-sm font-bold text-green-900">{correctLabel}</span>
          </div>
          <div className="text-center">
            {correctStep}
          </div>
        </div>
      </motion.div>
    </div>
  );
}

import { Card } from './Card';
import { motion } from 'motion/react';
import { ReactNode } from 'react';

interface StepCardProps {
  step?: number;
  stepNumber?: number;
  title: string;
  icon?: ReactNode;
  diagram?: ReactNode;
  children?: ReactNode;
  delay?: number;
}

export function StepCard({ step, stepNumber, title, icon, diagram, children, delay = 0 }: StepCardProps) {
  const displayNumber = step || stepNumber;
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
    >
      <Card padding="md" className="border-2 border-[#6C5CE7]/20">
        <div className="flex items-start gap-3">
          {/* Step number badge or icon */}
          <div className="flex-shrink-0 w-10 h-10 bg-white border-2 border-[#6C5CE7]/20 rounded-full flex items-center justify-center">
            {icon || <span className="text-[#6C5CE7] text-lg font-bold">{displayNumber}</span>}
          </div>
          
          <div className="flex-1">
            {/* Title */}
            <p className="font-bold text-gray-900 mb-3">{title}</p>
            
            {/* Diagram area or children */}
            {(diagram || children) && (
              <div className={diagram ? "bg-gradient-to-br from-gray-50 to-white border-2 border-gray-200 rounded-xl p-4" : ""}>
                {diagram || children}
              </div>
            )}
          </div>
        </div>
      </Card>
    </motion.div>
  );
}

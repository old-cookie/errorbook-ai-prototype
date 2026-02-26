import { ChevronLeft, Brain, Languages } from 'lucide-react';
import { motion } from 'motion/react';
import { Button } from '../components/Button';
import { Card } from '../components/Card';

interface MissionChoiceProps {
  onNavigate: (screen: string, data?: any) => void;
  onBack: () => void;
}

export function MissionChoice({ onNavigate, onBack }: MissionChoiceProps) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white pb-24">
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="p-2 hover:bg-gray-100 rounded-xl transition-colors -ml-2"
          >
            <ChevronLeft size={24} className="text-gray-700" />
          </button>
          <h1 className="text-2xl font-bold text-gray-900">Start Mission</h1>
        </div>
      </div>

      <div className="px-6 py-8 space-y-4">
        <motion.p
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-sm text-gray-600"
        >
          Choose your mission type
        </motion.p>

        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
          <Card padding="lg" className="border-[#6C5CE7]/20 bg-[#6C5CE7]/5">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center border border-[#6C5CE7]/20">
                <Brain size={20} className="text-[#6C5CE7]" />
              </div>
              <div className="flex-1">
                <p className="text-base font-bold text-gray-900">Math Mission</p>
                <p className="text-sm text-gray-600 mt-1">Practice problem-solving with instant feedback.</p>
              </div>
            </div>
            <div className="mt-4">
              <Button onClick={() => onNavigate('practice')} fullWidth>
                Start Math
              </Button>
            </div>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.08 }}>
          <Card padding="lg" className="border-[#6C5CE7]/20 bg-[#6C5CE7]/5">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center border border-[#6C5CE7]/20">
                <Languages size={20} className="text-[#6C5CE7]" />
              </div>
              <div className="flex-1">
                <p className="text-base font-bold text-gray-900">English Mission</p>
                <p className="text-sm text-gray-600 mt-1">Run Write, Speak, and Listening demo tasks with Eri.</p>
              </div>
            </div>
            <div className="mt-4">
              <Button onClick={() => onNavigate('english-mission')} fullWidth>
                Start English
              </Button>
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}

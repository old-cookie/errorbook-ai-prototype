import { BottomSheet } from './BottomSheet';
import { Card } from './Card';
import { Sparkles, Target, Lightbulb, MessageCircle } from 'lucide-react';
import { motion } from 'motion/react';

interface AICoachSheetProps {
  isOpen: boolean;
  onClose: () => void;
  onAction: (action: string) => void;
  context?: 'home' | 'mistake' | 'practice' | 'progress';
}

export function AICoachSheet({ isOpen, onClose, onAction, context = 'home' }: AICoachSheetProps) {
  const actions = [
    {
      id: 'diagnose',
      icon: Sparkles,
      label: 'Diagnose this',
      description: 'Analyze what went wrong',
      color: 'purple',
      available: ['mistake', 'home']
    },
    {
      id: 'plan',
      icon: Target,
      label: 'Give me a 10-min plan',
      description: 'Quick focused practice',
      color: 'blue',
      available: ['home', 'progress']
    },
    {
      id: 'explain',
      icon: Lightbulb,
      label: 'Explain my mistake',
      description: 'Break down the concept',
      color: 'yellow',
      available: ['mistake', 'practice']
    },
    {
      id: 'motivate',
      icon: MessageCircle,
      label: 'Motivate me',
      description: 'Get encouragement',
      color: 'green',
      available: ['home', 'practice', 'progress']
    }
  ];

  const colorClasses = {
    purple: 'bg-purple-50 text-purple-700 border-purple-200',
    blue: 'bg-blue-50 text-blue-700 border-blue-200',
    yellow: 'bg-yellow-50 text-yellow-700 border-yellow-200',
    green: 'bg-green-50 text-green-700 border-green-200'
  };

  const filteredActions = actions.filter(action =>
    action.available.includes(context)
  );

  return (
    <BottomSheet isOpen={isOpen} onClose={onClose} title="Hi, I'm Eri! 👋">
      <div className="space-y-3 mb-4">
        <p className="text-gray-700">How can I help you today?</p>

        <div className="space-y-3">
          {filteredActions.map((action, index) => {
            const Icon = action.icon;
            return (
              <motion.div
                key={action.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card
                  onClick={() => {
                    onAction(action.id);
                    onClose();
                  }}
                  padding="md"
                  className="border-2"
                >
                  <div className="flex items-center gap-3">
                    <div className={`p-3 rounded-xl ${colorClasses[action.color as keyof typeof colorClasses]}`}>
                      <Icon size={24} />
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-gray-900">{action.label}</p>
                      <p className="text-sm text-gray-600">{action.description}</p>
                    </div>
                  </div>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </div>
    </BottomSheet>
  );
}

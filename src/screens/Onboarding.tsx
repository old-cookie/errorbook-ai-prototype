import { useState } from 'react';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { BookOpen, Target, Calendar, ChevronRight, Bot } from 'lucide-react';
import { motion } from 'motion/react';

interface OnboardingProps {
  onComplete: () => void;
}

export function Onboarding({ onComplete }: OnboardingProps) {
  const [selectedSubject, setSelectedSubject] = useState('Math');
  const [selectedGoal, setSelectedGoal] = useState('Improve weak topics');
  const [examDate, setExamDate] = useState('2026-06-15');
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white p-6 pt-16">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-[390px] mx-auto"
      >
        {/* Eri Introduction */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', damping: 10, delay: 0.3 }}
          className="flex items-center gap-3 mb-6 p-4 bg-gradient-to-r from-[#6C5CE7]/10 to-purple-50 rounded-2xl border-2 border-[#6C5CE7]/20"
        >
          <div className="w-12 h-12 bg-gradient-to-br from-[#6C5CE7] to-[#8B7FE8] rounded-full flex items-center justify-center flex-shrink-0">
            <Bot size={24} className="text-white" strokeWidth={2.5} />
          </div>
          <div className="flex-1">
            <p className="text-sm font-semibold text-gray-900 mb-1">Meet Eri, your AI coach! 🎯</p>
            <p className="text-xs text-gray-600">I'll help you master mistakes in 10-minute missions.</p>
          </div>
        </motion.div>
        
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome! 👋</h1>
        <p className="text-gray-600 mb-8">Let's personalize your revision journey.</p>
        
        {/* Subject Selection */}
        <div className="mb-8">
          <label className="flex items-center gap-2 text-gray-700 font-semibold mb-3">
            <BookOpen size={20} className="text-[#6C5CE7]" />
            Choose your subject
          </label>
          <div className="grid grid-cols-2 gap-3">
            {['Math', 'English'].map((subject) => (
              <Card
                key={subject}
                onClick={() => setSelectedSubject(subject)}
                padding="md"
                className={`text-center ${
                  selectedSubject === subject
                    ? 'border-[#6C5CE7] bg-[#6C5CE7]/5 border-2'
                    : 'border-gray-200'
                }`}
              >
                <div className="font-semibold text-gray-900">{subject}</div>
              </Card>
            ))}
          </div>
        </div>
        
        {/* Goal Selection */}
        <div className="mb-8">
          <label className="flex items-center gap-2 text-gray-700 font-semibold mb-3">
            <Target size={20} className="text-[#6C5CE7]" />
            What's your goal?
          </label>
          <div className="space-y-3">
            {['Improve weak topics', 'Build exam confidence', 'Track my progress'].map((goal) => (
              <Card
                key={goal}
                onClick={() => setSelectedGoal(goal)}
                padding="md"
                className={`${
                  selectedGoal === goal
                    ? 'border-[#6C5CE7] bg-[#6C5CE7]/5 border-2'
                    : 'border-gray-200'
                }`}
              >
                <div className="font-medium text-gray-900">{goal}</div>
              </Card>
            ))}
          </div>
        </div>
        
        {/* Exam Date */}
        <div className="mb-12">
          <label className="flex items-center gap-2 text-gray-700 font-semibold mb-3">
            <Calendar size={20} className="text-[#6C5CE7]" />
            Exam date (optional)
          </label>
          <input
            type="date"
            value={examDate}
            onChange={(e) => setExamDate(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-[#6C5CE7] focus:outline-none text-gray-900"
          />
        </div>
        
        <Button
          onClick={onComplete}
          size="lg"
          fullWidth
          icon={<ChevronRight size={20} />}
        >
          Get Started
        </Button>
      </motion.div>
    </div>
  );
}

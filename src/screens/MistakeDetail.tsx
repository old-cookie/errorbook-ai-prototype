import { useState } from 'react';
import { Button } from '../components/Button';
import { Chip } from '../components/Chip';
import { Card } from '../components/Card';
import { BottomSheet } from '../components/BottomSheet';
import { EriBubble } from '../components/EriBubble';
import { VisualCoachSheet } from '../components/VisualCoachSheet';
import { SplitView } from '../components/SplitView';
import { StepCard } from '../components/StepCard';
import { ChevronLeft, Sparkles, Edit3, PlayCircle, X, CheckCircle2, Eye } from 'lucide-react';
import { errorTypes } from '../data/mistakeData';
import { motion } from 'motion/react';

interface MistakeDetailProps {
  mistake: any;
  onNavigate: (screen: string) => void;
  onBack: () => void;
  onEriClick: () => void;
}

export function MistakeDetail({ mistake, onNavigate, onBack, onEriClick }: MistakeDetailProps) {
  const [showErrorTypeSheet, setShowErrorTypeSheet] = useState(false);
  const [selectedErrorType, setSelectedErrorType] = useState(mistake.errorType);
  const [showVisualCoach, setShowVisualCoach] = useState(false);

  const handleSelectErrorType = (type: string) => {
    setSelectedErrorType(type);
    setShowErrorTypeSheet(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white pb-24">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="p-2 hover:bg-gray-100 rounded-xl transition-colors -ml-2"
          >
            <ChevronLeft size={24} className="text-gray-700" />
          </button>
          <h1 className="text-2xl font-bold text-gray-900">Mistake Card</h1>
        </div>
      </div>

      <div className="px-6 py-6 space-y-6">
        {/* Question Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card padding="lg" className="bg-white">
            <div className="flex items-start justify-between mb-4">
              <Chip variant="default">{mistake.topic}</Chip>
              <span className="text-sm text-gray-500">{mistake.exam}</span>
            </div>

            <h2 className="font-bold text-gray-900 mb-4 text-lg">{mistake.question}</h2>

            <div className="space-y-3">
              <div className="flex gap-3">
                <div className="p-2 bg-red-50 rounded-lg flex-shrink-0">
                  <X size={18} className="text-red-500" />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-gray-600 mb-1">Your answer</p>
                  <p className="font-medium text-gray-900">{mistake.myAnswer}</p>
                </div>
              </div>

              <div className="flex gap-3">
                <div className="p-2 bg-green-50 rounded-lg flex-shrink-0">
                  <CheckCircle2 size={18} className="text-green-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-gray-600 mb-1">Correct answer</p>
                  <p className="font-medium text-gray-900">{mistake.correctAnswer}</p>
                </div>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* AI Diagnosis */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="flex items-center gap-2 mb-3">
            <Sparkles size={20} className="text-[#6C5CE7]" />
            <h3 className="text-lg font-bold text-gray-900">AI Diagnosis</h3>
          </div>

          <Card padding="lg" className="bg-gradient-to-br from-[#6C5CE7]/5 to-purple-50 border-[#6C5CE7]/20">
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-600 mb-2">Error type:</p>
                <div className="flex items-center gap-2">
                  <Chip variant="selected">{selectedErrorType}</Chip>
                  <button
                    onClick={() => setShowErrorTypeSheet(true)}
                    className="p-1.5 hover:bg-white/50 rounded-lg transition-colors"
                  >
                    <Edit3 size={16} className="text-[#6C5CE7]" />
                  </button>
                </div>
              </div>

              <div>
                <p className="text-sm font-semibold text-gray-900">{mistake.explanation}</p>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="space-y-3"
        >
          <Button
            onClick={() => setShowVisualCoach(true)}
            size="lg"
            fullWidth
            icon={<Eye size={20} />}
            variant="secondary"
          >
            Show Visual Explanation
          </Button>

          <Button
            onClick={() => onNavigate('practice')}
            size="lg"
            fullWidth
            icon={<PlayCircle size={20} />}
          >
            Start Targeted Practice
          </Button>

          <div className="text-center">
            <p className="text-sm text-gray-600">Next review: {mistake.dueDate}</p>
          </div>
        </motion.div>
      </div>

      {/* Eri Bubble */}
      <EriBubble state="idle" onClick={onEriClick} />

      {/* Error Type Bottom Sheet */}
      <BottomSheet
        isOpen={showErrorTypeSheet}
        onClose={() => setShowErrorTypeSheet(false)}
        title="Edit Error Type"
      >
        <div className="space-y-3">
          {errorTypes.map((type) => (
            <Card
              key={type}
              onClick={() => handleSelectErrorType(type)}
              padding="md"
              className={`${selectedErrorType === type
                  ? 'border-[#6C5CE7] bg-[#6C5CE7]/5 border-2'
                  : 'border-gray-200'
                }`}
            >
              <p className="font-medium text-gray-900">{type}</p>
            </Card>
          ))}
        </div>
      </BottomSheet>

      {/* Visual Coach Sheet */}
      <VisualCoachSheet
        isOpen={showVisualCoach}
        onClose={() => setShowVisualCoach(false)}
        title={mistake.topic}
      >
        <div className="space-y-6">
          {/* Split View */}
          <SplitView
            yourStep={
              <div className="space-y-2">
                <p className="text-sm text-gray-600">Your response</p>
                <p className="text-sm font-semibold text-red-900">{mistake.myAnswer}</p>
              </div>
            }
            correctStep={
              <div className="space-y-2">
                <p className="text-sm text-gray-600">Target answer</p>
                <p className="text-sm font-semibold text-green-900">{mistake.correctAnswer}</p>
              </div>
            }
          />

          {/* Step Cards */}
          <div className="space-y-3">
            <StepCard
              stepNumber={1}
              title="Read key quantities"
              diagram={
                <div className="space-y-2">
                  <p className="text-center text-sm text-gray-700">Identify what is fixed, what varies, and what the question asks for.</p>
                </div>
              }
              delay={0.2}
            />

            <StepCard
              stepNumber={2}
              title="Set up the method"
              diagram={
                <div className="space-y-3">
                  <div className="text-center">
                    <p className="text-sm text-gray-700">Write each step clearly before calculating.</p>
                  </div>
                </div>
              }
              delay={0.3}
            />

            <StepCard
              stepNumber={3}
              title="Check and compare"
              diagram={
                <div className="text-center space-y-2">
                  <p className="text-sm text-gray-700">Compare your final expression with the expected format and value.</p>
                  <p className="text-sm font-semibold text-[#6C5CE7]">Then retry a similar problem.</p>
                </div>
              }
              delay={0.4}
            />
          </div>
        </div>
      </VisualCoachSheet>
    </div>
  );
}
